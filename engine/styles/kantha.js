// engine/styles/kantha.js
// Kantha: the picture as a kantha quilt (C-029). Its tones are split into regions, as an embroiderer would draw the
// motifs; each region is filled with rows of running stitch that echo its own outline inward, in a thread of its own
// colour, closer together where the picture is darker; the stitching ripples the layered cloth. The process model is
// core/kantha.js (C-023); the plan comes from the picture (core/picture.js). Sizes are given for a 600 px picture.
import { pictureStyle } from '../picture-style.js';
import { quantize, smoothLabels, regions, boxes, tune, hex, lumOf } from '../core/picture.js';
import { cloth, STRUCTURES, DEFAULTS } from '../core/weave.js';
import { quilt, KANTHA_DEFAULTS } from '../core/kantha.js';
import { signedDistance, levelLines } from '../core/field.js';

export function treat(pic, p) {
  const W = pic.width, H = pic.height, k = Math.max(W, H) / 600;
  const { labels } = quantize(pic, p.tones, p.seed);
  const { map, list } = regions(smoothLabels(labels, W, H, 2), W, H, { minArea: Math.round((66 - 6 * p.detail) * k * k), pic });
  const bx = boxes(map, W, H, list.length), gap = p.rowGap * k, groups = [];
  for (const r of list) {
    // the embroiderer shades with the stitching: rows closer, and the thread doubled, where the picture is darker;
    // the lightest regions get only a few rows, and the cloth shows
    const L = lumOf(...r.colour), g = gap * (0.42 + 1.9 * L * L);
    const x0 = Math.max(0, bx[r.id][0] - 2), y0 = Math.max(0, bx[r.id][1] - 2), w = Math.min(W - 1, bx[r.id][2] + 2) - x0 + 1, h = Math.min(H - 1, bx[r.id][3] + 2) - y0 + 1;
    const sd = signedDistance((x, y) => map[(Math.floor(y) + y0) * W + Math.floor(x) + x0] === r.id, w, h);
    let max = 0; for (const v of sd) if (v > max) max = v;
    const rows = [];
    for (let d = g / 2; d < max - g * 0.25; d += g) for (const path of levelLines(sd, w, h, d)) rows.push(path.map(([x, y]) => [x + x0, y + y0]));
    groups.push({ colour: p.thread === 'picture' ? hex(tune(r.colour, 1.35, L > 0.8 ? 0.88 : 1)) : p.threadColour, rows, weight: 1.45 - 0.75 * L });
  }
  const img = cloth({ ...DEFAULTS, width: W, height: H, unit: STRUCTURES.plain, sett: Math.max(2, Math.round(3 * k)), slub: 0.15,
    warp: [p.cloth], weft: [p.cloth], ground: '#d9cfbb', seed: p.seed });
  return quilt(img, groups, { ...KANTHA_DEFAULTS, rowGap: gap, stitchLen: p.stitch * k, space: p.stitch * 0.6 * k,
    thread: Math.max(1, 1.6 * k), ripple: p.ripple, seed: p.seed });
}

export default pictureStyle({
  id: 'kantha',
  name: 'Kantha',
  blurb: 'The picture as a kantha quilt: its shapes filled with rows of running stitch that echo each outline inward, closer where it is darker, rippling the layered cloth.',
  maxSide: 900,
  params: [
    { key: 'tones', label: 'Thread colours', type: 'range', min: 2, max: 10, step: 1, default: 6 },
    { key: 'detail', label: 'Detail', type: 'range', min: 1, max: 10, step: 1, default: 6 },
    { key: 'rowGap', label: 'Row spacing', type: 'range', min: 3, max: 14, step: 0.5, default: 6 },
    { key: 'stitch', label: 'Stitch length', type: 'range', min: 2, max: 12, step: 0.5, default: 5 },
    { key: 'ripple', label: 'Quilting ripple', type: 'range', min: 0, max: 1.5, step: 0.05, default: 0.5 },
    { key: 'thread', label: 'Thread', type: 'select', default: 'picture', options: [['picture', "The picture's colours"], ['single', 'One colour']] },
    { key: 'threadColour', label: 'One thread colour', type: 'color', default: '#1f3a7a' },
    { key: 'cloth', label: 'Cloth', type: 'color', default: '#efe8d8' },
    { key: 'seed', label: 'New hand', type: 'shuffle', default: 7 },
  ],
  treat,
});
