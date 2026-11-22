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

## C-021 · Can darning stitches be laid on the ground cloth's own threads, so that their counts, their alignment to the threads and their direction all read back?

**Status:** closed
**Opened:** 2026-11-22

**1. Where we are.**
Lumenary's phulkari model darns on a grid of picture cells, not on the threads of a cloth, because nothing wove the
cloth (C-018). `weave-draft` now does (C-019). Sources describe phulkari as darning in untwisted floss silk (pat) on
hand-woven cotton (khaddar), worked from the back so the long floats show on the face, in horizontal, vertical and
diagonal darning that forms geometric patterns, and bagh as covering the whole ground; none of those read describes
counting the ground's threads, though darning follows them by its nature.

**2. What we are doing.**
Write `engine/core/darning.js`: floss stitches laid along the ground's own picks (horizontal) or ends (vertical),
each float over a set number of ground threads and each pick-up under a set number, staggered row to row, in blocks
with their own direction, with untwisted floss's spread and its sheen, which depends on the stitch's direction
against the light; then read the counts, the alignment, the direction and the coverage back from the image.

**3. Why.**
We don't know whether stitches tied to the cloth's threads can be told, from the image alone, from stitches laid on a
grid that ignores them (as Lumenary's are), or whether the direction-dependent sheen that phulkari is known for comes
through as a measurable difference between blocks.

**4. What is affected.**
- `engine/core/darning.js`, its check, sheet and demo; the engine bundle.
- `processes/primitives.md`: a `counted-darning` entry; the darning-stitch processes' pages.
- The atlas's phulkari and bagh, and darned embroideries elsewhere.

**5. Conclusion.**
Read from images only, at the default imperfections:
- counts: the most common float and pick-up, in ground threads, equal the plan, for horizontal and vertical blocks;
- alignment: the median distance from a stitch's end to the nearest ground-thread boundary (threads counted in the
  image) is at most 0.15 of a thread, and a control with stitches on a free grid, as Lumenary's are, is above 0.2;
- direction: at least 95 % of blocks read back with their planned direction;
- sheen: under side light, horizontal blocks are at least 15 % brighter than vertical ones, and within 5 % with the
  sheen off;
- coverage: in a bagh the ground shows through at most 5 % of the covered area.
- **If** all hold → we claim *darning on the cloth's own threads is covered*.
- **If** everything but alignment holds → the stitches don't follow the threads closely enough to tell from a free
  grid, and the card says by how much.
- **If** the sheen difference doesn't show → the floss's sheen is modelled without its dependence on direction.

**6. If not done.**
Phulkari and bagh, the atlas's most named embroidery after chikankari, stay stitched on picture cells, and the
direction-dependent light their makers worked for stays unmeasured.

**Limits (known before running):** the floss is a layer over the ground, as in C-020; the back (short pick-ups) is
drawn for completeness, not measured; "15 % brighter" is a property of the model's light, not a measurement of real
pat silk; likeness to a real phulkari is a later blind pick.

**Result (2026-11-22):** none of the three branches as written: four of the five criteria hold and the fifth, which
no branch anticipated, fails. **At the default imperfections, from the image alone: floats and pick-ups read back as
planned (5 and 1); stitch ends sit on the ground's threads (median 0.0 of a thread, against 0.25 for the free-grid
control); all 8 blocks read back with their direction; under side light horizontal blocks are 21 % brighter than
vertical ones, and 1 % with the sheen off. But a bagh leaves 18 % of its ground bare, against the 5 % allowed.**

**Why the bagh fails.** With a float of 5 and a pick-up of 1, a sixth of every row is pick-up, where the ground shows:
the 18 % follows from the counts. Sources describe bagh as covering the ground entirely. Two explanations, untested:
bagh's floats are much longer than its pick-ups, on finer khaddar; or the floss spreads over the pick-ups. The defaults
were not changed to pass; T-022 is the measurement against real bagh.

**Checks on the checks.** The alignment control only differs from aligned stitches when the threads are uneven: with
the imperfections off both read 0.0, as they should. Two bugs in the check were found and fixed before these numbers:
blocks had no stable identity (fixed in `blocks()`, which now returns the same object for the same block), and the
pick-up count was limited to gaps between two whole stitches clear of a block's edges, which a 6-thread repeat in a
12-thread block rarely allows. Sweep: counts, direction and sheen hold at three times the default imperfections;
alignment holds at twice (aligned 0.111 against 0.286) and fails at three times, where the control falls to 0.2.

**Claim:** darning on the cloth's own threads is covered: its counts, its alignment to the threads, its direction and
its direction-dependent sheen all read back, and it can be told from stitches laid on a grid. A bagh's full coverage
is not covered yet.

**Changes made:**
- `engine/core/darning.js` (`darned`, `blocks`, `PLANS`); the engine bundle rebuilt with it.
- `engine/check/darning.mjs`, `darning-sheet.mjs`; `engine/demo/darning.html` (checked by running its script against
  the bundle: it paints).
- `processes/primitives.md`: the `counted-darning` entry, with what it doesn't cover.
- `threads.md`: T-022, the bagh's coverage.
- `runs/c021/check.json`, `runs/c021/darning-sheet.png`.

**Closed:** 2026-11-22

---

## C-020 · Can a supplementary weft lie over the woven ground so that motif, binding and ground all read back, and the back tells continuous from discontinuous?

**Status:** closed
**Opened:** 2026-11-22

**1. Where we are.**
`weave-draft` (C-019) weaves a ground from a draft and reads back through its imperfections. Supplementary weft,
the extra non-structural weft that makes the figure in jamdani and Banarasi brocade, isn't covered by any primitive
(C-018). Sources describe two kinds: discontinuous, where the extra weft is laid only inside each motif (jamdani, put
in by hand with small spools; Banarasi kadhua, with no floats on the back between figures), and continuous, running
selvedge to selvedge with floats on the back, which in Banarasi cutwork are clipped afterwards.

**2. What we are doing.**
Write `engine/core/supplementary.js`: a thicker extra weft laid over a `weave-draft` ground along pattern lines, on
the face where a motif bitmap says, tied down by a binding warp end every so many ends, in three kinds (discontinuous,
continuous, cutwork), seen from the face or the back; then read the motif, the binding, the ground and the kind back
from the rendered cloth alone.

**3. Why.**
We don't know whether laying an extra weft over the ground keeps the ground's structure readable around the motifs,
or whether one primitive can carry both kinds in a way that only the back tells apart, as it does on the loom.

**4. What is affected.**
- `engine/core/supplementary.js`, its check, sheet and demo; `engine/core/weave.js` returns its thread geometry so
  the extra weft lies on the same threads.
- `processes/primitives.md`: a `supplementary-weft` entry; the gap list.
- The atlas elements it serves: jamdani, Banarasi brocade and the named handloom saris with woven figures.

**5. Conclusion.**
Read back from images only, at the default imperfections, over three motifs:
- face: the motif recovered with IoU of at least 0.9 once binding points are closed; no float on the face longer than
  the binding allows;
- ground: outside the motifs, the ground's structure reads back as in C-019;
- back: each of the three kinds is told apart by how much extra weft shows outside the motifs (9 cases).
- **If** all hold → we claim *supplementary weft is covered*, in both kinds.
- **If** the face and ground hold but the back can't tell the kinds apart → the kinds are drawn alike, and the card
  says what the back is missing.
- **If** the ground stops reading back around the motifs → laying the extra weft disturbs the ground, and the card
  says how.

**6. If not done.**
Jamdani and brocade, two of the atlas's most named weaves, stay out of reach, and so do most of the woven saris among
its geographical indications.

**Limits (known before running):** the extra weft is drawn as a layer over the ground along pattern lines, not as
picks inserted into the ground's sequence; how a jamdani weaver forms the shed for each motif pick wasn't found in the
sources read. The read-back assigns pixels to cells by nominal thread spacing. Likeness to real jamdani or brocade is a
later blind pick.

**Result (2026-11-22):** first branch, after a fault in the read-back was found and fixed. **Over three figures (a
stepped buti, a kalka, a vine border with buti) and three kinds, read from the image alone at the default
imperfections: the figure is recovered exactly (IoU 1.0), no face float is longer than the binding allows (5 ends at
most with a binding end every 6), the ground reads back as plain weave around the figures, and the back tells all
nine cases apart** (outside the figures: continuous 1.0 covered; cutwork 0.58-0.69 beside the figure and 0 beyond it;
discontinuous 0).

**The fault, recorded.** The first run assigned pixels to cells by the nominal thread spacing, as the card's limits
said it would. With the imperfections off everything passed; at the defaults the figure read back at IoU 0.49-0.70
while the ground and the back still passed. Uneven yarn and beat add up across the cloth until the real threads sit up
to half a thread from where a ruler puts them. The read-back now counts threads in the image (`trackBoundaries` in
`engine/check/readback.mjs`): each next boundary is the lowest point of the warp or weft colour's profile within 0.6
to 1.45 thread-spacings of the last. It still uses no knowledge of the figure; it uses the weaving plan a reader would
know (ground picks per pattern line, the binding interval), which is how "once binding points are closed" in the
conclusion was applied: the figure is compared with itself less its binding points.

**Can it fail?** Each figure's face read against the other figures scores IoU 0.11-0.16 (0 of 6 pass). The kinds are
three-way: all nine read correctly. Imperfections: all nine pass at 1.5 and twice the defaults, none at three times.

**Claim:** supplementary weft is covered, in both kinds and cutwork. The face is the same for all three, as on the
loom; the back tells them apart.

**Changes made:**
- `engine/core/supplementary.js` (`figured`, `bitmap`, `layout`, `band`, `MOTIFS`); `engine/core/weave.js` returns its
  thread geometry (checked byte for byte: its images are unchanged).
- `engine/check/readback.mjs`, shared by both checks (the weave check gives the same results on it);
  `engine/check/supplementary.mjs`, `supplementary-sheet.mjs`; `engine/demo/supplementary.html`.
- `processes/primitives.md`: the `supplementary-weft` entry.
- `runs/c020/check.json`, `runs/c020/supplementary-sheet.png`.

**Closed:** 2026-11-22

---

## C-019 · Can one primitive weave plain, twill, basket and satin from a draft, and keep the structure readable through the cloth's imperfections?

**Status:** closed
**Opened:** 2026-11-22

**1. Where we are.**
C-018 found no primitive for weave structure: Lumenary's three weaving models (tapestry, Navajo, kente) shade rounded
threads and repeat cells, but nothing takes a draft (which warp end is up at each crossing). Supplementary weft
(jamdani, brocade) and darning on the cloth's own threads (phulkari) can't be built until one does.

**2. What we are doing.**
Write `engine/core/weave.js`: a drawdown from a weaving draft (threading, tie-up, treadling) or a named structure,
and cloth rendered from it with seeded imperfections (yarn thickness, uneven beating, wavy threads, gaps between
threads), then check the structure by reading it back from the rendered image alone.

**3. Why.**
We don't know whether one draft-driven primitive can carry the four basic structures, or whether its imperfections,
which are what keep it from reading as a filter (C-012, C-013), would blur the structure a weaver would recognise.

