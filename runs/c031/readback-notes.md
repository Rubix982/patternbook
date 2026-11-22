# C-031: how the reader got to where it reads back

The reader (`tools/screen_measure.py`) was checked on synthetic screens drawn by `engine/core/pattern.js`
(`engine/check/screens.mjs`) before any real screen was measured, and again after every change. Each change below was
made because a synthetic screen, or a sample's floor, showed a fault; none changed what the card asks for.

1. **Run 1** (`readback-run1.json`). Bars and openings read 1 px low (the reader took twice the distance less one pixel;
   twice the distance is right). Open share was compared with the infinite pattern's, though the frame cuts the
   pattern, and the reader grew the field by half a bar, which a frame cutting the openings doesn't need.
2. **Squares read 1.077 openings per junction.** The counting window's edges lined up with the grid, so whole rows fell
   in or out together; counting each opening by its top-left pixel did not help. Fixed with a smooth weight rising from
   the field's edge over two repeats, which averages over where the edge falls.
3. **The star was read from one opening's corners**, which gives 2 for a petal in a rosette of twelve. Replaced by the
   turning order round each opening's centre and each junction. Two first attempts failed on the synthetic screens:
   summing rings scaled to the typical opening missed the stars, and reading each ring alone over-read squares as 8 and
   hexagons as 12 (single rings happen to cross neighbours at nearly even angles). The reader that holds turns a disc
   onto itself and takes the first clear peak (r >= 0.8, after a dip 0.3 below it).
4. **The first star screens were badly drawn.** Lines of two overlapping squares and of two overlapping hexagons: the
   lattice cut the squares' points and fused the hexagons' edges, so neither picture was the star it claimed. Redrawn
   as stars cut from a slab, and later at a real screen's density (about ten repeats across instead of six), where the
   junction count had failed for lack of repeats.
5. **Junctions.** A star-shaped hole's notches grow skeleton branches that aren't bars; the reader keeps only the
   skeleton's loops (every bar of a screen runs between junctions). Branch points with fewer than three branches are
   dropped, and junctions whose inscribed circles overlap are merged (an X-crossing split in two). Merging by half a
   bar's width had fused separate junctions in a slab, where the "bar" is wide.
6. **A rosette screen** (twelve petals round each hub) was added to test whether hubs where many bars meet are lost.
   They are not: it reads 12. The doubt it was added for (vam-O167205 reading 3) stands as a reading, not a fault.
7. **Specks** (after run 1 on the real screens, `measures-run1.json`). Two controls' opening widths were set by specks in
   their surfaces (5.7 and 8.7 px medians). Openings under 6 px across are now stone (the read-back's smallest opening is
   10 px), and the opening width is the median weighted by area. The read-back passes again; one sample still under 12
   px (vam-O442441) was fetched again at 2500 px.

The read-back now: seven synthetic screens (square, honeycomb, triangle and Pythagorean line patterns; eight- and
twelve-point star slabs; a twelve-petal rosette) give open share, bar width, opening width and openings per junction
within 5 %, and rotation, mirrors, corners and star exactly (`readback.json`). The junction degree, a side reading,
runs low where six or more bars meet (5.3 for 6 on the triangle grid) and is not used for any conclusion.
