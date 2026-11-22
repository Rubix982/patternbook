// engine/core/darning.js
// Darning on the ground cloth's own threads: the primitive `counted-darning` (processes/primitives.md), written in C-021
// because Lumenary's phulkari darns on a grid of picture cells, not on the threads of a cloth.
//
// The process. Phulkari is darned in untwisted floss silk (pat) on hand-woven cotton (khaddar), worked from the back
// so the long floats show on the face. A darning stitch follows the cloth's threads: along a pick (horizontal) or an
// end (vertical) the needle passes over a number of the ground's threads (the float) and under a few (the pick-up),
// row after row, each row's stitches offset from the last so the pick-ups line up into diagonals. Blocks of different
// direction make the geometric patterns; a bagh covers the whole ground. Constraints. A stitch can only start and end
// where the needle passes between two threads, so its length is a whole number of threads, wherever those threads
// actually lie; untwisted floss lies flat and spreads, and it reflects the light along its filaments, so a block
// darned across the light shines and one darned along it doesn't. Imperfections. The darner pulls a stitch slightly
// short (tension) and now and then miscounts by a thread; the floss's filaments make streaks along the stitch.
import { cloth, STRUCTURES } from './weave.js';
import { noise1, hash2 } from './random.js';

const mod = (a, n) => ((a % n) + n) % n;
const hexRgb = (h) => {
  const n = parseInt(String(h).replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};
const find = (b, x) => {
  let lo = 0, hi = b.length - 2;
  while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (b[mid] <= x) lo = mid; else hi = mid - 1; }
  return lo;
};

// A plan in blocks of the ground's threads: cell(bx, by) gives { dir: 'h' | 'v', colour, stagger } or null.
// The same block always returns the same object, so a reader can tell two threads belong to one block.
export function blocks({ cellEnds = 12, cellPicks = 12, cell }) {
  const memo = new Map();
  return (j, i) => {
    const bx = Math.floor(j / cellEnds), by = Math.floor(i / cellPicks), key = bx * 100003 + by;
    if (!memo.has(key)) memo.set(key, cell(bx, by));
    return memo.get(key);
  };
}

export const PLANS = {
  // half the blocks darned, directions alternating: the ground shows between them
  sparse: blocks({ cell: (bx, by) => (mod(bx + by, 2) ? null : { dir: mod(bx, 2) ? 'v' : 'h', colour: 0 }) }),
  // every block darned, directions in a checker: the whole ground covered, as in a bagh
  bagh: blocks({ cell: (bx, by) => ({ dir: mod(bx + by, 2) ? 'v' : 'h', colour: 0 }) }),
  // concentric diamonds, direction and colour changing ring by ring, from a centre
  diamond: blocks({ cellEnds: 6, cellPicks: 6, cell: (bx, by) => {
    const r = Math.abs(mod(bx, 12) - 5.5) + Math.abs(mod(by, 12) - 5.5);
    const ring = Math.floor(r);
    return ring > 9 ? null : { dir: ring % 2 ? 'v' : 'h', colour: ring % 3, stagger: ring % 4 < 2 ? 1 : -1 };
  } }),
};

export const DARN_DEFAULTS = { float: 5, pickup: 1, stagger: 1, row: 1, spread: 1, sheen: 0.45, light: 0, streak: 0.5,
  tension: 0.2, miscount: 0.02, aligned: true };

// The darned cloth. Options are those of weave.cloth (unit replaced by `ground`), plus:
//   plan(j, i)  the blocks, in ground-thread coordinates (end j, pick i)
//   float       threads the floss passes over; pickup: threads it passes under
//   stagger     how far each row's stitches shift from the last, in threads (a block can override it)
//   row         darn every `row`-th pick (or end): 1 darns every one
//   spread      how much of a thread's width the flat floss covers (about 1 for untwisted silk)
//   floss       colours (hex), chosen by a block's `colour`
//   sheen       the floss's reflection along its filaments; light: the light's direction (degrees, 0 = from the side)
//   streak      how strongly the filaments show; tension: how far a stitch is pulled short; miscount: chance of a
//               stitch one thread long or short
//   aligned     true: stitches start and end on the cloth's own threads; false: on an even grid that ignores them
//               (as a picture-cell model does), the control in C-021
//   side        'face' or 'back' (the back shows the short pick-ups)
// Returns the cloth's image with top code 5 (floss) added.
export function darned(opts) {
  const o = { ...DARN_DEFAULTS, ...opts };
  const ground = o.ground || STRUCTURES.plain;
  const unit = o.side === 'back' ? { ends: ground.ends, picks: ground.picks, up: (i, j) => !ground.up(i, j) } : ground;
  const seed = o.seed || 1;
  const base = cloth({ ...o, unit, seed, ground: o.groundColour ?? '#3a3330' });
  const { width, height, rgb, top, xb, yb, disp } = base;
  const sett = o.sett || 8, pickSett = o.pickSett || sett;
  const F = (Array.isArray(o.floss) ? o.floss : [o.floss || '#e8b423']).map(hexRgb);
  const P = o.float + o.pickup, th = (o.light * Math.PI) / 180;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [xs, ys] = disp(x, y);
      const j = find(xb, Math.max(0, xs)), i = find(yb, Math.max(0, ys));
      const fx = (xs - xb[j]) / (xb[j + 1] - xb[j]), fy = (ys - yb[i]) / (yb[i + 1] - yb[i]);
      const b = o.plan(j, i);
      if (!b) continue;
      const h = b.dir === 'h';
      const rowIdx = h ? i : j;
      if (mod(rowIdx, o.row) !== 0) continue;
      const across = (h ? fy : fx) - 0.5;
      if (Math.abs(across) > o.spread / 2) continue;
      // position along the stitch, in threads: the cloth's own (aligned) or an even grid's
      const along = o.aligned ? (h ? j + fx : i + fy) : (h ? xs / sett : ys / pickSett);
      const u = along - (b.stagger ?? o.stagger) * rowIdx - (b.phase || 0);
      const n = Math.floor(u / P), q = u - n * P;
      const mis = hash2(n, rowIdx, seed + 31) < o.miscount ? (hash2(n, rowIdx, seed + 37) < 0.5 ? -1 : 1) : 0;
      const fl = o.float + mis;
      const trim = o.tension * 0.12 * (0.5 + hash2(n, rowIdx, seed + 41));
      const onFace = q >= trim && q < fl - trim;
      const show = o.side === 'back' ? q >= fl && q < P : onFace;
      if (!show) continue;
      const w = across / (o.spread / 2);
      const streak = noise1(across * 27 + rowIdx * 3.1, seed + (h ? 51 : 58));
      let sh = (1 - 0.18 * w * w) * (1 + 0.12 * o.streak * streak);
      const e = o.side === 'back' ? Math.min(q - fl, P - q) : Math.min(q - trim, fl - trim - q);
      sh *= 1 - 0.35 * Math.max(0, 1 - e / 0.35) ** 2; // the floss dives into the cloth at each end
      const cs = Math.cos((h ? 0 : Math.PI / 2) - th);
      const hl = o.sheen * cs * cs * (0.55 + 0.45 * (0.5 + 0.5 * streak)) * (1 - w * w) * 0.6;
      const c = F[mod(b.colour || 0, F.length)];
      const k = (y * width + x) * 3;
      rgb[k] = Math.min(1, c[0] * sh + hl); rgb[k + 1] = Math.min(1, c[1] * sh + hl); rgb[k + 2] = Math.min(1, c[2] * sh + hl);
      top[y * width + x] = 5;
    }
  }
  return base;
}
