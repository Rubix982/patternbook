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
import { modeOf, classifyDarkLight as classify, floatModes, signature as sig } from './readback.mjs';

const SIZE = 320, SETT = 8;

function check(name, unit, imperfections, expect = unit) {
  const img = cloth({ unit, width: SIZE, height: SIZE, sett: SETT, warp: ['#111111'], weft: ['#f2f2f2'], ground: '#808080', seed: 7, ...imperfections });
  const T = classify(img);
  const want = floats(expect);
  const got = floatModes(T, SIZE, SIZE, SETT, SETT);
  const wantMode = { warp: modeOf(want.warp), weft: modeOf(want.weft) };
  const sg = sig(T, SIZE, SIZE, expect, SETT, SETT);
  const signature = sg.score, strong = sg.strong, offsets = sg.offsets;
  const floatsOk = got.warp === wantMode.warp && got.weft === wantMode.weft;
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
