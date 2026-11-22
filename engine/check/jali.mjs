// engine/check/jali.mjs
// C-028's check: from the image alone, does a thick screen narrow the sunlight through it as its thickness predicts,
// do the cast light's edges soften with distance, and does each opening show its inner wall when seen at an angle?
//   node engine/check/jali.mjs [--out runs/c028/check.json]
// The pattern (square openings 24 px across, 12 px bars), the thickness, the sun's and the eye's directions and the
// wall's distance are the plan, which a reader knows. Everything else is read from the image.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { screenView, castLight, LATTICES, JALI_DEFAULTS } from '../core/jali.js';
import { lum } from './readback.mjs';

const SIZE = 360, CELL = 36, BAR = 12, A = CELL - BAR, T0 = 12;
const median = (xs) => { const v = [...xs].filter((x) => Number.isFinite(x)).sort((a, b) => a - b); return v.length ? v[Math.floor(v.length / 2)] : NaN; };
const pct = (xs, q) => { const v = [...xs].sort((a, b) => a - b); return v[Math.floor(q * (v.length - 1))]; };

function litShare(img) {
  const L = Array.from({ length: SIZE * SIZE }, (_, p) => lum(img.rgb, p)), lo = pct(L, 0.02), hi = pct(L, 0.98), mid = (lo + hi) / 2;
  return L.filter((v) => v >= mid).length;
}
function narrowing(o) {
  const area = (a) => litShare(castLight({ ...o, sunAngle: a, distance: 120 }));
  const a0 = area(0);
  return [20, 40].map((a) => ({ angle: a, share: +(area(a) / a0).toFixed(3), predicted: +(1 - (o.thickness * Math.tan((a * Math.PI) / 180)) / A).toFixed(3) }));
}

// the 10-90 % widths of a lit patch's two edges across x, from its rows' average
function patchEdges(img, xa, xb, y0, y1) {
  const prof = [];
  for (let x = Math.floor(xa) - 8; x <= Math.ceil(xb) + 8; x++) { let s = 0; for (let y = y0; y < y1; y++) s += lum(img.rgb, y * SIZE + Math.min(SIZE - 1, Math.max(0, x))); prof.push(s / (y1 - y0)); }
  const hi = Math.max(...prof), lo = Math.min(...prof), at = (f, from, step) => { const t = lo + f * (hi - lo); for (let k = from; k >= 0 && k + step >= 0 && k + step < prof.length; k += step) { const a = prof[k], b = prof[k + step]; if ((a - t) * (b - t) <= 0 && a !== b) return k + (step * (a - t)) / (a - b); } return NaN; };
  const peak = prof.indexOf(hi);
  return [Math.abs(at(0.9, peak, -1) - at(0.1, peak, -1)), Math.abs(at(0.1, peak, 1) - at(0.9, peak, 1))];
}
function softening(o) {
  const tn = Math.tan((20 * Math.PI) / 180), widthAt = (D) => {
    const img = castLight({ ...o, sunAngle: 20, distance: D }), ws = [];
    for (let j = 0; j * CELL + CELL <= SIZE; j++) for (let i = -20; i * CELL < SIZE + 20 * CELL; i++) {
      const x0 = i * CELL + BAR / 2, x1 = x0 + A, xa = x0 - D * tn, xb = x1 - o.thickness * tn - D * tn;
      if (xa < 10 || xb > SIZE - 10) continue;
      ws.push(...patchEdges(img, xa, xb, j * CELL + BAR / 2 + 6, j * CELL + BAR / 2 + A - 6));
    }
    return median(ws);
  };
  const near = widthAt(150), far = widthAt(450);
  return { near: +near.toFixed(2), far: +far.toFixed(2), ratio: +(far / near).toFixed(3) };
}

