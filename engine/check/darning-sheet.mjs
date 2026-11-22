// engine/check/darning-sheet.mjs
// A sheet of counted darning for looking at: sparse blocks, a bagh, concentric diamonds, the back, and the free-grid
// control beside the aligned stitches.
//   node engine/check/darning-sheet.mjs runs/c021/darning-sheet.png
import { STRUCTURES, DEFAULTS } from '../core/weave.js';
import { darned, PLANS, DARN_DEFAULTS } from '../core/darning.js';
import { writePng, sheet } from './png.mjs';

const out = process.argv[2] || 'runs/c021/darning-sheet.png';
const T = 300;
const base = { width: T, height: T, ...DEFAULTS, ...DARN_DEFAULTS, ground: STRUCTURES.plain, sett: 7, slub: 0.35, beat: 0.25,
  warp: ['#7a2a1f'], weft: ['#86301f'], ground_: null, floss: ['#e8b423', '#f4efe2', '#d9541e'], seed: 3 };
const tiles = [
  darned({ ...base, plan: PLANS.sparse }),
  darned({ ...base, plan: PLANS.bagh }),
  darned({ ...base, plan: PLANS.diamond, sett: 5 }),
  darned({ ...base, plan: PLANS.diamond, sett: 5, side: 'back' }),
  darned({ ...base, plan: PLANS.bagh, sheen: 0 }),
  darned({ ...base, plan: PLANS.bagh, light: 90 }),
  darned({ ...base, plan: PLANS.sparse, aligned: true, sett: 12, width: T, height: T }),
  darned({ ...base, plan: PLANS.sparse, aligned: false, sett: 12, width: T, height: T }),
];
const s = sheet(tiles, 4);
writePng(out, s.width, s.height, s.rgb);
console.log(`wrote ${out}: sparse, bagh, diamonds, diamonds from the back; bagh with no sheen, bagh lit from above; aligned and free-grid stitches up close`);
