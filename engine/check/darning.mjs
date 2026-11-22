// engine/check/darning.mjs
// C-021's check: from the rendered cloth alone, can the darning's counts, its alignment to the ground's threads, its
// direction, its sheen and its coverage be read back?
//   node engine/check/darning.mjs [--out runs/c021/check.json]
// The ground is a rust khaddar; the floss is gold, so a pixel's hue says whether floss is on top. The ground's threads
// are counted in the image (where the ground shows, its brightness dips between threads); blocks are found by counting
// threads against the design's block layout, which a reader of the pattern would know.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { STRUCTURES, DEFAULTS } from '../core/weave.js';
import { darned, PLANS, DARN_DEFAULTS } from '../core/darning.js';
import { hueSat, lum, modeOf, trackBoundaries } from './readback.mjs';

const SIZE = 384, SETT = 8;
const isFloss = (img, p) => { const [h, s] = hueSat(img.rgb, p); return s > 0.45 && h > 30 && h < 62; };
const median = (xs) => { const v = [...xs].sort((a, b) => a - b); return v.length ? v[Math.floor(v.length / 2)] : null; };

function threadCoords(img) {
  // the ground's brightness, columns and rows, where the floss doesn't cover it; it dips between threads
  const col = new Float64Array(SIZE), row = new Float64Array(SIZE), cn = new Float64Array(SIZE), rn = new Float64Array(SIZE);
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    const p = y * SIZE + x;
    if (isFloss(img, p)) continue;
    const L = lum(img.rgb, p);
    col[x] += L; cn[x]++; row[y] += L; rn[y]++;
  }
  for (let k = 0; k < SIZE; k++) { col[k] = cn[k] ? col[k] / cn[k] : 1; row[k] = rn[k] ? row[k] / rn[k] : 1; }
  const xb = trackBoundaries(col, SETT), yb = trackBoundaries(row, SETT);
  const at = (b, v) => { let k = 0; while (k + 1 < b.length && b[k + 1] <= v) k++; const w = (b[k + 1] ?? b[k] + SETT) - b[k]; return k + (v - b[k]) / w; };
  return { xb, yb, cx: (x) => at(xb, x), cy: (y) => at(yb, y) };
}

function readStitches(img, plan, tc) {
  const floats = [], pickups = [], endDist = [];
  const scan = (dir) => {
    const lines = dir === 'h' ? SIZE : SIZE;
    for (let a = 0; a < lines; a++) {
      // only lines through the middle of a thread (a pick for 'h', an end for 'v')
      const c = dir === 'h' ? tc.cy(a) : tc.cx(a);
      if (Math.abs((c % 1) - 0.5) > 0.2) continue;
      let prevEnd = null, prevBlock = null;
      let b = 0;
      while (b < SIZE) {
        const p = dir === 'h' ? a * SIZE + b : b * SIZE + a;
        if (!isFloss(img, p)) { b++; continue; }
        const b0 = b;
        while (b < SIZE && isFloss(img, dir === 'h' ? a * SIZE + b : b * SIZE + a)) b++;
        if (b0 === 0 || b >= SIZE) { prevEnd = null; continue; }
        const s0 = dir === 'h' ? tc.cx(b0) : tc.cy(b0), s1 = dir === 'h' ? tc.cx(b) : tc.cy(b);
        const blk = (s) => (dir === 'h' ? plan(Math.floor(s), Math.floor(c)) : plan(Math.floor(c), Math.floor(s)));
        const B0 = blk(s0 + 0.01), B1 = blk(s1 - 0.01);
        // a pick-up: the gap since the last run, both ends inside one block of this direction
        if (prevEnd !== null && B0 && B0 === prevBlock && B0.dir === dir) pickups.push(Math.round(s0 - prevEnd));
        prevEnd = B1 && B1.dir === dir ? s1 : null; prevBlock = B1;
        // a float: a whole stitch inside one block of this direction, away from the block's edges
        if (!B0 || !B1 || B0.dir !== dir || B1.dir !== dir || blk(s0 - 0.6) !== B0 || blk(s1 + 0.6) !== B1) continue;
        floats.push(Math.round(s1 - s0));
        endDist.push(Math.abs(s0 - Math.round(s0)), Math.abs(s1 - Math.round(s1)));
      }
    }
  };
  scan('h'); scan('v');
  return { float: modeOf(floats), pickup: modeOf(pickups), medianEnd: +(median(endDist) ?? 1).toFixed(3), stitches: floats.length };
}

