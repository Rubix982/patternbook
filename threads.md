# Threads

### T-001 · Does a human-sourced entry beat an agent told to invent its own distinctive style?

**Status:** answered
**Parent:** C-001
**Opened:** 2026-10-31
**Question:** C-001's baseline is "no guidance". The harder baseline is "be distinctive,
design your own style system first" — if that does as well as a real entry, the library's
value is just *any* specific instruction, not human sources.
**Answer:** C-002 — human entry won both blind questions vs a self-written reference in the same format; 414 vs 1,649 words. Effort confound not fully removed (see CARD.md).

### T-002 · How should the library be browsable by source ("everything from IKEA") as well as by problem?

**Status:** answered
**Parent:** C-001
**Opened:** 2026-10-31
**Question:** Entries are filed `library/<problem>/<source>.md`, which suits agent lookup but scatters one source across folders. Proposed: frontmatter (`source`, `source_family`, `problem`, `also_teaches`, `patterns`) and a generated index later; don't fix the problem/pattern lists until ~5 entries exist. Apply only after C-001 arm B finishes, so the entry isn't edited mid-test.
**Answer:** Header added to `library/_template.md` and the IKEA entry (2026-10-31). No generated index yet — wait for ~5 entries.

### T-003 · Should art style be its own axis, separate from the problem an entry solves?

**Status:** answered
**Parent:** C-001
**Opened:** 2026-10-31
**Question:** In C-001 the no-entry page had a coherent art style (Saif: retro, 1980s, "cool") that was wrong for the job (reads as a presentation, not a manual). Suggests purpose and art style vary independently: an entry should say which art style fits its problem and why, and the library may need art styles classified on their own (e.g. technical line art vs. editorial vs. retro print). Candidate `art_style` field in the T-002 header.
**Answer:** C-008 — yes. IKEA's visual system alone (library/art-styles/) won both blind questions on a router page, same length as the unguided one. Style pulled some structure with it (numbered picture panels).

### T-004 · Replace C-001's default-marker checklist with the current AI default

**Status:** answered
**Parent:** C-001
**Opened:** 2026-10-31
**Question:** The 2023-style tells (Inter, gradients, purple, centered hero) scored 0 on both arms. The no-entry default seen was cream + serif headline + one terracotta accent + pill badges. Need a list built from several no-entry runs, not one, before reusing the measure.
**Answer:** C-005 — 5-trait checklist in METHOD.md: cream bg 7/7, warm near-black text 7/7, terracotta accent 7/7, uppercase eyebrow 6/7, pills 5/7.

### T-005 · Do the C-003-revised rules still win a blind pick, and does "device only when needed" show up?

**Status:** answered
**Parent:** C-003
**Opened:** 2026-10-31
**Question:** Rules 2, 3, 5 were narrowed after C-003 but never blind-tested. Rerun C-001's brief with the revised entry against `runs/c001/arm-b.html`: does it still look like a manual, and does it drop devices where the bike-chain task doesn't need them (e.g. part IDs on a 3-item inventory)?
**Answer:** C-004 — split. Revised won "less AI-made", old won "would use" ("more concise… step by step"). Rule 2 tightened: settle a reader's choice in one place.

### T-006 · Does step-layout density (columns, boxes, ID tags per caption) change which page people would use?

**Status:** open
**Parent:** C-004
**Opened:** 2026-10-31
**Question:** C-004's preferred page used 2 roomy columns and few ID tags; the other used a dense 3-column boxed grid with IDs in most captions. No rule covers layout density, and one comment ("more concise") isn't enough to write one.
**Answer:** —

### T-007 · Does the troubleshooting entry beat the default on a software troubleshooting page?

**Status:** answered
**Parent:** C-006
**Opened:** 2026-10-31
**Question:** Blind-test entry #2 the way C-001 tested entry #1, on a brief the sources don't cover (e.g. a troubleshooting page for a web app or a home Wi-Fi router), against a no-guidance page; score with the C-005 default checklist too, since AI troubleshooting pages are typically accordions on cream.
**Answer:** C-007 — entry page lost "would use"; (a) tie ("both look AI generated"). Unguided page already followed 5–6/6 rules, interactively; the entry added printed-manual exhaustiveness (6× words).

