// engine/check/jali-age.mjs
// C-036's calibration: the octagram (with the generator's defaults for drift, jitter and hand) drawn with each bar its
// own width at several spreads, and with age at several levels, rendered as a museum would photograph them, for
// tools/screen_hand.py's between-bar reading.
//   node engine/check/jali-age.mjs --spread 0,0.05,0.1,0.15,0.2,0.3 [--age 0.25,0.5,0.75,1 --at 0.1] [--out runs/c036/calibration]
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { designJali } from '../core/jali-design.js';
import { encodePng } from '../png.js';
import { rng } from '../core/random.js';

const arg = (k, d) => (process.argv.includes(k) ? process.argv[process.argv.indexOf(k) + 1] : d);
const out = arg('--out', 'runs/c036/calibration'), list = (v) => (v ? v.split(',').map(Number) : []);
mkdirSync(out, { recursive: true });
const OCT = { tiling: '4.8.8', kind: 'strands', angle: 67.5, barOverOpening: 0.4, frame: 'rect', across: 7, seed: 9 };
const specsPath = join(out, 'specs.json'), specs = existsSync(specsPath) ? JSON.parse(readFileSync(specsPath)) : [];
const runs = [...list(arg('--spread')).map((v) => ({ barSpread: v, age: 0 })), ...list(arg('--age')).map((v) => ({ barSpread: +arg('--at', 0), age: v }))];
for (const extra of runs) {
  const id = `octagram-spread-${extra.barSpread}-age-${extra.age}`, d = designJali({ ...OCT, ...extra }), r = rng(77), data = new Uint8ClampedArray(d.width * d.height * 4);
  for (let p = 0; p < d.width * d.height; p++) { const n = (r() - 0.5) * 18, s = d.stone[p]; data[p * 4] = s ? 214 + n : 12; data[p * 4 + 1] = s ? 190 + n : 12; data[p * 4 + 2] = s ? 160 + n : 14; data[p * 4 + 3] = 255; }
  writeFileSync(join(out, `${id}.png`), encodePng({ width: d.width, height: d.height, data }));
  if (!specs.find((x) => x.id === id)) specs.push({ id, ...extra, bar: d.recipe.bar });
}
writeFileSync(specsPath, JSON.stringify(specs, null, 1) + '\n');
console.log(runs.length, 'drawn ->', out);
