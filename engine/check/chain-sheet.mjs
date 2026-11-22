// engine/check/chain-sheet.mjs: chain stitch to look at: the five test paths, the back, the running-stitch control, and a
// zalakdozi-like fill of concentric rings.
//   node engine/check/chain-sheet.mjs runs/c022/chain-sheet.png
import { DEFAULTS } from '../core/weave.js';
import { chained, PATHS, CHAIN_DEFAULTS } from '../core/chain.js';
import { writePng, sheet } from './png.mjs';

const out = process.argv[2] || 'runs/c022/chain-sheet.png';
const T = 300;
const base = { width: T, height: T, ...DEFAULTS, ...CHAIN_DEFAULTS, sett: 5, warp: ['#1d2a4a'], weft: ['#22305a'], seed: 3 };
const test = [PATHS.line(20, 40, 280, 40), PATHS.wave(20, 110, 280, 22, 2), PATHS.circle(80, 220, 55), PATHS.spiral(220, 215, 12, 62, 2.2)];
const tiles = [
  chained({ ...base, paths: test }),
  chained({ ...base, paths: test, side: 'back' }),
  chained({ ...base, paths: test, kind: 'running' }),
  chained({ ...base, paths: PATHS.rings(150, 150, 130, 95, CHAIN_DEFAULTS.loop, CHAIN_DEFAULTS.link), colour: '#e8b423' }),
];
const s = sheet(tiles, 4);
writePng(out, s.width, s.height, s.rgb);
console.log(`wrote ${out}: chain on four paths, its back, a running stitch on the same paths, concentric rings`);
