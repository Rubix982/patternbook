// service/check.mjs
// C-030's check: a client speaking MCP over stdio starts the server and judges it from its answers alone.
//   node service/check.mjs [--out runs/c030/check.json]
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { decodePng } from '../engine/png.js';
import { gauss } from '../engine/core/glaze.js';

const here = dirname(fileURLToPath(import.meta.url)), tmp = mkdtempSync(join(tmpdir(), 'pb-mcp-'));
// a scene a client might draw for a post: dusk, a moon, a tree, a figure at a lit window
export const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 770">
 <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d2b55"/><stop offset="0.65" stop-color="#c8735a"/><stop offset="1" stop-color="#f1c27d"/></linearGradient></defs>
 <rect width="1100" height="770" fill="url(#sky)"/>
 <circle cx="820" cy="190" r="86" fill="#fbf2d6"/>
 <path d="M0 600 Q 300 520 560 590 T 1100 560 L 1100 770 L 0 770 Z" fill="#2c2433"/>
 <rect x="560" y="380" width="300" height="250" fill="#3b2f3f"/><polygon points="540,385 710,280 880,385" fill="#4a3346"/>
 <rect x="620" y="440" width="80" height="90" fill="#ffd98a"/><rect x="760" y="520" width="56" height="110" fill="#241b26"/>
 <path d="M220 640 C 210 520 240 430 230 330 M230 420 C 170 380 140 330 120 290 M232 380 C 290 330 320 300 360 250" stroke="#17121a" stroke-width="22" fill="none" stroke-linecap="round"/>
 <circle cx="180" cy="270" r="90" fill="#17121a"/><circle cx="300" cy="230" r="80" fill="#17121a"/><circle cx="240" cy="190" r="70" fill="#17121a"/>
 <circle cx="470" cy="560" r="20" fill="#17121a"/><path d="M450 580 Q 470 640 455 700 L 485 700 Q 492 640 490 580 Z" fill="#17121a"/>
