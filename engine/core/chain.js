// engine/core/chain.js
// Chain stitch along a path: the primitive `chain-stitch` (processes/primitives.md), written in C-022 because no
// Lumenary model lays a line of interlocking loops.
//
// The process. In aari work the cloth is stretched on a frame; a hook is worked from above while the other hand feeds
// the thread from below. The hook goes down through the cloth, catches the thread, and pulls a loop up through the loop
// before, so the face shows a chain of loops, each held by the next, and the back a line of short straight stitches end
// to end. Kashmiri zalakdozi uses chain stitch alone, in concentric rings that fill a shape. Constraints. Each link runs
// from one hole to the next: pinched at its back, where the thread goes into the cloth, open in its middle (the eye),
// rounded at its front, where the next link comes up through it. On a curve each link is a chord of the path. A chain
// can't make a solid line: the eyes always show. Imperfections. Link lengths and widths vary with the hand; the holes
// wander a little off the drawn line; a plied thread shows its twist as diagonal highlights along each strand.
import { cloth, STRUCTURES } from './weave.js';
import { noise1, hash2 } from './random.js';

const hexRgb = (h) => {
  const n = parseInt(String(h).replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

// ---- paths: arrays of [x, y] points, dense enough to measure arc length along them ----
const dense = (f, n) => Array.from({ length: n + 1 }, (_, k) => f(k / n));
export const PATHS = {
  line: (x0, y0, x1, y1) => dense((t) => [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t], 400),
  wave: (x0, y0, x1, amp, waves) => dense((t) => [x0 + (x1 - x0) * t, y0 + amp * Math.sin(2 * Math.PI * waves * t)], 800),
  circle: (cx, cy, r) => dense((t) => [cx + r * Math.cos(2 * Math.PI * t), cy + r * Math.sin(2 * Math.PI * t)], 800),
  ellipse: (cx, cy, rx, ry) => dense((t) => [cx + rx * Math.cos(2 * Math.PI * t), cy + ry * Math.sin(2 * Math.PI * t)], 800),
  spiral: (cx, cy, r0, r1, turns) => dense((t) => { const r = r0 + (r1 - r0) * t, a = 2 * Math.PI * turns * t; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }, 1600),
  // concentric rings filling an ellipse, from the outside in, `gap` pixels apart (zalakdozi's fill). A chain can't
  // follow a curve tighter than its own link (each link is a chord), so rings stop where the ellipse's tightest curve,
  // at the ends of its long axis (radius b*b/a), would be tighter than `minRadius` (pass the link length).
  rings: (cx, cy, rx, ry, gap, minRadius = 0) => {
    const out = [];
    for (let k = 0; rx - k * gap > gap * 0.8 && ry - k * gap > gap * 0.8; k++) {
      const a = Math.max(rx, ry) - k * gap, b = Math.min(rx, ry) - k * gap;
      if ((b * b) / a < minRadius) break;
      out.push(PATHS.ellipse(cx, cy, rx - k * gap, ry - k * gap));
    }
    return out;
  },
};

export function arcLength(path) {
  const s = [0];
  for (let k = 1; k < path.length; k++) s.push(s[k - 1] + Math.hypot(path[k][0] - path[k - 1][0], path[k][1] - path[k - 1][1]));
  return s;
}
function pointAt(path, s, at) {
  let lo = 0, hi = s.length - 1;
  while (lo < hi - 1) { const mid = (lo + hi) >> 1; if (s[mid] <= at) lo = mid; else hi = mid; }
  const f = (at - s[lo]) / ((s[hi] - s[lo]) || 1);
  return [path[lo][0] + (path[hi][0] - path[lo][0]) * f, path[lo][1] + (path[hi][1] - path[lo][1]) * f];
}

// The holes along a path: one every `link` pixels of arc length, varied by the hand, wandering off the line.
export function holes(path, { link, jitter = 0.1, wander = 0.2, seed = 1 }) {
  const s = arcLength(path), L = s[s.length - 1], out = [];
  // a closed path (a ring): even out the stitches so the last one closes it, as an embroiderer does
  if (!(L > 1)) return []; // a path too short to stitch (a level line can close on itself in a point)
  const closed = Math.hypot(path[0][0] - path[path.length - 1][0], path[0][1] - path[path.length - 1][1]) < 0.5;
  if (closed) link = L / Math.max(3, Math.round(L / link));
  link = Math.max(link, 0.5);
  let at = 0, k = 0;
  while (at <= L + 1e-6) {
    const [x, y] = pointAt(path, s, Math.min(at, L));
    const [x2, y2] = pointAt(path, s, Math.min(L, at + 1));
    const [x1, y1] = pointAt(path, s, Math.max(0, at - 1));
    const tx = x2 - x1, ty = y2 - y1, tl = Math.hypot(tx, ty) || 1;
    const off = wander * 1.5 * noise1(k * 0.37, seed + 61);
    out.push([x - (ty / tl) * off, y + (tx / tl) * off]);
    at += link * (1 + jitter * (hash2(k, 0, seed + 67) * 2 - 1));
    k++;
  }
  return out;
}

export const CHAIN_DEFAULTS = { link: 9, loop: 6.5, thread: 2.4, jitter: 0.08, wander: 0.2, swell: 0.08, twist: 0.35, round: 0.55,
  colour: '#d33a2c', side: 'face', kind: 'chain' };

// The loop of one link in its own frame: u along the chord (0 at the back hole, 1 at the next hole), v across, both in
// pixels. Pinched at the back, open in the middle, rounded at the front just past the next hole.
function loopOutline(c, hw) {
  const front = c * 1.14, pts = [];
  for (let k = 0; k <= 28; k++) {
    const a = Math.PI * (k / 28); // 0..pi down one side, then back up the other
    const u = (front / 2) * (1 - Math.cos(a)), g = Math.sin(a) ** 0.85;
    pts.push([u, hw * g]);
  }
  for (let k = 27; k >= 1; k--) pts.push([pts[k][0], -pts[k][1]]);
  return pts;
}
function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l2));
  return [Math.hypot(px - ax - t * dx, py - ay - t * dy), t];
}

