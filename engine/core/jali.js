// engine/core/jali.js
// A pierced screen with thickness: the primitive `thick-screen` (processes/primitives.md), written in C-028 because the
// primitives give pierced screens as flat openings, and the light a screen's depth throws is an unshared offset lookup
// in two models.
//
// The process. A jali is cut from a single block of stone (sandstone, marble), the pattern laid out by stencil, the
// openings drilled and chiselled through; what remains is the lattice. Constraints. The stone has depth, so every
// opening is a short tunnel: a ray passes only if it clears both faces. Sunlight coming in at an angle is cut down by
// the opening's walls before it reaches the room, and lands on the wall inside shifted by the angle, its edges
// softened by the sun's size the further it travels. Seen at an angle, each opening shows part of its own inner wall,
// lit if that wall faces the sun's side. Imperfections. Hand-cut openings differ a little in size; their edges wear
// round; the stone has grain, and the chisel leaves marks on the walls; the wall inside is plaster, not quite even.
import { noise2, hash2 } from './random.js';
import { gauss } from './glaze.js';

const hexRgb = (h) => {
  const n = parseInt(String(h).replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};
const mod = (a, n) => ((a % n) + n) % n;
const rad = (d) => (d * Math.PI) / 180;

// ---- patterns: (x, y) -> true where the stone is cut through; `vary` changes each opening's size a little ----
export const LATTICES = {
  squares: (cell, bar, vary = 0, seed = 1) => (x, y) => {
    const i = Math.floor(x / cell), j = Math.floor(y / cell), h = (bar / 2) * (1 + vary * (cell / bar) * (hash2(i, j, seed + 501) * 2 - 1));
    const u = mod(x, cell), v = mod(y, cell);
    return u >= h && u < cell - h && v >= h && v < cell - h;
  },
  // eight-point stars on a square grid, with a small square opening where four cells meet
  stars: (cell, r, vary = 0, seed = 1) => (x, y) => {
    const i = Math.floor(x / cell), j = Math.floor(y / cell), rr = r * (1 + vary * (hash2(i, j, seed + 503) * 2 - 1));
    const u = mod(x, cell) - cell / 2, v = mod(y, cell) - cell / 2, a = Math.atan2(v, u), d = Math.hypot(u, v);
    const star = d < rr * (0.64 + 0.36 * Math.abs(Math.cos(4 * a)) ** 0.7);
    const cu = Math.abs(mod(x + cell / 2, cell) - cell / 2), cv = Math.abs(mod(y + cell / 2, cell) - cell / 2);
    return star || (Math.max(cu, cv) < cell * 0.09);
  },
  // hexagons in a honeycomb
  hexagons: (cell, bar, vary = 0, seed = 1) => (x, y) => {
    const s = cell / Math.sqrt(3), q = ((Math.sqrt(3) / 3) * x - (1 / 3) * y) / s, rr = ((2 / 3) * y) / s;
    let cx = Math.round(q), cz = Math.round(rr), cy = Math.round(-q - rr);
    const dx = Math.abs(cx - q), dz = Math.abs(cz - rr), dy = Math.abs(cy + q + rr);
    if (dx > dy && dx > dz) cx = -cy - cz; else if (dy <= dz) cz = -cx - cy;
    const px = s * Math.sqrt(3) * (cx + cz / 2), py = s * 1.5 * cz;
    const u = Math.abs(x - px), v = Math.abs(y - py), apo = (cell / 2) * (1 + vary * (hash2(cx, cz, seed + 507) * 2 - 1)) - bar / 2;
    return Math.max(u, (u + Math.sqrt(3) * v) / 2) < apo;
  },
};

export const JALI_DEFAULTS = { thickness: 12, sunAngle: 25, sunAzimuth: 0, viewAngle: 0, viewAzimuth: 0, distance: 240, sunSize: 0.27,
  sun: 0.7, sky: 0.1, ambient: 0.25, stone: '#c79c74', outside: '#eef3f6', plaster: '#ebe3d6',
  vary: 0.04, wear: 0.8, grain: 0.08, chisel: 0.14, unevenWall: 0.04, samples: 2 };

const dirOf = (az) => [Math.cos(rad(az)), Math.sin(rad(az))];

// The screen seen from inside the room. Options: width, height, seed; open(x, y) the pattern; thickness (px); the eye
// `viewAngle` degrees off the screen's normal towards `viewAzimuth`; the sun's angle and azimuth (which inner walls it
// lights); stone and outside colours; wear, grain, chisel (the imperfections).
export function screenView(opts) {
  const o = { ...JALI_DEFAULTS, ...opts };
  const W = o.width, H = o.height, seed = o.seed || 1, S = o.samples, open = o.open;
  const [vx, vy] = dirOf(o.viewAzimuth), sh = o.thickness * Math.tan(rad(o.viewAngle));
  const [sx, sy] = dirOf(o.sunAzimuth), wallLit = o.sunAngle > 0 && sx * vx + sy * vy < 0;
  const stone = hexRgb(o.stone), outside = hexRgb(o.outside), rgb = new Float32Array(W * H * 3);
  const probes = Array.from({ length: 8 }, (_, k) => [Math.cos((k * Math.PI) / 4) * o.wear, Math.sin((k * Math.PI) / 4) * o.wear]);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const acc = [0, 0, 0];
    for (let a = 0; a < S; a++) for (let b = 0; b < S; b++) {
      const px = x + (a + 0.5) / S, py = y + (b + 0.5) / S;
      let c;
      if (!open(px, py)) {
        // the face towards the room, in the room's light; the arris worn round near an opening catches a little more
        const g = 1 + o.grain * noise2(px / 2.3, py / 2.3, seed + 511) + 0.5 * o.grain * noise2(px / 9, py / 9, seed + 513);
        const worn = o.wear > 0 && probes.some(([dx, dy]) => open(px + dx, py + dy)) ? 1.18 : 1;
        c = stone.map((v) => v * 0.62 * g * worn);
      } else if (sh === 0 || open(px + sh * vx, py + sh * vy)) {
        // a line of sight through both faces: the outside, brighter towards the top
        c = outside.map((v) => Math.min(1, v * (0.97 + 0.03 * (1 - py / H))));
      } else {
        // the opening's inner wall: chisel marks run through the stone's depth
        const m = 1 + o.chisel * noise2((px * vy - py * vx) / 1.1, (px * vx + py * vy) / 7, seed + 517);
        c = stone.map((v) => v * (wallLit ? 1.12 : 0.42) * m);
      }
      for (let k = 0; k < 3; k++) acc[k] += c[k];
    }
    for (let k = 0; k < 3; k++) rgb[(y * W + x) * 3 + k] = Math.min(1, acc[k] / (S * S));
  }
  return { width: W, height: H, rgb };
}

