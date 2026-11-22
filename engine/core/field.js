// engine/core/field.js
// Distance fields from shapes, and their level lines traced into paths (C-023). Used to lay rows that follow a
// motif's contour (`contour-rows`) and to find how far each point of the cloth is from the nearest stitched row
// (`quilt-ripple`). The primitives `iso-contours` and `sdf-shape` in processes/primitives.md, written here for the
// engine.

// Squared Euclidean distance transform, one dimension (Felzenszwalb and Huttenlocher, 2012).
function edt1(f, n, d, v, z) {
  let k = 0;
  v[0] = 0; z[0] = -Infinity; z[1] = Infinity;
  for (let q = 1; q < n; q++) {
    let s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (s <= z[k]) { k--; s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]); }
    k++; v[k] = q; z[k] = s; z[k + 1] = Infinity;
  }
  k = 0;
  for (let q = 0; q < n; q++) { while (z[k + 1] < q) k++; d[q] = (q - v[k]) ** 2 + f[v[k]]; }
}

// Distance (pixels) from each pixel to the nearest pixel where mask is set (0 on the mask).
export function distanceTo(mask, W, H) {
  const INF = 1e20, g = new Float64Array(W * H);
  for (let p = 0; p < W * H; p++) g[p] = mask[p] ? 0 : INF;
  const n = Math.max(W, H), f = new Float64Array(n), d = new Float64Array(n), v = new Int32Array(n), z = new Float64Array(n + 1);
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < H; y++) f[y] = g[y * W + x];
    edt1(f, H, d, v, z);
    for (let y = 0; y < H; y++) g[y * W + x] = d[y];
  }
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) f[x] = g[y * W + x];
    edt1(f, W, d, v, z);
    for (let x = 0; x < W; x++) g[y * W + x] = Math.sqrt(d[x]);
  }
  return g;
}

// Signed distance to a shape's edge: positive inside, negative outside.
export function signedDistance(inside, W, H) {
  const m = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) m[y * W + x] = inside(x + 0.5, y + 0.5) ? 1 : 0;
  const toIn = distanceTo(m, W, H), toOut = distanceTo(m.map((b) => 1 - b), W, H);
  const s = new Float64Array(W * H);
  for (let p = 0; p < W * H; p++) s[p] = m[p] ? toOut[p] - 0.5 : -(toIn[p] - 0.5);
  return s;
}

// The level lines of a field at `level`, by marching squares, joined into paths ([x, y] points; closed paths end where
// they began).
export function levelLines(field, W, H, level) {
  const segs = [];
  const at = (x, y) => field[y * W + x] - level;
  const lerp = (x0, y0, a, x1, y1, b) => { const t = a / (a - b); return [x0 + (x1 - x0) * t + 0.5, y0 + (y1 - y0) * t + 0.5]; };
  for (let y = 0; y < H - 1; y++) for (let x = 0; x < W - 1; x++) {
    const a = at(x, y), b = at(x + 1, y), c = at(x + 1, y + 1), d = at(x, y + 1);
    const idx = (a > 0 ? 8 : 0) | (b > 0 ? 4 : 0) | (c > 0 ? 2 : 0) | (d > 0 ? 1 : 0);
    if (idx === 0 || idx === 15) continue;
    const T = () => lerp(x, y, a, x + 1, y, b), R = () => lerp(x + 1, y, b, x + 1, y + 1, c);
    const B = () => lerp(x, y + 1, d, x + 1, y + 1, c), L = () => lerp(x, y, a, x, y + 1, d);
    const add = (p, q) => segs.push([p(), q()]);
    switch (idx) {
      case 1: case 14: add(L, B); break;
      case 2: case 13: add(B, R); break;
      case 3: case 12: add(L, R); break;
      case 4: case 11: add(T, R); break;
      case 6: case 9: add(T, B); break;
      case 7: case 8: add(L, T); break;
      case 5: add(L, T); add(B, R); break;
      case 10: add(T, R); add(L, B); break;
    }
  }
  // join segments end to end into paths
  const key = ([x, y]) => `${Math.round(x * 64)},${Math.round(y * 64)}`;
  const ends = new Map();
  segs.forEach((s, i) => { for (const e of [0, 1]) { const k = key(s[e]); if (!ends.has(k)) ends.set(k, []); ends.get(k).push(i); } });
  const used = new Uint8Array(segs.length), paths = [];
  for (let i = 0; i < segs.length; i++) {
    if (used[i]) continue;
    used[i] = 1;
    const path = [segs[i][0], segs[i][1]];
    for (const dir of [1, -1]) {
      for (;;) {
        const tip = dir === 1 ? path[path.length - 1] : path[0];
        const next = (ends.get(key(tip)) || []).find((j) => !used[j]);
        if (next === undefined) break;
        used[next] = 1;
        const s = segs[next], far = key(s[0]) === key(tip) ? s[1] : s[0];
        if (dir === 1) path.push(far); else path.unshift(far);
      }
    }
    if (path.length >= 3) paths.push(path);
  }
  return paths;
}
