# Halftone

**For:** photographs on a page in a one- or two-ink print style.
**Comes from:** photoengraving and newspaper printing, from the 1880s on.
**Works best on:** portraits and photos with clear light and shadow.

## Why it looks this way

A press can't print grey, so a photograph is turned into dots on a regular lattice: small dots
where it's light, large where it's dark. Far enough away, the eye blends them back into tone.
The lattice is turned to an angle (45° is traditional for one ink), because rows of dots at 0°
are easy for the eye to pick out. The same press imperfections apply: dots spread, edges
wander, and solids starve a little.

## How it works

1. Brightness L for each pixel, through the contrast curve; ink needed c = 1 − L.
2. Lay a lattice of spacing s, rotated by the screen angle, over the picture.
3. For each lattice cell, read c at the cell's centre, so the whole dot has one size.
4. Draw the dot with area proportional to c, slightly spread, with wobbly edges and grain.

## The maths

A dot of area c·s² in a cell of area s² has radius

    r = s · √(c / π)

and a pixel at distance d from the dot centre is inked by
smoothstep(r + 0.7 px + g, r − 0.7 px + g, d), where g is per-pixel grain. The dot edge wanders
by value noise of amplitude `wobble`. Spread raises c by up to 35% of `spread`. At c = 1 the
radius 0.56 s leaves the cell corners bare, as a real screen does before dots merge.

Dot centres in picture coordinates come from rounding the rotated coordinates
(u, v) = R(−θ)(x, y)/s and rotating back.

## Dials

`screen` (5 px dot spacing), `angle` (45°), `contrast` (0.15), `spread`, `wobble`, `grain`,
`starve`, `fibre`, `ink`, `paper`.

## When it fights the content

- **Small photos.** Below about 20 dots across, the subject disappears.
- **Line art.** Screening a drawing turns every line into a row of dots; use `press`.
