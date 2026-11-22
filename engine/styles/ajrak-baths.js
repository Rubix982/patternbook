// engine/styles/ajrak-baths.js
// Ajrak Baths: the picture block-printed and dyed as an ajrak is (C-029). The cloth is cut into block cells; each
// cell's tone decides which blocks print there: dark cells keep only a resisted star outline and go indigo; middle
// cells print the star in alum (red after madder) with an iron centre (black), the whole star resisted from the indigo;
// light cells resist the whole star with only a small alum centre (white with a red eye). Then the cloth goes through the baths in order (harda, mordants, resist, indigo,
// wash, madder, wash), and its colours come from the dyes' rules (core/dye.js, C-024), not from a palette.
import { pictureStyle } from '../picture-style.js';
import { luminance } from '../core/picture.js';
import { stretch } from '../helpers.js';
import { dyed, DYE_DEFAULTS } from '../core/dye.js';
import { DEFAULTS } from '../core/weave.js';

const mod = (a, n) => ((a % n) + n) % n;
const star = (u, v, r) => { const a = Math.atan2(v, u), d = Math.hypot(u, v); return d < r * (0.62 + 0.38 * Math.abs(Math.cos(4 * a)) ** 0.6); };

export function treat(pic, p) {
  const W = pic.width, H = pic.height, L = stretch(luminance(pic)), // tones stretched first, as Lumenary's printed styles do
    C = Math.max(8, Math.round(W / p.blocks)), cols = Math.ceil(W / C), rows = Math.ceil(H / C);
  // each cell's mean tone, ranked into three classes at the dials' thresholds
  const tone = new Float32Array(cols * rows), n = new Float32Array(cols * rows);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const c = Math.floor(y / C) * cols + Math.floor(x / C); tone[c] += L[y * W + x]; n[c]++; }
  const cls = new Uint8Array(cols * rows);
  for (let c = 0; c < cls.length; c++) { const t = tone[c] / n[c]; cls[c] = t < p.dark ? 0 : t < p.light ? 1 : 2; }
  const at = (x, y) => cls[Math.min(rows - 1, Math.max(0, Math.floor(y / C))) * cols + Math.min(cols - 1, Math.max(0, Math.floor(x / C)))];
  const R = C * 0.46, inner = C * 0.36, dot = C * 0.12;
  const uv = (x, y) => [mod(x, C) - C / 2, mod(y, C) - C / 2];
  const alum = (x, y) => { const k = at(x, y), [u, v] = uv(x, y); return (k === 1 && star(u, v, inner) && Math.hypot(u, v) >= dot * 1.4) || (k === 2 && Math.hypot(u, v) < dot) ? 1 : 0; };
  const iron = (x, y) => { const k = at(x, y), [u, v] = uv(x, y); return k === 1 && Math.hypot(u, v) < dot ? 1 : 0; };
  const resist = (x, y) => { const k = at(x, y), [u, v] = uv(x, y);
    if (k >= 1) return star(u, v, R) ? 1 : 0;               // middle and light: the whole star kept from the indigo
    return star(u, v, R) && !star(u, v, R * 0.84) ? 1 : 0; }; // dark: only a white outline
  const order = p.order === 'indigo first'
    ? ['harda', 'alum', 'iron', 'indigo', 'indigo', 'resist', 'wash', 'madder', 'wash']
    : ['harda', 'alum', 'iron', 'resist', 'indigo', 'indigo', 'wash', 'madder', 'wash'];
  const tile = [C, C], steps = order.map((s) => (s === 'harda' ? { op: 'harda' } : s === 'wash' ? { op: 'wash' }
    : s === 'indigo' || s === 'madder' ? { op: 'dye', bath: s } : { op: 'print', layer: s, mask: { alum, iron, resist }[s], tile }));
  const f = p.print / 50, k = Math.max(W, H) / 600;
  return dyed({ ...DEFAULTS, ...DYE_DEFAULTS, width: W, height: H, sett: Math.max(2, Math.round(3 * k)), slub: 0.15, seed: p.seed, steps,
    impression: Math.min(0.6, DYE_DEFAULTS.impression * f), reg: DYE_DEFAULTS.reg * f * k, spread: DYE_DEFAULTS.spread * k,
    wick: DYE_DEFAULTS.wick * k, mottle: DYE_DEFAULTS.mottle * f });
}

export default pictureStyle({
  id: 'ajrak-baths',
  name: 'Ajrak Baths',
  blurb: "The picture block-printed and dyed as an ajrak: each block's tone decides which blocks print resist, alum or iron, and the colours come out of the baths in order.",
  maxSide: 900,
  params: [
    { key: 'blocks', label: 'Blocks across', type: 'range', min: 6, max: 60, step: 1, default: 22 },
    { key: 'dark', label: 'Indigo below', type: 'range', min: 0.05, max: 0.6, step: 0.01, default: 0.33 },
    { key: 'light', label: 'White above', type: 'range', min: 0.4, max: 0.95, step: 0.01, default: 0.62 },
    { key: 'order', label: 'Bath order', type: 'select', default: 'ajrak', options: [['ajrak', 'Resist, indigo, then madder'], ['indigo first', 'Indigo before the resist']] },
    { key: 'print', label: 'Hand-printed look', type: 'range', min: 0, max: 100, step: 1, default: 50 },
    { key: 'seed', label: 'New printing', type: 'shuffle', default: 4 },
  ],
  treat,
});
