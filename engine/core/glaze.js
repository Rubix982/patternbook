// engine/core/glaze.js
// A glaze with thickness over a body with relief: the primitive `glaze-layer` (processes/primitives.md), written in
// C-026 because the primitives give glaze only as flat layers, and Hala and Multani blue pottery's cobalt under clear
// glaze is drawn as a flat wash.
//
// The process (Multani kashigari, as sources describe it). A red clay body is shaped and covered with a white engobe
// (astar). The design is pounced through perforated paper, outlined in cobalt, and filled with other colours, copper
// for turquoise; lines may be cut through the slip to the red clay (sgraffito). A transparent glaze is sprayed over
// everything, about a millimetre thick, and fired. Constraints. Melted glaze levels itself: its top surface follows the
// body's broad forms but not its small ones, so it lies thick in hollows and thin over ridges and edges; whatever lies
// under it is seen through it. In the firing the pigment moves into the melted glaze, more where there is more glaze to
// move into. Imperfections. The glaze is sprayed unevenly; on an upright piece it runs thicker towards the bottom; it
// crazes as it cools faster than the body, in a network of fine cracks; it leaves pinholes where gas escaped; the slip
// keeps the brush's texture.
import { noise2, hash2 } from './random.js';

const hexRgb = (h) => {
  const n = parseInt(String(h).replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export const GLAZE_DEFAULTS = {
  slip: '#f3efe6', clay: '#9a4a2e',
  amount: 2.2, level: 6, thin: 0.25, tint: [0.02, 0.03, 0.09], flow: 0.55,
  light: [-0.5, -0.6, 0.62], relief: 1, gloss: 0.55, shine: 60,
  uneven: 0.12, run: 0, craze: 0.3, crazeCell: 26, pinholes: 0.0001, brush: 0.15,
};

// a separable Gaussian blur of a W x H field
export function gauss(f, W, H, s) {
  if (!(s > 0.05)) return Float64Array.from(f);
  const R = Math.ceil(3 * s), k = Array.from({ length: 2 * R + 1 }, (_, i) => Math.exp(-((i - R) ** 2) / (2 * s * s)));
  const t = new Float64Array(W * H), out = new Float64Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let a = 0, n = 0;
    for (let i = -R; i <= R; i++) { const xx = Math.min(W - 1, Math.max(0, x + i)); a += k[i + R] * f[y * W + xx]; n += k[i + R]; }
    t[y * W + x] = a / n;
  }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let a = 0, n = 0;
    for (let i = -R; i <= R; i++) { const yy = Math.min(H - 1, Math.max(0, y + i)); a += k[i + R] * t[yy * W + x]; n += k[i + R]; }
    out[y * W + x] = a / n;
  }
  return out;
}

const normal = (h, W, H, x, y) => {
  const xl = Math.max(0, x - 1), xr = Math.min(W - 1, x + 1), yu = Math.max(0, y - 1), yd = Math.min(H - 1, y + 1);
  const gx = (h[y * W + xr] - h[y * W + xl]) / (xr - xl), gy = (h[yd * W + x] - h[yu * W + x]) / (yd - yu);
  const l = Math.hypot(gx, gy, 1);
  return [-gx / l, -gy / l, 1 / l];
};

