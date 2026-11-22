// engine/core/jali-design.js
// A jali generator in layers (C-032): a frame, a tiling whose symmetry the design takes, a construction on the tiling
// (strands by Hankin's method, or the tiling's own edges as cells), the cut (stone within half a bar of the lines, so
// the bars keep one width), the hand (bars varying a little along their length) and a thickness for building.
//
// Hankin's method ("polygons in contact"; Hankin 1925, written for computers by Kaplan and Salesin 2004): in every
// polygon of a tiling, from the middle of each edge send two rays into the polygon, each at the contact angle to the
// edge, one leaning towards each end of the edge; each ray stops where it meets the ray leaning the other way from the
// neighbouring edge. Where two polygons share an edge their rays cross at its middle, so the lines run on as strands
// crossing in pairs. At a contact angle near 90 degrees the rays meet near each polygon's centre (a hub); near 0 they
// hug the tiling's edges.
//
// The dials and their ranges for a jali come from C-031's measures (`pieces/jali/grammar.md`).
import { distanceTo, signedDistance } from './field.js';
import { noise1, noise2, hash2 } from './random.js';

const S3 = Math.sqrt(3), TAU = 2 * Math.PI;
const poly = (cx, cy, n, R, rot) => Array.from({ length: n }, (_, k) => [cx + R * Math.cos(rot + (k * TAU) / n), cy + R * Math.sin(rot + (k * TAU) / n)]);

// ---- tilings: the polygons of one repeat, `a` the lattice's spacing ----
export const TILINGS = {
  '4.4.4.4': (a) => ({ vectors: [[a, 0], [0, a]], polygons: [poly(0, 0, 4, a / Math.SQRT2, Math.PI / 4)] }),
  '6.6.6': (a) => ({ vectors: [[a, 0], [a / 2, (a * S3) / 2]], polygons: [poly(0, 0, 6, a / S3, Math.PI / 6)] }),
  '4.8.8': (a) => {
    const s = a / (1 + Math.SQRT2), Ro = s / (2 * Math.sin(Math.PI / 8));
    return { vectors: [[a, 0], [0, a]], polygons: [poly(0, 0, 8, Ro, Math.PI / 8), poly(a / 2, a / 2, 4, (a - s) / 2, 0)] };
  },
  '3.12.12': (a) => {
    const t = a * Math.tan(Math.PI / 12), R12 = a / 2 / Math.cos(Math.PI / 12);
    return { vectors: [[a, 0], [a / 2, (a * S3) / 2]],
      polygons: [poly(0, 0, 12, R12, Math.PI / 12), poly(a / 2, a / (2 * S3), 3, t / S3, Math.PI / 6), poly(a, a / S3, 3, t / S3, Math.PI / 2)] };
  },
  '4.6.12': (a) => {
    const t = a / (3 + S3), R12 = t / (2 * Math.sin(Math.PI / 12)), sq = (ang) => poly((a / 2) * Math.cos(ang), (a / 2) * Math.sin(ang), 4, t / Math.SQRT2, Math.PI / 4 + ang);
    return { vectors: [[a, 0], [a / 2, (a * S3) / 2]],
      polygons: [poly(0, 0, 12, R12, Math.PI / 12), sq(0), sq(Math.PI / 3), sq((2 * Math.PI) / 3), poly(a / 2, a / (2 * S3), 6, t, 0), poly(a, a / S3, 6, t, 0)] };
  },
  '3.6.3.6': (a) => ({ vectors: [[a, 0], [a / 2, (a * S3) / 2]],
    polygons: [poly(0, 0, 6, a / 2, 0), poly(a / 2, a / (2 * S3), 3, a / (2 * S3), -Math.PI / 2), poly(a, a / S3, 3, a / (2 * S3), Math.PI / 2)] }),
};
export const TILING_NAMES = Object.keys(TILINGS);

// ---- constructions: the lines of one polygon ----
const sub = (p, q) => [p[0] - q[0], p[1] - q[1]], cross = (p, q) => p[0] * q[1] - p[1] * q[0];
const norm = (v) => { const l = Math.hypot(v[0], v[1]); return [v[0] / l, v[1] / l]; };

