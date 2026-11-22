#!/usr/bin/env node
// service/mcp.mjs
// patternbook's engine as an MCP server (stdio). A client (an agent) finds crafts and what is known about them, draws a
// scene (SVG) or brings a picture, and gets back finished images at the sizes a page needs: one style at a time,
// several very different ones at once, or one craft printed through another. Card C-030; see service/README.md.
//
//   node service/mcp.mjs        (the client starts it; output files go to ./patternbook-out/ unless a path is given)
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve, extname } from 'node:path';
import { Renderer, PRESETS } from './renderer.mjs';
import { buildIndex, search, snippet } from './knowledge.mjs';

const renderer = new Renderer(), knowledge = buildIndex();
let STYLES = null;
const styles = async () => (STYLES ||= await renderer.styles());
const OUT = resolve(process.env.PATTERNBOOK_OUT || 'patternbook-out');

// ---- small helpers ----
const rng = (seed) => { let s = (seed >>> 0) || 1; return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const text = (o) => ({ type: 'text', text: typeof o === 'string' ? o : JSON.stringify(o, null, 1) });
const image = (b64) => ({ type: 'image', data: b64, mimeType: 'image/png' });
function sizeOf(preset, width, height) {
  if (width || height) {
    if (!(width >= 16 && height >= 16 && width <= 4096 && height <= 4096)) throw new Error('width and height must both be given, 16 to 4096 px.');
    return [Math.round(width), Math.round(height)];
  }
  const p = preset || 'cover';
  if (!PRESETS[p]) throw new Error(`Unknown preset "${p}". Presets: ${Object.entries(PRESETS).map(([k, v]) => `${k} (${v.join(' x ')})`).join(', ')}.`);
  return PRESETS[p];
}
async function styleOf(id) {
  if (id === 'source') return { id: 'source', name: 'The source as it is', params: [] };
  const s = (await styles()).find((x) => x.id === id);
  if (!s) throw new Error(`Unknown style "${id}". Use find_styles to look for one.`);
  return s;
}
// a style's seed dial (its 'shuffle'), set from `seed` unless the dials give it
const withSeed = (s, dials = {}, seed) => {
  const sh = (s.params || []).find((p) => p.type === 'shuffle');
  return sh && seed != null && dials[sh.key] == null ? { ...dials, [sh.key]: seed } : dials;
};
async function run(source, styleId, dials, size, seed) {
  const s = await styleOf(styleId), src = await renderer.load(source, size);
  if (s.id === 'source') return { handle: src, params: {}, unknown: [], clamped: [], invalid: [], ms: 0, style: s };
  const r = await renderer.treat(src, s.id, withSeed(s, dials, seed), Math.max(...size));
  return { ...r, style: s };
}
async function save(handle, outPath, format, quality) {
  const fmt = format || (outPath && extname(outPath).toLowerCase() === '.png' ? 'png' : 'webp');
  const path = resolve(outPath || join(OUT, `${handle}.${fmt}`));
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, await renderer.encode(handle, fmt, quality ?? 0.9));
  return path;
}
// the dials varied a little from their defaults, the same way for the same seed
function varied(s, r) {
  const d = {};
  for (const p of s.params || []) {
    if (p.type === 'range') { const span = p.max - p.min, v = p.default + (r() * 2 - 1) * 0.3 * span, st = p.step || 0; let x = Math.min(p.max, Math.max(p.min, v)); if (st) x = Math.round(x / st) * st; d[p.key] = +x.toFixed(4); }
    else if (p.type === 'select' && r() < 0.35) { const o = p.options.map((q) => (Array.isArray(q) ? q[0] : q)); d[p.key] = o[Math.floor(r() * o.length)]; }
  }
  return d;
}
// how far a small result's brightness follows the source's (Pearson r over 48 x 48 thumbnails)
function likeness(a, b) {
  const la = [], lb = []; for (let i = 0; i < a.length; i += 4) { la.push(0.2126 * a[i] + 0.7152 * a[i + 1] + 0.0722 * a[i + 2]); lb.push(0.2126 * b[i] + 0.7152 * b[i + 1] + 0.0722 * b[i + 2]); }
  const m = (x) => x.reduce((p, q) => p + q, 0) / x.length, ma = m(la), mb = m(lb);
  let s = 0, sa = 0, sb = 0; for (let i = 0; i < la.length; i++) { const u = la[i] - ma, v = lb[i] - mb; s += u * v; sa += u * u; sb += v * v; }
  return sa && sb ? s / Math.sqrt(sa * sb) : 0;
}
const dist = (a, b) => { let s = 0; for (let i = 0; i < a.length; i += 4) s += Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]); return s / (a.length * 0.75 * 255); };

