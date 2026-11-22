// engine/styles/kashi-tile.js
// Kashi Tile: the picture painted and glazed as Multani blue pottery (C-029). On white slip, the darkest tones are
// painted in cobalt, the middle ones in turquoise, and every edge between them outlined in cobalt and lightly incised;
// a clear glaze over everything pools in the incisions, spreads the cobalt where it lies thick, and crazes as it cools.
// The process model is core/glaze.js (C-026).
import { pictureStyle } from '../picture-style.js';
import { luminance, smoothLabels } from '../core/picture.js';
import { stretch } from '../helpers.js';
import { glazed, gauss, GLAZE_DEFAULTS } from '../core/glaze.js';
import { distanceTo } from '../core/field.js';

export function treat(pic, p) {
  const W = pic.width, H = pic.height, N = W * H, k = Math.max(W, H) / 600;
  const L = stretch(Float32Array.from(gauss(luminance(pic), W, H, 1.5 * k)));
  const twoBlues = p.colours === 'cobalt and turquoise';
  let cls = new Int32Array(N);
  for (let i = 0; i < N; i++) cls[i] = L[i] < p.cobalt ? 0 : twoBlues && L[i] < p.turquoise ? 1 : 2;
  cls = smoothLabels(cls, W, H, 2);
  const edge = new Uint8Array(N);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x; if ((x < W - 1 && cls[i + 1] !== cls[i]) || (y < H - 1 && cls[i + W] !== cls[i])) edge[i] = 1; }
  const dEdge = distanceTo(edge, W, H), half = (p.outline * k) / 2;
  const at = (a) => (x, y) => a[Math.min(H - 1, Math.floor(y)) * W + Math.min(W - 1, Math.floor(x))];
  const fill = (c) => { const a = new Uint8Array(N); for (let i = 0; i < N; i++) a[i] = cls[i] === c && dEdge[i] > half ? 1 : 0; return at(a); };
  const line = new Float32Array(N); for (let i = 0; i < N; i++) line[i] = dEdge[i] <= half ? 1 : 0;
  const groove = new Float32Array(N); for (let i = 0; i < N; i++) groove[i] = -p.incise * Math.max(0, 1 - dEdge[i] / Math.max(0.8, half));
  return glazed({ ...GLAZE_DEFAULTS, width: W, height: H, seed: p.seed, body: at(groove),
    paint: [{ mask: fill(1), colour: '#33a9a3' }, { mask: fill(0), colour: '#2a4aa0' }, { mask: at(line), colour: '#18296a' }],
    amount: p.glaze * k, level: 6 * k, flow: p.flow, craze: p.craze, crazeCell: 26 * k, brush: 0.15 * k });
}

export default pictureStyle({
  id: 'kashi-tile',
  name: 'Kashi Tile',
  blurb: 'The picture as Multani blue pottery: cobalt and turquoise on white slip, outlined and lightly incised, under a clear glaze that pools, spreads the cobalt and crazes.',
  maxSide: 900,
  params: [
    { key: 'colours', label: 'Colours', type: 'select', default: 'cobalt and turquoise', options: [['cobalt and turquoise', 'Cobalt and turquoise'], ['cobalt', 'Cobalt only']] },
    { key: 'cobalt', label: 'Cobalt below', type: 'range', min: 0.05, max: 0.7, step: 0.01, default: 0.3 },
    { key: 'turquoise', label: 'Turquoise below', type: 'range', min: 0.2, max: 0.95, step: 0.01, default: 0.6 },
    { key: 'outline', label: 'Outline', type: 'range', min: 0, max: 6, step: 0.25, default: 2 },
    { key: 'incise', label: 'Incised outlines', type: 'range', min: 0, max: 3, step: 0.1, default: 0.8 },
    { key: 'glaze', label: 'Glaze thickness', type: 'range', min: 0.3, max: 6, step: 0.1, default: 2.2 },
    { key: 'flow', label: 'Cobalt spreading', type: 'range', min: 0, max: 1.5, step: 0.05, default: 0.55 },
    { key: 'craze', label: 'Crazing', type: 'range', min: 0, max: 1, step: 0.01, default: 0.3 },
    { key: 'seed', label: 'New firing', type: 'shuffle', default: 3 },
  ],
  treat,
});