// Hankin's rays in one polygon at contact angle `theta` (radians): [[x0, y0, x1, y1], ...]
export function hankin(P, theta) {
  const n = P.length, c = P.reduce((s, p) => [s[0] + p[0] / n, s[1] + p[1] / n], [0, 0]);
  const E = P.map((p, i) => {
    const q = P[(i + 1) % n], m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], u = norm(sub(q, p));
    let nn = [-u[1], u[0]];
    if ((c[0] - m[0]) * nn[0] + (c[1] - m[1]) * nn[1] < 0) nn = [-nn[0], -nn[1]]; // inward
    return { m, u, n: nn };
  });
  const out = [], ct = Math.cos(theta), st = Math.sin(theta), reach = 2 * Math.max(...P.map((p) => Math.hypot(p[0] - c[0], p[1] - c[1])));
  for (let i = 0; i < n; i++) {
    const A = E[i], B = E[(i + 1) % n];
    const d1 = [ct * A.u[0] + st * A.n[0], ct * A.u[1] + st * A.n[1]];   // from edge i, towards their shared corner
    const d2 = [-ct * B.u[0] + st * B.n[0], -ct * B.u[1] + st * B.n[1]]; // from edge i+1, back towards it
    const den = cross(d1, d2);
    if (Math.abs(den) < 1e-9) continue;
    const w = sub(B.m, A.m), s = cross(w, d2) / den, t = cross(w, d1) / den;
    if (s <= 0 || t <= 0 || s > reach || t > reach) continue;
    const X = [A.m[0] + s * d1[0], A.m[1] + s * d1[1]];
    out.push([A.m[0], A.m[1], X[0], X[1]], [B.m[0], B.m[1], X[0], X[1]]);
  }
  return out;
}
export const edgesOf = (P) => P.map((p, i) => [p[0], p[1], P[(i + 1) % P.length][0], P[(i + 1) % P.length][1]]);

// ---- frames: the field inside the solid border ----
// Each returns inside(x, y) for a field from (x0, y0) to (x1, y1); arches spring at a height that keeps the field's
// bottom part rectangular.
export function frameField(kind, x0, y0, x1, y1) {
  if (kind === 'rect') return (x, y) => x >= x0 && x < x1 && y >= y0 && y < y1;
  const Wf = x1 - x0, R = 0.85 * Wf, rise = Math.sqrt(R * R - (R - Wf / 2) ** 2), ys = y0 + rise, cl = x0 + R, cr = x1 - R;
  const arch = (x, y) => x >= x0 && x < x1 && y < y1 && (y >= ys || ((x - cl) ** 2 + (y - ys) ** 2 <= R * R && (x - cr) ** 2 + (y - ys) ** 2 <= R * R));
  if (kind === 'pointed') return arch;
  // cusped: small discs of stone along the arch's two curves, five a side
  const cusps = [];
  const a0 = Math.atan2(y0 - ys, (x0 + Wf / 2) - cl); // apex angle seen from the left centre
  for (let k = 1; k <= 5; k++) {
    const tl = -Math.PI + (a0 + Math.PI) * (k / 6), tr = Math.PI - tl; // along the left arc from the spring to the apex
    cusps.push([cl + R * Math.cos(tl), ys + R * Math.sin(tl)], [cr + R * Math.cos(tr), ys + R * Math.sin(tr)]);
  }
  const rc = 0.055 * Wf;
  return (x, y) => arch(x, y) && cusps.every(([cx, cy]) => (x - cx) ** 2 + (y - cy) ** 2 > rc * rc);
}

// ---- composition (C-037): real jalis' four layouts round the field ----
// Fractions are of the slab's width; archRadius of the field's width. A: a plain margin (`plain`), the field a rectangle. B: plain
// sides and bottom, a wider top, the field a pointed arch with a solid moulding inside its edge, solid spandrels. C: a
// plain outer margin, a band of small pierced motifs, a plain inner strip, then an arch with a solid moulding and the
// spandrels pierced with the field's pattern. D: a thin plain edge, a band of motifs, a plain strip, a rectangle.
export const LAYOUT_DEFAULTS = { plain: 0.14, sideMargin: 0.155, topMargin: 0.265, archRadius: 0.59, outer: 0.05, band: 0.06,
  inner: 0.025, moulding: 0.02, edge: 0.02, motif: 'quatrefoil' };
