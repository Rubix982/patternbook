# Step-by-step instructions for a physical task — learned from IKEA assembly manuals

**Problem this entry is for:** someone must carry out a physical task in order, with
their hands busy and attention split between the page and the object. Reading is a
cost; a wrong step is expensive to undo.

**Use for:** assembly, setup, repair, maintenance, any procedure where the state of a
physical thing changes step by step.

## 1. Source

IKEA assembly instructions, three official BILLY bookcase manuals:
- `AA-1844854-6` (16 pp, © 2015, rev. 2021-02-16)
- `AA-2175344-3` (12 pp)
- `AA-2312999-2` (20 pp)

From `https://www.ikea.com/us/en/assembly_instructions/billy-bookcase__<code>.pdf`.
IKEA ships the same booklet in every market, so it can't rely on the reader's language.
That one constraint explains most of what follows.

## 2. Observed facts

Measured from the PDFs, not recalled.

**Page and color**
- A4 portrait, white page. Lines are black (renders ~`#202020` when antialiased).
- Exactly two greys, used only to shade a surface: `#D2D2D2` (lighter face) and
  `#BCBCBC` (darker face). Most of each page is unshaded white.
- No color anywhere. Warnings are a black outlined triangle with `!`, not red.

**Typography**
- One family, `NotoIKEALatin`, in two weights only: Bold and Regular (from embedded
  fonts). Other scripts use matching Noto IKEA cuts.
- On step pages the only type is: the step number (Bold, by far the largest element
  on the page, top-left), the quantity `4x` (Regular, beside the callout), part
  numbers like `118331` (small, set vertically next to the part), page number.
- Words appear only on the safety pages: a 3-column grid, one block per language,
  each block = small language label → large bold caps headline (`WARNING!`) → bold
  sentence → regular fine print.

**Sequence**
1. Cover: product name huge and bold, line drawing of the finished product.
2. Safety text pages (the only text-heavy pages).
3. One page of "before you start" panels: tools needed, protect the floor, if
   confused call the store, anchor to the wall. Each panel is a rounded rectangle
   containing one idea, usually as a wrong/right pair.
4. Parts inventory: every loose part drawn, quantity `8x` under it, part number
   beside it. Large parts (brackets, rails) drawn bigger, on their own.
5. Numbered steps, usually two per page.

**Inside a step**
- Each step shows one change to the object: something is inserted, turned, joined,
  flipped.
- Detail is shown in a **circular magnified callout** connected to its location on
  the object by a thin curved leader line. The callout carries the quantity and part
  number for that step.
- Motion: solid black arrows for push/slide/drop; a circular arrow around a
  screwdriver shaft for "turn"; a curved arrow over the whole object for "flip it".
- A drawn hand with pointing finger means "press by hand, no tool".
- Right vs wrong: two small square insets side by side, the wrong one crossed with
  a single X. Shown at the step where that mistake is possible.
- Large mistakes (tip-over, assembling on a hard floor) are crossed out with two big
  curved strokes over the whole scene, with the correct scene beside it.
- Alignment and hole rows: dotted/dashed lines. A dashed outline shows where the
  object will end up.
- The tip-over warning panel is **repeated** directly before the wall-anchoring step,
  not only at the start.
- Line weight: object silhouettes are drawn heavier than inner edges and detail —
  two weights, consistently.

## 3. Why it works (the part that transfers)

- **The picture is the instruction.** Because there's no shared language, every step
  has to be understandable from the drawing alone. A side effect is that it's faster
  for everyone: you compare the drawing with the object in your hands and don't
  translate from words.
- **The step number is the anchor.** Hands and eyes leave the page constantly. A
  huge numeral is what you find again when you look back. Nothing else on the page
  competes with it.
- **One change per step** means you can check you're done: does my object now look
  like the drawing? Steps that bundle several changes can't be checked that way.
- **Inventory first, then the same ID at point of use.** You verify you have
  everything before committing, and you never have to guess which of two similar
  screws a step means — the count and number tell you, right in the callout.
- **Magnify where the risk is.** The whole-object view tells you *where*; the callout
  tells you *how*. The leader line connects the two so you don't have to.
- **Warn at the moment of action.** A warning on page 2 is forgotten by step 9. The
  tip-over warning is repeated exactly when you're about to need it.
- **Monochrome keeps meaning in shape, not color.** With no color, nothing is
  decorative, so anything drawn is meaningful. Grey marks "the surface that matters
  here" and nothing else. It also survives cheap printing and photocopying.

## 4. Transferable rules (for an agent building a page)

These describe the problem's needs, not IKEA's look. Do **not** copy the IKEA mascot,
logo, font, or product drawings.

1. **One numbered step = one visible change.** The step number is the largest type in
   the step. If a step needs "and", split it. Each step should be checkable against
   its picture.
2. **Lead with the visual, not the sentence.** Every step has a diagram that carries
   the instruction on its own; any text is one short line under it, never a paragraph.
3. **Inventory before step 1.** List every part/tool/requirement with a quantity
   (`4×`) and a short stable ID. Repeat that ID and the quantity inside the step that
   uses it.
4. **Magnified callout for the risky detail,** connected to where it applies on the
   overview by a visible leader line. The callout is where the quantity goes.
5. **Right/wrong pairs at the point of the mistake.** Show the wrong version crossed
   with one X next to the right one, in the step where the mistake can happen — and
   repeat safety warnings right before the step they apply to.
6. **Monochrome by default.** Black line on white, at most two greys, used only to
   mark the surface or part that matters in this step. Warnings use a symbol, not a
   color. No decorative color, gradients, or shadows.

## 5. When it doesn't apply

- **The state isn't visible.** Software configuration, abstract settings, or
  processes where "done" can't be seen in a picture. Pictures of screens can stand
  in, but rule 1's "checkable against the picture" weakens.
- **The reader needs reasons, not just actions.** IKEA never says *why*. A training
  manual or anything where judgment is required needs explanation this pattern
  deliberately leaves out.
- **Legal or safety text that must be in words.** Even IKEA falls back to dense text
  for its warnings. Don't force those into pictures.
- **Non-sequential use.** Reference material people jump around in (spec sheets,
  troubleshooting by symptom) needs a different structure.
- **Practical limit for agents:** good isometric line drawings are hard to make in
  SVG. A crude drawing that keeps the rules (one change, numbered, callout, X pairs)
  still works better than a polished illustration that ignores them.
