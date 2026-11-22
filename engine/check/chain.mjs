// engine/check/chain.mjs
// C-022's check: from the rendered cloth alone, are each link's eye, the links' spacing and the chain's continuity
// there along every path, and does a running stitch on the same paths fail where a chain passes?
//   node engine/check/chain.mjs [--out runs/c022/check.json]
// The thread is red and the ground navy, so a pixel's hue says whether thread is on top. An eye is a patch of ground
// enclosed by thread (not reachable from the image's edge without crossing thread) that lies on the path; the paths are
// the design drawn on the cloth, which the embroiderer follows, and the planned stitch length is the design's.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DEFAULTS } from '../core/weave.js';
import { chained, PATHS, CHAIN_DEFAULTS, arcLength } from '../core/chain.js';
import { hueSat } from './readback.mjs';

const SIZE = 360;
const isThread = (img, p) => { const [h, s] = hueSat(img.rgb, p); return s > 0.45 && (h < 25 || h > 340); };
const TEST = {
  line: [PATHS.line(24, 44, 336, 44)],
  wave: [PATHS.wave(24, 130, 336, 26, 2)],
  circle: [PATHS.circle(95, 262, 66)],
  spiral: [PATHS.spiral(265, 258, 14, 74, 2.2)],
};
const RINGS = PATHS.rings(180, 180, 150, 110, CHAIN_DEFAULTS.loop, CHAIN_DEFAULTS.link);

function eyes(img) {
  const N = img.width * img.height, M = new Uint8Array(N);
  for (let p = 0; p < N; p++) M[p] = isThread(img, p) ? 1 : 0;
  const seen = new Uint8Array(N), stack = [];
  const push = (p) => { if (!seen[p] && !M[p]) { seen[p] = 1; stack.push(p); } };
  for (let x = 0; x < img.width; x++) { push(x); push((img.height - 1) * img.width + x); }
  for (let y = 0; y < img.height; y++) { push(y * img.width); push(y * img.width + img.width - 1); }
  const flood = () => { while (stack.length) { const p = stack.pop(), x = p % img.width; if (x > 0) push(p - 1); if (x < img.width - 1) push(p + 1); if (p >= img.width) push(p - img.width); if (p + img.width < N) push(p + img.width); } };
  flood();
  const found = [];
  for (let p = 0; p < N; p++) {
    if (seen[p] || M[p]) continue;
    let sx = 0, sy = 0, n = 0;
    seen[p] = 1; const st = [p];
    while (st.length) {
      const q = st.pop(), x = q % img.width, y = Math.floor(q / img.width);
      sx += x + 0.5; sy += y + 0.5; n++;
      for (const r of [x > 0 ? q - 1 : -1, x < img.width - 1 ? q + 1 : -1, q - img.width, q + img.width])
        if (r >= 0 && r < N && !seen[r] && !M[r]) { seen[r] = 1; st.push(r); }
    }
    if (n >= 2) found.push([sx / n, sy / n]);
  }
  return { found, M };
}

function measure(img, paths, link, loop) {
  const { found, M } = eyes(img);
  const out = [];
  for (const path of paths) {
    const s = arcLength(path), L = s[s.length - 1];
    const near = (x, y) => { let best = Infinity, at = 0; for (let k = 0; k < path.length; k += 1) { const d = Math.hypot(path[k][0] - x, path[k][1] - y); if (d < best) { best = d; at = s[k]; } } return [best, at]; };
    const on = found.map(([x, y]) => near(x, y)).filter(([d]) => d <= 0.35 * loop).map(([, at]) => at).sort((a, b) => a - b);
    const gaps = on.slice(1).map((v, k) => v - on[k]).filter((g) => g < 2.5 * link);
    const mean = gaps.reduce((a, b) => a + b, 0) / (gaps.length || 1);
    const cv = gaps.length ? Math.sqrt(gaps.reduce((a, g) => a + (g - mean) ** 2, 0) / gaps.length) / mean : 1;
    // continuity: thread within half a loop's width of the path, every third of a link along it
    let bins = 0, hit = 0;
    for (let at = 0; at <= L; at += link / 3) {
      bins++;
      const k = s.findIndex((v) => v >= at), [x, y] = path[Math.max(0, k)];
      const r = Math.ceil(loop / 2);
      let any = false;
      for (let dy = -r; dy <= r && !any; dy++) for (let dx = -r; dx <= r && !any; dx++) {
        const xx = Math.round(x + dx), yy = Math.round(y + dy);
        if (xx >= 0 && yy >= 0 && xx < img.width && yy < img.height && dx * dx + dy * dy <= r * r && M[yy * img.width + xx]) any = true;
      }
      if (any) hit++;
    }
    out.push({ planned: Math.round(L / link), eyes: on.length, cv: +cv.toFixed(3), continuity: +(hit / bins).toFixed(3) });
  }
  return out;
}

