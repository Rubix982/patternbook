// engine/styles/phulkari-darning.js
// Phulkari Darning: the picture darned in floss silk on khaddar, as phulkari and bagh are (C-029). The cloth is
// counted into blocks of threads; each block is darned in the floss nearest the picture's colour there, its stitches
// turned across or along the picture's edges so the silk catches the light differently block to block. In a bagh every
// block is darned; in a phulkari the darkest stay bare khaddar. The process model is core/darning.js (C-021).
import { pictureStyle } from '../picture-style.js';
import { luminance, meanColour, quantize, nearest, rgbOf, tune, hex, lumOf } from '../core/picture.js';
import { darned, blocks } from '../core/darning.js';
import { DEFAULTS } from '../core/weave.js';

const PHULKARI = ['#f1e9d4', '#e8a317', '#e2621b', '#c0392b', '#a3124f', '#2e7d3a', '#2c3e7a'];

export function treat(pic, p) {
  const W = pic.width, H = pic.height, L = luminance(pic), sett = Math.max(2, W / p.threads), n = p.block;
  const floss = p.palette === 'phulkari' ? PHULKARI : quantize(pic, 7, p.seed).palette.map((c) => hex(tune(c, 1.35, 1.05)));
  const rgb = floss.map(rgbOf);
  const plan = blocks({ cellEnds: n, cellPicks: n, cell: (bx, by) => {
    const x0 = bx * n * sett, y0 = by * n * sett, x1 = x0 + n * sett, y1 = y0 + n * sett;
    if (x0 >= W || y0 >= H) return null;
    const c = meanColour(pic, x0, y0, x1, y1);
    if (p.cover === 'phulkari' && lumOf(...c) < p.bare) return null;
    // the stitches run along the picture's edges: across a horizontal edge they lie vertical, and the other way
    const xi = Math.min(W - 2, Math.max(1, Math.floor((x0 + x1) / 2))), yi = Math.min(H - 2, Math.max(1, Math.floor((y0 + y1) / 2)));
    const gx = L[yi * W + xi + 1] - L[yi * W + xi - 1], gy = L[(yi + 1) * W + xi] - L[(yi - 1) * W + xi];
    const dir = Math.abs(gx) + Math.abs(gy) < 0.02 ? ((bx + by) % 2 ? 'h' : 'v') : Math.abs(gx) > Math.abs(gy) ? 'v' : 'h';
    return { dir, colour: nearest(c, rgb) };
  } });
  return darned({ ...DEFAULTS, width: W, height: H, seed: p.seed, sett, pickSett: sett, plan, floss, float: p.float, pickup: 1,
    warp: [p.khaddar], weft: [p.khaddar], groundColour: p.khaddar, slub: 0.3, sheen: p.sheen });
}

export default pictureStyle({
  id: 'phulkari-darning',
  name: 'Phulkari Darning',
  blurb: 'The picture darned in floss silk on khaddar: blocks of counted threads, each in the floss nearest its colour, the stitches turning with the edges so the silk shines block by block.',
  maxSide: 900,
  params: [
    { key: 'threads', label: 'Threads across', type: 'range', min: 60, max: 400, step: 5, default: 200 },
    { key: 'block', label: 'Block (threads)', type: 'range', min: 3, max: 24, step: 1, default: 8 },
    { key: 'float', label: 'Stitch length (threads)', type: 'range', min: 2, max: 10, step: 1, default: 5 },
    { key: 'palette', label: 'Floss', type: 'select', default: 'picture', options: [['picture', "The picture's colours"], ['phulkari', 'Phulkari silks']] },
    { key: 'cover', label: 'Cover', type: 'select', default: 'bagh', options: [['bagh', 'All of it (bagh)'], ['phulkari', 'Darkest left bare (phulkari)']] },
    { key: 'bare', label: 'Bare below', type: 'range', min: 0, max: 0.6, step: 0.01, default: 0.18 },
    { key: 'khaddar', label: 'Khaddar', type: 'color', default: '#6e2a1f' },
    { key: 'sheen', label: 'Silk sheen', type: 'range', min: 0, max: 1, step: 0.01, default: 0.45 },
    { key: 'seed', label: 'New hand', type: 'shuffle', default: 8 },
  ],
  treat,
});
