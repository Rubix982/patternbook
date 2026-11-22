// engine/core/weave.js
// Weave structure from a draft, and cloth rendered from it. The primitive `weave-draft` (processes/primitives.md),
// written in C-019 because no Lumenary model takes a draft: which warp end is over the weft at each crossing.
//
// The process. A loom holds the warp ends under tension. Each end is threaded through one shaft (the threading); each
// treadle lifts a set of shafts (the tie-up); for each pick the weaver presses a treadle (the treadling), the lifted
// ends rise, and the weft passes under them and over the rest. So the drawdown, which end is up at each crossing, is
//
//     up(pick i, end j) = tieup[ threading[j] ][ treadling[i] ]
//
// Constraints. A thread can only be over or under at a crossing, so every look comes from where the two colours of
// thread show (floats) and how long they run. A float can't be longer than the structure allows without the cloth
// losing hold. Imperfections. Hand-spun yarn varies in thickness (slubs); the beater packs picks unevenly; tension
// makes threads wander; threads don't fill their space, so small gaps show between them; a thread curves under at
// each end of a float, so it darkens there. Each is a seeded term with its own dial.
import { rng, noise1, noise2, hash2 } from './random.js';

const mod = (a, n) => ((a % n) + n) % n;

// Named structures as repeat units. up(i, j) is true when warp end j is over weft pick i.
export const STRUCTURES = {
  plain: { ends: 2, picks: 2, up: (i, j) => mod(i + j, 2) === 0 },
  'twill-2-2': { ends: 4, picks: 4, up: (i, j) => mod(j - i, 4) < 2 },
  'twill-3-1': { ends: 4, picks: 4, up: (i, j) => mod(j - i, 4) < 3 },
  'twill-1-3': { ends: 4, picks: 4, up: (i, j) => mod(j - i, 4) < 1 },
  'basket-2-2': { ends: 4, picks: 4, up: (i, j) => mod(Math.floor(i / 2) + Math.floor(j / 2), 2) === 0 },
  // five-end satin, move 2: each end is under the weft once in five picks (warp floats of four)
  'satin-5': { ends: 5, picks: 5, up: (i, j) => mod(2 * j - i, 5) !== 0 },
  // its weft-faced reverse (sateen): weft floats of four
  'sateen-5': { ends: 5, picks: 5, up: (i, j) => mod(2 * j - i, 5) === 0 },
};

// A repeat unit from a four-part draft. threading: shaft per end; tieup[shaft][treadle]: 1 when that treadle lifts
// that shaft; treadling: treadle per pick (or a list of treadles pressed together).
export function fromDraft({ threading, tieup, treadling }) {
  const lifted = (i, j) => {
    const t = treadling[mod(i, treadling.length)];
    const s = threading[mod(j, threading.length)];
    return (Array.isArray(t) ? t : [t]).some((k) => !!(tieup[s] && tieup[s][k]));
  };
  return { ends: threading.length, picks: treadling.length, up: lifted };
}

// The drawdown of a unit as rows of 0 and 1 (1 = warp over), for display and checks.
export function drawdown(unit) {
  return Array.from({ length: unit.picks }, (_, i) => Array.from({ length: unit.ends }, (_, j) => (unit.up(i, j) ? 1 : 0)));
}

// Float lengths in a unit, counted cyclically: how many picks a warp end stays over (warp floats) and how many ends a
// pick stays over (weft floats).
export function floats(unit) {
  const runs = (n, get) => {
    const v = Array.from({ length: n }, (_, k) => get(k));
    if (v.every((x) => x === v[0])) return v[0] ? [n] : [];
    const start = v.findIndex((x, k) => x && !v[mod(k - 1, n)]);
    const out = [];
    let len = 0;
    for (let k = 0; k < n; k++) {
      const x = v[mod(start + k, n)];
      if (x) len++;
      else if (len) { out.push(len); len = 0; }
    }
    if (len) out.push(len);
    return out;
  };
  const warp = [], weft = [];
  for (let j = 0; j < unit.ends; j++) warp.push(...runs(unit.picks, (i) => unit.up(i, j)));
  for (let i = 0; i < unit.picks; i++) weft.push(...runs(unit.ends, (j) => !unit.up(i, j)));
  return { warp, weft };
}

