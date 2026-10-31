# CARD

One card open at a time. A card that takes more than one sitting is too big — cut it.
Closes with a number, or a sentence that could have come out the other way.

```
1. WHERE WE ARE      — last thing established, as a number or fact. One sentence.
2. WHAT WE ARE DOING — one action, executable by a second person. No "and".
3. WHY               — what is unknown now that will be known after.
4. WHAT IS AFFECTED  — claims/files/numbers that change either way. Written before the work.
5. CONCLUSION        — both branches. If X, we claim A. If not-X, we claim B.
6. IF NOT DONE       — what breaks or stays unknown if skipped forever. "Nothing" → close unstarted.
```

---

## C-003 · Are the IKEA entry's observed facts IKEA habits, or BILLY habits?

**Status:** closed
**Opened:** 2026-10-31

**1. Where we are.**
The IKEA entry has won two blind picks (C-001, C-002), but every fact in its section 2
was observed in three manuals for one product family, BILLY bookcases.

**2. What we are doing.**
Check each of the 14 facts below against three official IKEA manuals for products that
aren't bookcases — a chair (POÄNG), a chest of drawers (MALM), and a lamp with wiring
(any IKEA lamp needing assembly) — marking each fact *holds* / *varies* / *absent* per
manual.

Facts to check (from the entry, section 2):
1. No colour; warnings are a black outlined triangle, not red.
2. At most two greys, used only to shade a surface.
3. One type family, two weights only.
4. Step pages have no words.
5. Step number is the largest element on the page, top-left.
6. Cover: product name large and bold, line drawing of the product.
7. A "before you start" page of panels (tools, protect floor, get help, wall).
8. Parts inventory: every loose part drawn, with `Nx` and a part number.
9. About two steps per page.
10. Circular magnified callout with a leader line, carrying quantity and part number.
11. Right/wrong insets, the wrong one crossed with an X, at the step where the mistake happens.
12. A safety warning repeated right before the step it applies to.
13. Drawn hand with pointing finger = by hand; circular arrow = turn.
14. Two line weights: silhouettes heavier than inner detail.

Also record any device the three manuals share that BILLY doesn't use (e.g. a
two-person icon, electrical warnings).

**3. Why.**
We don't know which of the entry's facts describe IKEA's general practice and which
are just how bookcases happen to be drawn. Rules built on a bookcase quirk would
mislead an agent applying them to other tasks.

**4. What is affected.**
- Section 2 of the IKEA entry: each fact is kept, narrowed, or moved to "varies".
- Section 4: any of the 6 rules that depends on a fact that doesn't hold.
- The entry's `source` header (BILLY only → IKEA assembly instructions in general).
- `METHOD.md` step 1's "one document shows a choice; three show a habit" — this card
  checks whether three documents of *one product* were enough.

**5. Conclusion.**
- **If** ≥12 of 14 facts hold in all three manuals → we claim *the entry describes
  IKEA's general practice*, widen the `source` header, and keep the rules unchanged.
- **If** fewer than 12 hold → we split section 2 into IKEA-wide and product-specific
  facts, and revise any rule that rested on a product-specific one. METHOD.md then says
  sources must span different products, not just different documents.
- New shared devices found → added as facts. They don't become rules unless one
  replaces an existing rule on evidence; rules stay at 6.

**6. If not done.**
The library's only tested entry might be teaching agents bookcase habits as
universal rules, and every later entry would copy a method that never checked for that.

**Limits (known before running):** three products, one observer, and IKEA manuals are
centrally produced, so agreement may be high. That's a fact about IKEA, not a flaw in
the check.

**Result (2026-10-31):** second branch. **6 of 14 facts hold in all three manuals**
(below the 12 threshold).

Manuals: POÄNG `AA-2615392-1` (16 pp), MALM 6-drawer US `AA-2398382-2` (40 pp, 57 steps),
SKAFTET floor lamp `AA-2168957-4` (16 pp). Local copies in `sources/ikea/`.

