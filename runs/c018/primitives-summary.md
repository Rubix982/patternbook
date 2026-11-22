# Primitives summary — Lumenary process library

Built 2026-11-22 from the 214 Lumenary models in `processes/models/lumenary/` and their 610 equations. Companion files: `primitives-vocab.md` (the vocabulary) and `equation-tags.tsv` (one line per equation).

## How this was done

The procedure was followed in the order given.

1. **Seeded** the vocabulary from the six foundation pages and from the shared helper code (`utils.js`, `helpers.js`, `culture.js`, `toon.js`, `retro.js`, `history.js`, read from source).
2. **Extended** it from a sample of 43 models covering every class that has equations (the list is at the top of `primitives-vocab.md`). An operation entered v1 when two or more sample models applied it; operations seen once were held as candidates.
3. **Froze v1** (53 primitives) and wrote it to `primitives-vocab.md` before tagging anything.
4. **Tagged all 610 equations**, five chunks in model order. An operation outside v1 was tagged as a candidate. At the end, 18 candidates applied by three or more models were added, each with its reason in `primitives-vocab.md`. The other 20 candidates stayed below three models and were dropped. Their equations fall back to bespoke, and the TSV note names the dropped candidate.
5. **Named** primitives at the level of an operation (e.g. `tone-line-screen`: a line screen whose line width follows tone; `crackle-network`: cell borders where F2 − F1 is small).

The two `subject` models (split-treatment, type-behind) have no equations, so 212 models contribute.

## Headline

**489 of the 610 equations (80.2 %) apply at least one shared primitive, and 58 shared primitives cover them.** Said plainly: four in five of the written equations do something that at least two other treatments also do. Most of the remaining fifth is one-off generative maths (tilings, fractals, growth simulations) and page layout.

| | equations | share of 610 |
|---|---:|---:|
| apply at least one primitive | 494 | 81.0 % |
| apply at least one **shared** primitive (applied by 3+ models) | 489 | 80.2 % |
| apply only an unshared primitive | 5 | 0.8 % |
| bespoke, `specific` (maths written for this treatment alone) | 85 | 13.9 % |
| bespoke, `layout` (frames, margins, placement, sizes) | 25 | 4.1 % |
| bespoke, `constants` (palette tables, fixed numbers) | 6 | 1.0 % |

The five equations that apply only an unshared primitive are anime-cel 0 (`bilateral-smooth`), gradient-mesh 1 (`bilinear-sample`), kinetic-type 1 (`mask-clip`), maori-koru 1 (`variable-width-stroke`) and ukiyo-e 1 (`mode-filter`).

## Number of primitives

- **71** in the vocabulary: 53 in v1 and 18 added after the freeze.
- **68** applied by at least one equation.
- **58 shared** (applied by 3+ distinct models): 40 from v1 and all 18 additions.
- **10** applied by only one or two models: `bilinear-sample`, `dog-lines`, `mask-clip`, `resist-mask`, `variable-width-stroke` (2 each); `bilateral-smooth`, `bright-spot-pick`, `dilate`, `mode-filter`, `vignette` (1 each).
- **3** never written in any equation: `luminance`, `palette-remap`, `pixel-glyphs`. They exist as helpers in the code (see "Written equations against the code" below).

**How concentrated the coverage is.** In a greedy cover, 9 shared primitives reach half of the 489 covered equations, 20 reach three quarters and 35 reach 90 %. All 58 are needed for the full 489, and the last one adds a single equation. The first 10 primitives alone cover 278 equations (45.6 % of all 610), and the first 20 cover 368 (60.3 %).

## How much the headline depends on judgement

- **Without the post-freeze additions** (v1 shared primitives only): 422 / 610 = **69.2 %**. The 18 additions add 11 points.
- **Without the generic utility primitives**: 402 / 610 = **65.9 %**. These are foundation-level operations with no craft content: `seeded-random`, `smooth-noise`, `soft-threshold`, `tone-curve`, `blur`, `mix-over`, `multiply-blend`, `additive-blend`, `luminance`, `bilinear-sample`, `saturation-adjust`. The 87 equations they cover on their own are mostly tone curves, random draws and simple layer blends.

## Share covered by shared primitives, by class

Sorted by share. The last column leaves out the generic utilities listed above. Classes with fewer than ten equations (inlay, glass, weaving, lacquer, piercing, dyeing) are too small for their share to mean much: one equation moves them by 10 to 20 points.