### T-008 · What does a troubleshooting entry need to carry that the agent doesn't already do?

**Status:** open
**Parent:** C-007
**Opened:** 2026-10-31
**Question:** The unguided agent already applies symptom-first, cause-order, escalation and not-a-fault. Saif liked its "attempt of visualization" but called both pages AI-looking. Candidates the entry could carry instead: the visual language (both pages still look AI-made), and the medium choice (reference vs one-step-at-a-time). Needs a baseline-first pass (METHOD 2b) before rewriting.
**Answer:** — (C-008 suggests: pair the existing structure rules with an art-style file; test that pairing before adding more structure.)

### T-009 · What, specifically, makes Saif read a page as AI-made?

**Status:** answered
**Parent:** C-009
**Opened:** 2026-10-31
**Question:** The palette checklist (C-005) didn't predict Saif's judgement in C-007 or C-009. Show Saif the pages judged so far (winners and losers) and have them mark what gives each away — specific elements, not overall impressions — then turn those into a checklist built from a human judge rather than from unguided output. Candidates already suggested: drawing-led vs. typographic styles (C-008 vs C-009), familiar docs furniture, broken layout.
**Answer:** C-010 — judge's checklist in METHOD.md. No palette trait named; emptiness/cold finish named on both human-style pages.

### T-010 · What does "human touch" look like on a web page, in a form an agent can follow?

**Status:** answered (partly)
**Parent:** C-010
**Opened:** 2026-10-31
**Question:** Saif's tells point to what's missing: texture and marks in drawings ("streaks, flares"), a real header that orients you, a voice that isn't enthusiastic, density between empty and wall-of-text. Find human-made web or print sources that have these (e.g. hand-drawn or textured technical illustration, editorial headers, plain-spoken copy) and test whether adding them to the line-art style fixes the "cold and empty" reading.
**Answer:** C-011 — PS Magazine style won both picks vs line art. Per-page tells not yet collected.

### T-011 · Can the PS-style page keep its human touch and still be easy to navigate?

**Status:** open
**Parent:** C-011
**Opened:** 2026-10-31
**Question:** Saif preferred the PS page but found its technical details "a bit harder to navigate" than the clean line-art page. Also still owed: Saif's per-page tells for C-011 (runs/c011/blind/), to see which C-010 tells survived.
**Answer:** —

### T-012 · Could procedural "mark-making" treatments (like Lumenary's) supply the texture agents can't draw by hand?

**Status:** answered (partly)
**Parent:** T-010
**Opened:** 2026-11-16
**Question:** Top-layer test (METHOD.md "Two layers"). Take a page the bottom layer already got right (C-011's PS-style winner) and run its drawings through a matching treatment (ink/hatching, spot-colour print). Does the "polygon-ish, no streaks, no flares" tell go away in a blind pick, without the page reading as filtered? Inspiration: Lumenary (lumenary-studio.vercel.app, Mursal Furqan Kumbhar), 214 browser-only treatments with the maths written out.
**Answer:** C-012 — treated page won both looks questions, but the judge called its drawings filtered.

### T-013 · What stops the press treatment reading as "filtered"?

**Status:** open
**Parent:** C-012
**Opened:** 2026-11-16
**Question:** C-012's treated drawings read as printed and also as an effect. Candidates to test one at a time against the C-012 treated page: (1) uneven strength across drawings, as across a real press sheet; (2) treating the body text too, so nothing on the page is crisper than the ink; (3) protecting small lettering from ink spread; (4) giving the agent a plain flat drawing to print, instead of printing art that already fakes hand-made wobble.
**Answer:** — (C-013: Lumenary's risograph model read as *more* filtered than `press`, equal on the other questions. Added candidate (5): print ink at full density; `riso`'s lighter lines may read as processing.)

### T-014 · Does the engine plus an art-style file move the whole page, not just its pictures?

**Status:** open
**Parent:** C-014
**Opened:** 2026-11-16
**Question:** C-014's engine pages kept the cream/serif/uppercase-label base around better pictures. Give an agent both the engine and a style file (e.g. the PS hand-inked style, whose file already names a candidate treatment) and blind-pick against C-014's engine-only page for the same brief.
**Answer:** —

### T-015 · What do people other than Saif pick?

**Status:** open
**Parent:** C-014
**Opened:** 2026-11-16
**Question:** Every pick so far has one judge. Saif: "we can explore more usages and see what people would like." Run the existing blind pairs (C-008, C-011, C-014) past a few other people, including designers, and check whether their picks agree with his.
**Answer:** —

### T-016 · How far does the atlas's lean toward India come from the sources rather than the subject?

**Status:** open
**Parent:** C-015
**Opened:** 2026-11-22
**Question:** C-015's elements are attested for India 504 times against Pakistan 165, Bangladesh 65, Nepal 53, Bhutan 31
and the Maldives 9, all from English Wikipedia. Re-enumerate the thinnest countries from other sources (the official
geographical-indication registers, national craft bodies, museum collections searched by country, Wikipedias in Urdu,
Sindhi, Punjabi, Bengali, Nepali and Sinhala) and see how much each count moves.
**Answer:** partly, by C-016: English Wikipedia undercounts Pakistan's textiles and dress by at least 56 % (45 elements
from other sources, 41 of them outside the regional Wikipedias). Whether India's lead is the sources' or the subject's
waits on the same sweep for India (T-020).

