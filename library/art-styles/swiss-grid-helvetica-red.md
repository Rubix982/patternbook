---
art_style: grid-based Helvetica, black and white with one red
source: NASA Graphics Standards Manual, NHB 1430.2 (January 1976), publications and signage sections
source_docs:
  - https://www.nasa.gov/wp-content/uploads/2015/01/nasa_graphics_manual_nhb_1430-2_jan_1976.pdf
derived_in: C-009
tested_in: [C-009]
---

# Art style: grid-based Helvetica, black and white with one red

The visual system from the publications (§5) and signage (§6) sections of NASA's 1976
Graphics Standards Manual, a design codex written for designers. Like the other style
files, it says how a page **looks**, not how it's organised.

**Don't imitate NASA.** No worm logotype, no seal, no agency name, no space imagery used as
branding. The system below is generic. The manual itself is public domain, and NASA's
identity marks still aren't free to use.

> **Tested in C-009: did not win.** Given alone for a CLI-docs homepage, the agent followed it
> closely (about 5.5/6), but Saif called both it and the unguided page AI-made, and preferred
> the unguided one to use. Possible reasons (untested): a big-Helvetica, black-bar, red-block
> page is itself a look agents already produce; the page also had no side margin. Add a side
> gutter (at least 24px) if you use this file.

> **C-010:** shown again alongside other pages, the judge called this style's page cold and
> empty ("neat and clean… unremarkable cold finish… very unhuman"; "Empty spaces"). Print's
> generous white space reads as sterile on screen. Give the page a real header that orients
> the reader, and don't leave large empty areas.

## Palette

Measured from the manual's colour-standard swatches (p. 1.5). It's a scan of a printed page,
so treat the values as close, not exact.

| Role | Value | Use |
|---|---|---|
| Page | `#FFFFFF` | white; "intended to be used only on white or a light value neutral background" |
| Ink | `#000000` | text, rules, solid panels |
| Red | `#CC273D` | **one** accent: the identifying element, or a highlight that aids "the presentation of information" |
| Warm grey | `#797669` | the second colour when red isn't used: secondary text, rules, duotones |

- Red is never combined "with other bright saturated colors, or medium and dark value colors".
- "The use of pale, pastel colors is discouraged in all NASA publications."
- Solid panels are allowed: black or red with white type (the sign system).

## Type

- **Helvetica only**, in the manual's pairing: Light (or Regular) for text, Medium (or Bold)
  for headings. On the web: `"Helvetica Neue", Helvetica, Arial, sans-serif`.
- **Upper and lower case** for headings. No all-caps labels, no letter-spaced eyebrows.
- **Flush left, ragged right.** Never centred, never justified.
- "Normal" rather than "tight" letterspacing.
- Large words for wayfinding: a sign is "a large-scale headline". Short and very big, in
  Medium or Bold.
- Numbers used as markers (room numbers, chapters) are set large and bold.

## Grid

- **Everything sits on a column grid** that decides margins, gutters and folio placement.
  Two columns for technical material; three where more movement is wanted.
- Headings and text **hang from a common top line** across columns.
- A **white band across the top** as "breathing space", holding folios and the occasional
  important headline.
- **Thin black rules** separate articles and sections.
- **Outline boxes around all technical diagrams.**
- Captions sit directly under the image they belong to.

## Surfaces and shapes

- Rectangles with square corners: panels, boxes, signs. No rounded cards, no pills.
- "Avoid the use of borders or other types of artificial embellishment." No shadows, no
  gradients, no outlined or shadowed letters.
- Solid black or red panels with white type for the few things that must be found
  instantly (navigation, warnings, the one key action).
- Arrows are simple solid shapes set in the type, sized to the capital height.

## Illustration

- **Simple, strong shapes over detail.** The manual's covers use flat silhouettes in black and
  greys: "the absence of detail… provokes interest".
- Technical diagrams are plain line work inside an outline box.

## When this style fights the content

- **Many categories that need colour coding** (charts with 6 series). The system has one red
  and one grey. Use tints of black, or patterns, before adding hues.
- **Warm, personal subjects** (a bakery, a recipe) can feel cold in it. It was made for an
  engineering agency's documents and signs.
