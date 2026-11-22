# The atlas: what exists, mapped before anything is made

_Proposal, 2026-11-22. Companion to `docs/architecture.md`, and its first layer: nothing in the architecture is
described, encoded or combined before it has a place in the atlas._

## Why the atlas comes first

Take the jharokha. It is one element of the subcontinent's architecture, and it is not one thing. A sandstone
jharokha in Jaisalmer, a timber one in Shikarpur, the emperor's jharokha in a Mughal fort and a painted one on a
Shekhawati haveli share a form: a window that projects from an upper storey on brackets, under a small roof. They
differ in material, carving, weight, colour, purpose and how familiar they are to the people who walk past them.

A generator encodes one branch of one element. Without a map, it encodes whichever branch was seen first, usually
the most photographed, and calls that "the jharokha". The atlas records what exists, how it branches, and real
samples of each branch, so that later work knows which branch it is encoding and what it is leaving out.

## The tree

| Level | What it is | Example |
|---|---|---|
| **domain** | a broad field of made things | architecture |
| **family** | a group of elements that do a similar job | openings and screens |
| **element** | one recognisable thing, with a name its makers use | jharokha |
| **branch** | a variety of the element that holds together across several real examples | timber jharokhas of Sindh |
| **sub-branch** | a variety within a branch, when the samples ask for it | Shikarpur's, against Hyderabad's |
| **sample** | one real instance, with its images and their sources | a carved timber jharokha on a named haveli in Shikarpur |

Elements can belong to more than one family (a jali is a screen and a surface ornament). The atlas files an element
once and links it from the other family.

## What makes a branch

A branch is a cluster of samples that share values on these axes and look like relatives:

- **region**, named historically and by modern country together (Sindh, Pakistan; Kutch, India);
- **period**, and the patrons or dynasty behind it (Mughal, Rajput, Sultanate, Sikh, colonial, modern);
- **community and setting**: whose buildings or objects these were, domestic, courtly, sacred or commercial;
- **material**: red, yellow or pink sandstone, marble, brick, terracotta, deodar, teak, lime plaster, mud;
- **technique**: carving, piercing, inlay, painting, mirror work, turning;
- **function**: what it was for (to see out unseen, to catch the wind, to be seen by the public);
- **scale**: a single window, a whole facade of them, a miniature on an object.

A branch is **established** when at least three samples show it, and a **candidate** with one or two.

**Permutations.** Element × region × period × material × technique is a large space, and most combinations never
existed. The atlas records a combination only when a sample shows it. A gap means one of two things: it didn't
exist, or our sources haven't shown it yet. The atlas says which, when it can tell.

## How a branch is described

Five words, each a field on every branch, and each pointing to the samples that show it:

- **Variation**: what sets this branch apart from the element's other branches: form, proportion, ornament, colour.
- **Art style**: its decorative vocabulary: motifs, ornament systems, the way the surface is worked.
- **Gravity**: how closely it states itself as a physical thing, as we would expect it to be in physical reality:
  its weight, mass, material and presence. Its opposite is **abstractness**, which is how something we perceive but
  can't hold (an emotion, an idea, the sacred) gets expressed through pattern or symbol rather than physical
  likeness. Gravity is a position between the two, read from the samples. A facade stacked with stone jharokhas sits
  far toward gravity: monumental, load-bearing, unmistakably there. A single timber one on a narrow lane is
  physical too, but light and domestic. A buta (paisley) sits toward abstractness: a curl read variously as a flame,
  a cypress or a seed, not a picture of any of them. In painting, a miniature's flat space with no cast shadows is
  more abstract than an academic oil's modelled light. Where something is depicted, its gravity has visible cues
  (cast shadows, perspective, modelled form, material texture). Where it is built, its cues are mass, thickness and
  projection.
- **Touch**: the surface and the hand: crisp chisel work or soft weathered sandstone, polished marble, oiled or
  cracked wood, flaking paint, and how it has aged.
- **Familiarity**: how common it is and how widely it is recognised. Iconic, known in its region, everyday
  vernacular, or rare and disappearing. Whose familiarity, too: people who live with it, the diaspora, the world.

