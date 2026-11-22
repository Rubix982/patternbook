// engine/check/service-sheet.mjs: patternbook's picture styles (section P) at their defaults on every test picture,
// through the service, one row per style under the pictures themselves (C-029).
//   node engine/check/service-sheet.mjs runs/c029/sheet.png [style ids...]
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const R = join(dirname(fileURLToPath(import.meta.url)), '..') + '/';
const { decodePng, encodePng } = await import(R + 'png.js');
const { createService } = await import(R + 'service.js');
const { OWN, slugify } = await import(R + 'sections.js');
const [out = 'runs/c029/sheet.png', ...given] = process.argv.slice(2), ids = given.length ? given : OWN.items.map(slugify);
const styles = await Promise.all(ids.map(async (id) => (await import(R + `styles/${id}.js`)).default));
const svc = createService(styles);
const pics = readdirSync(R + 'check/pictures').filter((f) => f.endsWith('.png')).sort().map((f) => decodePng(readFileSync(R + 'check/pictures/' + f)));
const T = 260, rowsOut = [];
const fitInto = (im) => { // nearest-neighbour into a T x T tile on grey
  const t = new Uint8ClampedArray(T * T * 4).fill(235), s = Math.min(T / im.width, T / im.height), w = Math.round(im.width * s), h = Math.round(im.height * s), ox = (T - w) >> 1, oy = (T - h) >> 1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const sx = Math.min(im.width - 1, Math.floor(x / s)), sy = Math.min(im.height - 1, Math.floor(y / s)); for (let c = 0; c < 4; c++) t[((y + oy) * T + x + ox) * 4 + c] = im.data[(sy * im.width + sx) * 4 + c]; }
  return t; };
const tiles = [pics.map(fitInto)];
for (const id of ids) {
  const row = [];
  for (const pic of pics) { const t0 = Date.now(); const r = svc.treat(id, pic, {}, { maxSide: 600 }); row.push(fitInto(r.image)); process.stdout.write(`${id} ${r.image.width}x${r.image.height} ${Date.now() - t0}ms; `); }
  tiles.push(row); console.log();
}
const G = 6, cols = pics.length, rows = tiles.length, Wd = cols * T + (cols + 1) * G, Hd = rows * T + (rows + 1) * G, data = new Uint8ClampedArray(Wd * Hd * 4).fill(250);
tiles.forEach((row, j) => row.forEach((t, i) => { for (let y = 0; y < T; y++) data.set(t.subarray(y * T * 4, (y + 1) * T * 4), ((G + j * (T + G) + y) * Wd + G + i * (T + G)) * 4); }));
writeFileSync(out, encodePng({ width: Wd, height: Hd, data }));
console.log('wrote', out);
