// engine/core/supplementary.js
// Supplementary weft over a woven ground: the primitive `supplementary-weft` (processes/primitives.md), written in
// C-020 because no Lumenary model has it.
//
// The process. The ground is woven as usual (`weave-draft`). An extra weft, usually thicker and often of another
// colour or of metal-wrapped thread (zari), is laid along pattern lines between ground picks. It shows on the face only
// where the figure is; a binding warp end passes over it every few ends, so no float on the face is too long to hold.
// Two kinds, told apart by the back:
//   discontinuous  laid only inside each figure: jamdani, where each motif is put in by hand with small spools, and
//                  Banarasi kadhua (karhuwa), with no floats on the back between figures;
//   continuous     running selvedge to selvedge, floating on the back between figures;
//   cutwork        continuous, with the floats on the back clipped after weaving, leaving short cut ends beside each
//                  figure (Banarasi cutwork).
// Constraints. The figure is stepped: it lives on the grid of ends and pattern lines. A float on the face can't be
// longer than the binding allows. Imperfections. The thicker thread wanders along its line; it turns and bunches at a
// figure's edge in discontinuous work; zari catches the light along its crown.
//
// Simplification, recorded in C-020: the extra weft is drawn as a layer over the ground along pattern lines, not as
// picks inserted into the ground's sequence; the ground's structure is unchanged by it.
import { cloth, STRUCTURES } from './weave.js';
import { noise2, hash2 } from './random.js';

const mod = (a, n) => ((a % n) + n) % n;
const hexRgb = (h) => {
  const n = parseInt(String(h).replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};
const find = (b, x) => {
  let lo = 0, hi = b.length - 2;
  while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (b[mid] <= x) lo = mid; else hi = mid - 1; }
  return lo;
};

// A motif from rows of text: '#' (or any of #XxOo*) is on. Row 0 is the first pattern line.
export function bitmap(rows) {
  const h = rows.length, w = Math.max(...rows.map((r) => r.length));
  return { w, h, at: (r, c) => r >= 0 && r < h && c >= 0 && c < w && '#XxOo*'.includes(rows[r][c] || ' ') };
}

// Repeat a motif across the cloth: every `across` ends and `down` pattern lines, every other column dropped by half
// (a half-drop repeat) if asked. Returns on(p, j).
export function layout(m, { across = m.w + 6, down = m.h + 4, halfDrop = true, x0 = 2, y0 = 2 } = {}) {
  return (p, j) => {
    const col = Math.floor((j - x0) / across);
    const dy = halfDrop && mod(col, 2) ? Math.floor(down / 2) : 0;
    return m.at(mod(p - y0 - dy, down), mod(j - x0, across));
  };
}

// A band: the motif repeated along one run of pattern lines (a border).
export function band(m, { across = m.w, y0 = 2, x0 = 0 } = {}) {
  return (p, j) => p >= y0 && p < y0 + m.h && m.at(p - y0, mod(j - x0, across));
}

// Motifs for checks and sketches. Stepped, as woven figures are; drawn for this primitive, not copied from a cloth.
export const MOTIFS = {
  buti: bitmap([
    '....#....', '...###...', '..##.##..', '.##...##.', '##..#..##', '.##...##.', '..##.##..', '...###...', '....#....',
  ]),
  kalka: bitmap([
    '.....##....', '....####...', '...##..#...', '..##...##..', '.##.##..##.', '.#.####..#.', '.#..##...#.', '.##.....##.',
    '..##...##..', '...#####...', '....###....',
  ]),
  vine: bitmap([
    '.##.........##..........', '#..#.......#..#.........', '#..##.....##..#..##.....', '.#..##...##..#..#..#....',
    '..#..#####..#...#..#....', '...##.....##.....##.....',
  ]),
};

export const SUPP_DEFAULTS = { kind: 'discontinuous', ratio: 2, bind: 6, suppScale: 1.5, wander: 0.25, turn: 0.35, sheen: 0, cut: 1 };

