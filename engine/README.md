# engine

One engine. Its base is Lumenary's engine, by Mursal Furqan Kumbhar (https://github.com/mursalfk/lumenary, used with
his permission; see `../NOTICE.md`), its files unchanged: the styles that take a picture and render it
(`styles/`), and the code they share (`utils.js`, `helpers.js`, `culture.js`, `registry.js`, `runtime.js`,
`sample.js`, `toon.js`, `retro.js`, `history.js`, `subject/`, and the subject model in `models/`). patternbook builds
on it: process models where no style covers an operation, and styles of its own in section P.

- `styles/`: every style, picture in and treated picture out; each is `still({ id, name, blurb, params, render })`
  (see `utils.js`). Sections A to N came from Lumenary; section P is patternbook's (`sections.js` lists them).
- `core/`: patternbook's process models (`processes/primitives.md`, "patternbook's own primitives"), as ES modules
  with no dependencies: `random.js` (seeded randomness and noise), `weave.js` (`weave-draft`, C-019),
  `supplementary.js` (`supplementary-weft`, C-020), `darning.js` (`counted-darning`, C-021), `chain.js`
  (`chain-stitch`, C-022), `field.js` and `kantha.js` (`contour-rows`, `quilt-ripple`, C-023), `dye.js` (`dye-baths`,
  C-024), `mirror.js` (`mirror-inset`, C-025), `glaze.js` (`glaze-layer`, C-026), `inlay.js` (`inlay-cut`, C-027),
  `jali.js` (`thick-screen`, C-028).
- `studio.js`: the studio API over the styles (list, render, renderAsync, animate, applyImageData, sample), used by
  `../treatments/studio.html` and by pages through `treatments.js`.
- `engine.js`: the whole engine in one plain script that sets `window.PatternbookEngine` (`.weave`, `.kantha`, ... for
  `core/`; `.studio` for the styles), which is what pages load (browsers won't load ES modules from a page opened from
  disk). Rebuild it after any change: `node engine/build.mjs`. `CATALOG.md` lists every style with its dials
  (`node engine/catalog.mjs`).
- `check/`: each card's read-back check, run with Node (`node engine/check/weave.mjs`), the sheets
  (`node engine/check/weave-sheet.mjs runs/c019/weave-sheet.png`), and the shared read-back code (`readback.mjs`).
- `demo/`: a page per process model with every dial. They open straight from disk.

## How a style is written

(From Lumenary's README, sections 11 and 12, by Mursal Furqan Kumbhar, with the paths changed to patternbook's.)

- **A style** is a module in `styles/` with `id`, `name`, `blurb`, `params` and either
  - a still: `still({ ..., render(ctx, work, p, env, W, H, cache) })`, drawn once whenever the dials or the picture
    change (`still` is in `utils.js`; `helpers.pixels(work, W, H, cache)` gives the picture's pixels); or
  - an animated style: `{ kind: 'animated', create(env) }`, returning `setSource`, `setParams`,
    `draw(ctx, t, dt, pointer)` and `dispose` (and `setFrame(canvas)` if it keeps state, so video doesn't restart it).
- Dials are `range`, `select`, `toggle`, `color`, `text` or `shuffle`. Give them as counts or fractions of the width,
  never pixels, so a still looks the same at preview size and at 3x export.
- The engine never touches the page directly: canvases come from `env.makeCanvas`, which is how styles run headless.
  `runtime.js`'s `createRuntime` runs a style on a canvas; `renderThumb` renders a small frame of any style.
- Shared helpers: `toon.js` (edge-keeping smoothing, palettes, lines and highlights), `retro.js` (ordered dither,
  pixel text, sprites), `culture.js` (snapping to a few pigments, outlines, woven, wooden and carved fills, rosettes,
  stars, ribbons), `helpers.js` (`stretch` for tone, `slopes` from a height map, `cellular` noise), `subject/` (finding
  the main subject with U2-Net, cut-outs and outlines).
- Don't use `ctx.filter` (Safari's canvas ignores it): blur arrays with `boxBlur`, or draw small and scale up. Draw
  thousands of small shapes with flat fills; a gradient or a `save`/`restore` per shape is very slow without a
  graphics card.

**To add one:** copy a still style (`styles/minimalism.js` is the simplest), start the file with a comment giving its
path, give it a unique `id`, and put its `name` in the right section's `items` in `sections.js` so that
`slugify(name)` equals the `id` (patternbook's own go in section P). The build and the catalogue pick up every file
in `styles/`; run `node engine/build.mjs` and `node engine/catalog.mjs`. Write its theory on the page of the process it
renders, in `../processes/`.

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
- **A saturated pixel carries no ratio.** C-026 read a glaze's tint from the ratio of two channels, so the lighting would
  cancel; on slopes facing the lamp the red channel sat at full brightness, and half the pixels in a groove read too
  little tint. Leave out any pixel with a channel at its limit before taking a ratio.
- **Measure the reader's floor before setting a bar.** A perfectly sharp edge, sampled once per pixel and interpolated,
  reads 1.6 px wide (10-90 %). C-028 asked a penumbra of 0.9 px to widen threefold with distance; the floor swallowed the
  near one and the ratio read 1.97. Render the control at its sharpest first and set the bar above what it reads.
