# Pieces

A piece is one made thing that recurs across a tradition's buildings or objects: a jali, a jharokha, a chhatri. For
each piece, patternbook learns its variations from real examples, measures them, and writes a generator that makes new
ones inside what the examples do, or outside it on purpose.

There are two kinds:

- **a pattern**: one surface cut or laid by one rule. The jali is the first. Pinjrakari (Kashmiri timber lattice) and
  khatamband (geometric timber ceilings) are star patterns too, so they reuse most of the jali's generator with new
  measures and a new material.
- **an assembly**: pieces put together. A jharokha is an arch, a jali, brackets and an eave. Assemblies come after
  the patterns they are made of.

A generator's output is a design in open formats (an outline as SVG, a map of what is open and what is solid, a
thickness), so a piece can be printed, cut or built in 3D by any tool that reads them.

## The process, for each piece

1. **Samples.** 15 to 20 real examples across the piece's families, each with its source, licence, date, place,
   material and size, depth included. Five similar things from other traditions are the control. File:
   `pieces/<piece>/samples.tsv`.
2. **Measures.** The same few numbers for every sample and every control, read from the photo and the catalogue by
   code, with each sample's mask laid over its photo on a sheet so a person can see the reading. The spread within
   each family is recorded, not only the middle. File: `pieces/<piece>/measures.tsv`.
3. **How it was made**, by `METHOD.md` step 2c: the process, what it could not do, what it always got slightly wrong,
   the equations, the dials. Process models already written live in `engine/core/` and `processes/primitives.md`.
4. **Grammar.** The piece in layers, each with its dials. For a jali: the frame (rectangle, pointed arch, cusped
   arch), the layout (one field, panels, a medallion), the pattern (stars, hexagons, a tree), the cut (bar width,
   open share), the material (sandstone or marble, its thickness). Each dial's range comes from step 2.
   **Directions** are named recipes: historical ones (a Fatehpur Sikri geometric, an Ahmedabad tree), deliberate
   departures (a jali at the scale of a building's front), and crossings with other crafts in patternbook (a jali
   whose pattern is a kolam). A design outside the measured range is always labelled as a direction. File:
   `pieces/<piece>/grammar.md`.
5. **Generator.** Dials and a seed in; the design out (outline, open and solid map, thickness), the same every time.
   It joins the engine's service, so the MCP server can make the piece. File: `engine/core/<piece>-design.js`.
6. **Creatives sheet.** Generated designs beside the samples, measured by the same code as step 2, and a blind pick:
   both shown as masks at the same size (solid dark, open light), so a person judges the design and not the
   photography. File: `runs/<card>/`.

Steps 1 and 2 are one card; steps 3 to 6 are one card. A piece whose families need two different rules (the jali's
geometric screens and its tree screens) takes the second rule as a later card.

## Rules

- Samples come from open collections (the Met's and the V&A's collection APIs; the Cleveland Museum of Art's open
  access) or openly licensed photos. Public-domain images are committed; others stay on the machine that measured
  them, and the repository keeps the link and the measurements. Licence notes here are not legal advice.
- The measuring code that reads the samples also reads the generated designs. It is first checked on synthetic
  pieces whose numbers are known.
- A dial's range is the samples' 10th to 90th percentile in that family, unless a card says otherwise.
- A person judges the blind pick.

## The mathematics a generator can draw on

The four or five measured numbers describe a piece; they do not draw one. These are the parts of mathematics that do,
by layer. References are named from memory and checked when a card uses them.

| Layer | What it gives a generator | Where it comes from |
|---|---|---|
| **Symmetry** (group theory) | A repeating pattern has one of 17 wallpaper symmetries, and can only turn by a half, a third, a quarter or a sixth (the crystallographic restriction). So an eight-point star in a repeating jali is eight-fold only locally; the whole pattern is at most four-fold. A generator designs one small region (the fundamental region) and lets the symmetry fill the plane. Borders have one of 7 frieze symmetries. | Conway, Burgiel and Goodman-Strauss, *The Symmetries of Things* (2008); Grünbaum and Shephard, *Tilings and Patterns* (1987); detecting the symmetry in a photo: Liu, Collins and Tsin (2004) |
| **Graphs** (topology) | A screen's bars are a graph: junctions, bars, openings. On one repeat, Euler's formula gives openings per junction = (average bar ends per junction) / 2 - 1: one opening per junction where two bars cross, one per two where three meet. Patterns of strands crossing in pairs can always be woven over and under, and their openings can always be coloured in two alternating colours. | Euler's formula on the torus; Grünbaum and Shephard, "Interlace patterns in Islamic and Moorish art" (1992) |
| **Polygons in contact** | Take a tiling; from the middle of each edge draw two lines at a chosen angle until they meet. With the right tiling and angle it gives many historical star patterns; turning the angle gives new ones. | Hankin (1925, from buildings he studied while living in Agra); Kaplan and Salesin (2004); Kaplan (2005); Bonner, *Islamic Geometric Patterns* (2017) |
| **Fields** (calculus) | A design as a function on the plane, open where it is positive. Bars cut where a field crosses zero vary in width as 1 / (the field's slope); bars cut from a distance field (slope exactly 1, the eikonal equation) keep one width everywhere. Fourier series with tied coefficients make fields with any wallpaper symmetry; a sum of cosines in 8, 10 or 12 directions makes star fields that never repeat (quasi-periodic). An angle-preserving (conformal) map bends a lattice into an arch and keeps every star a star. | Farris, *Creating Symmetry* (2015); Lu and Steinhardt (2007) on quasi-periodic girih; Schwarz-Christoffel maps |
| **Growth** | Branching rules for trees and vines that fill a frame: L-systems, and space colonisation, where branches grow toward points scattered in the space still empty. Mirrored, they draw tree-of-life screens. | Prusinkiewicz and Lindenmayer (1990); Runions, Lane and Prusinkiewicz (2007) |
| **Shape grammars** | Rules that rewrite shapes into shapes: split a frame into panels, a panel into a field and a border, a field into motifs. Stiny wrote one for Chinese lattice windows. | Stiny and Gips (1971); Stiny, "Ice-ray" (1977) |
| **Light** | A thick screen's cast light changes with the sun (C-028). Working backwards from the light wanted on the floor to the screen that casts it is an inverse problem, solved for sculptures' shadows. | Mitra and Pauly, "Shadow Art" (2009) |
| **Strength** | Topology optimisation finds where material must be for a slab to hold its own weight; what it leaves open is a screen designed by physics. | Bendsøe and Sigmund (2003) |
| **Taste** | Measures proposed for what holds the eye: order over complexity, fractal dimension, several readings of one pattern at once. Each is contested; none is a judge here, only a hypothesis to test against people's picks. | Birkhoff, *Aesthetic Measure* (1933); Spehar and others (2003) |

## Pieces so far

| Piece | Kind | Cards |
|---|---|---|
| jali | pattern | C-031 samples and measures (closed: no proportion sets a jali apart; geometric jalis are strands or cells; 2.7 to 5.1 openings deep); C-032 grammar and generator (closed: 9 of 24 inside real ranges; too exact to the eye); C-033 the hand (closed: jitter and drift measured, now defaults); C-034 composition (closed: four layouts cover 15 of 19) |
