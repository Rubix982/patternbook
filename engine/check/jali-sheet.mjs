// engine/check/jali-sheet.mjs: a thick screen to look at: a star jali seen straight on and 25 degrees off, its light
// on a wall near and far, and the square lattice's light with the sun at 40 degrees.
//   node engine/check/jali-sheet.mjs runs/c028/jali-sheet.png
import { screenView, castLight, LATTICES, JALI_DEFAULTS } from '../core/jali.js';
import { writePng, sheet } from './png.mjs';

const out = process.argv[2] || 'runs/c028/jali-sheet.png';
const T = 288, base = { ...JALI_DEFAULTS, width: T, height: T, seed: 4 };
const stars = { ...base, open: LATTICES.stars(48, 19, base.vary, 4) }, squares = { ...base, open: LATTICES.squares(36, 12, base.vary, 4) };
const tiles = [screenView(stars), screenView({ ...stars, viewAngle: 25, viewAzimuth: 20 }), castLight({ ...stars, sunAngle: 25, distance: 150 }),
  castLight({ ...stars, sunAngle: 25, distance: 450 }), castLight({ ...squares, sunAngle: 40, distance: 150 })];
const s = sheet(tiles, 5);
writePng(out, s.width, s.height, s.rgb);
console.log(`wrote ${out}: stars seen straight; 25 degrees off; light near; light far; squares' light, sun at 40 degrees`);
