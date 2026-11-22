// runs/c032/hand-sketch.mjs: one design from exact to carved, for the writer's question "what makes it look made?"
// The amplitudes are guesses for illustration, not measured (measuring them is the next card). A first guess, the
// chisel's radius at 0.6 of a bar, rounded the eight-point stars into blobs; these are gentler.
//   node runs/c032/hand-sketch.mjs  ->  runs/c032/hand-sketch/*.png
import { writeFileSync, mkdirSync } from 'node:fs';
import { designJali } from '../../engine/core/jali-design.js';
import { screenView } from '../../engine/core/jali.js';
import { toRGBA } from '../../engine/core/picture.js';
import { encodePng } from '../../engine/png.js';

mkdirSync('runs/c032/hand-sketch', { recursive: true });
const base = { tiling: '4.8.8', kind: 'strands', angle: 67.5, barOverOpening: 0.4, frame: 'pointed', across: 7, hand: 0, seed: 5 };
const STAGES = [
  ['1-exact', {}],
  ['2-setting-out', { drift: 0.04, jitter: 0.015 }],
  ['3-chisel', { drift: 0.04, jitter: 0.015, hand: 0.25, round: 0.25 }],
  ['4-weathered', { drift: 0.04, jitter: 0.015, hand: 0.25, round: 0.25, wear: 0.15 }],
];
let last;
for (const [name, extra] of STAGES) {
  const d = designJali({ ...base, ...extra }), data = new Uint8ClampedArray(d.width * d.height * 4);
  for (let p = 0; p < d.width * d.height; p++) { const s = d.stone[p]; data[p * 4] = s ? 201 : 18; data[p * 4 + 1] = s ? 138 : 16; data[p * 4 + 2] = s ? 92 : 20; data[p * 4 + 3] = 255; }
  writeFileSync(`runs/c032/hand-sketch/${name}.png`, encodePng({ width: d.width, height: d.height, data }));
  last = d;
  console.log(name, JSON.stringify(extra), `bar ${d.recipe.bar}px opening ${d.recipe.opening}px`);
}
// the weathered one as stone seen from inside, 3.5 openings deep, the eye 5 degrees off, late sun from the side
const d = last, W = d.width, H = d.height;
const pic = screenView({ width: W, height: H, seed: 5, open: (x, y) => { const p = Math.floor(y) * W + Math.floor(x); return d.slab[p] === 1 && d.stone[p] === 0; },
  thickness: 3.5 * d.recipe.opening, viewAngle: 3, viewAzimuth: 200, sunAngle: 30, sunAzimuth: 20, stone: '#b9785a', outside: '#f3e7cf', wear: 1.2, grain: 0.1, chisel: 0.2 });
writeFileSync('runs/c032/hand-sketch/5-as-stone.png', encodePng({ width: W, height: H, data: toRGBA(pic) }));
console.log('5-as-stone');

// 6: the same stone as relief, lit from the front as a museum photographs it: each bar a rounded ribbon (its height
// rises with the distance from the nearest opening, a quarter circle across half a bar), shaded by a light from the
// upper left, the openings in deep shadow, the stone's colour varying a little over the panel
{
  const { signedDistance } = await import('../../engine/core/field.js');
  const { noise2 } = await import('../../engine/core/random.js');
  const sd = signedDistance((x, y) => { const p = Math.floor(y) * W + Math.floor(x); return d.slab[p] === 1 && d.stone[p] === 1; }, W, H);
  const R = d.recipe.bar / 2, hgt = new Float32Array(W * H);
  for (let p = 0; p < W * H; p++) { const t = Math.min(Math.max(sd[p], 0), R) / R; hgt[p] = Math.sqrt(Math.max(0, 1 - (1 - t) ** 2)) * R; }
  const L = [-0.55, -0.6, 0.58], ln = Math.hypot(...L), data = new Uint8ClampedArray(W * H * 4), base = [176, 116, 82];
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    const p = y * W + x, q = p * 4;
    if (!(d.slab[p] && d.stone[p])) { const e = Math.max(0, Math.min(1, -sd[p] / 6)); const v = 30 - 18 * e; data[q] = v; data[q + 1] = v * 0.8; data[q + 2] = v * 0.7; data[q + 3] = 255; continue; }
    const gx = (hgt[p + 1] - hgt[p - 1]) / 2, gy = (hgt[p + W] - hgt[p - W]) / 2, n = [-gx, -gy, 1], nl = Math.hypot(...n);
    const lam = Math.max(0, (n[0] * L[0] + n[1] * L[1] + n[2] * L[2]) / (nl * ln));
    const tint = 1 + 0.08 * noise2(x / 180, y / 180, 3) + 0.05 * noise2(x / 9, y / 9, 4), occ = 0.75 + 0.25 * Math.min(1, sd[p] / R);
    const sh = (0.3 + 0.8 * lam) * tint * occ;
    data[q] = base[0] * sh; data[q + 1] = base[1] * sh; data[q + 2] = base[2] * sh; data[q + 3] = 255;
  }
  writeFileSync('runs/c032/hand-sketch/6-relief.png', encodePng({ width: W, height: H, data }));
  console.log('6-relief');
}