A descriptor with no sample behind it is an impression, and is marked as one.

## A sample

Each sample is one real instance:

| Field | What it holds |
|---|---|
| `id` | permanent, kebab-case |
| `element`, `branch` | where it sits in the tree |
| `name` | the building or object, as its holders name it |
| `place` | historical region, modern place and country; coordinates for buildings where public |
| `date` | year or period, and how it is known |
| `patron_maker` | where known |
| `material`, `technique` | as observed |
| `condition` | original, restored (when, if known), altered, ruined |
| `views` | each image: elevation, oblique, detail, interior, context |
| `images` | for each: URL, creator, licence, whether it may be redistributed, the date it was retrieved |
| `shows` | which of the branch's descriptors this sample is evidence for |
| `notes` | anything else, such as restorations that changed the original |

## Sourcing samples from the internet

In this order:

1. **Wikidata** (its data is CC0): buildings and objects with their architectural style, location, date, heritage
   status and an image. A query by style and type returns candidate samples with places and dates already filled.
2. **Wikimedia Commons**: its category trees are already arranged by element and region, and every file states its
   creator and licence.
3. **Open-access museum collections** with public-domain or CC0 images (the Met, Cleveland, the Art Institute of
   Chicago, the Smithsonian, the Rijksmuseum, and others), mostly for objects, textiles and paintings. Some of their
   APIs need a free key.
4. **Public-domain books and archives**: nineteenth- and early twentieth-century surveys, photographs and plates on
   the Internet Archive and in library collections.
5. **Search engines and image sites**, for discovery only: a sample found this way is recorded with its link, and
   its image is used only if its licence allows.

Rules:

- Every image records its creator, licence and retrieval date. An image with no stated licence is link-only.
- Redistributable images may be kept in the repository as reduced copies, with their attribution. Everything else
  is linked, and any local study copy stays in `sources/` (git-ignored).
- The element is the subject. Photographs whose subject is an identifiable private person are not used.
- **Sampling bias is reported, not hidden.** What is photographed and openly licensed is not what exists: Rajasthan's
  palaces are photographed far more than Sindh's havelis, Bangladesh's or Balochistan's buildings. The coverage
  report shows sample counts by region, and thin regions are searched on purpose.

## Documenting an element

Each domain's elements are listed in `atlas/<domain>.md` (C-015). An element that has been sampled gets its own page,
`atlas/<domain>/<family>/<element>.md`, with its samples in a sibling `<element>.samples.json`. The page holds:

1. **What it is**, in plain words, and its names in the languages of the people who make it.
2. **Its parts**, named (for a jharokha: brackets, base, screen, posts, canopy, eave, finial).
3. **What it was for.**
4. **Its branches**: a table with region, period, material, technique, the five descriptors, and the number of
   samples, then a short gallery for each branch.
5. **What it is confused with**, and where its boundary is.
6. **Sources.**

## Coverage

Generated, never edited by hand: for each domain, family and element, the number of branches (established and
candidate) and samples, by region and by period. It shows where the atlas is wide, where it is deep, and where it is
thin or biased.

## The enumeration

The first pass was written from memory. Card C-015 (2026-11-22) checked it against sources and replaced it: every
domain enumerated down to element level from Wikipedia's category trees, list pages and glossaries, and the
geographical-indication lists, each element with at least one source that names it.

- **755 elements** in 10 domains and 94 families, with **796 candidate branches** (named varieties the sources give,
  many of them registered geographical indications).
- **71 % were found only by the sources.** The sketch from memory held 222 of them. Its largest gaps: Sri Lanka,
  Nepal, Bhutan and north-east India almost entirely; the parts of a temple; Bengal's roof forms; the sari's named
  drapes; about 80 named handloom weaves; appliqué and metal-thread work; puppets and masks; about 40 scripts.
- **The sources lean on India.** 504 elements are attested for India, 165 for Pakistan, 69 for Sri Lanka, 65 for
  Bangladesh, 53 for Nepal, 31 for Bhutan and 9 for the Maldives; 334 (44 %) for India alone. Part of that is the
  subject and part is English Wikipedia, which has far more articles and registered geographical indications for
  India than for its neighbours.

