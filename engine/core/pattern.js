// engine/core/pattern.js
// Patterns as lines, and stone cut from them (C-031). The first of the functions a pierced screen is drawn with; the
// generator of C-032 builds on them.
//
// A repeating pattern is a few line segments in one repeat, copied by its lattice (two translation vectors). The stone
// is every point within half a bar's width of a line: the distance to the nearest line has slope 1 everywhere (the
// eikonal equation, |grad d| = 1), so a bar cut from it keeps one width along its whole length, as a carver's does.
// A field thresholded at another level would give bars whose width follows 1 / |grad f| instead.
//
// The symmetry folds map any point of the plane into one small region of a symmetry group (its fundamental region).
// A pattern drawn in that region alone, read through the fold, fills the plane with the group's symmetry. A repeating
// pattern can only turn by a half, a third, a quarter or a sixth (the crystallographic restriction); a star with more
// points than that is a local symmetry, made by a rosette fold around one point.

import { starRadius } from '../culture.js';

const S3 = Math.sqrt(3);
const mod = (a, n) => ((a % n) + n) % n;

// ---- lattices ----
export const LATTICE = {
  square: (a) => [[a, 0], [0, a]],
  hex: (a) => [[a, 0], [a / 2, (a * S3) / 2]],
};

// ---- networks: the lines of one repeat, with what is known of the pattern they make ----
// Each returns { vectors, segments: [[x0, y0, x1, y1], ...], known }, where `known` holds the numbers a reader must
// read back once the lines are cut with bars of width w (see `knownFor`).
export const NETWORKS = {
  // a square grid: square openings, two bars crossing at every junction
  squares: (a) => ({ vectors: LATTICE.square(a), segments: [[0, 0, a, 0], [0, 0, 0, a]], kind: 'squares', a }),
  // a honeycomb: hexagons whose centres are d apart, three bars meeting at every junction
  hexagons: (d) => {
    const R = d / S3, v = (deg) => [R * Math.cos((deg * Math.PI) / 180), R * Math.sin((deg * Math.PI) / 180)];
    const e = (p, q) => [...v(p), ...v(q)];
    return { vectors: LATTICE.hex(d), segments: [e(30, 90), e(90, 150), e(-30, 30)], kind: 'hexagons', d };
  },
  // a triangle grid: lines in three directions, six bars at every junction
  triangles: (a) => ({ vectors: LATTICE.hex(a), segments: [[0, 0, a, 0], [0, 0, a / 2, (a * S3) / 2], [a, 0, a / 2, (a * S3) / 2]], kind: 'triangles', a }),
  // the Pythagorean tiling: squares of two sizes, turning by quarters but with no mirror; three bars at every junction
  pythagorean: (a, b) => {
    const sq = (x, y, s) => [[x, y, x + s, y], [x + s, y, x + s, y + s], [x + s, y + s, x, y + s], [x, y + s, x, y]];
    return { vectors: [[a, b], [-b, a]], segments: [...sq(0, 0, a), ...sq(a, 0, b)], kind: 'pythagorean', a, b };
  },
};

// What a reader should find in a network cut with bars of width w: share of the field open, the opening's width
// (twice its largest inscribed circle), openings per junction, the rotation order and mirrors of the repeat, the
// points (corners) of its largest opening, and the largest star: the highest turning order about any point.
export function knownFor(net, w) {
  if (net.kind === 'squares') { const o = net.a - w; return { openShare: (o / net.a) ** 2, opening: o, perJunction: 1, rotation: 4, mirrors: true, points: 4, star: 4 }; }
  if (net.kind === 'hexagons') { const o = net.d - w; return { openShare: (o / net.d) ** 2, opening: o, perJunction: 0.5, rotation: 6, mirrors: true, points: 6, star: 6 }; }
  if (net.kind === 'triangles') { const r = net.a / (2 * S3) - w / 2; return { openShare: (r / (net.a / (2 * S3))) ** 2, opening: 2 * r, perJunction: 2, rotation: 6, mirrors: true, points: 3, star: 6 }; }
  if (net.kind === 'pythagorean') {
    const A = net.a - w, B = net.b - w;
    return { openShare: (A * A + B * B) / (net.a ** 2 + net.b ** 2), opening: null, perJunction: 0.5, rotation: 4, mirrors: false, points: 4, star: 4 };
  }
  return null;
}

// ---- distance from a point to the nearest line of a repeating network ----
function segDist2(px, py, s) {
  const dx = s[2] - s[0], dy = s[3] - s[1], L = dx * dx + dy * dy;
  let t = L ? ((px - s[0]) * dx + (py - s[1]) * dy) / L : 0;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  const ex = s[0] + t * dx - px, ey = s[1] + t * dy - py;
  return ex * ex + ey * ey;
}

// Distance from (x, y) to the network, exactly: reduce the point to the repeat it falls in, then look at the
// segments of that repeat and its neighbours (`reach` repeats out, enough for any segment that leaves its repeat).
export function networkDistance(net, x, y, reach = 2) {
  const [[ax, ay], [bx, by]] = net.vectors, det = ax * by - ay * bx;
  const u = Math.floor((x * by - y * bx) / det), v = Math.floor((ax * y - ay * x) / det);
  let best = Infinity;
  for (let i = u - reach; i <= u + reach; i++) for (let j = v - reach; j <= v + reach; j++) {
    const ox = i * ax + j * bx, oy = i * ay + j * by;
    for (const s of net.segments) { const d = segDist2(x - ox, y - oy, s); if (d < best) best = d; }
  }
  return Math.sqrt(best);
}

