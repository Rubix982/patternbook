// engine/styles/jali-light.js
// Jali Light: the picture cut as a pierced stone screen and shown as the sunlight it lets onto the wall (C-029). Each
// cell of the lattice is opened as wide as the picture is bright there; the stone's depth narrows the light coming in
// at the sun's angle, and the wall's distance softens it. Or the screen itself, seen from inside. The process model is
// core/jali.js (C-028); the light is placed so it falls where the picture is.
import { pictureStyle } from '../picture-style.js';
import { luminance } from '../core/picture.js';
import { stretch } from '../helpers.js';
import { castLight, screenView, JALI_DEFAULTS } from '../core/jali.js';

const mod = (a, n) => ((a % n) + n) % n;
const star = (u, v, r) => { const a = Math.atan2(v, u), d = Math.hypot(u, v); return d < r * (0.64 + 0.36 * Math.abs(Math.cos(4 * a)) ** 0.7); };

export function treat(pic, p) {
  const W = pic.width, H = pic.height, k = Math.max(W, H) / 600, C = W / p.cells, cols = Math.ceil(W / C) + 2, rows = Math.ceil(H / C) + 2;
  const L = stretch(luminance(pic)), tn = Math.tan((p.sunAngle * Math.PI) / 180), dist = p.view === 'light' ? p.distance * k : 0;
  const sx = Math.cos((p.azimuth * Math.PI) / 180), sy = Math.sin((p.azimuth * Math.PI) / 180), land = dist * tn;
  // each cell's opening, from the picture's tone where that cell's light will land (on the screen itself, for the view)
  const F = new Float32Array(cols * rows);
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const x = (i - 1 + 0.5) * C - land * sx, y = (j - 1 + 0.5) * C - land * sy;
    const xi = Math.min(W - 1, Math.max(0, Math.floor(x))), yi = Math.min(H - 1, Math.max(0, Math.floor(y)));
    F[j * cols + i] = p.minOpen + (p.maxOpen - p.minOpen) * L[yi * W + xi];
  }
  const open = (x, y) => {
    const i = Math.floor(x / C) + 1, j = Math.floor(y / C) + 1;
    if (i < 0 || j < 0 || i >= cols || j >= rows) return false;
    const f = F[j * cols + i], u = mod(x, C) - C / 2, v = mod(y, C) - C / 2;
    return p.pattern === 'squares' ? Math.max(Math.abs(u), Math.abs(v)) < (C / 2) * Math.sqrt(f) : star(u, v, (C / 2) * Math.sqrt(f) * 1.18);
  };
  const o = { ...JALI_DEFAULTS, width: W, height: H, seed: p.seed, open, thickness: p.thickness * k, sunAngle: p.sunAngle, sunAzimuth: p.azimuth,
    distance: dist, viewAngle: p.view === 'screen' ? 12 : 0, viewAzimuth: p.azimuth + 180, wear: 0.8 * k, grain: 0.08, chisel: 0.14 };
  return p.view === 'screen' ? screenView(o) : castLight(o);
}

export default pictureStyle({
  id: 'jali-light',
  name: 'Jali Light',
  blurb: 'The picture cut as a pierced stone screen: each opening as wide as the picture is bright, shown as the sunlight it lets onto the wall, or as the screen itself.',
  maxSide: 900,
  params: [
    { key: 'view', label: 'Show', type: 'select', default: 'light', options: [['light', 'The light on the wall'], ['screen', 'The screen, from inside']] },
    { key: 'pattern', label: 'Openings', type: 'select', default: 'stars', options: [['stars', 'Stars'], ['squares', 'Squares']] },
    { key: 'cells', label: 'Openings across', type: 'range', min: 8, max: 120, step: 1, default: 48 },
    { key: 'minOpen', label: 'Darkest opening', type: 'range', min: 0, max: 0.4, step: 0.01, default: 0.02 },
    { key: 'maxOpen', label: 'Brightest opening', type: 'range', min: 0.3, max: 0.9, step: 0.01, default: 0.78 },
    { key: 'thickness', label: 'Stone depth', type: 'range', min: 0, max: 20, step: 0.5, default: 4 },
    { key: 'sunAngle', label: 'Sun angle', type: 'range', min: 0, max: 60, step: 1, default: 15 },
    { key: 'azimuth', label: 'Sun from', type: 'range', min: 0, max: 360, step: 5, default: 30 },
    { key: 'distance', label: 'Wall distance', type: 'range', min: 10, max: 900, step: 10, default: 120 },
    { key: 'seed', label: 'New stone', type: 'shuffle', default: 4 },
  ],
  treat,
});
