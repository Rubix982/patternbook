// engine/core/mirror.js
// A mirror held to cloth by a grid of holding threads and a ring of shisha stitch: the primitive `mirror-inset`
// (processes/primitives.md), written in C-025 because Lumenary draws the ring and the glass's shine as a radial
// gradient in two models' code.
//
// The process. A small disc of mirror glass (mica at first, then glass, now machine-cut and silvered on the back) is
// laid on the cloth. It has no hole, so it is held by thread alone: first a square grid of straight threads across its
// face, then a ring of shisha stitch worked round it. Each stitch of the ring loops over the grid's threads at the
// inner edge (a buttonhole stitch), runs out across the glass's rim as a leg, and goes into the cloth as a chain stitch
// at the outer edge, down into the stitch before. The loops pull the grid out towards the rim, and the ring covers the
// rim all the way round, so the glass shows through an opening smaller than itself. Constraints. The ring must close:
// any gap and the glass falls out. The number of stitches is set by the chain's link and the ring's size. The opening
// keeps something of the grid's square, because the loops pass under more of the grid's threads at its corners.
// Imperfections. Hand-cut glass is not quite round; the opening sits a little off the glass's centre; the grid is laid
// a little turned; stitch spacing and the legs' angle vary with the hand; older glass is curved (cut from blown glass)
// and every disc sits at its own small tilt, so each catches the light in its own place; the silvering tarnishes.
import { cloth, STRUCTURES } from './weave.js';
import { stitch, straight, holes } from './chain.js';
import { noise2, hash2 } from './random.js';

