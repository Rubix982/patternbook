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

1. Pick two things separately:
   - a **problem entry**: the folder in `library/` that matches what your page has to do
     (`step-by-step-instructions/`, `troubleshooting-by-symptom/`);
   - an **art style** from `library/art-styles/` for how it looks. One of the two styles
     so far (IKEA line art, C-008) made a page read *less* AI-made than the default; the
     other (NASA typographic, C-009) didn't. Neither reads as human yet: in C-010 the judge
     found both styled pages cold and empty. Check a style's `tested_in` before relying on it.
2. Read the entry. Follow **section 4 (rules)**, and check **section 5** to see whether
   your case is one where it doesn't apply.
3. If the entry lists a `best_example`, that's a page an agent built from it which won
   a blind test. Use it to see what the rules look like in practice, not as something to copy.

## Layout

```
library/<problem>/<source>.md   problem entries (template: library/_template.md)
library/art-styles/<style>.md   art styles, used alongside any problem entry
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

- **C-006:** entry #2, troubleshooting by symptom, from four makers with no shared style
  (Miele, Brother, Toyota, Garmin). Six devices were constant across all four (symptom
  first; cause separate from fix; several causes per symptom; escalation last; long fixes
  linked out; imperative actions).
- **C-007:** entry #2 lost its blind test. The page built with no guidance already
  followed 5–6 of its 6 rules, one step at a time; the entry's page copied the printed
  manuals' exhaustive tables (6× the words) and was harder to use. Lesson now in METHOD.md
  step 2b: check what the agent already does before writing an entry.

- **C-008:** IKEA's visual system on its own, as an art-style file with no structural rules,
  given for the router page. It won both questions against an unguided page of the same
  length (591 vs 609 words). So art style is its own axis, and in this case it was the part
  that read as AI-made.

- **C-009:** a second art style, from NASA's 1976 Graphics Standards Manual, given alone for a
  CLI-docs page. The agent followed it closely, but Saif called both pages AI-made and
  preferred the unguided one to use. So C-008 doesn't generalise to "any human style" yet.
  The palette checklist scored the pages 0/5 vs 5/5 and didn't predict the judgement.

- **C-010:** the judge marked six judged pages for what reads AI-made. No palette trait was
  named. What was named: cold, empty white space (on both human-style pages), a missing
  header, enthusiastic copy, perfect vector drawings, too much text. That's now METHOD.md's
  judge's checklist. The C-008 winner drew the most criticism, so "less AI-made than the
  default" is as far as that result goes.

One brief, one run per arm, and one judge. See each card's limits.

## Tools

Need poppler (`pdffonts`, `pdftoppm`) and ImageMagick (`magick`): `brew install poppler imagemagick`.

- `tools/measure-pdf.sh <pdf> [page]` — fonts, page size, top colours.
- `tools/blind.sh <run-dir> <a.html> <b.html>` — random order, key, opens both.
- `python3 -I tools/words.py <pages>` — words outside drawings.
- `python3 -I tools/css-profile.py <pages>` — background, text, accent hues, fonts, radii, shadows, gradients.
