# engine

patternbook's own primitives, written where no Lumenary model covers an operation (`processes/primitives.md`,
"patternbook's own primitives").

- `core/`: the primitives, as ES modules with no dependencies: `random.js` (seeded randomness and noise),
  `weave.js` (`weave-draft`, C-019), `supplementary.js` (`supplementary-weft`, C-020), `darning.js`
  (`counted-darning`, C-021), `chain.js` (`chain-stitch`, C-022), `field.js` and `kantha.js` (`contour-rows`,
  `quilt-ripple`, C-023), `dye.js` (`dye-baths`, C-024), `mirror.js` (`mirror-inset`, C-025).
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
- **Leave room around the effect you measure.** C-024 printed a fill block flush inside its outline and shifted it
  3 px: the shifted fill ran over the outline, so the overlap changed colour and the outline clipped the fill, and
  centre to centre read 9.45 px. With 10 px of room on every side it read 3.22. The room has to be larger than the
  effect and the noise together.
- **Don't round a ray to the pixel grid.** Along a diagonal, neighbouring pixels are 1.4 px apart, so a profile sampled
  along rays reads every diagonal edge 1.4 times wider (C-024; the control read 0.73). Give each pixel its exact
  distance and bin those instead.
- **A width can't see what lives in the tail.** Dye wicking along the warp and the weft spreads with the same variance
  in every direction; only its far edge reaches further along the threads. A 10-90 % width of the edge reads it as
  slightly narrower along the threads (C-024).
- **A control has to be readable at the test's size.** C-025's control for a ring's direction was chain stitch alone;
  at a 4 px link in a 1.6 px thread it is a solid mesh of one-pixel eyes, 85 % thread, with no direction to read, so it
  read 23° from radial where at least 45° was set. Look at the control up close before trusting its number.
- **Don't ask every instance to show what an imperfection can hide.** C-025 asked every mirror to glint; the discs'
  tilt, which the same card wanted to see, moves some glints under the ring.
