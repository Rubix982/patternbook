// engine/check/mirror.mjs
// C-025's check: from the image alone, is each mirror's opening enclosed and smaller than its glass, do the ring's
// stitches radiate and number what the chain's link plans, does the opening keep the holding grid's square, and does a
// curved, tilted glass catch the light in its own place?
//   node engine/check/mirror.mjs [--out runs/c025/check.json]
// The thread is red-orange on a navy cloth, and the glass reflects only greys and a pale lamp, so a pixel's hue says
// whether it is thread. The mirrors' planned centres and sizes, and the ring's planned extent, are the design drawn on
// the cloth, which the embroiderer follows and a reader knows.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DEFAULTS } from '../core/weave.js';
import { mirrored, lattice, MIRROR_DEFAULTS } from '../core/mirror.js';
import { hueSat, lum } from './readback.mjs';

const SIZE = 400, R = 24, MIRRORS = lattice(SIZE, SIZE, 80, R, 12);
const isThread = (img, p) => { const [h, s] = hueSat(img.rgb, p); return s > 0.45 && (h < 30 || h > 340); };
const median = (xs) => { const v = [...xs].sort((a, b) => a - b); return v.length ? v[Math.floor(v.length / 2)] : NaN; };
const share = (xs) => xs.filter(Boolean).length / (xs.length || 1);

function blur(f, W, H, s) {
  const R = Math.ceil(3 * s), k = Array.from({ length: 2 * R + 1 }, (_, i) => Math.exp(-((i - R) ** 2) / (2 * s * s)));
  const t = new Float64Array(W * H), out = new Float64Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { let a = 0, n = 0; for (let i = -R; i <= R; i++) { const xx = x + i; if (xx >= 0 && xx < W) { a += k[i + R] * f[y * W + xx]; n += k[i + R]; } } t[y * W + x] = a / n; }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { let a = 0, n = 0; for (let i = -R; i <= R; i++) { const yy = y + i; if (yy >= 0 && yy < H) { a += k[i + R] * t[yy * W + x]; n += k[i + R]; } } out[y * W + x] = a / n; }
  return out;
}

function read(img) {
  const W = SIZE, N = W * W, M = new Uint8Array(N);
  for (let p = 0; p < N; p++) M[p] = isThread(img, p) ? 1 : 0;
  // ground reachable from the image's edge without crossing thread (4-connected, so a diagonal line of thread blocks it)
  const seen = new Uint8Array(N), st = [];
  const push = (p) => { if (!seen[p] && !M[p]) { seen[p] = 1; st.push(p); } };
  for (let i = 0; i < W; i++) { push(i); push((W - 1) * W + i); push(i * W); push(i * W + W - 1); }
  while (st.length) { const p = st.pop(), x = p % W; if (x > 0) push(p - 1); if (x < W - 1) push(p + 1); if (p >= W) push(p - W); if (p + W < N) push(p + W); }
  // the thread's direction: the structure tensor of the thread mask
  const m = blur(Float64Array.from(M), W, W, 0.8), gxx = new Float64Array(N), gyy = new Float64Array(N), gxy = new Float64Array(N);
  for (let y = 1; y < W - 1; y++) for (let x = 1; x < W - 1; x++) { const p = y * W + x, gx = (m[p + 1] - m[p - 1]) / 2, gy = (m[p + W] - m[p - W]) / 2; gxx[p] = gx * gx; gyy[p] = gy * gy; gxy[p] = gx * gy; }
  const Jxx = blur(gxx, W, W, 1.5), Jyy = blur(gyy, W, W, 1.5), Jxy = blur(gxy, W, W, 1.5);
  return { M, seen, Jxx, Jyy, Jxy };
}

