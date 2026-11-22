// engine/check/dye-sheet.mjs: dye baths to look at: the four sequences and dabu with cracks.
//   node engine/check/dye-sheet.mjs runs/c024/dye-sheet.png
import { DEFAULTS } from '../core/weave.js';
import { dyed, DYE_DEFAULTS } from '../core/dye.js';
import { SEQUENCES, DESIGN } from './dye-designs.mjs';
import { writePng, sheet } from './png.mjs';

const out = process.argv[2] || 'runs/c024/dye-sheet.png';
const T = 288;
const base = { width: T, height: T, ...DEFAULTS, ...DYE_DEFAULTS, sett: 3, slub: 0.15, seed: 4 };
const tiles = Object.values(SEQUENCES).map((steps) => dyed({ ...base, steps }));
tiles.push(dyed({ ...base, steps: [{ op: 'print', layer: 'resist', mask: DESIGN.dabuA }, { op: 'crack', density: 0.6 }, { op: 'dye', bath: 'indigo' }, { op: 'dye', bath: 'indigo' }, { op: 'wash' }] }));
const s = sheet(tiles, 5);
writePng(out, s.width, s.height, s.rgb);
console.log(`wrote ${out}: ajrak; ajrak with indigo first; double dabu; Bagru; dabu with cracks`);
