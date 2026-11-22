// engine/check/jali-blind2.mjs
// C-036's B designs: C-035's 12 designs (the same specs and seeds) with age drawn evenly from 0 to 1 (seed 36), bedding
// 0.5, and barSpread 0 (where C-036's calibration rule put it), rendered as a museum would photograph them.
//   node engine/check/jali-blind2.mjs [--out runs/c036/designs]
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { designJali } from '../core/jali-design.js';
import { encodePng } from '../png.js';
import { rng } from '../core/random.js';

const out = process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : 'runs/c036/designs';
mkdirSync(out, { recursive: true });
const recipes = JSON.parse(readFileSync('runs/c035/designs/recipes.json')), ids = JSON.parse(readFileSync('runs/c035/inside.json')).first12;
const r = rng(36), rows = ['id\trole\tfamily\tframe\tmaterial\tdate\tplace\twidth_mm\theight_mm\tdepth_mm\tlicence\timage\tpage\tsettings\tstatus\tnote'], used = {};
for (const id of ids) {
  const { bar, opening, lattice, thicknessPx, ...spec } = recipes[id];
  const age = +r().toFixed(3), d = designJali({ ...spec, age, barSpread: 0, bedding: 0.5 }), q = rng(spec.seed + 2000), data = new Uint8ClampedArray(d.width * d.height * 4);
  for (let p = 0; p < d.width * d.height; p++) { const n = (q() - 0.5) * 18, s = d.stone[p]; data[p * 4] = s ? 214 + n : 12; data[p * 4 + 1] = s ? 190 + n : 12; data[p * 4 + 2] = s ? 160 + n : 14; data[p * 4 + 3] = 255; }
  const bid = `${id}-b`;
  writeFileSync(join(out, `${bid}.png`), encodePng({ width: d.width, height: d.height, data }));
  used[bid] = d.recipe;
  rows.push([bid, 'design', 'geometric', spec.frame, 'generated', '', '', '', '', '', 'generated (patternbook)', join(out, `${bid}.png`), '', '', 'measured', `age ${age}`].join('\t'));
  console.log(bid, 'age', age);
}
writeFileSync(join(out, 'samples.tsv'), rows.join('\n') + '\n');
writeFileSync(join(out, 'recipes.json'), JSON.stringify(used, null, 1) + '\n');
