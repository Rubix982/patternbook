// treatments/lumenary/build.mjs: moved. The styles are in engine/styles/ and one build, engine/build.mjs, bundles them
// with the rest of the engine into engine/engine.js. This file runs that build, so the old command still works.
await import('../../engine/build.mjs');