**4. What is affected.**
- `engine/core/weave.js`, `engine/check/weave.mjs`, `engine/demo/weave.html`, new; the first code in `engine/`.
- `processes/primitives.md`: a `weave-draft` entry; the weaving processes' pages.
- Cards for supplementary weft and darning, which build on it.

**5. Conclusion.**
The read-back uses only the image and the nominal thread spacing a weaver would know (ends and picks per unit): float
lengths along warp and weft, and how the pattern repeats along the two diagonals.
- **If** all four structures read back correctly with the imperfections at their defaults → we claim *weave structure
  is covered*: the primitive is the base for supplementary weft and darning.
- **If** they read back only with the imperfections off → we claim *the imperfections, as modelled, destroy the
  structure*: the defaults are cut until they don't, and the card records where that line is.
- **If** a structure doesn't read back even with the imperfections off → the drawdown or the read-back is wrong for
  it, and the card says which.

**6. If not done.**
Every woven element in the atlas (about 80 named handloom weaves, khes, sussi, mashru, dhurries) stays a picture
filter with stripes, and jamdani and phulkari have nothing to sit on.

**Limits (known before running):** the read-back checks structure, not likeness: whether the cloth looks like a real
mashru or khes is a later blind pick against photographs. The draft notation is the standard four-part one; double
cloth and other multi-layer weaves are out of scope.

**Result (2026-11-22):** first branch. **All seven structures (plain; twill 2/2, 3/1 and 1/3; basket 2/2; five-end
satin and sateen) read back correctly from the rendered cloth alone, with the imperfections off and at their
defaults: float lengths exact, and 100 % agreement on how the pattern repeats along the diagonals.** A four-part draft
(straight draw on four shafts, 2/2 twill tie-up, treadles in order) gives the same drawdown as the named 2/2 twill.

**Can the check fail?** Read against every other structure's expectations, 0 of 42 wrong pairs pass. The first
version let twill 2/2 pass as basket 2/2, because it only checked the offsets strong in the *expected* structure, and
basket's are a subset of twill's; the check now also requires that offsets strong in the image are predicted. The
fault was in the read-back, not the weave.

**Where the imperfections start to hide the structure:** all seven read back at 1.5 times the default slub, beat,
wobble and fibre; at twice, plain weave fails (6 of 7); at three times, 2 of 7; at four, none. The defaults have about
half again of headroom.

**Claim:** weave structure is covered. `weave-draft` is the base for supplementary weft and for darning on the cloth's
own threads. What the check doesn't show is likeness: whether a satin with striped warp looks like a real mashru, or a
coarse plain weave like khaddar, is for a blind pick against photographs once the atlas has samples of them.

**Changes made:**
- `engine/core/weave.js`, `engine/core/random.js`: the first code in patternbook's engine.
- `engine/check/weave.mjs` (the read-back, the confusion test, the sweep), `weave-sheet.mjs` and `png.mjs` (a PNG
  writer with no dependencies); `engine/demo/weave.html`, a page with the structure's drawdown and every dial.
- `processes/primitives.md`: the `weave-draft` entry, and a note under the gaps that warp and weft is now covered.
- `tools/process_models.mjs`: the generated line for a primitive no Lumenary model applies now says so plainly.
- `runs/c019/check.json`, `runs/c019/weave-sheet.png`.

**Closed:** 2026-11-22

---

## C-018 · How much of Lumenary's maths is shared operations, and how much is written once per treatment?

**Status:** closed
**Opened:** 2026-11-22

**1. Where we are.**
The 214 models (C-017) carry 610 equations with notes; Lumenary's six foundation pages cover the tools every treatment
shares. In the code, the engine exports 82 helper functions and 57 of them are imported by three or more treatments,
nearly all low-level (pixel access, seeded randomness, smoothing, blurs, noise, edges, colour conversion, palette
matching, clustering); only a few are craft-level (cloth fill, carved stone, wood fill, star polygons).
`processes/primitives.md` doesn't exist.

**2. What we are doing.**
Tag each of the 610 equations with the primitives it applies, from a vocabulary built first from the foundation pages,
the shared code and a sample of the equations and then frozen, marking the equations that apply no shared operation
as written for one treatment; then write `processes/primitives.md` from the tags.

**3. Why.**
We don't know whether the treatments are mostly composed from shared operations or mostly bespoke maths. The answer
says whether the atlas's new treatments can be written by composing primitives (and so whether primitives become the
engine's core), and which operations the subcontinent's processes need that no treatment has yet.

**4. What is affected.**
- `processes/primitives.md`, new; the `primitives` fields of the 214 models and of the 82 process pages.
- Whether `engine/core/` (`docs/architecture.md` section 7) is built around primitives.
- METHOD 2c step 4, which would then write an element's maths by composing them.

**5. Conclusion.**
A primitive counts as shared when three or more models apply it.
- **If** at least 70 % of the 610 equations apply a shared primitive, and 40 or fewer shared primitives cover them →
  we claim *Lumenary's maths is compositional*: primitives become the engine's core, and new treatments are written
  mainly by composing them.
- **If** under 50 % → we claim *it is mostly bespoke*: `primitives.md` records the shared parts, and new treatments are
  written per process, with no core library yet.
- **Between 50 and 70 %** → mixed: record which families compose and which don't, and build the core only for the
  families that compose.
- Recorded either way: the operations the subcontinent's processes need that no primitive covers yet.

**6. If not done.**
Each new treatment re-derives operations already written dozens of times over, and METHOD 2c step 4 has nothing to
compose from.

**Limits (known before running):** the vocabulary is one classifier's; where one primitive ends and the next begins is
a judgment, so the count of primitives matters less than the share of equations covered; an equation can apply
several primitives; his equations describe his code, which may simplify the physics.

**Result (2026-11-22):** first branch on the headline; the middle band once foundation-level operations are set aside.
**489 of the 610 equations (80 %) apply a shared primitive, and 31 shared primitives are enough to reach 70 % of all
equations** (the best 10 reach 46 %, the best 20 reach 60 %, the best 40 reach 75 %). 68 primitives were applied, 58 of
them shared. The other 116 equations are bespoke: 85 written for one treatment (41 of them geometric constructions:
Penrose tilings, L-systems, reaction-diffusion), 25 layout, 6 constants.

**The card's wording, recorded.** "40 or fewer shared primitives cover them" can be read as the number needed to reach
the 70 % (31: met) or as the number of shared primitives in all (58: not met). The card's limits, written before the
run, said the count matters less than the share covered, so the first reading is taken; both are stated here.

**How much it depends on judgment.** Without the 18 primitives added after the freeze: 69.2 %, just under the line.
Without foundation-level operations that carry no craft (seeded random numbers, smoothstep, tone curves, blur, simple
blends): 65.9 %, the middle band. By class, the making classes compose most: drawing 92 %, printing 91 %, photographic
91 %, stitch 88 %, carving and glaze 94 % (fewer equations); geometric constructions least (59 %), then styles (63 %)
and digital effects (74 %). Without the foundation-level operations the making classes still hold up (stitch 84 %,
carving 88 %, glaze 81 %, drawing 78 %, printing 71 %), while photographic drops to 52 % and cutting to 43 %.

**Claim:** Lumenary's maths is compositional at the level of image operations, and its craft classes compose at the
level of craft operations too. Either reading points the same way: build `engine/core/` around the primitives the
making families use (tone-modulated line and dot screens, lattice repeats, relief shading and tone-to-height,
misregistration, crackle networks, stitch grids, resist masks), and write geometric constructions per treatment.

**The equations undercount the code.** Shared helpers are imported far more widely than their operations are written
down: blur by 89 treatments against 17 models' equations, saturation changes 59 against 10, palette snapping 26
against 10, brightness from RGB 19 against none.

**What the subcontinent's crafts need that no primitive covers yet:** supplementary weft (jamdani, brocade) and chain
stitch (aari, tambour, Kutch and Sindh chain work), not at all; weave structure from a draft, darning on the cloth's
own threads, glaze with thickness (pooling, breaking, slip trailing), several dye baths in sequence (ajrak's resist,
mordant and overdyeing), cutting inlay from veined stone, the mirror inset with its ring of holding stitches, and light
through a thick pierced screen, only in part. Multi-block registration is covered by composing misregistration,
lattice repeat and multiply blend; low relief and pierced screens are covered.

**Changes made:**
- `processes/primitives.md`, new: the 71 entries with their maths, the helpers that implement them, a generated
  "Applied by" line each, and the gaps above.
- `processes/models/lumenary-equation-tags.tsv`: the 610 tags. The 214 model files gain `primitives` and per-equation
  tags; the 82 process pages gain their `primitives` line.
- `tools/process_models.mjs`: reads the tags; refreshes the "Applied by" lines (a second run changes nothing).
- `runs/c018/`: the summary with its hard calls, the vocabulary as frozen before tagging and as final, the code-import
  counts.
- `docs/architecture.md` section 7b: the result, and which primitives `engine/core/` starts from.

**Closed:** 2026-11-22

---

## C-017 · How many physical processes lie behind Lumenary's 214 treatments?

**Status:** closed
**Opened:** 2026-11-22

**1. Where we are.**
Lumenary's data (`vendor/lumenary/src/data`) holds 214 entries in 14 sections with 610 equations; patternbook's process
library (`processes/`) has a template and no pages. By section, 113 entries sit where physical making is the subject
(light and glass, physical feel, print and craft, painterly, photographic, world, Sindhi, South Asian and Islamic) and
101 where it isn't (design movements, digital, typographic, geometric and generative, motion, subject-aware).

