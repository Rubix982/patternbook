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
