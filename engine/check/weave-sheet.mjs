// engine/check/weave-sheet.mjs
// A sheet of the weave primitive for looking at, not measuring: the seven structures in one pair of colours, then
// a few cloths sketched from structures and colour orders found in the atlas.
//   node engine/check/weave-sheet.mjs runs/c019/weave-sheet.png
import { STRUCTURES, cloth, DEFAULTS } from '../core/weave.js';
import { writePng, sheet } from './png.mjs';

const out = process.argv[2] || 'runs/c019/weave-sheet.png';
const T = 260;
const tiles = [];
for (const n of ['plain', 'twill-2-2', 'twill-3-1', 'twill-1-3', 'basket-2-2', 'satin-5', 'sateen-5'])
  tiles.push(cloth({ unit: STRUCTURES[n], width: T, height: T, ...DEFAULTS, sett: 9, warp: ['#22305a'], weft: ['#ece3cc'], seed: 3 }));

// Sketches of structure and colour order, not reproductions of any cloth:
// a warp-faced satin with silk-coloured warp stripes (the structure of mashru)
tiles.push(cloth({ unit: STRUCTURES['satin-5'], width: T, height: T, ...DEFAULTS, sett: 6, seed: 5,
  warp: [...Array(6).fill('#b3262e'), ...Array(3).fill('#e0b73a'), ...Array(6).fill('#1f5d3a'), ...Array(3).fill('#e0b73a')], weft: ['#efe6d2'] }));
// plain weave with narrow warp stripes in several colours (as in sussi)
tiles.push(cloth({ unit: STRUCTURES.plain, width: T, height: T, ...DEFAULTS, sett: 5, seed: 9,
  warp: ['#2b2a5c', '#2b2a5c', '#c9302c', '#2b2a5c', '#2b2a5c', '#e8c547', '#2b2a5c', '#2b2a5c', '#3d7a4a'], weft: ['#2b2a5c'] }));
// a check in plain weave: the same colour order in warp and weft (as in a lungi or khes check)
const order = [...Array(8).fill('#1e3f73'), ...Array(8).fill('#f1ece0'), ...Array(3).fill('#b8312f'), ...Array(8).fill('#f1ece0')];
tiles.push(cloth({ unit: STRUCTURES.plain, width: T, height: T, ...DEFAULTS, sett: 5, seed: 11, warp: order, weft: order }));
// coarse hand-spun plain weave, slubs and uneven beat turned up (as in khaddar)
tiles.push(cloth({ unit: STRUCTURES.plain, width: T, height: T, ...DEFAULTS, slub: 0.55, beat: 0.4, fibre: 0.6, sett: 10, seed: 13,
  warp: ['#d9ccb0'], weft: ['#cdbf9f'] }));

const s = sheet(tiles, 4);
writePng(out, s.width, s.height, s.rgb);
console.log(`wrote ${out} (${s.width}x${s.height}): row 1-2 plain, twill 2/2, 3/1, 1/3, basket, satin, sateen; then satin with warp stripes, striped plain weave, plain-weave check, coarse plain weave`);
