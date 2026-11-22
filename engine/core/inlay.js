// engine/core/inlay.js
// Inlay cut from banded stone and fitted to the motif: the primitive `inlay-cut` (processes/primitives.md), written in
// C-027 because the primitives give inlay only as Voronoi regions in a fixed palette.
//
// The process (parchin kari, as sources describe it). The design is drawn on Makrana marble and its pieces carved out
// as recesses. Stones such as lapis lazuli, carnelian, malachite and jasper are sliced and cut to the shape of each
// recess, fitted so closely that the joins are practically invisible, and the surface is scrubbed, buffed and
// polished. Constraints. A piece is cut from somewhere in a slab of stone, so what it shows is the stone's own bands and
// veins, at the place and the turn the cutter chose; each piece's edge is its recess's edge, the motif's own outline.
// The cutter's choice (C-018's premise, not sourced): turn each piece so the stone's bands run along it. Imperfections.
// The turn is a few degrees off; the seam's width varies; an edge chips here and there; the polish is uneven.
import { noise2, hash2 } from './random.js';
import { signedDistance } from './field.js';

const hexRgb = (h) => {
  const n = parseInt(String(h).replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};
const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// Stones in their own coordinates (u across the bands, v along them): base and band colours, how strongly banded, the
// bands' period in pixels, how much they wander, veins, and flecks (lapis's pyrite).
export const STONES = {
  makrana: { base: '#ece8df', band: '#e0dbd1', vein: '#bdb7ac', bands: 0.3, period: 34, warp: 0.9, veins: 0.45, veinScale: 55 },
  lapis: { base: '#27428e', band: '#1c306f', vein: '#cdb779', bands: 0.35, period: 11, warp: 1.2, veins: 0.15, flecks: 0.015 },
  carnelian: { base: '#b9481f', band: '#e07d3e', vein: '#f2c28c', bands: 0.75, period: 7, warp: 0.5, veins: 0.05 },
  jasper: { base: '#9c3525', band: '#5f1d15', vein: '#d27a5c', bands: 0.65, period: 6, warp: 0.8, veins: 0.15 },
  malachite: { base: '#22895a', band: '#0c4c2c', vein: '#47b57d', bands: 1, period: 5, warp: 0.6, veins: 0 },
  agate: { base: '#d6c7aa', band: '#7d5d3f', vein: '#efe4cf', bands: 0.85, period: 4.5, warp: 0.7, veins: 0.05 },
};

// A stone's colour at (u, v) in its own coordinates.
export function stoneAt(stone, u, v, sid) {
  const s = typeof stone === 'string' ? STONES[stone] : stone;
  const base = s._b || (s._b = hexRgb(s.base)), band = s._d || (s._d = hexRgb(s.band)), vein = s._v || (s._v = hexRgb(s.vein));
  const ph = u / s.period + s.warp * noise2(u / 23, v / 61, sid);
  const b = smooth(0.25, 0.75, 0.5 + 0.5 * Math.sin(2 * Math.PI * ph)) * s.bands;
  let c = [0, 1, 2].map((k) => base[k] * (1 - b) + band[k] * b);
  if (s.veins > 0) {
    const vs = s.veinScale || 15, r = Math.abs(noise2(u / vs, v / vs, sid + 5) + 0.35 * noise2(u / (vs * 0.4), v / (vs * 0.4), sid + 7));
    const w = s.veins * (1 - smooth(0, 0.035, r));
    c = c.map((x, k) => x * (1 - w) + vein[k] * w);
  }
  if (s.flecks && hash2(Math.floor(u * 1.3), Math.floor(v * 1.3), sid + 9) < s.flecks) c = vein.slice();
  return c;
}

// ---- pieces: a lens (pointed at both ends, as a petal or leaf) and a disc; each knows its long axis ----
export const PIECES = {
  lens: (cx, cy, length, width, angle) => {
    const ca = Math.cos(angle), sa = Math.sin(angle);
    return { cx, cy, axis: angle, elongation: length / width, inside: (x, y) => {
      const u = (x - cx) * ca + (y - cy) * sa, v = -(x - cx) * sa + (y - cy) * ca, t = u / length + 0.5;
      return t > 0 && t < 1 && Math.abs(v) < (width / 2) * Math.sin(Math.PI * t) ** 0.8;
    } };
  },
  disc: (cx, cy, r) => ({ cx, cy, axis: 0, elongation: 1, inside: (x, y) => (x - cx) ** 2 + (y - cy) ** 2 < r * r }),
};

// A floral panel: flowers of `petals` petals round a lapis centre, each with two leaves on a stem.
export function floral(W, H, { flowers = [[0.33, 0.36], [0.68, 0.64]], size = 0.11, petals = 8, petalStones = ['carnelian', 'jasper'] } = {}) {
  const S = Math.min(W, H), out = [];
  for (const [fi, [fx, fy]] of flowers.entries()) {
    const cx = fx * W, cy = fy * H, L = size * S, w = 0.36 * L;
    for (let k = 0; k < petals; k++) {
      const a = (2 * Math.PI * k) / petals + fi * 0.2, d = 0.28 * L + L / 2;
      out.push({ ...PIECES.lens(cx + d * Math.cos(a), cy + d * Math.sin(a), L, w, a), stone: petalStones[k % petalStones.length] });
    }
    out.push({ ...PIECES.disc(cx, cy, 0.24 * L), stone: 'lapis' });
    // a stem down from the flower and two leaves off it
    const sx = cx, sy = cy + 1.45 * L, stem = PIECES.lens(sx, sy + 0.55 * L, 1.1 * L, 0.16 * L, Math.PI / 2);
    out.push({ ...stem, stone: 'agate' });
    for (const side of [-1, 1]) {
      const a = Math.PI / 2 + side * 1.05, d = 0.62 * L;
      out.push({ ...PIECES.lens(sx + side * 0.06 * L + d * Math.cos(a) * 0.9, sy + 0.45 * L + d * Math.sin(a) * 0.2, 1.15 * L, 0.42 * L, a + (side > 0 ? 0 : Math.PI)), stone: 'malachite' });
    }
  }
  return out.filter((p) => p.cx > 0 && p.cy > 0 && p.cx < W && p.cy < H);
}

export const INLAY_DEFAULTS = { ground: 'makrana', seam: 0.7, adhesive: '#4d443c', seamTone: 0.55, cut: 'fitted', cell: 9,
  turn: 'along', turnErr: 5, seamVary: 0.4, chips: 0.012, gloss: 0.28, sheen: [0.35, 0.3], sheenSize: 0.4, polish: 0.25 };

// The panel. Options:
//   width, height, seed; pieces [{ inside, cx, cy, axis, stone }] (see `floral`); ground: the marble's stone
//   cut       'fitted' (each piece to its own recess) or 'cells' (the same design cut as Voronoi cells `cell` px across:
//             the control)
//   turn      'along' (each piece turned so its stone's bands run along its long axis) or 'random' (the control);
//             turnErr: how far off, in degrees
//   seam, adhesive, seamTone   the seam's width (px), the adhesive's colour, how much it shows
//   seamVary, chips            how the seam's width varies, how often an edge chips
//   gloss, sheen, sheenSize, polish   the polished surface's highlight: strength, centre (shares of the panel), size,
//             and how unevenly it is polished
export function inlaid(opts) {
  const o = { ...INLAY_DEFAULTS, ...opts };
  const W = o.width, H = o.height, N = W * H, seed = o.seed || 1, pieces = o.pieces || [];
  const rgb = new Float32Array(N * 3), owner = new Int16Array(N).fill(-1);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const c = stoneAt(o.ground, x + 0.5, y + 0.5, seed + 1);
    for (let k = 0; k < 3; k++) rgb[(y * W + x) * 3 + k] = c[k];
  }
  // each piece's frame in its stone: an offset into the slab, and a turn
  const frames = pieces.map((pc, i) => {
    const err = ((o.turnErr * Math.PI) / 180) * (hash2(i, 1, seed + 31) * 2 - 1);
    const a = o.turn === 'random' ? Math.PI * hash2(i, 2, seed + 37) : pc.axis + err;
    return { ca: Math.cos(a), sa: Math.sin(a), ou: 500 * hash2(i, 3, seed + 41), ov: 500 * hash2(i, 4, seed + 43), sid: seed + 100 + 7 * i };
  });
  const colourOf = (i, x, y) => { const f = frames[i], dx = x - pieces[i].cx, dy = y - pieces[i].cy; return stoneAt(pieces[i].stone, -dx * f.sa + dy * f.ca + f.ou, dx * f.ca + dy * f.sa + f.ov, f.sid); };
  const adhesive = hexRgb(o.adhesive), seamMix = (p, w) => { for (let k = 0; k < 3; k++) rgb[p * 3 + k] = rgb[p * 3 + k] * (1 - w) + adhesive[k] * w; };
  const seamW = (x, y) => o.seam * (1 + o.seamVary * noise2(x / 6, y / 6, seed + 51));
  const sdOf = [];
  if (o.cut === 'cells') {
    // the control: the panel cut into Voronoi cells; a cell takes the stone of the piece its seed lies in
    const cell = o.cell, seedAt = (i, j) => [(i + 0.15 + 0.7 * hash2(i, j, seed + 61)) * cell, (j + 0.15 + 0.7 * hash2(i, j, seed + 63)) * cell];
    const pieceAt = (x, y) => pieces.findIndex((pc) => pc.inside(x, y));
    const cache = new Map(), ownerOf = (i, j) => { const k = `${i},${j}`; if (!cache.has(k)) { const [sx, sy] = seedAt(i, j); cache.set(k, pieceAt(sx, sy)); } return cache.get(k); };
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const ci = Math.floor((x + 0.5) / cell), cj = Math.floor((y + 0.5) / cell);
      let d1 = Infinity, d2 = Infinity, best = null, second = null;
      for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) {
        const [sx, sy] = seedAt(ci + a, cj + b), d = Math.hypot(x + 0.5 - sx, y + 0.5 - sy);
        if (d < d1) { d2 = d1; second = best; d1 = d; best = [ci + a, cj + b]; } else if (d < d2) { d2 = d; second = [ci + a, cj + b]; }
      }
      const i = ownerOf(...best), j = ownerOf(...second), p = y * W + x;
      if (i >= 0) { const c = colourOf(i, x + 0.5, y + 0.5); for (let k = 0; k < 3; k++) rgb[p * 3 + k] = c[k]; owner[p] = i; }
      if ((i >= 0 || j >= 0) && (d2 - d1) / 2 < seamW(x, y) / 2) seamMix(p, o.seamTone * (1 - smooth(0, seamW(x, y) / 2, (d2 - d1) / 2) * 0.5));
    }
  } else {
    for (const [i, pc] of pieces.entries()) {
      // the piece's signed distance in a window round it (positive inside)
      let x0 = W, y0 = H, x1 = 0, y1 = 0;
      for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (pc.inside(x + 0.5, y + 0.5)) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
      if (x1 < x0) { sdOf.push(null); continue; }
      x0 = Math.max(0, x0 - 6); y0 = Math.max(0, y0 - 6); x1 = Math.min(W - 1, x1 + 6); y1 = Math.min(H - 1, y1 + 6);
      const w = x1 - x0 + 1, h = y1 - y0 + 1;
      const sd = signedDistance((x, y) => pc.inside(x + x0, y + y0), w, h);
      sdOf.push({ x0, y0, w, h, sd });
      // the recess's edge is the outline (d = 0); the piece is smaller by the seam, which the adhesive fills. Each pixel
      // takes marble, seam and stone by how much of it each covers.
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
        const d = sd[(y - y0) * w + (x - x0)], p = y * W + x;
        // a chip: a notch where the stone's edge broke, the seam wider there
        const chip = o.chips > 0 && d > 0 && d < 3 && hash2(Math.floor(x / 3), Math.floor(y / 3), seed + 71 + i) < o.chips;
        const sw = Math.max(0, seamW(x, y)) + (chip ? 1.5 : 0);
        const wS = Math.max(0, Math.min(1, d - sw + 0.5)), wG = Math.max(0, Math.min(1, 0.5 - d)), wA = Math.max(0, 1 - wS - wG);
        if (wS + wA <= 0) continue;
        const c = colourOf(i, x + 0.5, y + 0.5), g = [rgb[p * 3], rgb[p * 3 + 1], rgb[p * 3 + 2]];
        for (let k = 0; k < 3; k++) {
          const seamCol = adhesive[k] * o.seamTone + 0.5 * (g[k] + c[k]) * (1 - o.seamTone); // a hair-thin seam lets its neighbours show
          rgb[p * 3 + k] = wG * g[k] + wA * seamCol + wS * c[k];
        }
        if (wS > 0.5) owner[p] = i;
      }
    }
  }
  // the polish: a broad highlight across the flat surface, uneven, weaker in the seams
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const p = y * W + x, dx = x / W - o.sheen[0], dy = y / H - o.sheen[1];
    const g = o.gloss * Math.exp(-(dx * dx + dy * dy) / (2 * o.sheenSize ** 2)) * (1 + o.polish * noise2(x / 37, y / 37, seed + 81));
    for (let k = 0; k < 3; k++) rgb[p * 3 + k] = Math.min(1, rgb[p * 3 + k] + Math.max(0, g) * (1 - rgb[p * 3 + k]) * 0.6);
  }
  return { width: W, height: H, rgb, owner, sd: sdOf };
}