The lists are in `atlas/`, one file per domain (`atlas/architecture.md` and the rest), with `atlas/coverage.md`,
`atlas/unattested.md` (first-pass items no source named, kept out until one does), `atlas/boundary.md` and
`atlas/judgment-calls.md`. How it was made, and its limits, are in `atlas/README.md`; the passes' full output and
request logs in `runs/c015/`. The memory sketch is kept as `runs/c015/memory-sketch.md`.

## A worked example: the jharokha

**What it is.** A window that projects from an upper storey, carried on brackets, with a small roof of its own (often
curved like a bangla roof, or domed), and closed by a pierced screen or shutters. It let people inside see the street
without being seen, and let air in. In Mughal courts it became a ritual place: the jharokha-i-darshan, where the
emperor showed himself to the public each day.

**Its parts.** Brackets; base or ledge; screen (jali) or shutters; posts; canopy; eave (chhajja); finials.

**Candidate branches**, from memory, each to be established with samples or merged:

| Branch | Region | Period | Material and technique | Samples to look for |
|---|---|---|---|---|
| Rajput haveli facades | Jaisalmer, Rajasthan (India) | 18th-19th c. | yellow sandstone, deep carving | Patwon ki Haveli; Salim Singh ki Haveli; Nathmal ki Haveli |
| Rajput palace facades | Jaipur, Jodhpur, Bikaner, Bundi, Udaipur (India) | 16th-19th c. | red and pink sandstone, carving, lime plaster | Hawa Mahal; Mehrangarh; Junagarh; Bundi's Garh Palace; Udaipur's City Palace |
| Mughal imperial jharokha | Agra, Delhi (India); Lahore (Pakistan) | 16th-17th c. | marble and red sandstone, inlay | the jharokha-i-darshan of the Agra, Delhi and Lahore forts; Fatehpur Sikri |
| Central Indian palaces | Gwalior, Orchha (India) | 15th-17th c. | sandstone, tile, carving | Man Mandir; Jahangir Mahal |
| Punjab timber | Lahore, Chiniot (Pakistan) | 18th-20th c. | carved wood | havelis of Lahore's walled city; Omar Hayat Mahal |
| Sindh timber | Shikarpur, Hyderabad (Pakistan) | 19th-20th c. | carved and painted wood | Shikarpur's havelis; houses in old Hyderabad |
| Peshawar timber | Peshawar (Pakistan) | 19th c. | carved wood | the Sethi houses |
| Gujarat timber | Ahmedabad (India) | 18th-19th c. | carved wood | houses in the pols |
| Painted havelis | Shekhawati (India); Lahore (Pakistan) | 18th-20th c. | painted plaster over masonry | Mandawa and Nawalgarh havelis; Haveli Nau Nihal Singh |
| Indo-Saracenic | across the subcontinent | late 19th-early 20th c. | sandstone, revival forms | Lalgarh Palace, Bikaner |
| Contemporary revival | anywhere | now | concrete, stone cladding | new hotels and houses using the form as a sign |

**Its boundary.** The Arab mashrabiya and the Hejazi roshan are close relatives, outside the subcontinent. Newar
carved windows in Nepal are a separate element with their own atlas page. A plain balcony with no canopy and no
screen is not a jharokha.

## Order of work

1. **The enumeration.** Done in C-015: `atlas/`, 755 elements from sources.
2. **The sources' bias, corrected.** The official geographical-indication registers (India lists 822; Wikipedia's
   table shows only part of them; Pakistan's and Bangladesh's are barely on Wikipedia), national craft bodies,
   museum collections searched by country, and Wikipedias in the region's languages. Thin countries first.
3. **The jharokha, sampled.** At least three samples sought for each candidate branch, from Wikidata and Commons
   first, with every licence recorded. Branches established, merged or dropped, and the five descriptors written from
   the samples.
4. **The rest of architecture, one element at a time,** in an order the coverage report suggests (thin regions
   early, so the bias doesn't settle in).
5. **The other domains,** family by family.

Only elements in the atlas move on to the architecture's later layers (description by METHOD 2c, generators,
looks), and each of those names the branch it encodes.
