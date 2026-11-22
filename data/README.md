# data

The theory data behind patternbook's treatments and process library: for each of Lumenary's 214 treatments, the
maths its code runs (`theory-<section>.js`: paragraphs and equations), the fuller story (`theory-extra/`: where the
look comes from, why it looks that way, how it is made, history, uses, presets, terms, related treatments), the six
foundation pages on the tools they share (`theory.js`), and the list of treatments by section (`sections.js`).

## Credit and permission

This is **Lumenary**'s data, by **Mursal Furqan Kumbhar** (https://github.com/mursalfk/lumenary), copied on 2026-11-16
at commit `0493e555edcba40adadcff4502c573cd0bcbf5d6`. His repository had no licence file then; if one is added, it replaces this note. The rest of Lumenary (its engine and the files it needs) stays in `vendor/lumenary/`, described in its `NOTICE.md`.

## What changed when it moved here

On 2026-11-22 patternbook moved this folder from `vendor/lumenary/src/data/` to the repository root, so the theory sits
with the rest of the project rather than inside a vendored copy. The content of every file is unchanged, with one
exception: `theoryGroups.js` imports the treatment list from its new relative path
(`../vendor/lumenary/src/engine/styles/index.js`). Each file's first-line comment still names its old path, as he wrote
it. Three readers were repointed: his `scripts/check-theory.mjs` and `scripts/catalogue.mjs` in `vendor/lumenary/`, and
patternbook's `treatments/lumenary/build.mjs`, `treatments/lumenary/catalog.mjs` and `tools/process_models.mjs`.

## How patternbook uses it

- `tools/process_models.mjs` converts every entry into a credited model in `processes/models/lumenary/`, filed under
  the physical process it imitates (C-017), with the primitives its equations apply (C-018).
- `treatments/lumenary/catalog.mjs` and `build.mjs` read `sections.js` for the studio and the agent catalogue.
- `vendor/lumenary/scripts/check-theory.mjs` checks the data against the treatments:
  `node vendor/lumenary/scripts/check-theory.mjs`.
