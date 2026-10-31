---
source: IKEA assembly instructions (bookcase, chair, chest of drawers, floor lamp)
source_family: IKEA
source_docs:
  - https://www.ikea.com/us/en/assembly_instructions/billy-bookcase__AA-1844854-6.pdf
  - https://www.ikea.com/us/en/assembly_instructions/billy-bookcase__AA-2175344-3.pdf
  - https://www.ikea.com/us/en/assembly_instructions/billy-bookcase__AA-2312999-2.pdf
  - https://www.ikea.com/us/en/assembly_instructions/poang-armchair__AA-2615392-1.pdf
  - https://www.ikea.com/us/en/assembly_instructions/malm-chest-of-6-drawers__AA-2398382-2.pdf
  - https://www.ikea.com/us/en/assembly_instructions/skaftet-floor-lamp__AA-2168957-4.pdf
problem: step-by-step-instructions
also_teaches: [parts-inventory, multilingual-warnings, after-assembly-use]
patterns: [picture-is-the-instruction, magnified-callout, right-wrong-pair, warn-at-point-of-use, id-repeated-at-point-of-use, device-only-when-needed, info-marker]
art_style: technical line art, monochrome, isometric
tested_in: [C-001, C-002]
best_example: runs/c001/arm-b.html
---

# Step-by-step instructions for a physical task — learned from IKEA assembly manuals

**Problem this entry is for:** someone must carry out a physical task in order, with
their hands busy and attention split between the page and the object. Reading is a
cost; a wrong step is expensive to undo.

**Use for:** assembly, setup, repair, maintenance, any procedure where the state of a
physical thing changes step by step.

> **Version note.** C-001 and C-002 tested the BILLY-only version of this entry (git
> `a1b6df2`). C-003 checked it against three more products and narrowed rules 2 and 3.
> The current rules haven't been blind-tested yet.

## 1. Source

Six official IKEA manuals, four product types:

| Product | Document | Pages | Page size |
|---|---|---|---|
| BILLY bookcase | `AA-1844854-6`, `AA-2175344-3`, `AA-2312999-2` | 16, 12, 20 | A4 |
| POÄNG armchair | `AA-2615392-1` (2025) | 16 | A5 |
| MALM chest of 6 drawers, US | `AA-2398382-2` (2023) | 40 | A4 |
| SKAFTET floor lamp | `AA-2168957-4` (2019) | 16 | A5 |

The URL slug before `__` is ignored by ikea.com; only the `AA-` code matters.

The assembly pictures are the same in every market, so they can't rely on the reader's
language. That one constraint explains most of what follows. The safety *text* does vary
by market: MALM's US edition has English, French and Spanish only, while BILLY's and
SKAFTET's carry about 30 languages.

## 2. Observed facts

Measured from the PDFs (`tools/measure-pdf.sh` for fonts and colours), not recalled.
C-003 sorted the facts into three groups after checking them across all four products.

### Constant: in every manual checked

- **No colour.** Line ink `#231F20`. Warnings and prohibitions (no TV on top, no
  climbing) are black symbols, never red.
- **The same two greys, in every product:** `#D3D2D2` and `#BDBCBC`, used only to
  shade a surface (a rug under the work, a panel being placed, fabric). Most of each
  page is unshaded white. (BILLY p10, POÄNG p7, MALM p22. First draft of this entry
  sampled a greyscale render and gave `#202020`/`#D2D2D2`/`#BCBCBC`.)
- **Step number** in Bold, top-left, the largest type on the page.
- **Cover:** product name very large in bold, line drawing of the finished product.
- **Circular magnified callout** joined to its location by a thin curved leader line,
  carrying the quantity (`4x`) and, where parts have numbers, the part number. When a
  detail is a sequence (insert, then turn), two circles are chained or stacked.
- **Circular arrow** around a tool shaft for "turn"; curved arrow over the whole
  object for "flip it"; solid black arrows for push/slide/drop.
- **Two line weights:** silhouettes heavier than inner edges and detail.

### Conditional: appears only when the task calls for it

This group was the main finding of C-003. These devices aren't IKEA decoration; each
one shows up exactly when the task has the problem it solves, and is left out otherwise.

| Device | Present when… | BILLY | POÄNG | MALM | SKAFTET |
|---|---|---|---|---|---|
| Right/wrong insets, wrong one crossed with X | two parts look alike, or a part fits two ways | ✓ | ✓ nearly every step | ✓ | — few, distinct parts |
| Part numbers in inventory and callouts | similar parts could be confused | ✓ | ✓ | ✓ | — 6 part types, no numbers |
| Safety warning repeated before a step | a hazard belongs to a specific step (tip-over at wall anchoring) | ✓ | — no hazard | ✓ before steps 41, 48 | — cable warning is general |
| Pointing hand = "by hand" | a step uses no tool | ✓ | ✓ | ✓ thumb on lever | — |
| "Before you start" panels: tools, floor, help, wall | tools / a large flat piece / tip-over risk exist | all four | tools, floor, help (+ "no power drill", crossed out) | tools, floor, help, wall, **two people** | help only |
| Text inside a step | the reader must choose based on something only they know (their wall type) | — | — | ✓ step 37, wall types A/B/C | — |