| class | models | equations | covered | share | share without generics | distinct shared primitives used |
|---|---:|---:|---:|---:|---:|---:|
| inlay | 2 | 5 | 5 | 100.0 % | 100.0 % | 8 |
| weaving | 3 | 8 | 8 | 100.0 % | 87.5 % | 8 |
| glass | 2 | 6 | 6 | 100.0 % | 83.3 % | 7 |
| carving | 5 | 16 | 15 | 93.8 % | 87.5 % | 9 |
| glaze | 5 | 16 | 15 | 93.8 % | 81.2 % | 16 |
| other | 5 | 14 | 13 | 92.9 % | 71.4 % | 10 |
| drawing | 12 | 37 | 34 | 91.9 % | 78.4 % | 21 |
| printing | 20 | 58 | 53 | 91.4 % | 70.7 % | 22 |
| photographic | 11 | 33 | 30 | 90.9 % | 51.5 % | 19 |
| dyeing | 3 | 9 | 8 | 88.9 % | 88.9 % | 7 |
| optical-device | 13 | 36 | 32 | 88.9 % | 72.2 % | 21 |
| stitch | 11 | 32 | 28 | 87.5 % | 84.4 % | 16 |
| lacquer | 2 | 8 | 7 | 87.5 % | 87.5 % | 7 |
| painting | 14 | 47 | 41 | 87.2 % | 70.2 % | 28 |
| cutting | 5 | 14 | 12 | 85.7 % | 42.9 % | 11 |
| piercing | 2 | 7 | 6 | 85.7 % | 85.7 % | 8 |
| motion | 15 | 44 | 35 | 79.5 % | 61.4 % | 16 |
| digital | 22 | 58 | 43 | 74.1 % | 62.1 % | 23 |
| style | 20 | 49 | 31 | 63.3 % | 51.0 % | 23 |
| geometric | 40 | 113 | 67 | 59.3 % | 53.1 % | 34 |
| **all** | **212** | **610** | **489** | **80.2 %** | **65.9 %** | **58** |

Among classes with more than 30 equations, the highest are drawing (91.9 %), printing (91.4 %) and photographic (90.9 %). The lowest are geometric (59.3 %), style (63.3 %) and digital (74.1 %).

Geometric holds 41 of the 85 `specific` equations: Penrose deflation, the pentagrid and Hankin's rule, Hilbert indexing, Fourier epicycles, L-systems, Gray-Scott reaction-diffusion, space colonisation, the chaos game and strange attractors, the metaball kernel. Style's gap is mostly layout (9 of its 18 bespoke equations: mastheads, crops, letterbox bars, text setting). Photographic drops furthest when generics are removed, from 90.9 % to 51.5 %, because its looks are mostly tone curves, grain and blends.

Eight models have no equation applying a shared primitive: fourier-epicycles, girih, l-system-trees, mondrian, penrose-tiling, photomosaic, reaction-diffusion, space-colonization.

## The 20 most-applied primitives

By the number of distinct models whose equations apply them. Positions 20 and 21 tie at 10 models.

| rank | primitive | what it does | models | equations | entered |
|---:|---|---|---:|---:|---|
| 1 | `tone-curve` | contrast about mid-grey, gamma, toe and shoulder | 45 | 50 | v1 |
| 2 | `seeded-random` | reproducible random numbers and coordinate hashes | 36 | 38 | v1 |
| 3 | `coordinate-warp` | read the source at remapped positions | 31 | 41 | v1 |
| 4 | `soft-threshold` | smoothstep threshold into a soft mask | 30 | 33 | v1 |
| 5 | `tone-bands` | posterize: thresholds pick a level, colour or motif | 29 | 30 | v1 |
| 6 | `smooth-noise` | seeded value noise and fBm | 26 | 30 | v1 |
| 7 | `mix-over` | lay a colour over the base by coverage | 25 | 25 | v1 |
| 8 | `tone-line-screen` | lines whose width or position follows tone (hatching, engraving) | 20 | 32 | v1 |
| 9 | `lattice-repeat` | repeat on a square, brick, hex or polar lattice | 19 | 22 | v1 |
| 10 | `blur` | box or Gaussian blur | 17 | 17 | v1 |
| 11 | `relief-shading` | light a height map from one direction, with occlusion | 14 | 19 | v1 |
| 12 | `tone-mark-size` | mark size follows tone, off a lattice | 14 | 14 | added |
| 13 | `importance-sampling` | tone or edge strength sets where marks go | 13 | 16 | v1 |
| 14 | `misregistration` | plates or channels read at a shift | 12 | 15 | v1 |
| 15 | `edge-outline` | ink where blurred Sobel edge strength is high | 12 | 12 | v1 |
| 16 | `multiply-blend` | transparent inks, pigment darkening | 12 | 12 | v1 |
| 17 | `tone-to-height` | height map from tone and pattern (emboss) | 12 | 12 | v1 |
| 18 | `tone-dot-lattice` | halftone: dot (or motif) area follows tone on a lattice | 11 | 15 | v1 |
| 19 | `colour-ramp` | gradient map along colour stops | 11 | 11 | v1 |
| 20 | `palette-snap` | nearest colour from a fixed list (redmean or weighted) | 10 | 10 | v1 |
| 20 | `saturation-adjust` | saturation and lightness change | 10 | 10 | v1 |

