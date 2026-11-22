// engine/check/dye.mjs
// C-024's check: from the dyed cloth alone, do its colours follow the dyes' rules (and change when the order does), and
// do its marks (cracks, registration, wicking) read back?
//   node engine/check/dye.mjs [--out runs/c024/check.json]
// The rules are written here, apart from the colour code: madder over iron is black; madder over alum is red with no
// indigo before it and violet after it; with no mordant, madder washes out, and the cloth is white, light blue or blue
// by the number of indigo baths it took while not resisted (0, 1, 2 or more). A wash takes the resist off.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DEFAULTS } from '../core/weave.js';
import { dyed, DYE_DEFAULTS, BLOCKS } from '../core/dye.js';
import { SEQUENCES, DESIGN, MASK_FLAG, C } from './dye-designs.mjs';
import { hueSat, lum } from './readback.mjs';

const SIZE = 336;
const mod = (a, n) => ((a % n) + n) % n;

function predict(steps, flags) {
  let resisted = false, alum = false, iron = false, dips = 0, madder = false;
  for (const s of steps) {
    if (s.op === 'print') { const f = MASK_FLAG.get(s.mask); if (flags[f]) { if (s.layer === 'resist') resisted = true; if (s.layer === 'alum') alum = true; if (s.layer === 'iron') iron = true; } }
    else if (s.op === 'dye' && s.bath === 'indigo') { if (!resisted) dips++; }
    else if (s.op === 'dye' && s.bath === 'madder') madder = true;
    else if (s.op === 'wash') resisted = false;
  }
  if (madder && iron) return 'black';
  if (madder && alum) return dips ? 'violet' : 'red';
  return dips === 0 ? 'white' : dips === 1 ? 'light blue' : 'blue';
}
function family(img, p) {
  const L = lum(img.rgb, p), [h, s] = hueSat(img.rgb, p);
  if (L < 0.2 && s < 0.4) return 'black';
  if (L > 0.6 && s < 0.3) return 'white';
  if (s >= 0.45 && (h < 25 || h > 340)) return 'red';
  if (s >= 0.35 && h >= 255 && h <= 340) return 'violet';
  if (s >= 0.35 && h >= 190 && h < 255) return L > 0.26 ? 'light blue' : 'blue';
  return '?';
}
const flagsAt = (x, y) => Object.fromEntries([...MASK_FLAG.entries()].map(([m, f]) => [f, m(x, y) > 0.5]));
const sameAround = (x, y, r) => { const f0 = JSON.stringify(flagsAt(x, y)); for (const [dx, dy] of [[r, 0], [-r, 0], [0, r], [0, -r], [r, r], [-r, -r], [r, -r], [-r, r]]) if (JSON.stringify(flagsAt(x + dx, y + dy)) !== f0) return false; return true; };

function colourCheck(steps, over) {
  const img = dyed({ ...common, ...over, steps });
  const regions = new Map();
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    if (!sameAround(x + 0.5, y + 0.5, 2.5)) continue;
    const fl = flagsAt(x + 0.5, y + 0.5), key = `${Math.floor(x / C)},${Math.floor(y / C)},${JSON.stringify(fl)}`;
    if (!regions.has(key)) regions.set(key, { want: predict(steps, fl), counts: {} });
    const fam = family(img, y * SIZE + x), r = regions.get(key);
    r.counts[fam] = (r.counts[fam] || 0) + 1;
  }
  let n = 0, ok = 0; const misses = {};
  for (const r of regions.values()) {
    const total = Object.values(r.counts).reduce((a, b) => a + b, 0);
    if (total < 25) continue;
    const got = Object.entries(r.counts).sort((a, b) => b[1] - a[1])[0][0];
    n++; if (got === r.want) ok++; else misses[`${r.want} read as ${got}`] = (misses[`${r.want} read as ${got}`] || 0) + 1;
  }
  return { regions: n, match: +(ok / (n || 1)).toFixed(3), misses, families: [...new Set([...regions.values()].map((r) => r.want))] };
}

