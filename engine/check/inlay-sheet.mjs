// engine/check/inlay-sheet.mjs: inlay to look at: the floral panel fitted and turned along, turned at random (the
// bands' control), cut as Voronoi cells (the fit's control), and one flower up close.
//   node engine/check/inlay-sheet.mjs runs/c027/inlay-sheet.png
import { inlaid, floral, INLAY_DEFAULTS } from '../core/inlay.js';
import { writePng, sheet } from './png.mjs';

const out = process.argv[2] || 'runs/c027/inlay-sheet.png';
const T = 288, base = { ...INLAY_DEFAULTS, width: T, height: T, seed: 2 };
const pieces = floral(T, T);
const tiles = [inlaid({ ...base, pieces }), inlaid({ ...base, pieces, turn: 'random' }), inlaid({ ...base, pieces, cut: 'cells' }),
  inlaid({ ...base, pieces: floral(T, T, { flowers: [[0.5, 0.36]], size: 0.24 }) })];
const s = sheet(tiles, 4);
writePng(out, s.width, s.height, s.rgb);
console.log(`wrote ${out}: fitted, bands along; bands turned at random; cut as cells; one flower up close`);
