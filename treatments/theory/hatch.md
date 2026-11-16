# Pen hatching

**For:** photographs on a page in a pen-and-ink style.
**Comes from:** engraving and pen illustration, where tone is built only from lines.
**Works best on:** objects with clear form and light from one side.

## Why it looks this way

A pen makes a line of one colour, so shade has to come from how many lines there are and how
close together. Illustrators add a direction for each step darker: one set of parallel strokes
for light shade, a second crossing it for mid-tones, more for shadows. A hand-drawn stroke
isn't straight or even. It drifts slightly and swells and thins with pressure. Outlines are
drawn where one surface meets another.

## How it works

1. Brightness L, blurred a little; darkness t = 1 − contrast(L).
2. Four layers of parallel lines at 45°, −45°, 8° and 98°, switched on at darkness 0.22, 0.42,
   0.62 and 0.80.
3. Each line drifts sideways with smooth noise along its length and changes thickness with
   "pressure".
4. Add an outline where the Sobel edge strength passes `outline`.

## The maths

For layer k at angle φ, measure the position across the lines, a = x cos φ + y sin φ, and
along them, b = −x sin φ + y cos φ. With spacing p:

    q = (a + w) / p,      w = wobble · (2n(b / λ, a / 3p) − 1)
    dist = |q − round(q)| · p
    half-width = p · (0.1 + 0.22 · (t − t_k) / (1 − t_k)) · (0.55 + 0.45 · pressure)
    ink_k = smoothstep(hw + 0.6 px, hw − 0.6 px, dist) · smoothstep(t_k − 0.04, t_k + 0.06, t)

Layers combine like ink: paper = Π(1 − ink_k), and the outline multiplies in last.

## Dials

`spacing` (4 px), `contrast` (0.2), `outline` (0.35), `wobble` (0.8 px), `wobbleScale` (14 px),
`fibre`, `ink`, `paper`.

## When it fights the content

- **Flat graphics.** With no tonal shading there is nothing to hatch; use `press`.
- **Busy photos.** Hatching on a cluttered background becomes noise. Crop to the subject first.
