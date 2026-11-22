// service/renderer.mjs
// The service's renderer: one headless Chromium page with the whole engine loaded (page.html), started on first use and
// kept for the session. Every style runs there; SVG scenes and photos (JPEG, PNG, WebP) are read there; results stay
// there under handles so they can be chained.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const PRESETS = { cover: [1100, 770], square: [1080, 1080], portrait: [1080, 1350], story: [1080, 1920], card: [1200, 630], banner: [1500, 500] };
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml' };

// the size an SVG says it is: width and height, or its viewBox
export function svgSize(svg) {
  const num = (a) => { const m = svg.match(new RegExp(`<svg[^>]*\\s${a}="([0-9.]+)(px)?"`)); return m ? Number(m[1]) : null; };
  const w = num('width'), h = num('height');
  if (w && h) return [w, h];
  const vb = svg.match(/viewBox="\s*[-0-9.]+[\s,]+[-0-9.]+[\s,]+([0-9.]+)[\s,]+([0-9.]+)\s*"/);
  if (vb) return [Number(vb[1]), Number(vb[2])];
  throw new Error('An SVG scene needs a viewBox (or width and height) so its shape is known.');
}
// give an SVG explicit width and height (from its viewBox) so the browser draws it at its own aspect
const sized = (svg, [w, h]) => svg.replace(/<svg\b([^>]*)>/, (m, attrs) => `<svg${attrs.replace(/\s(width|height)="[^"]*"/g, '')} width="${w}" height="${h}">`);

export class Renderer {
  constructor() { this.page = null; this.browser = null; }
  async start() {
    if (this.page) return;
    this.browser = await chromium.launch();
    this.page = await this.browser.newPage();
    await this.page.goto(pathToFileURL(join(here, 'page.html')).href);
    await this.page.waitForFunction(() => window.__ready === true);
  }
  async call(fn, ...args) { await this.start(); return this.page.evaluate(([f, a]) => window.Bench[f](...a), [fn, args]); }
  async styles() { return this.call('styles'); }
  // source: { svg } | { image_path } | { handle }; size: [w, h]
  async load(source, [w, h]) {
    if (source.svg) { const sz = svgSize(source.svg); return this.call('load', { svg: sized(source.svg, sz), svgSize: sz }, w, h); }
    if (source.image_path) {
      const mime = MIME[extname(source.image_path).toLowerCase()];
      if (!mime) throw new Error(`Can't read ${source.image_path}: give a PNG, JPEG, WebP, GIF or SVG file.`);
      if (mime === 'image/svg+xml') return this.load({ svg: readFileSync(source.image_path, 'utf8') }, [w, h]);
      return this.call('load', { dataUrl: `data:${mime};base64,${readFileSync(source.image_path).toString('base64')}` }, w, h);
    }
    if (source.handle) return this.call('load', { handle: source.handle }, w, h);
    throw new Error('A source is { svg }, { image_path } or { handle }.');
  }
  treat(handle, id, params, maxSide) { return this.call('treat', handle, id, params, maxSide); }
  size(handle) { return this.call('size', handle); }
  async encode(handle, format = 'webp', quality = 0.9) {
    const url = await this.call('encode', handle, format === 'png' ? 'image/png' : 'image/webp', quality);
    return Buffer.from(url.split(',')[1], 'base64');
  }
  async thumb(handle, side = 480) { return (await this.call('thumb', handle, side)).split(',')[1]; }
  async pixels(handle, w, h) { return Uint8ClampedArray.from(await this.call('pixels', handle, w, h)); }
  async sheet(handles, labels, cols = 4, cell = 300) { return (await this.call('sheet', handles, labels, cols, cell)).split(',')[1]; }
  async close() { if (this.browser) await this.browser.close(); this.browser = null; this.page = null; }
}
