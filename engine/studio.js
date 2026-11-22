// engine/studio.js
// The studio: a small API over every style in styles/, so pages and tools can run any of them
// (PatternbookEngine.studio once engine.js is loaded).
//
//   studio.list()                            every style: id, name, blurb, kind, section, params
//   studio.render(id, source, params)        a canvas with the style applied (still, or one frame of a live one)
//   studio.renderAsync(id, source, params)   the same, waiting for styles that load a model first
//   studio.animate(id, source, params, cv)   runs a live style into a canvas; returns { stop, setParams }
//   studio.applyImageData(imageData, id, p)  ImageData in, ImageData of the same size out
//   studio.sample(w, h)                      the built-in test still life, as a canvas
//
// `source` is any canvas, image or ImageBitmap.

export function bridge({ ALL, SECTIONS, slugify, fitSize, scaleCanvas, makeSample }) {
  const env = {
    makeCanvas(w, h) {
      const c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(w));
      c.height = Math.max(1, Math.round(h));
      return c;
    },
  };
  const byId = new Map(ALL.map((s) => [s.id, s]));
  const sectionOf = new Map();
  for (const sec of SECTIONS) {
    sec.items.forEach((name, i) => sectionOf.set(slugify(name), { id: sec.id, letter: sec.letter, title: sec.title, order: i }));
  }

  const style = (id) => {
    const s = byId.get(id);
    if (!s) throw new Error('Unknown style: ' + id);
    return s;
  };
  const isLive = (s) => s.kind !== 'still';

  function defaults(id) {
    const o = {};
    for (const p of style(id).params) o[p.key] = p.default;
    return o;
  }

  function list() {
    return ALL.filter((s) => sectionOf.has(s.id))
      .map((s) => ({ id: s.id, name: s.name, blurb: s.blurb, kind: isLive(s) ? 'live' : 'still',
                     section: sectionOf.get(s.id), params: s.params }))
      .sort((a, b) => a.section.letter.localeCompare(b.section.letter) || a.section.order - b.section.order);
  }

  // The working canvas a style expects: the source fitted to the style's own maximum size.
  function prepare(s, source) {
    const sw = source.width || source.naturalWidth, sh = source.height || source.naturalHeight;
    const { w, h } = fitSize(sw, sh, s.maxSide || 1100);
    const work = scaleCanvas(env, source, w, h);
    return { work, W: w, H: h };
  }

  function makeRenderer(id, source, params) {
    const s = style(id), { work, W, H } = prepare(s, source);
    const out = env.makeCanvas(W, H), ctx = out.getContext('2d', { willReadFrequently: true });
    const r = s.create(env);
    r.setSource(work, W, H);
    r.setParams(Object.assign(defaults(id), params || {}));
    return { s, r, out, ctx, W, H };
  }

  const POINTER = { x: 0.5, y: 0.5, down: false, inside: false };

  // A still is drawn once. A live treatment is run for `frames` frames at 30 fps from t = 0, and the last one kept.
  function render(id, source, params, opts) {
    const o = opts || {}, { s, r, out, ctx } = makeRenderer(id, source, params);
    if (!isLive(s)) {
      r.draw(ctx);
    } else {
      const frames = Math.max(1, o.frames || 45);
      for (let k = 0; k < frames; k++) r.draw(ctx, k / 30, k ? 1 / 30 : 0, POINTER);
    }
    if (r.dispose) r.dispose();
    return out;
  }

  // For treatments that fetch something (the subject-aware pair load a model) and ask for a redraw when ready.
  function renderAsync(id, source, params, opts) {
    const o = opts || {}, wait = o.wait == null ? 30000 : o.wait;
    const { s, r, out, ctx } = makeRenderer(id, source, params);
    return new Promise((resolve) => {
      let done = false;
      const finish = () => { if (!done) { done = true; if (r.dispose) r.dispose(); resolve(out); } };
      r.requestRedraw = () => { (isLive(s) ? r.draw(ctx, 0, 0, POINTER) : r.draw(ctx)); finish(); };
      isLive(s) ? r.draw(ctx, 0, 0, POINTER) : r.draw(ctx);
      setTimeout(finish, s.section === 'subject' || (sectionOf.get(id) || {}).id === 'subject' ? wait : 0);
    });
  }

  function animate(id, source, params, canvas) {
    const { s, r, out, ctx, W, H } = makeRenderer(id, source, params);
    canvas.width = W; canvas.height = H;
    const target = canvas.getContext('2d');
    let raf = 0, t0 = performance.now(), last = t0, running = true, dirty = true;
    const ptr = Object.assign({}, POINTER);
    r.requestRedraw = () => { dirty = true; };
    const move = (e) => {
      const b = canvas.getBoundingClientRect();
      ptr.x = (e.clientX - b.left) / b.width; ptr.y = (e.clientY - b.top) / b.height; ptr.inside = true;
    };
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerleave', () => { ptr.inside = false; });
    canvas.addEventListener('pointerdown', () => { ptr.down = true; });
    canvas.addEventListener('pointerup', () => { ptr.down = false; });
    const frame = (now) => {
      if (!running) return;
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      if (isLive(s)) { r.draw(ctx, (now - t0) / 1000, dt, ptr); target.drawImage(out, 0, 0); }
      else if (dirty) { r.draw(ctx); target.drawImage(out, 0, 0); dirty = false; }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return {
      stop() { running = false; cancelAnimationFrame(raf); canvas.removeEventListener('pointermove', move); if (r.dispose) r.dispose(); },
      setParams(p) { r.setParams(Object.assign(defaults(id), p || {})); dirty = true; },
      size: { W, H },
    };
  }

  // ImageData in, ImageData of the same size out (the treatment runs at its own working size and is scaled back).
  function applyImageData(img, id, params, opts) {
    const src = env.makeCanvas(img.width, img.height);
    src.getContext('2d').putImageData(img, 0, 0);
    const res = render(id, src, params, opts);
    const back = env.makeCanvas(img.width, img.height), bx = back.getContext('2d', { willReadFrequently: true });
    bx.imageSmoothingQuality = 'high';
    bx.drawImage(res, 0, 0, img.width, img.height);
    return bx.getImageData(0, 0, img.width, img.height);
  }

  return {
    list, defaults, render, renderAsync, animate, applyImageData,
    sample: (w, h) => makeSample(env, w || 800, h || 1000),
    count: () => list().length,
    credit: 'Sections A to N: Lumenary by Mursal Furqan Kumbhar, https://github.com/mursalfk/lumenary (see engine/NOTICE.md); P: patternbook',
  };
}