const Source = z.object({
  svg: z.string().optional().describe('A scene drawn as SVG markup, with a viewBox. It is drawn to cover the output size.'),
  image_path: z.string().optional().describe('A picture file on this machine: PNG, JPEG, WebP, GIF or SVG.'),
  handle: z.string().optional().describe('An earlier result, by the handle a tool returned.'),
}).describe('What to render: give one of svg, image_path or handle.');
const Size = {
  preset: z.string().optional().describe(`Output size: ${Object.entries(PRESETS).map(([k, v]) => `${k} ${v.join('x')}`).join(', ')}. Default cover.`),
  width: z.number().optional().describe('A custom width, with height, instead of a preset.'),
  height: z.number().optional(),
};
const checkSource = (s) => { if (!s || [s.svg, s.image_path, s.handle].filter(Boolean).length !== 1) throw new Error('Give exactly one of source.svg, source.image_path or source.handle.'); return s; };

const server = new McpServer({ name: 'patternbook', version: '1.0.0' }, {
  instructions: 'Images from patternbook\'s engine: 223 styles, from printmaking and painting to the subcontinent\'s crafts ' +
    '(kantha, ajrak, shisha, kashi tiles, parchin kari, jali, jamdani, phulkari, aari). Workflow: read the request; ' +
    'search_knowledge and find_styles for crafts that fit its meaning; draw a scene for it as SVG (simple shapes and ' +
    'strong tones read best through crafts) or use a picture; explore to see several very different results; render or ' +
    'chain the one you want at the size needed (cover 1100x770 for a post).',
});

server.registerTool('find_styles', {
  title: 'Find styles',
  description: 'Search the 223 styles by meaning (what they are, how the craft is made, its history), or list a section. Returns id, name, section, what it does, and where it runs.',
  inputSchema: { query: z.string().optional().describe('Words about the look, craft, mood or subject.'), section: z.string().optional().describe('A section letter (A to N, or P for patternbook\'s crafts) or id.'), limit: z.number().optional() },
}, async ({ query, section, limit }) => {
  const all = await styles(), n = Math.min(60, limit || 12);
  let list = all.filter((s) => !section || s.section.letter === section.toUpperCase() || s.section.id === section);
  if (query) {
    const hits = search(knowledge.docs, query, 400, (d) => d.file.startsWith('processes/models/') || d.file === 'engine/README.md');
    const score = new Map();
    for (const h of hits) { const id = (h.heading.match(/\(style ([a-z0-9-]+)\)/) || [])[1]; if (id && !score.has(id)) score.set(id, h.score); }
    const q = query.toLowerCase().split(/\W+/).filter((w) => w.length > 2);
    for (const s of list) { const t = `${s.name} ${s.blurb}`.toLowerCase(), k = q.filter((w) => t.includes(w)).length; if (k) score.set(s.id, (score.get(s.id) || 0) + 4 * k); }
    list = list.filter((s) => score.has(s.id)).sort((a, b) => score.get(b.id) - score.get(a.id));
  }
  return { content: [text(list.slice(0, n).map((s) => ({ id: s.id, name: s.name, section: `${s.section.letter}. ${s.section.title}`, kind: s.kind, about: s.blurb })))] };
});

server.registerTool('describe_style', {
  title: 'Describe a style',
  description: 'A style\'s dials (key, type, range or options, default) and what is written about its craft.',
  inputSchema: { id: z.string() },
}, async ({ id }) => {
  const s = await styleOf(id), m = knowledge.models[id];
  return { content: [text({ id: s.id, name: s.name, section: s.section, about: s.blurb, kind: s.kind,
    dials: (s.params || []).map((p) => ({ key: p.key, label: p.label, type: p.type, ...(p.type === 'range' ? { min: p.min, max: p.max } : {}), ...(p.type === 'select' ? { options: p.options.map((o) => (Array.isArray(o) ? o[0] : o)) } : {}), default: p.default })),
    ...(m ? { process: m.process, craft: snippet(m.text, '', 1200) } : {}) })] };
});