function violetHue(steps, over) {
  const img = dyed({ ...common, ...over, steps }), hs = [];
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    if (!sameAround(x + 0.5, y + 0.5, 2.5)) continue;
    if (predict(steps, flagsAt(x + 0.5, y + 0.5)) === 'violet') { const p = y * SIZE + x; hs.push([hueSat(img.rgb, p)[0], hueSat(img.rgb, p)[1], lum(img.rgb, p)]); }
  }
  const med = (k) => +[...hs.map((h) => h[k])].sort((a, b) => a - b)[Math.floor(hs.length / 2)].toFixed(3);
  return { pixels: hs.length, hue: med(0), sat: med(1), lum: med(2) };
}
function overlapFamily(over) {
  const all = () => 1;
  const img = dyed({ ...common, ...over, width: 64, height: 64, steps: [{ op: 'harda' }, { op: 'print', layer: 'alum', mask: all }, { op: 'print', layer: 'iron', mask: all }, { op: 'dye', bath: 'madder' }, { op: 'wash' }] });
  const c = {}; for (let p = 0; p < 64 * 64; p++) { const f = family(img, p); c[f] = (c[f] || 0) + 1; }
  return c;
}
function crackCheck(over, density = 0.6) {
  const steps = (cr) => [{ op: 'print', layer: 'resist', mask: DESIGN.dabuA }, ...(cr ? [{ op: 'crack', density }] : []), { op: 'dye', bath: 'indigo' }, { op: 'dye', bath: 'indigo' }, { op: 'wash' }];
  const share = (img) => { let n = 0, b = 0; for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) { const inside = (r) => DESIGN.dabuA(x + 0.5 + r, y + 0.5) && DESIGN.dabuA(x + 0.5 - r, y + 0.5) && DESIGN.dabuA(x + 0.5, y + 0.5 + r) && DESIGN.dabuA(x + 0.5, y + 0.5 - r); if (!inside(2.5)) continue; n++; const f = family(img, y * SIZE + x); if (f === 'blue' || f === 'light blue') b++; } return b / (n || 1); };
  const on = share(dyed({ ...common, ...over, steps: steps(true) })), off = share(dyed({ ...common, ...over, steps: steps(false) }));
  return { veins: +on.toFixed(3), noCracks: +off.toFixed(4) };
}

function registrationCheck(over, dx) {
  // run 1 printed the fill (12-52) flush against the outline's inside edge (12-52): a planned shift then laid alum over
  // iron on one side, the outline clipped the fill, and centre to centre could not read the shift. Now the fill has
  // 10 px of room inside the outline on every side, more than the planned shift and both blocks' slips together.
  const cell = 64, fill = (x, y) => BLOCKS.rect(18, 18, 46, 46)(mod(x, cell), mod(y, cell)), frame = (x, y) => BLOCKS.frame(4, 4, 60, 60, 4)(mod(x, cell), mod(y, cell));
  const img = dyed({ ...common, ...over, steps: [{ op: 'harda' }, { op: 'print', layer: 'iron', mask: frame, tile: [cell, cell] },
    { op: 'print', layer: 'alum', mask: fill, tile: [cell, cell], offset: [dx, 0] }, { op: 'dye', bath: 'madder' }, { op: 'wash' }] });
  const shifts = [];
  for (let cy = 0; cy + cell <= SIZE; cy += cell) for (let cx = 0; cx + cell <= SIZE; cx += cell) {
    let rx = 0, rn = 0, bx = 0, bn = 0;
    for (let y = cy; y < cy + cell; y++) for (let x = cx; x < cx + cell; x++) { const f = family(img, y * SIZE + x); if (f === 'red') { rx += x; rn++; } if (f === 'black') { bx += x; bn++; } }
    if (rn > 50 && bn > 50) shifts.push(rx / rn - bx / bn);
  }
  return +(shifts.reduce((a, b) => a + b, 0) / shifts.length).toFixed(2);
}