</svg>`;

const client = new Client({ name: 'patternbook-check', version: '1.0.0' });
await client.connect(new StdioClientTransport({ command: process.execPath, args: [join(here, 'mcp.mjs')], cwd: tmp, env: { ...process.env, PATTERNBOOK_OUT: join(tmp, 'out') }, stderr: 'ignore' }));
const call = async (name, args) => { const t0 = Date.now(); const r = await client.callTool({ name, arguments: args }); return { ...r, ms: Date.now() - t0, data: r.content.find((c) => c.type === 'text') ? (() => { try { return JSON.parse(r.content.find((c) => c.type === 'text').text); } catch (e) { return r.content.find((c) => c.type === 'text').text; } })() : null }; };
const png = (path) => decodePng(readFileSync(path));
const thumb = async (handle, w, h, name) => { const p = join(tmp, `${name}.png`); await call('save', { handle, out_path: p, width: w, height: h, format: 'png' }); return png(p); };
const madiff = (a, b) => { let s = 0; for (let i = 0; i < a.data.length; i += 4) s += Math.abs(a.data[i] - b.data[i]) + Math.abs(a.data[i + 1] - b.data[i + 1]) + Math.abs(a.data[i + 2] - b.data[i + 2]); return s / (a.width * a.height * 3 * 255); };
const median = (xs) => { const v = [...xs].sort((a, b) => a - b); return v[Math.floor((v.length - 1) / 2)]; };
const lumBlur = (im) => { const L = new Float64Array(im.width * im.height); for (let p = 0; p < L.length; p++) L[p] = 0.2126 * im.data[p * 4] + 0.7152 * im.data[p * 4 + 1] + 0.0722 * im.data[p * 4 + 2]; return gauss(L, im.width, im.height, 0.02 * Math.max(im.width, im.height)); };
const pearson = (a, b) => { let ma = 0, mb = 0; for (let i = 0; i < a.length; i++) { ma += a[i]; mb += b[i]; } ma /= a.length; mb /= b.length; let s = 0, sa = 0, sb = 0; for (let i = 0; i < a.length; i++) { const u = a[i] - ma, v = b[i] - mb; s += u * v; sa += u * u; sb += v * v; } return s / Math.sqrt(sa * sb); };
const R = {};

// contract
const { tools } = await client.listTools();
R.tools = tools.map((t) => ({ name: t.name, hasSchema: !!(t.inputSchema && t.inputSchema.type === 'object') }));
const valid = {
  find_styles: await call('find_styles', { query: 'mirror embroidery from Sindh' }),
  describe_style: await call('describe_style', { id: 'kantha' }),
  search_knowledge: await call('search_knowledge', { query: 'ajrak indigo madder resist' }),
  render: await call('render', { source: { svg: SCENE }, style: 'kantha', preset: 'cover', out_path: join(tmp, 'r1.png'), format: 'png' }),
  chain: await call('chain', { source: { svg: SCENE }, steps: [{ style: 'kashi-tile' }, { style: 'jali-light' }], preset: 'cover', out_path: join(tmp, 'chain.png') }),
};
valid.save = await call('save', { handle: valid.render.data.handle, out_path: join(tmp, 'saved.webp') });
const invalid = {
  noSource: await call('render', { source: {}, style: 'kantha' }),
  unknownStyle: await call('render', { source: { svg: SCENE }, style: 'nonesuch' }),
  badSize: await call('render', { source: { svg: SCENE }, style: 'kantha', preset: 'enormous' }),
  badSvg: await call('render', { source: { svg: '<svg><rect/></svg>' }, style: 'kantha' }),
};
const after = await call('find_styles', { query: 'woodcut' });
R.contract = { valid: Object.fromEntries(Object.entries(valid).map(([k, v]) => [k, !v.isError])), invalid: Object.fromEntries(Object.entries(invalid).map(([k, v]) => [k, { isError: !!v.isError, message: String(v.data).slice(0, 120) }])), stillAnswers: !after.isError };

// difference and likeness: an explore of 8 against 8 seeds of one style
const ex = await call('explore', { source: { svg: SCENE }, n: 8, seed: 3, preset: 'cover' });
mkdirSync(join(here, '..', 'runs', 'c030'), { recursive: true });
writeFileSync(join(here, '..', 'runs', 'c030', 'explore-sheet.png'), Buffer.from(ex.content.find((c) => c.type === 'image').data, 'base64'));
const cands = ex.data, src = await call('render', { source: { svg: SCENE }, style: 'source', preset: 'cover', out_path: join(tmp, 'src.png'), format: 'png' });
const srcT = await thumb(src.data.handle, 220, 154, 'src-t'), srcL = lumBlur(srcT);
const small = [], like = [];
for (const [i, c] of cands.entries()) { small.push(await thumb(c.handle, 64, 64, `c${i}`)); like.push(+pearson(lumBlur(await thumb(c.handle, 220, 154, `c${i}-t`)), srcL).toFixed(3)); }
const ctl = [];
for (let s = 1; s <= 8; s++) { const r = await call('render', { source: { svg: SCENE }, style: 'kantha', seed: s, preset: 'cover', out_path: join(tmp, `k${s}.png`), format: 'png' }); ctl.push(await thumb(r.data.handle, 64, 64, `k${s}`)); }
const pairs = (xs) => { const d = []; for (let i = 0; i < xs.length; i++) for (let j = i + 1; j < xs.length; j++) d.push(madiff(xs[i], xs[j])); return d; };
R.difference = { styles: cands.map((c) => c.style), sections: [...new Set(cands.map((c) => c.section))], explore: +median(pairs(small)).toFixed(4), seedsOfOne: +median(pairs(ctl)).toFixed(4) };
R.likeness = { perCandidate: like, median: median(like) };

// sizes
R.sizes = {};
for (const p of ['cover', 'square', 'portrait', 'story', 'card', 'banner']) { const f = join(tmp, `size-${p}.png`); await call('render', { source: { svg: SCENE }, style: 'source', preset: p, out_path: f, format: 'png' }); const im = png(f); R.sizes[p] = [im.width, im.height]; }
{ const f = join(tmp, 'size-story-kantha.png'); await call('render', { source: { svg: SCENE }, style: 'kantha', preset: 'story', out_path: f, format: 'png' }); const im = png(f); R.sizes['story (kantha)'] = [im.width, im.height]; }

// determinism
const a = await call('render', { source: { svg: SCENE }, style: 'ajrak-baths', preset: 'cover', out_path: join(tmp, 'd1.png'), format: 'png' });
const b = await call('render', { source: { svg: SCENE }, style: 'ajrak-baths', preset: 'cover', out_path: join(tmp, 'd2.png'), format: 'png' });
const ex2 = await call('explore', { source: { svg: SCENE }, n: 8, seed: 3, preset: 'cover' });
let exSame = ex2.data.map((c) => c.style).join() === cands.map((c) => c.style).join();
if (exSame) for (const [i, c] of ex2.data.entries()) { await call('save', { handle: c.handle, out_path: join(tmp, `e2-${i}.png`), format: 'png' }); await call('save', { handle: cands[i].handle, out_path: join(tmp, `e1-${i}.png`), format: 'png' }); if (!readFileSync(join(tmp, `e1-${i}.png`)).equals(readFileSync(join(tmp, `e2-${i}.png`)))) exSame = false; }
R.determinism = { render: readFileSync(join(tmp, 'd1.png')).equals(readFileSync(join(tmp, 'd2.png'))), explore: exSame };

// speed
R.speed = { explore8: ex.ms, renders: {} };
for (const st of ['kantha', 'shisha', 'aari', 'linocut', 'watercolour', 'phulkari']) { const r = await call('render', { source: { svg: SCENE }, style: st, preset: 'cover', out_path: join(tmp, `s-${st}.webp`) }); R.speed.renders[st] = r.isError ? 'error' : r.ms; }
await client.close();

R.checks = {
  contract: R.tools.length >= 7 && R.tools.every((t) => t.hasSchema) && Object.values(R.contract.valid).every(Boolean) && Object.values(R.contract.invalid).every((v) => v.isError && v.message.length > 10) && R.contract.stillAnswers,
  difference: new Set(R.difference.styles).size === 8 && R.difference.sections.length >= 5 && R.difference.explore >= 2 * R.difference.seedsOfOne,
  likeness: R.likeness.median >= 0.4,
  sizes: Object.entries(R.sizes).every(([k, v]) => { const p = { cover: [1100, 770], square: [1080, 1080], portrait: [1080, 1350], story: [1080, 1920], card: [1200, 630], banner: [1500, 500], 'story (kantha)': [1080, 1920] }[k]; return v[0] === p[0] && v[1] === p[1]; }),
  determinism: R.determinism.render && R.determinism.explore,
  speed: R.speed.explore8 <= 90000 && Object.values(R.speed.renders).every((v) => typeof v === 'number' && v <= 10000),
};
console.log(JSON.stringify(R, null, 1));
const out = process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : null;
if (out) { mkdirSync(dirname(out), { recursive: true }); writeFileSync(out, JSON.stringify(R, null, 1) + '\n'); }
process.exitCode = Object.values(R.checks).every(Boolean) ? 0 : 1;
