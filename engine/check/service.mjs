// engine/check/service.mjs
// C-029's check, in Node: do the nine picture styles carry a picture through their crafts, and does the service
// behave the same every time, for any dial and any size?
//   node engine/check/service.mjs [--out runs/c029/check.json]
// The browser half (the service against the studio, for Lumenary's styles) is check/service-browser.mjs.
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createService } from '../service.js';
import { OWN, slugify } from '../sections.js';
import { decodePng } from '../png.js';
import { gauss } from '../core/glaze.js';

const here = dirname(fileURLToPath(import.meta.url));
const IDS = OWN.items.map(slugify);
const styles = await Promise.all(IDS.map(async (id) => (await import(pathToFileURL(join(here, '..', 'styles', `${id}.js`)).href)).default));
const svc = createService(styles);
const PICS = readdirSync(join(here, 'pictures')).filter((f) => f.endsWith('.png')).sort().map((f) => ({ name: f.replace('.png', ''), ...decodePng(readFileSync(join(here, 'pictures', f))) }));
const median = (xs) => { const v = [...xs].sort((a, b) => a - b); return v[Math.floor((v.length - 1) / 2)]; };
const same = (a, b) => a.width === b.width && a.height === b.height && a.data.length === b.data.length && a.data.every((v, i) => v === b.data[i]);

// brightness of an RGBA image, stretched (bilinear) to w x h if it is another size
function lumAt(im, w, h) {
  const L = new Float64Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const fx = Math.min(im.width - 1, ((x + 0.5) * im.width) / w - 0.5), fy = Math.min(im.height - 1, ((y + 0.5) * im.height) / h - 0.5);
    const x0 = Math.max(0, Math.floor(fx)), y0 = Math.max(0, Math.floor(fy)), x1 = Math.min(im.width - 1, x0 + 1), y1 = Math.min(im.height - 1, y0 + 1), ax = Math.max(0, fx - x0), ay = Math.max(0, fy - y0);
    const v = (xx, yy) => { const q = (yy * im.width + xx) * 4; return (0.2126 * im.data[q] + 0.7152 * im.data[q + 1] + 0.0722 * im.data[q + 2]) / 255; };
    L[y * w + x] = v(x0, y0) * (1 - ax) * (1 - ay) + v(x1, y0) * ax * (1 - ay) + v(x0, y1) * (1 - ax) * ay + v(x1, y1) * ax * ay;
  }
  return L;
}
function pearson(a, b) {
  let ma = 0, mb = 0; for (let i = 0; i < a.length; i++) { ma += a[i]; mb += b[i]; } ma /= a.length; mb /= b.length;
  let s = 0, sa = 0, sb = 0; for (let i = 0; i < a.length; i++) { const u = a[i] - ma, v = b[i] - mb; s += u * v; sa += u * u; sb += v * v; }
  return sa && sb ? s / Math.sqrt(sa * sb) : 0;
}
const blurred = (im, w, h) => gauss(lumAt(im, w, h), w, h, 0.02 * Math.max(w, h));

// a synthetic picture of any size: a gradient with a disc and a bar, so every style has edges and tones to read
function synthetic(w, h) {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const u = x / w, v = y / h, disc = (u - 0.4) ** 2 + (v - 0.5) ** 2 < 0.06, bar = Math.abs(u - 0.75) < 0.06;
    const q = (y * w + x) * 4;
    data[q] = disc ? 220 : bar ? 30 : 255 * u; data[q + 1] = disc ? 120 : bar ? 60 : 255 * v; data[q + 2] = disc ? 40 : bar ? 140 : 128; data[q + 3] = 255;
  }
  return { width: w, height: h, data };
}