// The sunlight through the screen, on a plaster wall inside, parallel to it, `distance` px away. A ray from the sun
// `sunAngle` degrees off the normal, from towards `sunAzimuth`, passes where it clears both faces of the stone; it
// lands shifted by distance x tan(angle); the sun's angular radius `sunSize` (degrees) softens its edges by
// distance x tan(sunSize); the sky adds a faint, wide glow.
export function castLight(opts) {
  const o = { ...JALI_DEFAULTS, ...opts };
  const W = o.width, H = o.height, N = W * H, seed = o.seed || 1, S = o.samples, open = o.open;
  const [sx, sy] = dirOf(o.sunAzimuth), tn = Math.tan(rad(o.sunAngle)), through = o.thickness * tn, land = o.distance * tn;
  const T = new Float64Array(N), G = new Float64Array(N);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let t = 0, g = 0;
    for (let a = 0; a < S; a++) for (let b = 0; b < S; b++) {
      const px = x + (a + 0.5) / S + land * sx, py = y + (b + 0.5) / S + land * sy;
      const front = open(px, py);
      if (front && open(px + through * sx, py + through * sy)) t++;
      if (front) g++;
    }
    T[y * W + x] = t / (S * S); G[y * W + x] = g / (S * S);
  }
  const pen = (o.distance * Math.tan(rad(o.sunSize))) / 2, Tb = gauss(T, W, H, pen), Gb = gauss(G, W, H, Math.max(2, o.distance * 0.35));
  const plaster = hexRgb(o.plaster), rgb = new Float32Array(N * 3), cos = Math.cos(rad(o.sunAngle));
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const p = y * W + x, e = 1 + o.unevenWall * noise2(x / 5, y / 5, seed + 521);
    const light = o.ambient + o.sun * cos * Tb[p] + o.sky * Gb[p];
    for (let k = 0; k < 3; k++) rgb[p * 3 + k] = Math.min(1, plaster[k] * light * e * (k === 2 ? 0.97 : 1));
  }
  return { width: W, height: H, rgb, transmitted: T };
}
