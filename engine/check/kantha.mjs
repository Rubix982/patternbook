// engine/check/kantha.mjs
// C-023's check: from the rendered cloth alone, do the stitches inside each motif follow its contour, lie on rows,
// keep their planned length, and does the quilting's ripple repeat with the rows?
//   node engine/check/kantha.mjs [--out runs/c023/check.json]
// The motifs' thread is dark blue on a cream ground, so a pixel's hue says whether it is motif thread. Each stitch is a
// connected patch of that thread. The motifs and the rows' spacing are the design drawn on the cloth, which the
// embroiderer follows: the reader uses them to say where the contour runs and where rows should be.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DEFAULTS } from '../core/weave.js';
import { kantha, SHAPES, KANTHA_DEFAULTS } from '../core/kantha.js';
import { signedDistance } from '../core/field.js';
import { hueSat, lum } from './readback.mjs';

const SIZE = 320;
const MOTIFS = [SHAPES.circle(80, 80, 55), SHAPES.paisley(225, 95, 45, 0.5), SHAPES.lotus(160, 235, 75)];
const SD = MOTIFS.map((m) => signedDistance(m, SIZE, SIZE));
// the background rows are stitched in a pale green for this check only, so their thread can be left out by hue and
// every pixel row of ground still counts (leaving out whole pixel rows under the stitches made a gap every row, which
// repeats at the row gap on its own)
const isRowThread = (img, p) => { const [h, s] = hueSat(img.rgb, p); return s > 0.15 && h > 70 && h < 140; };
const isMotifThread = (img, p) => { const [h, s] = hueSat(img.rgb, p); return s > 0.35 && h > 195 && h < 255; };
const median = (xs) => { const v = [...xs].sort((a, b) => a - b); return v.length ? v[Math.floor(v.length / 2)] : null; };
const modeOf = (xs, bin = 0.5) => { const c = new Map(); for (const x of xs) { const k = Math.round(x / bin) * bin; c.set(k, (c.get(k) || 0) + 1); } return [...c.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null; };

function stitches(img) {
  const N = SIZE * SIZE, seen = new Uint8Array(N), out = [];
  for (let p = 0; p < N; p++) {
    if (seen[p] || !isMotifThread(img, p)) continue;
    const pts = [], st = [p]; seen[p] = 1;
    while (st.length) {
      const q = st.pop(), x = q % SIZE, y = Math.floor(q / SIZE); pts.push([x + 0.5, y + 0.5]);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const xx = x + dx, yy = y + dy, r = yy * SIZE + xx;
        if (xx >= 0 && yy >= 0 && xx < SIZE && yy < SIZE && !seen[r] && isMotifThread(img, r)) { seen[r] = 1; st.push(r); }
      }
    }
    if (pts.length < 5) continue;
    const cx = pts.reduce((a, q) => a + q[0], 0) / pts.length, cy = pts.reduce((a, q) => a + q[1], 0) / pts.length;
    let sxx = 0, syy = 0, sxy = 0;
    for (const [x, y] of pts) { sxx += (x - cx) ** 2; syy += (y - cy) ** 2; sxy += (x - cx) * (y - cy); }
    const ang = 0.5 * Math.atan2(2 * sxy, sxx - syy), ux = Math.cos(ang), uy = Math.sin(ang);
    let lo = Infinity, hi = -Infinity;
    for (const [x, y] of pts) { const t = (x - cx) * ux + (y - cy) * uy; lo = Math.min(lo, t); hi = Math.max(hi, t); }
    const len = hi - lo + 1, width = pts.length / len;
    out.push({ cx, cy, ang, len, width, stitch: len - width });
  }
  return out;
}

function contourCheck(img, rowGap) {
  const ss = stitches(img);
  const errs = [], onRow = [], lens = [];
  for (const s of ss) {
    const m = MOTIFS.findIndex((f) => f(s.cx, s.cy));
    if (m < 0) continue;
    const sd = SD[m], xi = Math.round(s.cx - 0.5), yi = Math.round(s.cy - 0.5);
    if (xi < 1 || yi < 1 || xi >= SIZE - 1 || yi >= SIZE - 1) continue;
    const gx = (sd[yi * SIZE + xi + 1] - sd[yi * SIZE + xi - 1]) / 2, gy = (sd[(yi + 1) * SIZE + xi] - sd[(yi - 1) * SIZE + xi]) / 2;
    if (Math.hypot(gx, gy) < 0.3) continue; // where the contour has no direction (a ridge of the field)
    const tang = Math.atan2(gx, -gy); // perpendicular to the gradient
    let e = Math.abs(s.ang - tang) % Math.PI; e = Math.min(e, Math.PI - e);
    errs.push((e * 180) / Math.PI);
    const d = sd[yi * SIZE + xi], k = (d - rowGap / 2) / rowGap;
    onRow.push(Math.abs(k - Math.round(k)) <= 0.25 ? 1 : 0);
    lens.push(s.stitch);
  }
  return { stitches: errs.length, medianAngle: +(median(errs) ?? 90).toFixed(1), onRow: +(onRow.reduce((a, b) => a + b, 0) / (onRow.length || 1)).toFixed(3), stitchLen: modeOf(lens) };
}

