// tools/process_models.mjs
// Converts Lumenary's 214 treatments into patternbook's process-model format (C-017, docs/architecture.md section 7b).
//
//   node tools/process_models.mjs
//
// Reads, never writes: data/ (Lumenary's theory data, moved from vendor/lumenary/src/data on 2026-11-22) and
// vendor/lumenary/src/engine (Lumenary by Mursal Furqan Kumbhar, https://github.com/mursalfk/lumenary, used with his
// permission; see data/NOTICE.md and vendor/lumenary/NOTICE.md), and processes/models/lumenary-map.tsv (patternbook's own
// classification: which physical process each treatment models, or what it is instead).
// Writes:
//   processes/models/lumenary/<id>.json   one model per treatment: its story, steps, equations, dials, presets, credit
//   processes/<process>.md                created at "listed" if absent; only the block between the models markers is
//                                         regenerated, so hand-written sections are never overwritten
//   processes/index.md                    every process with its models, the entries that aren't physical processes,
//                                         and the counts C-017 measures
//   processes/primitives.md               (C-018) refreshes each entry's "Applied by" line from
//                                         processes/models/lumenary-equation-tags.tsv; the rest of the file is hand-written
// The models and process pages also carry the primitives their equations apply, from the same tags.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'vendor', 'lumenary', 'src');
const out = process.env.PROCESSES_OUT ? resolve(process.env.PROCESSES_OUT) : join(root, 'processes');
const imp = (p) => import(pathToFileURL(p).href);

const data = join(root, 'data');
const { SECTIONS, slugify } = await imp(join(data, 'sections.js'));
const { THEORY } = await imp(join(data, 'theory.js'));
const { EXTRA } = await imp(join(data, 'theory-extra', 'index.js'));
const styles = {};
for (const f of readdirSync(join(src, 'engine', 'styles')).filter((f) => f.endsWith('.js'))) {
  const s = (await imp(join(src, 'engine', 'styles', f))).default;
  styles[s.id] = s;
}
const notice = readFileSync(join(root, 'vendor', 'lumenary', 'NOTICE.md'), 'utf8');
const commit = (notice.match(/commit `([0-9a-f]{40})`/) || [])[1] || null;
const THEORY_PAGE = { A: '01-design', B: '02-digital', C: '03-type', D: '04-light', E: '05-physical', F: '06-craft',
  G: '07-painterly', H: '08-optical', I: '09-generative', J: '10-motion', K: '11-world', L: '12-sindhi', M: '13-southasia' };
const CREDIT = 'Lumenary by Mursal Furqan Kumbhar (https://github.com/mursalfk/lumenary), used with his permission; ' +
  'see vendor/lumenary/NOTICE.md. Converted to patternbook\'s model format by tools/process_models.mjs; his text and ' +
  'maths are unchanged.';

// patternbook's classification
const mapPath = join(out, 'models', 'lumenary-map.tsv');
const lines = readFileSync(mapPath, 'utf8').split('\n').filter((l) => l.trim());
const head = lines[0].split('\t');
const map = {};
for (const l of lines.slice(1)) {
  const c = l.split('\t');
  const r = Object.fromEntries(head.map((h, i) => [h.trim(), (c[i] || '').trim()]));
  map[r.id] = r;
}

// patternbook's tags (C-018): which primitives each equation applies, or what kind of bespoke maths it is
const tagPath = join(out, 'models', 'lumenary-equation-tags.tsv');
const tags = {};
if (existsSync(tagPath)) {
  const tl = readFileSync(tagPath, 'utf8').split('\n').filter((l) => l.trim());
  const th = tl[0].split('\t');
  for (const l of tl.slice(1)) {
    const c = l.split('\t');
    const r = Object.fromEntries(th.map((h, i) => [h.trim(), (c[i] || '').trim()]));
    (tags[r.model_id] ||= {})[Number(r.eq_index)] = {
      primitives: r.primitives ? r.primitives.split(',').map((x) => x.trim()).filter(Boolean) : [],
      bespoke: r.bespoke_kind || null,
    };
  }
}

const dial = (p) => {
  const d = { key: p.key, label: p.label, type: p.type, default: p.default };
  if (p.type === 'range') Object.assign(d, { min: p.min, max: p.max, step: p.step });
  if (p.type === 'select') d.options = (p.options || []).map((o) => (Array.isArray(o) ? o[0] : o));
  return d;
};