const MOTIFS = {
  quatrefoil: (u, v, r) => [[0.42, 0], [-0.42, 0], [0, 0.42], [0, -0.42]].some(([a, b]) => (u - a * r) ** 2 + (v - b * r) ** 2 < (0.45 * r) ** 2),
  diamond: (u, v, r) => Math.abs(u) + Math.abs(v) < 0.85 * r,
  cross: (u, v, r) => (Math.abs(u) < 0.3 * r && Math.abs(v) < 0.9 * r) || (Math.abs(v) < 0.3 * r && Math.abs(u) < 0.9 * r),
};
export function composeLayout(o, sx0, sy0, sx1, sy1) {
  const L = { ...LAYOUT_DEFAULTS, ...o }, Ws = sx1 - sx0, kind = o.layout;
  let x0, y0, x1, y1, ring = null;
  if (kind === 'A') { const m = L.plain * Ws; [x0, y0, x1, y1] = [sx0 + m, sy0 + m, sx1 - m, sy1 - m]; }
  else if (kind === 'B') { const m = L.sideMargin * Ws; [x0, y0, x1, y1] = [sx0 + m, sy0 + L.topMargin * Ws, sx1 - m, sy1 - m]; }
  else {
    const e = (kind === 'C' ? L.outer : L.edge) * Ws, b = L.band * Ws, n = L.inner * Ws;
    ring = { a0: [sx0 + e, sy0 + e, sx1 - e, sy1 - e], a1: [sx0 + e + b, sy0 + e + b, sx1 - e - b, sy1 - e - b] };
    [x0, y0, x1, y1] = [sx0 + e + b + n, sy0 + e + b + n, sx1 - e - b - n, sy1 - e - b - n];
  }
  const Wf = x1 - x0, R = Math.max(L.archRadius, 0.501) * Wf, rise = Math.sqrt(R * R - (R - Wf / 2) ** 2), ys = y0 + rise, cl = x0 + R, cr = x1 - R;
  const arch = (x, y, inset) => x >= x0 + inset && x < x1 - inset && y < y1 - inset && (y >= ys || ((x - cl) ** 2 + (y - ys) ** 2 <= (R - inset) ** 2 && (x - cr) ** 2 + (y - ys) ** 2 <= (R - inset) ** 2));
  const rect = (x, y) => x >= x0 && x < x1 && y >= y0 && y < y1, mo = L.moulding * Ws;
  let pattern;
  if (kind === 'A' || kind === 'D') pattern = rect;
  else if (kind === 'B') pattern = (x, y) => arch(x, y, mo);
  else pattern = (x, y) => rect(x, y) && (arch(x, y, mo) || !arch(x, y, -mo)) && !(x < x0 + mo || x >= x1 - mo || y >= y1 - mo || y < y0 + mo);
  // the band's motifs: evenly along each side of the ring's centre line, as many as fit at 1.4 band widths apart
  const motifs = [];
  if (ring) {
    const [p0, q0, p1, q1] = ring.a0, b = ring.a1[0] - ring.a0[0], c = [p0 + b / 2, q0 + b / 2, p1 - b / 2, q1 - b / 2];
    const side = (xa, ya, xb, yb) => { const len = Math.hypot(xb - xa, yb - ya), n = Math.max(2, Math.round(len / (1.4 * b))); for (let k = 0; k < n; k++) motifs.push([xa + ((xb - xa) * k) / n, ya + ((yb - ya) * k) / n]); };
    side(c[0], c[1], c[2], c[1]); side(c[2], c[1], c[2], c[3]); side(c[2], c[3], c[0], c[3]); side(c[0], c[3], c[0], c[1]);
  }
  const shape = MOTIFS[L.motif] || MOTIFS.quatrefoil, mr = ring ? 0.32 * (ring.a1[0] - ring.a0[0]) : 0;
  const open = ring ? (x, y) => { for (const [cx, cy] of motifs) { const u = x - cx, v = y - cy; if (Math.abs(u) < mr && Math.abs(v) < mr && shape(u, v, mr)) return true; } return false; } : () => false;
  return { pattern, open, field: [x0, y0, x1, y1], motifs: motifs.length };
}

