# Foundations

_The shared tools of patternbook's own treatments (`treatments/treatments.js`), moved here from `treatments/theory/` on
2026-11-22. Lumenary's foundations, which these follow, are in `sources/theory-pages/00-foundations.md`; the
same operations, named once across every model, are entries in `primitives.md` (`luminance`, `blur`, `image-gradient`,
`seeded-random`, `smooth-noise`, `tone-curve`)._

The pieces every treatment in `treatments.js` shares. The idea of writing these out came from
Lumenary's Foundations page (lumenary-studio.vercel.app/theory/foundations). These are
textbook methods, written here in our own words and code.

## Brightness

A pixel arrives as red, green and blue, each 0–255. Most treatments need one number, how
bright it is. Eyes are most sensitive to green and least to blue, so:

    L = (0.2126 R + 0.7152 G + 0.0722 B) / 255          (Rec. 709 weights; 0 black, 1 white)

## Seeded randomness

Grain has to be the same every time a page loads, or the drawing would change on every visit.
So nothing uses `Math.random`:

- **mulberry32**, a small public-domain generator: same seed, same sequence.
- **hash2(x, y, seed)**: a number in [0, 1) tied to a pixel position, so grain stays put.
- **value noise**: hashes on a coarse lattice, blended with a smoothstep curve, for smooth,
  cloud-like variation (uneven inking, wobbling edges, paper fibre).

      N(x, y) = blend of h00, h10, h01, h11 with u = 3f² − 2f³ in each direction

Each element treated on a page gets its own seed (base seed + 977 × its position).

## Blur, spread and edges

- **Box blur**: the average of a (2r + 1)-wide window, with a running sum, rows then columns,
  so cost doesn't grow with r. Two passes approximate a Gaussian.
- **Dilate**: the largest value within r pixels. Used to ask "is there solid ink nearby?"
- **Sobel**: slope in x and y from two 3 × 3 grids; edge strength = √(Gx² + Gy²) / 4.

## Tone

One contrast curve: pivot on mid-grey and change the slope, with the slider c in −1..1 mapped
through a tangent so c = 0 leaves the picture unchanged.

    f = tan((c + 1)π / 4),     L' = clamp((L − ½) f + ½)

## Ink over paper

Printing inks are transparent, so they **multiply**: each ink lets through a fraction of the light.

    out = paper × Π over inks (1 − coverage × (1 − ink colour))

On the page, the treated canvas is drawn with `mix-blend-mode: multiply`, so paper white
vanishes and the inks sit on whatever is behind them, as ink on paper does.

## Sizes

Every length a dial sets is in CSS pixels and multiplied by the render scale (2 by default),
so a treatment looks the same on a high-density screen.
