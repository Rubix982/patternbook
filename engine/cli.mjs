#!/usr/bin/env node
// engine/cli.mjs
// The engine's service from the command line, for PNG files (see service.js for the contract).
//
//   node engine/cli.mjs list                                  every style, its section, and where it runs
//   node engine/cli.mjs describe <style>                      a style's dials: key, kind, range or options, default
//   node engine/cli.mjs <style> <in.png> [more.png ...] --out <file.png | folder> [--max <px>] [key=value ...]
//
// With one input, --out may be a file; with several, a folder (each output is named after its input). Dials are given
// as key=value; the dials actually used, and any that were unknown, clamped or unreadable, are printed as JSON.
// In Node only patternbook's own styles (section P) run; the rest draw on a canvas and run in a browser
// (engine/engine.js: PatternbookEngine.service).
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync, existsSync } from 'node:fs';
import { basename, dirname, extname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createService } from './service.js';
import { SECTIONS, slugify } from './sections.js';
import { decodePng, encodePng } from './png.js';

const here = dirname(fileURLToPath(import.meta.url));
const files = readdirSync(join(here, 'styles')).filter((f) => f.endsWith('.js') && f !== 'index.js').sort();
const styles = await Promise.all(files.map(async (f) => (await import(pathToFileURL(join(here, 'styles', f)).href)).default));
const sections = new Map(SECTIONS.flatMap((sec) => sec.items.map((n) => [slugify(n), `${sec.letter}. ${sec.title}`])));
const service = createService(styles, { sectionOf: (id) => sections.get(id) || null });

const [cmd, ...rest] = process.argv.slice(2);
const fail = (msg) => { console.error(msg); process.exit(1); };
if (!cmd || cmd === 'help' || cmd === '--help') { console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').filter((l) => l.startsWith('//')).slice(1).map((l) => l.slice(3)).join('\n')); process.exit(0); }
if (cmd === 'list') {
  for (const s of service.list()) if (s.section) console.log(`${s.id.padEnd(28)} ${String(s.section).padEnd(34)} ${s.runs.join(', ')}`);
  process.exit(0);
}
if (cmd === 'describe') {
  let d; try { d = service.describe(rest[0]); } catch (e) { fail(e.message); }
  console.log(`${d.id}: ${d.name}. ${d.blurb}\nruns in: ${d.runs.join(', ')}; works at up to ${d.maxSide} px on the long side\n`);
  for (const p of d.params) console.log(`  ${p.key.padEnd(14)} ${p.type.padEnd(8)} ${p.type === 'range' ? `${p.min} to ${p.max}` : p.type === 'select' ? p.options.map((o) => (Array.isArray(o) ? o[0] : o)).join(' | ') : ''}  default ${JSON.stringify(p.default)}  (${p.label})`);
  process.exit(0);
}
// treat
const ins = [], given = {};
let out = null, max = null;
for (let i = 0; i < rest.length; i++) {
  const a = rest[i];
  if (a === '--out') out = rest[++i];
  else if (a === '--max') max = Number(rest[++i]);
  else if (a.includes('=')) { const [k, ...v] = a.split('='); given[k] = v.join('='); }
  else ins.push(a);
}
if (!ins.length || !out) fail('usage: node engine/cli.mjs <style> <in.png> [more.png ...] --out <file.png | folder> [--max <px>] [key=value ...]');
const images = ins.map((f) => { if (extname(f).toLowerCase() !== '.png') fail(`${f}: only PNG files are read here (convert it, or use the browser).`); return decodePng(readFileSync(f)); });
const toFolder = ins.length > 1 || (existsSync(out) && statSync(out).isDirectory()) || !out.toLowerCase().endsWith('.png');
if (toFolder) mkdirSync(out, { recursive: true });
let results;
try { results = service.treatMany(cmd, images, given, max ? { maxSide: max } : {}); } catch (e) { fail(e.message); }
results.forEach((r, i) => {
  const path = toFolder ? join(out, `${basename(ins[i], extname(ins[i]))}-${cmd}.png`) : out;
  writeFileSync(path, encodePng(r.image));
  console.log(JSON.stringify({ in: ins[i], out: path, size: [r.image.width, r.image.height], ms: r.ms, params: r.params,
    ...(r.unknown.length ? { unknown: r.unknown } : {}), ...(r.clamped.length ? { clamped: r.clamped } : {}), ...(r.invalid.length ? { invalid: r.invalid } : {}) }));
});
