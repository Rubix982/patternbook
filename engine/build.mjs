// engine/build.mjs
// Bundles patternbook's engine (engine/index.js) into one classic script, engine/engine.js, which sets
// window.PatternbookEngine. Classic scripts load from pages opened straight from disk (file://); ES modules don't.
//   node engine/build.mjs        (uses npx esbuild@0.24.0, as treatments/lumenary/build.mjs does)
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { statSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'engine.js');
execFileSync('npx', ['-y', 'esbuild@0.24.0', join(here, 'index.js'), '--bundle', '--format=iife', '--global-name=PatternbookEngine',
  '--target=es2020', `--outfile=${out}`, '--banner:js=/* patternbook engine (engine/core), bundled by engine/build.mjs; edit engine/core, not this file. */'],
  { stdio: 'inherit' });
console.log(`bundled engine/core into engine/engine.js (${Math.round(statSync(out).size / 1024)} KB)`);