// ---- the design ----
// opts: width, height (the image), margin (empty round the slab), border (solid frame width), frame ('rect',
// 'pointed', 'cusped'), tiling (a TILINGS name), kind ('strands' or 'cells'), angle (contact angle, degrees), across
// (lattice repeats across the field), barOverOpening (the bar's width over the opening's), hand (0 to 1: how much the
// bars vary), thickness (the stone's depth over the opening's width), seed.
// What the carving got slightly wrong, each 0 by default (the design exact), in lattice repeats or bar widths:
//   drift   the setting-out: a smooth displacement of every line's ends, correlated over three repeats, as a pattern
//           laid out by hand with compass and cord wanders across a panel (repeats);
//   jitter  each meeting point placed a little off on its own (repeats);
//   round   the chisel's and drill's radius: an opening's corners rounded (bar widths);
//   wear    the edges eroded unevenly, rougher where the stone is soft (bar widths).
// drift and jitter default to what C-033 read on 10 real jalis (medians, read back jointly through the calibration;
// upper bounds, since a photograph adds its own distortion); round and wear stay 0 (not calibrated, or not seen).
// Bars cut one by one, from uneven stone, worn by time (C-036), each 0 by default:
//   barSpread  every line between two meeting points its own half-width, a normal spread round the bar's (clipped at
//              2.5 spreads), as each bar was cut on its own;
//   age        0 freshly cut to 1: edges retreat, at most a quarter of a bar at 1, more near the top (rain), more in
//              soft layers, unevenly along the edge, and stone corners round as they go (a guess, labelled one);
//   bedding    how much the stone's horizontal layers differ in softness (0 even to 1), acting only through age (a
//              hypothesis, not measured).
export const DESIGN_DEFAULTS = { width: 1100, height: 1400, margin: 90, border: 70, frame: 'rect', tiling: '4.8.8', kind: 'strands', angle: 67.5,
  across: 7, barOverOpening: 0.45, hand: 0.15, thickness: 3.5, seed: 1, drift: 0.16, jitter: 0.048, round: 0, wear: 0, barSpread: 0, age: 0, bedding: 0.5, layout: 'none' };