### T-017 · Do the first-pass items C-015 never queried exist under other names?

**Status:** open
**Parent:** C-015
**Opened:** 2026-11-22
**Question:** About 40 first-pass items found no source (`atlas/unattested.md`), and some were never queried for lack
of budget (railway stations, teak, painted facades, surahi, cinema hoardings). Query each by its other names before
calling it unattested.
**Answer:** —


### T-018 · Does a language model's unaided knowledge of the subcontinent's made things fall off outside India, beyond what the sources already lack?

**Status:** open
**Parent:** C-015
**Opened:** 2026-11-22
**Question:** The atlas now has a source-backed list of elements per country. Ask models with no tools to list one
domain's elements for each country (textiles and dress for India, Pakistan, Bangladesh, Nepal, Bhutan, Sri Lanka),
score their recall against the atlas, and correct for how much each country's sources hold (C-016). A recall gap that
survives the correction is evidence about the model, not the encyclopedia. The planned "unguided default" card
(`docs/architecture.md` section 9) is its image-side twin. Literature to check first, cited from memory: benchmarks of
everyday cultural knowledge such as BLEnD (2024), and studies of stereotyping in image generators.
**Answer:** —

### T-019 · Which physical processes make the atlas's elements, and which of them already have a model?

**Status:** open (the card after C-016)
**Parent:** C-015
**Opened:** 2026-11-22
**Question:** Build the first `processes/index.md` (`docs/architecture.md` section 7b): list the physical processes
behind Lumenary's 214 entries and patternbook's own treatments, then give each of the atlas's 755 elements its
process (or "no page yet"), and sort it as a surface look, a pattern or a form. Pairings to check rather than assume:
kantha and running stitch (sashiko's model), dabu and resist dyeing (batik's), blue pottery and painting on tin glaze
(Delft's, Hala's), the shadow puppets of Andhra and Kerala and pierced, lit hide.
**Answer:** —

### T-020 · Run C-016's sweep for India, so the India-to-Pakistan ratio can be compared before and after

**Status:** open
**Parent:** C-016
**Opened:** 2026-11-22
**Question:** C-016 had no control arm. Re-enumerate India's textiles and dress from the same kinds of sources (India's
GI register of 822, the textile and dress entries in its official list; Hindi, Bengali, Tamil, Gujarati and other
Indian-language Wikipedias; colonial district gazetteers and provincial monographs for places now in India), class
each element new / newly Indian / confirmed / unclear as C-016 did, and compare India's rise with Pakistan's 56-62 %.
If India rises by about as much, the lean is mostly the subject's (or every source's); if by much less, English
Wikipedia was the main cause.
**Answer:** —

### T-021 · How should the atlas show a craft that both sides of a border have notified or registered?

**Status:** open
**Parent:** C-016
**Opened:** 2026-11-22
**Question:** Azad Kashmir's notified GIs (pashmina, sozni, kani, papier-mâché) carry the same names as India's
Kashmir GIs. The atlas names regions historically and by modern country together; it needs a rule for one element
claimed by two registers, stated neutrally, with both registrations recorded and neither preferred.
**Answer:** —

