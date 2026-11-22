// engine/check/jali-blind.mjs
// C-035's candidates: designs by C-032's rule (the same as cardDesign in engine/check/jali-design.mjs), now with the
// irregularity C-033 measured (the generator's defaults: jitter 0.048, drift 0.16), rendered as a museum would photograph
// them, for tools/screen_measure.py. The first 12 that measure inside real jalis' ranges go into the blind pick.
//   node engine/check/jali-blind.mjs [--from 1] [--to 36] [--out runs/c035/designs]
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { designJali, TILING_NAMES } from '../core/jali-design.js';
import { encodePng } from '../png.js';
import { rng } from '../core/random.js';

const arg = (k, d) => (process.argv.includes(k) ? process.argv[process.argv.indexOf(k) + 1] : d);
const out = arg('--out', 'runs/c035/designs'), from = +arg('--from', 1), to = +arg('--to', 36);
mkdirSync(out, { recursive: true });
const ACROSS = { '4.4.4.4': [9, 14], '6.6.6': [8, 13], '4.8.8': [6, 10], '3.12.12': [5, 8], '4.6.12': [3.5, 5.5], '3.6.3.6': [6, 10] };
const lerp = (r, u) => r[0] + (r[1] - r[0]) * u;
function cardDesign(k) { // C-032's rule, unchanged
  const r = rng(k), u = [r(), r(), r(), r(), r()], tiling = TILING_NAMES[k % 6];
  return { seed: k, kind: k % 4 === 0 ? 'cells' : 'strands', tiling, angle: +(35 + 45 * u[0]).toFixed(1), barOverOpening: +(0.31 + 0.58 * u[1]).toFixed(3),
    hand: +(0.4 * u[2]).toFixed(3), frame: k % 6 === 0 ? 'cusped' : k % 2 ? 'rect' : 'pointed', across: +lerp(ACROSS[tiling], u[3]).toFixed(2), thickness: +(2.9 + 1.9 * u[4]).toFixed(2) };
}
const rows = ['id\trole\tfamily\tframe\tmaterial\tdate\tplace\twidth_mm\theight_mm\tdepth_mm\tlicence\timage\tpage\tsettings\tstatus\tnote'], recipes = {};
for (let k = from; k <= to; k++) {
  const spec = cardDesign(k), d = designJali(spec), id = `design-${String(k).padStart(2, '0')}`, r = rng(k + 1000), data = new Uint8ClampedArray(d.width * d.height * 4);
  for (let p = 0; p < d.width * d.height; p++) { const n = (r() - 0.5) * 18, s = d.stone[p]; data[p * 4] = s ? 214 + n : 12; data[p * 4 + 1] = s ? 190 + n : 12; data[p * 4 + 2] = s ? 160 + n : 14; data[p * 4 + 3] = 255; }
  writeFileSync(join(out, `${id}.png`), encodePng({ width: d.width, height: d.height, data }));
  recipes[id] = d.recipe;
  rows.push([id, 'design', 'geometric', spec.frame, 'generated', '', '', '', '', '', 'generated (patternbook)', join(out, `${id}.png`), '', '', 'measured', `${spec.kind} on ${spec.tiling}`].join('\t'));
}
writeFileSync(join(out, 'samples.tsv'), rows.join('\n') + '\n');
writeFileSync(join(out, 'recipes.json'), JSON.stringify(recipes, null, 1) + '\n');
console.log(`designs ${from} to ${to} -> ${out}`);