| # | Fact | POÄNG | MALM | SKAFTET |
|---|---|---|---|---|
| 1 | No colour; warnings not red | holds | holds | holds |
| 2 | ≤2 greys, surface shading only | holds (`#BDBCBC`) | holds (`#D3D2D2`) | holds (little shading) |
| 3 | One family, two weights | holds | **varies** (+VerdanaIKEA) | holds |
| 4 | Step pages have no words | holds | **varies** (step 37 wall-type text) | holds |
| 5 | Step number largest, top-left | holds | holds | holds |
| 6 | Cover: name + drawing | holds | holds | holds |
| 7 | "Before you start" panels | holds (no wall panel) | holds (+two-person) | **varies** (help only) |
| 8 | Inventory with `Nx` + part no. | holds | holds | **varies** (no part nos.) |
| 9 | ~2 steps per page | **varies** (mostly 1) | **varies** (1–3) | **varies** (1) |
| 10 | Circular callout + leader | holds | holds | holds |
| 11 | Right/wrong X insets | holds | holds | **absent** |
| 12 | Warning repeated before its step | **absent** | holds | **absent** |
| 13 | Pointing hand; circular arrow | holds | holds | arrow only |
| 14 | Two line weights | holds | holds | holds |

Holding in all three: 1, 2, 5, 6, 10, 14.

**What the misses have in common.** Most of the misses aren't IKEA being inconsistent.
Facts 7, 8, 11, 12 and 13 are missing exactly where the product doesn't have the problem
they solve. SKAFTET has 6 distinct part types, so it needs no part numbers and no
right/wrong pairs. POÄNG has no tip-over risk, so it has no repeated warning. MALM is the
one product with a step where the reader must choose by their wall type, and it's the one
with text inside a step. So the entry now sorts facts into **constant**, **conditional**
(with the condition named) and **varies**, rather than listing them all as habits.

**Claim:** for these four IKEA products, the house style is constant in its visual
system: no colour, the same two greys (`#D3D2D2`, `#BDBCBC`) in products made years apart,
big step numbers, callouts and line weights. The instructional devices are conditional
on the task. Three BILLY manuals weren't enough to tell the two apart.

**Changes made:**
- Entry section 2 rewritten into constant / conditional / varies, with a per-product table.
- Rule 2 narrowed: text is allowed where the reader must choose from their own situation,
  as a short labelled choice.
- Rule 3 narrowed: IDs only where items could be confused.
- Rule 5 tightened: right/wrong pairs and warnings *only* at a real risk.
- Rules 1, 4, 6 unchanged.
- Entry `source` widened and a version note added. **The changed rules haven't been
  blind-tested**; C-001/C-002 tested the BILLY-only version (`a1b6df2`).
- `METHOD.md` step 1: sources must span different products/tasks, not just documents.

**Also found:** after-assembly "how to use it" pages in all three, and an ⓘ info marker
for guidance panels in all three. MALM-only devices (numbered bags, branch tracks, page
cross-references, QR code) appear with its complexity (57 steps).

**Closed:** 2026-10-31

---

## C-002 · Does the human-sourced entry beat a reference the agent writes for itself?

**Status:** closed
**Opened:** 2026-10-31
**From:** T-001

**1. Where we are.**
In C-001 the page built with the IKEA-derived entry won the blind pick over a page
built with no guidance, but that agent also spent ~9× the time and wrote ~9× the code.

**2. What we are doing.**
Run a third agent on the C-001 brief, telling it to first write its own design
reference in the same five-part format (no real source allowed), then build from it,
and put its page against the C-001 with-entry page in a blind pick.

Inputs, fixed before running:
- **Brief:** identical to C-001 (replace a bicycle chain; self-contained HTML/CSS/SVG).
- **Self-reference instruction:** before building, write
  `runs/c002/self-reference.md` with the same five sections as the IKEA entry —
  problem, observed facts, why it works, 6 transferable rules, when it doesn't apply —
  invented from the agent's own judgment, not from any named real-world source.
  Then build the page following it.
- **Opponent:** `runs/c001/arm-b.html`, unchanged.
- **Agent:** same model, fresh session, no access to `library/` or `runs/c001/`.

Measures:
- **Blind pick, two questions,** pages shown as page 1 / page 2 in random order:
  (a) *which one would I point to as not looking AI-made?* (same as C-001)
  (b) *which one would I rather have open while actually doing the job with greasy hands?*