// The figured cloth. Options are those of weave.cloth (unit replaced by `ground`), plus:
//   on(p, j)    the figure: true where the extra weft is on the face at pattern line p, warp end j
//   kind        'discontinuous' | 'continuous' | 'cutwork'
//   side        'face' | 'back' (the back is drawn as seen from behind but not mirrored, so cells line up)
//   ratio       ground picks per pattern line
//   bind        a binding warp end every `bind` ends along a face float (floats of at most bind - 1 ends)
//   supp        the extra weft's colour (or a list, one per pattern line in turn)
//   suppScale   its thickness against a ground pick
//   wander      how far it wanders along its line; turn: how much it bunches where it turns at a figure's edge
//   sheen       metal-thread highlight along its crown (0 for cotton or silk, about 0.6 for zari)
//   cut         cutwork: how many ends the clipped stubs reach beyond a figure on the back
// Returns the cloth's image with top codes 3 (extra weft) and 4 (a binding warp end over it) added.
export function figured(opts) {
  const o = { ...SUPP_DEFAULTS, ...opts };
  const { on, kind, side = 'face', ratio, bind, suppScale, wander, turn, sheen, cut, seed = 1 } = o;
  const ground = o.ground || STRUCTURES.plain;
  const unit = side === 'back' ? { ends: ground.ends, picks: ground.picks, up: (i, j) => !ground.up(i, j) } : ground;
  const base = cloth({ ...o, unit, seed });
  const { width, height, rgb, top, xb, yb, disp, half } = base;
  const pickSett = o.pickSett || o.sett || 8;
  const S = (Array.isArray(o.supp) ? o.supp : [o.supp || '#d4a017']).map(hexRgb);
  const W = (o.warp || ['#1d2a4a']).map(hexRgb);
  const hs = suppScale * pickSett * (1 - (o.gap ?? 0.12)) / 2;
  const stagger = Math.floor(bind / 2) + 1;
  const bound = (p, j) => mod(j + p * stagger, bind) === 0;
  const face = (p, j) => on(p, j) && !bound(p, j);
  const lineY = (p) => yb[Math.min(yb.length - 1, p * ratio + ratio)];
  const near = (p, j, d) => { for (let k = 1; k <= d; k++) if (on(p, j - k) || on(p, j + k)) return true; return false; };
  const round = o.round ?? 0.55, dip = o.dip ?? 0.35;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [xs, ys] = disp(x, y);
      const j = find(xb, Math.max(0, xs)), i = find(yb, Math.max(0, ys));
      const s = (xs - xb[j]) / (xb[j + 1] - xb[j]) - 0.5;
      let hit = null;
      for (let p = Math.floor(i / ratio) - 2; p <= Math.floor(i / ratio) + 1; p++) {
        if (p < 0) continue;
        const yc = lineY(p) + wander * pickSett * 0.35 * noise2(xs / (o.sett || 8) / 6, p * 1.7, seed + 21);
        const tt = (ys - yc) / hs;
        if (Math.abs(tt) < 1) { hit = { p, tt }; break; }
      }
      if (!hit) continue;
      const { p, tt } = hit;
      // what the extra weft does at this crossing, seen from this side
      let show = false, binder = false, edgeL = false, edgeR = false;
      if (side === 'face') {
        if (on(p, j)) { if (bound(p, j)) binder = true; else show = true; }
        edgeL = !face(p, j - 1); edgeR = !face(p, j + 1);
      } else {
        const behind = (q) => kind === 'continuous' ? !on(p, q) : kind === 'cutwork' ? !on(p, q) && near(p, q, cut) : false;
        if (on(p, j)) show = bound(p, j); // on the back, the extra weft shows where the binding end held it
        else show = behind(j);
        const shows = (q) => (on(p, q) ? bound(p, q) : behind(q));
        edgeL = !shows(j - 1); edgeR = !shows(j + 1);
      }
      const k = (y * width + x) * 3;
      if (binder) { // the binding warp end crosses over the extra weft
        if (Math.abs(s) < half) {
          const c = W[mod(j, W.length)];
          const sh = (1 - round * 0.5 * (s / half) ** 2) * (1 - 0.25 * Math.max(0, Math.abs(tt) - 0.6));
          rgb[k] = c[0] * sh; rgb[k + 1] = c[1] * sh; rgb[k + 2] = c[2] * sh; top[y * width + x] = 4;
          continue;
        }
        show = true; // beside the binding end, the extra weft shows in the gap
      }
      if (!show) continue;
      const c = S[mod(p, S.length)];
      let sh = 1 - round * 0.5 * tt * tt;
      if (edgeL) sh *= 1 - dip * Math.max(0, 1 - (s + 0.5) / 0.35) ** 2;
      if (edgeR) sh *= 1 - dip * Math.max(0, 1 - (0.5 - s) / 0.35) ** 2;
      const atTurn = kind === 'discontinuous' && side === 'face' && ((edgeL && !on(p, j - 1)) || (edgeR && !on(p, j + 1)));
      if (atTurn) sh *= 1 - turn * 0.35 * (1 - Math.abs(tt)); // the thread bunches and shadows where it turns back
      sh *= 1 + 0.06 * (hash2(p, j, seed + 5) - 0.5);
      const hl = sheen * Math.exp(-((tt + 0.25) ** 2) / 0.04) * (0.7 + 0.3 * noise2(xs / 3, ys / 3, seed + 9));
      rgb[k] = Math.min(1, c[0] * sh + hl); rgb[k + 1] = Math.min(1, c[1] * sh + hl); rgb[k + 2] = Math.min(1, c[2] * sh + hl);
      top[y * width + x] = 3;
    }
  }
  return { ...base, rgb, top, ratio, bind, hs, lineY };
}