mkdirSync(join(out, 'models', 'lumenary'), { recursive: true });
const models = [];
const missing = [];
for (const sec of SECTIONS.filter((s) => s.enabled)) {
  for (const name of sec.items) {
    const s = styles[slugify(name)];
    if (!s) continue;
    const m = map[s.id];
    if (!m) { missing.push(s.id); continue; }
    const x = EXTRA[s.id] || {};
    const t = THEORY[s.id] || {};
    const physical = m.physical || 'no';
    const model = {
      id: `lumenary:${s.id}`,
      name: s.name,
      physical,
      process: physical === 'no' ? null : m.process_id || null,
      process_name: physical === 'no' ? null : m.process_name || null,
      class: m.family || null,
      basis: m.basis || null,
      note: m.note || null,
      lumenary: {
        section: `${sec.letter}. ${sec.title}`,
        kind: s.kind === 'still' ? 'still' : 'live',
        blurb: s.blurb || null,
        theory_page: THEORY_PAGE[sec.letter] ? `treatments/lumenary/theory/${THEORY_PAGE[sec.letter]}.md` : null,
        code: `vendor/lumenary/src/engine/styles/${s.id}.js`,
        commit,
      },
      facts: x.facts || null,
      why: x.why || null,
      how: x.how || [],
      history: x.history || null,
      uses: x.uses || [],
      terms: x.terms || [],
      related: x.related || [],
      paragraphs: t.paragraphs || [],
      primitives: [...new Set(Object.values(tags[`lumenary:${s.id}`] || {}).flatMap((q) => q.primitives))].sort(),
      equations: (t.equations || []).map((e, i) => {
        const q = (tags[`lumenary:${s.id}`] || {})[i];
        return q ? { tex: e.tex, note: e.note, primitives: q.primitives, bespoke: q.bespoke } : { tex: e.tex, note: e.note };
      }),
      dials: (s.params || []).map(dial),
      presets: x.tips || [],
      credit: CREDIT,
    };
    writeFileSync(join(out, 'models', 'lumenary', `${s.id}.json`), JSON.stringify(model, null, 1) + '\n');
    models.push(model);
  }
}

// process pages: create if absent, regenerate only the models block
const byProcess = {};
for (const m of models.filter((m) => m.process)) (byProcess[m.process] ||= []).push(m);
const START = '<!-- models:start (generated by tools/process_models.mjs; edit outside these markers) -->';
const END = '<!-- models:end -->';
const block = (pid, ms) => [START, '',
  ...ms.map((m) => `- **${m.name}** (\`${m.id}\`, ${m.physical === 'partly' ? 'a style that rests on this process' : 'models this process'}): ` +
    `${(m.why || m.lumenary.blurb || '').replace(/\s+/g, ' ').slice(0, 260)}${(m.why || '').length > 260 ? '…' : ''} ` +
    `Model: \`processes/models/lumenary/${m.id.split(':')[1]}.json\`${m.lumenary.theory_page ? `; theory: \`${m.lumenary.theory_page}\`` : ''}.`),
  '', `_Models from Lumenary by Mursal Furqan Kumbhar, credited in each model file._`, '', END].join('\n');
const primLine = (ms, cur) => {
  const had = ((cur || '').match(/^primitives: \[(.*)\]$/m) || [, ''])[1].split(',').map((x) => x.trim()).filter(Boolean);
  return `primitives: [${[...new Set([...had, ...ms.flatMap((m) => m.primitives || [])])].sort().join(', ')}]`;
};
let created = 0;
for (const [pid, ms] of Object.entries(byProcess)) {
  const f = join(out, `${pid}.md`);
  if (!existsSync(f)) {
    const fam = ms[0].class || 'other';
    writeFileSync(f, [
      '---', `id: ${pid}`, `name: ${ms[0].process_name || pid}`, `family: ${fam}`, 'materials: []', 'makes: []',
      'models:', ...ms.map((m) => `  - {by: lumenary, id: ${m.id.split(':')[1]}, relation: ${m.physical === 'partly' ? 'analogous' : 'same'}}`),
      primLine(ms), 'sources: []', 'status: listed', '---', '',
      `# ${ms[0].process_name || pid}`, '',
      'Listed by C-017 from the models filed under it. Sections 1-7 and 9 of `_template.md` (the process, its constraints, ' +
      'its imperfections, the maths, dials, variants, what it makes, sources) are not written yet.', '',
      '## 8. Models', '', block(pid, ms), '',
    ].join('\n'));
    created++;
  } else {
    let cur = readFileSync(f, 'utf8');
    cur = cur.replace(/^primitives: \[.*\]$/m, primLine(ms, cur));
    const i = cur.indexOf(START), j = cur.indexOf(END);
    writeFileSync(f, i >= 0 && j > i ? cur.slice(0, i) + block(pid, ms) + cur.slice(j + END.length) : cur);
  }
}