- **Effort:** minutes and file size, recorded for both.
- **Convergence:** does the self-reference independently arrive at IKEA-like rules?
  Count how many of the IKEA entry's 6 rules appear in its 6 (0–6).

**3. Why.**
We don't know whether C-001's win came from what the entry *says* (a real human
solution) or just from having *any* structured reference to work against. If it's the
second, the library's value is the format, and the human sources are decoration.

**4. What is affected.**
- C-001's claim: kept as stated, or narrowed to "a structured reference helps".
- Whether the library needs human sources at all — i.e. the whole premise.
- T-001 → answered.

**5. Conclusion.**
- **If** the IKEA-entry page wins both (a) and (b) → we claim *human-sourced content
  adds something a self-written reference doesn't*; the library premise stands and
  entry #2 is worth writing.
- **If** the self-reference page wins both or they split → we claim *in this test, the
  gain came from having a structured reference, not from the human source*; the next
  card asks what a human source gives that self-direction can't (e.g. a source the
  model wouldn't think of) before writing more entries.
- **Convergence side-result:** if the self-reference shares ≥4/6 rules with the IKEA
  entry, the model already "knows" IKEA-style instruction design, and the bike-chain
  brief was too easy to show the library's value; a harder test needs a source the
  model doesn't default to.

**6. If not done.**
We'd keep building a library of human sources on a result that may just mean "give
the agent a plan first", which costs nothing and needs no library.

**Limits (known before running):** n = 1, one brief, author is judge, and arm B was
built ~1 hour earlier in a different run. Kills or keeps the premise for this brief; doesn't
generalise.

**Result (2026-10-31):** first branch. Outputs in `runs/c002/`.

| | (a) less AI-made | (b) use with greasy hands | Words outside drawings | Time | Size |
|---|---|---|---|---|---|
| IKEA entry (`c001/arm-b.html`) | **won** | **won** | 414 | ~13 min | 202 KB |
| Self-reference (`c002/arm-c.html`) | lost | lost | 1,649 | ~6 min | 36 KB |
| *(C-001 no guidance, for reference)* | — | — | 1,140 | ~1.5 min | 22 KB |

Saif, before the reveal: page 2 (self-reference) "is sooooooo text heavy."

- **Convergence: 2/6** (below the ≥4 threshold). The self-reference independently
  reached big step numerals with a checkable end state ("Done when:"), and warnings
  placed only before the irreversible step. Partly reached: leader-line labels (but
  no magnified callouts), key facts before step 1 (but no parts IDs reused in steps).
  Not reached at all: *the picture carries the instruction* (it planned 2–5 written
  instructions per step), right/wrong pairs, and monochrome (it chose one accent colour).
- Its reasoning was good. It described a reader glancing from the bike, and still
  produced the wordiest page of the three. Of everything in the IKEA entry, the rule
  that made the difference was the one the model didn't come up with: let the drawing
  do the instructing.
- Its palette, which it was told to invent, was warm paper `#F3EFE6` with signal orange
  `#C8471A`. That's the same cream-and-terracotta look as C-001's no-guidance page, so it
  went back to the current default even when asked to make something original (feeds T-004).

**Claim:** for this brief, the human-sourced entry beat a reference the agent wrote for
itself in the same format, on both questions. It cut the page's words by about 4× (414 vs 1,649).
So having *a* structured reference isn't enough. What the source says matters.

**Not settled:** effort. The IKEA-entry agent still spent ~2× the time and ~5.6× the code
of the self-reference agent. Some of that is probably the content itself (drawing-led
rules take more SVG), but this run can't separate the two.

**Closed:** 2026-10-31

---

## C-001 · Does one human-sourced style entry change what an agent builds?

**Status:** closed
**Opened:** 2026-10-31

**Goal (clarified 2026-10-31):** the library holds UX/UI knowledge learned from
real human-made solutions, filed by the *problem* it solves, so an agent building
something new can borrow the reasoning. It does not copy brands or catalogue looks.

**1. Where we are.**
One entry exists, `library/step-by-step-instructions/ikea-assembly-instructions.md`,
built from three official IKEA BILLY manuals. Its format hasn't been tested on an agent.

