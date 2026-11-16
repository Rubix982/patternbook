# Two-colour risograph

**For:** drawings in a two-ink style.
**Comes from:** Lumenary's Risograph treatment by Mursal Furqan Kumbhar
(`vendor/lumenary/src/engine/styles/risograph.js`; his theory in `lumenary/theory/06-craft.md`).
Adapted with his permission. His model, constants and tone curves; our colour separation.

> **C-013:** against `press` on C-011's winning page, the judge rated both equal on "less
> AI-made" and "convincingly printed", and called `riso` the more filtered of the two.

## Why it looks this way

A risograph is a stencil duplicator: one ink per pass, so two drum passes for two colours. It
doesn't lay ink as dots. It forces ink through a stencil, so tone shows up as random grain,
inking is uneven over broad patches, and the second pass never lines up with the first.

## What we changed from Lumenary's version

His treatment is for photographs. It makes its two plates from **brightness** (plate one from
shadows, plate two from almost everything) and offers fixed ink pairs. Our drawings already use
exactly two inks, so the plates come from `press`'s **colour separation** instead (black coverage
k, spot coverage s), and the inks are dials. Everything after that is his:

    a₁ = k^1.35,   a₂ = 0.92 · s(x + δ)^0.75          (his plate curves; δ = misregistration)
    θ = ½ + (0.55 r + 0.45 n − ½) · G,  G = 0.25 + 1.3 · grain/100
    coverage = smoothstep(θ − 0.09, θ + 0.09, a) · density · pat
    pat = 0.9 + 0.1 · n_broad + 0.06 · (r' − ½)        (broad patches of thicker and thinner ink)
    δ = (7, −4.5) · (miss/100) · W/800 px
    out = paper · Π(1 − coverage · (1 − ink)) · (1 + 0.05 · (r'' − ½))   (paper fibre)

r is per-pixel hash noise and n smooth value noise at 0.7 / (W/800) per pixel.

## How it differs from `press`

- Tints are **random grain**, not a dot screen.
- **No edge wobble or ink spread.** Edges stay where they were; only the grain roughens them.
- Ink is never quite solid: at density 90, a black line prints at about 80–95% black.
- Because the grain threshold clusters around ½, light tints print sparser than their nominal
  coverage even with the tone curves.

## Dials

`grain` (60), `miss` (40), `density` (90), `ink`, `spot`, `paper`, `seed`.
