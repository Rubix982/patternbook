// engine/core/kantha.js
// Kantha: running stitch in rows that follow a motif's contour, rows across the background, and the ripple the
// quilting puts into layered cloth. The primitives `contour-rows` and `quilt-ripple` (processes/primitives.md), written
// in C-023.
//
// The process. Two to seven layers of old cloth (saris, lungis, dhotis) are laid together and held by running stitch,
// often in thread pulled from the saris' own borders. The same stitch outlines a motif and fills it, row after row
// echoing its edge inward; around the motifs, rows of quilting cover the ground, often in its own colour. Constraints.
// A running stitch shows a dash and hides a gap, so a row is always broken; rows can only be as close as the needle
// allows. Imperfections. The thread pulls the layers in along every row, so the cloth puffs up between rows into a
// ripple, unevenly, because the hand pulls unevenly; stitch lengths vary.
import { cloth, STRUCTURES } from './weave.js';
import { stitch } from './chain.js';
import { signedDistance, distanceTo, levelLines } from './field.js';
import { noise2 } from './random.js';

// ---- motifs: functions (x, y) -> inside? ----
const rot = (x, y, a) => [x * Math.cos(a) + y * Math.sin(a), -x * Math.sin(a) + y * Math.cos(a)];
export const SHAPES = {
  circle: (cx, cy, r) => (x, y) => (x - cx) ** 2 + (y - cy) ** 2 < r * r,
  // a paisley: a round head and a tail that tapers and curls
  paisley: (cx, cy, r, angle = 0) => (x, y) => {
    const [u, v] = rot(x - cx, y - cy, angle);
    if (u * u + v * v < r * r) return true;
    if (u < 0 || u > 2.2 * r) return false;
    const t = u / (2.2 * r), mid = -0.55 * r * t * t, w = r * (1 - t) ** 1.2;
    return Math.abs(v - mid) < w;
  },
  // a lotus: petals around a centre, each an ellipse
  lotus: (cx, cy, r, petals = 8) => (x, y) => {
    if ((x - cx) ** 2 + (y - cy) ** 2 < (0.28 * r) ** 2) return true;
    for (let k = 0; k < petals; k++) {
      const a = (2 * Math.PI * k) / petals, px = cx + 0.55 * r * Math.cos(a), py = cy + 0.55 * r * Math.sin(a);
      const [u, v] = rot(x - px, y - py, a);
      if ((u / (0.47 * r)) ** 2 + (v / (0.2 * r)) ** 2 < 1) return true;
    }
    return false;
  },
};

export const KANTHA_DEFAULTS = { rowGap: 7, stitchLen: 5, space: 3, thread: 1.6, ripple: 0.6, wrinkle: 0.3, lightAngle: 315,
  margin: 4, background: 'rows', groundThread: '#e6dcc6', rows: 'contour' };

// Rows inside a motif: its signed distance's level lines, one every `gap` pixels inward from its edge.
export function contourRows(inside, W, H, gap) {
  const sd = signedDistance(inside, W, H);
  let max = 0; for (const v of sd) if (v > max) max = v;
  const rows = [];
  for (let d = gap / 2; d < max - gap * 0.25; d += gap) rows.push(...levelLines(sd, W, H, d));
  return { rows, sd };
}

// Straight rows (horizontal) inside a region, split where they leave it.
export function straightRows(inside, W, H, gap, y0 = gap / 2) {
  const rows = [];
  for (let y = y0; y < H; y += gap) {
    let cur = null;
    for (let x = 0; x <= W; x += 0.5) {
      const ok = x < W && inside(x, y);
      if (ok) { if (!cur) cur = []; cur.push([x, y]); } else if (cur) { if (cur.length > 4) rows.push(cur); cur = null; }
    }
  }
  return rows;
}

// The cloth. Options are those of weave.cloth (unit replaced by `ground`), plus:
//   motifs       [{ inside: (x, y) -> bool, colour }]
//   rows         'contour' (rows echo each motif's edge inward) or 'straight' (horizontal rows inside it: the control)
//   background   'rows' (horizontal quilting rows around the motifs) or 'none'
//   rowGap       pixels between rows; stitchLen, space: the dash and the gap of a running stitch; thread: its thickness
//   groundThread the background rows' colour (often the ground's own)
//   ripple       how far the cloth puffs up between rows; wrinkle: how unevenly; lightAngle: where the light comes from
//   margin       how far background rows stop short of a motif
export function kantha(opts) {
  const o = { ...KANTHA_DEFAULTS, ...opts };
  const W = o.width, H = o.height, seed = o.seed || 1;
  const img = cloth({ ...o, unit: o.ground || STRUCTURES.plain, seed, gap: o.threadGap ?? 0.12, ground: o.groundColour ?? '#3a3330' });
  const motifs = o.motifs || [];
  const inAny = (x, y) => motifs.some((m) => m.inside(x, y));
  const groups = [];
  for (const m of motifs) groups.push({ colour: m.colour || '#1f3a7a', rows: o.rows === 'straight' ? straightRows(m.inside, W, H, o.rowGap) : contourRows(m.inside, W, H, o.rowGap).rows });
  if (o.background === 'rows') {
    const sdAll = signedDistance(inAny, W, H);
    groups.push({ colour: o.groundThread, rows: straightRows((x, y) => { const xi = Math.min(W - 1, Math.floor(x)), yi = Math.min(H - 1, Math.floor(y)); return sdAll[yi * W + xi] < -o.margin; }, W, H, o.rowGap) });
  }
  return { ...quilt(img, groups, o), groups };
}

// Quilt a cloth: ripple it between the rows of every group ({ colour, rows }) and stitch the rows in running stitch.
// Shared by `kantha` and the picture style (styles/kantha.js).
export function quilt(img, groups, opts) {
  const o = { ...KANTHA_DEFAULTS, ...opts };
  const W = img.width, H = img.height, seed = o.seed || 1;
  // the ripple: the cloth is pulled down along every row and puffs up between rows
  if (o.ripple > 0) {
    const lines = new Uint8Array(W * H);
    for (const g of groups) for (const row of g.rows) for (const [x, y] of row) {
      const xi = Math.floor(x), yi = Math.floor(y);
      if (xi >= 0 && yi >= 0 && xi < W && yi < H) lines[yi * W + xi] = 1;
    }
    const d = distanceTo(lines, W, H);
    const h = new Float64Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const p = y * W + x, t = Math.min(1, d[p] / (o.rowGap / 2));
      h[p] = o.ripple * Math.sin((Math.PI / 2) * t) * (1 + o.wrinkle * noise2(x / 23, y / 23, seed + 81));
    }
    const la = (o.lightAngle * Math.PI) / 180, lx = Math.cos(la), ly = Math.sin(la);
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
      const p = y * W + x;
      const gx = (h[p + 1] - h[p - 1]) / 2, gy = (h[p + W] - h[p - W]) / 2;
      const sh = Math.max(0.5, 1 + 0.9 * (gx * lx + gy * ly)) * (0.94 + 0.06 * h[p] / (o.ripple || 1));
      for (let c = 0; c < 3; c++) img.rgb[p * 3 + c] = Math.min(1, img.rgb[p * 3 + c] * sh);
    }
  }
  const link = o.stitchLen + o.space;
  for (const [k, g] of groups.entries())
    stitch(img, g.rows, { kind: 'running', link, dash: o.stitchLen / link, thread: o.thread * (g.weight ?? 1), colour: g.colour, jitter: o.jitter ?? 0.1,
      wander: o.wanderStitch ?? 0.15, twist: 0.2, seed: seed + k * 7 });
  return img;
}
