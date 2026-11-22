// engine/styles/jamdani.js
// Jamdani: the picture woven into fine muslin as jamdani's extra weft (C-029). At each pattern line and warp end the
// weaver lays the extra weft on the face where the picture is dark there (an ordered pattern at thread scale stands
// for the middle tones, as a weaver's graph does), tied down every few ends; the rest is the plain ground. The process
// model is core/supplementary.js (C-020), discontinuous: no floats between figures.
import { pictureStyle } from '../picture-style.js';
import { luminance, quantize, tune, hex } from '../core/picture.js';
import { stretch } from '../helpers.js';
import { figured } from '../core/supplementary.js';
import { DEFAULTS } from '../core/weave.js';

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

export function treat(pic, p) {
  const W = pic.width, H = pic.height, L = stretch(luminance(pic)), sett = Math.max(2, W / p.ends), ratio = 2;
  const darkOnLight = p.motif === 'dark on light';
  const extra = p.thread === 'picture' ? hex(tune(quantize(pic, 4, p.seed).palette[darkOnLight ? 0 : 3], 1.25)) : p.threadColour;
  const on = (q, j) => {
    const x = (j + 0.5) * sett, y = (q * ratio + ratio / 2) * sett;
    if (x >= W || y >= H) return false;
    const t = L[Math.min(H - 1, Math.floor(y)) * W + Math.min(W - 1, Math.floor(x))], ink = darkOnLight ? 1 - t : t;
    return Math.pow(ink, p.gamma) > BAYER[(q % 4) * 4 + (j % 4)];
  };
  return figured({ ...DEFAULTS, width: W, height: H, seed: p.seed, sett, pickSett: sett, on, kind: 'discontinuous', ratio, bind: p.bind,
    supp: extra, suppScale: 1.5, warp: [p.ground], weft: [p.ground], groundColour: p.ground, slub: 0.2, sheen: p.zari ? 0.6 : 0 });
}

export default pictureStyle({
  id: 'jamdani',
  name: 'Jamdani',
  blurb: "The picture woven into fine muslin as jamdani's extra weft: laid on the face thread by thread where the picture is dark, tied down every few ends.",
  maxSide: 900,
  params: [
    { key: 'ends', label: 'Threads across', type: 'range', min: 60, max: 400, step: 5, default: 200 },
    { key: 'motif', label: 'Figure', type: 'select', default: 'dark on light', options: [['dark on light', 'Dark weft on pale muslin'], ['light on dark', 'Pale weft on dark cloth']] },
    { key: 'thread', label: 'Extra weft', type: 'select', default: 'picture', options: [['picture', "From the picture's colours"], ['single', 'One colour']] },
    { key: 'threadColour', label: 'Weft colour', type: 'color', default: '#3b2f6b' },
    { key: 'ground', label: 'Ground', type: 'color', default: '#ece5d4' },
    { key: 'gamma', label: 'Contrast', type: 'range', min: 0.4, max: 2.5, step: 0.05, default: 1 },
    { key: 'bind', label: 'Tied every', type: 'range', min: 3, max: 10, step: 1, default: 6 },
    { key: 'zari', label: 'Zari (metal thread)', type: 'toggle', default: false },
    { key: 'seed', label: 'New weaving', type: 'shuffle', default: 6 },
  ],
  treat,
});