export function designJali(options = {}) {
  const o = { ...DESIGN_DEFAULTS, ...options }, W = o.width, H = o.height;
  const sx0 = o.margin, sy0 = o.margin, sx1 = W - o.margin, sy1 = H - o.margin;
  const comp = o.layout && o.layout !== 'none' ? composeLayout(o, sx0, sy0, sx1, sy1) : null;
  const [fx0, fy0, fx1, fy1] = comp ? comp.field : [sx0 + o.border, sy0 + o.border, sx1 - o.border, sy1 - o.border];
  const inSlab = (x, y) => x >= sx0 && x < sx1 && y >= sy0 && y < sy1, inField = comp ? comp.pattern : frameField(o.frame, fx0, fy0, fx1, fy1);
  const motifOpen = comp ? comp.open : () => false;
  const a = (fx1 - fx0) / o.across, T = TILINGS[o.tiling](a), [[ax, ay], [bx, by]] = T.vectors;
  const ox = (fx0 + fx1) / 2, oy = (fy0 + fy1) / 2, theta = (o.angle * Math.PI) / 180;
  // the lines over the slab: every repeat whose polygons can reach it
  const det = ax * by - ay * bx, toLat = (x, y) => [((x - ox) * by - (y - oy) * bx) / det, ((y - oy) * ax - (x - ox) * ay) / det];
  const corners = [[sx0, sy0], [sx1, sy0], [sx0, sy1], [sx1, sy1]].map(([x, y]) => toLat(x, y));
  const iMin = Math.floor(Math.min(...corners.map((c) => c[0]))) - 2, iMax = Math.ceil(Math.max(...corners.map((c) => c[0]))) + 2;
  const jMin = Math.floor(Math.min(...corners.map((c) => c[1]))) - 2, jMax = Math.ceil(Math.max(...corners.map((c) => c[1]))) + 2;
  const local = T.polygons.flatMap((P) => (o.kind === 'cells' ? edgesOf(P) : hankin(P, theta)));
  const segs = [];
  for (let i = iMin; i <= iMax; i++) for (let j = jMin; j <= jMax; j++) {
    const dx = ox + i * ax + j * bx, dy = oy + i * ay + j * by;
    for (const s of local) segs.push([s[0] + dx, s[1] + dy, s[2] + dx, s[3] + dy]);
  }
  // the setting-out's drift and each point's jitter move a line's ends; ends that meet move together (the jitter is
  // tied to where a point is, not to which line it ends)
  if (o.drift || o.jitter) {
    const L3 = 3 * a, move = (x, y) => {
      let mx = o.drift * a * noise2(x / L3, y / L3, o.seed + 11), my = o.drift * a * noise2(x / L3 + 17.3, y / L3 - 5.1, o.seed + 13);
      if (o.jitter) { const qx = Math.round(x * 4), qy = Math.round(y * 4); mx += o.jitter * a * (2 * hash2(qx, qy, o.seed + 21) - 1); my += o.jitter * a * (2 * hash2(qx, qy, o.seed + 23) - 1); }
      return [x + mx, y + my];
    };
    for (const s of segs) { const [x0, y0] = move(s[0], s[1]), [x1, y1] = move(s[2], s[3]); s[0] = x0; s[1] = y0; s[2] = x1; s[3] = y1; }
  }
  // the bar from the target bar over opening: the lines' distance field gives each face's widest inscribed circle D;
  // bars of width w leave openings 2D - w wide, so w = 2 D r / (1 + r)
  const L = new Uint8Array(W * H);
  for (const s of segs) {
    const n = Math.ceil(Math.hypot(s[2] - s[0], s[3] - s[1]) * 2) + 1;
    for (let k = 0; k <= n; k++) {
      const x = Math.round(s[0] + ((s[2] - s[0]) * k) / n - 0.5), y = Math.round(s[1] + ((s[3] - s[1]) * k) / n - 0.5);
      if (x >= 0 && y >= 0 && x < W && y < H) L[y * W + x] = 1;
    }
  }
  const d0 = distanceTo(L, W, H), D = faceWidth(d0, W, H, inField);
  const r = o.barOverOpening, bar = (2 * D * r) / (1 + r), opening = 2 * D - bar;
  // the cut, exactly, near the lines; the hand varies each bar's width smoothly along it
  // each line's own half-width (barSpread): dmin holds the distance less the line's extra half-width, so a pixel is stone
  // where some line's own bar covers it; with barSpread 0 it is the plain distance
  const gauss = (k) => Math.max(-2.5, Math.min(2.5, 2 * (hash2(k, 1, o.seed + 41) + hash2(k, 2, o.seed + 43) + hash2(k, 3, o.seed + 47) - 1.5)));
  const extra = segs.map((_, k) => (o.barSpread ? (bar / 2) * o.barSpread * gauss(k) : 0));
  const half = (bar / 2) * (1 + 0.5 * o.hand + 2.5 * o.barSpread) + 2, dmin = new Float32Array(W * H).fill(Infinity);
  for (let k = 0; k < segs.length; k++) {
    const s = segs[k], ek = extra[k];
    const xa = Math.max(sx0, Math.floor(Math.min(s[0], s[2]) - half)), xb = Math.min(sx1 - 1, Math.ceil(Math.max(s[0], s[2]) + half));
    const ya = Math.max(sy0, Math.floor(Math.min(s[1], s[3]) - half)), yb = Math.min(sy1 - 1, Math.ceil(Math.max(s[1], s[3]) + half));
    if (xa > xb || ya > yb) continue;
    const ex = s[2] - s[0], ey = s[3] - s[1], LL = ex * ex + ey * ey || 1;
    for (let y = ya; y <= yb; y++) for (let x = xa; x <= xb; x++) {
      const px = x + 0.5, py = y + 0.5;
      let t = ((px - s[0]) * ex + (py - s[1]) * ey) / LL; t = t < 0 ? 0 : t > 1 ? 1 : t;
      const qx = s[0] + t * ex - px, qy = s[1] + t * ey - py, d = Math.sqrt(qx * qx + qy * qy) - ek, p = y * W + x;
      if (d < dmin[p]) dmin[p] = d;
    }
  }
  const stone = new Uint8Array(W * H), slab = new Uint8Array(W * H), S = a;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const px = x + 0.5, py = y + 0.5, p = y * W + x;
    if (!inSlab(px, py)) continue;
    slab[p] = 1;
    if (motifOpen(px, py)) continue; // a band's pierced motif
    if (!inField(px, py)) { stone[p] = 1; continue; }
    const wl = bar * (1 + o.hand * (0.35 * noise2(px / S, py / S, o.seed) + 0.12 * noise2((px * 5) / S, (py * 5) / S, o.seed + 7)));
    if (dmin[p] <= wl / 2) stone[p] = 1;
  }
  // age: every edge in the field retreats by e, at most a quarter of a bar at age 1, deeper near the top, in soft layers
  // and unevenly along the edge; then the stone's corners round with a disc of half the deepest retreat
  if (o.age > 0) {
    const sd = signedDistance((x, y) => stone[Math.floor(y) * W + Math.floor(x)] === 1, W, H), Hf = fy1 - fy0;
    const peak = 1.6 * (1 + o.bedding) * 1.5, depth = (0.25 * bar * o.age) / peak, lam = Math.max(3, 0.8 * bar);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const p = y * W + x, px = x + 0.5, py = y + 0.5;
      if (!slab[p] || !inField(px, py)) continue;
      const top = 1 + 0.6 * (1 - Math.min(1, Math.max(0, (py - fy0) / Hf)));
      const soft = 1 + o.bedding * noise1(py / (0.7 * a), o.seed + 51);
      const along = 1 + 0.5 * noise2(px / lam, py / lam, o.seed + 53);
      stone[p] = sd[p] > depth * top * soft * along ? 1 : 0;
    }
    const rc = 0.125 * bar * o.age;
    if (rc > 0.5) {
      const sd2 = signedDistance((x, y) => stone[Math.floor(y) * W + Math.floor(x)] === 1, W, H), core = new Uint8Array(W * H);
      for (let p = 0; p < W * H; p++) core[p] = stone[p] && sd2[p] > rc ? 1 : 0;
      const toCore = distanceTo(core, W, H);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const p = y * W + x;
        if (stone[p] && inField(x + 0.5, y + 0.5) && toCore[p] > rc + 0.5) stone[p] = 0;
      }
    }
  }
  // the chisel's radius rounds each opening's corners (an opening of the open area by a disc); wear roughens every
  // edge, unevenly, by moving it along its own distance field by smooth noise
  if (o.round || o.wear) {
    const rr = o.round * bar;
    if (rr > 0.5) {
      const openM = new Uint8Array(W * H), solid = new Uint8Array(W * H);
      for (let p = 0; p < W * H; p++) { openM[p] = slab[p] && !stone[p] ? 1 : 0; solid[p] = openM[p] ? 0 : 1; }
      const toStone = distanceTo(solid, W, H), core = new Uint8Array(W * H);
      for (let p = 0; p < W * H; p++) core[p] = openM[p] && toStone[p] > rr ? 1 : 0;
      const toCore = distanceTo(core, W, H);
      for (let p = 0; p < W * H; p++) if (openM[p] && toCore[p] > rr) stone[p] = 1;
    }
    if (o.wear) {
      const sd = signedDistance((x, y) => stone[Math.floor(y) * W + Math.floor(x)] === 1, W, H), amp = o.wear * bar, lam = Math.max(3, bar * 0.8);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const p = y * W + x;
        if (!slab[p] || !inField(x + 0.5, y + 0.5)) continue;
        const n = 0.7 * noise2(x / lam, y / lam, o.seed + 31) + 0.3 * noise2((x * 3) / lam, (y * 3) / lam, o.seed + 37);
        stone[p] = sd[p] + amp * n > 0 ? 1 : 0;
      }
    }
  }
  const recipe = { ...o, bar: +bar.toFixed(2), opening: +opening.toFixed(2), lattice: +a.toFixed(2), thicknessPx: +(o.thickness * opening).toFixed(2) };
  return { width: W, height: H, stone, slab, segs, recipe, field: [fx0, fy0, fx1, fy1], svg: () => toSvg(segs, recipe, [sx0, sy0, sx1, sy1], [fx0, fy0, fx1, fy1]) };
}