### Varies freely

- **Steps per page:** 1–3. BILLY about 2; POÄNG mostly 1; MALM 1–3; SKAFTET 1.
- **Page size:** A4 (BILLY, MALM) or A5 (POÄNG, SKAFTET).
- **Typefaces:** `NotoIKEALatin` Bold and Regular everywhere; MALM also embeds
  `VerdanaIKEA` (IKEA's previous typeface) for printed part labels like "IKEA CR".

### Shared devices BILLY didn't show

- **ⓘ info marker** (POÄNG, MALM, SKAFTET): a circled *i* marks a panel of guidance
  rather than an action. It's used for the correct half of a right/wrong pair, a
  look-ahead view of the finished object, or tips.
- **After-assembly pages** (all three): what to do once it's built. POÄNG says
  re-tighten 6 bolts later; MALM shows how to release the drawer interlock; SKAFTET
  shows the switch and how to angle the bulb.
- **Dashed outline for what isn't in the box** (SKAFTET's shade and bulb), alongside
  BILLY's dashed outline for where an object will end up.
- MALM only, likely because it's the most complex: parts split into numbered bags,
  with the bag's number shown at the step where you open it; two parallel build
  tracks for two drawer sizes, joined by a branch arrow; "turn to page 19" with a hand
  turning a page; a QR code to a wall-anchoring web page.

## 3. Why it works (the part that transfers)

- **The picture is the instruction.** The pictures have to work without a shared
  language, so every step must be understandable from the drawing alone. A side effect
  is that it's faster for everyone: you compare the drawing with the object in your
  hands and don't translate from words.
- **Words appear when the page can't know the answer.** The one place MALM puts text
  inside a step is where the reader must decide based on their own wall. That's
  something no drawing can show in advance. Words carry information about the reader's
  situation, and pictures carry the action.
- **The step number is the anchor.** Hands and eyes leave the page constantly. A
  large numeral is what you find again when you look back.
- **One change per step** means you can check you're done: does my object now look
  like the drawing?
- **A device only appears where its problem does.** Right/wrong pairs only where two
  parts look alike; part numbers only where parts could be confused; warnings only
  at the step that has the hazard. Because nothing is there by habit, everything on
  the page signals "pay attention here". A page that uses every device everywhere
  loses that.
- **Inventory first, then the same ID at point of use** — when IDs are needed. You
  verify you have everything before committing, and you never have to guess which of
  two similar screws a step means.
- **Magnify where the risk is.** The whole-object view tells you *where*; the callout
  tells you *how*. The leader line connects the two.
- **Monochrome keeps meaning in shape, not colour.** With no colour, nothing is
  decorative. The two greys mark "the surface that matters here" and nothing else.
  It also survives cheap printing and photocopying. That IKEA uses the exact same two
  greys across products made years apart suggests this is a fixed house standard, not
  a per-manual choice.

## 4. Transferable rules (for an agent building a page)

These describe the problem's needs, not IKEA's look. Do **not** copy the IKEA mascot,
logo, font, or product drawings.

1. **One numbered step = one visible change.** The step number is the largest type in
   the step. If a step needs "and", split it. Each step should be checkable against
   its picture.
2. **Lead with the visual; use words only for what the page can't know.** Every step has
   a diagram that carries the action on its own, with at most one short line of text. A
   longer block of words is allowed only where the reader must choose based on their
   own situation (which model they have, what their wall is made of), and then as a
   short labelled choice (A / B / C), not a paragraph.
3. **Inventory before step 1.** List every part, tool and requirement with a quantity
   (`4×`). Give each item a short stable ID **when two items could be confused**, and
   repeat that ID inside the step that uses it.
4. **Magnified callout for the risky detail,** connected to where it applies on the
   overview by a visible leader line. The callout is where the quantity goes.
5. **Right/wrong pairs only at a real mistake.** Where two parts look alike or a part
   fits two ways, show the wrong version crossed with one X next to the right one, in
   that step. Repeat a safety warning right before the step it belongs to. Don't add
   either where the step has no such risk.
6. **Monochrome by default.** Black line on white, at most two greys, used only to
   mark the surface or part that matters in this step. Warnings use a symbol, not a
   colour. No decorative colour, gradients, or shadows.

## 5. When it doesn't apply

- **The state isn't visible.** Software configuration, abstract settings, or
  processes where "done" can't be seen in a picture. Pictures of screens can stand
  in, but rule 1's "checkable against the picture" weakens.
- **The reader needs reasons, not just actions.** IKEA never says *why*. A training
  manual or anything where judgment is required needs explanation this pattern
  deliberately leaves out.
- **Legal or safety text that must be in words.** All four products put their
  regulatory warnings in dense text (SKAFTET's cable warning is text only, with no
  picture). Don't force those into pictures.
- **Non-sequential use.** Reference material people jump around in (spec sheets,
  troubleshooting by symptom) needs a different structure.
- **Practical limit for agents:** good isometric line drawings are hard to make in
  SVG. A crude drawing that keeps the rules (one change, numbered, callout, X pairs)
  still works better than a polished illustration that ignores them.
