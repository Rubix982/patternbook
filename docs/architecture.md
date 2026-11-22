# patternbook: the subcontinent's visual vocabulary, encoded

_Proposal, 2026-11-22. Not agreed yet; the open decisions are at the end. Nothing in the repository is removed by it._

## 1. What patternbook becomes

patternbook started as a library of visual design knowledge learned from human-made work, for coding agents building
pages (C-001 to C-014). Its method turned out to be the valuable part: start from the process that made a look,
turn the process into numbers, and keep nothing that hasn't beaten something in a blind pick.

This proposal points that method at one subject, the art of the Indian subcontinent, and makes patternbook the
place where that art is described, encoded and combined:

> patternbook describes the subcontinent's art styles, ornament and made things from primary sources, encodes each one
> as a procedure with its maths written out, and combines them into designs that hold together.

Three things it does, in this order:

1. **Map what exists: the atlas** (`docs/atlas.md`). Every domain of made things (architecture, textiles,
   painting, objects, jewellery, script and more) broken into families, elements and the branches each element
   takes across regions, periods and materials, with real samples of each branch sourced from the internet and
   documented with their rights. Wide first, and before anything is made: a generator encodes one branch of one
   element, and the atlas is what says which branch, and what it leaves out.
2. **Encode deeply, one entry at a time.** For the entries that earn it, a description by METHOD step 2c (process,
   constraints, imperfections, equations, dials), a generator that makes it, and a measure that checks it against
   its references.
3. **Combine consistently.** Looks: chosen sets of palette, line, ornament, motif and style, with rules that make
   their parts agree, including hybrids across traditions where history gives a precedent.

## 2. What stays

- The pages shelf: `library/` problem entries and art styles, the cards C-001 to C-014, their runs and results.
  They stay as they are, and the subcontinent's work can feed it (a page built with a look is a fair test of the
  look).
- `METHOD.md`, the card protocol (`CARD.md`), `threads.md`, the blind pick, the judge's checklist.
- `treatments/` (ours: press, riso, halftone, hatch) and the studio page.
- `engine/`: Lumenary's engine, its files unchanged, as the base, with patternbook's own styles and process models
  (`engine/core/`) built on it; `NOTICE.md` lists everything received and where it is. Lumenary is Mursal Furqan
  Kumbhar's work; patternbook credits it wherever its code or theory is used, and offers improvements back to him
  rather than changing his files.

## 3. What it is not

- **Not a mash-up of "eastern" clichés.** The catalogue exists to keep Mughal, Rajput, Sindhi, Bengali, Kashmiri,
  Tamil and Newar work apart where they are apart, and to say where they really met.
- **Not a substitute for the crafts.** A generator makes something *after* ajrak or *in the manner of* phulkari. It is
  never presented as the craft itself, and the entry credits the communities who make it.
- **Not a redistribution of restricted images.** Study-only sources are described and measured, never copied into
  the repository (as `sources/` already works).
- **Not a fork of Lumenary.** His 214 treatments are image filters: a picture goes in and comes out changed.
  patternbook adds what filters can't do on their own (generators, pieces, compositions, a catalogue, measures) and
  uses his treatments where a picture is the input.

## 4. The kinds of thing it holds

Every entry is one of these kinds:

