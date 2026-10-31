---
art_style: technical line art, monochrome
source: IKEA assembly instructions (BILLY, POÄNG, MALM, SKAFTET), visual facts only
source_entry: library/step-by-step-instructions/ikea-assembly-instructions.md
derived_in: C-008
tested_in: []
---

# Art style: technical line art, monochrome

The visual system of IKEA's assembly manuals, separated from what those manuals *do*
(steps, parts lists, right/wrong pairs). Everything here was constant across four IKEA
products in C-003. This file says how a page **looks**; it says nothing about how the page
is organised. Pair it with whatever entry fits the page's problem.

Don't copy IKEA's logo, mascot, typeface or drawings. The system below is generic.

## Palette

| Role | Value | Use |
|---|---|---|
| Page | `#FFFFFF` | the whole background; no tint, no off-white |
| Ink | `#231F20` | all lines and all text |
| Light grey | `#D3D2D2` | shading one surface that matters right now |
| Dark grey | `#BDBCBC` | the second face of that surface, when it has one |

Nothing else. Most of the page is unshaded white. Grey marks "look here", never decoration.
Warnings are a black symbol (outlined triangle with `!`, or a prohibition circle), never red.

## Type

- One plain sans-serif family, two weights only: Bold and Regular.
- The most important label on a unit (a step number, a symptom code) is Bold and the largest
  type in that unit.
- Small type for IDs and quantities (`4x`, `118331`), set close to what it labels.
- No serif, no italic display type, no uppercase letter-spaced "eyebrow" labels.

## Drawing

- **Line drawings only.** No photos, no fills except the two greys, no gradients, no shadows.
- **Two line weights:** a heavier outline for an object's silhouette, a lighter line for
  inner edges and detail.
- **Isometric or three-quarter view** for physical objects, drawn as you'd see them on a table.
- **Circular magnified callout** for detail, joined to its place on the overview by a thin
  curved leader line. Two circles chained when the detail is a sequence.
- **Motion:** solid black arrows for push/slide; a circular arrow around a shaft for "turn";
  a curved arrow over the whole object for "flip".
- **Dashed lines** for alignment, hidden parts, or something not included / not yet there.

## Shapes and surfaces

- Square corners on boxes and panels. Where a frame is rounded, the radius is small and the
  same everywhere. No pill shapes.
- Thin black rules or a single rounded frame to group things; no cards with shadows, no
  tinted panels.
- Generous white space; one idea per framed panel.

## When this style fights the content

- **The real object has meaningful colour** (a status light that's green or amber, a red
  wire). IKEA never faces this, because furniture parts aren't colour-coded. If colour carries
  information the reader must match, keep that one colour, small and only on the thing
  that has it, and leave everything else in the system unchanged.
- **Photographic subjects** (food, people, landscapes). Line art can't stand in for them.
