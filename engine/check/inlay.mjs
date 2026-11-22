// engine/check/inlay.mjs
// C-027's check: from the image alone, do the stone's bands run along each piece, and do the pieces' edges follow the
// motif's own outline?
//   node engine/check/inlay.mjs [--out runs/c027/check.json]
// The design's pieces, their outlines, long axes and stones are the plan, which a reader knows. Everything else is read
// from the image.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { inlaid, floral, STONES, INLAY_DEFAULTS } from '../core/inlay.js';
import { signedDistance, levelLines } from '../core/field.js';
import { lum } from './readback.mjs';

const SIZE = 400;
const PIECES = floral(SIZE, SIZE, { flowers: [[0.3, 0.3], [0.72, 0.3], [0.3, 0.72], [0.72, 0.72]], size: 0.085 });
const SD = PIECES.map((pc) => signedDistance(pc.inside, SIZE, SIZE));
const median = (xs) => { const v = [...xs].sort((a, b) => a - b); return v.length ? v[Math.floor(v.length / 2)] : NaN; };

function bands(img) {
  // per piece: the structure tensor of brightness over its inside, 3 px or more from its edge
  const W = SIZE, L = Float64Array.from({ length: W * W }, (_, p) => lum(img.rgb, p)), errs = [];
  for (const [i, pc] of PIECES.entries()) {
    if (STONES[pc.stone].bands < 0.5 || pc.elongation < 2) continue;
    let jxx = 0, jyy = 0, jxy = 0;
    for (let y = 1; y < W - 1; y++) for (let x = 1; x < W - 1; x++) {
      const p = y * W + x; if (SD[i][p] < 3) continue;
      const gx = (L[p + 1] - L[p - 1]) / 2, gy = (L[p + W] - L[p - W]) / 2;
      jxx += gx * gx; jyy += gy * gy; jxy += gx * gy;
    }
    const grad = 0.5 * Math.atan2(2 * jxy, jxx - jyy), bandDir = grad + Math.PI / 2;
    let e = Math.abs(bandDir - pc.axis) % Math.PI; e = Math.min(e, Math.PI - e);
    errs.push((e * 180) / Math.PI);
  }
  return { pieces: errs.length, median: +median(errs).toFixed(1) };
}

function fit(img) {
  // along each piece's planned outline, every pixel or so: where across the outline brightness changes most
  const W = SIZE, Lat = (x, y) => { const x0 = Math.floor(x - 0.5), y0 = Math.floor(y - 0.5), fx = x - 0.5 - x0, fy = y - 0.5 - y0, at = (a, b) => lum(img.rgb, Math.min(W - 1, Math.max(0, b)) * W + Math.min(W - 1, Math.max(0, a)));
    return at(x0, y0) * (1 - fx) * (1 - fy) + at(x0 + 1, y0) * fx * (1 - fy) + at(x0, y0 + 1) * (1 - fx) * fy + at(x0 + 1, y0 + 1) * fx * fy; };
  let n = 0, hit = 0;
  for (const [i] of PIECES.entries()) {
    const sd = SD[i];
    for (const path of levelLines(sd, W, W, 0)) {
      let acc = 0;
      for (let k = 1; k < path.length; k++) {
        acc += Math.hypot(path[k][0] - path[k - 1][0], path[k][1] - path[k - 1][1]);
        if (acc < 1) continue; acc = 0;
        const [x, y] = path[k], xi = Math.round(x - 0.5), yi = Math.round(y - 0.5);
        if (xi < 2 || yi < 2 || xi > W - 3 || yi > W - 3) continue;
        let gx = (sd[yi * W + xi + 1] - sd[yi * W + xi - 1]) / 2, gy = (sd[(yi + 1) * W + xi] - sd[(yi - 1) * W + xi]) / 2;
        const gl = Math.hypot(gx, gy); if (gl < 0.3) continue; gx /= gl; gy /= gl;
        const prof = []; for (let t = -4; t <= 4.001; t += 0.25) prof.push(Lat(x + gx * t, y + gy * t));
        let best = 0, at = 0;
        for (let q = 1; q < prof.length - 1; q++) { const dv = Math.abs(prof[q + 1] - prof[q - 1]); if (dv > best) { best = dv; at = -4 + q * 0.25; } }
        n++; if (Math.abs(at) <= 1) hit++;
      }
    }
  }
  return { points: n, share: +(hit / n).toFixed(3) };
}

function run(label, over = {}) {
  const o = { ...INLAY_DEFAULTS, ...over, width: SIZE, height: SIZE, seed: 13, pieces: PIECES };
  const img = inlaid(o), random = inlaid({ ...o, turn: 'random' }), cells = inlaid({ ...o, cut: 'cells' });
  const b = bands(img), bc = bands(random), f = fit(img), fc = fit(cells);
  const checks = { bands: b.median <= 15 && bc.median >= 35, fit: f.share >= 0.9 && fc.share <= 0.5 };
  return { label, bands: b, bandsRandom: bc, fit: f, fitCells: fc, checks, pass: Object.values(checks).every(Boolean) };
}

const HAND = { turnErr: INLAY_DEFAULTS.turnErr, seamVary: INLAY_DEFAULTS.seamVary, chips: INLAY_DEFAULTS.chips, polish: INLAY_DEFAULTS.polish };
const results = [run('default'), run('off', Object.fromEntries(Object.keys(HAND).map((k) => [k, 0])))];
for (const f of [2, 3]) results.push(run(`x${f}`, Object.fromEntries(Object.entries(HAND).map(([k, v]) => [k, v * f]))));
for (const r of results) console.log(`${r.label.padEnd(8)} bands ${r.bands.median}° from the long axis over ${r.bands.pieces} pieces (turned at random ${r.bandsRandom.median}°)  ` +
  `edge within 1 px of the outline at ${r.fit.share} of ${r.fit.points} points (cut as cells ${r.fitCells.share})  -> ${Object.entries(r.checks).map(([k, v]) => `${k} ${v ? 'ok' : 'NO'}`).join(', ')}`);
const out = process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : null;
if (out) { mkdirSync(dirname(out), { recursive: true }); writeFileSync(out, JSON.stringify({ size: SIZE, defaults: INLAY_DEFAULTS, results }, null, 1) + '\n'); }
process.exitCode = results[0].pass ? 0 : 1;
