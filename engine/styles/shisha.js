// engine/styles/shisha.js
// Shisha: the picture in mirror work (C-029). Mirrors sit on a lattice over the cloth; each is ringed in shisha stitch
// in the colour of the picture under it, and its curved glass reflects the picture around it, shrunk, with the lamp's
// glint where its tilt puts it. The process model is core/mirror.js (C-025).
import { pictureStyle } from '../picture-style.js';
import { colourAt, tune, hex } from '../core/picture.js';
import { mirrored, lattice, MIRROR_DEFAULTS } from '../core/mirror.js';
import { DEFAULTS } from '../core/weave.js';

export function treat(pic, p) {
  const W = pic.width, H = pic.height, k = Math.max(W, H) / 600, spacing = W / p.across, r = spacing * p.size;
  const mirrors = lattice(W, H, spacing, r, -r * 0.9);
  const link = Math.max(2.5, r * 0.17), see = spacing * p.view;
  return mirrored({ ...DEFAULTS, ...MIRROR_DEFAULTS, width: W, height: H, sett: Math.max(2, Math.round(3 * k)), slub: 0.15,
    warp: [p.cloth], weft: [p.cloth], seed: p.seed, mirrors, link, loop: link * 0.65, thread: Math.max(1, r * 0.075),
    curve: p.curve, tilt: p.tilt, glint: 0.12,
    colourOf: (m) => hex(tune(colourAt(pic, mirrors[m].x, mirrors[m].y), 1.5, 1.05)),
    reflect: (m, rx, ry) => colourAt(pic, mirrors[m].x + rx * see, mirrors[m].y + ry * see) });
}

export default pictureStyle({
  id: 'shisha',
  name: 'Shisha',
  blurb: 'The picture in mirror work: mirrors on a lattice, each ringed in shisha stitch in the colour beneath it, each curved glass reflecting the picture around it.',
  maxSide: 900,
  params: [
    { key: 'across', label: 'Mirrors across', type: 'range', min: 4, max: 40, step: 1, default: 14 },
    { key: 'size', label: 'Mirror size', type: 'range', min: 0.2, max: 0.46, step: 0.01, default: 0.36 },
    { key: 'view', label: 'What each mirror sees', type: 'range', min: 0, max: 3, step: 0.05, default: 1.2 },
    { key: 'curve', label: 'Curved glass', type: 'range', min: 0, max: 1.2, step: 0.05, default: 0.5 },
    { key: 'tilt', label: 'Tilt', type: 'range', min: 0, max: 0.4, step: 0.01, default: 0.12 },
    { key: 'cloth', label: 'Cloth', type: 'color', default: '#1f2a44' },
    { key: 'seed', label: 'New hand', type: 'shuffle', default: 5 },
  ],
  treat,
});