server.registerTool('search_knowledge', {
  title: 'Search knowledge',
  description: 'Search patternbook\'s atlas of the subcontinent\'s crafts, its process pages (how each look is made, with the maths) and its style models, for grounding a choice: what a craft is, where it comes from, what it means, its colours and motifs.',
  inputSchema: { query: z.string(), limit: z.number().optional() },
}, async ({ query, limit }) => ({ content: [text(search(knowledge.docs, query, Math.min(20, limit || 6)).map((r) => ({ file: r.file, heading: r.heading, text: snippet(r.text, query) })))] }));

server.registerTool('render', {
  title: 'Render',
  description: 'Render a source (an SVG scene, a picture file, or an earlier result) through one style at a size, save it, and return a preview and a handle for chaining. Use style "source" to see the source itself at that size.',
  inputSchema: { source: Source, style: z.string(), dials: z.record(z.string(), z.any()).optional().describe('The style\'s dials by key; see describe_style.'),
    ...Size, seed: z.number().optional().describe('Sets the style\'s seed dial, for a different hand.'),
    out_path: z.string().optional().describe('Where to save (.webp or .png). Default: ./patternbook-out/<handle>.webp'),
    format: z.string().optional().describe('webp (default) or png'), quality: z.number().optional() },
}, async ({ source, style, dials, preset, width, height, seed, out_path, format, quality }) => {
  const size = sizeOf(preset, width, height), r = await run(checkSource(source), style, dials || {}, size, seed);
  const path = await save(r.handle, out_path, format, quality);
  return { content: [text({ handle: r.handle, style: r.style.id, size: await renderer.size(r.handle), saved: path, ms: r.ms, dials: r.params,
    ...(r.unknown.length ? { unknown: r.unknown } : {}), ...(r.clamped.length ? { clamped: r.clamped } : {}), ...(r.invalid.length ? { invalid: r.invalid } : {}) }), image(await renderer.thumb(r.handle, 480))] };
});

