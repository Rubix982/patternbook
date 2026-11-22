// engine/check/weave.mjs
// C-019's check: can each structure be read back from the rendered cloth alone?
//   node engine/check/weave.mjs [--out runs/c019/check.json]
// The read-back sees only the image and the nominal thread spacing a weaver would know (ends and picks per unit).
// From the image it measures (1) the most common float length along the warp and along the weft, and (2) how the
// pattern correlates with itself when shifted by whole threads, which is what tells plain from twill from satin.
// Both are compared with what the structure's own drawdown predicts. Warp is near-black, weft near-white and the
// gaps mid-grey, so a pixel's brightness says which thread is on top.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { STRUCTURES, fromDraft, drawdown, floats, cloth, DEFAULTS, OFF } from '../core/weave.js';

const SIZE = 320, SETT = 8;
const mod = (a, n) => ((a % n) + n) % n;
const modeOf = (xs) => {
  const c = new Map();
  for (const x of xs) c.set(x, (c.get(x) || 0) + 1);
  return [...c.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0]?.[0] ?? null;
};

// 1 = warp on top (dark), 0 = weft on top (light), -1 = can't tell (gap, or a thread darkened where it turns)
function classify(img) {
  const T = new Int8Array(img.width * img.height);
  for (let p = 0; p < T.length; p++) {
    const L = 0.2126 * img.rgb[p * 3] + 0.7152 * img.rgb[p * 3 + 1] + 0.0722 * img.rgb[p * 3 + 2];
    T[p] = L < 0.3 ? 1 : L > 0.55 ? 0 : -1;
  }
  return T;
}

function floatModes(T, w, h, sett, pickSett) {
  const warpRuns = [], weftRuns = [];
  for (let x = 0; x < w; x++) { // warp floats run down a column
    let y = 0;
    while (y < h) {
      if (T[y * w + x] !== 1) { y++; continue; }
      const y0 = y;
      while (y < h && T[y * w + x] === 1) y++;
      if (y0 > 0 && y < h && y - y0 >= 0.5 * pickSett) warpRuns.push(Math.round((y - y0) / pickSett));
    }
  }
  for (let y = 0; y < h; y++) { // weft floats run along a row
    let x = 0;
    while (x < w) {
      if (T[y * w + x] !== 0) { x++; continue; }
      const x0 = x;
      while (x < w && T[y * w + x] === 0) x++;
      if (x0 > 0 && x < w && x - x0 >= 0.5 * sett) weftRuns.push(Math.round((x - x0) / sett));
    }
  }
  return { warp: modeOf(warpRuns), weft: modeOf(weftRuns) };
}

function pearson(pairs) {
  let n = 0, sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0;
  for (const [a, b] of pairs) { n++; sx += a; sy += b; sxx += a * a; syy += b * b; sxy += a * b; }
  const vx = sxx / n - (sx / n) ** 2, vy = syy / n - (sy / n) ** 2;
  if (n < 10 || vx < 1e-9 || vy < 1e-9) return null;
  return (sxy / n - (sx / n) * (sy / n)) / Math.sqrt(vx * vy);
}

function imageR(T, w, h, k, l, sett, pickSett) {
  const dx = Math.round(k * sett), dy = Math.round(l * pickSett);
  const pairs = [];
  for (let y = Math.max(0, -dy); y < Math.min(h, h - dy); y += 1)
    for (let x = Math.max(0, -dx); x < Math.min(w, w - dx); x += 1) {
      const a = T[y * w + x], b = T[(y + dy) * w + (x + dx)];
      if (a >= 0 && b >= 0) pairs.push([a, b]);
    }
  return pearson(pairs);
}

function unitR(unit, k, l) {
  const pairs = [];
  for (let i = 0; i < unit.picks * 4; i++)
    for (let j = 0; j < unit.ends * 4; j++)
      pairs.push([unit.up(mod(i, unit.picks), mod(j, unit.ends)) ? 1 : 0, unit.up(mod(i + l, unit.picks), mod(j + k, unit.ends)) ? 1 : 0]);
  return pearson(pairs);
}

