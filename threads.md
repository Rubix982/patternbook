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