const report = {};
for (const id of IDS) {
  const s = svc.describe(id), r = { likeness: [], control: [], ms: [], deterministic: true, dialErrors: [], sizes: [], batch: true, resolve: {} };
  // likeness, determinism, speed: every picture at 600 px
  const outs = [];
  for (const pic of PICS) {
    const a = svc.treat(id, pic, {}, { maxSide: 600 }), b = svc.treat(id, pic, {}, { maxSide: 600 });
    if (!same(a.image, b.image)) r.deterministic = false;
    r.ms.push(a.ms); outs.push(a.image);
    const { width: w, height: h } = a.image;
    r.likeness.push(+pearson(blurred(a.image, w, h), blurred(pic, w, h)).toFixed(3));
  }
  for (let i = 0; i < PICS.length; i++) for (let j = 0; j < PICS.length; j++) if (i !== j) {
    const { width: w, height: h } = outs[i];
    r.control.push(+pearson(blurred(outs[i], w, h), blurred(PICS[j], w, h)).toFixed(3));
  }
  // every dial at its minimum, maximum and default (each option of a choice), on one picture at 300 px
  const small = PICS.find((p) => p.name === 'portrait');
  for (const p of s.params) {
    const values = p.type === 'range' ? [p.min, p.max, p.default] : p.type === 'select' ? p.options.map((o) => (Array.isArray(o) ? o[0] : o))
      : p.type === 'toggle' ? [true, false] : p.type === 'shuffle' ? [p.default, p.default + 1] : p.type === 'color' ? [p.default, '#000000'] : [p.default];
    for (const v of values) {
      try { const o = svc.treat(id, small, { [p.key]: v }, { maxSide: 300 }); if (!(o.image.width > 0)) throw new Error('empty'); }
      catch (e) { r.dialErrors.push(`${p.key}=${v}: ${String(e.message || e).slice(0, 80)}`); }
    }
  }
  // unknown, out of range, unreadable
  const rng = s.params.find((p) => p.type === 'range');
  const a = svc.resolve(id, { bogus: 1, [rng.key]: rng.max + 1000 }), b = svc.resolve(id, { [rng.key]: 'abc' });
  r.resolve = { unknownListed: a.unknown.includes('bogus'), clampedListed: a.clamped.includes(rng.key) && a.params[rng.key] === rng.max,
    invalidListed: b.invalid.includes(rng.key) && b.params[rng.key] === rng.default };
  // sizes
  for (const [w, h] of [[40, 40], [1200, 300], [900, 1600]]) {
    try {
      const o = svc.treat(id, synthetic(w, h), {}).image, long = Math.min(Math.max(w, h), s.maxSide);
      const ok = Math.max(o.width, o.height) === long && Math.abs(o.height - Math.round((o.width * h) / w)) <= 1 && Math.abs(o.width - Math.round((o.height * w) / h)) <= 1;
      r.sizes.push({ in: [w, h], out: [o.width, o.height], ok });
    } catch (e) { r.sizes.push({ in: [w, h], error: String(e.message || e).slice(0, 80), ok: false }); }
  }
  // a batch: one output per image, in order, each the same as alone
  const three = PICS.slice(0, 3), many = svc.treatMany(id, three, {}, { maxSide: 300 });
  r.batch = many.length === 3 && many.every((m, i) => same(m.image, svc.treat(id, three[i], {}, { maxSide: 300 }).image));
  r.summary = { likeness: median(r.likeness), control: median(r.control), ms: median(r.ms) };
  r.checks = {
    likeness: r.summary.likeness >= 0.5 && r.summary.control <= 0.2,
    determinism: r.deterministic,
    dials: r.dialErrors.length === 0 && r.resolve.unknownListed && r.resolve.clampedListed && r.resolve.invalidListed,
    sizes: r.sizes.every((x) => x.ok) && r.batch,
    speed: r.summary.ms <= 3000,
  };
  report[id] = r;
  console.log(`${id.padEnd(18)} likeness ${r.summary.likeness} (per picture ${r.likeness.join(' ')}; another picture ${r.summary.control})  ${r.summary.ms} ms  ` +
    `same twice ${r.deterministic}  dial errors ${r.dialErrors.length}  sizes ${r.sizes.map((x) => (x.out ? x.out.join('x') : 'ERR')).join(' ')}  batch ${r.batch}  -> ` +
    Object.entries(r.checks).map(([k, v]) => `${k} ${v ? 'ok' : 'NO'}`).join(', '));
  for (const e of r.dialErrors) console.log('   dial error:', e);
}
// how alike the test pictures are to each other, for reading the control
const base = [];
for (let i = 0; i < PICS.length; i++) for (let j = 0; j < PICS.length; j++) if (i !== j) { const w = PICS[i].width, h = PICS[i].height; base.push(pearson(blurred(PICS[i], w, h), blurred(PICS[j], w, h))); }
console.log(`(the pictures themselves, one against another: median r ${median(base).toFixed(3)})`);
const out = process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : null;
if (out) { mkdirSync(dirname(out), { recursive: true }); writeFileSync(out, JSON.stringify({ pictures: PICS.map((p) => p.name), baseline: +median(base).toFixed(3), styles: report }, null, 1) + '\n'); }
process.exitCode = Object.values(report).every((r) => Object.values(r.checks).every(Boolean)) ? 0 : 1;
