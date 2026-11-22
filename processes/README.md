# processes

The physical processes behind every look in patternbook: how something was made, what that process can't do, what
it always gets slightly wrong, and the maths that models it (METHOD step 2c). `docs/architecture.md` section 7b
explains why they live here, at the top level.

A process belongs to no single tradition and to neither shelf. Resist dyeing makes Java's batik, Sindh's ajrak and
Rajasthan's dabu. A press's ink spread is the same physics on a 1950s field magazine and on a block-printed cotton.
So the pages shelf's print treatments, the atlas's crafts, and the treatments and generators all point here.

## What is here

- `<process>.md`: one page per process, written from `_template.md`.
- `primitives.md`: the operations that recur across processes (palette snapping by a perceptual colour distance,
  majority filtering, outlines from edges, seeded noise, resist masks, dot lattices, stitch fields, crackle networks,
  relief shading from a height and a light, misregistration), each written once with its maths and linked to the
  processes and implementations that use it.
- `index.md`: generated, never edited by hand. Each process with the atlas elements it makes, its models and its
  primitives; and the atlas elements whose process has no page yet.

C-017 (2026-11-22) converted Lumenary's 214 treatments into models (`models/lumenary/<id>.json`, from the
classification in `models/lumenary-map.tsv`) and listed the 82 processes they imitate, each with a page at "listed"
holding its models. `index.md` has them all, and the 99 entries that imitate no physical process. Regenerate with
`node tools/process_models.mjs`; it only rewrites the block between a page's models markers. `primitives.md` was
written in C-018 from tags on all 610 of the models' equations. Giving atlas elements their processes is T-019
(`threads.md`).

## Where models come from

Any implementation of a process is a model of it, credited to whoever made it:

- **patternbook's own treatments and generators** (`treatments/`, `engine/`). Their theory notes move into the
  process pages as those pages are written, each leaving a pointer where it was.
- **Lumenary** by Mursal Furqan Kumbhar (https://github.com/mursalfk/lumenary). His engine and theory data are
  vendored unchanged in `vendor/lumenary/` (see its `NOTICE.md`), and his theory pages are rendered in
  `treatments/lumenary/theory/`. A process page cites the entry it draws on and links his page there. His text
  stays attributed in that one place; improvements are offered back to him.
- **Papers and books**, cited through `references/references.md`.

## Rules

- A process page is written from sources and from the process's own physics, not from how a look appears.
- Every equation says where it came from: a model's code, a paper, or derived here.
- The variants section is where traditions differ: the same process, different rules (wax, mud, or a paste with
  mordants as the resist).
- Atlas elements link here through their `processes:` field. A process page never claims an element that the atlas
  doesn't list.