const hexRgb = (h) => {
  const n = parseInt(String(h).replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};
const mod = (a, n) => ((a % n) + n) % n;
const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

export const MIRROR_DEFAULTS = {
  // the ring
  grid: 4, pull: 0.7, overlap: 0.2, reach: 0.3, link: 4, loop: 2.6, thread: 1.6, ring: 'shisha', colour: '#c8452a',
  // the glass and what it reflects
  curve: 0.5, tilt: 0.12, light: [0.25, -0.35], glint: 0.12, room: '#56606c', ceiling: '#c4ced6', lamp: '#fffaf0',
  // the hand
  roundness: 0.05, offset: 0.04, turn: 8, jitter: 0.12, wanderLeg: 0.15, tarnish: 0.05,
};

// The opening's radius at angle a (from its centre): the grid's polygon (n sides, turned by a0), pulled out towards a
// circle by `pull`, scaled so its mean radius is `mean`. n = 0: a circle.
export function openingRadius(n, pull, a0, mean) {
  if (!n) return () => mean;
  const half = Math.PI / n, secMean = Math.log(1 / Math.cos(half) + Math.tan(half)) / half;
  const apothem = mean / (1 + (1 - pull) * (secMean - 1));
  return (a) => { const phi = mod(a - a0 + half, 2 * half) - half; return apothem * (1 + (1 - pull) * (1 / Math.cos(phi) - 1)); };
}

// Mirrors on a cloth. Options are those of weave.cloth (unit replaced by `ground`), plus:
//   mirrors      [{ x, y, r }]: each glass's planned centre and radius
//   grid         sides of the holding grid (4, a square; 0, none: a round opening); pull: how round the ring pulls it
//   overlap      how far the ring covers the glass's rim, as a share of its radius; reach: how far past the rim the legs go
//   link, loop, thread, colour   the chain's link and loop width, the thread's thickness and colour (`colours`, a list,
//                gives the mirrors their colours in turn)
//   ring         'shisha' (loop, leg and chain per stitch), or 'chain' (rings of chain stitch alone: the control;
//                rowKind 'running' makes them running stitch)
//   curve, tilt  how curved the glass is, and how far each disc tilts at random; light: where the lamp's reflection
//                falls (x, y); glint: how large it is; room, ceiling, lamp: what the glass reflects
//   roundness, offset, turn, jitter, wanderLeg, tarnish   the hand's variations (shares of a radius, degrees, shares
//                of a stitch, the silvering's wear)
export function mirrored(opts) {
  const o = { ...MIRROR_DEFAULTS, ...opts };
  const W = o.width, H = o.height, seed = o.seed || 1;
  const img = cloth({ ...o, unit: o.ground || STRUCTURES.plain, seed, ground: o.groundColour ?? '#3a3330' });
  const room = hexRgb(o.room), ceiling = hexRgb(o.ceiling), lamp = hexRgb(o.lamp);
  const out = [];
  for (const [m, mi] of (o.mirrors || []).entries()) {
    const { x: cx, y: cy, r } = mi, h = (k) => hash2(m, k, seed + 211) * 2 - 1;
    // the glass: not quite round, at its own tilt
    const harm = [2, 3, 4].map((k, i) => [k, h(1 + i) / k, Math.PI * h(4 + i)]);
    const R = (a) => r * (1 + o.roundness * harm.reduce((s, [k, amp, ph]) => s + amp * Math.cos(k * a + ph), 0));
    const tx = o.tilt * h(7), ty = o.tilt * h(8);
    // the opening: a little off the glass's centre, its grid a little turned
    const oa = Math.PI * h(9), od = o.offset * r * Math.abs(h(10));
    const ox = cx + od * Math.cos(oa), oy = cy + od * Math.sin(oa);
    const ro = openingRadius(o.grid, o.pull, (o.turn * h(11) * Math.PI) / 180, r * (1 - o.overlap));
    const x0 = Math.max(0, Math.floor(cx - 1.3 * r)), x1 = Math.min(W - 1, Math.ceil(cx + 1.3 * r));
    const y0 = Math.max(0, Math.floor(cy - 1.3 * r)), y1 = Math.min(H - 1, Math.ceil(cy + 1.3 * r));
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy, d = Math.hypot(dx, dy), a = Math.atan2(dy, dx), Ra = R(a);
      if (d >= Ra) continue;
      // the glass's normal: a shallow dome bulging towards the viewer (height -curve*d^2/2r, so the normal leans
      // outwards from the centre), plus the disc's tilt; it reflects a view straight down
      let nx = o.curve * (dx / r) + tx, ny = o.curve * (dy / r) + ty, nz = 1;
      const nl = Math.hypot(nx, ny, nz); nx /= nl; ny /= nl; nz /= nl;
      const rx = 2 * nz * nx, ry = 2 * nz * ny; // the reflected ray's sideways part
      const up = smooth(-1, 1, -ry * 2.2); // rays leaving upward (towards the image's top) see the ceiling
      const g = Math.exp(-((rx - o.light[0]) ** 2 + (ry - o.light[1]) ** 2) / (2 * o.glint ** 2));
      const wear = (1 - 0.3 * smooth(0.88, 1, d / Ra)) * (1 - o.tarnish * (0.5 + 0.5 * noise2(x / 5, y / 5, seed + 223 + m)));
      const p = (y * W + x) * 3;
      for (let c = 0; c < 3; c++) img.rgb[p + c] = Math.min(1, 0.88 * wear * ((room[c] * (1 - up) + ceiling[c] * up) * (1 - g) + lamp[c] * g));
      img.top[y * W + x] = 7;
    }
    // the ring
    const colour = Array.isArray(o.colours) && o.colours.length ? o.colours[m % o.colours.length] : o.colour;
    const th = o.thread, thread = { colour, thread: th, link: o.link, loop: o.loop, jitter: o.jitter, wander: 0.1, seed: seed + 307 * (m + 1) };
    const N = 600, outer = Array.from({ length: N + 1 }, (_, k) => { const a = (2 * Math.PI * k) / N; const rr = R(a) + o.reach * r; return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)]; });
    outer[N] = outer[0];
    const inner = Array.from({ length: N + 1 }, (_, k) => { const a = (2 * Math.PI * k) / N; const rr = ro(a); return [ox + rr * Math.cos(a), oy + rr * Math.sin(a)]; });
    inner[N] = inner[0];
    let stitches = 0;
    if (o.ring === 'chain') {
      // the control: rows of chain stitch alone, from the opening's edge out to the ring's outer edge
      const rows = [inner];
      for (let k = 1; k * o.loop < o.reach * r + o.overlap * r; k++) {
        const f = k * o.loop;
        rows.push(Array.from({ length: N + 1 }, (_, j) => { const a = (2 * Math.PI * j) / N; const rr = Math.min(ro(a) + f, R(a) + o.reach * r); return [ox + rr * Math.cos(a), oy + rr * Math.sin(a)]; }));
        rows[rows.length - 1][N] = rows[rows.length - 1][0];
      }
      stitch(img, rows, { ...thread, kind: o.rowKind || 'chain' });
    } else {
      // one stitch per hole of the outer chain: a leg from the opening's edge out to the hole, a loop along the edge
      const P = holes(outer, thread);
      stitches = P.length - 1;
      const base = [];
      for (let k = 0; k < stitches; k++) {
        const a = Math.atan2(P[k][1] - oy, P[k][0] - ox) + o.wanderLeg * ((2 * Math.PI) / stitches) * h(20 + k);
        base.push([ox + ro(a) * Math.cos(a), oy + ro(a) * Math.sin(a)]);
      }
      straight(img, base.map((b, k) => [b, P[k]]), thread);
      straight(img, base.map((b, k) => [b, base[(k + 1) % stitches]]), { ...thread, widen: 1.25 });
      stitch(img, [outer], { ...thread, kind: 'chain' });
    }
    out.push({ x: cx, y: cy, r, stitches });
  }
  return { ...img, mirrors: out };
}

// Mirrors on a lattice, every other row shifted by half (each mirror with six neighbours, as Lumenary's model lays them).
export function lattice(W, H, spacing, r, margin = 0) {
  const out = [], dy = spacing * Math.sqrt(3) / 2;
  for (let j = 0; ; j++) {
    const y = margin + r + j * dy;
    if (y > H - margin - r) break;
    for (let x = margin + r + (j % 2 ? spacing / 2 : 0); x <= W - margin - r; x += spacing) out.push({ x, y, r });
  }
  return out;
}
