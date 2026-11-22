// engine/service.js
// The engine as a service: one contract for every style. Images and dials in, images out.
//
//   const service = createService(styles, { canvasRender })
//   service.list()                                every style: id, name, blurb, kind, section, dials, where it runs
//   service.resolve(id, params)                   the dials it would use: { params, unknown, clamped, invalid }
//   service.treat(id, image, params, options)     one image in, one out: { image, params, unknown, clamped, invalid, ms }
//   service.treatMany(id, images, params, opts)   several images, the same dials, one output each, in order
//
// An image is { width, height, data } with data RGBA bytes (ImageData has this shape). options.maxSide caps the long
// side the style works at (default: the style's own limit); the output is that size. Dials are checked against the
// style's own list: unknown names are listed and not used, values out of range are clamped and listed, values that
// can't be read (a word where a number goes, an option that isn't offered) fall back to the default and are listed.
// The same image, dials and seed give the same bytes every time.
//
// Styles with `treat` (patternbook's picture styles) run anywhere. The others draw on a canvas; they run where the
// caller supplies `canvasRender(id, imageData, params, opts)` (engine.js does, in a browser, through studio.js).
import { fromRGBA, toRGBA, resize, fitWithin } from './core/picture.js';

const HEX = /^#[0-9a-f]{6}$/i;

export function createService(styles, { canvasRender = null, sectionOf = () => null } = {}) {
  const byId = new Map(styles.map((s) => [s.id, s]));
  const styleOf = (id) => { const s = byId.get(id); if (!s) throw new Error(`Unknown style: ${id}`); return s; };
  const kindOf = (s) => (s.kind === 'still' ? 'still' : 'live');

  function describe(s) {
    return { id: s.id, name: s.name, blurb: s.blurb, kind: kindOf(s), section: sectionOf(s.id), maxSide: s.maxSide || 1100,
      runs: s.treat ? ['node', 'browser'] : ['browser'], params: (s.params || []).map((p) => ({ ...p })) };
  }

  function resolve(id, given = {}) {
    const s = styleOf(id), params = {}, unknown = [], clamped = [], invalid = [];
    const known = new Set((s.params || []).map((p) => p.key));
    for (const k of Object.keys(given || {})) if (!known.has(k)) unknown.push(k);
    for (const p of s.params || []) {
      const has = given && Object.prototype.hasOwnProperty.call(given, p.key), v = has ? given[p.key] : undefined;
      if (!has) { params[p.key] = p.default; continue; }
      if (p.type === 'range' || p.type === 'shuffle') {
        const n = typeof v === 'number' ? v : Number(v);
        if (!Number.isFinite(n)) { invalid.push(p.key); params[p.key] = p.default; continue; }
        const lo = p.min ?? -Infinity, hi = p.max ?? Infinity, c = Math.min(hi, Math.max(lo, n));
        if (c !== n) clamped.push(p.key);
        params[p.key] = p.type === 'shuffle' ? Math.round(c) : c;
      } else if (p.type === 'select') {
        const opts = (p.options || []).map((o) => (Array.isArray(o) ? o[0] : o));
        if (opts.includes(v)) params[p.key] = v; else { invalid.push(p.key); params[p.key] = p.default; }
      } else if (p.type === 'toggle') {
        params[p.key] = v === true || v === 'true' || v === 1 || v === '1';
        if (![true, false, 'true', 'false', 1, 0, '1', '0'].includes(v)) invalid.push(p.key);
      } else if (p.type === 'color') {
        if (typeof v === 'string' && HEX.test(v)) params[p.key] = v; else { invalid.push(p.key); params[p.key] = p.default; }
      } else params[p.key] = String(v);
    }
    return { params, unknown, clamped, invalid };
  }

  function treat(id, image, given = {}, options = {}) {
    const s = styleOf(id), t0 = Date.now();
    if (!image || !(image.width > 0) || !(image.height > 0) || !image.data || image.data.length !== image.width * image.height * 4)
      throw new Error('An image is { width, height, data } with data holding width x height x 4 bytes (RGBA).');
    const r = resolve(id, given), maxSide = Math.max(8, options.maxSide || s.maxSide || 1100);
    let out;
    if (s.treat) {
      const pic = resize(fromRGBA(image.width, image.height, image.data), maxSide);
      const img = s.treat(pic, r.params);
      out = { width: img.width, height: img.height, data: toRGBA(img) };
    } else {
      if (!canvasRender) throw new Error(`${id} draws on a canvas: run it in a browser (engine/engine.js), or pass canvasRender.`);
      const { width, height } = fitWithin(image.width, image.height, maxSide);
      const src = width === image.width && height === image.height ? image
        : (() => { const p = resize(fromRGBA(image.width, image.height, image.data), maxSide); return { width: p.width, height: p.height, data: toRGBA(p) }; })();
      out = canvasRender(id, src, r.params, options);
    }
    return { image: out, ...r, ms: Date.now() - t0 };
  }

  const treatMany = (id, images, given = {}, options = {}) => images.map((im) => treat(id, im, given, options));
  return { list: () => styles.map(describe), describe: (id) => describe(styleOf(id)), resolve, treat, treatMany };
}
