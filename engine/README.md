# engine

patternbook's own primitives, written where no Lumenary model covers an operation (`processes/primitives.md`,
"patternbook's own primitives").

- `core/`: the primitives, as ES modules with no dependencies: `random.js` (seeded randomness and noise),
  `weave.js` (`weave-draft`, C-019), `supplementary.js` (`supplementary-weft`, C-020), `darning.js`
  (`counted-darning`, C-021), `chain.js` (`chain-stitch`, C-022), `field.js` and `kantha.js` (`contour-rows`,
  `quilt-ripple`, C-023).
- `check/`: each card's read-back check, run with Node (`node engine/check/weave.mjs`), the sheets
  (`node engine/check/weave-sheet.mjs runs/c019/weave-sheet.png`), and the shared read-back code (`readback.mjs`).
- `demo/`: a page per primitive with every dial. They open straight from disk.
- `engine.js`: `core/` bundled into one plain script that sets `window.PatternbookEngine`, which is what the demo pages
  load (browsers won't load ES modules from a page opened from disk). Rebuild it after changing `core/`:
  `node engine/build.mjs`.

## What the checks have taught

- **Count threads; don't use a ruler.** Uneven yarn adds up across a cloth: a read-back that places cells by nominal
  spacing drifts by half a thread (C-020). `readback.mjs`'s `trackBoundaries` follows the threads instead.
- **Every check needs a control that can fail.** A wrong structure, a wrong figure, a running stitch where a chain
  should be, stitches on a free grid: each card's measure was shown to reject the wrong answer before its pass counted.
- **A normalised measure needs a size floor in its control.** Autocorrelation divides out amplitude, so a profile that
  is all but flat can still read as a strong repeat (C-023). Measure the size of the effect against the control.
- **Name settings so layers can't collide.** A layer passes its options down to the weave; `width`, `gap` and `ground`
  each meant two things at some point. The weave's gap colour is `groundColour` in every layer built on it.
