// service/knowledge.mjs
// What the service knows, searchable by words: the atlas (atlas/*.md), the process pages and primitives
// (processes/*.md), each style's model (processes/models/*.json: why it looks as it does, how it is made, history),
// and the engine's own notes (engine/README.md). Split at headings into passages and ranked by the words they share
// with a query (BM25), so a client can ground a choice of craft in what is written about it.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const STOP = new Set('a an and are as at be by for from has have in is it its of on or that the this to was were with which who what when how why not no but into than then there their they them these those also only can will would may each one two'.split(' '));
const words = (t) => (t.toLowerCase().match(/[a-zÀ-ɏ][a-zÀ-ɏ'-]+/g) || []).map((w) => w.replace(/'s$/, '')).filter((w) => w.length > 2 && !STOP.has(w));

function passagesOf(file, text) {
  const out = [], lines = text.split('\n');
  let head = relative(root, file), buf = [];
  const flush = () => { const t = buf.join('\n').trim(); if (t.length > 40) out.push({ file: relative(root, file), heading: head, text: t }); buf = []; };
  for (const l of lines) { const m = l.match(/^#{1,4}\s+(.*)/); if (m) { flush(); head = m[1].trim(); } else buf.push(l); }
  flush();
  return out;
}

export function buildIndex() {
  const docs = [];
  for (const dir of ['atlas', 'processes']) {
    const d = join(root, dir);
    if (!existsSync(d)) continue;
    for (const f of readdirSync(d).filter((f) => f.endsWith('.md'))) docs.push(...passagesOf(join(d, f), readFileSync(join(d, f), 'utf8')));
  }
  docs.push(...passagesOf(join(root, 'engine', 'README.md'), readFileSync(join(root, 'engine', 'README.md'), 'utf8')));
  const models = {};
  const md = join(root, 'processes', 'models');
  for (const f of readdirSync(md).filter((f) => f.endsWith('.json'))) {
    const m = JSON.parse(readFileSync(join(md, f), 'utf8')), id = f.replace('.json', '');
    const text = [m.why, ...(m.how || []), m.history, ...(m.paragraphs || []), ...(m.uses || []), ...(m.terms || []).map((t) => t.join(': ')), m.facts && Object.values(m.facts).join('. ')].filter(Boolean).join('\n');
    models[id] = { process: m.process_name, physical: m.physical, text };
    docs.push({ file: relative(root, join(md, f)), heading: `${m.name} (style ${id})`, text });
  }
  return { docs: rank(docs), models };
}

function rank(docs) {
  const N = docs.length, df = new Map(), toks = docs.map((d) => words(d.heading + ' ' + d.heading + ' ' + d.text));
  for (const t of toks) for (const w of new Set(t)) df.set(w, (df.get(w) || 0) + 1);
  const avg = toks.reduce((a, t) => a + t.length, 0) / N;
  return { docs, toks, df, N, avg };
}
export function search(index, query, limit = 6, filter = () => true) {
  const q = [...new Set(words(query))], { docs, toks, df, N, avg } = index, k1 = 1.4, b = 0.75, scored = [];
  docs.forEach((d, i) => {
    if (!filter(d)) return;
    const t = toks[i], tf = new Map(); for (const w of t) tf.set(w, (tf.get(w) || 0) + 1);
    let s = 0;
    for (const w of q) { const f = tf.get(w); if (!f) continue; const idf = Math.log(1 + (N - df.get(w) + 0.5) / (df.get(w) + 0.5)); s += idf * (f * (k1 + 1)) / (f + k1 * (1 - b + (b * t.length) / avg)); }
    if (s > 0) scored.push([s, i]);
  });
  return scored.sort((a, b) => b[0] - a[0]).slice(0, limit).map(([s, i]) => ({ score: +s.toFixed(2), ...docs[i] }));
}
export const snippet = (text, query, len = 420) => {
  const q = words(query), lower = text.toLowerCase();
  let at = 0; for (const w of q) { const i = lower.indexOf(w); if (i >= 0) { at = Math.max(0, i - 120); break; } }
  const s = text.slice(at, at + len).replace(/\s+/g, ' ').trim();
  return (at > 0 ? '... ' : '') + s + (at + len < text.length ? ' ...' : '');
};