**2. What we are doing.**
Convert all 214 entries into patternbook's model format: one machine-readable model per entry (its steps, equations,
dials, facts, history and credit), each filed under the physical process it models or marked as not a physical
process (a style, a machine's effect, a geometric construction), with a process page at "listed" for every process
found. The vendored data is read, never changed.

**3. Why.**
We don't know how many distinct processes the 214 looks come down to, how many models each process gets, or how much
of Lumenary is about making at all. The answer decides whether the process library can be seeded from Lumenary or
has to be written mainly from other sources.

**4. What is affected.**
- `processes/`: the models, the process pages it creates, `index.md`.
- `processes/primitives.md`, seeded from the shared operations the models use.
- T-019 (giving each atlas element its process) builds on the processes this card finds.

**5. Conclusion.**
- **If** at least half the entries model a physical process and those entries fall into at most a third as many
  processes (three or more models per process on average) → we claim *the process is the right unit and Lumenary is a
  strong seed*: process pages start from his models.
- **If** fewer than half model a physical process, or the processes are nearly as many as the entries → we claim
  *Lumenary is mostly a catalogue of looks*: its entries are kept as models of looks, and process pages are written
  mainly from other sources.
- Recorded either way: models per process, and the processes no subcontinent element in the atlas seems to use.

**6. If not done.**
The process library stays an empty template, and Lumenary stays 214 filters arranged by its own sections.

**Limits (known before running):** "physical process" against "style" is a judgment for some entries (a risograph is
a process, Bauhaus is a style, a glitch is a machine's fault); the rule is written down and applied the same way to
all 214. His "how" steps describe what his code does, which can differ from the physical process it imitates. One
classifier.

**Result (2026-11-22):** neither branch as written; the second in substance. **115 of the 214 entries (54 %) imitate
a physical process, and they fall into 82 processes: 1.4 models per process, with 59 processes holding a single
model.** The first branch needed three or more per process and fails on that alone. The second needed fewer than half
to be physical, or processes nearly as many as the entries; 82 against 115 is closer to that than to a third.

| | entries |
|---|---|
| imitate a physical process | 88 |
| a style, genre or tradition that rests on one process it also imitates | 27 |
| imitate none: geometric constructions 40, digital effects 22, styles 20, motion 15, subject-aware 2 | 99 |

Processes with the most models: halftone screening, relief carving and tin-glaze painting (four each); intaglio
engraving, screen printing, paper cutting, pen and ink (three each). By family: printing 20 models, painting 14, optical
devices 13, drawing 12, stitch 11, photographic 11, carving, cutting and glaze 5 each, the rest fewer.

**Claim:** Lumenary is broad rather than deep in processes. Just over half of it imitates physical making, spread
across 82 processes, most of them once. So a process page can start from his model for its maths and dials, but the
rest of it (the process itself, its constraints, its imperfections, its variants across traditions) has to be written
mainly from other sources. His entries stay as credited models either way.

**Checks on the result:** five design movements were filed as styles resting on a print process (Art Deco and
Victorian on engraving, retro and pop art on screen printing, Swiss design on halftone), against the brief, which named
Art Deco as a style; flipping them leaves 110 physical (51 %), still 82 processes, 1.3 per process. The finding doesn't
move.

**A fault in the brief, recorded:** it named Hala blue pottery as a variant of tin-glaze painting, and the classifier
followed it. That ware is usually described as painted on a white slip under an alkaline glaze. The tin-glaze page
carries the note. **A gap in the card:** its two branches left the middle open (between one-third and "nearly as
many"), and the result landed there. Not done here: the processes no atlas element uses (needs T-019) and
`primitives.md`.

**Changes made:**
- `processes/models/lumenary/`: 214 model files, each crediting Lumenary and his commit; `processes/models/lumenary-map.tsv`: the classification.
- `processes/`: 82 process pages at "listed", each holding its models; `index.md`.
- `tools/process_models.mjs`: the converter. It reads `vendor/lumenary/` and never writes to it, and regenerates only
  the block between a page's markers.
- `runs/c017/classification-summary.md`: the classifier's rule, counts and hard calls.

**Closed:** 2026-11-22

---

## C-016 · Is the atlas's lean toward India Wikipedia's, or the subject's? (Pakistan's textiles and dress)

**Status:** closed
**Opened:** 2026-11-22

**1. Where we are.**
C-015 found 227 elements in Textiles and dress from English Wikipedia alone: 73 of them attested for Pakistan, 92
attested for India and no other country.

**2. What we are doing.**
Re-enumerate Pakistan's textiles and dress from sources other than English Wikipedia (Pakistan's geographical-indication
register, Lok Virsa, UNESCO's intangible-heritage lists, public-domain colonial surveys such as the *Journal of Indian
Art and Industry* and the provincial monographs and district gazetteers, *Colours of the Indus* as a study-only source,
and the Urdu, Sindhi, Punjabi (Shahmukhi) and Pashto Wikipedias), each element with a source, and compare with C-015's
73. Pashto is added to the list because Khyber Pakhtunkhwa's dress would otherwise have no source in its own language.

Alongside it, not as part of the measure: every source on the list of other sources (registers, monument lists,
UNESCO, craft institutions, books, regional Wikipedias, ArchNet, Wiki Loves Monuments, open museum collections, old
photograph archives) is checked for what it covers, how it can be reached and what may be reused, and recorded in
`references/sources.md`.

**3. Why.**
We don't know whether English Wikipedia undercounts Pakistan, or whether the subcontinent's textiles really lean
toward India in what is named and documented. The answer decides whether each country needs its own sources before
its permutation passes.

**4. What is affected.**
- T-016's answer, and the atlas's source plan per country.
- `atlas/textiles-and-dress.md`: elements and Pakistani attestations the new sources add, each with its source.
- `atlas/coverage.md`'s country counts.
- `references/sources.md`, new: where the atlas looks, and what each source allows.

**5. Conclusion.**
Counted as Pakistan's textile elements after the pass: C-015's 73, plus elements new to the atlas, plus atlas elements
newly attested for Pakistan.
- **If** that rises by at least 50 % (37 or more) → we claim *English Wikipedia is the bottleneck for Pakistan*, and
  every country gets its own source list before its permutation passes.
- **If** it rises by less than 20 % (under 15) → we claim *English Wikipedia was a fair first net for Pakistan's
  textiles*; the lean is mostly the subject's, or shared by every source we can reach.
- **Between** → English Wikipedia undercounts, not decisively; own sources for the thinnest countries and domains
  only.
- Recorded either way: how many of C-015's 73 the new sources confirm.

**6. If not done.**
The atlas treats one encyclopedia's skew as the shape of the subcontinent, and every sample inherits it.

**Limits (known before running):** one country, one domain; the sources differ in kind (a register lists products, a
survey lists crafts by district, an encyclopedia lists what volunteers wrote); Urdu, Sindhi, Punjabi and Pashto pages
are read through machine reading; whether a name is a new element or another name for one already listed is a
judgment, recorded each time.

**Result (2026-11-22):** first branch on the card's own measure. **Sources other than English Wikipedia add 45
textile and dress elements for Pakistan to C-015's 73 (+62 %): 38 new to the atlas, 7 already in it but not attested
for Pakistan.** Four of the 45 (jablo, polko, kanjri, paro) rest only on Sindhi Wikipedia, which may draw on English
Wikipedia; without them the rise is 41 (+56 %), still past the threshold. 51 of the 73 were confirmed; the other 22 were
not found in what was read, which is not the same as absent. 10 more names may be other names for listed elements
(`atlas/judgment-calls.md`).

Where the 45 came from (a row counts once for each source it cites): Pakistan's list of notified geographical
indications (30 October 2024) 45, Sindhi Wikipedia 23, the Peshawar district gazetteer (1897-98) 21, Baden-Powell's
hand-book of Punjab manufactures (1872) 20, the Sind gazetteer (1907) 18, Urdu Wikipedia 16, the Hazara gazetteer
(1907) 12, the V&A's collection 9, the Baluchistan gazetteer (1908) 8, the Chitral report (1928) 7, and a few others.
UNESCO's lists have no textile or dress element for Pakistan. Among the additions: hand block printing in Sindh
(attested by the 1907 gazetteer at Tatta, Karachi and Hyderabad; C-015 had it for India only), the chogha and shoqa
coats, pattu woollens of Chitral and Gilgit-Baltistan, the Kalasha dress and its shushut headdress, and the Kashmir
shawl, pashmina and sozni, which Azad Kashmir has notified.

**What the card did not answer, and why (design fault).** Its title asks whether the atlas's lean toward India is
Wikipedia's or the subject's. Its measure answers a narrower question: does English Wikipedia undercount Pakistan?
Yes, by at least 56 %. The same sweep would add Indian elements too (India's GI register lists 822, against the part
English Wikipedia shows; Indian-language Wikipedias; India's gazetteers), and no Indian arm was run, so the
India-to-Pakistan ratio after both sweeps is unknown. The card needed a control arm and didn't have one; the
reviewing agent named it. T-020 is that arm.

**The source register.** 41 sources checked (23 listed and 4 found along the way, some split into several rows):
14 usable now, 12 usable with effort, 9 study-only, 6 not reachable. The most useful for the thin countries: Sri
Lanka's Department of Archaeology map service (2,842 sites with Sinhala, Tamil and English names, period, district and
coordinates, through a public ArcGIS service that needs no key); Pakistan's notified GI list (194 entries, 108 of
them crafts and textiles, by province; only 17 GIs are registered, 5 of them crafts); Bangladesh's GI register (67
registered, about 16 crafts or textiles, in Bengali). Nothing found serves the Maldives; Nepal and Bhutan stay thin.
Along the way: the Met's search API was retired on 1 October 2026 and its replacement is paginated; UNESCO's World
Heritage data forbids scraping and modification (study-only); the Archaeological Survey of India refused automated
access (its lists came from archived copies); Wikimedia Commons timed out for the whole pass; Lok Virsa's national
inventory of intangible heritage (52 entries) is marked "All Rights Reserved". ArchNet's, the British Museum's and the
V&A's licence terms came from search-result quotes and are unconfirmed.

**Changes made:**
- `atlas/textiles-and-dress.md`: 38 elements added in a section of their own, not yet placed in families; 7 rows gain
  Pakistan with their sources; 51 rows gain their confirming sources. The atlas has 793 elements.
- `atlas/judgment-calls.md`: the 10 possible other names.
- `references/sources.md`, new: the register, and the keys the new rows cite.
- `tools/atlas_coverage.py`, new: coverage regenerated from the domain files (Pakistan 165 → 210 elements; India
  alone 334 → 329).
- `runs/c016/`: both passes' full output and request logs.
- T-016 partly answered. T-020 opened: the Indian arm. T-021 opened: the same craft notified on both sides of a
  border.

**Closed:** 2026-11-22

---

## C-015 · How much of the subcontinent's made world does a memory sketch miss?

**Status:** closed
**Opened:** 2026-11-22

**1. Where we are.**
`docs/atlas.md` has a first pass written from memory: architecture in 8 families and about 77 named elements, nine
other domains at family level only (about 46 named groups), and no element attested by any source.

**2. What we are doing.**
Enumerate every domain down to element level from sources (Wikipedia's category trees and list pages through its
API, Wikidata, and the geographical-indication registers of India, Pakistan and Bangladesh as listed on Wikipedia),
each element with at least one source URL, its regions (historical and modern country) and any named regional
varieties as candidate branches; then compare the result with the memory pass. Queries and fetches are saved in
`runs/c015/`.

**3. Why.**
We don't know how wide the subject is in countable terms, where memory was thin, or how unevenly the sources cover
the subcontinent's countries. The permutation passes (one element at a time, with samples) need a list that came
from sources, or they inherit memory's gaps.

**4. What is affected.**
- `docs/atlas.md`'s first pass, replaced by per-domain lists in `atlas/`.
- The order of the permutation passes (thin domains and regions early).
- The coverage baseline every later pass is measured against.

**5. Conclusion.**
- **If** elements found only by the sources make up at least 25 % of the final list → we claim *a memory sketch is
  not a fit basis for the atlas*, and every later pass starts from sources.
- **If** under 25 % → we claim *the memory sketch was a fair skeleton*, and sources mainly add attestations and
  branches.
- Either way: memory items no source attests are kept out of the atlas (listed separately, not deleted), and the
  share of elements attested only for India, against those attested for Pakistan, Bangladesh, Sri Lanka, Nepal,
  Bhutan or the Maldives, is recorded as the sources' bias to correct in sampling.

