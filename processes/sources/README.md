# Lumenary, as received

Mursal Furqan Kumbhar's Lumenary, kept here as he wrote it: `data/` is the theory data behind its treatments, for each of Lumenary's 214 treatments, the
maths its code runs (`theory-<section>.js`: paragraphs and equations), the fuller story (`theory-extra/`: where the
look comes from, why it looks that way, how it is made, history, uses, presets, terms, related treatments), the six
foundation pages on the tools they share (`theory.js`), and the list of treatments by section (`sections.js`).

## Credit and permission

This is **Lumenary**'s data, by **Mursal Furqan Kumbhar** (https://github.com/mursalfk/lumenary), copied on 2026-11-16
at commit `0493e555edcba40adadcff4502c573cd0bcbf5d6`. His repository had no licence file then; if one is added, it replaces this note. His engine is the base of patternbook's `engine/`; everything kept of Lumenary, and where it is, is listed in `NOTICE.md` at the repository root.

## Where it has lived

On 2026-11-22 patternbook moved `data/` from Lumenary's `src/data/` to the repository root, and later the same day
into `processes/sources/` (at first under a further `lumenary/` folder, removed the same evening), beside his theory pages as captured from his site (`theory-pages/`, earlier in
`treatments/lumenary/theory/`), so all of patternbook's knowledge of how looks are made sits in `processes/`. This folder
is the upstream archive; what patternbook reads and builds on is the process pages and the models in `processes/`. The content of every file is unchanged, with one
exception: `theoryGroups.js` imports the treatment list from its new relative path
(now `../../../engine/styles/index.js`, the Vite-only file that was not kept, so that import has no target in
patternbook, as before). Each file's first-line comment still names its old path, as he wrote it. The readers were
repointed: his `scripts/check-theory.mjs` (now `engine/check/theory.mjs`), and patternbook's `engine/sections.js`,
`engine/catalog.mjs` and `tools/process_models.mjs`.

## How patternbook uses it

- `tools/process_models.mjs` converts every entry into a credited model in `processes/models/`, filed under
  the physical process it imitates (C-017), with the primitives its equations apply (C-018).
- `engine/sections.js` reads `sections.js` for the studio and the catalogue (`engine/build.mjs`, `engine/catalog.mjs`).
- `engine/check/theory.mjs` checks the data against the treatments:
  `node engine/check/theory.mjs`.
