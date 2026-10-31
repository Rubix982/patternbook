# Method

How an entry gets made and tested. This is the process C-001 and C-002 actually
followed, written so someone else can repeat it without asking.

## 1. Pick a problem, then sources

Start from a problem a page has to solve ("someone follows steps with their hands
busy"), not from a source you admire. Then find human-made work that solved it under
real pressure — manuals, reference books, timetables, signage, field guides. Prefer
sources made for people who couldn't ask the author a question.

Get the **primary** document (the official PDF, the printed page), not a blog post
about it. Keep local copies in `sources/<family>/` (git-ignored: they're not ours to
redistribute) and put every URL in the entry's `source_docs`.

Look at several documents from the same source, **and make them cover different
products or tasks**, not three versions of one thing. C-003 found that three BILLY
bookcase manuals agreed on facts that half-failed on a chair, a chest of drawers and a
lamp. Sort what you find into:

- **constant**: present in every document;
- **conditional**: present only when the task has a specific problem. Name the
  condition. Most of a good source's devices turn out to be this kind;
- **varies**: differs without a clear reason.

Rules come from constant facts and from conditional ones, stated with their condition.

## 2. Observe and measure

Go page by page. Write down what's there before deciding why.

- Fonts, page size, colours: `tools/measure-pdf.sh <pdf> <page>`. Sample a page that
  has the shading or colour you're describing, not a blank one.
- For a website source: screenshot it and sample the colours, then inspect the CSS for
  fonts. Record the date, since sites change.
- Count things: steps per page, words per step, how often a device repeats.
- Note where the source breaks its own pattern (IKEA uses dense text only for safety
  warnings). These go in section 5 of the entry.

## 3. Write the entry

Copy `library/_template.md` to `library/<problem>/<source>.md`. The template says what
each section needs. Things to check before calling it done:

- Every fact in section 2 says how it was measured.
- Every reason in section 3 names the reader's need it serves.
- Exactly 6 rules in section 4, each checkable yes/no on a finished page, and none
  of them needs the source's brand (logo, mascot, typeface, artwork).

## 4. Test it with a blind pick

An entry isn't trusted until it beats something in a blind pick. Open a card in
`CARD.md` first, with the branches written before anything runs.

1. **Write a brief for a different task** than the source covers (C-001: the source was
   a bookcase, the brief was a bike chain). That tests whether the entry transfers,
   not whether the agent can redo the source.
2. **Fix the arms.** Each arm gets the same brief. One arm gets the entry. The
   comparison arm is what the card is testing against: no guidance (C-001), or a
   reference the agent writes for itself (C-002). Save every prompt verbatim in
   `runs/<card>/prompts/` before running.
3. **Run each arm as a fresh agent** that can't read the rest of the repo. Record time
   taken and file size.
4. **Blind the pages:** `tools/blind.sh runs/<card> <page-x> <page-y>`. The judge
   answers the card's questions before anyone opens `.blind-key`.
5. **Score what you can count:** rules applied (0–6), words outside drawings
   (`python3 -I tools/words.py <pages>`), the default checklist below
   (`python3 -I tools/css-profile.py <pages>` plus a look), and anything else the card
   named.
6. **Write the result in the card,** including the judge's own words and anything the
   run showed was wrong with the card's measures. Update the entry's `tested_in` and
   `best_example`.

## The default checklist (measured in C-005, 2026-10-31)

What this agent builds when given no style, across 7 pages on 6 subjects. A page that
scores high here has drifted back to the default, whatever its subject.

| # | Trait | Seen in | Check |
|---|---|---|---|
| 1 | Warm off-white background, not white | 7/7 | body bg in `#f3efe6`–`#f7f1e6` / `#f5f4ef` range (light, slightly orange/yellow) |
| 2 | Warm near-black text, not black | 7/7 | body text around `#1d1b17`–`#3b2a20` |
| 3 | Terracotta / orange accent | 7/7 | an accent at hue 15–45°, typically `#b4622d`–`#c8471a` |
| 4 | Uppercase letter-spaced eyebrow label above headings | 6/7 | `text-transform: uppercase` + `letter-spacing` on a small label |
| 5 | Pill-shaped chips or badges | 5/7 | `border-radius` ≥ 99px on small elements |

Score 0–5. Re-measure when the model changes; this list went stale once already (C-001's
Inter / purple / gradient list scored 0 on every page).

## Known weaknesses of this method

- One run per arm. Agents vary between runs, and one win could be luck.
- The judge has so far been the person who commissioned the entry.
- Agents that get an entry tend to spend more time and write more code (C-001: ~9×),
  and the method can't yet separate that from the entry's content.
- The "AI default" moves. A checklist of AI tells goes stale (C-001's did), so it's
  rebuilt from no-guidance runs (C-005) and should be re-measured when the model changes.
