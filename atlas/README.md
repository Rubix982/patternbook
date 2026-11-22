# atlas

What exists in the Indian subcontinent's made world, enumerated from sources before anything is described, encoded
or combined (`docs/atlas.md` says why, and how the atlas grows). The subcontinent here is India, Pakistan,
Bangladesh, Nepal, Bhutan, Sri Lanka and the Maldives.

## What is here

One file per domain, each listing its families and elements. Every element has its other names as the sources give
them, its regions (historical region; modern country), the named varieties the sources give as candidate branches,
its sources, and whether the first pass from memory had it:

| Domain | File |
|---|---|
| Architecture | `architecture.md` |
| Gardens and water | `gardens-and-water.md` |
| Textiles and dress | `textiles-and-dress.md` |
| Jewellery and adornment | `jewellery-and-adornment.md` |
| Body and floor | `body-and-floor.md` |
| Painting and depiction | `painting-and-depiction.md` |
| Objects and crafts | `objects-and-crafts.md` |
| Script and lettering | `script-and-lettering.md` |
| Street, transport and signs | `street-transport-and-signs.md` |
| Ritual and festival objects | `ritual-and-festival-objects.md` |

Beside them:

- `coverage.md`: counts by domain and family, and by the countries the sources name. Generated, not edited by hand.
- `unattested.md`: items from the first pass that no source named. Kept out of the domain files until one does.
- `boundary.md`: related things just outside the subcontinent, so the atlas knows its edge.
- `judgment-calls.md`: where element, branch and sample were hard to tell apart, and other placements worth
  questioning.

## How it was made

Card C-015, 2026-11-22. Three passes, one per group of domains, read English Wikipedia through its API: category
trees, list pages and glossaries, and the lists of registered geographical indications. Each element needed at least
one source that names it. The three passes were merged by `runs/c015/merge_atlas.py`:

- 14 elements that two passes both found (the jali as architecture and as stone craft; kalamkari as textile and as
  painting; the floor drawings) are filed once and linked from the other domain.
- Four names that mean different things in different domains are qualified rather than merged: kalasha (finial)
  and kalasha (ritual pot); terracotta (as building material) and the ceramic craft; chadar (water chute) and the
  garment.

The passes' full output, their request logs and the sketch they checked are in `runs/c015/`.

## Numbers

C-015 found 755 elements; C-016 added 38 for Pakistan from sources other than English Wikipedia (and Pakistan to 7
more). `coverage.md` has the current counts.

- At C-015: **755 elements** in 10 domains and 94 families; **796 candidate branches**.
- **533 (71 %) were found only by the sources;** 222 were in the first pass. About 40 first-pass items found no
  source (`unattested.md`).
- **Countries the sources name:** India 504, Pakistan 165, Sri Lanka 69, Bangladesh 65, Nepal 53, Bhutan 31,
  Maldives 9; none named 95. 334 elements (44 %) are attested for India alone.

## Limits

Read these before relying on a row.

- **One source family.** Everything comes from English Wikipedia. No official register, museum catalogue or book
  was opened in this pass. A Wikipedia article shows that an element is named and documented, not what it looks
  like; showing that is the samples' job.
- **The sources lean on India.** English Wikipedia has far more articles, categories and registered geographical
  indications for India than for its neighbours. The country counts measure that as much as the subject.
- **The geographical-indication lists are incomplete.** India's page says 822 are registered, and its table shows
  only part of them (the passes saw about 613 to 643 rows). Pakistan has no such list there, and Bangladesh's is
  marked incomplete. So few Pakistani or Bangladeshi branches are backed by a registration.
- **Some rows rest on little.**
  - About 20 architecture elements rest only on a navigation-box link.
  - About 29 Sri Lankan textile and dress rows come from one navigation box and weren't opened; they are much of
    Sri Lanka's count there.
  - 17 textile rows say "region not read".
  - 18 scripts are listed from category membership alone.
  - Several items rest on a single sentence, among them the mangh of Hyderabad (Sindh), whose place is unconfirmed.
- **Some regions were inferred rather than read.** A few in architecture came from what the pass knew of the
  buildings (Gaur, Lucknow, Mathura, Lahore, Peshawar, Bagerhat), and script countries from the places or languages
  their introductions name. `judgment-calls.md` flags them.
- **Wikidata wasn't used.** Its architectural-style data came back noisy and partly mis-tagged.
- **Budgets ran short.** Wikipedia rate-limited the passes, which ran at the same time. Some first-pass items were
  never queried; they are unconfirmed, not disproved.
- **"Candidate branch" mixes kinds.** Registered products, drape styles, stitch sub-styles and pattern names each
  count as one.

## Next

0. C-016 showed English Wikipedia undercounts Pakistan's textiles and dress by at least 56 %; the same check for India
   (T-020) says how much of the lean toward India is the sources'. `references/sources.md` lists where else to look.
1. Correct the sources' bias: the official geographical-indication registers, national craft bodies, museum
   collections searched by country, and Wikipedias in the region's languages, thin countries first (T-016).
2. Sample the jharokha, the first element to get its own page with samples (`docs/atlas.md`, worked example).
