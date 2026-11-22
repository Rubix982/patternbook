// engine/check/screens.mjs
// C-031's synthetic screens: four line patterns and two slabs pierced by stars, cut by engine/core/pattern.js with known numbers, drawn as a museum would
// photograph them (light stone on black, a solid frame round the field), for tools/screen_measure.py to read back.
// Also checks the symmetry folds: a point and its images under the group fold to the same place.
//   node engine/check/screens.mjs [--out runs/c031/synthetic]
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { NETWORKS, knownFor, cutScreen, FOLDS, cutHoles, starHole, knownForHoles, petals } from '../core/pattern.js';
import { encodePng } from '../png.js';
import { rng } from '../core/random.js';

const out = process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : 'runs/c031/synthetic';
mkdirSync(out, { recursive: true });

const W = 1100, H = 1400, M = 90, F = 70; // image, margin of black round the screen, frame width
const screen = (x, y) => x >= M && x < W - M && y >= M && y < H - M;
const inside = (x, y) => x >= M + F && x < W - M - F && y >= M + F && y < H - M - F;
const CASES = [
  { name: 'squares', net: NETWORKS.squares(64), bar: 16 },
  { name: 'hexagons', net: NETWORKS.hexagons(72), bar: 14 },
  { name: 'triangles', net: NETWORKS.triangles(96), bar: 12 },
  { name: 'pythagorean', net: NETWORKS.pythagorean(80, 36), bar: 12 },
  { name: 'stars8', holes: ['square', 100, 8, 41, 27] },
  { name: 'stars12', holes: ['hex', 110, 12, 47, 36] },
  { name: 'rosettes', rosette: ['hex', 110, 12, 18, 34, 10] },
];

const known = {};
for (const c of CASES) {
  const opts = { origin: [W / 2 + 7, H / 2 + 3], inside, screen };
  const m = c.holes ? cutHoles(c.holes[0], c.holes[1], starHole(...c.holes.slice(2)), W, H, opts)
    : c.rosette ? cutHoles(c.rosette[0], c.rosette[1], petals(...c.rosette.slice(2)), W, H, opts)
    : cutScreen(c.net, W, H, { bar: c.bar, ...opts });
  const r = rng(11), data = new Uint8ClampedArray(W * H * 4);
  for (let p = 0; p < W * H; p++) {
    const n = (r() - 0.5) * 18, s = m[p];
    data[p * 4] = s ? 214 + n : 12; data[p * 4 + 1] = s ? 190 + n : 12; data[p * 4 + 2] = s ? 160 + n : 14; data[p * 4 + 3] = 255;
  }
  writeFileSync(join(out, `${c.name}.png`), encodePng({ width: W, height: H, data }));
  // the open share inside this screen's own field, where the frame cuts the pattern (the infinite pattern's share is
  // knownFor's openShare)
  let fo = 0, fa = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (inside(x + 0.5, y + 0.5)) { fa++; if (!m[y * W + x]) fo++; }
  // a rosette of n petals round each hub: n-fold about the hub, six-fold as a whole on a hexagonal lattice; a petal
  // (an ellipse) has two corners and is as wide as its minor axis
  const rosetteKnown = c.rosette && { openShare: null, opening: c.rosette[5], perJunction: null, rotation: 6, mirrors: true, points: 2, star: c.rosette[2] };
  known[c.name] = { bar: c.bar ?? null, ...(c.holes ? knownForHoles(c.holes[0], ...c.holes.slice(2)) : c.rosette ? rosetteKnown : knownFor(c.net, c.bar)), openShareField: fo / fa };
}
writeFileSync(join(out, 'known.json'), JSON.stringify(known, null, 1) + '\n');

// the folds: a point and its images under the group's turns (and mirrors) land on the same point
const turn = (x, y, cx, cy, t) => [cx + (x - cx) * Math.cos(t) - (y - cy) * Math.sin(t), cy + (x - cx) * Math.sin(t) + (y - cy) * Math.cos(t)];
const close = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < 1e-6;
const r = rng(5), a = 50, folds = { p4m: 0, p4: 0, p6m: 0, p6: 0, rosette8: 0 }, trials = 2000;
for (let k = 0; k < trials; k++) {
  const x = (r() - 0.5) * 900, y = (r() - 0.5) * 900;
  if (close(FOLDS.p4m(x, y, a), FOLDS.p4m(...turn(x, y, 0, 0, Math.PI / 2), a)) && close(FOLDS.p4m(x, y, a), FOLDS.p4m(-x, y, a)) && close(FOLDS.p4m(x, y, a), FOLDS.p4m(x + a, y - 3 * a, a))) folds.p4m++;
  if (close(FOLDS.p4(x, y, a), FOLDS.p4(...turn(x, y, 0, 0, Math.PI / 2), a)) && close(FOLDS.p4(x, y, a), FOLDS.p4(x - 2 * a, y + a, a))) folds.p4++;
  if (close(FOLDS.p6m(x, y, a), FOLDS.p6m(...turn(x, y, 0, 0, Math.PI / 3), a)) && close(FOLDS.p6m(x, y, a), FOLDS.p6m(-x, y, a)) && close(FOLDS.p6m(x, y, a), FOLDS.p6m(x + a, y, a))) folds.p6m++;
  if (close(FOLDS.p6(x, y, a), FOLDS.p6(...turn(x, y, 0, 0, Math.PI / 3), a)) && close(FOLDS.p6(x, y, a), FOLDS.p6(x + a / 2, y + (a * Math.sqrt(3)) / 2, a))) folds.p6++;
  if (close(FOLDS.rosette(x, y, 8), FOLDS.rosette(...turn(x, y, 0, 0, Math.PI / 4), 8)) && close(FOLDS.rosette(x, y, 8), FOLDS.rosette(x, -y, 8))) folds.rosette8++;
}
console.log('synthetic screens ->', out, JSON.stringify(known));
console.log(`folds: a point and its images agree in ${Object.entries(folds).map(([k, v]) => `${k} ${v}/${trials}`).join(', ')}`);
process.exitCode = Object.values(folds).every((v) => v === trials) ? 0 : 1;