### All 71 primitives

| primitive | entered | models | equations | shared |
|---|---|---:|---:|---|
| `tone-curve` | v1 | 45 | 50 | yes |
| `seeded-random` | v1 | 36 | 38 | yes |
| `coordinate-warp` | v1 | 31 | 41 | yes |
| `soft-threshold` | v1 | 30 | 33 | yes |
| `tone-bands` | v1 | 29 | 30 | yes |
| `smooth-noise` | v1 | 26 | 30 | yes |
| `mix-over` | v1 | 25 | 25 | yes |
| `tone-line-screen` | v1 | 20 | 32 | yes |
| `lattice-repeat` | v1 | 19 | 22 | yes |
| `blur` | v1 | 17 | 17 | yes |
| `relief-shading` | v1 | 14 | 19 | yes |
| `tone-mark-size` | added | 14 | 14 | yes |
| `importance-sampling` | v1 | 13 | 16 | yes |
| `misregistration` | v1 | 12 | 15 | yes |
| `edge-outline` | v1 | 12 | 12 | yes |
| `multiply-blend` | v1 | 12 | 12 | yes |
| `tone-to-height` | v1 | 12 | 12 | yes |
| `tone-dot-lattice` | v1 | 11 | 15 | yes |
| `colour-ramp` | v1 | 11 | 11 | yes |
| `palette-snap` | v1 | 10 | 10 | yes |
| `saturation-adjust` | v1 | 10 | 10 | yes |
| `particle-motion` | added | 9 | 10 | yes |
| `edge-tangent-field` | v1 | 8 | 9 | yes |
| `specular-highlight` | added | 8 | 9 | yes |
| `tooth-threshold` | added | 8 | 9 | yes |
| `cylinder-shading` | added | 8 | 8 | yes |
| `parametric-curve` | added | 7 | 9 | yes |
| `decay-trail` | added | 7 | 7 | yes |
| `image-gradient` | v1 | 7 | 7 | yes |
| `star-rosette-motif` | v1 | 7 | 7 | yes |
| `crackle-network` | v1 | 6 | 7 | yes |
| `ease-toward-target` | added | 6 | 6 | yes |
| `stitch-grid` | v1 | 5 | 11 | yes |
| `iso-contours` | v1 | 5 | 7 | yes |
| `sdf-shape` | v1 | 5 | 7 | yes |
| `poisson-disc` | v1 | 5 | 6 | yes |
| `projection-3d` | added | 5 | 6 | yes |
| `additive-blend` | v1 | 5 | 5 | yes |
| `ordered-dither` | v1 | 5 | 5 | yes |
| `sheet-edge` | added | 4 | 5 | yes |
| `symmetry-fold` | added | 4 | 5 | yes |
| `coarse-grid` | v1 | 4 | 4 | yes |
| `facet-shading` | added | 4 | 4 | yes |
| `flicker` | added | 4 | 4 | yes |
| `frame-history` | v1 | 4 | 4 | yes |
| `glow-bloom` | v1 | 4 | 4 | yes |
| `grain-overlay` | v1 | 4 | 4 | yes |
| `hue-shift` | added | 4 | 4 | yes |
| `label-boundary` | v1 | 4 | 4 | yes |
| `streamline-trace` | v1 | 4 | 4 | yes |
| `channel-mix` | added | 3 | 5 | yes |
| `voronoi-cells` | v1 | 3 | 4 | yes |
| `auto-levels` | v1 | 3 | 3 | yes |
| `kmeans-palette` | v1 | 3 | 3 | yes |
| `material-ground` | v1 | 3 | 3 | yes |
| `running-stitch` | added | 3 | 3 | yes |
| `scroll-loop` | added | 3 | 3 | yes |
| `unsharp-mask` | added | 3 | 3 | yes |
| `bilinear-sample` | v1 | 2 | 2 | no |
| `dog-lines` | v1 | 2 | 2 | no |
| `mask-clip` | v1 | 2 | 2 | no |
| `resist-mask` | v1 | 2 | 2 | no |
| `variable-width-stroke` | v1 | 2 | 2 | no |
| `bilateral-smooth` | v1 | 1 | 1 | no |
| `bright-spot-pick` | v1 | 1 | 1 | no |
| `dilate` | v1 | 1 | 1 | no |
| `mode-filter` | v1 | 1 | 1 | no |
| `vignette` | v1 | 1 | 1 | no |
| `luminance` | v1 | 0 | 0 | no |
| `palette-remap` | v1 | 0 | 0 | no |
| `pixel-glyphs` | v1 | 0 | 0 | no |

