# style

A library of UX and visual design knowledge learned from real human-made work, filed by
the problem it solves, for coding agents to look up when they build something.

AI-built pages drift toward the same defaults. Measured here (C-005): given no style, this
agent put 7 pages on 6 unrelated subjects (a bakery, CLI docs, a wildlife portfolio, an energy
dashboard, a recipe, a repair guide) on the same cream paper (`#f3efe6`–`#f7f1e6`) with
warm near-black text and a terracotta accent near `#c4501f`. This library gives an agent the
reasoning behind how people solved the same problem before: why IKEA manuals have no
words, or why the step number is the biggest thing on the page. It doesn't copy brands
or catalogue looks.

## For an agent using the library

1. Find the folder in `library/` that matches the problem your page solves (e.g.
   `step-by-step-instructions/`).
2. Read the entry. Follow **section 4 (rules)**, and check **section 5** to see whether
   your case is one where it doesn't apply.
3. If the entry lists a `best_example`, that's a page an agent built from it which won
   a blind test. Use it to see what the rules look like in practice, not as something to copy.

## Layout

```
library/<problem>/<source>.md   entries (template: library/_template.md)
METHOD.md                       how an entry is made and tested
CARD.md                         the open card, and closed ones with results
threads.md                      open questions, not yet worked on
runs/<card>/                    test prompts, generated pages, blind keys
tools/                          measuring and blind-test scripts
sources/                        local copies of source documents (git-ignored)
```

## What's been shown so far

- **C-001:** a page built with the IKEA entry beat a page built with no guidance in a
  blind pick, applying 6/6 of its rules.
- **C-002:** it also beat a page built from a reference the agent wrote for itself in
  the same format, on both questions (less AI-made; better to use while working). It
  had 414 words outside drawings, against 1,649 for the self-reference page.
- **C-003:** checked against a chair, a chest of drawers and a lamp, only 6 of the
  entry's 14 BILLY-based facts held everywhere. Most of the rest turned out to be
  *conditional*: IKEA uses a device only when the task has the problem it solves. The
  entry and rules 2, 3, 5 were revised.
- **C-004:** the revised entry against the old one, both fresh pages. Split: revised won
  "less AI-made", old won "which would you use" ("more concise… step by step"). The
  revised page had spread a reader's choice across steps; rule 2 now keeps choices in
  one place (not yet re-tested).

- **C-005:** the unguided default, measured on 7 pages: cream background 7/7, warm
  near-black text 7/7, terracotta accent 7/7, uppercase eyebrow labels 6/7, pill chips
  5/7; Inter, purple and gradients 0–1/7. This is the new default checklist in METHOD.md.

One brief, one run per arm, and one judge. See each card's limits.

## Tools

Need poppler (`pdffonts`, `pdftoppm`) and ImageMagick (`magick`): `brew install poppler imagemagick`.

- `tools/measure-pdf.sh <pdf> [page]` — fonts, page size, top colours.
- `tools/blind.sh <run-dir> <a.html> <b.html>` — random order, key, opens both.
- `python3 -I tools/words.py <pages>` — words outside drawings.
- `python3 -I tools/css-profile.py <pages>` — background, text, accent hues, fonts, radii, shadows, gradients.