server.registerTool('explore', {
  title: 'Explore',
  description: 'Render one source through several very different styles at once: styles are drawn from many sections, tried small, and the most different chosen, then rendered at the size asked with their dials varied a little. Returns a contact sheet and a handle per candidate (save one with save, or keep going with render or chain).',
  inputSchema: { source: Source, n: z.number().optional().describe('How many candidates, 2 to 16 (default 8).'),
    sections: z.array(z.string()).optional().describe('Only these section letters, e.g. ["K","L","M","P"] for world, Sindhi, South Asian and patternbook\'s crafts.'),
    exclude: z.array(z.string()).optional().describe('Style ids to leave out (say, ones already tried).'),
    vary_dials: z.boolean().optional().describe('Vary each style\'s dials a little from its defaults (default true).'),
    min_likeness: z.number().optional().describe('Leave out styles whose result doesn\'t carry the source: the least correlation (0 to 1) between a small trial\'s brightness and the source\'s. 0.3 keeps the scene recognisable; default 0 (any style).'),
    ...Size, seed: z.number().optional().describe('A different seed gives a different set.'), out_dir: z.string().optional().describe('Also save each candidate here.') },
}, async ({ source, n, sections, exclude, vary_dials, min_likeness, preset, width, height, seed, out_dir }) => {
  checkSource(source);
  const size = sizeOf(preset, width, height), N = Math.max(2, Math.min(16, Math.round(n || 8))), r = rng(seed ?? 1);
  const pool = (await styles()).filter((s) => s.kind === 'still' && s.section.id !== 'subject' && (!sections || sections.map((x) => x.toUpperCase()).includes(s.section.letter)) && !(exclude || []).includes(s.id));
  if (pool.length < N) throw new Error(`Only ${pool.length} styles match; ask for fewer or widen the sections.`);
  // try a spread of styles small, then pick the most different, at most two from a section
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  const trial = pool.slice(0, Math.min(pool.length, Math.max(3 * N, 24))), small = [Math.round((size[0] / Math.max(...size)) * 200), Math.round((size[1] / Math.max(...size)) * 200)];
  const src = await renderer.load(source, small), tried = [], srcPx = await renderer.pixels(src, 48, 48), floor = min_likeness || 0;
  for (const s of trial) {
    try {
      const t = await renderer.treat(src, s.id, withSeed(s, {}, seed), 200), px = await renderer.pixels(t.handle, 48, 48);
      if (floor > 0 && likeness(px, srcPx) < floor) { await renderer.call('drop', [t.handle]); continue; }
      tried.push({ s, px, h: t.handle });
    } catch (e) { /* a style that can't take this source is skipped */ }
  }
  if (tried.length < N) throw new Error(`Only ${tried.length} styles carry this source well enough at min_likeness ${floor}; lower it, widen the sections, or ask for fewer.`);
  const chosen = [], perSection = new Map();
  while (chosen.length < N && tried.length) {
    let best = -1, bd = -1;
    tried.forEach((t, i) => {
      if ((perSection.get(t.s.section.letter) || 0) >= 2) return;
      const d = chosen.length ? Math.min(...chosen.map((c) => dist(t.px, c.px))) : r();
      if (d > bd) { bd = d; best = i; }
    });
    if (best < 0) break;
    const t = tried.splice(best, 1)[0]; chosen.push(t); perSection.set(t.s.section.letter, (perSection.get(t.s.section.letter) || 0) + 1);
  }
  await renderer.call('drop', tried.map((t) => t.h).concat(chosen.map((t) => t.h), [src]));
  const out = [];
  for (const [i, { s }] of chosen.entries()) {
    const dials = vary_dials === false ? {} : varied(s, rng((seed ?? 1) * 1000 + i + 1));
    const res = await run(source, s.id, dials, size, seed);
    const item = { handle: res.handle, style: s.id, name: s.name, section: `${s.section.letter}. ${s.section.title}`, dials: res.params };
    if (out_dir) item.saved = await save(res.handle, join(out_dir, `${String(i + 1).padStart(2, '0')}-${s.id}.webp`));
    out.push(item);
  }
  const sheet = await renderer.sheet(out.map((o) => o.handle), out.map((o) => o.name), Math.min(4, N), 300);
  return { content: [text(out), image(sheet)] };
});

server.registerTool('chain', {
  title: 'Chain',
  description: 'Print a source through several styles in turn, each taking the last one\'s result (a hybrid of crafts). Saves the last; returns every step\'s handle.',
  inputSchema: { source: Source, steps: z.array(z.object({ style: z.string(), dials: z.record(z.string(), z.any()).optional() })).describe('Styles in order.'),
    ...Size, seed: z.number().optional(), out_path: z.string().optional(), format: z.string().optional() },
}, async ({ source, steps, preset, width, height, seed, out_path, format }) => {
  if (!steps || !steps.length || steps.length > 6) throw new Error('Give 1 to 6 steps.');
  const size = sizeOf(preset, width, height), done = [];
  let cur = checkSource(source);
  for (const st of steps) { const r = await run(cur, st.style, st.dials || {}, size, seed); done.push({ handle: r.handle, style: r.style.id, dials: r.params }); cur = { handle: r.handle }; }
  const last = done[done.length - 1], path = await save(last.handle, out_path, format);
  return { content: [text({ steps: done, saved: path }), image(await renderer.thumb(last.handle, 480))] };
});

server.registerTool('save', {
  title: 'Save',
  description: 'Save an earlier result (by handle) to a file, as WebP or PNG, optionally at another size.',
  inputSchema: { handle: z.string(), out_path: z.string(), format: z.string().optional(), quality: z.number().optional(), ...Size },
}, async ({ handle, out_path, format, quality, preset, width, height }) => {
  const h = preset || width ? await renderer.load({ handle }, sizeOf(preset, width, height)) : handle;
  const path = await save(h, out_path, format, quality);
  return { content: [text({ saved: path, size: await renderer.size(h) })] };
});

const transport = new StdioServerTransport();
await server.connect(transport);
const bye = async () => { await renderer.close(); process.exit(0); };
process.stdin.on('close', bye);
process.on('SIGTERM', bye);