function rippleCheck(img, rowGap, sett, smooth = true) {
  // the background, away from the motifs: one brightness per pixel row, leaving out the stitched rows themselves
  const prof = new Float64Array(SIZE).fill(NaN);
  for (let y = 0; y < SIZE; y++) {
    let s = 0, n = 0;
    for (let x = 0; x < SIZE; x++) {
      if (MOTIFS.some((f, m) => SD[m][y * SIZE + x] > -12)) continue;
      if (isRowThread(img, y * SIZE + x)) continue; // the quilting thread itself (coloured for this check), not the cloth
      s += lum(img.rgb, y * SIZE + x); n++;
    }
    if (n > 40) prof[y] = s / n;
  }
  // the weave's picks repeat every `sett` pixels and would read as a ripple of their own: averaging over exactly one
  // pick cancels that repeat and its multiples (a reader knows the cloth's sett), leaving the quilting's
  if (smooth) {
    const sm = new Float64Array(SIZE).fill(NaN), a = Math.floor(sett / 2), b = sett - a - 1;
    for (let y = 0; y < SIZE; y++) { let t = 0, n = 0; for (let k = y - a; k <= y + b; k++) if (k >= 0 && k < SIZE && !Number.isNaN(prof[k])) { t += prof[k]; n++; } if (n === sett) sm[y] = t / n; }
    prof.set(sm);
  }
  const vals = [...prof].filter((v) => !Number.isNaN(v)), mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const ac = (lag) => { let s = 0, a = 0, b = 0; for (let y = 0; y + lag < SIZE; y++) { const u = prof[y] - mean, v = prof[y + lag] - mean; if (Number.isNaN(u) || Number.isNaN(v)) continue; s += u * v; a += u * u; b += v * v; } return a && b ? s / Math.sqrt(a * b) : 0; };
  let best = 0, bestLag = 0;
  for (let lag = Math.ceil(0.6 * rowGap); lag <= Math.floor(1.5 * rowGap); lag++) { const v = ac(lag); if (v > best) { best = v; bestLag = lag; } }
  // how large the repeat is, in brightness: autocorrelation divides this out, so a profile that is all but flat can
  // still show a high autocorrelation from a residue too small to see
  const sd = Math.sqrt(vals.reduce((a, v) => a + (v - mean) ** 2, 0) / vals.length);
  return { period: bestLag, autocorr: +best.toFixed(3), amplitude: +sd.toFixed(4) };
}

const common = { ...DEFAULTS, ...KANTHA_DEFAULTS, width: SIZE, height: SIZE, sett: 3, slub: 0.15, warp: ['#efe8d8'], weft: ['#ebe3d1'],
  groundColour: '#d9cfbb', seed: 7, lightAngle: 300, groundThread: '#9fbf8a' };
const motifs = MOTIFS.map((inside) => ({ inside, colour: '#1f3a7a' }));

function run(label, over = {}) {
  const o = { ...common, ...over };
  const img = kantha({ ...o, motifs });
  const c = contourCheck(img, o.rowGap);
  const ctl = contourCheck(kantha({ ...o, motifs, rows: 'straight' }), o.rowGap);
  const flatImg = kantha({ ...o, motifs, ripple: 0 });
  const rip = rippleCheck(img, o.rowGap, o.sett), flat = rippleCheck(flatImg, o.rowGap, o.sett);
  const raw = { ripple: rippleCheck(img, o.rowGap, o.sett, false), noRipple: rippleCheck(flatImg, o.rowGap, o.sett, false) };
  const checks = {
    direction: c.medianAngle <= 15 && ctl.medianAngle >= 30,
    rows: c.onRow >= 0.8,
    stitch: Math.abs(c.stitchLen - o.stitchLen) <= 0.2 * o.stitchLen,
    ripple: Math.abs(rip.period - o.rowGap) <= 0.15 * o.rowGap && rip.autocorr >= 0.3 && flat.autocorr <= 0.1,
  };
  return { label, contour: c, control: ctl, ripple: rip, noRipple: flat, unsmoothed: raw, checks, pass: Object.values(checks).every(Boolean) };
}

const results = [run('default'), run('off', { slub: 0, beat: 0, wobble: 0, fibre: 0, wrinkle: 0, jitter: 0, wanderStitch: 0 })];
for (const f of [2, 3]) results.push(run(`x${f}`, { wrinkle: Math.min(1, KANTHA_DEFAULTS.wrinkle * f), jitter: 0.1 * f, wanderStitch: 0.15 * f, slub: 0.15 * f, beat: 0.2 * f }));
for (const r of results) console.log(`${r.label.padEnd(8)} angle to contour ${r.contour.medianAngle}° (straight rows ${r.control.medianAngle}°)  on a row ${r.contour.onRow}  stitch ${r.contour.stitchLen}px (${r.contour.stitches} stitches)  ` +
  `ripple period ${r.ripple.period}px ac ${r.ripple.autocorr} size ${r.ripple.amplitude} (no ripple: ac ${r.noRipple.autocorr} size ${r.noRipple.amplitude}; unsmoothed ac ${r.unsmoothed.ripple.autocorr}/${r.unsmoothed.noRipple.autocorr})  -> ${Object.entries(r.checks).map(([k, v]) => `${k} ${v ? 'ok' : 'NO'}`).join(', ')}`);
const out = process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : null;
if (out) { mkdirSync(dirname(out), { recursive: true }); writeFileSync(out, JSON.stringify({ size: SIZE, defaults: common, results }, null, 1) + '\n'); }
process.exitCode = results[0].pass ? 0 : 1;
