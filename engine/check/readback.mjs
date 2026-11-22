// engine/check/readback.mjs
// Reading a structure back from a rendered image, shared by the engine's checks (C-019 weave, C-020 supplementary
// weft). It sees only pixels and the nominal thread spacing a weaver would know.

const mod = (a, n) => ((a % n) + n) % n;

export const modeOf = (xs) => {
  const c = new Map();
  for (const x of xs) c.set(x, (c.get(x) || 0) + 1);
  return [...c.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0]?.[0] ?? null;
};

export const lum = (rgb, p) => 0.2126 * rgb[p * 3] + 0.7152 * rgb[p * 3 + 1] + 0.0722 * rgb[p * 3 + 2];

// Hue (degrees) and saturation of a pixel.
export function hueSat(rgb, p) {
  const r = rgb[p * 3], g = rgb[p * 3 + 1], b = rgb[p * 3 + 2];
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  if (d < 1e-6) return [0, 0];
  let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h *= 60; if (h < 0) h += 360;
  return [h, mx > 0 ? d / mx : 0];
}

// 1 = warp on top (dark), 0 = weft on top (light), -1 = can't tell. `skip(p)` marks pixels to leave out.
export function classifyDarkLight(img, skip = null) {
  const T = new Int8Array(img.width * img.height);
  for (let p = 0; p < T.length; p++) {
    if (skip && skip(p)) { T[p] = -1; continue; }
    const L = lum(img.rgb, p);
    T[p] = L < 0.3 ? 1 : L > 0.55 ? 0 : -1;
  }
  return T;
}

// Most common float length along the warp (down columns) and the weft (along rows), in threads.
export function floatModes(T, w, h, sett, pickSett) {
  const warpRuns = [], weftRuns = [];
  for (let x = 0; x < w; x++) {
    let y = 0;
    while (y < h) {
      if (T[y * w + x] !== 1) { y++; continue; }
      const y0 = y;
      while (y < h && T[y * w + x] === 1) y++;
      if (y0 > 0 && y < h && y - y0 >= 0.5 * pickSett)
        warpRuns.push(Math.round((y - y0) / pickSett));
    }
  }
  for (let y = 0; y < h; y++) {
    let x = 0;
    while (x < w) {
      if (T[y * w + x] !== 0) { x++; continue; }
      const x0 = x;
      while (x < w && T[y * w + x] === 0) x++;
      if (x0 > 0 && x < w && x - x0 >= 0.5 * sett) weftRuns.push(Math.round((x - x0) / sett));
    }
  }
  return { warp: modeOf(warpRuns), weft: modeOf(weftRuns), samples: { warp: warpRuns.length, weft: weftRuns.length } };
}

export function pearson(pairs) {
  let n = 0, sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0;
  for (const [a, b] of pairs) { n++; sx += a; sy += b; sxx += a * a; syy += b * b; sxy += a * b; }
  const vx = sxx / n - (sx / n) ** 2, vy = syy / n - (sy / n) ** 2;
  if (n < 10 || vx < 1e-9 || vy < 1e-9) return null;
  return (sxy / n - (sx / n) * (sy / n)) / Math.sqrt(vx * vy);
}

export function imageR(T, w, h, k, l, sett, pickSett) {
  const dx = Math.round(k * sett), dy = Math.round(l * pickSett);
  const pairs = [];
  for (let y = Math.max(0, -dy); y < Math.min(h, h - dy); y++)
    for (let x = Math.max(0, -dx); x < Math.min(w, w - dx); x++) {
      const a = T[y * w + x], b = T[(y + dy) * w + (x + dx)];
      if (a >= 0 && b >= 0) pairs.push([a, b]);
    }
  return pearson(pairs);
}

export function unitR(unit, k, l) {
  const pairs = [];
  for (let i = 0; i < unit.picks * 4; i++)
    for (let j = 0; j < unit.ends * 4; j++)
      pairs.push([unit.up(mod(i, unit.picks), mod(j, unit.ends)) ? 1 : 0, unit.up(mod(i + l, unit.picks), mod(j + k, unit.ends)) ? 1 : 0]);
  return pearson(pairs);
}

// How the image's pattern repeats when shifted by whole threads, against what the structure predicts, in both
// directions: an offset strong in the structure must show in the image, and one strong in the image must be
// predicted by the structure (one direction alone let twill 2/2 pass as basket 2/2, C-019).
export function signature(T, w, h, unit, sett, pickSett) {
  let strong = 0, agree = 0;
  const offsets = [];
  for (let k = -4; k <= 4; k++) for (let l = -4; l <= 4; l++) {
    if (!k && !l) continue;
    const ru = unitR(unit, k, l), ri = imageR(T, w, h, k, l, sett, pickSett);
    const strongU = ru !== null && Math.abs(ru) >= 0.5, strongI = ri !== null && Math.abs(ri) >= 0.5;
    if (!strongU && !strongI) continue;
    strong++;
    const ok = ru !== null && ri !== null && Math.sign(ri) === Math.sign(ru) && Math.abs(ri) >= 0.15 && Math.abs(ru) >= 0.2;
    if (ok) agree++;
    offsets.push({ k, l, unit: ru === null ? null : +ru.toFixed(2), image: ri === null ? null : +ri.toFixed(2), ok });
  }
  return { score: strong ? +(agree / strong).toFixed(3) : 1, strong, offsets };
}

// Thread boundaries found in the image, as a reader counts threads rather than measuring with a ruler (C-020): a
// profile across the cloth (one value per column or row) dips between threads; starting from the image's edge, each next
// boundary is the lowest point of the smoothed profile between 0.6 and 1.45 thread-spacings on. It follows the drift
// that uneven yarn and beat add up to across the cloth.
export function trackBoundaries(profile, spacing) {
  const n = profile.length, sm = new Float64Array(n);
  for (let i = 0; i < n; i++) { let a = 0, c = 0; for (let k = -1; k <= 1; k++) if (i + k >= 0 && i + k < n) { a += profile[i + k]; c++; } sm[i] = a / c; }
  const b = [0];
  for (;;) {
    const lo = Math.ceil(b[b.length - 1] + 0.6 * spacing), hi = Math.floor(b[b.length - 1] + 1.45 * spacing);
    if (hi >= n - 1) break;
    let best = lo;
    for (let i = lo; i <= hi; i++) if (sm[i] < sm[best]) best = i;
    b.push(best);
  }
  return b;
}

// Column and row profiles of a cloth image: the share of each column where the warp colour shows (dips between warp
// ends) and of each row where the weft colour shows (dips between picks). `skip(p)` leaves pixels out.
export function threadProfiles(T, w, h) {
  const col = new Float64Array(w), row = new Float64Array(h), cn = new Float64Array(w), rn = new Float64Array(h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const t = T[y * w + x];
    if (t < -1) continue;
    cn[x]++; rn[y]++;
    if (t === 1) col[x]++;
    if (t === 0) row[y]++;
  }
  for (let x = 0; x < w; x++) col[x] = cn[x] ? col[x] / cn[x] : 0;
  for (let y = 0; y < h; y++) row[y] = rn[y] ? row[y] / rn[y] : 0;
  return { col, row };
}
