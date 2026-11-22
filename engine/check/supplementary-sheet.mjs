// engine/check/supplementary-sheet.mjs
// A sheet of the supplementary weft for looking at: the three kinds, face and back, and two sketches.
//   node engine/check/supplementary-sheet.mjs runs/c020/supplementary-sheet.png
import { STRUCTURES, DEFAULTS } from '../core/weave.js';
import { figured, MOTIFS, layout, band, SUPP_DEFAULTS } from '../core/supplementary.js';
import { writePng, sheet } from './png.mjs';

const out = process.argv[2] || 'runs/c020/supplementary-sheet.png';
const T = 300;
const base = { width: T, height: T, ...DEFAULTS, ...SUPP_DEFAULTS, sett: 7, ground: STRUCTURES.plain, warp: ['#ebe5d6'], weft: ['#f3eee2'],
  ground: STRUCTURES.plain, supp: '#7a1f2b', seed: 4 };
const on = layout(MOTIFS.buti, { across: 15, down: 12 });
const tiles = [];
for (const kind of ['discontinuous', 'continuous', 'cutwork'])
  for (const side of ['face', 'back']) tiles.push(figured({ ...base, on, kind, side }));
// sketches: a fine white ground with a white figure (as jamdani is often woven), and zari on a dark silk ground
tiles.push(figured({ ...base, on: layout(MOTIFS.kalka, { across: 17, down: 15 }), supp: '#fbf8f0', suppScale: 1.7, warp: ['#e9e3d3'], weft: ['#ece6d8'], ground: STRUCTURES.plain, sett: 6, seed: 8 }));
tiles.push(figured({ ...base, on: (p, j) => band(MOTIFS.vine, { y0: 3 })(p, j) || layout(MOTIFS.buti, { across: 16, down: 13, y0: 12 })(p, j),
  ground: STRUCTURES['satin-5'], warp: ['#5b1424'], weft: ['#3a0d18'], supp: '#c9a227', sheen: 0.6, bind: 5, sett: 6, seed: 12 }));
const s = sheet(tiles, 4);
writePng(out, s.width, s.height, s.rgb);
console.log(`wrote ${out}: discontinuous face/back, continuous face/back, cutwork face/back, white-on-white kalka on plain, zari on satin`);
