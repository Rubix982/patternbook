// engine/check/kantha-sheet.mjs: kantha to look at: contour rows in three motifs with background quilting, the same
// with straight rows (the control), with no ripple, and a kantha-like panel.
//   node engine/check/kantha-sheet.mjs runs/c023/kantha-sheet.png
import { DEFAULTS } from '../core/weave.js';
import { kantha, SHAPES, KANTHA_DEFAULTS } from '../core/kantha.js';
import { writePng, sheet } from './png.mjs';

const out = process.argv[2] || 'runs/c023/kantha-sheet.png';
const T = 320;
const base = { width: T, height: T, ...DEFAULTS, ...KANTHA_DEFAULTS, sett: 4, slub: 0.15, warp: ['#efe8d8'], weft: ['#ebe3d1'], seed: 5 };
const motifs = [
  { inside: SHAPES.circle(80, 80, 55), colour: '#1f3a7a' },
  { inside: SHAPES.paisley(225, 95, 45, 0.5), colour: '#b8312f' },
  { inside: SHAPES.lotus(160, 235, 75), colour: '#2e6b3a' },
];
const tiles = [
  kantha({ ...base, motifs }),
  kantha({ ...base, motifs, rows: 'straight' }),
  kantha({ ...base, motifs, ripple: 0 }),
  kantha({ ...base, motifs: [{ inside: SHAPES.lotus(160, 160, 120, 10), colour: '#b8312f' }, { inside: SHAPES.circle(160, 160, 30), colour: '#1f3a7a' }], groundThread: '#cfc3a8', rowGap: 6 }),
];
const s = sheet(tiles, 4);
writePng(out, s.width, s.height, s.rgb);
console.log(`wrote ${out}: contour rows with background quilting; straight rows (control); no ripple; a lotus panel`);
