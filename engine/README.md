# engine

patternbook's own primitives, written where no Lumenary model covers an operation (`processes/primitives.md`,
"patternbook's own primitives").

- `core/`: the primitives, as ES modules with no dependencies: `random.js` (seeded randomness and noise),
  `weave.js` (`weave-draft`, C-019), `supplementary.js` (`supplementary-weft`, C-020).
- `check/`: each card's read-back check, run with Node (`node engine/check/weave.mjs`), the sheets
  (`node engine/check/weave-sheet.mjs runs/c019/weave-sheet.png`), and the shared read-back code (`readback.mjs`).
- `demo/`: a page per primitive with every dial. They open straight from disk.
- `engine.js`: `core/` bundled into one plain script that sets `window.PatternbookEngine`, which is what the demo pages
  load (browsers won't load ES modules from a page opened from disk). Rebuild it after changing `core/`:
  `node engine/build.mjs`.