function measure(img, o, rd = read(img)) {
  const W = SIZE, { M, seen, Jxx, Jyy, Jxy } = rd;
  const inner = R * (1 - o.overlap) + 2.5, outer = R * (1 + o.reach) - o.loop / 2 - 1.5, mid = (inner + outer) / 2;
  const planned = Math.round((2 * Math.PI * R * (1 + o.reach)) / o.link);
  const per = [], angles = [];
  for (const { x: cx, y: cy } of MIRRORS) {
    // the opening: the ground enclosed around the planned centre
    let start = -1;
    for (let r = 0; r <= 3 && start < 0; r++) for (let dy = -r; dy <= r && start < 0; dy++) for (let dx = -r; dx <= r; dx++) { const p = Math.round(cy + dy) * W + Math.round(cx + dx); if (!M[p]) { start = p; break; } }
    const enclosed = start >= 0 && !seen[start];
    const pix = [];
    if (enclosed) {
      const vis = new Set([start]), q = [start];
      while (q.length) { const p = q.pop(); pix.push(p); const x = p % W; for (const r of [x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1, p - W, p + W]) if (r >= 0 && r < W * W && !M[r] && !seen[r] && !vis.has(r)) { vis.add(r); q.push(r); } }
    }
    const row = { enclosed, area: +(pix.length / (Math.PI * R * R)).toFixed(3) };
    // the ring's middle: the thread's direction against the radial, and the legs counted round a circle
    for (let y = Math.floor(cy - outer); y <= Math.ceil(cy + outer); y++) for (let x = Math.floor(cx - outer); x <= Math.ceil(cx + outer); x++) {
      const p = y * W + x, d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
      if (d < inner || d > outer || !M[p]) continue;
      const grad = 0.5 * Math.atan2(2 * Jxy[p], Jxx[p] - Jyy[p]), line = grad + Math.PI / 2, rad = Math.atan2(y + 0.5 - cy, x + 0.5 - cx);
      let e = Math.abs(line - rad) % Math.PI; e = Math.min(e, Math.PI - e);
      angles.push((e * 180) / Math.PI);
    }
    const S = 2880, on = [];
    for (let k = 0; k < S; k++) { const a = (2 * Math.PI * k) / S, x = Math.floor(cx + mid * Math.cos(a)), y = Math.floor(cy + mid * Math.sin(a)); on.push(M[y * W + x]); }
    let legs = 0; for (let k = 0; k < S; k++) if (on[k] && !on[(k - 1 + S) % S]) legs++;
    row.legs = legs;
    if (enclosed && pix.length > 30) {
      // the opening's outline: its radius from its own centroid, in 5-degree bins, and that outline's harmonics
      let sx = 0, sy = 0; for (const p of pix) { sx += (p % W) + 0.5; sy += Math.floor(p / W) + 0.5; }
      const ox = sx / pix.length, oy = sy / pix.length, B = 72, rad = new Float64Array(B);
      for (const p of pix) { const dx = (p % W) + 0.5 - ox, dy = Math.floor(p / W) + 0.5 - oy, b = Math.floor((mod2pi(Math.atan2(dy, dx)) / (2 * Math.PI)) * B) % B; rad[b] = Math.max(rad[b], Math.hypot(dx, dy) + 0.5); }
      const amp = (k) => { let c = 0, s = 0; for (let b = 0; b < B; b++) { const a = (2 * Math.PI * (b + 0.5)) / B; c += rad[b] * Math.cos(k * a); s += rad[b] * Math.sin(k * a); } return (2 / B) * Math.hypot(c, s); };
      const amps = Array.from({ length: 11 }, (_, i) => amp(i + 2));
      row.strongest = amps.indexOf(Math.max(...amps)) + 2; row.amp4 = +amps[2].toFixed(3);
      // the reflection: how much brighter the brightest 2 % is than the median, and where that brightest part lies
      const ls = pix.map((p) => [lum(img.rgb, p), p]).sort((a, b) => a[0] - b[0]), n98 = Math.floor(0.98 * ls.length);
      row.glint = +(ls[n98][0] - ls[Math.floor(ls.length / 2)][0]).toFixed(3);
      let gx = 0, gy = 0; const top = ls.slice(n98); for (const [, p] of top) { gx += (p % W) + 0.5; gy += Math.floor(p / W) + 0.5; }
      row.glintAt = [+((gx / top.length - cx) / R).toFixed(3), +((gy / top.length - cy) / R).toFixed(3)];
    }
    per.push(row);
  }
  return { per, planned, angle: +median(angles).toFixed(1) };
}
const mod2pi = (a) => ((a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
const scatter = (per) => { const g = per.filter((r) => r.glintAt).map((r) => r.glintAt), mx = g.reduce((a, q) => a + q[0], 0) / g.length, my = g.reduce((a, q) => a + q[1], 0) / g.length;
  return +Math.sqrt(g.reduce((a, q) => a + (q[0] - mx) ** 2 + (q[1] - my) ** 2, 0) / (2 * g.length)).toFixed(4); };

const common = { ...DEFAULTS, ...MIRROR_DEFAULTS, width: SIZE, height: SIZE, sett: 3, slub: 0.15, warp: ['#1f2a44'], weft: ['#24304d'], seed: 11, mirrors: MIRRORS };

function run(label, over = {}) {
  const o = { ...common, ...over };
  const main = measure(mirrored(o), o);
  const chain = measure(mirrored({ ...o, ring: 'chain' }), o);
  // added after run 1, reported and not counted: at this size a ring of chain stitch is a mesh of one-pixel eyes with no
  // direction to read; rings of running stitch are a ring that plainly runs round, to show the measure can see that
  const running = measure(mirrored({ ...o, ring: 'chain', rowKind: 'running' }), o);
  const round = measure(mirrored({ ...o, grid: 0 }), o);
  const flat = measure(mirrored({ ...o, curve: 0, tilt: 0 }), o);
  const tilted = o.tilt > 0 ? main : measure(mirrored({ ...o, tilt: MIRROR_DEFAULTS.tilt }), o);
  const untilted = measure(mirrored({ ...o, tilt: 0 }), o);
  const p = main.per;
  const summary = {
    mirrors: p.length, enclosed: share(p.map((r) => r.enclosed)), area: [Math.min(...p.map((r) => r.area)), Math.max(...p.map((r) => r.area))],
    angle: main.angle, chainAngle: chain.angle, runningAngle: running.angle, planned: main.planned, legs: [Math.min(...p.map((r) => r.legs)), Math.max(...p.map((r) => r.legs))],
    countOk: share(p.map((r) => Math.abs(r.legs - main.planned) <= 0.1 * main.planned)),
    order4: share(p.map((r) => r.strongest === 4)), amp4: median(p.map((r) => r.amp4)), amp4Round: median(round.per.map((r) => r.amp4)),
    roundStrongest: Object.entries(round.per.reduce((a, r) => ((a[r.strongest] = (a[r.strongest] || 0) + 1), a), {})).map(([k, v]) => `${k}:${v}`).join(' '),
    glintOk: share(p.map((r) => r.glint >= 0.25)), glintMedian: median(p.map((r) => r.glint)), flatOk: share(flat.per.map((r) => r.glint < 0.1)), flatMedian: median(flat.per.map((r) => r.glint)),
    scatterTilted: scatter(tilted.per), scatterUntilted: scatter(untilted.per),
  };
  const s = summary;
  const checks = {
    opening: s.enclosed === 1 && s.area[0] >= 0.4 && s.area[1] <= 0.85,
    stitches: s.angle <= 15 && s.chainAngle >= 45 && s.countOk >= 0.9,
    grid: s.order4 >= 0.8 && s.amp4Round < 0.5 * s.amp4,
    reflection: s.glintOk >= 0.9 && s.flatOk >= 0.9 && s.scatterTilted >= 3 * s.scatterUntilted && s.scatterUntilted < 0.05,
  };
  return { label, summary, per: p, checks, pass: Object.values(checks).every(Boolean) };
}

const HAND = ['roundness', 'offset', 'turn', 'jitter', 'wanderLeg', 'tilt', 'tarnish'];
const results = [run('default'), run('off', { ...Object.fromEntries(HAND.map((k) => [k, 0])), slub: 0, beat: 0, wobble: 0 })];
for (const f of [2, 3]) results.push(run(`x${f}`, Object.fromEntries(HAND.map((k) => [k, MIRROR_DEFAULTS[k] * f]))));
for (const r of results) {
  const s = r.summary;
  console.log(`${r.label}: ${s.mirrors} mirrors; enclosed ${s.enclosed}, area ${s.area.join('-')}; thread ${s.angle}° from radial (chain ring ${s.chainAngle}°; running rings, not counted, ${s.runningAngle}°); legs ${s.legs.join('-')} for ${s.planned} planned (${s.countOk} within 10 %)`);
  console.log(`   grid: order 4 strongest in ${s.order4} (amp ${s.amp4} px; no grid ${s.amp4Round}, strongest ${s.roundStrongest}); glint +${s.glintMedian} (${s.glintOk} >= 0.25; flat +${s.flatMedian}, ${s.flatOk} < 0.1); glint scatter ${s.scatterTilted} tilted, ${s.scatterUntilted} untilted  -> ${Object.entries(r.checks).map(([k, v]) => `${k} ${v ? 'ok' : 'NO'}`).join(', ')}`);
}
const out = process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : null;
if (out) { mkdirSync(dirname(out), { recursive: true }); writeFileSync(out, JSON.stringify({ size: SIZE, radius: R, defaults: common, results }, null, 1) + '\n'); }
process.exitCode = results[0].pass ? 0 : 1;
