# treatments

The top layer of the two-layer model (`METHOD.md`): procedures that make a page's drawings and
photos look printed or inked, not machine-drawn. Each treatment is derived from the process
that made the look (`METHOD.md` step 2c), with the maths written out on the page of the process each one models in
`../processes/` (all of patternbook's knowledge of how looks are made sits there).

The approach, especially writing out the maths the code actually runs, is learned from
**Lumenary** by Mursal Furqan Kumbhar (lumenary-studio.vercel.app). The code and notes here are
our own.

## The studio: every style in the engine

The engine's styles (`../engine/styles/`) take a picture and render it in a style. Sections A to N are **Lumenary**'s
214, by Mursal Furqan Kumbhar, used with his permission: his engine, its files unchanged, is the base of `../engine/`
(see `../vendor/lumenary/NOTICE.md` for what was received). Section P is patternbook's own, each rendering a picture
through a process modelled in `../engine/core/`. Every style's theory, as a model filed under the process it imitates,
is in `../processes/`, and Lumenary's as received in `../processes/sources/lumenary/`.

- `studio.html` (live: https://rubix982.github.io/patternbook/treatments/studio.html): pick any style and turn its
  dials, or open the **contact sheet** to see every still style on one picture (the built-in still life, our router
  drawing, or your own file). `lumenary.html` now forwards there.
- `../engine/engine.js`: the whole engine in one script, which sets `window.PatternbookEngine`; the studio API is
  `PatternbookEngine.studio`. Rebuild with `node engine/build.mjs` (uses `npx esbuild@0.24.0`). Pages that load the old
  `lumenary/lumenary.js` still work: it now loads `engine/engine.js` and names its studio `window.Lumenary`.
- Lumenary's theory pages with every equation as TeX, and `MAP.md`, which links each treatment's theory to its code,
  are in `../processes/sources/lumenary/theory-pages/`; each process page in `../processes/` carries his models in full.
- On a page: load `../engine/engine.js` and `treatments.js`, then
  `Treatments.treatAll('svg[role=img]', { treatment: 'style:halftone', params: { angle: 45 } })` (`lumenary:halftone`
  still works).

**For agents building a page:** `runs/c014/lumenary-for-agents.md` explains how to use it, and `../engine/CATALOG.md`
lists every style with its dials (regenerate with `node engine/catalog.mjs`).
In C-014, pages built with it were the ones the judge would rather spend time on (3 of 3), but they
read as less AI-made in only 1 of 3: the pictures change and the page around them doesn't.

Checked headlessly on 2026-11-16: all 176 still and all 36 live treatments render. The two subject-aware ones
(Type Behind, Split Treatment) load a model and a runtime from a CDN, need a local web server
(`python3 -m http.server` from the repo root), and couldn't be confirmed headlessly.

## Try it

Open `demo.html` in a browser (double-click works; no server needed). Pick a treatment, turn
the dials, change the seed.

## Use it on a page

```html
<script src="treatments.js"></script>
<script>
  Treatments.treatAll('svg[role=img]', { treatment: 'press', spot: '#3f6e96' });
</script>
```

Each matching `<svg>`, `<img>` or `<canvas>` is replaced by a treated canvas of the same size,
keeping its accessible name. The canvas uses `mix-blend-mode: multiply`, so it sits on the page
the way ink sits on paper.

| Treatment | Use on | Theory |
|---|---|---|
| `press` | drawings in a two-ink style | `../processes/letterpress.md` |
| `riso` | drawings in a two-ink style (Lumenary's risograph ink model) | `../processes/risograph-printing.md` |
| `halftone` | photos | `../processes/halftone-screening.md` |
| `hatch` | photos | `../processes/pen-and-ink-drawing.md` |

Shared pieces (brightness, seeded noise, blur, edges, tone, multiply) are in
`../processes/foundations.md`.

Or treat pixels directly: `Treatments.apply(imageData, 'halftone', { screen: 6 })` returns a
new `ImageData`.

## What's rough

- Treating a large drawing takes a few hundred milliseconds at 2× scale (about 320 ms for
  1040 × 720 px), and drawings are treated one after another, so a page with many shows its
  drawings change after it loads.
- An SVG that uses a web font is drawn with a fallback font, because the font can't be loaded
  inside a standalone SVG image.
- `press` assumes the drawing uses only the two inks and their tints. A third colour gets
  forced into one of them.
- **C-012:** `press` on C-011's winning page won both looks questions against the untreated
  page, and the judge said its drawings looked filtered. It reads as printed, and also as an
  effect. Not adopted yet; see T-013 in `../threads.md`.
- Small lettering inside a drawing thickens with ink spread and gets harder to read.
- **C-013:** `riso` against `press` on the same page: equal on "less AI-made" and "printed", but `riso` read as
  the more filtered one.
