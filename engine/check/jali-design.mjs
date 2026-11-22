// engine/check/jali-design.mjs
// C-032's designs: 24 jalis drawn by engine/core/jali-design.js with dials inside C-031's ranges, by the rule written on
// the card before any was drawn, rendered as a museum would photograph them (stone on black) for tools/screen_measure.py,
// with each one's SVG and recipe. Also a few named directions for the creatives sheet.
//   node engine/check/jali-design.mjs [--out runs/c032]
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { designJali, TILING_NAMES } from '../core/jali-design.js';
import { encodePng } from '../png.js';
import { rng } from '../core/random.js';

const out = process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : 'runs/c032';
mkdirSync(join(out, 'designs'), { recursive: true });
mkdirSync(join(out, 'directions'), { recursive: true });

// lattice repeats across the field, per tiling: so a design shows about as many openings across as C-031's jalis
const ACROSS = { '4.4.4.4': [9, 14], '6.6.6': [8, 13], '4.8.8': [6, 10], '3.12.12': [5, 8], '4.6.12': [3.5, 5.5], '3.6.3.6': [6, 10] };
const lerp = (r, u) => r[0] + (r[1] - r[0]) * u;

export function cardDesign(k) {
  const r = rng(k), u = [r(), r(), r(), r(), r()], tiling = TILING_NAMES[k % 6];
  return { seed: k, kind: k % 4 === 0 ? 'cells' : 'strands', tiling, angle: +(35 + 45 * u[0]).toFixed(1), barOverOpening: +(0.31 + 0.58 * u[1]).toFixed(3),
    hand: +(0.4 * u[2]).toFixed(3), frame: k % 6 === 0 ? 'cusped' : k % 2 ? 'rect' : 'pointed', across: +lerp(ACROSS[tiling], u[3]).toFixed(2), thickness: +(2.9 + 1.9 * u[4]).toFixed(2),
    drift: 0, jitter: 0, round: 0, wear: 0 }; // C-032 drew them exact (the defaults changed in C-033)
}

export const DIRECTIONS = {
  'octagram': { tiling: '4.8.8', kind: 'strands', angle: 67.5, barOverOpening: 0.4, frame: 'pointed', across: 7, hand: 0.15 },
  'hexagram': { tiling: '6.6.6', kind: 'strands', angle: 60, barOverOpening: 0.45, frame: 'rect', across: 9, hand: 0.15 },
  'honeycomb cells': { tiling: '6.6.6', kind: 'cells', barOverOpening: 0.35, frame: 'pointed', across: 10, hand: 0.1 },
  'twelve-point rosettes': { tiling: '3.12.12', kind: 'strands', angle: 72, barOverOpening: 0.4, frame: 'cusped', across: 6, hand: 0.15 },
  'dodecagon garden': { tiling: '4.6.12', kind: 'strands', angle: 60, barOverOpening: 0.5, frame: 'rect', across: 4.5, hand: 0.15 },
  'hubs (departure: rays meet at the centre)': { tiling: '4.8.8', kind: 'strands', angle: 88, barOverOpening: 0.35, frame: 'pointed', across: 7, hand: 0.1 },
  'lace (departure: bars a fifth of an opening)': { tiling: '3.6.3.6', kind: 'strands', angle: 50, barOverOpening: 0.18, frame: 'rect', across: 9, hand: 0.1 },
  'building front (departure: 30 repeats across)': { tiling: '4.8.8', kind: 'strands', angle: 67.5, barOverOpening: 0.45, frame: 'rect', across: 30, hand: 0.1 },
};

function photo(d, seed) {
  const r = rng(seed + 1000), data = new Uint8ClampedArray(d.width * d.height * 4);
  for (let p = 0; p < d.width * d.height; p++) {
    const n = (r() - 0.5) * 18, s = d.stone[p];
    data[p * 4] = s ? 214 + n : 12; data[p * 4 + 1] = s ? 190 + n : 12; data[p * 4 + 2] = s ? 160 + n : 14; data[p * 4 + 3] = 255;
  }
  return encodePng({ width: d.width, height: d.height, data });
}

const rows = ['id\trole\tfamily\tframe\tmaterial\tdate\tplace\twidth_mm\theight_mm\tdepth_mm\tlicence\timage\tpage\tsettings\tstatus\tnote'];
const recipes = {};
for (let k = 1; k <= 24; k++) {
  const spec = cardDesign(k), t0 = Date.now(), d = designJali(spec), id = `design-${String(k).padStart(2, '0')}`;
  writeFileSync(join(out, 'designs', `${id}.png`), photo(d, k));
  writeFileSync(join(out, 'designs', `${id}.svg`), d.svg());
  recipes[id] = d.recipe;
  rows.push([id, 'design', 'geometric', spec.frame, 'generated', '', '', '', '', '', 'generated (patternbook)', join(out, 'designs', `${id}.png`), '', '', 'measured', `${spec.kind} on ${spec.tiling}`].join('\t'));
  console.log(id, JSON.stringify(spec), `bar ${d.recipe.bar}px opening ${d.recipe.opening}px`, `${Date.now() - t0} ms`);
}
writeFileSync(join(out, 'designs', 'samples.tsv'), rows.join('\n') + '\n');
writeFileSync(join(out, 'designs', 'recipes.json'), JSON.stringify(recipes, null, 1) + '\n');
for (const [name, spec] of Object.entries(DIRECTIONS)) {
  const d = designJali({ drift: 0, jitter: 0, round: 0, wear: 0, ...spec, seed: 5 }), id = name.split(' (')[0].replace(/\s+/g, '-');
  writeFileSync(join(out, 'directions', `${id}.png`), photo(d, 5));
  writeFileSync(join(out, 'directions', `${id}.svg`), d.svg());
  console.log('direction', name, `bar ${d.recipe.bar}px opening ${d.recipe.opening}px`);
}
