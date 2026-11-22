// engine/check/jali-compose.mjs
// C-037's whole screens: for each real jali in runs/c037/reals.json (row k, its layout and its slab's proportions), a
// screen in the same layout: the pattern by C-032's rule (design k), the layout's dials drawn within C-034's ranges
// (C's and D's from their photos by eye, labelled guesses), the irregularity at the generator's defaults.
//   node engine/check/jali-compose.mjs [--out runs/c037/designs]
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { designJali, TILING_NAMES } from '../core/jali-design.js';
import { encodePng } from '../png.js';
import { rng } from '../core/random.js';

const out = process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : 'runs/c037/designs';
mkdirSync(out, { recursive: true });
const ACROSS = { '4.4.4.4': [9, 14], '6.6.6': [8, 13], '4.8.8': [6, 10], '3.12.12': [5, 8], '4.6.12': [3.5, 5.5], '3.6.3.6': [6, 10] };
const lerp = (r, u) => r[0] + (r[1] - r[0]) * u;
function cardDesign(k) { // C-032's rule, unchanged (frame and thickness unused here)
  const r = rng(k), u = [r(), r(), r(), r(), r()], tiling = TILING_NAMES[k % 6];
  return { seed: k, kind: k % 4 === 0 ? 'cells' : 'strands', tiling, angle: +(35 + 45 * u[0]).toFixed(1), barOverOpening: +(0.31 + 0.58 * u[1]).toFixed(3),
    hand: +(0.4 * u[2]).toFixed(3), across: +lerp(ACROSS[tiling], u[3]).toFixed(2) };
}
const U = (r, a, b) => +(a + (b - a) * r()).toFixed(3);
function layoutDials(layout, k) {
  const r = rng(k + 3700);
  if (layout === 'A') return { plain: U(r, 0.13, 0.15) };
  if (layout === 'B') return { sideMargin: U(r, 0.145, 0.167), topMargin: U(r, 0.23, 0.3), archRadius: U(r, 0.55, 0.63), moulding: U(r, 0.012, 0.022) };
  if (layout === 'C') return { outer: U(r, 0.04, 0.08), band: U(r, 0.05, 0.07), inner: U(r, 0.02, 0.035), archRadius: U(r, 0.55, 0.63), moulding: U(r, 0.015, 0.025), motif: ['quatrefoil', 'cross', 'diamond'][Math.floor(r() * 3)] };
  return { edge: U(r, 0.02, 0.03), band: U(r, 0.04, 0.06), inner: U(r, 0.015, 0.03), motif: ['quatrefoil', 'cross', 'diamond'][Math.floor(r() * 3)] };
}
const reals = JSON.parse(readFileSync('runs/c037/reals.json')), recipes = {};
const rows = ['id\trole\tfamily\tframe\tmaterial\tdate\tplace\twidth_mm\theight_mm\tdepth_mm\tlicence\timage\tpage\tsettings\tstatus\tnote'];
for (const re of reals) {
  const k = re.row, H = 1400, W = Math.round(180 + (H - 180) * re.aspect), id = `screen-${String(k).padStart(2, '0')}`;
  const spec = { ...cardDesign(k), layout: re.layout, ...layoutDials(re.layout, k), width: W, height: H };
  const d = designJali(spec), q = rng(k + 4000), data = new Uint8ClampedArray(d.width * d.height * 4);
  for (let p = 0; p < d.width * d.height; p++) { const n = (q() - 0.5) * 18, s = d.stone[p]; data[p * 4] = s ? 214 + n : 12; data[p * 4 + 1] = s ? 190 + n : 12; data[p * 4 + 2] = s ? 160 + n : 14; data[p * 4 + 3] = 255; }
  writeFileSync(join(out, `${id}.png`), encodePng({ width: d.width, height: d.height, data }));
  recipes[id] = d.recipe;
  rows.push([id, 'design', 'geometric', re.layout, 'generated', '', '', '', '', '', 'generated (patternbook)', join(out, `${id}.png`), '', '', 'measured', `${spec.kind} on ${spec.tiling}, layout ${re.layout}`].join('\t'));
  console.log(id, re.layout, 'for', re.id, `aspect ${re.aspect}`, `bar ${d.recipe.bar}`);
}
writeFileSync(join(out, 'samples.tsv'), rows.join('\n') + '\n');
writeFileSync(join(out, 'recipes.json'), JSON.stringify(recipes, null, 1) + '\n');