// A glazed surface. Options:
//   width, height, seed
//   body(x, y)   the body's height in pixels (relief); cut(x, y): 0..1 where the slip is cut away to the clay
//   paint        [{ mask(x, y) -> 0..1, colour }]: underglaze pigment, `colour` how it looks at full strength on white
//   glaze        false for the bare body (no glaze, no gloss, no spreading)
//   amount       the glaze's mean thickness (pixels of height); amountAt(x, y): a factor on it (a thick side, a pool)
//   level        how far the melted glaze levels itself (pixels): relief narrower than this is smoothed over; 0: the
//                glaze follows the body at an even thickness
//   thin         the least it thins to over an edge; tint: what it absorbs per pixel of thickness (red, green, blue)
//   flow         how far the pigment spreads into the glaze in firing, pixels per pixel of thickness
//   light, relief, gloss, shine   the lamp's direction, how strongly the relief shades, the glaze's highlight
//   uneven, run, craze, crazeCell, pinholes, brush   the imperfections (see the header)
export function glazed(opts) {
  const o = { ...GLAZE_DEFAULTS, ...opts };
  const W = o.width, H = o.height, N = W * H, seed = o.seed || 1;
  const body = new Float64Array(N);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++)
    body[y * W + x] = (o.body ? o.body(x + 0.5, y + 0.5) : 0) + o.brush * noise2(x / 1.7, y / 6, seed + 401);
  // the glaze: its top surface is the body smoothed, raised by the amount laid on; its thickness, that less the body
  const T = new Float64Array(N), S = new Float64Array(N);
  if (o.glaze !== false) {
    const smooth = o.level > 0 ? gauss(body, W, H, o.level) : body;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const p = y * W + x;
      const a = o.amount * (o.amountAt ? o.amountAt(x + 0.5, y + 0.5) : 1) * (1 + o.uneven * noise2(x / 31, y / 31, seed + 409)) * (1 + o.run * (y / H - 0.5));
      T[p] = Math.max(o.thin, smooth[p] + a - body[p]);
    }
  }
  for (let p = 0; p < N; p++) S[p] = body[p] + T[p];
  // the pigment, spread into the glaze by a blur that grows with the thickness there
  const P = [new Float64Array(N), new Float64Array(N), new Float64Array(N)];
  for (const { mask, colour } of o.paint || []) {
    const od = hexRgb(colour).map((v) => -Math.log(Math.max(0.02, v)));
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const m = mask(x + 0.5, y + 0.5); if (m > 0) for (let c = 0; c < 3; c++) P[c][y * W + x] += od[c] * m; }
  }
  let Pf = P;
  if ((o.paint || []).length && o.glaze !== false && o.flow > 0) {
    let smax = 0; for (let p = 0; p < N; p++) smax = Math.max(smax, o.flow * T[p]);
    const levels = [0]; for (let s = 0.5; s < smax + 0.5; s *= 1.5) levels.push(s);
    const blurred = levels.map((s) => P.map((ch) => gauss(ch, W, H, s)));
    Pf = [new Float64Array(N), new Float64Array(N), new Float64Array(N)];
    for (let p = 0; p < N; p++) {
      const s = o.flow * T[p];
      let k = 0; while (k < levels.length - 2 && levels[k + 1] < s) k++;
      const f = Math.max(0, Math.min(1, (s - levels[k]) / (levels[k + 1] - levels[k])));
      for (let c = 0; c < 3; c++) Pf[c][p] = blurred[k][c][p] * (1 - f) + blurred[k + 1][c][p] * f;
    }
  }
  // crazing: the borders between irregular cells
  const cell = o.crazeCell, crack = (x, y) => {
    const ci = Math.floor(x / cell), cj = Math.floor(y / cell);
    let d1 = Infinity, d2 = Infinity;
    for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) {
      const px = (ci + a + 0.15 + 0.7 * hash2(ci + a, cj + b, seed + 419)) * cell, py = (cj + b + 0.15 + 0.7 * hash2(ci + a, cj + b, seed + 421)) * cell;
      const d = Math.hypot(x - px, y - py);
      if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
    }
    return d2 - d1 < 0.7;
  };
  const slip = hexRgb(o.slip), clay = hexRgb(o.clay), Ll = Math.hypot(...o.light), L = o.light.map((v) => v / Ll);
  const Hh = [L[0], L[1], L[2] + 1], hl = Math.hypot(...Hh), half = Hh.map((v) => v / hl);
  const rgb = new Float32Array(N * 3);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const p = y * W + x, cut = o.cut ? o.cut(x + 0.5, y + 0.5) : 0, t = T[p];
    const nb = normal(body, W, H, x, y);
    let shade, spec = 0;
    if (o.glaze === false) shade = Math.max(0, nb[0] * L[0] + nb[1] * L[1] + nb[2] * L[2]) / L[2];
    else {
      // through the glaze the body's own relief still shades a little where the glaze is thin
      const ng = normal(S, W, H, x, y), beta = Math.exp(-t / 1.5);
      const n = [ng[0] + beta * nb[0], ng[1] + beta * nb[1], ng[2] + beta * nb[2]], nl = Math.hypot(...n);
      shade = Math.max(0, (n[0] * L[0] + n[1] * L[1] + n[2] * L[2]) / nl) / L[2];
      spec = o.gloss * Math.max(0, ng[0] * half[0] + ng[1] * half[1] + ng[2] * half[2]) ** o.shine;
    }
    shade = 1 + o.relief * (shade - 1);
    const dirt = o.glaze !== false && o.craze > 0 && crack(x + 0.5, y + 0.5) ? 1 - 0.25 * o.craze : 1;
    for (let c = 0; c < 3; c++) {
      const base = slip[c] * (1 - cut) + clay[c] * cut;
      rgb[p * 3 + c] = Math.min(1, base * Math.exp(-Pf[c][p] - o.tint[c] * t) * shade * 0.96 * dirt + spec);
    }
  }
  // pinholes: where gas escaped, the glaze is missing in a small crater with a dark rim
  if (o.glaze !== false && o.pinholes > 0) {
    for (let y = 2; y < H - 2; y++) for (let x = 2; x < W - 2; x++) {
      if (hash2(x, y, seed + 431) >= o.pinholes) continue;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
        const d = Math.hypot(dx, dy), p = (y + dy) * W + x + dx;
        if (d > 2) continue;
        const f = d < 1 ? 0.9 : 0.6;
        for (let c = 0; c < 3; c++) rgb[p * 3 + c] *= f;
      }
    }
  }
  return { width: W, height: H, rgb, fields: { body, thickness: T, surface: S } };
}