**6. If not done.**
Every permutation pass starts from a list one person remembered, and the atlas's gaps become invisible.

**Limits (known before running):** Wikipedia's categories are uneven and partly English-language framing; a Wikipedia
article attests that an element is named and documented, not what it looks like (that is the samples' job); "element"
against "branch" is a judgment call, recorded where it was hard.

**Result (2026-11-22):** first branch. **Of 755 elements found, 533 (71 %) came only from the sources.** A memory
sketch is not a fit basis for the atlas; every later pass starts from sources.

Three passes ran in parallel (architecture and gardens; textiles, jewellery and body; painting, crafts, script,
street and ritual), about 230 requests to English Wikipedia's API between them. Merged, with 14 elements found twice
filed once and four homonyms qualified:

| Domain | Elements | Candidate branches | In the first pass |
|---|---|---|---|
| Architecture | 184 | 60 | 75 |
| Gardens and water | 16 | 14 | 7 |
| Textiles and dress | 227 | 356 | 41 |
| Jewellery and adornment | 45 | 80 | 15 |
| Body and floor | 18 | 16 | 8 |
| Painting and depiction | 48 | 80 | 24 |
| Objects and crafts | 117 | 165 | 24 |
| Script and lettering | 63 | 8 | 15 |
| Street, transport and signs | 17 | 14 | 9 |
| Ritual and festival objects | 20 | 3 | 4 |
| **Total** | **755** (94 families) | **796** | **222** |

**What memory missed most:** Sri Lanka, Nepal, Bhutan and north-east India almost entirely (moonstones and guard
stones, dhunge dhara water spouts, Bhutan's thirteen arts, the Mizo puan and the mekhela sador); the parts of a temple;
Bengal's chala and ratna roofs; rest houses as a building type; the sari's named drapes (about 20) and about 80 named
handloom weaves; appliqué and metal-thread work; puppets and masks; about 40 scripts; archaeological wares.
About 40 first-pass items found no source (`atlas/unattested.md`).

**The sources' bias, recorded:** elements attested for India 504, Pakistan 165, Sri Lanka 69, Bangladesh 65, Nepal 53,
Bhutan 31, Maldives 9; 95 name no country; 334 (44 %) are attested for India alone.

**Limits that matter:** English Wikipedia only; India's geographical-indication table shows only part of the 822 it
claims, Pakistan has no list there and Bangladesh's is incomplete; about 50 rows rest on a navigation box or category
membership; some regions were inferred, not read (flagged in `atlas/judgment-calls.md`); rate limiting left some
first-pass items unqueried (unconfirmed, not disproved). All in `atlas/README.md`.

**Changes made:**
- `atlas/`: ten domain files, `coverage.md`, `unattested.md`, `boundary.md`, `judgment-calls.md`, `README.md`.
- `runs/c015/`: the three passes' full output, their request logs, `merge_atlas.py`, `stats.json`, and the memory
  sketch the card checked.
- `docs/atlas.md`: the memory sketch replaced by the enumeration's summary; the order of work now puts correcting
  the sources' bias before the first samples.
- T-016 opened: the sources' bias. T-017 opened: first-pass items never queried.

**Closed:** 2026-11-22

---

## C-014 · Does giving an agent the Lumenary engine move its pages off the AI look?

**Status:** closed
**Opened:** 2026-11-16

**1. Where we are.**
In C-005, unguided agents put a bakery, a wildlife-photography portfolio and a lentil-soup
recipe page on the same cream / terracotta / pill-badge base; the Lumenary engine (214
treatments) now runs in our tooling and hasn't been given to an agent.

**2. What we are doing.**
Give three fresh agents the C-005 briefs for the bakery, the photographer and the recipe,
word for word, adding only: make the page's pictures with the Lumenary engine
(`runs/c014/lumenary-for-agents.md` and `treatments/lumenary/CATALOG.md`). No style file, no
problem entry. Then blind-pick each new page against its C-005 counterpart.

Measures, per pair:
- **(a)** which looks less AI-made; **(b)** which site would I rather spend time on.
- C-005 default checklist (0–5) on the new pages, by eye for false hits.
- Which treatments each agent chose, and how many pictures it made.

**3. Why.**
We don't know whether better *pictures* alone change how a whole page reads. C-010's judge
named one picture tell ("polygon-ish") and four page tells; if the engine only fixes the
pictures, the pages may still read as AI-made.

**4. What is affected.**
- Whether the README tells agents to use the engine by default for imagery.
- The two-layer claim: if engine pages win, the top layer can move a page by itself; if they
  lose or tie, the bottom layer (guides) matters more, as C-010 suggested.

**5. Conclusion.**
- **If** the engine pages win (a) in at least 2 of 3 pairs → we claim *treated imagery alone
  moves pages off the AI look*, and the README points agents at the engine for pictures.
- **If** they win (a) in at most 1 → we claim *the engine improves pictures but not the page's
  reading*; the next card pairs the engine with a style file.
- (b) and the checklist score are recorded either way; a high checklist score on a winning
  page would mean the palette default survived while the pictures changed.

**6. If not done.**
We'd have an integrated engine and no evidence it helps an agent's page, which was the reason
to integrate it.

**Limits (known before running):** one run per brief; the C-005 pages were made two weeks
earlier, in a different session, by the same agent setup; the engine pages load one 631 KB
script and render pictures as they load; judge as before.

**Result (2026-11-16):** second branch on (a). **The engine pages won "less AI-made" in 1 of 3
pairs, and "rather spend time on" in 3 of 3.**

| Brief | (a) less AI-made | (b) rather spend time on | Pictures | Treatments the agent chose | Agent time |
|---|---|---|---|---|---|
| Bakery | **engine** | **engine** | 6 | risograph, screen-print, rubber-stamp | ~18 min |
| Wildlife photographer | tie ("I love both!") | **engine** | 12 | film-grain, cyanotype | ~34 min |
| Lentil soup recipe | C-005 (unguided) | **engine** | 3 | screen-print | ~16 min |

Saif, on the photographer pair: "I love both! I think these are basic examples to show the possible
power of the engine, but we can explore more usages and see what people would like."

**The page base didn't move.** All three engine pages are still on the agent's house style:
- cream backgrounds `#f4ecdc`, `#f1ede4`, `#f3eee1` (trait 1, 3/3) and warm near-black text (trait 2, 3/3)
- small uppercase labels (trait 4, 3/3) and serif type throughout (Iowan Old Style)
- one warm accent, now red rather than terracotta (`#b2372a`, `#c8381c`, `#a3160f`, hue 2–11°, just
  outside trait 3's 15–45°)
- no pill chips (trait 5, 0/3)

So, by eye, about 3 of 5 traits, with the accent shifted redder.

**Choice was narrow.** Out of 214 treatments, the three agents used 5, four of them from print and
craft or photographic sections (risograph, screen-print, cyanotype, film-grain, plus rubber-stamp).

**Claim:** for these briefs, giving an agent the engine made pages Saif would rather spend time on
every time, but it didn't consistently make them read as less AI-made (1 win, 1 loss, 1 tie). The
pictures changed and the page around them stayed on the default, which fits C-010: four of the
five tells the judge named are about the page, not the pictures.

**Limits that matter:** the judge can tell which page used the engine from its pictures, so these
pairs weren't blind in practice; one run per brief; the C-005 pages came from an earlier session.

**Changes made:**
- README: the engine is listed for imagery, with this result: it makes pages more appealing, and
  doesn't by itself remove the AI look.
- `tools/blind.sh` now rewrites relative asset paths in the blind copies (C-014's engine pages load
  the engine by a relative path, which broke inside `blind/`).
- T-014 opened: engine plus a style file. T-015 opened: other judges.

**Closed:** 2026-11-16

---

## C-013 · Does Lumenary's risograph ink model read as less "filtered" than our press?

**Status:** closed
**Opened:** 2026-11-16
**From:** T-013

**1. Where we are.**
In C-012 our `press` treatment made C-011's drawings read as printed and the page as less
AI-made, but Saif said the treated drawings looked filtered.

**2. What we are doing.**
Make a copy of `runs/c011/arm-b.html` with its 10 drawn elements printed by `riso` (our colour
separation plus Lumenary's risograph ink model and constants, default dials, same two inks
`#1a1a1a` / `#3f6e96`), and blind-pick it against C-012's `press`-treated page. Only the
printing model differs.

Measures:
- **(a)** which page looks less AI-made; **(b)** on which are the drawings more convincingly
  printed or hand-made; **(c)** which page's drawings look more filtered (or neither / both).

**3. Why.**
We don't know whether "filtered" came from *our* choice of imperfections (wobbling edges, ink
spread, dot-screened tints) or would come from any procedural print model. Lumenary's model
keeps edges where they are and uses only grain, uneven density and misregistration.

**4. What is affected.**
- Which print model the PS style file names as its candidate (`press`, `riso`, or neither).
- T-013: whether "filtered" is about the kind of imperfection, or about procedural imperfection itself.

**5. Conclusion.**
- **If** `riso` wins (c), with Saif calling the press page the more filtered one or neither
  filtered → we claim *the edge-distorting imperfections caused the filtered look*; `riso`
  replaces `press` as the PS style's candidate.
- **If** both still read as filtered, or `press` is less filtered → we claim *switching to
  Lumenary's ink model didn't fix it*; the next test is one of T-013's other candidates
  (uneven strength, treating text too, plain drawings).
- (a) and (b) are recorded either way.

**6. If not done.**
The PS style keeps a candidate treatment that the judge called filtered, and we don't learn
whether a second, independently built model avoids it.

**Limits (known before running):** n = 1; Saif has seen C-012's press page, so it may be
recognised; the two pages differ in more than one imperfection (no wobble or spread in `riso`;
grain instead of dot screen; ink density under 100%), so a result can't say *which* of those
mattered; `riso`'s light tints print sparser than their nominal coverage.

**Result (2026-11-16):** second branch. **`press` was the less filtered of the two; (a) and (b)
were ties.**

| | (a) less AI-made | (b) drawings convincingly printed | Looks more filtered |
|---|---|---|---|
| `riso` (`arm-b.html`, page 1) | tie | tie | **yes** |
| `press`, C-012 dials (`arm-a.html`, page 2) | tie | tie | no |

Saif: "Both are really good! One has darker lines, one has lighter lines." On (b): "Both are good!"
(The first blind pair opened only page 1 in Saif's browser; `tools/blind.sh` now opens the pages
one at a time and prints both links. The judgement above was made with both pages open.)

**What changed between them** (by construction, not tested separately): `riso` keeps edges where
they are, has no ink spread, lays tints as random grain instead of a dot screen, and never prints
ink fully solid (lines at about 80–95% black). That last one is the "lighter lines" Saif noticed.
Which of these made `riso` read as more filtered isn't known.

**Claim:** for this page, Lumenary's risograph ink model read as *more* filtered than our press,
while looking as good on the other two questions. So C-012's "filtered" wasn't caused only by
press's edge wobble and ink spread: a model without those still read as an effect, more so.

Read together with C-012, "filtered" is relative. The press page was the filtered one next to the
untreated page, and the less filtered one next to `riso`.

**Changes made:**
- `press` stays the PS style's candidate treatment (still not adopted: C-012's filtered finding stands).
- `riso` kept as a treatment, with this result in `treatments/theory/riso.md`.
- T-013 stays open, with a new candidate: solid ink. Lines printed below full density may read as
  processing (Saif's "lighter lines").

**Closed:** 2026-11-16

---

## C-012 · Does a press treatment on the drawings remove the "polygon-ish" tell?

**Status:** closed
**Opened:** 2026-11-16
**From:** T-012

**1. Where we are.**
C-011's PS-style page won both blind questions, but its drawings are crisp vector SVG, the kind
C-010's judge called "polygon-ish, no streaks, no flares"; the new `treatments/press` treatment
(two-colour letterpress: ink spread, edge wobble, misregistration, screened tints, grain) hasn't
been tested.

**2. What we are doing.**
Make a copy of `runs/c011/arm-b.html` whose 10 drawn elements (the title lettering and 9 drawings) are run through
`Treatments.treatAll('svg[role=img]', { treatment: 'press' })` with the page's own two inks
(`#1a1a1a`, `#3f6e96`), and blind-pick it against the untreated original. Nothing else differs.

Measures:
- **Blind pick:** (a) which page looks less AI-made; (b) on which page do the drawings look
  printed or hand-made rather than computer-drawn.
- **One more question:** does either page's drawings look "filtered", like an effect laid on top?
- Treatment time on load.

**3. Why.**
We don't know whether the top layer can fix the one C-010 tell that the guides can't, or
whether a procedural imitation of printing just reads as a new kind of filter.

**4. What is affected.**
- Whether `treatments/` becomes a tested part of the library, and whether the PS style file
  names `press` as its treatment.
- METHOD.md's two-layer claim (that the drawing tell belongs to a separate layer).
- T-012's answer.

**5. Conclusion.**
- **If** the treated page wins (a) and (b), and Saif doesn't call it filtered → we claim *a
  treatment derived from the printing process removes the drawing tell on top of a page the
  guides already got right*. The PS style file names `press`.
- **If** it wins (b) but Saif calls it filtered → we claim *it reads as printed, but as an
  effect*; tune the dials down and retest before adopting.
- **If** it loses (a) or (b) → we claim *this treatment didn't help*; the drawing tell needs
  something other than print imperfections (better drawing, not better printing).

**6. If not done.**
The top layer stays an idea, and the PS winner keeps its polygon-ish drawings.

**Limits (known before running):** n = 1; Saif has seen the untreated page in C-011, so it may
be recognised; the treatment was written by me, so I chose its strength (dials used: wobble 0.45, spread
0.35, grain 0.25, starve 0.2, others default; set gentler than the defaults after a look, before
the pick); same judge who named the tell. Seen before the pick: the smallest lettering inside
drawings ("30 SECONDS") thickens with the ink spread and gets harder to read.

**Result (2026-11-16):** second branch. **The treated page won both looks questions, and
Saif called its drawings filtered.**

| | (a) less AI-made | (b) drawings look printed / hand-made | Looks filtered? |
|---|---|---|---|
| Press-treated (`arm-b.html`, page 2) | **won** | **won** | **yes** |
| Untreated C-011 winner (`arm-a.html`, page 1) | lost | lost | no |

Treatment cost on load: about 100 ms for 10 elements in headless Chromium.

So the top layer did what the guides couldn't: on this page, it moved the drawings away from
"computer-drawn" and the whole page with them. But it's visible *as* a treatment. The judge can
see that an effect was applied, which is the risk METHOD.md's two-layer note named (the same
filter everywhere becomes its own look).

**Candidate reasons it reads as filtered** (from looking at the pages; not tested):
1. **Everything got the same treatment, equally.** A real press run is uneven across a sheet;
   here every drawing has the same wobble, grain and speckle density.
2. **The drawings were already "hand-drawn" vectors.** C-011's agent drew wobbly, hatched SVG,
   and printing it adds a second layer of fake imperfection on top of the first.
3. **The small lettering inside drawings thickened**, which looks like processing more than
   like ink.
4. **The text around the drawings is untreated.** On a real printed page the body type would
   carry the same ink spread, so treated drawings beside crisp text stand out.

**Claim:** for this page, a press treatment derived from the printing process made the
drawings and the page read as less AI-made, but as treated. It isn't adopted into the PS style
file yet; per the card, tune it and retest first.

**Changes made:**
- PS style file: `press` named as a *candidate* treatment with the C-012 result, not as adopted.
- `treatments/README.md`: the C-012 result.
- T-012 answered (partly); T-013 opened: what stops it reading as filtered.

**Closed:** 2026-11-16

---

## C-011 · Does a "human touch" style from PS Magazine fix what the judge called cold and empty?

**Status:** closed
**Opened:** 2026-10-31
**From:** T-010

**1. Where we are.**
In C-010 the judge called the C-008 line-art page (our only style win) "cold… very unhuman"
with an "almost non existent" header, and named enthusiastic copy and "polygon-ish" drawings
as AI tells on others.

**2. What we are doing.**
Give two fresh agents the C-007/C-008 router-troubleshooting brief, one with the line-art style
(`technical-line-art-monochrome.md`, including its C-010 note) and one with the new
`hand-inked-two-colour-field-magazine.md` (from PS Magazine 1953 and 1961), then blind-pick.
The comparison arm is the best style we have, not the default, so the bar is higher than in C-008.

Measures:
- **Blind pick:** (a) which looks less AI-made; (b) which would I rather have open when my
  internet is down.
- **Judge's tells** (METHOD.md, from C-010): Saif writes one line per page on what gives it
  away, and I count how many of the five C-010 tells each page gets.
- Words, time, size; style adherence by eye.

**3. Why.**
We don't know whether the things the judge said were missing (marks and texture in drawings,
a real header, a plain voice, density) can be supplied by a written style, or whether "human
touch" is something an agent can't produce from instructions.

