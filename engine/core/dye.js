// engine/core/dye.js
// Dye baths taken in sequence: the primitive `dye-baths` (processes/primitives.md), written in C-024 because
// Lumenary's ajrak gives each block a finished colour, with no sequence of baths and no overdyeing.
//
// The process. Cloth is carried through steps in order. Harda (myrobalan) tans it a little yellow and readies it for
// iron. Blocks print a resist (a lime-and-gum paste, or dabu's mud) where dye must not go, and mordants where the madder
// bath must take: alum for red, iron for black (Bagru's syahi, iron fermented with molasses). An indigo bath dyes blue
// wherever no resist lies, and needs no mordant; each further dip makes it darker. A madder bath dyes red where alum
// is, black where iron is, and only stains the rest, which washing removes. Washing also takes the resist off. So a
// cloth's colours are set by the order of its steps, not chosen. Constraints. A resisted area keeps whatever colour it
// had; a mordant lasts through washing; indigo over a red gives violet. Imperfections. Each block impression lands a
// little off and presses unevenly; printed paste spreads; dabu's mud cracks, and dye runs through the cracks as veins;
// dye wicks a little along the threads, so edges blur more along the warp and weft than across the diagonal; dye takes
// up unevenly across the cloth.
import { cloth, STRUCTURES } from './weave.js';
import { noise2, hash2 } from './random.js';

const hexRgb = (h) => {
  const n = parseInt(String(h).replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

// How strongly each dye absorbs red, green and blue light (optical density added per bath).
export const ABSORB = {
  harda: [0.01, 0.04, 0.16],
  indigo: [1.6, 0.9, 0.25],
  madderAlum: [0.15, 1.6, 1.3],
  madderIron: [1.8, 1.8, 1.6],
  madderStain: [0.05, 0.25, 0.2],
};

export const DYE_DEFAULTS = { cloth: '#f4efe4', impression: 0.25, spread: 0.6, reg: 1.2, wick: 1.2, mottle: 0.12, crackWidth: 0.9 };

// a field blurred along the threads only: a plus-shaped kernel (the warp and the weft), `r` pixels each way
function wickBlur(f, W, H, r) {
  if (r <= 0) return f;
  const R = Math.max(1, Math.round(r * 2)), out = new Float32Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let sx = 0, nx = 0, sy = 0, ny = 0;
    for (let k = -R; k <= R; k++) {
      const w = Math.exp(-(k * k) / (2 * r * r));
      if (x + k >= 0 && x + k < W) { sx += w * f[y * W + x + k]; nx += w; }
      if (y + k >= 0 && y + k < H) { sy += w * f[(y + k) * W + x]; ny += w; }
    }
    out[y * W + x] = 0.5 * (sx / nx + sy / ny);
  }
  return out;
}

// A block printed by repeated impressions: each tile of `tile` pixels lands off by up to `reg` pixels and presses
// unevenly; the paste spreads by `spread` pixels. `mask(x, y)` is the block's design (0 to 1), `offset` a planned shift.
function printLayer(field, W, H, step, o, seed) {
  const [tw, th] = step.tile || [64, 64], [ox, oy] = step.offset || [0, 0];
  const sp = o.spread, samples = sp > 0 ? [[0, 0], [sp, 0], [-sp, 0], [0, sp], [0, -sp]] : [[0, 0]];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const tx = Math.floor(x / tw), ty = Math.floor(y / th);
    const jx = o.reg * (hash2(tx, ty, seed + 3) * 2 - 1), jy = o.reg * (hash2(tx, ty, seed + 5) * 2 - 1);
    let c = 0;
    for (const [dx, dy] of samples) c = Math.max(c, step.mask(x - ox - jx + dx, y - oy - jy + dy));
    const press = 1 - o.impression * Math.max(0, noise2(x / 9, y / 9, seed + 7)) - o.impression * 0.5 * (hash2(tx, ty, seed + 11));
    const v = Math.max(0, Math.min(1, c * Math.min(1, press * 1.25)));
    field[y * W + x] = Math.max(field[y * W + x], v);
  }
}

// Mud cracks: a network of thin lines where the resist breaks (the borders between irregular cells).
function crackLines(W, H, density, width, seed) {
  const cell = 9 + 10 * (1 - density), out = new Uint8Array(W * H);
  const pt = (i, j) => [(i + 0.15 + 0.7 * hash2(i, j, seed + 13)) * cell, (j + 0.15 + 0.7 * hash2(i, j, seed + 17)) * cell];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const ci = Math.floor(x / cell), cj = Math.floor(y / cell);
    let d1 = Infinity, d2 = Infinity;
    for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) {
      const [px, py] = pt(ci + a, cj + b), d = Math.hypot(x + 0.5 - px, y + 0.5 - py);
      if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
    }
    if (d2 - d1 < width) out[y * W + x] = 1;
  }
  return out;
}