**2. What we are doing.**
Give a fresh coding agent the same fixed brief twice, once alone and once with that
entry, then score both outputs against the measures below.

Inputs, fixed before running:
- **Brief (identical both arms):** "Build a single-page website that shows someone how
  to replace the chain on a bicycle. Self-contained HTML/CSS, no external images —
  draw anything you need with SVG or CSS."
  A bike chain, not a bookcase, so this tests whether the entry *transfers* to a new
  task rather than whether the agent can redo IKEA.
- **Entry:** the file above. Five-part format (source, observed facts, reasoning,
  transferable rules, when it doesn't apply) with exactly 6 transferable rules.
- **Agent:** same model, fresh session, no other context, one shot per arm.

Measures, per arm:
- **Rules applied (0–6):** how many of the entry's 6 rules are visibly present.
- **Default markers (0–5):** count present of — Inter/system-ui as primary face;
  gradient background or accent; rounded cards with drop shadow; centered hero with
  headline + subhead + button; indigo/purple/violet accent.
- **Blind pick:** Saif sees both pages unlabeled (order randomized) and answers one
  question — *which one would I point to as not looking AI-made?*

**3. Why.**
We don't know whether a written entry carries enough to move an agent off its defaults,
or whether the output just becomes a different generic look. The whole library is a
bet on the first; this is the cheapest test of it.

**4. What is affected.**
- The entry template (five-part format) — kept or revised.
- `library/step-by-step-instructions/ikea-assembly-instructions.md` — kept as entry #1 or rewritten.
- Whether entry #2 is written in this format at all.

**5. Conclusion.**
- **If** the entry arm applies ≥4/6 rules, has ≤1 default marker, **and** wins the
  blind pick → we claim *the five-part format carries a style into an agent's output*,
  and the next card writes entry #2 in the same format.
- **If** it applies the rules but keeps ≥2 default markers or loses the blind pick →
  we claim *rules alone get followed literally but don't change the look*; the next
  card tests adding measured tokens or a reference image to the entry.
- **If** it applies <4/6 rules → we claim *the entry isn't being used*; the problem is
  wording or placement, not content.

**6. If not done.**
We'd write dozens of entries in a format that may not change agent output at all, and
find out only after the collection exists.

**Limits (known before running):** n = 1 per arm, one brief, one model, and the blind
judge is the author. Good enough to kill a bad format; not enough to claim the format
works in general.

**Result (2026-10-31):** first branch. Outputs in `runs/c001/`.

| | Rules applied | Default markers | Blind pick |
|---|---|---|---|
| With entry (`arm-b.html`) | 6/6 | 0/5 | **won** (shown as page 1) |
| No entry (`arm-a.html`) | 0/6 | 0/5 | lost |

- With entry: steps 1–11 each led by a huge numeral and a line drawing with one short
  caption; a parts grid (P1–P2, T1–T4, each `1×`/`2×`) whose IDs reappear inside the
  steps; circular magnified callouts; crossed-out wrong/right insets; black/white/grey
  only, Helvetica; a CAUTION panel repeated right before step 9.
- No entry: a text-led article (serif headings, paragraphs per step, orange accent,
  "REQUIRED/HELPFUL" badges, per-step "Done" checkboxes). Saif: "retro, 1980s… looks
  cool, but it's not a manual, more like a presentation."
- Saif on the winner: "it has a genuine touch and a visual style", but needs more
  detail to feel like a proper manual.

**Claim:** for this brief, the five-part entry carried a human solution's structure
into the agent's output and moved it to a page the author judged more like real work.

**What the run showed was wrong with the card itself:**
1. *The default-marker measure didn't discriminate.* Both arms scored 0/5. The
   no-entry page avoided every 2023-style tell (Inter, gradients, purple, centered
   hero) and had a different default instead: cream background, serif headline,
   one terracotta accent, pill badges. The marker list describes an old default and
   needs replacing before it is used again.
2. *Effort confound.* The with-entry agent took ~13 min and wrote 202 KB; the
   no-entry agent took ~1.5 min and wrote 22 KB. Part of the difference may be "had a
   reference to work against" rather than "this entry's content". T-001 (agent invents
   its own style first) controls for this.

**Closed:** 2026-10-31