function wickCheck(over) {
  // run 1 sampled the edge along rays from each circle's centre, rounding to the nearest pixel: along a diagonal,
  // neighbouring pixels are 1.4 px apart, so every edge read about 1.4 times wider there, wick or no wick (the control
  // gave 0.73). Now every pixel near a circle counts at its exact distance from the centre, binned every quarter pixel,
  // in sectors 15 degrees either side of the threads' directions or of the diagonals.
  const cell = C, r0 = 16, bin = 0.25, rMin = 6, rMax = 26, nb = Math.round((rMax - rMin) / bin);
  const img = dyed({ ...common, ...over, steps: [{ op: 'print', layer: 'resist', mask: BLOCKS.dots(cell, r0) }, { op: 'dye', bath: 'indigo' }, { op: 'wash' }] });
  const prof = { axis: [new Float64Array(nb), new Float64Array(nb)], diagonal: [new Float64Array(nb), new Float64Array(nb)] };
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    // the mask is drawn at integer coordinates, so a circle's centre is at cell/2 + k*cell exactly
    const u = mod(x, cell) - cell / 2, v = mod(y, cell) - cell / 2, r = Math.hypot(u, v);
    if (r < rMin || r >= rMax) continue;
    const a = ((Math.atan2(v, u) * 180) / Math.PI + 360) % 90, off = Math.min(a, 90 - a); // 0 on the threads, 45 on a diagonal
    const k = Math.floor((r - rMin) / bin), sec = off <= 15 ? 'axis' : off >= 30 ? 'diagonal' : null;
    if (!sec) continue;
    prof[sec][0][k] += lum(img.rgb, y * SIZE + x); prof[sec][1][k]++;
  }
  const measure = ([s, n]) => {
    // every circle sits at the same place on the pixel grid, so some quarter-pixel bins hold no pixel: skip them
    const pts = [...s].map((v, k) => [rMin + (k + 0.5) * bin, v / n[k], n[k]]).filter((q) => q[2] > 0);
    const hi = pts.slice(0, 8).reduce((a, q) => a + q[1], 0) / 8, lo = pts.slice(-8).reduce((a, q) => a + q[1], 0) / 8;
    // the last crossing going outward: the cloth's own texture can cross a level briefly further in
    const at = (f) => { const t = lo + f * (hi - lo); let r = null; for (let k = 0; k < pts.length - 1; k++) if (pts[k][1] >= t && pts[k + 1][1] < t) r = pts[k][0] + (pts[k + 1][0] - pts[k][0]) * (pts[k][1] - t) / (pts[k][1] - pts[k + 1][1]); return r; };
    // the pre-registered measure: the 10-90 width; and, added after run 1 and not counted, how far past the drawn edge
    // the dye reaches before it fades to 5 % of the contrast
    return { width: at(0.1) - at(0.9), reach: r0 - at(0.95) };
  };
  const ax = measure(prof.axis), dg = measure(prof.diagonal);
  return { axis: +ax.width.toFixed(2), diagonal: +dg.width.toFixed(2), ratio: +(ax.width / dg.width).toFixed(3),
    reach: { axis: +ax.reach.toFixed(2), diagonal: +dg.reach.toFixed(2), ratio: +(ax.reach / dg.reach).toFixed(3) } };
}

const common = { ...DEFAULTS, ...DYE_DEFAULTS, width: SIZE, height: SIZE, sett: 3, slub: 0.15, seed: 23 };