// The cloth after its steps. Options are those of weave.cloth (unit replaced by `ground`), plus:
//   steps   in order: { op: 'harda' } | { op: 'print', layer: 'resist' | 'alum' | 'iron', mask, tile, offset }
//           | { op: 'crack', density } | { op: 'dye', bath: 'indigo' | 'madder', strength } | { op: 'wash' }
//   cloth   the undyed cloth's colour
//   impression, spread, reg   how unevenly a block presses, how far its paste spreads, how far each impression lands off
//   wick    how far dye runs along the threads (pixels); mottle: how unevenly a bath takes
// Returns the image, and the fields it ended with.
export function dyed(opts) {
  const o = { ...DYE_DEFAULTS, ...opts };
  const W = o.width, H = o.height, N = W * H, seed = o.seed || 1;
  const R = new Float32Array(N), A = new Float32Array(N), F = new Float32Array(N), OD = [new Float32Array(N), new Float32Array(N), new Float32Array(N)];
  const stain = [new Float32Array(N), new Float32Array(N), new Float32Array(N)];
  let tannin = 0, k = 0;
  for (const step of o.steps || []) {
    k++;
    if (step.op === 'harda') { tannin = 1; for (let c = 0; c < 3; c++) for (let p = 0; p < N; p++) OD[c][p] += ABSORB.harda[c] * (step.amount ?? 1); }
    else if (step.op === 'print') printLayer(step.layer === 'resist' ? R : step.layer === 'alum' ? A : F, W, H, step, o, seed + k * 101);
    else if (step.op === 'crack') { const cr = crackLines(W, H, step.density ?? 0.5, o.crackWidth, seed + k * 101); for (let p = 0; p < N; p++) if (cr[p]) R[p] *= 0.1; }
    else if (step.op === 'dye') {
      const Rw = wickBlur(R, W, H, o.wick), s = step.strength ?? 1;
      const Aw = step.bath === 'madder' ? wickBlur(A, W, H, o.wick) : null, Fw = step.bath === 'madder' ? wickBlur(F, W, H, o.wick) : null;
      for (let p = 0; p < N; p++) {
        const x = p % W, y = (p / W) | 0;
        const take = (1 - Math.min(1, Rw[p])) * s * (1 + o.mottle * noise2(x / 7, y / 7, seed + k * 31));
        if (step.bath === 'indigo') for (let c = 0; c < 3; c++) OD[c][p] += ABSORB.indigo[c] * take;
        else {
          // where both mordants lie, iron takes the dye first (iron over alum saddens madder to black)
          const ir = Math.min(1, Fw[p]) * (tannin ? 1 : 0.6), al = Math.min(1, Aw[p]) * (1 - ir), none = Math.max(0, 1 - al - ir);
          for (let c = 0; c < 3; c++) {
            OD[c][p] += take * (ABSORB.madderAlum[c] * al + ABSORB.madderIron[c] * ir);
            stain[c][p] += take * ABSORB.madderStain[c] * none;
          }
        }
      }
    } else if (step.op === 'wash') { R.fill(0); for (const s of stain) s.fill(0); }
  }
  const img = cloth({ ...o, unit: o.ground || STRUCTURES.plain, seed, warp: ['#ffffff'], weft: ['#f7f7f7'], ground: '#bdbdbd' });
  const base = hexRgb(o.cloth);
  for (let p = 0; p < N; p++) for (let c = 0; c < 3; c++)
    img.rgb[p * 3 + c] = Math.min(1, img.rgb[p * 3 + c] * base[c] * Math.exp(-(OD[c][p] + stain[c][p])));
  return { ...img, fields: { resist: R, alum: A, iron: F } };
}

// ---- block designs: masks (x, y) -> 0..1 ----
const mod = (a, n) => ((a % n) + n) % n;
export const BLOCKS = {
  // a lattice of circles, `cell` apart, radius r (an inner ring from r0 if given)
  dots: (cell, r, r0 = 0) => (x, y) => { const u = mod(x, cell) - cell / 2, v = mod(y, cell) - cell / 2, d = Math.hypot(u, v); return d < r && d >= r0 ? 1 : 0; },
  // an eight-point star lattice (ajrak's), star radius r in each cell
  stars: (cell, r) => (x, y) => {
    const u = mod(x, cell) - cell / 2, v = mod(y, cell) - cell / 2, a = Math.atan2(v, u), d = Math.hypot(u, v);
    const rr = r * (0.62 + 0.38 * Math.abs(Math.cos(4 * a)) ** 0.6);
    return d < rr ? 1 : 0;
  },
  rect: (x0, y0, x1, y1) => (x, y) => (x >= x0 && x < x1 && y >= y0 && y < y1 ? 1 : 0),
  frame: (x0, y0, x1, y1, w) => (x, y) => (x >= x0 && x < x1 && y >= y0 && y < y1 && !(x >= x0 + w && x < x1 - w && y >= y0 + w && y < y1 - w) ? 1 : 0),
  union: (...ms) => (x, y) => Math.max(...ms.map((m) => m(x, y))),
};