// the area-weighted median of the faces' widest inscribed radius, over faces wholly inside the field
function faceWidth(d0, W, H, inField) {
  const lab = new Int32Array(W * H).fill(-1), faces = [];
  for (let s = 0; s < W * H; s++) {
    if (lab[s] !== -1 || d0[s] < 1) continue;
    const sy = Math.floor(s / W), sxx = s % W;
    if (!inField(sxx + 0.5, sy + 0.5)) continue;
    let max = 0, area = 0, inside = true;
    const st = [s]; lab[s] = faces.length;
    while (st.length) {
      const p = st.pop(), x = p % W, y = (p - x) / W;
      area++; if (d0[p] > max) max = d0[p];
      if (!inField(x + 0.5, y + 0.5)) inside = false;
      for (const q of [p - 1, p + 1, p - W, p + W]) {
        if (q < 0 || q >= W * H || lab[q] !== -1 || d0[q] < 1) continue;
        if ((q === p - 1 && x === 0) || (q === p + 1 && x === W - 1)) continue;
        lab[q] = faces.length; st.push(q);
      }
    }
    faces.push({ max, area, inside });
  }
  const f = faces.filter((x) => x.inside && x.area > 4).sort((p, q) => p.max - q.max);
  const tot = f.reduce((s, x) => s + x.area, 0);
  let acc = 0;
  for (const x of f) { acc += x.area; if (acc >= tot / 2) return x.max; }
  return f.length ? f[f.length - 1].max : 10;
}

