// engine/check/mirror-sheet.mjs: mirror work to look at: the default, the chain-only ring (the control), no grid (a
// round opening), flat glass, and a close look at one mirror.
//   node engine/check/mirror-sheet.mjs runs/c025/mirror-sheet.png
import { DEFAULTS } from '../core/weave.js';
import { mirrored, lattice, MIRROR_DEFAULTS } from '../core/mirror.js';
import { writePng, sheet } from './png.mjs';

const out = process.argv[2] || 'runs/c025/mirror-sheet.png';
const T = 288;
const base = { ...DEFAULTS, ...MIRROR_DEFAULTS, width: T, height: T, sett: 3, slub: 0.15, warp: ['#1f2a44'], weft: ['#24304d'], seed: 5,
  mirrors: lattice(T, T, 80, 24, 6) };
const tiles = [mirrored(base), mirrored({ ...base, ring: 'chain' }), mirrored({ ...base, grid: 0 }), mirrored({ ...base, curve: 0, tilt: 0 })];
// one mirror, three times as large
tiles.push(mirrored({ ...base, mirrors: [{ x: T / 2, y: T / 2, r: 72 }], link: 7, loop: 4.5, thread: 2.4 }));
const s = sheet(tiles, 5);
writePng(out, s.width, s.height, s.rgb);
console.log(`wrote ${out}: default; chain ring alone; no grid; flat glass; one mirror up close`);
