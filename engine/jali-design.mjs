// engine/jali-design.mjs: the jali generator from the command line (C-032).
//   node engine/jali-design.mjs --out designs/octagram tiling=4.8.8 kind=strands angle=67.5 frame=pointed across=7 \
//        barOverOpening=0.4 hand=0.15 drift=0.04 jitter=0.015 round=0.25 wear=0.15 seed=5
// Writes <out>.png (stone on black), <out>.svg (the lines as bars, clipped to the frame) and <out>.json (the recipe,
// enough to make the same design again). Dials and their meaning: engine/core/jali-design.js, pieces/jali/grammar.md.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { designJali, DESIGN_DEFAULTS, TILING_NAMES } from './core/jali-design.js';
import { encodePng } from './png.js';

const args = process.argv.slice(2), out = args.includes('--out') ? args[args.indexOf('--out') + 1] : null;
if (!out) { console.error(`usage: node engine/jali-design.mjs --out <path> [key=value ...]\n  keys: ${Object.keys(DESIGN_DEFAULTS).join(', ')}\n  tilings: ${TILING_NAMES.join(', ')}`); process.exit(2); }
const opts = {};
for (const a of args) {
  const m = /^(\w+)=(.*)$/.exec(a);
  if (!m) continue;
  if (!(m[1] in DESIGN_DEFAULTS)) { console.error(`unknown dial: ${m[1]}`); process.exit(2); }
  opts[m[1]] = typeof DESIGN_DEFAULTS[m[1]] === 'number' ? Number(m[2]) : m[2];
}
if (opts.tiling && !TILING_NAMES.includes(opts.tiling)) { console.error(`unknown tiling: ${opts.tiling} (${TILING_NAMES.join(', ')})`); process.exit(2); }
const d = designJali(opts), data = new Uint8ClampedArray(d.width * d.height * 4);
for (let p = 0; p < d.width * d.height; p++) { const s = d.stone[p]; data[p * 4] = s ? 201 : 12; data[p * 4 + 1] = s ? 138 : 12; data[p * 4 + 2] = s ? 92 : 14; data[p * 4 + 3] = 255; }
mkdirSync(dirname(out) || '.', { recursive: true });
writeFileSync(`${out}.png`, encodePng({ width: d.width, height: d.height, data }));
writeFileSync(`${out}.svg`, d.svg());
writeFileSync(`${out}.json`, JSON.stringify(d.recipe, null, 1) + '\n');
console.log(JSON.stringify(d.recipe));
