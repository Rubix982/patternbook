// engine/check/glaze.mjs
// C-026's check: from the image alone, does a glaze pool in hollows and thin over ridges, level the body's fine
// texture, and spread the pigment under it more where it lies thick?
//   node engine/check/glaze.mjs [--out runs/c026/check.json]
// The body's relief and the painted lines are the plan, which a reader knows: they say where hollows, ridges and lines
// are. Everything else is read from the image.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { glazed, gauss, GLAZE_DEFAULTS } from '../core/glaze.js';
import { lum } from './readback.mjs';

const SIZE = 360;
const median = (xs) => { const v = [...xs].sort((a, b) => a - b); return v.length ? v[Math.floor(v.length / 2)] : NaN; };
const std = (xs) => { const m = xs.reduce((a, b) => a + b, 0) / xs.length; return Math.sqrt(xs.reduce((a, v) => a + (v - m) ** 2, 0) / xs.length); };

// ---- pooling: grooves and ridges across the tile, 3 px deep or high, 4 px either side of their centre line ----
const FEATURES = Array.from({ length: 8 }, (_, k) => ({ y: 30 + k * 42, kind: k % 2 ? 'ridge' : 'hollow' }));
const profile = (d) => (Math.abs(d) < 4 ? Math.cos((Math.PI * d) / 8) ** 2 : 0);
const reliefBody = (x, y) => FEATURES.reduce((h, f) => h + (f.kind === 'ridge' ? 3 : -3) * profile(y - f.y), 0);
function pooling(over) {
  const o = { ...GLAZE_DEFAULTS, ...over };
  const img = glazed({ ...o, width: SIZE, height: SIZE, body: reliefBody });
  const slip = o.slip.replace('#', ''), sr = parseInt(slip.slice(0, 2), 16) / 255, sb = parseInt(slip.slice(4, 6), 16) / 255;
  // the tint's density from the ratio of blue (absorbed most) to red (absorbed least): the lighting multiplies both
  const D = (p) => -Math.log((img.rgb[p * 3 + 2] / img.rgb[p * 3]) / (sb / sr));
  const zone = { hollow: [], ridge: [], flat: [] };
  for (let y = 0; y < SIZE; y++) {
    const near = FEATURES.map((f) => [Math.abs(y + 0.5 - f.y), f.kind]).sort((a, b) => a[0] - b[0])[0];
    const z = near[0] < 1 ? near[1] : near[0] > 12 ? 'flat' : null;
    // run 1 counted every pixel; on slopes facing the lamp the red channel saturates, the lighting no longer cancels in
    // the ratio, and the density reads low. A pixel with a channel at full brightness says nothing about the tint.
    if (z) for (let x = 0; x < SIZE; x++) { const p = y * SIZE + x; if (Math.max(img.rgb[p * 3], img.rgb[p * 3 + 1], img.rgb[p * 3 + 2]) < 0.995) zone[z].push(D(p)); }
  }
  const flat = median(zone.flat);
  return { flat: +flat.toFixed(4), hollow: +(median(zone.hollow) / flat).toFixed(3), ridge: +(median(zone.ridge) / flat).toFixed(3) };
}

// ---- levelling: a broad dome and a fine texture ----
const domeBody = (x, y) => 9 * Math.exp(-((x - 180) ** 2 + (y - 180) ** 2) / (2 * 80 * 80)) + 0.6 * Math.sin(x / 1.3 + 2 * Math.sin(y / 9)) * Math.cos(y / 1.7);
function shares(img) {
  const L = Float64Array.from({ length: SIZE * SIZE }, (_, p) => lum(img.rgb, p));
  const b2 = gauss(L, SIZE, SIZE, 2), b8 = gauss(L, SIZE, SIZE, 8), fine = [], broad = [];
  for (let y = 20; y < SIZE - 20; y++) for (let x = 20; x < SIZE - 20; x++) { const p = y * SIZE + x; fine.push(L[p] - b2[p]); broad.push(b8[p]); }
  return { fine: std(fine), broad: std(broad) };
}
function levelling(over) {
  const o = { ...GLAZE_DEFAULTS, ...over, width: SIZE, height: SIZE, body: domeBody };
  const bare = shares(glazed({ ...o, glaze: false })), glz = shares(glazed(o)), follow = shares(glazed({ ...o, level: 0 }));
  return { fine: +(glz.fine / bare.fine).toFixed(3), broad: +(glz.broad / bare.broad).toFixed(3), followFine: +(follow.fine / bare.fine).toFixed(3),
    bare: { fine: +bare.fine.toFixed(4), broad: +bare.broad.toFixed(4) } };
}

