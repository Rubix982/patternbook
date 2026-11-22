// engine/styles/parchin-kari.js
// Parchin Kari: the picture inlaid in stone, as in Mughal pietra dura (C-029). The picture is cut into regions as a
// designer would draw the pieces; each region is cut from the stone nearest its colour, turned so the stone's bands run
// along the piece, and set into Makrana marble, which is left wherever the picture is lightest; one polished sheen lies
// over all of it. The process model is core/inlay.js (C-027).
import { pictureStyle } from '../picture-style.js';
import { quantize, smoothLabels, regions, lumOf, nearest, rgbOf } from '../core/picture.js';
import { inlaid, STONES, INLAY_DEFAULTS } from '../core/inlay.js';

const SETS = {
  mughal: ['lapis', 'carnelian', 'jasper', 'malachite', 'onyx', 'yellow-jasper', 'mother-of-pearl', 'agate'],
  red: ['carnelian', 'jasper', 'onyx', 'yellow-jasper', 'agate'],
  cool: ['lapis', 'malachite', 'onyx', 'mother-of-pearl', 'agate'],
};
const face = (id) => { const s = STONES[id], b = rgbOf(s.base), d = rgbOf(s.band), t = s.bands * 0.45; return b.map((v, i) => v * (1 - t) + d[i] * t); };

export function treat(pic, p) {
  const W = pic.width, H = pic.height, k = Math.max(W, H) / 600;
  const { labels } = quantize(pic, p.colours, p.seed);
  const { map, list } = regions(smoothLabels(labels, W, H, 2), W, H, { minArea: Math.round((90 - 8 * p.detail) * k * k), pic });
  const stones = SETS[p.stones], faces = stones.map(face);
  const pieces = list.filter((r) => lumOf(...r.colour) <= p.marble).map((r) => ({
    inside: (x, y) => map[Math.min(H - 1, Math.floor(y)) * W + Math.min(W - 1, Math.floor(x))] === r.id,
    cx: r.cx, cy: r.cy, axis: r.axis, elongation: r.elongation, stone: stones[nearest(r.colour, faces)] }));
  return inlaid({ ...INLAY_DEFAULTS, width: W, height: H, seed: p.seed, pieces, seam: p.seam * k, gloss: p.gloss });
}

export default pictureStyle({
  id: 'parchin-kari',
  name: 'Parchin Kari',
  blurb: "The picture inlaid in stone: cut into pieces, each from the stone nearest its colour, its bands turned to run along the piece, set into polished marble.",
  maxSide: 900,
  params: [
    { key: 'colours', label: 'Colours to cut', type: 'range', min: 3, max: 12, step: 1, default: 7 },
    { key: 'detail', label: 'Detail', type: 'range', min: 1, max: 10, step: 1, default: 6 },
    { key: 'stones', label: 'Stones', type: 'select', default: 'mughal', options: [['mughal', 'Lapis, carnelian, jasper, malachite and more'], ['red', 'Carnelian and jaspers'], ['cool', 'Lapis and malachite']] },
    { key: 'marble', label: 'Marble above', type: 'range', min: 0.3, max: 1, step: 0.01, default: 0.72 },
    { key: 'seam', label: 'Seam', type: 'range', min: 0, max: 3, step: 0.1, default: 0.7 },
    { key: 'gloss', label: 'Polish', type: 'range', min: 0, max: 1, step: 0.01, default: 0.28 },
    { key: 'seed', label: 'New cutting', type: 'shuffle', default: 2 },
  ],
  treat,
});