### Candidates that stayed below three models

These were tagged during the pass and dropped at the end. Their equations count as bespoke (`specific` unless noted in the TSV). Two models each: depth from tone (anaglyph-3d, depth-parallax), environment-strip reflection (chrome, gold-foil), split toning (cinematic, retro-anime), scanlines (cyberpunk, scanlines-crt), thin-film iridescence (daguerreotype, holographic), time easing curve (flying-cards, pixel-dissolve), adaptive split by variance (mondrian, truchet-tiles), drop shadow (mughal-jali, paper-cut-out), linear fade from one side (retro-console fog, ukiyo-e bokashi), greedy path through points (blind-contour, string-art). One model each: flocking, cellular automaton, over/under interlacing, error diffusion, pentagrid, CMYK separation, Delaunay triangulation, flap foreshortening, iterated map, Lloyd relaxation.

## Written equations against the code

This measure counts **written equations**, not code. The model files document what each treatment does, but a treatment's code often calls a shared helper whose operation never appears as an equation. For the helper-backed primitives the gap is large:

| primitive | treatments whose code imports its helper | models whose equations write it |
|---|---:|---:|
| `blur` | 89 | 17 |
| `saturation-adjust` (`vivid`, HSL) | 59 | 10 |
| `auto-levels` (`stretch`) | 49 | 3 |
| `image-gradient` (`sobel`) | 38 | 7 |
| `palette-snap` (`nearest`, `paletteIdx`, `matchPalette`) | 26 | 10 |
| `luminance` (`lumOf`, `lumArray`) | 19 | 0 |
| `kmeans-palette` (`kmeans`, `paletteOf`, `flatten`) | 17 | 3 |
| `mode-filter` | 8 | 1 |
| `material-ground` (`clothFill`, `woodFill`, `carvedStone`) | 9 | 3 |

So the 80.2 % figure is about the maths each model documents. The code reuses shared building blocks more widely than the equations show. The direction can also run the other way: `tone-curve` is written in 45 models' equations, but its helper `contrast` is imported by only 7, because most tone curves are written inline.

## Operations the subcontinent's crafts would need

Each verdict says how far the shared primitives (or the unshared ones, where named) cover the operation. It is based on the equations and, where an equation note was not enough, on the treatment's code.

