// engine/core/picture.js
// A picture as the process models read it, and the plans they take from it (C-029): its palette, its regions, the
// shape and colour of each region, its brightness at any point. Pure functions on { width, height, rgb } with rgb a
// Float32Array of 0..1 values, three per pixel, the format every model in core/ returns.
import { rng } from './random.js';

export const fromRGBA = (width, height, data) => {
  const rgb = new Float32Array(width * height * 3);
  for (let p = 0, q = 0; p < width * height; p++, q += 4) {
    const a = data[q + 3] / 255; // transparent pixels show as white paper
    rgb[p * 3] = (data[q] * a + 255 * (1 - a)) / 255;
    rgb[p * 3 + 1] = (data[q + 1] * a + 255 * (1 - a)) / 255;
    rgb[p * 3 + 2] = (data[q + 2] * a + 255 * (1 - a)) / 255;
  }
  return { width, height, rgb };
};
export const toRGBA = (img) => {
  const N = img.width * img.height, out = new Uint8ClampedArray(N * 4);
  for (let p = 0; p < N; p++) {
    out[p * 4] = Math.round(img.rgb[p * 3] * 255); out[p * 4 + 1] = Math.round(img.rgb[p * 3 + 1] * 255);
    out[p * 4 + 2] = Math.round(img.rgb[p * 3 + 2] * 255); out[p * 4 + 3] = 255;
  }
  return out;
};

// The size a picture is rendered at: its own, or smaller so its long side is at most `maxSide`.
export const fitWithin = (w, h, maxSide) => {
  const s = Math.min(1, maxSide / Math.max(w, h));
  return { width: Math.max(1, Math.round(w * s)), height: Math.max(1, Math.round(h * s)) };
};
// Shrink by averaging the source pixels each target pixel covers (never enlarges).
export function resize(pic, maxSide) {
  const { width: W, height: H } = fitWithin(pic.width, pic.height, maxSide);
  if (W === pic.width && H === pic.height) return pic;
  const sx = pic.width / W, sy = pic.height / H, rgb = new Float32Array(W * H * 3);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const x0 = x * sx, x1 = (x + 1) * sx, y0 = y * sy, y1 = (y + 1) * sy, acc = [0, 0, 0];
    let wsum = 0;
    for (let yy = Math.floor(y0); yy < Math.ceil(y1); yy++) for (let xx = Math.floor(x0); xx < Math.ceil(x1); xx++) {
      const w = (Math.min(x1, xx + 1) - Math.max(x0, xx)) * (Math.min(y1, yy + 1) - Math.max(y0, yy));
      if (w <= 0) continue;
      const q = (yy * pic.width + xx) * 3;
      acc[0] += pic.rgb[q] * w; acc[1] += pic.rgb[q + 1] * w; acc[2] += pic.rgb[q + 2] * w; wsum += w;
    }
    for (let c = 0; c < 3; c++) rgb[(y * W + x) * 3 + c] = acc[c] / wsum;
  }
  return { width: W, height: H, rgb };
}

export const lumOf = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
export function luminance(pic) {
  const N = pic.width * pic.height, L = new Float32Array(N);
  for (let p = 0; p < N; p++) L[p] = lumOf(pic.rgb[p * 3], pic.rgb[p * 3 + 1], pic.rgb[p * 3 + 2]);
  return L;
}
// The colour at (x, y), interpolated between pixel centres.
export function colourAt(pic, x, y) {
  const W = pic.width, H = pic.height, fx = Math.max(0, Math.min(W - 1, x - 0.5)), fy = Math.max(0, Math.min(H - 1, y - 0.5));
  const x0 = Math.floor(fx), y0 = Math.floor(fy), x1 = Math.min(W - 1, x0 + 1), y1 = Math.min(H - 1, y0 + 1), ax = fx - x0, ay = fy - y0;
  const at = (xx, yy, c) => pic.rgb[(yy * W + xx) * 3 + c];
  return [0, 1, 2].map((c) => at(x0, y0, c) * (1 - ax) * (1 - ay) + at(x1, y0, c) * ax * (1 - ay) + at(x0, y1, c) * (1 - ax) * ay + at(x1, y1, c) * ax * ay);
}
// The mean colour of a rectangle.
export function meanColour(pic, x0, y0, x1, y1) {
  const W = pic.width, H = pic.height, acc = [0, 0, 0];
  let n = 0;
  for (let y = Math.max(0, Math.floor(y0)); y < Math.min(H, Math.ceil(y1)); y++) for (let x = Math.max(0, Math.floor(x0)); x < Math.min(W, Math.ceil(x1)); x++) {
    const q = (y * W + x) * 3; acc[0] += pic.rgb[q]; acc[1] += pic.rgb[q + 1]; acc[2] += pic.rgb[q + 2]; n++;
  }
  return n ? acc.map((v) => v / n) : colourAt(pic, (x0 + x1) / 2, (y0 + y1) / 2);
}

