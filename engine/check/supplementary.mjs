// engine/check/supplementary.mjs
// C-020's check: from the rendered cloth alone, can the figure, its binding, the ground and the kind of supplementary
// weft be read back?
//   node engine/check/supplementary.mjs [--out runs/c020/check.json]
// The ground's warp is near-black and its weft near-white; the extra weft is a saturated gold, so a pixel's hue says
// whether the extra weft is on top. Pixels are assigned to cells (pattern line, warp end) by the nominal spacing and the
// weaving plan a weaver would know: sett, the ground picks per pattern line, the binding interval.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { STRUCTURES, floats, DEFAULTS } from '../core/weave.js';
import { figured, MOTIFS, layout, band, SUPP_DEFAULTS } from '../core/supplementary.js';
import { hueSat, classifyDarkLight, floatModes, signature, modeOf, trackBoundaries, threadProfiles } from './readback.mjs';

const SIZE = 320, SETT = 8;
const mod = (a, n) => ((a % n) + n) % n;
const LAYOUTS = {
  buti: layout(MOTIFS.buti, { across: 15, down: 12 }),
  kalka: layout(MOTIFS.kalka, { across: 17, down: 15 }),
  'vine and buti': (p, j) => band(MOTIFS.vine, { y0: 2 })(p, j) || layout(MOTIFS.buti, { across: 16, down: 13, y0: 10 })(p, j),
};
const isSupp = (img, p) => { const [h, s] = hueSat(img.rgb, p); return s > 0.45 && h > 30 && h < 62; };

function cellFraction(img, test, x0, x1, y0, y1) {
  let n = 0, k = 0;
  for (let y = Math.max(0, Math.floor(y0)); y < Math.min(img.height, Math.ceil(y1)); y++)
    for (let x = Math.max(0, Math.floor(x0)); x < Math.min(img.width, Math.ceil(x1)); x++) { n++; if (test(img, y * img.width + x)) k++; }
  return n ? k / n : 0;
}

function readFigure(img, on, opts) {
  const { ratio, suppScale, gap = 0.12 } = opts;
  const hs = suppScale * SETT * (1 - gap) / 2;
  // count the threads in the image: warp ends across, picks down (the extra weft left out of the profiles)
  const T0 = classifyDarkLight(img, (q) => isSupp(img, q));
  const T = Int8Array.from(T0, (v, q) => (isSupp(img, q) ? -2 : v));
  const { col, row } = threadProfiles(T, SIZE, SIZE);
  const xb = trackBoundaries(col, SETT), yb = trackBoundaries(row, SETT);
  const lines = [];
  for (let p = 0; p * ratio + ratio < yb.length; p++) {
    const yc = yb[p * ratio + ratio];
    if (yc - hs < 0 || yc + hs > SIZE) continue;
    lines.push({ p, yc });
  }
  const cells = [];
  for (const { p, yc } of lines) for (let j = 1; j < xb.length - 1; j++) {
    const w = xb[j + 1] - xb[j];
    const f = cellFraction(img, isSupp, xb[j] + 0.25 * w, xb[j] + 0.75 * w, yc - 0.4 * hs, yc + 0.4 * hs);
    cells.push({ p, j, read: f > 0.5 });
  }
  return { cells, lines, hs, xb, yb };
}

function faceCheck(img, on, opts) {
  const { bind } = opts;
  const stagger = Math.floor(bind / 2) + 1;
  const bound = (p, j) => mod(j + p * stagger, bind) === 0;
  const { cells } = readFigure(img, on, opts);
  let inter = 0, uni = 0;
  for (const c of cells) {
    const want = on(c.p, c.j) && !bound(c.p, c.j);
    if (want && c.read) inter++;
    if (want || c.read) uni++;
  }
  // the longest run of extra weft on the face along a pattern line, in ends
  const byLine = new Map();
  for (const c of cells) { if (!byLine.has(c.p)) byLine.set(c.p, []); byLine.get(c.p)[c.j] = c.read; }
  let longest = 0;
  for (const row of byLine.values()) { let run = 0; for (const v of row) { run = v ? run + 1 : 0; longest = Math.max(longest, run); } }
  return { iou: uni ? +(inter / uni).toFixed(3) : 1, longestFloat: longest };
}

function groundCheck(img, on, opts, ground) {
  const { ratio } = opts;
  // leave out the extra weft and everything within two ends and one pattern line of a figure
  const skip = (q) => {
    if (isSupp(img, q)) return true;
    const x = q % SIZE, y = Math.floor(q / SIZE), j = Math.floor(x / SETT), pn = Math.round(y / SETT / ratio) - 1;
    for (let dp = -1; dp <= 1; dp++) for (let dj = -2; dj <= 2; dj++) if (pn + dp >= 0 && on(pn + dp, j + dj)) return true;
    return false;
  };
  const T = classifyDarkLight(img, skip);
  const want = floats(ground), got = floatModes(T, SIZE, SIZE, SETT, SETT);
  const sg = signature(T, SIZE, SIZE, ground, SETT, SETT);
  const floatsOk = got.warp === modeOf(want.warp) && got.weft === modeOf(want.weft);
  return { floats: { want: { warp: modeOf(want.warp), weft: modeOf(want.weft) }, got: { warp: got.warp, weft: got.weft } }, floatsOk, signature: sg.score, pass: floatsOk && sg.score >= 0.95 };
}