function innerWalls(o) {
  const img = screenView({ ...o, viewAngle: 25 }), out = [];
  for (let j = 0; j * CELL + CELL <= SIZE; j++) for (let i = 0; i * CELL + CELL <= SIZE; i++) {
    const x0 = i * CELL + BAR / 2, y0 = j * CELL + BAR / 2, prof = [];
    for (let x = x0 - 5; x < x0 + A + 5; x++) { let s = 0; for (let y = y0 + 6; y < y0 + A - 6; y++) s += lum(img.rgb, y * SIZE + x); prof.push(s / (A - 12)); }
    // the face on the left, the outside, then (towards the eye's side) the inner wall, then the face again
    const Ls = Math.max(...prof), Lf = (prof[0] + prof[1] + prof[prof.length - 1] + prof[prof.length - 2]) / 4;
    const k0 = prof.indexOf(Ls);
    const cross = (t, from, step, rising) => { for (let k = from; k + step >= 0 && k + step < prof.length; k += step) { const a = prof[k], b = prof[k + step]; if ((rising ? a < t && b >= t : a > t && b <= t)) return k + (step * (t - a)) / (b - a); } return NaN; };
    const left = cross((Lf + Ls) / 2, k0, -1, false);
    // right of the outside: the lowest point before the face is the wall (if there is one)
    const skyEnd = (() => { for (let k = k0; k < prof.length - 1; k++) if (prof[k + 1] < (Ls + Lf) / 2) return k; return prof.length - 1; })();
    const tail = prof.slice(skyEnd + 1), Lr = Math.min(...tail);
    if (Lf - Lr < 0.04) { out.push(0); continue; } // no wall darker than the face: none seen
    const skyRight = cross((Ls + Lr) / 2, k0, 1, false), frontRight = cross((Lr + Lf) / 2, skyEnd + 1 + tail.indexOf(Lr), 1, true);
    out.push(frontRight - skyRight);
    void left;
  }
  return { median: +median(out).toFixed(2), planned: +(o.thickness * Math.tan((25 * Math.PI) / 180)).toFixed(2), openings: out.length };
}

function run(label, over = {}) {
  const o = { ...JALI_DEFAULTS, ...over, width: SIZE, height: SIZE, seed: 17, thickness: T0 };
  o.open = LATTICES.squares(CELL, BAR, o.vary, 17);
  const thin = { ...o, thickness: 0 };
  const n = narrowing(o), nc = narrowing(thin), s = softening(o), sc = softening({ ...o, sunSize: 0 }), w = innerWalls(o), wc = innerWalls(thin);
  const checks = {
    narrowing: n.every((r) => Math.abs(r.share - r.predicted) <= 0.05) && nc.every((r) => r.share >= 0.95),
    softening: s.ratio >= 2 && Math.abs(sc.ratio - 1) <= 0.1,
    walls: Math.abs(w.median - w.planned) <= 0.75 && wc.median < 0.5,
  };
  return { label, narrowing: n, narrowingThin: nc, softening: s, softeningPointSun: sc, walls: w, wallsThin: wc, checks, pass: Object.values(checks).every(Boolean) };
}

const HAND = { vary: JALI_DEFAULTS.vary, wear: JALI_DEFAULTS.wear, grain: JALI_DEFAULTS.grain, chisel: JALI_DEFAULTS.chisel, unevenWall: JALI_DEFAULTS.unevenWall };
const results = [run('default'), run('off', Object.fromEntries(Object.keys(HAND).map((k) => [k, 0])))];
for (const f of [2, 3]) results.push(run(`x${f}`, Object.fromEntries(Object.entries(HAND).map(([k, v]) => [k, v * f]))));
for (const r of results) console.log(`${r.label.padEnd(8)} lit area at 20°/40°: ${r.narrowing.map((x) => `${x.share} (thickness predicts ${x.predicted})`).join(', ')}; no thickness ${r.narrowingThin.map((x) => x.share).join(', ')}  ` +
  `edges ${r.softening.near}->${r.softening.far}px, ${r.softening.ratio}x (point sun ${r.softeningPointSun.ratio}x)  inner wall ${r.walls.median}px for ${r.walls.planned} (no thickness ${r.wallsThin.median})  -> ${Object.entries(r.checks).map(([k, v]) => `${k} ${v ? 'ok' : 'NO'}`).join(', ')}`);
const out = process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : null;
if (out) { mkdirSync(dirname(out), { recursive: true }); writeFileSync(out, JSON.stringify({ size: SIZE, cell: CELL, bar: BAR, thickness: T0, defaults: JALI_DEFAULTS, results }, null, 1) + '\n'); }
process.exitCode = results[0].pass ? 0 : 1;
