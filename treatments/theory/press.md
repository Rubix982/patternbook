# Two-colour press

**For:** drawings (vector SVG) on a page that uses a two-ink style, such as
`library/art-styles/hand-inked-two-colour-field-magazine.md`.
**Comes from:** letterpress and offset magazine printing in two inks, black plus one spot
colour. PS Magazine (1950s–60s) is the reference.
**Works best on:** line art, flat colour areas and light tints.

## Why it looks this way

A press can only put ink down or leave paper bare; it can't print grey. A two-colour job has
exactly two inks, each on its own plate, and the sheet goes through once per plate. So:

- **Tints are faked with dots.** A light blue panel is the blue ink broken into a fine screen.
- **The plates never quite line up.** The blue lands a pixel or two away from the black.
- **Ink spreads.** It soaks into absorbent paper past the edge it was meant to stop at, so
  lines come out thicker and softer (dot gain).
- **Edges aren't perfect.** Plate and paper are uneven, so a straight edge wanders slightly.
- **Inking is uneven.** Big solids show small pale patches where the roller ran short.

Vector art has none of this: every line is exactly where the maths put it. That is
"polygon-ish, no streaks, no flares" (C-010).

## How it works

1. Split the picture into how much black ink and how much spot ink each pixel needs.
2. For each plate: spread the ink, wobble the edges, offset the spot plate, screen the tints,
   and decide where ink lands with a threshold that carries grain and starvation.
3. Multiply both inks over paper with a faint fibre texture.

## The maths

**Splitting into plates.** Stacked transparent inks add their optical densities, D = −ln(reflectance).
For each pixel, find black coverage k and spot coverage s so that, channel by channel,

    D_c ≈ k · dK_c + s · dS_c,     dK_c = −ln(K_c),  dS_c = −ln(S_c)

by least squares over R, G, B (a 2 × 2 solve), clamped to 0..1. Coverage below 8% (black) or
3% (spot) is set to zero, so a light tint stays pure spot ink.

**Ink spread.** c' = min(1, max(c, g · blur(c))) with g = 1 + 1.3 · min(1, spread), and blur two
box passes of radius `spread`. Thin lines get thicker rather than fainter.

**Edge wobble and misregistration.** Read the plate at x + d(x) − δ, where d is value noise of
amplitude `wobble` over a scale of `wobbleScale`, and δ is (misregister, 0.6 × misregister)
for the spot plate and zero for black.

**Screen for tints only.** On a lattice of spacing `screen` rotated by θ (45° black, 15° spot,
apart to avoid moiré), a dot of area c·s² has radius s·√(c/π). So a pixel at distance d from
its dot centre is inked when π(d/s)² < c. Line art isn't screened. Where there's solid ink
within 2 px, a plain threshold of ½ is used instead:

    τ = min(0.97, π(d/s)²),   tint = smoothstep(0.9, 0.7, dilate(c, 2 px))
    θ = ½ + (τ − ½)·tint + (0.55 r + 0.45 n − ½) · grain · (1 − 0.7 tint)
        + 0.65 · starve · smoothstep(0.68, 0.95, n_coarse)
    ink = smoothstep(θ − 0.06, θ + 0.06, c')

r is per-pixel hash noise and n is fine value noise (edges go ragged); n_coarse is coarser value
noise that lifts the threshold in patches, so solids get pale specks where the ink ran short.

**Paper.** paper × (1 − 0.07 · fibre · n(x / 1.5, y / 10)): faint vertical streaks.

## Dials

| Dial | Default | What it is |
|---|---|---|
| `misregister` | 1.2 px | how far the spot plate is off |
| `spread` | 0.6 px | ink spread / dot gain |
| `wobble`, `wobbleScale` | 0.9 px, 5 px | how far edges wander, and over what length |
| `grain` | 0.35 | raggedness of edges |
| `starve` | 0.25 | pale patches in solids |
| `screen` | 3.2 px | dot spacing for tints |
| `fibre` | 0.25 | paper texture |
| `ink`, `spot`, `paper` | `#1a1a1a`, `#3f6e96`, `#ffffff` | the inks and the stock |

## When it fights the content

- **Photographs.** It expects flat inks; use `halftone` or `hatch`.
- **More than two inks.** A third colour gets forced into black or spot.
- **Tiny UI icons.** At 16 px, a pixel of misregistration reads as a rendering bug.