function backKind(img, on, opts) {
  const { cells } = readFigure(img, on, opts);
  let far = 0, farN = 0, near = 0, nearN = 0;
  for (const c of cells) {
    let d = Infinity;
    for (let k = 0; k <= 3; k++) if (on(c.p, c.j - k) || on(c.p, c.j + k)) { d = k; break; }
    if (d === Infinity) { farN++; if (c.read) far++; }
    else if (d >= 1 && d <= 2) { nearN++; if (c.read) near++; }
  }
  const farF = farN ? far / farN : 0, nearF = nearN ? near / nearN : 0;
  const kind = farF > 0.4 ? 'continuous' : nearF > 0.3 ? 'cutwork' : 'discontinuous';
  return { far: +farF.toFixed(3), near: +nearF.toFixed(3), kind };
}

function run(imp, label) {
  const rows = [];
  for (const [name, on] of Object.entries(LAYOUTS)) for (const kind of ['discontinuous', 'continuous', 'cutwork']) {
    const opts = { ...SUPP_DEFAULTS, ...imp, kind, on, ground: STRUCTURES.plain, width: SIZE, height: SIZE, sett: SETT,
      warp: ['#1a1a1a'], weft: ['#f2f2f2'], groundColour: '#808080', supp: '#d9a514', seed: 17 };
    const faceImg = figured({ ...opts, side: 'face' }), backImg = figured({ ...opts, side: 'back' });
    const face = faceCheck(faceImg, on, opts), ground = groundCheck(faceImg, on, opts, STRUCTURES.plain), back = backKind(backImg, on, opts);
    const pass = face.iou >= 0.9 && face.longestFloat <= opts.bind - 1 && ground.pass && back.kind === kind;
    rows.push({ imperfections: label, motif: name, kind, face, ground, back, pass });
  }
  return rows;
}

const results = run(DEFAULTS, 'default');

// Can the face read-back fail? Each figure's face, read against the other figures' expectations.
const confusion = [];
for (const [a, onA] of Object.entries(LAYOUTS)) for (const [b, onB] of Object.entries(LAYOUTS)) {
  if (a === b) continue;
  const opts = { ...SUPP_DEFAULTS, ...DEFAULTS, kind: 'discontinuous', on: onA, ground: STRUCTURES.plain, width: SIZE, height: SIZE, sett: SETT,
    warp: ['#1a1a1a'], weft: ['#f2f2f2'], supp: '#d9a514', seed: 17 };
  const f = faceCheck(figured({ ...opts, side: 'face' }), onB, { ...opts, on: onB });
  confusion.push({ rendered: a, expected: b, iou: f.iou, pass: f.iou >= 0.9 });
}
const off = run({ slub: 0, beat: 0, wobble: 0, fibre: 0, wander: 0, turn: 0 }, 'off');
const sweep = [];
for (const f of [1.5, 2, 3]) {
  const imp = { ...DEFAULTS, slub: DEFAULTS.slub * f, beat: DEFAULTS.beat * f, wobble: DEFAULTS.wobble * f, fibre: DEFAULTS.fibre * f,
    wander: Math.min(1, SUPP_DEFAULTS.wander * f), turn: Math.min(1, SUPP_DEFAULTS.turn * f) };
  const rs = run(imp, `x${f}`);
  sweep.push({ factor: f, passed: rs.filter((r) => r.pass).length, of: rs.length, failed: rs.filter((r) => !r.pass).map((r) => `${r.motif}/${r.kind}`) });
}

console.log('motif            kind           face IoU  longest float  ground (floats, sig)  back far/near -> kind      pass');
for (const r of [...off, ...results])
  console.log(`${(r.imperfections + ' ' + r.motif).padEnd(24).slice(0, 24)} ${r.kind.padEnd(14)} ${String(r.face.iou).padEnd(9)} ${String(r.face.longestFloat).padEnd(14)} ${`${r.ground.floats.got.warp}/${r.ground.floats.got.weft}, ${r.ground.signature}`.padEnd(21)} ${`${r.back.far}/${r.back.near} -> ${r.back.kind}`.padEnd(26)} ${r.pass ? 'yes' : 'NO'}`);
console.log(`\nconfusion: ${confusion.length} wrong figure pairs, ${confusion.filter((c) => c.pass).length} passed by mistake (IoU ${confusion.map((c) => c.iou).join(', ')})`);
console.log('\nimperfections scaled (ground and extra weft together):');
for (const w of sweep) console.log(`  x${w.factor}: ${w.passed}/${w.of} pass${w.failed.length ? '; failed: ' + w.failed.join(', ') : ''}`);
const out = process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : null;
if (out) { mkdirSync(dirname(out), { recursive: true }); writeFileSync(out, JSON.stringify({ size: SIZE, sett: SETT, defaults: { ...DEFAULTS, ...SUPP_DEFAULTS }, off, results, confusion, sweep }, null, 1) + '\n'); }
process.exitCode = results.every((r) => r.pass) && off.every((r) => r.pass) && !confusion.some((c) => c.pass) ? 0 : 1;