| operation | verdict | what covers it | what is missing |
|---|---|---|---|
| **Weaving structures:** warp and weft | partly | `cylinder-shading` (rounded weft passes and threads: tapestry-weave, navajo-weave, kente), `lattice-repeat` (strips, cells, brick offsets), `material-ground` (a sine weave texture on cloth grounds) | The interlacement itself. No primitive takes a weave draft (which warp is up at each pick: plain, twill, satin) and works out where warp or weft shows. Tapestry's visible warp is a bespoke gap term. Celtic-knot's over/under parity is one model. |
| **Weaving structures:** supplementary weft (jamdani, brocade) | not covered | kente's float blocks are the nearest: `seeded-random` decides whether a block is a float | An extra weft that floats over the ground only inside a motif and is tied down at intervals: discontinuous, motif by motif, in jamdani; selvedge to selvedge, often in zari, in brocade. |
| **Stitch paths:** running | covered | `running-stitch` (felt-story, ralli-patchwork, sashiko) | Only along straight lines, seams and edge insets. Rows that follow a curved motif, as in kantha, would need `streamline-trace` and `running-stitch` together, and no treatment combines them. |
| **Stitch paths:** darning | partly | `stitch-grid` (phulkari: stitch direction per block, length in cells, coverage by distance to the stitch), `edge-tangent-field` | Phulkari darns on a grid of picture cells, not on the threads of a ground weave, because there is no weave primitive to count on. The silk's sheen changing with stitch direction is in phulkari's description, not in a primitive. |
| **Stitch paths:** chain | not covered | the parts exist separately: `streamline-trace` for the path, `sdf-shape` for one loop, `cylinder-shading` for the thread | A line of interlocking loops along a path, each anchored by the next, as in aari or tambour work and Kutch and Sindh chain embroidery. |
| **Slip and glaze layers** | partly | `mix-over` (cobalt wash over glaze), `crackle-network` (crazing), `cylinder-shading` (curve of the pot), `coordinate-warp` (wrap onto a turned form), `tone-bands` (glaze grounds), `soft-threshold` (black-figure slip mask) | A layer with thickness. Glaze that pools darker in hollows and breaks lighter over edges needs glaze colour as a function of a height map, which `relief-shading` does not give. Also missing: slip trailed as a raised line, sgraffito cut through slip to the body, and underglaze seen through a clear glaze. In Hala and Multani blue pottery the cobalt under clear glaze is drawn only as a flat wash. |
| **Mordant and resist dyeing in several baths** (ajrak) | partly | `resist-mask` (ajrak, batik: 2 models, so not shared), `misregistration` (block offset), `tone-bands` (dye state per block), `crackle-network` (batik's wax crackle) | The process. Ajrak's code gives each block a final state from fixed palettes, i.e. the finished cloth. There is no ordered sequence of baths in which a dye takes only where mordant is printed and no resist covers, no resist added or washed out between baths, no overdyeing (indigo over madder giving near-black), and no dye bleeding at a resist edge. |
| **Inlay cutting and fitting** (pietra dura, parchin kari) | partly | `voronoi-cells` and `label-boundary` (regions), `palette-snap` (stones from a fixed set), `crackle-network` (seams), `material-ground` (stone), and in byzantine-mosaic `streamline-trace` with `poisson-disc` for tesserae | Cutting each piece from a veined slab so the vein runs with the petal, i.e. choosing and turning a patch of texture per region. Photomosaic's tile choice is the nearest idea and is bespoke. Also missing: tight fitting along motif-shaped boundaries rather than Voronoi ones, and the specular response of polished stone inlay. |
| **Mirror work** (shisha, abhla bharat) | partly | `lattice-repeat` (brick or hex mirror lattice), `coordinate-warp` (each mirror shows the surroundings shrunk 3.4 times), `hue-shift` (thread colours) | The mirror inset is in 2 models (sindhi-mirror-embroidery, sindhi-topi), so it is not shared. The ring of radiating holding stitches and the glass glint are drawn in sindhi-mirror's code (a radial gradient), not written as equations. Environment reflection is in 2 models and unshared. |
| **Block-print registration with several blocks** | mostly covered, by combining shared primitives | `misregistration` (12 models), `lattice-repeat` (one block repeated across the cloth), `multiply-blend` (each block overprinting the ones before), `smooth-noise` (uneven inking: adinkra, rubber-stamp), `tone-bands` (which block prints where); screen-print's ink passes at their own offsets | A carved block as one reusable stamp, repeated with a small offset, turn and ink starvation per impression. The order of outline (rekh), filler and ground blocks. Registration marks. |
| **Carving and piercing in stone** | covered for low relief and pierced screens | `relief-shading` (14 models, with occlusion), `tone-to-height` (12), `sdf-shape` (jali openings, Makli rosettes), `star-rosette-motif`, `lattice-repeat` (hex jali lattice) | The thickness of a pierced screen throwing light and shadow through its openings. Mughal-jali does this with an offset lookup of the blurred mask, but that drop-shadow operation is in 2 models and unshared. Also missing: undercutting (relief layers at different depths, with shadow between them) and chisel-mark texture along cuts. |

## Hard calls

1. **Inputs do not count.** An equation that uses a blurred brightness `L_b` or names an edge strength `E` in its note does not thereby apply `blur` or `image-gradient`. Only operations the equation itself performs are tagged. This pushes the count down for blur and Sobel (see the code table above).
2. **Subsumption.** When one primitive is built from another, only the more specific one is tagged: `edge-outline` and not also `image-gradient` and `soft-threshold`; `tone-line-screen` and not also the smoothstep that anti-aliases its lines; `crackle-network` and not also `voronoi-cells`, unless the cell itself (F1, the dome) is also used. An explicit smoothstep used for some other purpose in the same equation is tagged as `soft-threshold`.
3. **Structure versus size.** An equation that defines the structure of a primitive is tagged with it: lattice positions, n stitches across, the cell grid. An equation that only gives sizes or opacities of a primitive's parts, such as line width from a slider, is `layout` or `constants`. Cross-stitch 0, knitted-pattern 0 and wool-crochet 0 (stitch counts across) are therefore `stitch-grid`. Kolam 3 (line width and dot radius) and sindhi-mirror-embroidery 1 (mirror radius and glass fraction) are `layout`.
4. **`tone-dot-lattice` takes any spot shape.** Halftone spot shapes vary anyway, so a lattice of stamps, signs, holes, hexagons or particles whose size follows tone is counted as a halftone screen: adinkra, hieroglyphs, papel-picado, hexagon-mosaic, particles. Marks whose size follows tone but which are not on a lattice (letters on text lines, stipples, circles, figures) became the post-freeze `tone-mark-size`.
5. **`tone-line-screen` takes any space-filling line pattern modulated by tone,** by width or by displacement: straight, wavy, meander (greek-meander), Hilbert, Truchet arcs, barcode bars, Joy-Division ridgelines (ridgeline, oscilloscope, warped-grid), op-art gratings. The defining test was that the line pattern covers the area and the picture reads through how the lines change.
6. **Merges during tagging.** One recurring operation was recognised under several names and recorded once:
   - `tooth-threshold` covers paper tooth, plate grain, ink grain and the dry brush.
   - `cylinder-shading` covers rounded threads, ribbons, gold seams, lenticular lenses and pots.
   - `projection-3d` covers isometric, oblique and perspective projection.
   - Ridged noise stays under `smooth-noise`.
   - `hue-shift` was kept apart from `saturation-adjust`, because the frozen v1 definition of `saturation-adjust` covers saturation and lightness only.
7. **Two near-merges were refused.** Night-sky's constellation links (each star to its two nearest neighbours) are a neighbour graph, not the greedy path that blind-contour and string-art build, so that candidate stayed at two models. Photomosaic's tile choice is nearest-in-feature-space, like a palette snap, but it was left bespoke because the "palette" is a set of pictures with 12-number signatures, not colours.
8. **Generic primitives count.** `seeded-random`, `soft-threshold`, `tone-curve`, `mix-over` and the like are foundation-page operations, and the brief names smoothstep and blur as primitives, so they count toward the headline. Without them the share is 65.9 %. Some equations are covered only because a random number appears in them, e.g. collage-art 1 (random rotation), wave-function-collapse 0 (random tie-break), sindhi-script 1 (random word spacing).
9. **Explanatory equations** (derivations rather than operations) are tagged with the primitive they explain, if they explain one: hala-lacquerware 1 (cylinder wrap density), greek-meander 2 and papel-picado 1 (coverage against width), aboriginal-dot-painting 2 (contour spacing). Otherwise they are `specific`: heat-haze 0 (refractive index), fourier-epicycles 1 (Parseval), op-art-moire 0 (moiré spacing), pointillism 0 and 1.
10. **Rule-based palette choices** count as `palette-snap`: whiteboard 2 picks a marker by chroma and hue. So does a colour space defined for matching: anime-cel 1.
11. **Motion treatments** got their own post-freeze primitives (`particle-motion`, `ease-toward-target`, `decay-trail`, `flicker`, `scroll-loop`). The sample's only motion model was snowfall, so only particle motion and easing were seen before the freeze, each once. A sample with more motion models would have put these operations in v1. That would not have changed the final count, because each one later reached three or more models.
12. **Small classes.** Inlay (5 equations), glass (6), lacquer and weaving (8 each) and dyeing (9) are listed for completeness. Their percentages should not be compared with the large classes.