// the design as SVG: the slab, the field, and the lines as bars of the nominal width clipped to the field
function toSvg(segs, recipe, slab, field) {
  const [sx0, sy0, sx1, sy1] = slab, [fx0, fy0, fx1, fy1] = field, Wf = fx1 - fx0;
  let clip = `<rect x="${fx0}" y="${fy0}" width="${Wf}" height="${fy1 - fy0}"/>`;
  if (recipe.frame !== 'rect') {
    const R = 0.85 * Wf, rise = Math.sqrt(R * R - (R - Wf / 2) ** 2), ys = fy0 + rise, ax = fx0 + Wf / 2;
    clip = `<path d="M${fx0},${fy1} L${fx0},${ys} A${R},${R} 0 0 1 ${ax},${fy0} A${R},${R} 0 0 1 ${fx1},${ys} L${fx1},${fy1} Z"/>`;
  }
  const lines = segs.filter((s) => Math.max(s[0], s[2]) > fx0 - 50 && Math.min(s[0], s[2]) < fx1 + 50 && Math.max(s[1], s[3]) > fy0 - 50 && Math.min(s[1], s[3]) < fy1 + 50)
    .map((s) => `M${s[0].toFixed(1)},${s[1].toFixed(1)}L${s[2].toFixed(1)},${s[3].toFixed(1)}`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${sx0} ${sy0} ${sx1 - sx0} ${sy1 - sy0}">
<!-- jali design: ${JSON.stringify(recipe)} -->
<defs><clipPath id="field">${clip}</clipPath><mask id="open"><rect x="${sx0}" y="${sy0}" width="${sx1 - sx0}" height="${sy1 - sy0}" fill="white"/><g clip-path="url(#field)"><rect x="${sx0}" y="${sy0}" width="${sx1 - sx0}" height="${sy1 - sy0}" fill="black"/><path d="${lines}" stroke="white" stroke-width="${recipe.bar}" stroke-linecap="round" fill="none"/></g></mask></defs>
<rect x="${sx0}" y="${sy0}" width="${sx1 - sx0}" height="${sy1 - sy0}" fill="#c98a5c" mask="url(#open)"/>
</svg>`;
}