| Kind | What it is | Examples |
|---|---|---|
| **tradition** | a school, workshop practice or craft community, with its region, period and makers | Kangra painting; ajrak of Sindh and Kutch; Multani tile work; Kalighat painting |
| **process** | how something is physically made, with its constraints and habitual errors; shared across traditions and both shelves, so it lives at the top level in `processes/` (section 7b) | stone piercing; block printing with resist and mordant; darning stitch on khaddar; burnishing on wasli paper; pietra dura inlay |
| **motif** | a unit image with a name and, often, a meaning | buta (paisley); sarv (cypress); kamal (lotus); peacock; eight-point star; chinar leaf; mango |
| **ornament system** | rules that arrange motifs: a lattice, tiling, border, field, medallion, radial plan or stitch fill | jali lattice; girih strapwork; ajrak all-over repeat; manuscript border (hashiya) with rulings (jadval); shawl field and border; kolam dot grid |
| **piece** | a made thing or architectural element with proportions, parts and zones that carry ornament | jharokha; chhatri; cusped arch; carved door; surahi; diya; jhumka; charpai |
| **style** | a way of depicting: space, light, line, colour, figure conventions | Mughal miniature (high horizon, no cast shadow); Kangra (fine line, moonlight); Company painting; Bengal School wash; Ravi Varma's academic light |
| **palette** | colours as materials, with their historical pigment or dye and an sRGB approximation | lapis ultramarine, malachite, orpiment, Indian yellow, lac red, indigo, madder, shell gold |
| **look** | a composition profile: chosen palette, line, ornament, motifs and style, with rules that make them agree | a Mughal court look; a Sindhi bazaar look; a hybrid with a precedent |
| **treatment** | an image filter (Lumenary's or ours) | `mughal-jali`, `ajrak`, `phulkari`, `press` |
| **generator** | a procedure that makes an image or vector from settings alone, with no input picture | a jali panel; an ajrak repeat; a cusped-arch elevation; a manuscript page frame |
| **reference** | one source: a museum object, a book plate, a photograph, a paper | an open-access museum image; a plate from a public-domain book |

How they connect:

```
tradition ──uses──> process, motif, ornament system, palette, style
ornament system ──arranges──> motif            piece ──carries ornament in──> zones
generator ──implements──> ornament system | piece | motif | style
treatment ──renders──> style | process (over a picture)
look ──selects──> palette, style, ornament systems, motifs (+ generators, treatments)
every entry ──cites──> reference
```

The same motif appears in many traditions (the buta in Kashmiri shawls, in block prints, in mehndi). Shared motifs
and shared processes are what make a hybrid hold together, so they are first-class entries, not attributes of a
tradition.

## 5. The ladder: how an entry matures

Each entry carries a `status`. The catalogue counts entries at each rung, and that count is how "wide" and "deep" are
measured.

| Rung | What it needs |
|---|---|
| **mapped** | in the atlas (`docs/atlas.md`): an id, a kind, names (in English and the tradition's own script where there is one), region, period, its branches, and at least one sample for each branch it covers |
| **described** | METHOD 2c steps 1-3 written: the process, its constraints, its imperfections; at least 8 references across the variety it covers, each with its rights recorded; what is constant, conditional and varies (METHOD step 1) |
| **encoded** | a generator or treatment with the maths written out (2c steps 4-5), seeded, with dials |
| **checked** | the entry's measures run on its references and on the generator's output, with the numbers recorded |
| **judged** | a blind pick won (section 9) |
| **used** | part of a look that was itself judged |

Rules:

- Nothing skips a rung. A generator without a description is a guess about what the thing is.
- At most one entry is being taken up the ladder at a time (one card open, as now). Mapping goes ahead of it, one
  element per card, since every later rung depends on knowing the element's branches.
- An entry can sit at "mapped" forever. That is fine; it can still be found, its branches compared and its samples
  followed.

## 6. Sources, rights and care

**Sources, in the order to prefer them:**

1. **Open-access museum collections whose images are public domain or CC0:** the Metropolitan Museum of Art, the
   Cleveland Museum of Art, the Art Institute of Chicago, the Smithsonian (including the National Museum of Asian
   Art), the Rijksmuseum, among others. These can be measured, shown and redistributed.
2. **Public-domain books with plates:** for example Owen Jones's *The Grammar of Ornament* (1856), whose Indian and
   "Hindoo" chapters are an early attempt at this same project, and nineteenth-century surveys of Indian textiles and
   crafts. Their framing is of their time and is read critically; their plates are primary evidence of objects.
3. **Openly licensed photographs** (Wikimedia Commons and similar), with the licence's attribution and share-alike
   terms recorded and followed.
4. **Study-only sources:** copyrighted books, museum images without an open licence, living artists' work. Described
   and measured; nothing is copied into the repository (`sources/`, git-ignored, as now).
5. **Our own photographs** of objects and places, where we have them.

Every reference records: what it is, where it is held, its URL, its rights, and whether it may be redistributed.
`references/references.md` is the one bibliography; entries link to its anchors.

**Care.** These are living traditions, many with named communities and some with legal protection:

- Each entry credits the communities and regions that make the work, and says whether the tradition is living.
  Several crafts are protected as geographical indications in their countries; entries note this where it applies.
- Generators make work *after* a tradition and say so. Nothing generated is offered as the craft.
- **Sacred content is not generated.** No scriptural text (Quranic or any other) is produced by a calligraphy
  generator; devotional imagery is described from sources, and generated only where the tradition itself treats it as
  ornament.
- Regions are named by historical region and by modern country together (Sindh, Pakistan; Kutch, India), so no
  tradition is filed under a border that cut through it.
- Each entry has a **don't copy** list, as the art-style files already do: makers' signatures, named contemporary
  designs, logos, anything whose copying would take something from a living maker.

## 7. The engine: generators

Lumenary's convention is kept so both run in one studio: each procedure is a module that declares an id, a name, a
blurb and its dials, draws with seeded noise, and has a theory page with the maths it runs. patternbook's own engine
lives in `engine/`, beside the vendored one, never inside it.

**What a generator returns** (the contract other tools can rely on):

| Output | What it is | Why |
|---|---|---|
| `svg` | the design as vectors | scalable, editable, printable |
| `png` | a raster at a requested size | for pages and sheets |
| `margin(x, y)` | a signed distance in pattern units: positive inside the figure, negative in the ground | the form of a pattern that any other tool can use: cutting, carving, stencils, embroidery outlines, 3D. Lumenary's jali already works this way |
| `layers` | the design split the way its process splits it: one layer per printing block, per dye bath, per thread colour, per inlay stone | process-faithful, and it is what a maker or another tool needs |
| `spec` | the settings, seed, symmetry, palette and motif ids as JSON | reproducible: the same spec always makes the same design |
| `provenance` | which entry, which references, which version | the output can always say where it came from |

**Symmetry as a checkable property.** Plane patterns fall into the 17 wallpaper groups, borders into the 7 frieze
groups, rosettes into cyclic and dihedral groups. Each ornament system declares its group (a jali lattice of
eight-point stars is p4m; a hexagonal one is p6m), the generator builds within it, and the checker reads it back from
the output and from the references. This turns "it looks like a jali" partly into "it has the jali's symmetry, its
opening ratio and its bar width", which can come out wrong.

**Imperfection is part of the process, not noise added after.** METHOD 2c step 3 is where the human touch lives:
blocks that don't quite register, a darning stitch that varies in length, a carver's bar that thickens at a junction,
gold that is burnished unevenly. Each becomes a seeded term in the generator with its own dial. C-012 and C-013
showed what happens without it: a uniform effect reads as a filter.

**Kinds of generator, built in this order:**

1. **Pattern:** lattices, tilings, all-over repeats, borders, fields, medallions (from ornament-system entries).
2. **Motif:** a parametric motif (a buta's curl and fill, a lotus's petal count and profile), used by patterns.
3. **Piece:** an elevation or profile from proportion rules, with its ornament zones labelled (a cusped arch from
   span, rise and cusp count; a jharokha from its brackets, canopy and screen).
4. **Composition:** a layout grammar that places ornament in zones: a manuscript page (text block, rulings, borders),
   a shawl (field, border, corner), a tile panel, a facade.

Treatments (image filters) stay the route for rendering a style over a picture.

**Where it runs.** In the browser, like Lumenary, so the studio works on GitHub Pages with no server; and under Node
for batches, sheets and exports. One implementation serves both.

## 7b. The process library

Every look in patternbook comes from a process: how something was physically made, what that process can't do, what
it always gets slightly wrong, and the maths that models it (METHOD 2c). Processes belong to neither shelf and to no
single tradition. Resist dyeing makes Java's batik, Sindh's ajrak and Rajasthan's dabu; a press's ink spread is the
same physics on a 1950s magazine and on a Mughal-era block print. So processes are a top-level part of patternbook,
in `processes/`, shared by the pages shelf, the atlas, the treatments and the generators.

**What a process page holds** (`processes/_template.md`): the process itself, its constraints, its imperfections,
its equations and dials (METHOD 2c steps 1-5); the **variants** of the process across traditions (wax, mud or paste
with mordants as the resist); **what it makes** (atlas elements and branches, and examples outside the subcontinent);
its **models**, meaning every implementation of it wherever it comes from, each credited; the **primitives** it is
built from; and its sources.

**Primitives** (`processes/primitives.md`): the operations that recur across processes, such as snapping to a
palette by a perceptual colour distance, majority filtering, outlines from edges, seeded noise, resist masks, dot
lattices, stitch fields, crackle networks, relief shading from a height and a light, misregistration. Each is written
once, with its maths, and linked to the processes and implementations that use it. A new treatment or generator is
written by composing primitives, and a process that needs one that doesn't exist yet names the gap.

**Measured in C-018.** 80 % of the equations in Lumenary's 214 models apply a primitive shared by three or more of
them, and 31 primitives reach 70 % of all equations; without foundation-level operations (random numbers, smoothstep,
tone curves, blur, simple blends) the share is 66 %. The making classes compose most (stitch, carving, glaze,
drawing, printing), geometric constructions least. So `engine/core/` starts from the primitives the making families
use, and geometric constructions are written per treatment. The crafts' gaps (supplementary weft, chain stitch, weave
drafts, glaze thickness, dye baths in sequence, inlay from veined stone, mirror insets, light through thick screens) are
listed in `processes/primitives.md`.

**Where models come from.** Any implementation of a process counts as a model of it, credited to whoever made it:

- **patternbook's own treatments and generators.** The theory notes for `press`, `riso`, `halftone` and `hatch` move
  into the process pages for letterpress, risograph, halftone screening and hatching as those pages are written, each
  leaving a pointer where it was.
- **Lumenary** (Mursal Furqan Kumbhar). `processes/sources/data/` (moved out of Lumenary's `src/data` on 2026-11-22) holds the maths behind 212 of his 214 treatments
  (610 equations with notes, 426 paragraphs), a fuller account of all 214 (where each look comes from, why it looks
  that way, how it is made, its history, uses, presets, terms and related treatments) and six foundation pages on the
  tools they share. His entries are models of physical processes: resist dyeing, running stitch, painting on tin glaze
  and its crackle, cut paper, pierced and lit hide, stone relief under a moving light, tesserae, block printing and
  its registration, dot fields. Each process page carries his models in full, credited; his theory data and his theory
  pages as captured from his site stay unchanged in `processes/sources/`, and anything that improves on his
  work is offered back to him. All of this sits in `processes/`, the one place for knowledge of how looks are made.
- **Papers and books**, through `references/references.md`.

**How the rest of patternbook uses it:**

1. **Atlas elements name their processes** in a `processes:` field (kantha: running stitch; dabu: resist dyeing;
   Jaipur and Multani blue pottery: painting on tin glaze). An element whose process has no page yet says so, and that
   gap is listed in the index.
2. **METHOD 2c starts from the process page.** Describing an element begins by reading its process, then writing what
   this tradition does differently (its variant).
3. **Treatments and generators are filed under the process they model,** name the atlas branch they claim, and are
   checked against that branch's samples.
4. **The index** (`processes/index.md`, generated) shows each process with the atlas elements it makes, its models
   and its primitives, and the elements with no process page yet. It is also the engine's ranked list of what to build
   next: a process with many atlas elements and one model is cheap to extend; a process with many elements and no
   model is the biggest gap.

## 8. Looks: designs that hold together

A look is the unit an agent or a person picks up and uses. It has two parts.

**Tokens**, written in the Design Tokens Community Group format so web tools can read them: the palette (each colour
tied to a palette entry), ink, line weights, the scale ladder (border width to field motif to fine detail), spacing,
type where the look includes text.

**Rules**, each checkable on a finished design:

- every colour within ΔE of a token;
- line weights within the look's band;
- each pattern's symmetry group as declared;
- the scale ladder respected (no border motif larger than the field's);
- motifs drawn only from the look's set;
- treatments and their settings named, so a filter doesn't fight the palette (as METHOD already asks of style files).

**Hybrids.** Mixing is part of this art's history: Mughal ateliers worked Persian and Indian conventions together,
Company painting met European paper and perspective, Indo-Saracenic buildings combined several vocabularies, truck art
takes from everything. A hybrid look records its precedent where there is one, and says plainly when there is none.
What makes a hybrid hold together is shared material: a common palette, a shared motif, one process language, one
line. The look names which of these carries it.

A checker reports a look's consistency on any design made with it. That report is a measure, not a judgement; the
judgement is the blind pick.

## 9. Judging

The blind pick stays the test. New questions for this shelf:

| Test | Question | Arms |
|---|---|---|
| **reads as its tradition** | "Which of these is the real one?" or "Name the tradition" | generator output against a reference, cropped alike |
| **reads as made** | "Which looks made by hand, and which by a filter or a machine?" | the generator with its imperfection terms against without them; against an image model's attempt |
| **beats the default** | "Which is closer to the tradition?" | a look or entry against what an unguided agent (or image model) makes when asked for the same thing |
| **holds together** | "Is this one design or a collage?" | a look's composition against the same parts assembled without its rules |

**The unguided default, measured first.** As C-005 measured the cream-and-terracotta page, the first card on this
shelf measures what an agent produces when asked for "South Asian" or "Mughal" design with no guidance. The expected
clichés (a Taj Mahal silhouette, paisley everywhere, saffron and marigold, mandalas on anything, Hindu and Islamic
symbols mixed at random, the wrong script) are a guess until counted. The counted list becomes this shelf's default
checklist, and every entry and look has to beat it.

**Measures each entry names for itself**, for example:

- a lattice: symmetry group, share of openings, bar width against opening, star order;
- a border: frieze group, border-to-field ratio, number of guard stripes;
- a block print: number of blocks, registration error, repeat size, width of the resist line;
- an embroidery: stitch length spread, direction blocks, share of ground covered;
- a painting style: pigment set, line-weight spread, cast shadows present or absent, border proportions;
- a piece: proportion ratios (an arch's rise over its span), ornament zones present.

**Judges.** One judge so far, the person who commissions the work (METHOD's known weakness). This shelf should
invite people who know the traditions: makers, art historians, students of the crafts. Being public helps: an entry
can ask for critique where people can see it.

## 10. Repository layout

Additive. New folders are marked `+`.

```
README.md                   leads with the subcontinent; the pages shelf stays
METHOD.md                   + a section for this shelf (sources, the ladder, the tests above)
CARD.md, threads.md         unchanged
docs/architecture.md        + this document
docs/atlas.md               + the atlas: its tree, branches, samples and sourcing
atlas/<domain>/<family>/    + one page per element, with <element>.samples.json beside it
catalog/                    + generated: catalog.json, index.md, coverage.md (never edited by hand)
subcontinent/               + the entries
  traditions/<id>.md
  motifs/<id>.md
  ornament/<id>.md
  pieces/<id>.md
  styles/<id>.md
  palettes/<id>.md          (+ <id>.json, the colours)
  _templates/<kind>.md
processes/                  + all knowledge of how looks are made (section 7b): process pages carrying every model in
                              full, primitives.md, foundations.md, index.md, models/, and Lumenary's theory as received in
                              sources/ (his theory data, theory pages, and his app's README and catalogue)
looks/<id>.md               + looks, each with <id>.tokens.json
engine/                     + our generators (Lumenary's conventions)
  core/                     symmetry groups, margin functions, seeded noise, SVG writer, layers
  generators/<id>.js
  check/                    the measures and the consistency checker
  cli/                      Node: batch renders, sheets, exports
studio/                     + the GitHub Pages studio: browse the catalogue, run generators, compose looks
references/references.md    + the one bibliography, with rights
library/                    the pages shelf, unchanged
treatments/                 the treatments that apply looks to pages; their theory moved into processes/ (pointers left)
engine/                     the engine: Lumenary's as the base (files unchanged), patternbook's styles and core/
NOTICE.md                   what came from other projects and where it is
runs/, tools/, sources/     unchanged (sources/ stays git-ignored)
```

## 11. Entry format

Markdown with front matter, as the library already uses. The front matter feeds the catalogue.

Fields every kind shares:

```yaml
id: mughal-jali               # kebab-case, permanent
kind: ornament                 # tradition | process | motif | ornament | piece | style | palette
names:
  en: jali, jaali
  ur: جالی
  hi: जाली
region: [Delhi and Agra (India), Lahore (Pakistan), Gujarat (India)]
period: 16th-18th century (Mughal); continues
makers: stone carvers; workshops at Agra continue the craft
living: yes
status: mapped                 # mapped | described | encoded | checked | judged | used
related: {traditions: [mughal-architecture], motifs: [star-8, lotus], processes: [stone-piercing]}
generators: []                 # engine/generators/<id>.js
treatments: [lumenary:mughal-jali]
measures: []                   # named in the entry, run by engine/check
sources: [ref-id, ref-id]      # anchors in references/references.md
rights_note: <what may be redistributed>
care: <living makers, protection, sacred content, anything to handle carefully>
dont_copy: []
tested_in: []                  # card ids
```

The body follows the kind's template. For an ornament system:

1. **What it is**, in plain words, and where it is found.
2. **The process** (2c step 1): how it is made.
3. **Its constraints** (2c step 2): what the process cannot do.
4. **Its imperfections** (2c step 3): what it always gets slightly wrong.
5. **Constant, conditional, varies** across the references (METHOD step 1).
6. **The rules** that arrange it: symmetry group, cell, motif placement, border relation, proportions.
7. **The maths** (2c step 4), once encoded.
8. **Dials** (2c step 5), once encoded.
9. **Measures**, with their values on the references.
10. **When it doesn't apply**, and what it is often confused with.

## 12. The catalogue

`catalog/` is generated from the entries by a script and never edited by hand.

- `catalog.json`: every entry's front matter, for agents and tools.
- `index.md`: browsable by kind, by region and by tradition (T-002's question, now with enough entries to need it).
- `coverage.md`: counts at each rung, by family and by region. This is the number that says how wide patternbook is
  and how deep, and where it is thin.

## 13. The seed list

A first enumeration, from memory and to be checked against sources as each is mapped. The atlas
(`docs/atlas.md`) is where it is entered and arranged into domains, families and elements, and its first pass
supersedes this list as it grows. It is a starting point, not a claim of completeness, and it leans wherever memory leans; the coverage report will show the gaps.

**Painting and depiction:** Mughal (Akbar, Jahangir, Shah Jahan ateliers); Deccani (Bijapur, Golconda); Rajput
(Mewar, Bundi and Kota, Kishangarh, Marwar, Bikaner); Pahari (Basohli, Guler, Kangra, Chamba); Company painting
(Patna, Delhi, Murshidabad); Kalighat; the Bengal School wash; Raja Ravi Varma's oils and prints; Chughtai of Lahore;
Tanjore; Mysore; Pattachitra; Madhubani (Mithila); Warli; Gond; Phad scrolls; Kalamkari; Pichhwai; Cheriyal scrolls;
Kerala murals; Ajanta murals; Sigiriya frescoes; Newar paubha; hand-painted cinema posters; Dhaka rickshaw art; truck
art.

**Textiles and stitch:** ajrak; Sanganer and Bagru block print; dabu mud resist; bandhani; leheriya; patola double
ikat; Pochampally ikat; phulkari and bagh; Swat embroidery; chikankari; zardozi; gota patti; kantha; Kashmiri kani,
sozni and the shawl buta; Kutch and Kashmir chain stitch; Sindhi mirror work (abhla bharat); Balochi embroidery; Rabari
embroidery; ralli quilts; Banarasi brocade; jamdani; Kanchipuram borders; Chanderi; Maheshwari; tilla work on khussa.

**Architecture and its ornament:** jali; jharokha; chhatri; cusped and multifoil arches; pishtaq and iwan; muqarnas;
pietra dura (parchinkari); kashi kari tile (Lahore, Multan); ghalib kari stucco; naqqashi fresco; sheesh mahal mirror
mosaic; the charbagh; Shekhawati painted havelis; carved doors (Chiniot, Peshawar, Swat); Nagara and Dravida temple
forms; stepwells; Jain marble carving; Gandhara reliefs; Sanchi toranas; Bengal terracotta temples; Kerala timber
architecture; Kandyan ornament; Newar carved windows; Makli's carved tombs.

**Objects and crafts:** blue pottery (Multan, Hala, Jaipur, Khurja); bidri; meenakari; kundan; thewa; Kashmiri
papier-mache; walnut carving; lacquer (Hala, Channapatna); camel-skin lamps with gold relief (Multan, Bikaner);
Moradabad brass; dhokra; Bankura terracotta; sanjhi stencils; kites; truck and bus ornaments; jewellery forms (jhumka,
chandbali, maang tikka, nath, haar, kada, payal, bangles); hookah; surahi; diya; charpai weaves; dari weaving; carpets
(Kashmir, Bhadohi, Balochi); the Sindhi topi.

**Floor and body:** kolam; rangoli; alpana; mandana; aripan; mehndi in its regional forms; godna tattoo.

**Script as ornament:** Nastaliq; Naskh; Kufic; tughra; Shahmukhi; Sindhi; Devanagari; Gurmukhi; Bengali; Tamil;
Sinhala. (Section 6's rule on sacred text applies.)

**Palettes:** Mughal court pigments; Rajput mineral reds and yellows; natural dyes (indigo, madder, lac, haldi,
pomegranate rind, iron black); ajrak's two baths; truck art's enamel set.

## 14. What Lumenary already covers

Eighteen of Lumenary's treatments touch the subcontinent. Each starts its catalogue entry at **encoded** for the
treatment (credited to him), while the entry's description and references still need writing:

- **Sindhi design (9):** ajrak, Hala blue pottery, ralli patchwork, Sindhi mirror embroidery, Sindhi topi, Hala
  lacquerware, Makli carving, Indus seal, Sindhi script.
- **South Asian and Islamic (8):** truck art, Mughal jali, Persian miniature, girih, Madhubani, Warli, kolam, phulkari.
- **World (1):** mandala.

All eighteen are filters over a picture. The generators in section 7 are what patternbook adds: the same traditions
made from settings alone, split into their process layers, and checked against references.

## 15. Phases and first cards

**Phase 0: the atlas.**

- This document and `docs/atlas.md` agreed (or changed).
- The atlas's first pass corrected against sources: domains and families, architecture down to its elements.
- The jharokha sampled: three or more samples for each candidate branch, branches established or merged, the five
  descriptors (variation, art style, gravity, touch, familiarity) written from the samples. The first card.
- The rest of architecture, one element per card, thin regions early; then the other domains.
- Templates, the catalogue and coverage scripts, `references/references.md`, and the Lumenary mapping (section 14),
  as the atlas needs them.

**Phase 1: one entry all the way up, and the default measured.**

- A card measuring the unguided "South Asian" default (section 9).
- The jali taken from mapped to judged: described from references, its 2D generator fitted to them with its margin
  function and layers, checked by its measures, and blind-picked against the references and against the unguided
  default.

**Phase 2: a second and third kind, then the first look.**

- A process-heavy entry (ajrak or phulkari, where the layers and the imperfections carry the look).
- A style entry (the Mughal page: its borders, rulings and space).
- The first look, built from the three, with its consistency checker and a "holds together" blind pick.

**Phase 3: widen.** More entries up the ladder, the studio on GitHub Pages, and an invitation for critique from
people who know the traditions.

Phases are an order, not dates. Each card is one sitting, by the card protocol.

## 16. Risks

| Risk | How it is met |
|---|---|
| Breadth without depth: hundreds of names, nothing encoded | the ladder; coverage reports both; one entry up the ladder at a time |
| The clichés this shelf exists to replace creep back in | the measured default checklist; every entry and look has to beat it |
| Generated work reads as a filter | imperfection terms from the process (2c step 3); the "reads as made" test |
| Misrepresenting living traditions | sources first; care notes; crediting makers; judges who know the work |
| Rights: images that can't be redistributed, share-alike terms, Lumenary's informal permission | rights recorded per reference; study-only sources stay local; Lumenary credited, and checked for a licence before anything built on it ships |
| Politics of naming across borders | historical region and modern country together |
| One judge | invited judges (section 9); results stated with their limits, as the cards already do |
| Two shelves pulling in two directions | the pages shelf stays as a test bed for looks; new effort goes to this shelf (decision 1 below) |

## 17. Decisions for the owner

1. **The pages shelf:** keep it as it is, with the subcontinent as the main direction (proposed); or move one of the
   two into its own repository.
2. **The folder name:** `subcontinent/` (proposed), or another word.
3. **Whose judgment to invite, and where:** GitHub discussions on the repository, specific people, or both.
4. **The first element to sample in the atlas:** the jharokha (proposed, as the worked example in `docs/atlas.md`),
   or another.
5. **The first entry to take up the ladder once the atlas has begun:** the jali (proposed: pattern, geometry and light
   are one thing in it, its geometric rules are the best documented, and Lumenary's margin function is a start), or
   another.

## 18. Prior art to check

Named from memory, to be read and entered in `references/references.md` before they are relied on:

- Owen Jones, *The Grammar of Ornament* (1856), its Indian chapters.
- Dorothy Washburn and Donald Crowe, *Symmetries of Culture* (1988): classifying cultural patterns by their
  symmetry groups.
- George Stiny and James Gips, shape grammars (1971); George Stiny and William Mitchell, "The grammar of paradise"
  (1980), on Mughal gardens.
- Craig Kaplan and David Salesin, Islamic star patterns from rules (2004), and Kaplan's Taprats.
- Lumenary (Mursal Furqan Kumbhar, 2026): the treatments and theory this builds on.
- The Design Tokens Community Group format.