**4. What is affected.**
- Whether the hand-inked style joins the library as a tested style.
- The judge's checklist: confirmed as something a style can act on, or not.
- T-010's answer.

**5. Conclusion.**
- **If** the PS-style page wins (a) and gets fewer judge's tells than the line-art page →
  we claim *a written style can supply some of the human touch the judge found missing*.
- **If** it wins (a) but the judge still names tells like "polygon-ish" or "uncanny voice" →
  we claim *it moved the needle but agents can't yet carry the hand-made qualities*;
  record which tells survived.
- **If** it loses (a) → we claim *this style didn't help*, and say whether the drawing,
  the voice or the layout is the likely reason, from the judge's notes.

**6. If not done.**
The library's style axis stays at "less AI-made than the default", with no attempt at what
the judge actually asked for.

**Limits (known before running):** n = 1 per arm; same judge, who wrote the tells this style
targets (risk of rewarding the style for matching the judge's words); agents can't really
hand-ink; PS's voice was written for 1950s soldiers.

**Result (2026-10-31):** first branch on the picks. **The PS-style page won both questions**
against the line-art style, our previous best.

| | (a) less AI-made | (b) use while internet is down | Words | Time | Size |
|---|---|---|---|---|---|
| PS Magazine style (`arm-b.html`, page 1) | **won** | **won** | 1,450 | ~4 min | 52 KB |
| Line-art style (`arm-a.html`, page 2) | lost | lost | 730 | ~4 min | 28 KB |

Saif on (b): "Page 1! But it is bit harder to navigate the technical details, unlike page 2."

The PS page did what the file asked: white page, `#1A1A1A` ink, one spot blue `#3F6E96` (46
uses, plus its tint `#C9D6E2`), a Century Schoolbook body serif, 5 SVG hatch patterns, and 4
roughening filters (`feTurbulence`/`feDisplacementMap`) so lines aren't perfect. It's about twice
as dense in words as the line-art page, which is the density the file asked for.

**Not collected:** Saif's per-page tells. The session ended here, so the card's second
measure ("fewer judge's tells") is unanswered, and so is whether any of the five C-010 tells
survived.

**Claim:** for this brief, a style file written to supply what the judge said was missing
(marked, textured drawing; a real header; a plain voice; density) produced a page the judge
found less AI-made *and* preferred to use, against the best previous style. The cost Saif
named is navigation: technical details were harder to find than on the cleaner page.

**Limits that matter:** n = 1; the judge wrote the tells the style was built against; tells
weren't collected; 2× the words, so density and style aren't separated.

**Changes made:**
- Hand-inked style: `tested_in: [C-011]`, `best_example`, a note on the navigation cost.
- T-010 partly answered; T-011 opened (keep the human touch, fix navigation).

**Closed:** 2026-10-31

---

## C-010 · What does the human judge actually see as AI-made?

**Status:** closed
**Opened:** 2026-10-31
**From:** T-009

**1. Where we are.**
The C-005 palette checklist failed to predict Saif's "AI-made" judgement twice (C-007, C-009):
pages scoring 0/5 were still called AI-made.

**2. What we are doing.**
Saif writes, for each of six judged pages shown shuffled as A–F (`runs/c010/sheet.html`;
mapping in `runs/c010/order.txt`, not shown), the specific elements that read as AI-made.
I then sort every named element into "already on the C-005 checklist" or "not on it".

The six: both arms of C-007, C-008 and C-009 (router ×4, CLI docs ×2), including the one
page Saif judged *less* AI-made (C-008 line-art).

**3. Why.**
We don't know what the judge is reacting to. Every "less AI-made" result in this project
rests on that judgement, and the only automated measure we have doesn't track it.

**4. What is affected.**
- METHOD.md's default checklist: kept, extended, or replaced by one drawn from the judge's words.
- Candidate reasons in C-009 (typographic style reads as AI; broken margin; familiar docs layout).
- What the next art-style file must avoid.

**5. Conclusion.**
- **If** at least half the elements Saif names are not on the C-005 checklist → we claim *the
  palette checklist measures the wrong thing*, and build a new checklist from Saif's words
  (elements named on ≥2 pages).
- **If** most named elements are already on it → we claim *the checklist names the right
  things but misses how they combine*, and keep it with a note.
- Either way: if the C-008 line-art page gets the fewest named elements, that's consistent
  with its blind win; if it doesn't, the C-008 win needs re-examining.

**6. If not done.**
Every "less AI-made" claim keeps resting on a measure we can't explain, and new styles get
written to avoid tells nobody has named.

**Limits (known before running):** one judge, who has already seen these pages and knows some
results; written answers, so things that are hard to name may be missed; I do the sorting.

**Result (2026-10-31):** first branch, and the side check went against C-008.

Saif's notes, matched to pages after answering (`runs/c010/order.txt`):

| | Page | Saif's words |
|---|---|---|
| A | C-008 IKEA line-art style (won C-008) | "the wide margins are so… neat and clean, it has an unremarkable cold finish that makes it very unhuman, the top part is always so empty and fragile, and little, the header section is almost non existent, and goes right off into the part assuming you know what you are looking for" |
| B | C-008 unguided | "The language is very… enthusiastic, very unnatural and uncanny like" |
| C | C-007 unguided (won "would use") | "Visuals are very polygon-ish, no streaks, no flares, none of that human-touch" |
| D | C-009 NASA style | "Empty spaces" |
| E | C-009 unguided | "Very standard — fitting perhaps, as a very technical page" |
| F | C-007 troubleshooting entry | "Too much text!" |

**Elements named, sorted:**

| Element | Pages | On the C-005 checklist? |
|---|---|---|
| Too-clean, empty white space; cold, sterile finish | A, D | no |
| Missing or weak header; no orientation before the content | A | no |
| Enthusiastic, uncanny copy voice | B | no |
| Perfect, geometric vector drawings with no texture or marks | C | no |
| Too much text | F | no |
| Generic, standard layout (but "fitting") | E | partly: that's what the checklist's five traits add up to |

**Not one element Saif named is a palette trait.** Cream, terracotta, pills and eyebrows (the
whole C-005 checklist) weren't mentioned on any page. So the checklist was measuring
something real (the agent's default) but not what this judge reads as AI-made.

**The element named twice is emptiness, and it was named on both human-style pages** (A IKEA
line art, D NASA typographic). Both style files carried over print's generous white space.
On screen, Saif reads that as cold and unhuman.

**Side check: the C-008 line-art page got the *most* criticism (3 elements), not the fewest.**
That doesn't contradict its blind win, which was relative ("less AI-made than the other
page"), and the other page's uncanny copy may have decided it. But it means C-008 showed
*less AI-made than the default*, not *reads as human*. The README and art-style file
overstated it.

**Claim:** for this judge, a page reads as AI-made through emptiness and sterility, copy voice,
perfect vector drawing, and too much text, not through palette. The two human-sourced styles
so far fixed the palette and brought emptiness with them.

**Changes made:**
- METHOD.md: a second checklist, **the judge's checklist**, from Saif's words; the palette
  checklist is kept but relabelled as "the agent's default", not "AI-looking".
- README and the line-art style file: C-008 restated as relative ("less AI-made than the
  default"), with C-010's criticism attached.
- Both style files: a note that print's white space read as cold and empty on screen.
- T-010 opened: what does "human touch" look like on a web page? (Saif's words: streaks,
  flares, a real header, a voice that isn't enthusiastic.)

**Closed:** 2026-10-31

---

## C-009 · Does a second, unrelated human art style also move a page off the AI look?

**Status:** closed
**Opened:** 2026-10-31

**1. Where we are.**
C-008's art style (IKEA line art) won both blind questions on its own, but it was taken from an
entry that had already won twice, so we have one style and it was picked for success.

**2. What we are doing.**
Write an art-style file from the NASA Graphics Standards Manual (NHB 1430.2, January 1976,
public domain), then give two fresh agents C-005's CLI-docs brief, one with that style file
and one with no guidance, and blind-pick the two pages.

The CLI-docs brief is chosen because its unguided page in C-005 was the clearest case of the
default overriding the subject (cream `#f6f3ec` + orange `#c2410c` for a command-line tool).

Measures:
- **Blind pick:** (a) which looks less AI-made [primary]; (b) which would I rather use to
  learn and look up this tool.
- **Default checklist (0–5)**, by eye for false hits.
- **Style adherence (0–6)**, fixed before the run from `swiss-grid-helvetica-red.md`:
  (1) white page; (2) only black, one red near `#CC273D`, warm grey, with no pastels;
  (3) Helvetica, headings Medium/Bold, upper and lower case, no all-caps labels;
  (4) flush left, nothing centred; (5) a visible column grid with thin rules and a white
  top band; (6) square corners, no shadows, gradients or pills.
- Words, time, size.

**3. Why.**
We don't know whether "a human-sourced art style moves the page off the default" holds in
general, or only for IKEA's line art, which happens to come with drawing devices that also
pulled in structure (C-008).

**4. What is affected.**
- C-008's claim: widened to human-sourced styles in general, or kept to that one style.
- `library/art-styles/` gets a second entry, or a note that only one has been shown to work.
- The README's claim about the art-style axis.

**5. Conclusion.**
- **If** the NASA-style page wins (a) → we claim *two unrelated human design systems each
  moved a page off the AI look on a subject they weren't made for*; the style axis is worth
  growing.
- **If** it ties or loses (a) → we claim *C-008's result may be specific to the IKEA style*,
  and the next card has to work out what that style has that this one doesn't.
- (b) is recorded either way. A win on (a) with a loss on (b) means the style hurt
  usability for docs.

**6. If not done.**
The style axis rests on one style that was chosen because it had already won.

**Limits (known before running):** n = 1 per arm; same judge; NASA's manual is about
identity (logo, stationery, vehicles, signage), not web pages, so the style file is my
translation. Its logo and "worm" logotype must not appear, and the page must not imitate NASA.

**Result (2026-10-31):** second branch. **(a) a tie: "Both look AI-made". (b) the unguided
page won.**

| | (a) less AI-made | (b) learn and look up | Style adherence | Default checklist | Words | Time | Size |
|---|---|---|---|---|---|---|---|
| NASA-derived style (`arm-b.html`, page 2) | tie | lost | ~5.5/6 | 0/5 | 627 | ~1.5 min | 24 KB |
| No guidance (`arm-a.html`, page 1) | tie | **won** | — | 5/5 | 650 | ~1.5 min | 25 KB |

Same length, same time, same size, so effort isn't the explanation.

**The styled page followed the file closely.** It had a white page, black ink, red `#CC273D` only
on the download panel and code highlights, Helvetica Light/Bold in upper and lower case, flush
left, a black navigation bar with numbered sections, a box diagram in an outline, thin rules,
and square corners throughout. It lost half a point because its code blocks used a lighter
pink `#FF6B7D` for red on black. It also had a **layout flaw the style file didn't cause**:
`body { margin: 0 }` with no side gutter, so the giant "Sift" heading and the body text run
right up against the left edge of the window.

**The unguided page was the full default again:** cream `#f7f5f0`, warm near-black text,
terracotta `#b4521f`, a monospace orange eyebrow, pills, rounded cards, and its font stack
names Inter.

So the checklist scored the two pages 0/5 and 5/5, and Saif called both AI-made and preferred
the default one to use. **The palette checklist doesn't predict Saif's judgement** (also seen in
C-007).

**Claim:** for this brief, a second human-sourced style (NASA's 1976 typographic system) didn't
move the page off the AI look, unlike IKEA's line-art style in C-008. So C-008 doesn't
generalise to "any human style" yet.

**Candidate reasons, none tested:**
1. IKEA's style is **drawing-led**, so the page's main content became custom illustration. NASA's
   is **typographic**, and big Helvetica with black bars and a red block is itself a look agents
   produce when asked to be "bold" or "Swiss". It may read as a known AI alternative rather than
   as human work.
2. The missing side margin made the styled page look broken, which might read as "generated".
3. For (b), the unguided page had docs conventions Saif may simply be used to (search box, top
   nav, rounded quickstart steps). That's familiarity, not style.

The next card has to ask Saif *what* reads as AI-made on each page, rather than guessing.

**Changes made:**
- `swiss-grid-helvetica-red.md` is kept, with `tested_in: [C-009]` and a note that it lost.
- README: the art-style claim narrowed to "one of two styles has worked".
- T-009 opened: ask Saif to point at what reads as AI-made.

**Closed:** 2026-10-31

---

## C-008 · Does a human-sourced art style, given alone, stop a page looking AI-made?

**Status:** closed
**Opened:** 2026-10-31
**From:** T-003

**1. Where we are.**
In C-007 the unguided router page already had the right troubleshooting structure, and Saif
still called both pages AI-looking; IKEA's entry, whose rules are largely visual, won both
of its blind tests.

**2. What we are doing.**
Give two fresh agents the C-007 router-troubleshooting brief: one with no guidance, one with
only `library/art-styles/technical-line-art-monochrome.md` (IKEA's visual system, no
structural rules). Then put the two pages in a blind pick.

Both pages are new; Saif has seen C-007's.

Measures:
- **Blind pick:** (a) which looks less AI-made [primary]; (b) which would I rather have open
  when my internet is down.
- **Default checklist (0–5)** and `css-profile.py` on both.
- **Style adherence (0–6)** on the styled page: white page; ink + ≤2 greys only (status-light
  colour allowed per the file's exception); one sans family, two weights; line art with two
  weights; circular callout with leader; square corners / no pills or shadows.
- Words, time, size.

**3. Why.**
We don't know whether art style is a separate axis that can be moved from one problem to
another. If it is, the library should hold art styles as their own entries, apart from the
problem entries (T-003). If it isn't, IKEA's wins came from its style and structure together.

**4. What is affected.**
- Whether `library/art-styles/` stays as a separate axis, and the entry template's
  `art_style` field.
- T-008: whether the troubleshooting entry should borrow a visual style rather than more structure.
- The README's account of what makes a page look AI-made.

**5. Conclusion.**
- **If** the styled page wins (a) → we claim *a human-sourced art style moves a page off the
  AI look on its own, on a problem it wasn't drawn from*; art styles become their own axis.
- **If** it ties or loses (a) → we claim *the visual system alone doesn't remove the AI look*;
  what reads as AI-made lies elsewhere (layout patterns, copy, interaction), and the next card
  asks Saif to point at it.
- **If** it wins (a) but loses (b) → record that the style cost usability on this content
  (likely candidate: colour-coded status lights).

**6. If not done.**
We'd keep guessing whether "looks AI-made" is about visuals or structure, and T-008 would be
rewritten blind.

**Limits (known before running):** n = 1 per arm; same judge, who knows the hypothesis; the
art-style file's colour exception (for status lights) is mine, not from IKEA; the style file
was derived from an entry that already won, so it isn't a random style.

**Result (2026-10-31):** first branch. **The art-style page won both questions.**

| | (a) less AI-made | (b) use while internet is down | Style adherence | Default checklist | Words | Time | Size |
|---|---|---|---|---|---|---|---|
| Art style only (`arm-b.html`, page 1) | **won** | **won** | 6/6 | 2/5\* | 591 | ~3.5 min | 31 KB |
| No guidance (`arm-a.html`, page 2) | lost | lost | — | 5/5 | 609 | ~2.5 min | 34 KB |

\* Both of the styled page's checklist hits are false positives. Its ink `#231F20` falls inside
the "warm near-black" range because that range overlaps IKEA's ink, and its amber is the
status-light colour the style file allows. Its real default score is 0/5.

The two pages are nearly the same length (591 vs 609 words) and took similar time, so this
result isn't about how much content or effort went in, unlike C-001.

What the styled page did:
- White page, `#231F20` ink, Helvetica in two weights. Colour (green `#2E9E4F`, amber
  `#E59A0B`) appears **only on the drawn status-light dots**, which is the file's exception
  as written.
- Isometric line drawing of the router with a circular magnified callout joined by a leader
  line; numbered picture panels for each fix; square frames (4px radius), no pills, no shadows,
  no uppercase labels.
- It also organised the page as "1 Find the four lights → 2 Match the pattern → go to
  letter A/B/C/U", and each letter is a run of numbered picture panels. **The style file has
  no structural rules**, so this came from the agent combining the drawing devices with the
  task. Style and structure aren't fully separable: a visual system that's built around
  numbered drawings pulls the page toward step-by-step panels.

The unguided page again hit the full default: cream `#f4f1ea`, warm near-black text,
uppercase "TROUBLESHOOTING" eyebrow, pill chips, rounded shadowed cards.

**Claim:** for this brief, a visual system taken from a human source, with no structural
guidance, moved the page off the AI look and made it the one Saif would use. Read with C-007,
where the same problem with good *structure* still looked AI-made, the AI look here sat in
the visual language, not the organisation.

**What this doesn't show:** the style was taken from an entry that had already won, so a
random human style might do less; n = 1; the colour exception was mine and it was needed
(the page uses it); the styled agent couldn't screenshot its own work, and the unguided one's
ability to wasn't checked.

**Changes made:**
- `library/art-styles/` is kept as its own axis: `tested_in: [C-008]`, best example recorded.
- README: an agent picks a **problem entry and an art-style file**, separately.
- Template: `art_style` now points to a file in `library/art-styles/` when one exists.
- T-003 answered; T-008 updated (a troubleshooting page should pair structure with a style).

**Closed:** 2026-10-31

---

## C-007 · Does the troubleshooting entry beat the default on a router troubleshooting page?

**Status:** closed
**Opened:** 2026-10-31
**From:** T-007

**1. Where we are.**
Entry #2 (troubleshooting by symptom) found 6 devices constant across four makers in
C-006, and hasn't been tested on an agent.

**2. What we are doing.**
Give two fresh agents the same brief, a troubleshooting page for a home Wi-Fi router
(a product none of the four sources covers), one with entry #2 and one with no guidance,
and put the two pages in a blind pick.

Measures:
- **Blind pick, two questions:** (a) which looks less AI-made; (b) which would I rather
  have open when my internet is down and I'm trying to fix it.
- **Rules applied (0–6)** from entry #2's section 4, on both pages.
- **Default checklist (0–5)** from METHOD.md / C-005, on both pages.
- **Words outside drawings**, time, size.

**3. Why.**
We don't know whether the method works on a second problem. Entry #1's rules are mostly
visual (pictures, callouts, monochrome); entry #2's are mostly about structure (symptom
first, cause rows, escalation). It's possible that structural rules get followed and
still look like the default.

**4. What is affected.**
- Entry #2's `tested_in` / `best_example`, or a rewrite.
- The claim that the method transfers beyond its first problem.
- Whether entries need a visual section of their own when the source's rules are structural.

**5. Conclusion.**
- **If** the entry page wins both questions and applies ≥4/6 rules → we claim *the method
  works on a second problem*, and keep entry #2 as written.
- **If** it applies ≥4/6 rules but scores ≥3/5 on the default checklist, or loses (a) →
  we claim *structural rules carried, but the page still looks like the default*: entries
  whose source rules are structural need explicit visual guidance too.
- **If** it loses (b) → we claim *the structure the four makers share didn't make the page
  more usable for this reader*, and look at which rule got in the way.

**6. If not done.**
Entry #2 sits in a public library untested, and we don't know whether the method only
works for picture-heavy problems.

**Limits (known before running):** n = 1 per arm; same judge; the judge knows a test is
running and what the entry is about.

**Result (2026-10-31):** third branch: **the entry page lost (b)**, and (a) was a tie.

| | (a) less AI-made | (b) use while internet is down | Rules applied | Default checklist | Words | Time | Size |
|---|---|---|---|---|---|---|---|
| No guidance (`arm-a.html`, page 1) | tie | **won** | 5–6/6 | 4/5 | 399 | ~2.5 min | 35 KB |
| Entry #2 (`arm-b.html`, page 2) | tie | lost | 6/6 | 2/5 | 2,466 (6.2×) | ~2.5 min | 40 KB |

Saif: on (a), "Page 2 has way more detail, but I like the attempt of visualization on page 1.
Both look AI generated." On (b): page 1.

**The surprise was the no-guidance page, which already followed most of the entry.** Without
seeing the entry, it:
- led with symptoms in the reader's words ("No internet at all", "Internet is slow");
- showed the router's lights as they look, and you tap one to see what each state means (rule 2);
- went through causes cheapest first, one step at a time, stopping when fixed (rule 3);
- ended with a named escalation ("call your provider… tell them the Internet light is red")
  (rule 4);
- had not-a-fault states ("The router is on and working normally. Nothing to do.") (rule 5);
- kept restart and reset as separate procedures (rule 6).

So for this problem, most of what four makers share is something the agent already does.
That's unlike C-002, where the agent reached only 2 of 6 IKEA rules on its own. What the
entry *added* was what the printed manuals have because they're paper: an exhaustive symptom
index (19 symptoms), a light-state table, 6 error codes A–Z, an urgency tier. That came to
6× the words, and Saif found it heavier to use. The unguided page instead delivered the same
convention interactively: pick a symptom, get one check at a time.

**Claim:** for troubleshooting, entry #2 mostly restated what the agent already does, and its
paper-only parts (exhaustive index and tables) made the page worse to use in the moment. The
convention transferred; the printed form shouldn't have. This is inferred from one test and one
judge's comments.

**Other findings:**
- The default checklist scored the *less* preferred page lower (2/5 vs 4/5), and Saif called
  both AI-looking. A low checklist score doesn't mean "not AI-looking". The checklist catches the
  palette, not everything that reads as AI-made.
- Method gap: C-002's convergence check (what does the agent do unprompted?) should have come
  **before** writing entry #2, not after. An entry should carry what the agent doesn't already do.

**Changes made:**
- METHOD.md: a new step before writing an entry. Run one no-guidance baseline on a brief for
  the problem and list which candidate rules it already follows.
- Entry #2: version note and a section-5 limit (printed exhaustiveness doesn't carry to an
  interactive page); `tested_in: [C-007]`. Rules not rewritten on one test; T-008 opened.

**Closed:** 2026-10-31

---

## C-006 · Is there a cross-maker convention for troubleshooting-by-symptom in printed manuals?

**Status:** closed
**Opened:** 2026-10-31

**1. Where we are.**
The library has one entry (step-by-step instructions, IKEA), and C-003 showed that one
maker's manuals share a fixed visual system; we haven't looked at a second problem or at
whether *different* makers converge.

**2. What we are doing.**
Read the troubleshooting sections of official manuals from at least four different
manufacturers and product types, and sort every recurring device into constant /
conditional / varies, as METHOD.md step 1 says.

Candidate sources (official PDFs, chosen for spread): a dishwasher or washing machine,
a car owner's manual, a printer, and a router or other electronics. Final list recorded
in the result.

**3. Why.**
We don't know whether troubleshooting has a convention that holds across makers, the way
assembly has one inside IKEA. If it doesn't, an entry for it would just describe one
company's taste.

**4. What is affected.**
- Whether `library/troubleshooting-by-symptom/` gets an entry, and from how many sources.
- METHOD.md: whether "constant across makers" is a usable bar, or only "constant within a
  maker".
- T-003 gets a second art style to compare with IKEA's line art.

**5. Conclusion.**
- **If** ≥4 devices are constant across all four makers → we claim *troubleshooting-by-
  symptom has a cross-maker convention*, and write entry #2 from all four sources.
- **If** fewer than 4 are → we claim *troubleshooting design is maker-specific*, and write
  entry #2 from the one best source only, saying so in its section 1.

**6. If not done.**
The library stays one entry deep, and we don't learn whether the method works on a
problem where no single house style exists.

**Limits (known before running):** four documents; English-language editions; I choose
the sources, and "different product types" is only a rough guard against picking makers
who copy each other.

**Result (2026-10-31):** first branch. **6 devices are constant across all four makers.**

Sources: Miele dishwasher operating instructions (HG07, en-CA, pp 65–72); Brother
DCP-J152W Basic User's Guide (pp 39–46); Toyota Tacoma 2015 owner's manual OM04009U
(pp 476–480, 585–586); Garmin GPSMAP Touch online owner's manual (Troubleshooting + 2
topics). Local copies of the PDFs in `sources/troubleshooting/`. I couldn't get a router
manual: Netgear's download server returned 403, so the electronics slot is Garmin.

Constant in all four:
1. Entry point is the symptom in observable terms (never the component or cause).
2. Cause stated separately from the action.
3. Several causes under one symptom, each with its own fix.
4. Escalation is the last step, named ("Contact Miele Service", "your Toyota dealer"…).
5. Long fixes linked out to a full procedure instead of repeated.
6. Actions written as short imperatives (the weakest; most instructions do this).

Conditional (with condition named in the entry): symptom quoted exactly in its own
typeface (Miele `Z_NUM` display font for `F11`, Brother Courier New for LCD text, Toyota
icons; Garmin has no codes); causes ordered cheapest first (3/4); "not a fault" entries
(3/4, Brother partial); urgency tiers (Toyota only, the one product where a symptom can
be dangerous); scope statement; safety step before the fix; symptom index.

Varies: table vs. topic layout; grouping (by kind, alphabet, urgency, or flat); colour
(each maker uses at most one, for navigation only: Brother blue `#004FFF`, Toyota pink
`#F465BA`, Miele none); typeface (all plain sans: Helvetica Neue, Arial, Trade Gothic).

**Claim:** four makers with no shared house style organise troubleshooting the same way:
symptom first, as the reader observes it; one cause per row, then its fix; a named
escalation at the end; long fixes linked out. That convention comes from the problem,
not from a brand.

Even without the weakest constant (imperatives), 5 of 6 remain, so the result doesn't
hang on it.

**Changes made:**
- Entry #2: `library/troubleshooting-by-symptom/appliance-and-device-manuals.md`. Not
  blind-tested; that's the next card (T-007).
- T-003 gets a second art style: typographic tables, near-monochrome, one navigation colour.

**Closed:** 2026-10-31

---

## C-005 · What does an agent's page look like when nobody gives it a style?

**Status:** closed
**Opened:** 2026-10-31
**From:** T-004

**1. Where we are.**
C-001's "AI tells" checklist (Inter, gradients, purple, centered hero, shadowed cards)
scored 0/5 on both arms, and two runs (C-001 no-guidance, C-002 self-reference) instead
landed on cream background + serif headline + one orange accent.

**2. What we are doing.**
Run five fresh agents with no style guidance on five unrelated briefs, then extract each
page's colours, fonts, radii, shadows and gradients with a script, adding the two earlier
unguided pages for 7 samples in total.

Briefs, chosen so the subject would pull the palette different ways:
1. a neighbourhood bakery (subject suggests warm)
2. the docs homepage for an open-source command-line tool (suggests neutral/dark)
3. a portfolio for a wildlife photographer (suggests the photos, so muted)
4. a household energy-use dashboard (suggests green/blue)
5. a recipe page for lentil soup (suggests warm)

Same constraints as C-001: one self-contained HTML file, no external images, SVG/CSS for
drawings, fresh agent, no access to the repo, no skills. Prompts saved verbatim.

Measured per page (`tools/css-profile.py`): background colour; body text colour; accent
colours (non-grey hexes by frequency) and their hue; font stacks for headings and body;
border-radius values; box-shadow count; gradient count. Plus by eye from a screenshot:
centered hero, card grid, pill badges, serif headline.

**3. Why.**
We don't know whether the cream/serif/orange look seen twice is a fixed default that
appears whatever the subject, or a coincidence of two bike-chain pages. If it's fixed,
it's the thing the library exists to push against, and it's the checklist later cards need.

**4. What is affected.**
- C-001's default-marker measure: replaced, or dropped.
- METHOD.md's "known weaknesses" line about the AI default going stale.
- The README's framing of the problem (currently a claim, not a measurement).

**5. Conclusion.**
- **If** at least 3 traits each appear in ≥5 of the 7 pages → we claim *this model has a
  house style that holds across subjects*, write those traits as the new checklist, and
  record the exact values (hexes, font stacks).
- **If** fewer than 3 traits reach 5/7 → we claim *the unguided look follows the subject
  more than a house style*, and drop the default-marker measure instead of rebuilding it.
- Either way, record the accent hues of all 7 pages, so "always orange" can be checked
  directly.

**6. If not done.**
Every later card that asks "did the entry move the page off the default?" has no working
measure, and the project's founding complaint ("AI repeats the same palettes") stays
anecdotal.

**Limits (known before running):** one model (the same one that builds the test pages), so
this measures *this* agent's default, not "AI" in general; one run per brief; 2 of the 7
samples share a brief and one of those was told to be original; the trait threshold
(5/7) is chosen by me.

**Result (2026-10-31):** first branch. **5 traits reach ≥5 of 7 pages**, and two reach 7/7.
Pages in `runs/c005/`, measurements in `runs/c005/profile.txt` (`tools/css-profile.py`),
plus screenshots read by eye.

| Page (brief) | Background | Text | Main accent (hue) | Orange present? | Serif headline | Uppercase eyebrow | Pills |
|---|---|---|---|---|---|---|---|
| bakery | `#f7f1e6` | `#3b2a20` | `#b4622d` orange | ✓ | ✓ | ✓ | ✓ |
| CLI docs | `#f6f3ec` | `#1d1b17` | `#c2410c` orange | ✓ | — | ✓ | ✓ |
| wildlife photographer | `#f3efe6` | `#1d1f1a` | `#a4552a` / `#e4692a` orange | ✓ | ✓ | ✓ | ✓ |
| energy dashboard | `#f5f4ef` | `#1d1f1c` | `#2f6f4f` green | ✓ (`#b5562b` 2nd) | — | — | ✓ |
| lentil soup recipe | `#f7f1e6` | `#2b2420` | `#c4552b` orange | ✓ | ✓ | ✓ | — |
| C-001 bike chain, no guidance | `#f6f3ee` | `#1f1d1a` | `#c4501f` orange | ✓ | ✓ | ✓ | — |
| C-002 bike chain, told to be original | `#f3efe6` | `#1e1c18` | `#c8471a` orange | ✓ | — | ✓ | ✓ |

| Trait | Pages |
|---|---|
| Warm off-white background, never white (all within `#f3efe6`–`#f7f1e6`, plus `#f5f4ef`) | **7/7** |
| Warm near-black text, never pure black (`#1d1b17`–`#3b2a20`) | **7/7** |
| Orange/terracotta accent present (hue 15–45°, mostly `#b4…`–`#c8…`) | **7/7** (main accent in 6/7) |
| Uppercase, letter-spaced "eyebrow" label above headings | **6/7** |
| Pill-shaped chips/badges (radius ≥ 99px) | **5/7** |
| Serif headline | 4/7 (below threshold) |
| *Old C-001 tells:* Inter font | 0/7 |
| *Old C-001 tells:* purple/indigo accent | 0/7 |
| *Old C-001 tells:* gradients | 1/7 (bakery) |

The subject didn't move it. The CLI-docs page, which I expected to go neutral or dark, got
the cream paper and a `#c2410c` orange. The energy dashboard, which I expected to go
green/blue, did pick green first, but on the same cream, with orange for its "peak" data.
Being told to be original (C-002) changed none of the five traits.

**Claim:** with no style given, this agent builds every page on the same base: cream paper
(`#f3efe6`–`#f7f1e6`), warm near-black text, and a terracotta accent around `#c4501f`,
usually with uppercase eyebrow labels and pill chips. This held across 7 pages on 6
subjects. The 2023-era tells (Inter, purple, gradients) are gone, so a checklist built from
them can't detect the default.

**Changes made:**
- New default checklist (5 traits above) written into `METHOD.md`, with the hex ranges.
- `tools/css-profile.py` added; `profile.txt` saved with the run.
- README: the founding complaint now cites this measurement.

**Limits that matter for the claim:** all seven pages came from the same model that builds
the test pages, so this is *this agent's* default, not AI in general. One run per brief.
The subjects were chosen by me.

**Closed:** 2026-10-31

---

## C-004 · Do the C-003-revised rules still produce the better manual?

**Status:** closed
**Opened:** 2026-10-31
**From:** T-005

**1. Where we are.**
C-003 narrowed rules 2, 3 and 5 of the IKEA entry, and the revised entry hasn't been
blind-tested; the version that won C-001 and C-002 is `a1b6df2`.

**2. What we are doing.**
Run two fresh agents on the C-001 bike-chain brief, one with the old entry
(`runs/c004/entry-old.md`, from `a1b6df2`) and one with the revised entry
(`runs/c004/entry-new.md`, frozen copy), and put the two pages in a blind pick.

Both pages are new because Saif has seen `c001/arm-b.html` twice and would likely
recognise it.

Measures:
- **Blind pick, two questions** (same as C-002): (a) which looks less AI-made;
  (b) which would I rather have open while changing the chain with greasy hands.
- **Words outside drawings** (`tools/words.py`). Rule 2 now allows some text, so watch
  whether text creeps back. C-001's old-entry page had 414.
- **Devices at real risks.** Fixed now, before running: the real mistakes in replacing a
  chain are (i) routing it wrong through the rear derailleur, (ii) wrong chain length,
  (iii) quick link not fully seated/locked, (iv) chain on the wrong side of the
  derailleur tab or guide. For each page, count right/wrong pairs and step warnings,
  and how many sit at one of (i)–(iv). Devices elsewhere count as "no real risk".

**3. Why.**
We don't know whether narrowing rules 2, 3 and 5 kept what made the entry win, or
whether "use words where the reader must choose" and "devices only where needed" let
the page slide back toward text and lose its manual feel.

**4. What is affected.**
- Rules 2, 3, 5 of the IKEA entry: kept, or reverted to the `a1b6df2` wording.
- The entry's version note and `tested_in`.
- C-003's claim that the conditional reading is the better rule (it's only a reading
  of IKEA until an agent page shows it helps).

**5. Conclusion.**
- **If** the revised-entry page wins or ties both questions, has ≤ 2× the old page's
  words, and has no more "no real risk" devices than the old page → we claim *the
  revision is safe*. Keep it; mark it tested.
- **If** the revised-entry page loses both questions, or has > 2× the old page's
  words → we claim *the narrowing cost the entry what made it work*. Revert the
  narrowed rules to the `a1b6df2` wording, keeping C-003's facts in section 2.
- **If** the questions split → keep the revision, record the split, and look at
  which rule caused it before changing anything.

**6. If not done.**
The public entry's rules stay untested, and the only evidence that they work belongs
to a version that no longer exists.

**Limits (known before running):** n = 1 per arm; same judge as before; the revised
entry is ~40% longer (179 vs 129 lines), so length is mixed in with content; the
"real risks" list is mine, written from general bike-repair knowledge, not a source.

**Result (2026-10-31):** third branch: **the questions split.** Outputs in `runs/c004/`.

| | (a) less AI-made | (b) use while working | Words | Time | Size |
|---|---|---|---|---|---|
| Old entry (`arm-d.html`, page 1) | lost | **won** | 261 | ~9 min | 36 KB |
| Revised entry (`arm-e.html`, page 2) | **won** | lost | 324 (1.24×) | ~9 min | 98 KB |

Devices inside the steps, against the pre-stated risks (i) routing, (ii) length,
(iii) quick link locked, (iv) derailleur tab:

| | Right/wrong pairs | Step warnings | At a listed risk | Not at a listed risk |
|---|---|---|---|---|
| Old entry | 3 (steps 5, 6, 8) | 1 (before 8: hand on pedal, not chain) | 2: step 6 (iv), step 8 (iii) | 2: step 5 chain-end pair, pinch warning |
| Revised entry | 2 (steps 5, 6) | 1 (before 8: unlocked link can open) | 2: step 6 (i/iv), warning (iii) | 1: step 5 chain-end pair |

Both step-5 pairs (narrow vs wide chain end) guard a real mistake that my list missed,
and so does the old page's pinch warning. Counted strictly, as pre-registered.

So the revision passed the two counted checks: words stayed under 2×, and it had fewer
devices away from a listed risk (1 vs 2). It won (a) and lost (b).

**What differs between the pages** (observed; *which* rule caused the split is not yet known):
- The revised page turned the reader's choice (quick link vs connecting pin) into labelled
  branches (`B` / `C`) that run through steps 7–8 ("Join the ends: B or C", "only B"),
  plus a "which chain to buy" panel. That is rule 2's new allowance doing what it says.
  The old page handled the same choice as one line under step 2 ("No quick link? Push
  out any pin with T1, as in step 5").
- The revised page packs 10 steps into a dense 3-column boxed grid with ID boxes in
  most captions (`A` ×8, `B` ×6, `C` ×5, `T1` ×5). The old page uses 2 roomier columns,
  9 steps, and fewer IDs.
- The revised page adds an "After" section (oil it, check wear), from C-003's
  after-assembly finding.

**Saif's reason for (b):** "It was more concise, to me, but also laid it out step by step."

Read against the differences above: "step by step" fits the branching. The revised page
made the reader track a B/C path across steps 7–8, so the sequence stopped being one
line. "Concise" fits the word count (261 vs 324) and the fewer ID boxes. The source
backs this: MALM's only reader choice (wall type A/B/C) is confined to **one step**
(step 37), and the next step returns to a single path. The revised page spread its
choice over several steps, which IKEA doesn't do.

**Claim:** in this test, rule 2's new allowance for words at a reader's choice helped the
page look less AI-made, but letting that choice branch across several steps cost it
being the page Saif would use. The cause is inferred from one judge's sentence. It
wasn't isolated.

**Changes made:**
- Rule 2 tightened: a reader's choice is settled in one place (before step 1, or inside the
  single step where it matters, as a short A/B/C), and the steps after it follow one
  path. Not tested yet.
- Rules 3 and 5 kept as revised in C-003. The device count gave no reason to revert them.
- Entry `tested_in` gets C-004; version note updated.
- Density / roominess of the step layout isn't covered by any rule, so it goes to a thread (T-006)
  rather than becoming a rule on one comment.

**Closed:** 2026-10-31
**Closed:** —

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
