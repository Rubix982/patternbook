# Jali

A pierced screen: a slab of stone (or wood, or plaster) cut through so that its pattern is both the stone that stays
and the light that comes through. The process for a piece is in `../README.md`.

## Files

- `candidates.json`: every object the Met's and the V&A's collection APIs returned for the searches in C-031 (561), with
  title, date, place, material, size in mm, licence and image link (`tools/museum.py search`).
- `samples.tsv`: the 26 chosen, their role (jali or control), family, frame, material, size, licence, the settings the
  reader needed (chosen from the mask, never from the numbers), and whether each was measured or left out, with why.
- `measures.tsv`: what the reader found on each (`tools/screen_samples.py pieces/jali --run runs/c031`).
- `images/`: the Met's public-domain photos (CC0), at most 1600 px. The V&A's photos are free for non-commercial use
  under the V&A's terms, so they stay in `images-local/` (git-ignored); `tools/museum.py fetch` gets them again.

## What real jalis measure (C-031)

17 jalis, mostly 19th-century sandstone panels from Agra at the V&A, and Mughal screens of red sandstone and marble at
the Met. The 10th to 90th percentile within each family, which C-032 takes as its dials' ranges:

| Measure | Geometric (15) | Floral (2: range) | All 17: median |
|---|---|---|---|
| open share | 0.36 to 0.60 | 0.34 to 0.56 | 0.50 |
| bar over opening | 0.31 to 0.89 | 0.30 to 0.71 | 0.37 |
| thickness over opening (4 geometric, 1 floral, from catalogue depth) | 2.93 to 4.76 | 3.12 | 3.55 |
| openings per junction | 0.51 to 1.44 | 0.74 to 1.33 | 1.06 |
| turns by (repeat) | 2: 3, 4: 7, 6: 5 | 2, 4 | |
| largest star | 3: 3, 4: 6, 6: 4, 8: 2, 10: 1 | 2, 4 | |

Openings per junction is Euler's formula at work: near 1 where bars cross in pairs (strands), near 0.5 where they meet
in threes (cells), above 1 where hubs gather many bars. The geometric jalis are both kinds: 3 near 0.5, 3 near 0.75,
5 near 1 and 4 above 1.15.

Thickness is the catalogue's depth over the opening's width in mm. It may be the frame's depth rather than the pierced
field's; nothing in these records says which (T-030).

None of these proportions sets a jali apart from other pierced screens (an iron grille, an iron window guard, an
Egyptian stone window, a stucco window screen from Iran): on each, the jalis' middle 80 % takes in at least two of the
four. Turning symmetry may: no control turns by more than a half, against 13 of the 17 jalis by a quarter or a sixth.
That was seen, not tested (T-037).

## How irregular they are (C-033)

Read on the same photos by `tools/screen_hand.py`, calibrated on the generator's own designs: meeting points sit off a
regular lattice by a median 0.048 of a lattice step (0 to 0.075 over the middle 80 %), and the pattern drifts by a
median 0.16 of a step over three steps (0 to 0.38), from 10 jalis with both readings. Both are upper bounds: a photo's
perspective and lens add their own. How much bars vary in width, how round the corners are and how rough the edges are
can't be read back from these photographs (`../../CARD.md`, C-033).

