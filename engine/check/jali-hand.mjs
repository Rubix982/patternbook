// engine/check/jali-hand.mjs
// C-033's calibration: three exact designs, each drawn again with one carving error at a time at three levels, rendered
// as a museum would photograph them, for tools/screen_hand.py to read. 3 x (1 + 5 x 3) = 48 designs.
//   node engine/check/jali-hand.mjs [--out runs/c033/calibration]
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { designJali } from '../core/jali-design.js';
import { encodePng } from '../png.js';
import { rng } from '../core/random.js';

const out = process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : 'runs/c033/calibration';
mkdirSync(out, { recursive: true });
export const BASES = {
  octagram: { tiling: '4.8.8', kind: 'strands', angle: 67.5, barOverOpening: 0.4, frame: 'rect', across: 7 },
  hexagram: { tiling: '6.6.6', kind: 'strands', angle: 60, barOverOpening: 0.45, frame: 'rect', across: 9 },
  honeycomb: { tiling: '6.6.6', kind: 'cells', barOverOpening: 0.35, frame: 'rect', across: 10 },
};
export const LEVELS = { drift: [0.03, 0.06, 0.1], jitter: [0.01, 0.02, 0.04], hand: [0.2, 0.4, 0.6], round: [0.2, 0.4, 0.6], wear: [0.1, 0.2, 0.3] };
const ZERO = { hand: 0, drift: 0, jitter: 0, round: 0, wear: 0, seed: 9 };
const specs = [];
for (const [base, b] of Object.entries(BASES)) {
  const runs = [['exact', 0, {}], ...Object.entries(LEVELS).flatMap(([dial, ls]) => ls.map((l) => [dial, l, { [dial]: l }]))];
  for (const [dial, level, extra] of runs) {
    const d = designJali({ ...b, ...ZERO, ...extra }), id = `${base}-${dial}-${level}`, r = rng(77), data = new Uint8ClampedArray(d.width * d.height * 4);
    for (let p = 0; p < d.width * d.height; p++) { const n = (r() - 0.5) * 18, s = d.stone[p]; data[p * 4] = s ? 214 + n : 12; data[p * 4 + 1] = s ? 190 + n : 12; data[p * 4 + 2] = s ? 160 + n : 14; data[p * 4 + 3] = 255; }
    writeFileSync(join(out, `${id}.png`), encodePng({ width: d.width, height: d.height, data }));
    specs.push({ id, base, dial, level, bar: d.recipe.bar, lattice: d.recipe.lattice });
  }
  console.log(base, 'done');
}
writeFileSync(join(out, 'specs.json'), JSON.stringify(specs, null, 1) + '\n');