// ---- spread: cobalt lines 3 px wide, every 24 px, under a glaze from 0.4 to 2 times the amount, left to right ----
const LINES = Array.from({ length: 14 }, (_, k) => 24 + k * 24);
const lineMask = (x) => (LINES.some((c) => Math.abs(x - c) < 1.5) ? 1 : 0);
function spread(over) {
  const o = { ...GLAZE_DEFAULTS, ...over };
  const img = glazed({ ...o, width: SIZE, height: SIZE, paint: [{ mask: (x) => lineMask(x), colour: '#1d3f9a' }], amountAt: (x) => 0.4 + 1.6 * (x / SIZE) });
  const prof = new Float64Array(SIZE);
  for (let x = 0; x < SIZE; x++) { let s = 0; for (let y = 0; y < SIZE; y++) s += lum(img.rgb, y * SIZE + x); prof[x] = s / SIZE; }
  const widths = LINES.map((c) => {
    const ci = Math.round(c - 0.5), lo = prof[ci], hi = Math.max(prof[ci - 11], prof[ci + 11]);
    const cross = (dir, f) => { const t = lo + f * (hi - lo); for (let k = 0; k < 11; k++) { const a = prof[ci + dir * k], b = prof[ci + dir * (k + 1)]; if (a <= t && b > t) return k + (t - a) / (b - a); } return null; };
    return ((cross(1, 0.9) - cross(1, 0.1)) + (cross(-1, 0.9) - cross(-1, 0.1))) / 2;
  });
  const thin = widths.slice(0, 4), thick = widths.slice(-4), mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
  return { thin: +mean(thin).toFixed(2), thick: +mean(thick).toFixed(2), ratio: +(mean(thick) / mean(thin)).toFixed(3) };
}

function run(label, over = {}) {
  const pool = pooling(over), poolCtl = pooling({ ...over, level: 0 });
  const lev = levelling(over);
  const spr = spread(over), sprCtl = spread({ ...over, flow: 0 });
  const checks = {
    pooling: pool.hollow >= 1.3 && pool.ridge <= 0.8 && Math.abs(poolCtl.hollow - 1) <= 0.05 && Math.abs(poolCtl.ridge - 1) <= 0.05,
    levelling: lev.fine <= 0.5 && lev.broad >= 0.7 && lev.followFine >= 0.8,
    spread: spr.ratio >= 1.5 && Math.abs(sprCtl.ratio - 1) <= 0.1,
  };
  return { label, pooling: pool, poolingControl: poolCtl, levelling: lev, spread: spr, spreadControl: sprCtl, checks, pass: Object.values(checks).every(Boolean) };
}

const HAND = { uneven: GLAZE_DEFAULTS.uneven, craze: GLAZE_DEFAULTS.craze, pinholes: GLAZE_DEFAULTS.pinholes, brush: GLAZE_DEFAULTS.brush };
const results = [run('default'), run('off', Object.fromEntries(Object.keys(HAND).map((k) => [k, 0])))];
for (const f of [2, 3]) results.push(run(`x${f}`, Object.fromEntries(Object.entries(HAND).map(([k, v]) => [k, Math.min(k === 'craze' ? 1 : Infinity, v * f)]))));
for (const r of results) console.log(`${r.label.padEnd(8)} pooling: hollow ${r.pooling.hollow}x, ridge ${r.pooling.ridge}x of flat (even glaze ${r.poolingControl.hollow}/${r.poolingControl.ridge})  ` +
  `levelling: fine ${r.levelling.fine}, dome ${r.levelling.broad} of bare (following ${r.levelling.followFine})  ` +
  `spread: edges ${r.spread.thin}->${r.spread.thick}px, ${r.spread.ratio}x (no flow ${r.spreadControl.ratio}x)  -> ${Object.entries(r.checks).map(([k, v]) => `${k} ${v ? 'ok' : 'NO'}`).join(', ')}`);
const out = process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : null;
if (out) { mkdirSync(dirname(out), { recursive: true }); writeFileSync(out, JSON.stringify({ size: SIZE, defaults: GLAZE_DEFAULTS, results }, null, 1) + '\n'); }
process.exitCode = results[0].pass ? 0 : 1;