export const hex = (c) => '#' + c.map((v) => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0')).join('');
export const rgbOf = (h) => { const n = parseInt(String(h).replace('#', ''), 16); return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; };
// Push a colour's saturation by `s` (1 leaves it) and its brightness by `v`.
export function tune([r, g, b], s = 1, v = 1) {
  const m = (r + g + b) / 3;
  return [r, g, b].map((c) => Math.max(0, Math.min(1, (m + (c - m) * s) * v)));
}
const dist2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
export const nearest = (c, palette) => { let best = 0, bd = Infinity; palette.forEach((q, i) => { const d = dist2(c, q); if (d < bd) { bd = d; best = i; } }); return best; };

// The picture's k main colours (k-means on a grid of samples, seeded so it answers the same way every time), sorted
// dark to light, and every pixel's nearest of them.
export function quantize(pic, k, seed = 1) {
  const W = pic.width, H = pic.height, N = W * H, step = Math.max(1, Math.floor(Math.sqrt(N / 5000)));
  const samples = [];
  for (let y = 0; y < H; y += step) for (let x = 0; x < W; x += step) { const q = (y * W + x) * 3; samples.push([pic.rgb[q], pic.rgb[q + 1], pic.rgb[q + 2]]); }
  const r = rng(seed + 601);
  // k-means++ start
  let centres = [samples[Math.floor(r() * samples.length)]];
  while (centres.length < k) {
    const d = samples.map((s) => Math.min(...centres.map((c) => dist2(s, c))));
    const tot = d.reduce((a, b) => a + b, 0);
    if (tot === 0) { centres.push(centres[0].slice()); continue; }
    let t = r() * tot, i = 0;
    while (i < d.length - 1 && t > d[i]) { t -= d[i]; i++; }
    centres.push(samples[i].slice());
  }
  for (let it = 0; it < 12; it++) {
    const acc = centres.map(() => [0, 0, 0, 0]);
    for (const s of samples) { const i = nearest(s, centres); acc[i][0] += s[0]; acc[i][1] += s[1]; acc[i][2] += s[2]; acc[i][3]++; }
    centres = centres.map((c, i) => (acc[i][3] ? [acc[i][0] / acc[i][3], acc[i][1] / acc[i][3], acc[i][2] / acc[i][3]] : c));
  }
  const order = centres.map((c, i) => [lumOf(...c), i]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
  const palette = order.map((i) => centres[i]), labels = new Int32Array(N);
  for (let p = 0; p < N; p++) labels[p] = nearest([pic.rgb[p * 3], pic.rgb[p * 3 + 1], pic.rgb[p * 3 + 2]], palette);
  return { palette, labels };
}

// Smooth a label map: each pixel takes the commonest label among itself and its eight neighbours, `passes` times.
export function smoothLabels(labels, W, H, passes = 1) {
  let a = labels;
  for (let t = 0; t < passes; t++) {
    const b = new Int32Array(a.length);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const cnt = new Map();
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const xx = Math.min(W - 1, Math.max(0, x + dx)), yy = Math.min(H - 1, Math.max(0, y + dy)), l = a[yy * W + xx];
        cnt.set(l, (cnt.get(l) || 0) + 1);
      }
      let best = a[y * W + x], bc = 0;
      for (const [l, c] of cnt) if (c > bc || (c === bc && l === a[y * W + x])) { best = l; bc = c; }
      b[y * W + x] = best;
    }
    a = b;
  }
  return a;
}

