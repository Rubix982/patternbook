// runs/c033/look.mjs: three directions exact and with the hand C-033 measured (jitter 0.048, drift 0.16 lattice steps,
// the joint medians), for the writer's eye. node runs/c033/look.mjs
import { writeFileSync } from 'node:fs';
import { designJali } from '../../engine/core/jali-design.js';
import { encodePng } from '../../engine/png.js';
const D = {
  octagram: { tiling: '4.8.8', kind: 'strands', angle: 67.5, barOverOpening: 0.4, frame: 'pointed', across: 7 },
  hexagram: { tiling: '6.6.6', kind: 'strands', angle: 60, barOverOpening: 0.45, frame: 'rect', across: 9 },
  rosettes: { tiling: '3.12.12', kind: 'strands', angle: 72, barOverOpening: 0.4, frame: 'rect', across: 6 },
};
const MEASURED = { jitter: 0.048, drift: 0.16 }, EXACT = { jitter: 0, drift: 0, hand: 0, round: 0, wear: 0 };
for (const [name, b] of Object.entries(D)) for (const [tag, h] of [['exact', EXACT], ['measured', { ...EXACT, hand: 0.15, ...MEASURED }]]) {
  const d = designJali({ ...b, ...h, seed: 5 }), data = new Uint8ClampedArray(d.width * d.height * 4);
  for (let p = 0; p < d.width * d.height; p++) { const s = d.stone[p]; data[p * 4] = s ? 201 : 18; data[p * 4 + 1] = s ? 138 : 16; data[p * 4 + 2] = s ? 92 : 20; data[p * 4 + 3] = 255; }
  writeFileSync(`runs/c033/look/${name}-${tag}.png`, encodePng({ width: d.width, height: d.height, data }));
}
