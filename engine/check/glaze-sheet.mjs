// engine/check/glaze-sheet.mjs: glaze to look at: a kashi-like tile (cobalt outlines, turquoise fill, a sgraffito ring
// cut to the red clay, under clear glaze), the pooling test, the dome glazed and bare, and the lines under thin and
// thick glaze.
//   node engine/check/glaze-sheet.mjs runs/c026/glaze-sheet.png
import { glazed, GLAZE_DEFAULTS } from '../core/glaze.js';
import { SHAPES } from '../core/kantha.js';
import { signedDistance } from '../core/field.js';
import { writePng, sheet } from './png.mjs';

const out = process.argv[2] || 'runs/c026/glaze-sheet.png';
const T = 288, base = { ...GLAZE_DEFAULTS, width: T, height: T, seed: 3 };
const lotus = SHAPES.lotus(T / 2, T / 2, T * 0.36, 8), sd = signedDistance(lotus, T, T);
const at = (x, y) => sd[Math.min(T - 1, Math.floor(y)) * T + Math.min(T - 1, Math.floor(x))];
const ring = (x, y) => Math.abs(Math.hypot(x - T / 2, y - T / 2) - T * 0.45);
const tile = glazed({ ...base,
  body: (x, y) => -1.6 * Math.max(0, 1 - ring(x, y) / 1.6),
  cut: (x, y) => (ring(x, y) < 1.3 ? 1 : 0),
  paint: [{ mask: (x, y) => (at(x, y) > 1.2 ? 1 : 0), colour: '#33a9a3' }, { mask: (x, y) => (Math.abs(at(x, y)) <= 1.2 ? 1 : 0), colour: '#1d3f9a' },
    { mask: (x, y) => (Math.hypot(x - T / 2, y - T / 2) < T * 0.07 ? 1 : 0), colour: '#1d3f9a' }] });
const FEAT = Array.from({ length: 7 }, (_, k) => ({ y: 26 + k * 40, s: k % 2 ? 3 : -3 }));
const pool = glazed({ ...base, tint: [0.06, 0.05, 0.3], body: (x, y) => FEAT.reduce((h, f) => h + f.s * (Math.abs(y - f.y) < 4 ? Math.cos((Math.PI * (y - f.y)) / 8) ** 2 : 0), 0) });
const dome = (x, y) => 9 * Math.exp(-((x - T / 2) ** 2 + (y - T / 2) ** 2) / (2 * 64 * 64)) + 0.6 * Math.sin(x / 1.3 + 2 * Math.sin(y / 9)) * Math.cos(y / 1.7);
const glz = glazed({ ...base, body: dome }), bare = glazed({ ...base, body: dome, glaze: false });
const lines = glazed({ ...base, paint: [{ mask: (x) => (Math.abs(((x % 24) + 24) % 24 - 12) < 1.5 ? 1 : 0), colour: '#1d3f9a' }], amountAt: (x) => 0.4 + 1.6 * (x / T) });
const s = sheet([tile, pool, glz, bare, lines], 5);
writePng(out, s.width, s.height, s.rgb);
console.log(`wrote ${out}: a kashi-like tile; pooling (tint strengthened to show); dome glazed; dome bare; lines, glaze thin to thick`);
