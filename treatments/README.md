# treatments

The top layer of the two-layer model (`METHOD.md`): procedures that make a page's drawings and
photos look printed or inked, not machine-drawn. Each treatment is derived from the process
that made the look (`METHOD.md` step 2c), with the maths written out in `theory/`.

The approach, especially writing out the maths the code actually runs, is learned from
**Lumenary** by Mursal Furqan Kumbhar (lumenary-studio.vercel.app). The code and notes here are
our own.

## Lumenary, inside our tooling

All 214 of **Lumenary**'s treatments, by Mursal Furqan Kumbhar, run here too, used with his
permission. His engine and theory data, unchanged and trimmed of the website, are in `../vendor/lumenary/`
(see its `NOTICE.md` for what was kept), and `lumenary/` holds our bridge:

- `lumenary.html`: pick any of his treatments and turn its dials, or open the **contact sheet** to see every
  still treatment on one picture (Lumenary's still life, our router drawing, or your own file).
- `lumenary/lumenary.js`: his engine bundled into one script, which sets `window.Lumenary`. Rebuild with
  `node treatments/lumenary/build.mjs` (uses `npx esbuild@0.24.0`).
- `lumenary/theory/`: his theory pages with every equation as TeX, plus `MAP.md`, which links each treatment's
  theory to its code.
- On a page: load `lumenary/lumenary.js` and `treatments.js`, then
  `Treatments.treatAll('svg[role=img]', { treatment: 'lumenary:halftone', params: { angle: 45 } })`.

**For agents building a page:** `runs/c014/lumenary-for-agents.md` explains how to use it, and
`lumenary/CATALOG.md` lists all 214 treatments with their dials (regenerate with `node treatments/lumenary/catalog.mjs`).
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
| `press` | drawings in a two-ink style | `theory/press.md` |
| `riso` | drawings in a two-ink style (Lumenary's risograph ink model) | `theory/riso.md` |
| `halftone` | photos | `theory/halftone.md` |
| `hatch` | photos | `theory/hatch.md` |

Shared pieces (brightness, seeded noise, blur, edges, tone, multiply) are in
`theory/foundations.md`.

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
