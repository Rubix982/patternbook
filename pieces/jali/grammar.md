# Jali: the grammar

How a jali is made, in layers, each with its dials: what `engine/core/jali-design.js` draws (C-032), with the ranges
real jalis measure (C-031, `README.md`), and what is still missing. Command line: `node engine/jali-design.mjs`.

## How it was made (METHOD 2c)

A jali was set out on a dressed slab with compass, straight-edge and cord, then drilled and sawn through and finished
with chisels and abrasives. What the carving could not do: leave a bar thinner than the stone could hold while the
stone round it was cut away, or make an opening's inside corner sharper than the tool's radius. What it always got
slightly wrong: the setting-out wandered over a panel, each meeting point sat a little off, bars came out unevenly
wide, and time wore the edges. The light through it is C-028's thick screen (`processes/primitives.md`,
`thick-screen`).

## The layers and their dials

| Layer | Dials | Range for a jali | From |
|---|---|---|---|
| frame | `frame` (rect, pointed, cusped), `border` | | |
| tiling | `tiling` (4.4.4.4, 6.6.6, 4.8.8, 3.12.12, 4.6.12, 3.6.3.6), `across` | turns by 2, 4 or 6 | C-031 |
| construction | `kind` (strands, cells), `angle` (the contact angle) | about a quarter of geometric jalis read as cells | C-031 |
| cut | `barOverOpening` | 0.31 to 0.89 (open share 0.36 to 0.60 follows, or should) | C-031 |
| thickness | `thickness` (over the opening) | 2.9 to 4.8 | C-031 |
| the hand | `jitter`, `drift` | jitter 0 to 0.075, drift 0 to 0.38 lattice steps (medians 0.048, 0.16; upper bounds) | C-033 |
| | `hand`, `round`, `wear` | not read back: `hand` stays 0.15, `round` and `wear` 0 | C-033 |

**Strands** (Hankin's polygons in contact): from each edge's middle, two rays at the contact angle, each stopping where
it meets its neighbour's; where polygons share an edge, the rays cross there, so the lines run on as strands crossing
in pairs. **Cells**: the tiling's own edges are the bars. The **cut** keeps as stone every point within half a bar of a
line, so bars keep one width; the bar comes from the target bar over opening through the lines' distance field.

## Directions

Named recipes (`engine/check/jali-design.mjs`, `runs/c032/directions/`). The first five sit inside the measured
ranges; the last three step outside on purpose.

| Direction | Recipe |
|---|---|
| octagram | 4.8.8, strands at 67.5°, bars 0.4 of an opening, pointed arch |
| hexagram | 6.6.6, strands at 60°, 0.45 |
| honeycomb cells | 6.6.6, cells, 0.35, pointed arch |
| twelve-point rosettes | 3.12.12, strands at 72°, 0.4, cusped arch |
| dodecagon garden | 4.6.12, strands at 60°, 0.5 |
| hubs (departure) | 4.8.8, strands at 88°: the rays meet at each polygon's centre |
| lace (departure) | 3.6.3.6, strands at 50°, bars a fifth of an opening |
| building front (departure) | 4.8.8 at 30 repeats across |

## What C-032 found, and what is missing

9 of 24 designs drawn inside the ranges measure inside them on every measure; 20 were needed. The cut is the layer
that fails: open share isn't a dial, and 10 designs came out less open than any of the middle 80 % of real jalis (all
four on 3.12.12, at most 0.29); in 10, the bar the reader finds is more than a quarter off its target, mostly where a
tiling has small faces that thick bars fill.

And the writer, seeing them: "very symmetrical, very geometric", without the historical, in-place touch of the
photographs. Sketches (`runs/c032/hand-sketch/`, amplitudes guessed) put what is missing in order of size:

1. **Composition.** A real screen is composed, not one repeat: a border band with its own small pattern, a moulded
   arch, spandrels, and large rosettes among smaller stars (T-039, T-041).
2. **The stone in light.** Bars are rounded ribbons lit from one side, the openings deep shadow, the stone's colour
   uneven. A 2D relief sketch made the bars muddy domes: this belongs in a renderer (T-043).
3. **The hand.** Drift, jitter, uneven bars, the chisel's radius and wear are dials. C-033 measured jitter and drift on
   real jalis and made them the defaults (0.048 and 0.16 lattice steps); the other three can't be read back from these
   photographs. A first guess at the chisel's radius, 0.6 of a bar, had rounded the eight-point stars into blobs.