// Cut a screen: solid (1) where a point lies within half a bar of a line, open (0) elsewhere; `inside(x, y)` limits
// the pattern to a field, and everything outside it is left solid (the frame) or empty (beyond the screen).
export function cutScreen(net, W, H, { bar, origin = [0, 0], inside = () => true, screen = () => true } = {}) {
  const m = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const px = x + 0.5, py = y + 0.5;
    if (!screen(px, py)) continue;
    m[y * W + x] = !inside(px, py) || networkDistance(net, px - origin[0], py - origin[1]) <= bar / 2 ? 1 : 0;
  }
  return m;
}

// ---- holes cut from a slab: a shape at every lattice point ----
// The other way to pierce a screen: the stone is the slab, and each opening a shape centred on a lattice point.
// `starHole` is an n-point star with straight edges, its points at `outer` and its notches at `inner` (Lumenary's
// starRadius, from his Mughal Jali).
export function latticeLocal(kind, x, y, a) {
  if (kind === 'hex') return intoHex(x, y, a);
  return [mod(x + a / 2, a) - a / 2, mod(y + a / 2, a) - a / 2];
}
export const starHole = (n, outer, inner, turn = 0) => (u, v) => Math.hypot(u, v) < starRadius(Math.atan2(v, u) - turn, n, outer, inner);
// a rosette: n petals (ellipses `length` long and `width` wide) round a hub of radius r0, the stone between them
// meeting at the hub as n bars
export const petals = (n, r0, length, width) => (u, v) => {
  const step = (2 * Math.PI) / n, t = Math.round(Math.atan2(v, u) / step) * step;
  const along = u * Math.cos(t) + v * Math.sin(t) - (r0 + length / 2), across = -u * Math.sin(t) + v * Math.cos(t);
  return (along / (length / 2)) ** 2 + (across / (width / 2)) ** 2 < 1;
};
export function cutHoles(kind, a, hole, W, H, { origin = [0, 0], inside = () => true, screen = () => true } = {}) {
  const m = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const px = x + 0.5, py = y + 0.5;
    if (!screen(px, py)) continue;
    const [u, v] = latticeLocal(kind, px - origin[0], py - origin[1], a);
    m[y * W + x] = inside(px, py) && hole(u, v) ? 0 : 1;
  }
  return m;
}
// what a reader should find in a slab pierced by n-point stars: openings meet in fours on a square lattice and in
// threes on a hexagonal one, the star's points are its corners, and its width is twice its notches' distance
export function knownForHoles(kind, n, outer, inner) {
  let rmin = Infinity;
  for (let k = 0; k < 3600; k++) rmin = Math.min(rmin, starRadius((k / 3600) * 2 * Math.PI, n, outer, inner));
  return { openShare: null, opening: 2 * rmin, perJunction: kind === 'hex' ? 0.5 : 1, rotation: kind === 'hex' ? 6 : 4, mirrors: true, points: n, star: n };
}

// ---- symmetry folds: any point into one group's fundamental region ----
// p4m: a square repeat of side a, four-fold turns and mirrors; the region is the triangle 0 <= y <= x <= a/2.
// p4: four-fold turns without mirrors; the region is the quarter square [0, a/2) x [0, a/2).
// p6m: a hexagonal repeat, six-fold turns and mirrors; the region is the 30-60-90 triangle between the centre, an
// edge's midpoint and a corner. p6: six-fold turns without mirrors; the region is a 60-degree wedge of the hexagon.
// A rosette of n points: n-fold turns about the origin (with mirrors if `mirror`), the region a wedge of 360/n
// degrees (or 180/n). Each returns [x, y] in the region.
function intoHex(x, y, a) {
  // the nearest centre of a hexagonal lattice of spacing a, and the point relative to it
  const q = ((S3 / 3) * x - y / 3) / (a / S3), r = ((2 / 3) * y) / (a / S3);
  let cx = Math.round(q), cz = Math.round(r), cy = Math.round(-q - r);
  const dx = Math.abs(cx - q), dz = Math.abs(cz - r), dy = Math.abs(cy + q + r);
  if (dx > dy && dx > dz) cx = -cy - cz; else if (dy <= dz) cz = -cx - cy;
  const s = a / S3, px = s * S3 * (cx + cz / 2), py = s * 1.5 * cz;
  return [x - px, y - py];
}
function wedge(x, y, n, mirror) {
  const r = Math.hypot(x, y), step = (2 * Math.PI) / n;
  let t = mod(Math.atan2(y, x), step);
  if (mirror && t > step / 2) t = step - t;
  return [r * Math.cos(t), r * Math.sin(t)];
}
export const FOLDS = {
  p4m(x, y, a) {
    let u = Math.abs(mod(x + a / 2, a) - a / 2), v = Math.abs(mod(y + a / 2, a) - a / 2);
    if (v > u) [u, v] = [v, u];
    return [u, v];
  },
  p4(x, y, a) {
    let u = mod(x + a / 2, a) - a / 2, v = mod(y + a / 2, a) - a / 2;
    while (!(u >= 0 && v >= 0)) [u, v] = [-v, u]; // turn by quarters into the first quadrant
    if (u === 0 && v === 0) return [0, 0];
    return [u, v];
  },
  p6m(x, y, a) { const [u, v] = intoHex(x, y, a); return wedge(v, u, 6, true); },
  p6(x, y, a) { const [u, v] = intoHex(x, y, a); return wedge(v, u, 6, false); },
  rosette(x, y, n, mirror = true) { return wedge(x, y, n, mirror); },
};
