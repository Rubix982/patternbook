---
art_style: hand-inked illustration, two-colour print, conversational field magazine
source: PS, The Preventive Maintenance Monthly (US Army; art direction by Will Eisner), Issue 15 (1953 series) and Issue 100 (1961 series)
source_docs:
  - https://scholarscompass.vcu.edu/psm/15
  - https://scholarscompass.vcu.edu/psm/100
rights_note: VCU's records don't state public-domain status. Studied locally; no scans are redistributed here.
derived_in: C-011
tested_in: [C-011]
best_example: runs/c011/arm-b.html
---

# Art style: hand-inked, two-colour field magazine

The look of the US Army's maintenance magazine PS from the 1950s–60s. Soldiers read it
to keep vehicles and gear working, so it was written to be read by choice. It's here
because C-010's judge named what made pages read as AI-made: cold, empty space; a missing
header; enthusiastic copy; "polygon-ish" drawings with "no streaks, no flares". PS has the
opposite of each.

Unlike the other style files, this one includes **voice**, because the judge named copy as
a tell.

**Don't copy:** the PS masthead, Eisner's recurring characters (Joe Dope, Connie Rodd, Sgt
Half-Mast), military insignia, or any of the period's pin-up imagery of women. That last
one is excluded on its own terms, not only for copyright.

> **Tested in C-011: won both blind questions** against the line-art style (our previous
> best) on a router page. The judge's one complaint: technical details were "a bit harder to
> navigate". Add a clear index or jump links when you use the dense layout.

## Palette

Black plus **one** flat spot colour, on white. Each issue picked one spot ink: red in
1953, blue in 1961.

| Role | Value | Note |
|---|---|---|
| Page | `#FFFFFF` | the scans show cream/yellow (`#F2E9E0`, `#FCE9B0`), but that's paper ageing, not design. Don't tint the page. |
| Ink | `#1A1A1A` | the scans' ink reads lighter (`#4A4E58`) because it has faded |
| Spot | `#3F6E96` | 1961 blue, sampled (`#426D91`) and rounded. One colour per page. |
| Spot tint | the spot colour at about 25–35% | flat panels behind captions and key statements |

The 1953 red has faded to terracotta in the scans (`#B37355`). Don't use that value: it
lands on the agent's own default accent (C-005).

## Drawing (the main thing)

- **Hand-inked line:** brush or pen strokes that thicken and thin. No uniform vector stroke.
- **Texture and marks:** hatching and cross-hatching for shadow, speed lines, motion streaks,
  dust and smoke puffs, splash and impact marks ("streaks and flares").
- **People and hands doing the task.** Hands on the tool, a mechanic leaning in. Faces may be
  expressive. Use generic people, not the magazine's characters.
- Spot colour **fills** selected areas flat (a part, a hand, a sky), and black carries the line.
- In SVG: vary `stroke-width` along paths, use hatch `pattern`s, and add a slight roughen
  (`feTurbulence` + `feDisplacementMap`, small scale) so lines aren't geometrically perfect.

## Type

- **Display headlines are drawn, and differ per article:** heavy condensed caps, a brush
  script, an outlined italic. Mixing two in one headline is fine ("BE FIRM — *but gentle*").
  On the web, draw them as SVG lettering or use a heavy condensed sans for one and an italic
  serif for the other.
- **Body text in a book serif** (a Caslon/Century kind of face), two columns, with a drop cap
  to open an article. **Bold run-in phrases** inside paragraphs carry the key instruction.
- **Labels on drawings:** short condensed caps in a box (white or spot tint) with an arrow
  to the part: `MUFFLER`, `TAIL PIPE`, `INSERT CAP SEAL HERE`.
- Speech balloons, hand-lettered caps, for asides from the people in the drawing.

## Layout

- **Every article gets a real header:** a big drawn headline, often with an illustration
  that runs across the top. A contents box lists articles by equipment type, with page numbers.
- **Dense, never empty.** Art and text fill the page. Drawings break out of the columns and
  overlap their edges. No large blank areas, and no generous "breathing room" margins.
- **Steps as captioned panels:** a grid of 2–4 drawings, each with a numbered caption in a
  spot-tint box underneath ("1. Aim the ring so it screws on straight…").
- **RIGHT / WRONG** drawn side by side, labelled in caps with arrows.
- Numbered lists of benefits or checks in bold sans, in the spot colour.

## Voice

- **Second person, plain, a bit wry.** "So, watch yourself, friend…" "You don't have to be
  ugly about it…" Never cheerful marketing, never exclamation-mark enthusiasm.
- **Open with the consequence, as a short story:** "If you strongarm this connector… you'll be
  stripping threads — then vibration will shake the connection loose on a dark night four
  miles from nowhere."
- **Then the exact fix, with exact references** (part numbers, the manual and its page), in
  the middle of the chat.
- Short paragraphs. Slang is fine where it's natural to the reader. Jokes are dry.

## When this style fights the content

- **Formal or legal pages** (terms, security notices). The voice is wrong there.
- **Audiences that would read slang as disrespect.** Keep the drawing and layout, and make
  the voice plainer.
- **Practical limit for agents:** convincing hand-inked art is hard in SVG. A drawing with
  varied strokes, hatching and a light roughen is still closer to this than a clean vector
  icon.