// Draw stitches along paths onto an image ({ width, height, rgb, top }).
//   paths        a list of paths (each an array of [x, y])
//   kind         'chain', or 'running' (dashes along the same path: the control in C-022; `dash` sets the share of
//                each link the stitch covers, 0.6 by default)
//   side         'face' or 'back' (a chain's back: straight stitches end to end)
//   link, loop, thread    link length, loop width and thread thickness, in pixels
//   jitter, wander, swell  how much link length, the holes' position and loop width vary
//   twist        the ply's diagonal highlights; round: how strongly the thread's roundness shades it
export function stitch(img, paths, opts = {}) {
  const o = { ...CHAIN_DEFAULTS, ...opts };
  const { width: W, height: H, rgb, top } = img;
  const C = hexRgb(o.colour), seed = o.seed || 1, half = o.thread / 2;
  const put = (x, y, d, along, across) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    let sh = 1 - o.round * 0.5 * (d / half) ** 2;
    sh *= 1 + o.twist * 0.25 * Math.sin(2 * Math.PI * (along / (o.thread * 1.6)) + 2.2 * across);
    const k = (y * W + x) * 3;
    rgb[k] = Math.min(1, C[0] * sh); rgb[k + 1] = Math.min(1, C[1] * sh); rgb[k + 2] = Math.min(1, C[2] * sh);
    top[y * W + x] = 6;
  };
  const tube = (ax, ay, bx, by, w) => { // a straight stitch from (ax, ay) to (bx, by)
    const x0 = Math.floor(Math.min(ax, bx) - w), x1 = Math.ceil(Math.max(ax, bx) + w);
    const y0 = Math.floor(Math.min(ay, by) - w), y1 = Math.ceil(Math.max(ay, by) + w);
    const len = Math.hypot(bx - ax, by - ay);
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const [d, t] = segDist(x + 0.5, y + 0.5, ax, ay, bx, by);
      const taper = w * (0.75 + 0.25 * Math.sin(Math.PI * t));
      if (d < taper) put(x, y, d * (half / taper), t * len, d / taper);
    }
  };
  for (const [pi, path] of paths.entries()) {
    const P = holes(path, { link: o.link, jitter: o.jitter, wander: o.wander, seed: seed + pi * 13 });
    for (let k = 0; k + 1 < P.length; k++) {
      const [ax, ay] = P[k], [bx, by] = P[k + 1];
      if (o.kind === 'running') { // a dash over `dash` of each link (0.6 unless set), a gap over the rest
        const dash = o.dash ?? 0.6;
        tube(ax, ay, ax + (bx - ax) * dash, ay + (by - ay) * dash, half);
        continue;
      }
      if (o.side === 'back') { tube(ax, ay, bx, by, half * 1.05); continue; }
      const c = Math.hypot(bx - ax, by - ay) || 1, dx = (bx - ax) / c, dy = (by - ay) / c;
      const hw = (o.loop / 2) * (1 + o.swell * (hash2(k, pi, seed + 71) * 2 - 1));
      const outline = loopOutline(c, hw).map(([u, v]) => [ax + u * dx - v * dy, ay + u * dy + v * dx]);
      const bx0 = Math.floor(Math.min(...outline.map((p) => p[0])) - half - 1), bx1 = Math.ceil(Math.max(...outline.map((p) => p[0])) + half + 1);
      const by0 = Math.floor(Math.min(...outline.map((p) => p[1])) - half - 1), by1 = Math.ceil(Math.max(...outline.map((p) => p[1])) + half + 1);
      for (let y = by0; y <= by1; y++) for (let x = bx0; x <= bx1; x++) {
        let best = Infinity, along = 0;
        for (let q = 0; q < outline.length; q++) {
          const [a1, a2] = outline[q], [b1, b2] = outline[(q + 1) % outline.length];
          const [d] = segDist(x + 0.5, y + 0.5, a1, a2, b1, b2);
          if (d < best) { best = d; along = q; }
        }
        if (best < half) put(x, y, best, along * (c * 2.2 / outline.length), along < outline.length / 2 ? 0.5 : -0.5);
      }
    }
  }
  return img;
}

// A chain-stitched cloth: a woven ground with stitches along paths.
export function chained(opts) {
  const o = { ...CHAIN_DEFAULTS, ...opts };
  const ground = o.ground || STRUCTURES.plain;
  const unit = o.side === 'back' ? { ends: ground.ends, picks: ground.picks, up: (i, j) => !ground.up(i, j) } : ground;
  const img = cloth({ ...o, unit, seed: o.seed || 1, ground: o.groundColour ?? '#3a3330' });
  return stitch(img, o.paths || [], o);
}