### T-022 · What lets a bagh cover its ground entirely, when darning leaves its pick-ups bare?

**Status:** open
**Parent:** C-021
**Opened:** 2026-11-22
**Question:** `counted-darning` with a float of 5 and a pick-up of 1 leaves 18 % of a bagh's ground bare, where sources
describe bagh as covering the ground entirely. Two explanations, not yet tested: bagh's floats are much longer than its
pick-ups, on a finer khaddar; or untwisted floss spreads along the stitch over the pick-up. Measure both in photographs
of real bagh once the atlas has samples (float and pick-up lengths in ground threads; how much ground shows), then
model the floss's spread if the counts alone don't explain it.
**Answer:** —

### T-023 · How deep must indigo be before madder over alum on it reads blue rather than violet?

**Status:** open
**Parent:** C-024
**Opened:** 2026-11-22
**Question:** `dye-baths` gives violet (hue 300) after one indigo bath and dark blue (hue 242) after two, because its
absorbances were set by eye. Find measured absorbance of indigo and of alizarin on alum (reflectance curves of dyed
cotton), set `ABSORB` from them, and compare with photographs of cloth overdyed in that order.
**Answer:** —

### T-024 · What sets the share of a dabu's resist that its cracks let indigo into?

**Status:** open
**Parent:** C-024
**Opened:** 2026-11-22
**Question:** the model's veins cover 19 % of the resist at its lowest crack density and 31 % at its highest, so each
vein's width (the crack's width plus wicking) sets the share more than the number of cracks. Measure vein width and
spacing in photographs of dabu once the atlas has samples, and set both from them.
**Answer:** —

### T-025 · What measure would see dye running further along the threads than across them?

**Status:** open
**Parent:** C-024
**Opened:** 2026-11-22
**Question:** wicking along the warp and the weft spreads dye by the same variance in every direction, and only its far
edge differs; a 10-90 % width can't see that, and a 5 % reach was too noisy to use. Candidates: the reach of warp-top and
weft-top pixels separately, or the area dye covers past the edge per unit of edge. Decide before the next dyeing card.
**Answer:** —

### T-026 · Does a real shisha opening keep its grid's square, and by how much?

**Status:** open
**Parent:** C-025
**Opened:** 2026-11-22
**Question:** `mirror-inset` pulls a square grid 70 % of the way to a circle, which leaves the opening's order-4 harmonic
at about 0.9 px on a 24 px mirror. That the opening keeps the square is inferred from tutorials. Measure the opening's
harmonics in photographs of Sindhi, Kutch and Baloch mirror work once the atlas has samples, and set `pull` from them.
**Answer:** —

### T-027 · What share of mirrors on a worn piece catch the light, and how far apart are their glints?

**Status:** open
**Parent:** C-025
**Opened:** 2026-11-22
**Question:** with a tilt of up to 0.12 and the lamp where it is, 17 of 23 modelled mirrors glint strongly. Count
glinting mirrors and their glints' scatter in photographs of mirror work, and set `tilt`, `curve` and the lamp from
them (older blown-glass mirrors and machine-cut ones separately, if photographs allow).
**Answer:** —

### T-028 · How thick does glaze lie in real kashi's hollows, and how far does its cobalt spread?

**Status:** open
**Parent:** C-026
**Opened:** 2026-11-22
**Question:** `glaze-layer`'s levelling distance (6 px), tint, and spread (0.55 px per px of thickness) were set by eye.
In close photographs of Multani and Hala tiles, measure how much deeper the glaze's colour is in sgraffito grooves than
on the flat, and how soft the cobalt outlines are where the glaze is thick and thin; set the three dials from them.
**Answer:** —

### T-029 · Do parchin kari cutters turn each piece so the stone's bands run along it, or choose it for shading?

**Status:** open
**Parent:** C-027
**Opened:** 2026-11-22
**Question:** `inlay-cut` turns every piece so its bands run along its long axis, which is C-018's premise; the sources
read for C-027 say only that the joins are almost invisible. Look for a workshop account or a conservation study of
Agra or Mughal inlay that says how a piece's patch of stone is chosen (bands along the petal, shading from base to tip,
or colour alone), and check it in close photographs of the Taj Mahal's and Agra's inlay.
**Answer:** —