// Connected regions of a label map (4-connected), those smaller than `minArea` pixels merged into the neighbour they
// share most border with. Returns the region of every pixel and, for each region, its label, area, mean colour in
// `pic`, centroid, long axis (radians) and elongation (long over short spread).
export function regions(labels, W, H, { minArea = 30, pic = null } = {}) {
  const N = W * H, map = new Int32Array(N).fill(-1), sizes = [], labelOf = [];
  for (let p = 0; p < N; p++) {
    if (map[p] >= 0) continue;
    const id = sizes.length, l = labels[p], st = [p];
    map[p] = id; let n = 0;
    while (st.length) {
      const q = st.pop(), x = q % W; n++;
      for (const r of [x > 0 ? q - 1 : -1, x < W - 1 ? q + 1 : -1, q >= W ? q - W : -1, q + W < N ? q + W : -1])
        if (r >= 0 && map[r] < 0 && labels[r] === l) { map[r] = id; st.push(r); }
    }
    sizes.push(n); labelOf.push(l);
  }
  // merge small regions, smallest first, into the neighbour with the longest shared border
  const parent = sizes.map((_, i) => i), find = (i) => { while (parent[i] !== i) i = parent[i] = parent[parent[i]]; return i; };
  const area = sizes.slice();
  const order = sizes.map((s, i) => [s, i]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
  const border = new Map(); // id -> Map(neighbour -> shared edges)
  for (let p = 0; p < N; p++) {
    const x = p % W;
    for (const q of [x < W - 1 ? p + 1 : -1, p + W < N ? p + W : -1]) {
      if (q < 0 || map[q] === map[p]) continue;
      for (const [a, b] of [[map[p], map[q]], [map[q], map[p]]]) { if (!border.has(a)) border.set(a, new Map()); const m = border.get(a); m.set(b, (m.get(b) || 0) + 1); }
    }
  }
  for (const i of order) {
    const ri = find(i);
    if (area[ri] >= minArea) continue;
    let best = -1, bl = -1;
    for (const [j, len] of border.get(i) || []) { const rj = find(j); if (rj !== ri && len > bl) { bl = len; best = rj; } }
    if (best < 0) continue;
    parent[ri] = best; area[best] += area[ri];
  }
  // renumber
  const newId = new Map(), out = new Int32Array(N);
  for (let p = 0; p < N; p++) { const r = find(map[p]); if (!newId.has(r)) newId.set(r, newId.size); out[p] = newId.get(r); }
  const M = newId.size, s = Array.from({ length: M }, () => ({ n: 0, x: 0, y: 0, xx: 0, yy: 0, xy: 0, c: [0, 0, 0], label: -1 }));
  for (const [r, id] of newId) s[id].label = labelOf[r];
  for (let p = 0; p < N; p++) {
    const t = s[out[p]], x = (p % W) + 0.5, y = Math.floor(p / W) + 0.5;
    t.n++; t.x += x; t.y += y; t.xx += x * x; t.yy += y * y; t.xy += x * y;
    if (pic) { t.c[0] += pic.rgb[p * 3]; t.c[1] += pic.rgb[p * 3 + 1]; t.c[2] += pic.rgb[p * 3 + 2]; }
  }
  const list = s.map((t, id) => {
    const cx = t.x / t.n, cy = t.y / t.n, vxx = t.xx / t.n - cx * cx, vyy = t.yy / t.n - cy * cy, vxy = t.xy / t.n - cx * cy;
    const tr = vxx + vyy, det = vxx * vyy - vxy * vxy, disc = Math.sqrt(Math.max(0, tr * tr / 4 - det));
    const l1 = tr / 2 + disc, l2 = Math.max(1e-6, tr / 2 - disc);
    return { id, label: t.label, area: t.n, cx, cy, axis: 0.5 * Math.atan2(2 * vxy, vxx - vyy), elongation: Math.sqrt(l1 / l2),
      colour: pic ? t.c.map((v) => v / t.n) : null };
  });
  return { map: out, list };
}

// The bounding box of each region: [x0, y0, x1, y1] (inclusive).
export function boxes(map, W, H, count) {
  const b = Array.from({ length: count }, () => [W, H, -1, -1]);
  for (let p = 0; p < W * H; p++) { const r = b[map[p]], x = p % W, y = (p / W) | 0; if (x < r[0]) r[0] = x; if (y < r[1]) r[1] = y; if (x > r[2]) r[2] = x; if (y > r[3]) r[3] = y; }
  return b;
}