function run(label, over = {}) {
  const colours = Object.fromEntries(Object.entries(SEQUENCES).map(([k, steps]) => [k, colourCheck(steps, over)]));
  const cracks = crackCheck(over);
  const reg = { planned3: registrationCheck(over, 3), planned0: registrationCheck(over, 0) };
  const wick = wickCheck(over), noWick = wickCheck({ ...over, wick: 0 });
  const swap = colours['ajrak, indigo first'];
  // added after run 1, reported and not counted: the swap with one indigo bath, not two; the hue of the regions the
  // rules call violet; where alum and iron overlap under madder; how much the cracks cover at other densities
  const ajrak1 = SEQUENCES['ajrak, indigo first'].filter((s, k, a) => !(s.op === 'dye' && s.bath === 'indigo' && a.findIndex((t) => t.op === 'dye' && t.bath === 'indigo') !== k));
  const extra = { swapOneIndigo: colourCheck(ajrak1, over), violetHue: violetHue(SEQUENCES['ajrak, indigo first'], over), violetHueOneIndigo: violetHue(ajrak1, over),
    overlap: overlapFamily(over), crackDensity: Object.fromEntries([0.2, 0.4, 0.8].map((d) => [d, crackCheck(over, d).veins])) };
  const checks = {
    colours: ['ajrak', 'double dabu', 'bagru', 'ajrak, indigo first'].every((k) => colours[k].match >= 0.95) && swap.families.includes('violet') && !swap.families.includes('red'),
    cracks: cracks.veins >= 0.02 && cracks.veins <= 0.2 && cracks.veins >= 5 * cracks.noCracks,
    registration: Math.abs(reg.planned3 - 3) <= 0.5 && Math.abs(reg.planned0) < 0.5,
    wicking: wick.ratio >= 1.2 && Math.abs(noWick.ratio - 1) <= 0.05,
  };
  return { label, colours, cracks, registration: reg, wick, noWick, checks, pass: Object.values(checks).every(Boolean), extra };
}

const results = [run('default'), run('off', { impression: 0, reg: 0, mottle: 0, spread: 0, slub: 0, beat: 0, wobble: 0 })];
for (const f of [2, 3]) results.push(run(`x${f}`, { impression: Math.min(0.9, DYE_DEFAULTS.impression * f), reg: DYE_DEFAULTS.reg * f, mottle: DYE_DEFAULTS.mottle * f, spread: DYE_DEFAULTS.spread * f }));
for (const r of results) {
  console.log(`${r.label}: ` + Object.entries(r.colours).map(([k, c]) => `${k} ${c.match} of ${c.regions}${Object.keys(c.misses).length ? ' (' + Object.entries(c.misses).map(([m, n]) => `${n} ${m}`).join(', ') + ')' : ''}`).join('; '));
  const e = r.extra;
  console.log(`   (not counted) one indigo bath first: ${e.swapOneIndigo.match} of ${e.swapOneIndigo.regions} ${JSON.stringify(e.swapOneIndigo.misses)}; violet regions hue ${e.violetHue.hue} sat ${e.violetHue.sat} lum ${e.violetHue.lum} (one bath: hue ${e.violetHueOneIndigo.hue}); alum+iron under madder ${JSON.stringify(e.overlap)}; crack share at density 0.2/0.4/0.8: ${Object.values(e.crackDensity).join('/')}; wick reach axis/diagonal ${r.wick.reach.ratio} (off ${r.noWick.reach.ratio})`);
  console.log(`   cracks ${r.cracks.veins} (none ${r.cracks.noCracks})  registration 3px->${r.registration.planned3}, 0->${r.registration.planned0}  wicking axis/diagonal ${r.wick.ratio} (${r.wick.axis}/${r.wick.diagonal}px; off ${r.noWick.ratio}: ${r.noWick.axis}/${r.noWick.diagonal}px)  -> ${Object.entries(r.checks).map(([k, v]) => `${k} ${v ? 'ok' : 'NO'}`).join(', ')}`);
}
const out = process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : null;
if (out) { mkdirSync(dirname(out), { recursive: true }); writeFileSync(out, JSON.stringify({ size: SIZE, defaults: common, results }, null, 1) + '\n'); }
process.exitCode = results[0].pass ? 0 : 1;