function run(label, over = {}) {
  const base = { ...DEFAULTS, ...CHAIN_DEFAULTS, ...over, width: SIZE, height: SIZE, sett: 5, warp: ['#1d2a4a'], weft: ['#22305a'], seed: 9 };
  const rows = [];
  const cases = { ...Object.fromEntries(Object.entries(TEST)), rings: RINGS };
  for (const [name, paths] of Object.entries(cases)) {
    const face = measure(chained({ ...base, paths }), paths, base.link, base.loop);
    const back = measure(chained({ ...base, paths, side: 'back' }), paths, base.link, base.loop);
    const running = measure(chained({ ...base, paths, kind: 'running' }), paths, base.link, base.loop);
    const sum = (xs, k) => xs.reduce((a, r) => a + r[k], 0);
    const planned = sum(face, 'planned'), faceEyes = sum(face, 'eyes');
    const checks = {
      eyes: face.every((r) => Math.abs(r.eyes - r.planned) <= 0.1 * r.planned),
      spacing: face.every((r) => r.cv <= 0.15),
      continuity: face.every((r) => r.continuity >= 0.98),
      control: sum(running, 'eyes') <= 0.05 * planned,
      back: sum(back, 'eyes') <= 0.05 * planned && back.every((r) => r.continuity >= 0.98),
    };
    rows.push({ label, path: name, paths: paths.length, planned, eyes: faceEyes, cv: Math.max(...face.map((r) => r.cv)), continuity: Math.min(...face.map((r) => r.continuity)),
      runningEyes: sum(running, 'eyes'), backEyes: sum(back, 'eyes'), backContinuity: Math.min(...back.map((r) => r.continuity)), checks, pass: Object.values(checks).every(Boolean) });
  }
  return rows;
}

// The limit: how the eyes' spacing holds as a ring's tightest curve closes in on the link length (every ring, kept or
// not, measured on its own).
const limit = [];
{
  const base = { ...DEFAULTS, ...CHAIN_DEFAULTS, width: SIZE, height: SIZE, sett: 5, warp: ['#1d2a4a'], weft: ['#22305a'], seed: 9 };
  const all = PATHS.rings(180, 180, 150, 110, CHAIN_DEFAULTS.loop);
  const img = chained({ ...base, paths: all });
  const m = measure(img, all, base.link, base.loop);
  all.forEach((_, k) => { const a = 150 - k * CHAIN_DEFAULTS.loop, b = 110 - k * CHAIN_DEFAULTS.loop; limit.push({ ring: k, tightestRadius: +(b * b / a).toFixed(1), radiusOverLink: +((b * b / a) / CHAIN_DEFAULTS.link).toFixed(2), ...m[k] }); });
}

const results = [...run('default'), ...run('off', { slub: 0, beat: 0, wobble: 0, jitter: 0, wander: 0, swell: 0 })];
const sweep = [];
for (const f of [2, 3, 4]) {
  const rs = run(`x${f}`, { jitter: Math.min(0.6, CHAIN_DEFAULTS.jitter * f), wander: CHAIN_DEFAULTS.wander * f, swell: Math.min(0.6, CHAIN_DEFAULTS.swell * f) });
  sweep.push({ factor: f, passed: rs.filter((r) => r.pass).length, of: rs.length, failed: rs.filter((r) => !r.pass).map((r) => `${r.path} (${Object.entries(r.checks).filter(([, v]) => !v).map(([k]) => k).join('+')})`) });
}
console.log('imperf.  path    planned eyes  max cv  min cont.  running eyes  back eyes/cont.   pass');
for (const r of results) console.log(`${r.label.padEnd(8)} ${r.path.padEnd(7)} ${String(r.planned).padEnd(7)} ${String(r.eyes).padEnd(5)} ${String(r.cv).padEnd(7)} ${String(r.continuity).padEnd(10)} ${String(r.runningEyes).padEnd(13)} ${`${r.backEyes}/${r.backContinuity}`.padEnd(17)} ${r.pass ? 'yes' : 'NO ' + Object.entries(r.checks).filter(([, v]) => !v).map(([k]) => k).join('+')}`);
console.log('\nthe limit: each ring\'s tightest curve against the link length, and its eyes\' spacing (cv):');
console.log('  ' + limit.map((r) => `${r.radiusOverLink}x: ${r.cv}`).join('  '));
console.log('\nhand variation scaled (link length, the holes\' wander, loop width):');
for (const w of sweep) console.log(`  x${w.factor}: ${w.passed}/${w.of} pass${w.failed.length ? '; failed: ' + w.failed.join(', ') : ''}`);
const out = process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : null;
if (out) { mkdirSync(dirname(out), { recursive: true }); writeFileSync(out, JSON.stringify({ size: SIZE, defaults: CHAIN_DEFAULTS, results, limit, sweep }, null, 1) + '\n'); }
process.exitCode = results.filter((r) => r.label === 'default').every((r) => r.pass) ? 0 : 1;
