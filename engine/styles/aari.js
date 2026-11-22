// engine/styles/aari.js
// Aari: the picture embroidered in chain stitch with the hook, as aari and Kashmiri zalakdozi work are (C-029). The
// picture's tones are drawn as contour lines, each worked in chain stitch in the colour of its tone; the darkest
// regions are filled with chain stitch in rings that follow their outline inward, as zalakdozi fills a shape. The
// process model is core/chain.js (C-022); the rings come from core/field.js (C-023).
import { pictureStyle } from '../picture-style.js';
import { luminance, quantize, tune, hex } from '../core/picture.js';
import { stretch } from '../helpers.js';
import { gauss } from '../core/glaze.js';
import { cloth, STRUCTURES, DEFAULTS } from '../core/weave.js';
import { stitch, CHAIN_DEFAULTS } from '../core/chain.js';
import { signedDistance, levelLines } from '../core/field.js';

const lengthOf = (path) => { let s = 0; for (let i = 1; i < path.length; i++) s += Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); return s; };

export function treat(pic, p) {
  const W = pic.width, H = pic.height, k = Math.max(W, H) / 600;
  const T = stretch(Float32Array.from(gauss(luminance(pic), W, H, p.smooth * k)));
  const palette = quantize(pic, p.lines, p.seed).palette.map((c) => hex(tune(c, 1.35)));
  const img = cloth({ ...DEFAULTS, width: W, height: H, unit: STRUCTURES.plain, sett: Math.max(2, Math.round(3 * k)), slub: 0.15,
    warp: [p.cloth], weft: [p.cloth], ground: '#d6cdb8', seed: p.seed });
  const link = p.link * k, loop = link * 0.7, thread = Math.max(1, link * 0.27), common = { ...CHAIN_DEFAULTS, kind: 'chain', link, loop, thread, seed: p.seed };
  // zalakdozi: the darkest tone filled with rings
  if (p.fill) {
    const level = 0.5 / p.lines, sd = signedDistance((x, y) => T[Math.min(H - 1, Math.floor(y)) * W + Math.min(W - 1, Math.floor(x))] < level, W, H);
    const rings = [];
    for (let d = loop * 0.9; ; d += loop) { const ls = levelLines(sd, W, H, d).filter((q) => lengthOf(q) > 3 * link); if (!ls.length) break; rings.push(...ls); }
    stitch(img, rings, { ...common, colour: palette[0] });
  }
  // the contour lines, one tone at a time
  for (let i = 0; i < p.lines; i++) {
    const paths = levelLines(T, W, H, (i + 0.5) / p.lines).filter((q) => lengthOf(q) > 3 * link);
    stitch(img, paths, { ...common, colour: palette[i] });
  }
  return img;
}

export default pictureStyle({
  id: 'aari',
  name: 'Aari',
  blurb: "The picture embroidered in chain stitch with the hook: its tones drawn as contour lines in the colour of each tone, the darkest filled with rings as in Kashmiri zalakdozi.",
  maxSide: 900,
  params: [
    { key: 'lines', label: 'Tones', type: 'range', min: 2, max: 12, step: 1, default: 7 },
    { key: 'smooth', label: 'Smoothness', type: 'range', min: 0.5, max: 8, step: 0.25, default: 2.5 },
    { key: 'link', label: 'Stitch size', type: 'range', min: 3, max: 14, step: 0.5, default: 6 },
    { key: 'fill', label: 'Fill the darkest (zalakdozi)', type: 'toggle', default: true },
    { key: 'cloth', label: 'Cloth', type: 'color', default: '#efe6d2' },
    { key: 'seed', label: 'New hand', type: 'shuffle', default: 9 },
  ],
  treat,
});