function blockStats(img, plan, tc) {
  const blocks = new Map();
  for (let y = 1; y < SIZE - 1; y++) for (let x = 1; x < SIZE - 1; x++) {
    const cx = tc.cx(x), cy = tc.cy(y);
    const B = plan(Math.floor(cx), Math.floor(cy));
    if (!B || plan(Math.floor(cx - 1), Math.floor(cy)) !== B || plan(Math.floor(cx + 1), Math.floor(cy)) !== B ||
        plan(Math.floor(cx), Math.floor(cy - 1)) !== B || plan(Math.floor(cx), Math.floor(cy + 1)) !== B) continue;
    if (!blocks.has(B)) blocks.set(B, { dir: B.dir, ex: 0, ey: 0, lum: 0, n: 0, all: 0, bare: 0 });
    const s = blocks.get(B), p = y * SIZE + x;
    s.all++;
    if (!isFloss(img, p)) { s.bare++; continue; }
    const L = lum(img.rgb, p);
    s.lum += L; s.n++;
    if (isFloss(img, p + 1)) s.ex += Math.abs(lum(img.rgb, p + 1) - L);
    if (isFloss(img, p + SIZE)) s.ey += Math.abs(lum(img.rgb, p + SIZE) - L);
  }
  const list = [...blocks.values()].filter((s) => s.n > 50);
  // filaments run along the stitch, so brightness changes across it: across-row change dominates in a horizontal block
  for (const s of list) s.read = s.ey > 1.2 * s.ex ? 'h' : s.ex > 1.2 * s.ey ? 'v' : '?';
  const dirOk = list.filter((s) => s.read === s.dir).length / (list.length || 1);
  const mean = (d) => { const v = list.filter((s) => s.dir === d); return v.reduce((a, s) => a + s.lum / s.n, 0) / (v.length || 1); };
  const bare = list.reduce((a, s) => a + s.bare, 0) / (list.reduce((a, s) => a + s.all, 0) || 1);
  return { blocks: list.length, direction: +dirOk.toFixed(3), hOverV: +(mean('h') / mean('v')).toFixed(3), bare: +bare.toFixed(3) };
}

const common = { ...DEFAULTS, ...DARN_DEFAULTS, width: SIZE, height: SIZE, sett: SETT, ground: STRUCTURES.plain,
  warp: ['#7a2a1f'], weft: ['#86301f'], floss: ['#e8b423'], seed: 21 };

function run(label, over = {}) {
  const sparse = darned({ ...common, ...over, plan: PLANS.sparse });
  const tc = threadCoords(sparse);
  const st = readStitches(sparse, PLANS.sparse, tc);
  const bs = blockStats(sparse, PLANS.sparse, tc);
  const free = darned({ ...common, ...over, plan: PLANS.sparse, aligned: false });
  const tcF = threadCoords(free);
  const stF = readStitches(free, PLANS.sparse, tcF);
  const noSheen = blockStats(darned({ ...common, ...over, plan: PLANS.sparse, sheen: 0 }), PLANS.sparse, tc);
  const bagh = darned({ ...common, ...over, plan: PLANS.bagh });
  const bg = blockStats(bagh, PLANS.bagh, threadCoords(sparse)); // the bagh hides its ground: count threads on the sparse cloth of the same seed
  const checks = {
    counts: st.float === common.float && st.pickup === common.pickup,
    alignment: st.medianEnd <= 0.15 && stF.medianEnd > 0.2,
    direction: bs.direction >= 0.95,
    sheen: bs.hOverV >= 1.15 && Math.abs(noSheen.hOverV - 1) <= 0.05,
    coverage: bg.bare <= 0.05,
  };
  return { label, stitches: st, freeGrid: stF, blocks: bs, noSheen, bagh: bg, checks, pass: Object.values(checks).every(Boolean) };
}

const results = [run('default'), run('off', { slub: 0, beat: 0, wobble: 0, fibre: 0, tension: 0, miscount: 0 })];
for (const f of [1.5, 2, 3]) results.push(run(`x${f}`, { slub: DEFAULTS.slub * f, beat: DEFAULTS.beat * f, wobble: DEFAULTS.wobble * f,
  fibre: DEFAULTS.fibre * f, tension: Math.min(1, DARN_DEFAULTS.tension * f), miscount: Math.min(0.5, DARN_DEFAULTS.miscount * f) }));

for (const r of results) {
  console.log(`${r.label.padEnd(8)} counts ${r.stitches.float}/${r.stitches.pickup} (${r.stitches.stitches} stitches)  ends from threads: aligned ${r.stitches.medianEnd}, free grid ${r.freeGrid.medianEnd}  ` +
    `direction ${r.blocks.direction} of ${r.blocks.blocks} blocks  H/V brightness ${r.blocks.hOverV} (no sheen ${r.noSheen.hOverV})  bagh bare ${r.bagh.bare}  ` +
    `-> ${Object.entries(r.checks).map(([k, v]) => `${k} ${v ? 'ok' : 'NO'}`).join(', ')}`);
}
const out = process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : null;
if (out) { mkdirSync(dirname(out), { recursive: true }); writeFileSync(out, JSON.stringify({ size: SIZE, sett: SETT, defaults: common, results }, null, 1) + '\n'); }
process.exitCode = results[0].pass ? 0 : 1;