const hexRgb = (h) => {
  const n = parseInt(String(h).replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

// Thread boundaries along one direction: cumulative widths, each varied by the yarn's thickness and the beat.
function boundaries(count, size, vary, seed, freq) {
  const r = rng(seed);
  const b = [0];
  for (let k = 0; k < count; k++) {
    const w = size * (1 + vary * (0.45 * (r() - 0.5) + 0.35 * noise1(k * freq, seed + 7)));
    b.push(b[k] + Math.max(0.45 * size, w));
  }
  return b;
}

function find(b, x) {
  let lo = 0, hi = b.length - 2;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (b[mid] <= x) lo = mid; else hi = mid - 1;
  }
  return lo;
}

// Cloth rendered from a unit.
//   sett, pickSett  nominal pixels per warp end and per weft pick
//   warp, weft      colour sequences (hex), repeated across the ends and down the picks: stripes and checks
//   ground          what shows through the gaps between threads
//   slub            yarn thickness variation (0 to 1)
//   beat            unevenness of pick spacing (0 to 1)
//   wobble          how far threads wander from straight (0 to 1)
//   gap             share of a thread's space left open between threads (0 to 0.4)
//   round           how strongly a thread's roundness shades across it (0 to 1)
//   dip             how much a thread darkens where it curves under at a float's end (0 to 1)
//   fibre           fine along-thread variation in tone (0 to 1)
// Returns { width, height, rgb (Float32Array, 0 to 1), top (Uint8Array: 1 warp, 0 weft, 2 gap) }, and the thread
// geometry (xb, yb, disp, half) so a layer drawn over the cloth (a supplementary weft) lies on the same threads.
export function cloth(opts) {
  const {
    unit, width = 320, height = 320, sett = 8, pickSett = sett,
    warp = ['#1d2a4a'], weft = ['#e9e1cf'], ground = '#3a3330', seed = 1,
    slub = 0.25, beat = 0.2, wobble = 0.25, gap = 0.12, round = 0.55, dip = 0.35, fibre = 0.25,
  } = opts;
  const W = warp.map(hexRgb), F = weft.map(hexRgb), G = hexRgb(ground);
  const nEnds = Math.ceil(width / (sett * 0.45)) + 4, nPicks = Math.ceil(height / (pickSett * 0.45)) + 4;
  const xb = boundaries(nEnds, sett, slub, seed * 31 + 1, 0.17);
  const yb = boundaries(nPicks, pickSett, beat, seed * 31 + 2, 0.11);
  const endTone = Array.from({ length: nEnds }, (_, j) => 1 + 0.08 * slub * (hash2(j, 1, seed) * 2 - 1));
  const pickTone = Array.from({ length: nPicks }, (_, i) => 1 + 0.08 * slub * (hash2(i, 2, seed) * 2 - 1));
  const rgb = new Float32Array(width * height * 3), top = new Uint8Array(width * height);
  const half = (1 - gap) / 2;
  const up = (i, j) => unit.up(mod(i, unit.picks), mod(j, unit.ends));
  const amp = wobble * 0.22;
  // where a pixel sits on the threads, after the threads' wander: shared with layers drawn over the cloth
  const disp = (x, y) => [x + amp * sett * noise2(x / (sett * 9), y / (sett * 9), seed + 11),
    y + amp * pickSett * noise2(x / (pickSett * 9) + 50, y / (pickSett * 9), seed + 13)];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [xs, ys] = disp(x, y);
      const j = find(xb, Math.max(0, xs)), i = find(yb, Math.max(0, ys));
      const s = (xs - xb[j]) / (xb[j + 1] - xb[j]) - 0.5, t = (ys - yb[i]) / (yb[i + 1] - yb[i]) - 0.5;
      const warpHere = Math.abs(s) < half, weftHere = Math.abs(t) < half;
      const u = up(i, j);
      let who; // 1 warp, 0 weft, 2 gap
      if (u) who = warpHere ? 1 : weftHere ? 0 : 2;
      else who = weftHere ? 0 : warpHere ? 1 : 2;
      let c, shade = 1;
      if (who === 1) {
        c = W[mod(j, W.length)];
        shade = 1 - round * 0.5 * (s / half) ** 2;
        if (u) {
          if (!up(i - 1, j)) shade *= 1 - dip * Math.max(0, 1 - (t + 0.5) / 0.35) ** 2;
          if (!up(i + 1, j)) shade *= 1 - dip * Math.max(0, 1 - (0.5 - t) / 0.35) ** 2;
        } else shade *= 0.72; // a warp end seen in the gap beside the weft that covers it
        shade *= endTone[j] * (1 + 0.07 * fibre * noise1(ys / (pickSett * 0.6), j * 7 + seed));
      } else if (who === 0) {
        c = F[mod(i, F.length)];
        shade = 1 - round * 0.5 * (t / half) ** 2;
        if (!u) {
          if (up(i, j - 1)) shade *= 1 - dip * Math.max(0, 1 - (s + 0.5) / 0.35) ** 2;
          if (up(i, j + 1)) shade *= 1 - dip * Math.max(0, 1 - (0.5 - s) / 0.35) ** 2;
        } else shade *= 0.72;
        shade *= pickTone[i] * (1 + 0.07 * fibre * noise1(xs / (sett * 0.6), i * 7 + seed + 3));
      } else { c = G; }
      const k = (y * width + x) * 3;
      rgb[k] = Math.min(1, c[0] * shade); rgb[k + 1] = Math.min(1, c[1] * shade); rgb[k + 2] = Math.min(1, c[2] * shade);
      top[y * width + x] = who;
    }
  }
  // xb, yb: thread boundaries (pixels, before wander); disp: the wander; half: a thread's half-width as a share
  return { width, height, rgb, top, xb, yb, disp, half, sett, pickSett };
}

// Paint a rendered cloth into a canvas 2D context (browser only).
export function paint(ctx, img) {
  const out = ctx.createImageData(img.width, img.height);
  for (let p = 0; p < img.width * img.height; p++) {
    out.data[p * 4] = Math.round(img.rgb[p * 3] * 255);
    out.data[p * 4 + 1] = Math.round(img.rgb[p * 3 + 1] * 255);
    out.data[p * 4 + 2] = Math.round(img.rgb[p * 3 + 2] * 255);
    out.data[p * 4 + 3] = 255;
  }
  ctx.putImageData(out, 0, 0);
}

export const DEFAULTS = { sett: 8, slub: 0.25, beat: 0.2, wobble: 0.25, gap: 0.12, round: 0.55, dip: 0.35, fibre: 0.25 };
export const OFF = { slub: 0, beat: 0, wobble: 0, gap: 0.12, round: 0.55, dip: 0.35, fibre: 0 };