// primitives.md: refresh each entry's "Applied by" block (C-018)
const primPath = join(out, 'primitives.md');
let primStats = null;
if (existsSync(primPath)) {
  const use = {};
  for (const m of models) for (const [i, e] of m.equations.entries()) for (const p of e.primitives || []) {
    const u = (use[p] ||= { models: new Set(), eqs: 0, procs: new Set() });
    u.models.add(m.id.split(':')[1]); u.eqs++; if (m.process) u.procs.add(m.process);
  }
  const lines = readFileSync(primPath, 'utf8').split('\n').filter((l) => !/^<!-- applied:/.test(l));
  const outl = [];
  let cur = null;
  const flush = () => {
    if (!cur) return;
    const u = use[cur];
    while (outl.length && outl[outl.length - 1] === '') outl.pop();
    outl.push(`<!-- applied:${cur} (generated by tools/process_models.mjs) -->` + (u
      ? `**Applied by:** ${u.models.size} model${u.models.size === 1 ? '' : 's'} (${u.eqs} equation${u.eqs === 1 ? '' : 's'})` +
        `${u.models.size >= 3 ? ', shared' : ''}: ${[...u.models].sort().join(', ')}.` +
        (u.procs.size ? ` Processes: ${[...u.procs].sort().map((q) => `[${q}](${q}.md)`).join(', ')}.` : '')
      : '**Applied by:** no Lumenary model\'s equations apply it (it may be used in code, or implemented in `engine/core/`).'), '');
    cur = null;
  };
  for (const l of lines) {
    if (/^#{2,3} /.test(l)) flush();
    const h = l.match(/^### ([a-z0-9-]+)\s*$/);
    if (h) cur = h[1];
    if (!/^\*\*Applied by:\*\*/.test(l)) outl.push(l);
  }
  flush();
  writeFileSync(primPath, outl.join('\n').replace(/\n{3,}/g, '\n\n'));
  primStats = { primitives: Object.keys(use).length, shared: Object.values(use).filter((u) => u.models.size >= 3).length };
}

// the index, with C-017's counts
const n = models.length;
const phys = models.filter((m) => m.physical === 'yes').length;
const partly = models.filter((m) => m.physical === 'partly').length;
const procs = Object.keys(byProcess).length;
const dist = { 1: 0, 2: 0, '3+': 0 };
for (const ms of Object.values(byProcess)) dist[ms.length >= 3 ? '3+' : ms.length]++;
const famOf = (ms) => ms[0].class || 'other';
const notPhys = {};
for (const m of models.filter((m) => m.physical === 'no')) (notPhys[m.class || 'other'] ||= []).push(m);
const idx = ['# Process index', '',
  '_Generated by `tools/process_models.mjs`; not edited by hand. Processes and the models filed under them; then the ' +
  'entries that model no physical process. Atlas elements join this index in T-019._', '',
  `**${n} models** from Lumenary: ${phys} model a physical process, ${partly} are styles that rest on one, ` +
  `${n - phys - partly} model none. The ${phys + partly} fall into **${procs} process${procs === 1 ? '' : 'es'}** ` +
  `(${((phys + partly) / procs).toFixed(1)} models per process on average; ${dist[1]} processes with one model, ` +
  `${dist[2]} with two, ${dist['3+']} with three or more).`, '',
  '## Processes', '', '| process | family | models | status |', '|---|---|---|---|',
  ...Object.entries(byProcess).sort((a, b) => famOf(a[1]).localeCompare(famOf(b[1])) || b[1].length - a[1].length)
    .map(([pid, ms]) => `| [${ms[0].process_name || pid}](${pid}.md) | ${famOf(ms)} | ${ms.map((m) => m.id.split(':')[1]).join(', ')} | listed |`),
  '', '## Entries that model no physical process', '',
  ...Object.entries(notPhys).sort().map(([k, ms]) => `- **${k}** (${ms.length}): ${ms.map((m) => m.id.split(':')[1]).join(', ')}`),
  ''];
writeFileSync(join(out, 'index.md'), idx.join('\n'));
console.log(JSON.stringify({ models: n, physical: phys, partly, none: n - phys - partly, processes: procs, dist, created, missing, primStats }));
