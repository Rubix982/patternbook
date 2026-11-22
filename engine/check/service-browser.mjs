// engine/check/service-browser.mjs
// C-029's check, in a browser: does the service give the same pixels as the studio for every still style that came
// from Lumenary, and do patternbook's nine give the same pixels in the browser as in Node?
//   PLAYWRIGHT=<path to the playwright package> node engine/check/service-browser.mjs [--out runs/c029/browser.json]
// It opens engine/engine.js in headless Chromium from disk; nothing is fetched.
import { createRequire } from 'node:module';
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createService } from '../service.js';
import { OWN, slugify } from '../sections.js';
import { decodePng } from '../png.js';

const here = dirname(fileURLToPath(import.meta.url));
const { chromium } = process.env.PLAYWRIGHT ? createRequire(process.env.PLAYWRIGHT + '/')('playwright') : await import('playwright');
const sum = (d) => { let h = 0; for (let i = 0; i < d.length; i += 7) h = (h * 31 + d[i]) >>> 0; return h; };
const page = join(here, '..', '..', 'runs', 'c029', 'browser-check.html');
mkdirSync(dirname(page), { recursive: true });
writeFileSync(page, '<!doctype html><meta charset="utf-8"><body><script src="../../engine/engine.js"></script></body>');
// patternbook's nine in Node, on one picture, for comparison
const pic = decodePng(readFileSync(join(here, 'pictures', 'portrait.png')));
const ids = OWN.items.map(slugify);
const svc = createService(await Promise.all(ids.map(async (id) => (await import(pathToFileURL(join(here, '..', 'styles', `${id}.js`)).href)).default)));
const node = Object.fromEntries(ids.map((id) => [id, sum(svc.treat(id, pic, {}, { maxSide: 300 }).image.data)]));

const browser = await chromium.launch(), tab = await browser.newPage(), errors = [];
tab.on('pageerror', (e) => errors.push(String(e).slice(0, 120)));
await tab.goto(pathToFileURL(page).href);
const res = await tab.evaluate(({ picData, w, h, ids }) => {
  const E = window.PatternbookEngine, sum = (d) => { let x = 0; for (let i = 0; i < d.length; i += 7) x = (x * 31 + d[i]) >>> 0; return x; };
  const src = E.studio.sample(240, 300), img = src.getContext('2d').getImageData(0, 0, src.width, src.height);
  const out = { same: 0, differ: [], errors: [], own: {} };
  for (const s of E.service.list()) {
    if (s.kind !== 'still' || !s.section || s.section.letter === 'P') continue;
    try {
      const a = E.studio.render(s.id, src, {}), ad = a.getContext('2d').getImageData(0, 0, a.width, a.height).data;
      const b = E.service.treat(s.id, { width: img.width, height: img.height, data: img.data }, {}).image;
      if (a.width === b.width && a.height === b.height && sum(ad) === sum(b.data)) out.same++; else out.differ.push(s.id);
    } catch (e) { out.errors.push(s.id + ': ' + String(e).slice(0, 80)); }
  }
  const p = { width: w, height: h, data: new Uint8ClampedArray(picData) };
  for (const id of ids) out.own[id] = sum(E.service.treat(id, p, {}, { maxSide: 300 }).image.data);
  // the nine also render through the studio, as stills on the page
  out.studio = ids.map((id) => { try { const c = E.studio.render(id, src, {}); return c.width > 0; } catch (e) { return false; } });
  return out;
}, { picData: Array.from(pic.data), w: pic.width, h: pic.height, ids });
await browser.close();
const ownSame = ids.filter((id) => res.own[id] === node[id]);
console.log(`Lumenary's still styles: ${res.same} give the studio's pixels through the service, ${res.differ.length} differ${res.differ.length ? ' (' + res.differ.join(', ') + ')' : ''}, ${res.errors.length} errors${res.errors.length ? ': ' + res.errors.join('; ') : ''}`);
console.log(`patternbook's nine: ${ownSame.length} of ${ids.length} give the same pixels in the browser as in Node; ${res.studio.filter(Boolean).length} of ${ids.length} render in the studio; page errors: ${errors.length}`);
const outPath = process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : null;
if (outPath) writeFileSync(outPath, JSON.stringify({ lumenaryStills: res.same, differ: res.differ, errors: res.errors, ownSameAsNode: ownSame, studioRenders: res.studio, pageErrors: errors }, null, 1) + '\n');
process.exitCode = res.differ.length || res.errors.length || ownSame.length < ids.length ? 1 : 0;