function check(name, unit, imperfections, expect = unit) {
  const img = cloth({ unit, width: SIZE, height: SIZE, sett: SETT, warp: ['#111111'], weft: ['#f2f2f2'], ground: '#808080', seed: 7, ...imperfections });
  const T = classify(img);
  const want = floats(expect);
  const got = floatModes(T, SIZE, SIZE, SETT, SETT);
  const wantMode = { warp: modeOf(want.warp), weft: modeOf(want.weft) };
  let strong = 0, agree = 0;
  const offsets = [];
  // Both directions: an offset strong in the expected structure must show in the image, and an offset strong in the
  // image must be predicted by the expected structure. (One direction alone let twill 2/2 pass as basket 2/2, whose
  // strong offsets are a subset of twill's.)
  for (let k = -4; k <= 4; k++) for (let l = -4; l <= 4; l++) {
    if (!k && !l) continue;
    const ru = unitR(expect, k, l);
    const ri = imageR(T, SIZE, SIZE, k, l, SETT, SETT);
    const strongU = ru !== null && Math.abs(ru) >= 0.5, strongI = ri !== null && Math.abs(ri) >= 0.5;
    if (!strongU && !strongI) continue;
    strong++;
    const ok = ru !== null && ri !== null && Math.sign(ri) === Math.sign(ru) && Math.abs(ri) >= 0.15 && Math.abs(ru) >= 0.2;
    if (ok) agree++;
    offsets.push({ k, l, unit: ru === null ? null : +ru.toFixed(2), image: ri === null ? null : +ri.toFixed(2), ok });
  }
  const floatsOk = got.warp === wantMode.warp && got.weft === wantMode.weft;
  const signature = strong ? agree / strong : 1;
  return { name, floats: { want: wantMode, got }, floatsOk, signature: +signature.toFixed(3), strongOffsets: strong,
           pass: floatsOk && signature >= 0.95, offsets };
}

// 1. A four-part draft gives the same drawdown as the named structure: a straight draw on four shafts, a 2/2 twill
// tie-up, treadles pressed in order.
const draftTwill = fromDraft({
  threading: [0, 1, 2, 3],
  tieup: [[1, 0, 0, 1], [1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 1, 1]],
  treadling: [0, 1, 2, 3],
});
const a = JSON.stringify(drawdown(draftTwill)), b = JSON.stringify(drawdown(STRUCTURES['twill-2-2']));
const draftOk = a === b;

// 2. Each structure, read back with the imperfections off and at their defaults.
const names = ['plain', 'twill-2-2', 'twill-3-1', 'twill-1-3', 'basket-2-2', 'satin-5', 'sateen-5'];
const results = [];
for (const n of names) {
  for (const [label, imp] of [['off', OFF], ['default', DEFAULTS]]) results.push({ imperfections: label, ...check(n, STRUCTURES[n], imp) });
}

// 3. Can the read-back fail? Each structure read against every other structure's expectations: only the true pair
// should pass.
const confusion = [];
for (const rendered of names) for (const expected of names) {
  if (rendered === expected) continue;
  const r = check(rendered, STRUCTURES[rendered], DEFAULTS, STRUCTURES[expected]);
  confusion.push({ rendered, expected, pass: r.pass });
}
const falsePasses = confusion.filter((c) => c.pass);

// 4. Where do the imperfections start to hide the structure? All of them scaled together.
const sweep = [];
for (const f of [1, 1.5, 2, 3, 4]) {
  const imp = { ...DEFAULTS, slub: Math.min(1, DEFAULTS.slub * f), beat: Math.min(1, DEFAULTS.beat * f), wobble: Math.min(1, DEFAULTS.wobble * f), fibre: Math.min(1, DEFAULTS.fibre * f) };
  const rs = names.map((n) => check(n, STRUCTURES[n], imp));
  sweep.push({ factor: f, slub: imp.slub, beat: imp.beat, wobble: imp.wobble, passed: rs.filter((r) => r.pass).length, of: rs.length,
               failed: rs.filter((r) => !r.pass).map((r) => `${r.name} (${r.floats.got.warp}/${r.floats.got.weft}, ${r.signature})`) });
}

console.log(`draft -> drawdown (straight draw, 2/2 twill tie-up): ${draftOk ? 'matches' : 'DIFFERS'}${draftOk ? '' : `\n  draft: ${a}\n  named: ${b}`}`);
console.log('structure      imperfections  floats want (warp/weft)  read back  signature  pass');
for (const r of results)
  console.log(`${r.name.padEnd(14)} ${r.imperfections.padEnd(14)} ${`${r.floats.want.warp}/${r.floats.want.weft}`.padEnd(24)} ${`${r.floats.got.warp}/${r.floats.got.weft}`.padEnd(10)} ${String(r.signature).padEnd(10)} ${r.pass ? 'yes' : 'NO'}`);
console.log(`\nconfusion: ${confusion.length} wrong pairs tried, ${falsePasses.length} passed by mistake${falsePasses.length ? ': ' + falsePasses.map((c) => `${c.rendered} read as ${c.expected}`).join(', ') : ''}`);
console.log('\nimperfections scaled (slub/beat/wobble/fibre together):');
for (const w of sweep) console.log(`  x${w.factor}: slub ${w.slub.toFixed(2)} beat ${w.beat.toFixed(2)} wobble ${w.wobble.toFixed(2)} -> ${w.passed}/${w.of} pass${w.failed.length ? '; failed: ' + w.failed.join(', ') : ''}`);
const out = process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : null;
if (out) {
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify({ size: SIZE, sett: SETT, defaults: DEFAULTS, off: OFF, draftOk, results, confusion, sweep }, null, 1) + '\n');
}
process.exitCode = draftOk && results.every((r) => r.pass) && !falsePasses.length ? 0 : 1;
