/* treatments.js: print-and-ink treatments for the images and drawings on a page.
 *
 * The top layer of the two-layer model in METHOD.md. Each treatment is derived from the
 * physical process that made the look (METHOD.md step 2c), with the maths written out in
 * processes/ (each treatment's theory is in the process page it models). The approach is learned from Lumenary
 * (lumenary-studio.vercel.app, Mursal Furqan Kumbhar); the code here is written from
 * scratch.
 *
 * A classic script, no build step, so it also works from file://.
 *   Treatments.treatAll('svg[role=img]', { treatment: 'press', spot: '#3f6e96' })
 *   Treatments.apply(imageData, 'halftone', { ink: '#1a1a1a' })   // -> new ImageData
 */
(function (global) {
  'use strict';

  // ---------- foundations (processes/foundations.md) ----------

  function clamp(x, a, b) {
    if (a === undefined) { a = 0; b = 1; }
    return x < a ? a : x > b ? b : x;
  }
  function clampi(x, a, b) { return x < a ? a : x > b ? b : x; }
  function smoothstep(e0, e1, x) {
    var u = clamp((x - e0) / (e1 - e0));
    return u * u * (3 - 2 * u);
  }

  // Seeded generator (mulberry32, public domain): same seed, same sequence.
  function mulberry32(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // A number in [0, 1) tied to a pixel position, for grain that stays put.
  function hash2(x, y, seed) {
    var h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) +
             Math.imul(seed | 0, 1442695041)) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  }

  // Smooth, cloud-like variation: lattice hashes blended with a smoothstep curve.
  function valueNoise(x, y, seed) {
    var xi = Math.floor(x), yi = Math.floor(y);
    var xf = x - xi, yf = y - yi;
    var u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    var a = hash2(xi, yi, seed), b = hash2(xi + 1, yi, seed);
    var c = hash2(xi, yi + 1, seed), d = hash2(xi + 1, yi + 1, seed);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }

  function luminance(r, g, b) { return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; }

  // Box blur with a running sum, rows then columns, so cost doesn't grow with radius.
  function boxBlur(src, w, h, r) {
    r = Math.max(0, Math.round(r));
    if (r === 0) return Float32Array.from(src);
    var tmp = new Float32Array(w * h), out = new Float32Array(w * h), n = 2 * r + 1;
    var x, y, i, acc;
    for (y = 0; y < h; y++) {
      var row = y * w;
      acc = 0;
      for (i = -r; i <= r; i++) acc += src[row + clampi(i, 0, w - 1)];
      for (x = 0; x < w; x++) {
        tmp[row + x] = acc / n;
        acc += src[row + clampi(x + r + 1, 0, w - 1)] - src[row + clampi(x - r, 0, w - 1)];
      }
    }
    for (x = 0; x < w; x++) {
      acc = 0;
      for (i = -r; i <= r; i++) acc += tmp[clampi(i, 0, h - 1) * w + x];
      for (y = 0; y < h; y++) {
        out[y * w + x] = acc / n;
        acc += tmp[clampi(y + r + 1, 0, h - 1) * w + x] - tmp[clampi(y - r, 0, h - 1) * w + x];
      }
    }
    return out;
  }

  // Largest value within r pixels (square window), rows then columns.
  function dilate(src, w, h, r) {
    r = Math.max(0, Math.round(r));
    if (r === 0) return Float32Array.from(src);
    var tmp = new Float32Array(w * h), out = new Float32Array(w * h), x, y, i, m;
    for (y = 0; y < h; y++) {
      for (x = 0; x < w; x++) {
        m = 0;
        for (i = -r; i <= r; i++) m = Math.max(m, src[y * w + clampi(x + i, 0, w - 1)]);
        tmp[y * w + x] = m;
      }
    }
    for (y = 0; y < h; y++) {
      for (x = 0; x < w; x++) {
        m = 0;
        for (i = -r; i <= r; i++) m = Math.max(m, tmp[clampi(y + i, 0, h - 1) * w + x]);
        out[y * w + x] = m;
      }
    }
    return out;
  }

  // Edge strength from the Sobel operator, scaled to roughly 0..1.
  function sobel(L, w, h) {
    var out = new Float32Array(w * h);
    for (var y = 0; y < h; y++) {
      var ym = clampi(y - 1, 0, h - 1) * w, y0 = y * w, yp = clampi(y + 1, 0, h - 1) * w;
      for (var x = 0; x < w; x++) {
        var xm = clampi(x - 1, 0, w - 1), xp = clampi(x + 1, 0, w - 1);
        var gx = -L[ym + xm] + L[ym + xp] - 2 * L[y0 + xm] + 2 * L[y0 + xp] - L[yp + xm] + L[yp + xp];
        var gy = -L[ym + xm] - 2 * L[ym + x] - L[ym + xp] + L[yp + xm] + 2 * L[yp + x] + L[yp + xp];
        out[y0 + x] = Math.min(1, Math.sqrt(gx * gx + gy * gy) / 4);
      }
    }
    return out;
  }

  // Bilinear read of a field at a non-integer position, clamped at the borders.
  function sample(f, w, h, x, y) {
    x = clamp(x, 0, w - 1); y = clamp(y, 0, h - 1);
    var x0 = Math.floor(x), y0 = Math.floor(y);
    var x1 = Math.min(x0 + 1, w - 1), y1 = Math.min(y0 + 1, h - 1);
    var s = x - x0, t = y - y0;
    var a = f[y0 * w + x0], b = f[y0 * w + x1], c = f[y1 * w + x0], d = f[y1 * w + x1];
    return a + (b - a) * s + (c - a) * t + (a - b - c + d) * s * t;
  }

  // Contrast around mid-grey; c in -1..1, 0 leaves it unchanged.
  function contrast(L, c) {
    var f = Math.tan((c + 1) * Math.PI / 4);
    return clamp((L - 0.5) * f + 0.5);
  }

  function hexToRgb01(hex) {
    var h = String(hex).replace('#', '');
    if (h.length === 3) h = h.replace(/(.)/g, '$1$1');
    var n = parseInt(h, 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }

  // ---------- the press: one ink plate (processes/letterpress.md) ----------
  // Turns an intended coverage field into ink actually laid down, with the press's
  // imperfections: ink spread (dot gain), wobbly plate edges, misregistration, a dot
  // screen for tints, grain at the threshold, and ink starvation in solids.
  function printPlate(cov, w, h, o) {
    var u = o.unit, out = new Float32Array(w * h);
    // Dot gain: ink spreads past the edge it was meant to stop at, so lines thicken.
    var spread = Math.round(o.spread * u);
    var c = cov;
    if (spread > 0) {
      var b = boxBlur(boxBlur(cov, w, h, spread), w, h, spread);
      c = new Float32Array(w * h);
      // How much a stroke grows scales with the spread dial (1.78 at the default 0.6).
      var gain = 1 + 1.3 * Math.min(1, o.spread);
      for (var i = 0; i < w * h; i++) c[i] = Math.min(1, Math.max(cov[i], gain * b[i]));
    }
    // Tints are screened as dots; line art and solids are not.
    var near = dilate(cov, w, h, 2 * u);
    var cosA = Math.cos(o.angle), sinA = Math.sin(o.angle), s = o.screen * u;
    var amp = o.wobble * u, lam = o.wobbleScale * u, seed = o.seed;
    var offx = o.offset[0] * u, offy = o.offset[1] * u;
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var dx = (valueNoise(x / lam, y / lam, seed + 11) - 0.5) * 2 * amp;
        var dy = (valueNoise(x / lam, y / lam, seed + 23) - 0.5) * 2 * amp;
        var cv = sample(c, w, h, x + dx - offx, y + dy - offy);
        if (cv <= 0.003) continue;
        var tint = smoothstep(0.9, 0.7, sample(near, w, h, x - offx, y - offy));
        var su = (x * cosA + y * sinA) / s, sv = (-x * sinA + y * cosA) / s;
        var fu = su - Math.round(su), fv = sv - Math.round(sv);
        // A dot of area cv·s² has radius s·√(cv/π): ink where π(d/s)² < cv.
        var tau = Math.min(0.97, Math.PI * (fu * fu + fv * fv));
        var r = hash2(x, y, seed), n = valueNoise(x / (1.3 * u), y / (1.3 * u), seed + 5);
        // Grain mostly roughens edges and solids; a screened tint gets only a little.
        var theta = 0.5 + (tau - 0.5) * tint + (0.55 * r + 0.45 * n - 0.5) * o.grain * (1 - 0.7 * tint);
        theta += o.starve * 0.65 * smoothstep(0.68, 0.95, valueNoise(x / (2.5 * u), y / (2.5 * u), seed + 9));
        out[y * w + x] = smoothstep(theta - 0.06, theta + 0.06, cv);
      }
    }
    return out;
  }

  // Paper isn't perfectly even: faint streaky fibre, mostly along one direction.
  function paperFibre(x, y, u, amt, seed) {
    return 1 - amt * 0.07 * valueNoise(x / (1.5 * u), y / (10 * u), seed + 31);
  }

  // ---------- treatments ----------

  var DEFAULTS = {
    press: { ink: '#1a1a1a', spot: '#3f6e96', paper: '#ffffff', misregister: 1.2,
             spread: 0.6, wobble: 0.9, wobbleScale: 5, grain: 0.35, starve: 0.25,
             fibre: 0.25, screen: 3.2, seed: 7 },
    halftone: { ink: '#1a1a1a', paper: '#ffffff', screen: 5, angle: 45, contrast: 0.15,
                spread: 0.4, wobble: 0.4, wobbleScale: 6, grain: 0.2, starve: 0.1,
                fibre: 0.25, seed: 7 },
    riso: { ink: '#1a1a1a', spot: '#3f6e96', paper: '#ffffff', grain: 60, miss: 40, density: 90,
            seed: 1 },
    hatch: { ink: '#1a1a1a', paper: '#ffffff', spacing: 4, contrast: 0.2, outline: 0.35,
             wobble: 0.8, wobbleScale: 14, fibre: 0.25, seed: 7 }
  };

  function opts(name, o) {
    var d = DEFAULTS[name], r = {}, k;
    for (k in d) r[k] = d[k];
    for (k in (o || {})) if (o[k] !== undefined && o[k] !== null && o[k] !== '') r[k] = o[k];
    r.unit = r.unit || 1;
    return r;
  }

  // Split a two-ink picture into black (key) and spot coverage per pixel.
  function separate(px, N, K, S, P) {
    var eps = 0.02, dK = [], dS = [], c;
    for (c = 0; c < 3; c++) {
      dK[c] = -Math.log(Math.max(K[c], eps));
      dS[c] = -Math.log(Math.max(S[c], eps));
    }
    // Stacked transparent inks add their optical densities, D = k·dK + s·dS.
    // Least squares over R, G, B gives k and s for each pixel.
    var a = 0, bb = 0, cc = 0;
    for (c = 0; c < 3; c++) { a += dK[c] * dK[c]; bb += dK[c] * dS[c]; cc += dS[c] * dS[c]; }
    var det = a * cc - bb * bb;
    var kf = new Float32Array(N), sf = new Float32Array(N);
    for (var i = 0; i < N; i++) {
      var p = 0, q = 0;
      for (c = 0; c < 3; c++) {
        var D = -Math.log(Math.max(px[i * 4 + c] / 255 / Math.max(P[c], eps), eps));
        p += dK[c] * D; q += dS[c] * D;
      }
      var k = (cc * p - bb * q) / det, s = (a * q - bb * p) / det;
      if (k < 0) { k = 0; s = q / cc; }
      if (s < 0) { s = 0; k = p / a; }
      // Below a few percent, a plate isn't meant to print at all: a light tint is pure
      // spot ink, not spot plus a trace of black.
      kf[i] = k < 0.08 ? 0 : clamp(k); sf[i] = s < 0.03 ? 0 : clamp(s);
    }
    return [kf, sf];
  }

  // Two-colour letterpress for vector art: split the picture into a key (black) plate and
  // a spot plate, then print each with the press's imperfections.
  function press(img, o) {
    o = opts('press', o);
    var w = img.width, h = img.height, px = img.data, N = w * h;
    var K = hexToRgb01(o.ink), S = hexToRgb01(o.spot), P = hexToRgb01(o.paper);
    var sep = separate(px, N, K, S, P), kf = sep[0], sf = sep[1];
    var base = { unit: o.unit, spread: o.spread, wobble: o.wobble, wobbleScale: o.wobbleScale,
                 grain: o.grain, starve: o.starve, screen: o.screen };
    var plateK = printPlate(kf, w, h, Object.assign({}, base, { angle: Math.PI / 4, offset: [0, 0], seed: o.seed }));
    var plateS = printPlate(sf, w, h, Object.assign({}, base, {
      angle: Math.PI / 12, offset: [o.misregister, o.misregister * 0.6], seed: o.seed + 101 }));
    return composite([plateK, plateS], [K, S], P, w, h, o);
  }

  // Two-ink risograph for vector art. Plates come from the same colour separation as press(); the ink is laid with
  // the risograph model from Lumenary (Mursal Furqan Kumbhar, vendor/lumenary/src/engine/styles/risograph.js):
  // a grain threshold mixing white and smooth noise, broad patches of thicker and thinner ink, the second plate
  // shifted (7, -4.5) px per 800 px of width at full misregistration, and a faint paper fibre. Constants are his.
  function riso(img, o) {
    o = opts('riso', o);
    var w = img.width, h = img.height, px = img.data, N = w * h;
    var K = hexToRgb01(o.ink), S = hexToRgb01(o.spot), P = hexToRgb01(o.paper);
    var sep = separate(px, N, K, S, P), kf = sep[0], sf = sep[1];
    var sc = w / 800, seed = o.seed * 7 + 1;
    var G = 0.25 + (o.grain / 100) * 1.3, dens = o.density / 100;
    var mx = (o.miss / 100) * 7 * sc, my = (o.miss / 100) * -4.5 * sc;
    var out = new ImageData(w, h), d = out.data;
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var i = y * w + x, q = i * 4;
        var x2 = clampi(Math.round(x + mx), 0, w - 1), y2 = clampi(Math.round(y + my), 0, h - 1);
        // His plate curves: the key plate carries shadows (^1.35), the spot plate almost everything (0.92·^0.75).
        var a1 = Math.pow(kf[i], 1.35), a2 = 0.92 * Math.pow(sf[y2 * w + x2], 0.75);
        var th1 = 0.5 + (0.55 * hash2(x, y, seed) + 0.45 * valueNoise(x * 0.7 / sc, y * 0.7 / sc, seed + 1) - 0.5) * G;
        var th2 = 0.5 + (0.55 * hash2(x, y, seed + 9) + 0.45 * valueNoise(x * 0.7 / sc + 40, y * 0.7 / sc, seed + 2) - 0.5) * G;
        var pat = 0.9 + 0.1 * valueNoise(x * 0.01 / sc, y * 0.01 / sc, seed + 3) + (hash2(x, y, 4) - 0.5) * 0.06;
        var c1 = Math.min(1, smoothstep(th1 - 0.09, th1 + 0.09, a1) * dens * pat);
        var c2 = Math.min(1, smoothstep(th2 - 0.09, th2 + 0.09, a2) * dens * pat);
        var fibre = 1 + (hash2(x >> 1, y, 8) - 0.5) * 0.05;
        for (var c = 0; c < 3; c++) {
          d[q + c] = Math.round(clamp(P[c] * (1 - c1 * (1 - K[c])) * (1 - c2 * (1 - S[c])) * fibre) * 255);
        }
        d[q + 3] = 255;
      }
    }
    return out;
  }

  // Single-ink halftone for photographs: tone becomes dot size on a rotated lattice.
  function halftone(img, o) {
    o = opts('halftone', o);
    var w = img.width, h = img.height, px = img.data, N = w * h;
    var cov = new Float32Array(N);
    for (var i = 0; i < N; i++) {
      cov[i] = 1 - contrast(luminance(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]), o.contrast);
    }
    // Every tone is screened here, so the "near solid ink" test is switched off.
    var plate = printPlateScreened(cov, w, h, {
      unit: o.unit, spread: o.spread, wobble: o.wobble, wobbleScale: o.wobbleScale,
      grain: o.grain, starve: o.starve, screen: o.screen,
      angle: o.angle * Math.PI / 180, offset: [0, 0], seed: o.seed });
    return composite([plate], [hexToRgb01(o.ink)], hexToRgb01(o.paper), w, h, o);
  }

  function printPlateScreened(cov, w, h, o) {
    var u = o.unit, out = new Float32Array(w * h);
    var cosA = Math.cos(o.angle), sinA = Math.sin(o.angle), s = o.screen * u;
    var amp = o.wobble * u, lam = o.wobbleScale * u;
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var dx = (valueNoise(x / lam, y / lam, o.seed + 11) - 0.5) * 2 * amp;
        var dy = (valueNoise(x / lam, y / lam, o.seed + 23) - 0.5) * 2 * amp;
        // Read tone at the dot's centre, so each dot has one size.
        var su = (x * cosA + y * sinA) / s, sv = (-x * sinA + y * cosA) / s;
        var ru = Math.round(su), rv = Math.round(sv), fu = su - ru, fv = sv - rv;
        var cxp = (ru * cosA - rv * sinA) * s, cyp = (ru * sinA + rv * cosA) * s;
        var cv = sample(cov, w, h, cxp, cyp);
        cv = Math.min(1, cv * (1 + 0.35 * o.spread));
        var d2 = fu * fu + fv * fv;
        var dd = Math.sqrt(d2) * s + (valueNoise((x + dx) / lam, (y + dy) / lam, o.seed + 3) - 0.5) * amp;
        var rr = s * Math.sqrt(cv / Math.PI);
        var grainy = (hash2(x, y, o.seed) - 0.5) * o.grain * 0.8 * u;
        var ink = smoothstep(rr + 0.7 * u + grainy, rr - 0.7 * u + grainy, dd);
        ink *= 1 - o.starve * smoothstep(0.7, 0.95, valueNoise(x / (2.5 * u), y / (2.5 * u), o.seed + 9));
        out[y * w + x] = ink;
      }
    }
    return out;
  }

  // Pen-and-ink hatching for photographs: darker tones get more directions of lines,
  // each line wobbling and changing pressure along its length, plus an ink outline.
  function hatch(img, o) {
    o = opts('hatch', o);
    var w = img.width, h = img.height, px = img.data, N = w * h, u = o.unit;
    var L = new Float32Array(N);
    for (var i = 0; i < N; i++) L[i] = luminance(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]);
    var Ls = boxBlur(L, w, h, 1.5 * u);
    var edges = sobel(boxBlur(Ls, w, h, u), w, h);
    var levels = [0.22, 0.42, 0.62, 0.8];
    var angles = [45, -45, 8, 98].map(function (d) { return d * Math.PI / 180; });
    var p = o.spacing * u, amp = o.wobble * u, lam = o.wobbleScale * u;
    var out = new Float32Array(N);
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var t = 1 - contrast(Ls[y * w + x], o.contrast);
        var paper = 1;
        for (var k = 0; k < 4; k++) {
          if (t < levels[k] - 0.04) break;
          var ca = Math.cos(angles[k]), sa = Math.sin(angles[k]);
          var across = x * ca + y * sa, along = -x * sa + y * ca;
          var wob = (valueNoise(along / lam, across / (p * 3), o.seed + k * 17) - 0.5) * 2 * amp;
          var q = (across + wob) / p;
          var dist = Math.abs(q - Math.round(q)) * p;
          var pressure = 0.55 + 0.45 * valueNoise(along / (3 * lam), Math.round(q), o.seed + 40 + k);
          var hw = p * (0.1 + 0.22 * clamp((t - levels[k]) / (1 - levels[k]))) * pressure;
          var ink = smoothstep(hw + 0.6 * u, hw - 0.6 * u, dist) * smoothstep(levels[k] - 0.04, levels[k] + 0.06, t);
          paper *= 1 - ink;
        }
        var e = sample(edges, w, h, x + (valueNoise(x / lam, y / lam, o.seed + 61) - 0.5) * amp,
                       y + (valueNoise(x / lam, y / lam, o.seed + 67) - 0.5) * amp);
        paper *= 1 - smoothstep(o.outline, o.outline + 0.12, e);
        out[y * w + x] = 1 - paper;
      }
    }
    return composite([out], [hexToRgb01(o.ink)], hexToRgb01(o.paper), w, h, o);
  }

  // Inks over paper multiply, like real transparent printing inks.
  function composite(plates, inks, P, w, h, o) {
    var out = new ImageData(w, h), d = out.data, u = o.unit;
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var i = y * w + x, f = paperFibre(x, y, u, o.fibre, o.seed);
        for (var c = 0; c < 3; c++) {
          var v = P[c] * f;
          for (var j = 0; j < plates.length; j++) v *= 1 - plates[j][i] * (1 - inks[j][c]);
          d[i * 4 + c] = Math.round(clamp(v) * 255);
        }
        d[i * 4 + 3] = 255;
      }
    }
    return out;
  }

  var TREATMENTS = { press: press, riso: riso, halftone: halftone, hatch: hatch };

  // "lumenary:<id>" runs one of Mursal Furqan Kumbhar's Lumenary treatments, if lumenary/lumenary.js is loaded.
  // Its own dials go in o.params; o.frames sets how long a live one runs before its frame is kept.
  function apply(imageData, name, o) {
    if (String(name).indexOf('lumenary:') === 0) {
      if (!global.Lumenary) throw new Error('Load treatments/lumenary/lumenary.js to use ' + name);
      o = o || {};
      return global.Lumenary.applyImageData(imageData, name.slice(9), o.params, { frames: o.frames });
    }
    if (!TREATMENTS[name]) throw new Error('Unknown treatment: ' + name);
    return TREATMENTS[name](imageData, o);
  }

  // ---------- treating elements on a page ----------

  var NS = 'http://www.w3.org/2000/svg';
  var STYLE_PROPS = ['fill', 'fill-opacity', 'fill-rule', 'stroke', 'stroke-width',
    'stroke-opacity', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray',
    'stroke-dashoffset', 'stroke-miterlimit', 'opacity', 'font-family', 'font-size',
    'font-weight', 'font-style', 'letter-spacing', 'text-anchor', 'dominant-baseline',
    'paint-order', 'filter', 'mask', 'clip-path', 'visibility', 'color', 'stop-color',
    'stop-opacity', 'vector-effect', 'mix-blend-mode'];

  // A standalone SVG loses the page's CSS, so copy each element's computed style inline.
  function inlineStyles(src, dst) {
    var s = [src].concat([].slice.call(src.querySelectorAll('*')));
    var d = [dst].concat([].slice.call(dst.querySelectorAll('*')));
    for (var i = 0; i < s.length && i < d.length; i++) {
      var cs = getComputedStyle(s[i]), decl = '';
      for (var j = 0; j < STYLE_PROPS.length; j++) {
        var v = cs.getPropertyValue(STYLE_PROPS[j]);
        if (v) decl += STYLE_PROPS[j] + ':' + v + ';';
      }
      d[i].setAttribute('style', decl);
    }
  }

  function loadImage(url) {
    return new Promise(function (resolve, reject) {
      var im = new Image();
      im.onload = function () { resolve(im); };
      im.onerror = function () { reject(new Error('could not load ' + url.slice(0, 60))); };
      im.src = url;
    });
  }

  function svgToImage(svg, W, H, cssW, cssH) {
    var clone = svg.cloneNode(true);
    inlineStyles(svg, clone);
    // Patterns and filters often live in a shared, hidden <svg> elsewhere on the page.
    var defs = document.createElementNS(NS, 'defs');
    [].forEach.call(document.querySelectorAll('svg defs'), function (dsrc) {
      if (svg.contains(dsrc)) return;
      var dc = dsrc.cloneNode(true);
      inlineStyles(dsrc, dc);
      while (dc.firstChild) defs.appendChild(dc.firstChild);
    });
    clone.insertBefore(defs, clone.firstChild);
    clone.setAttribute('xmlns', NS);
    clone.setAttribute('width', W);
    clone.setAttribute('height', H);
    if (!clone.getAttribute('viewBox')) clone.setAttribute('viewBox', '0 0 ' + cssW + ' ' + cssH);
    clone.removeAttribute('class');
    var xml = new XMLSerializer().serializeToString(clone);
    var url = URL.createObjectURL(new Blob([xml], { type: 'image/svg+xml;charset=utf-8' }));
    return loadImage(url).then(function (im) { URL.revokeObjectURL(url); return im; },
                               function (e) { URL.revokeObjectURL(url); throw e; });
  }

  function accessibleName(el) {
    var label = el.getAttribute('aria-label');
    if (label) return label;
    var by = el.getAttribute('aria-labelledby');
    if (by) {
      return by.split(/\s+/).map(function (id) {
        var t = document.getElementById(id); return t ? t.textContent : '';
      }).join(' ').trim();
    }
    var title = el.querySelector && el.querySelector('title');
    return title ? title.textContent : (el.getAttribute('alt') || '');
  }

  // Replace an <svg>, <img> or <canvas> with a treated canvas of the same size. The
  // canvas multiplies over the page, so paper white disappears and the inks sit on
  // whatever is behind, as ink does on paper.
  function treatElement(el, o) {
    o = o || {};
    var name = o.treatment || el.getAttribute('data-treatment') || 'press';
    var scale = o.scale || 2;
    var rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return Promise.resolve(null);
    var W = Math.round(rect.width * scale), H = Math.round(rect.height * scale);
    var canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    var ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.fillStyle = o.paper || '#ffffff';
    ctx.fillRect(0, 0, W, H);
    var tag = el.tagName.toLowerCase();
    var ready = tag === 'svg' ? svgToImage(el, W, H, rect.width, rect.height)
      : tag === 'img' ? (el.decode ? el.decode().then(function () { return el; }) : Promise.resolve(el))
      : Promise.resolve(el);
    return ready.then(function (src) {
      ctx.drawImage(src, 0, 0, W, H);
      var params = Object.assign({}, o, { unit: scale });
      ctx.putImageData(apply(ctx.getImageData(0, 0, W, H), name, params), 0, 0);
      var cs = getComputedStyle(el);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      canvas.style.maxWidth = '100%';
      canvas.style.display = cs.display === 'inline' ? 'inline-block' : cs.display;
      // Our print treatments sit on the page like ink (multiply). Lumenary's make their own whole picture.
      var blend = o.blend || (String(name).indexOf('lumenary:') === 0 ? 'normal' : 'multiply');
      if (blend !== 'normal') canvas.style.mixBlendMode = blend;
      if (el.getAttribute('class')) canvas.setAttribute('class', el.getAttribute('class'));
      canvas.setAttribute('role', 'img');
      canvas.setAttribute('aria-label', accessibleName(el));
      canvas.setAttribute('data-treated', name);
      el.replaceWith(canvas);
      return canvas;
    });
  }

  // Treat every element matching the selector, one after another, each with its own seed.
  function treatAll(selector, o) {
    o = o || {};
    var els = [].slice.call(document.querySelectorAll(selector));
    var start = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    return start.then(function () {
      return els.reduce(function (chain, el, i) {
        return chain.then(function () {
          var seed = (o.seed || 7) + i * 977;
          return treatElement(el, Object.assign({}, o, { seed: seed })).catch(function (e) {
            if (global.console) console.warn('treatments: skipped an element:', e.message);
          });
        });
      }, Promise.resolve());
    });
  }

  global.Treatments = {
    apply: apply, treatElement: treatElement, treatAll: treatAll, defaults: DEFAULTS,
    foundations: { clamp: clamp, smoothstep: smoothstep, mulberry32: mulberry32,
                   hash2: hash2, valueNoise: valueNoise, luminance: luminance,
                   boxBlur: boxBlur, dilate: dilate, sobel: sobel, sample: sample,
                   contrast: contrast }
  };
})(typeof window !== 'undefined' ? window : this);
