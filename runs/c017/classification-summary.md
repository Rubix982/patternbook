# Lumenary treatments mapped to physical processes

Source: `lumenary-entries.json`, 214 entries. Map: `lumenary-map.tsv` (one row per entry, in input order). Every entry's why, how and history was read before it was classified.

## The rule as applied

**physical = yes.** The look the treatment produces is the process itself. The entry is named for a process (letterpress, cyanotype, batik, sashiko), or for an object or material that one process makes (azulejo, kente, Navajo rug, jali screen, Indus seal), and its why/how models that process.

**physical = partly.** The entry names a style, movement, genre, era, script or regional tradition. Its look is mostly convention, but it depends on one identifiable physical process that the treatment also models. Examples: ukiyo-e (woodblock printing), truck art (enamel sign painting), Victorian (steel engraving), newspaper (halftone), manga (screentone). A partly entry is filed under its process like a yes entry, and the flag says the model also carries conventions that are not the process.

**physical = no.** The treatment models something other than a way of making. The `family` column then holds the kind:

- `style`: a design movement or set of conventions (Bauhaus, Memphis, cyberpunk, magazine layout, calligrams set in a font).
- `digital`: native to screens or software (glitch, dithering, vector art, reflection-mapped chrome, gradient maps).
- `geometric`: a geometric or generative construction (tilings, fractals, flow fields, simulations), including cultural ornaments where only the geometry is modelled (Celtic knot, mandala, girih, Greek meander), and procedural natural phenomena (aurora, frost, drapery).
- `motion`: live or animated effects (section J, kinetic type, ticker, particles).
- `subject`: subject-aware effects (type behind, split treatment).

A generative entry counts as physical only when it models the craft that uses the construction: string art (one thread wound between nails), spirograph (a pen in a geared wheel, tooth counts deciding closure) and Poisson stippling (the stippler's rule of dots that never touch, denser in shadow). Entries that only borrow a craft's name or motif stay `geometric`.

**Granularity.** Processes are named at the level a maker would use: one id per technique, reused across every entry that imitates it. Tradition-specific variants fold into the technique (ajrak and batik into resist dyeing; azulejo, Delft, Talavera and Hala blue pottery into tin-glaze painting). Embroidery is split by stitch, because the stitch decides the look.

**Families.** The brief's list is used as given. `optical-device` covers imaging and display hardware in general, so it also holds three entries that are not strictly optics: VHS tape, the split-flap board and the pinscreen. `other` holds clay modelling, leather embossing, paper folding and string art.

## Counts

| physical | entries |
|---|---|
| yes | 88 |
| partly | 27 |
| no | 99 |
| total | 214 |

The 99 `no` entries break down as geometric 40, digital 22, style 20, motion 15 and subject 2.

**115 entries are filed under 82 distinct processes.**

Models per family: printing 20, painting 14, optical-device 13, drawing 12, photographic 11, stitch 11, carving 5, cutting 5, glaze 5, other 5, dyeing 3, weaving 3, glass 2, inlay 2, lacquer 2, piercing 2.

## Processes and the entries filed under each

`*` marks a partly entry.

| family | process_id | process | models | entries |
|---|---|---|---|---|
| carving | `relief-carving` | Relief carving | 4 | marble-museum, aztec-glyphs*, hieroglyphs*, makli-carving |
| carving | `seal-carving` | Seal carving | 1 | indus-seal |
| cutting | `paper-cutting` | Paper cutting | 3 | paper-cut-out, papel-picado, chinese-paper-cut |
| cutting | `die-cutting` | Die cutting | 1 | sticker |
| cutting | `paper-collage` | Paper collage | 1 | collage-art |
| drawing | `pen-and-ink-drawing` | Pen and ink drawing | 3 | parchment*, blind-contour, poisson-stippling |
| drawing | `chalk-pastel-drawing` | Chalk and pastel drawing | 2 | pastel-chalk, chalkboard |
| drawing | `charcoal-drawing` | Charcoal drawing | 1 | charcoal-sketch |
| drawing | `marker-drawing` | Marker drawing | 1 | whiteboard |
| drawing | `pencil-drawing` | Graphite pencil drawing | 1 | pencil-hatching |
| drawing | `powder-floor-drawing` | Powder floor drawing | 1 | kolam* |
| drawing | `rotoscoping` | Rotoscoping | 1 | rotoscope |
| drawing | `spirograph-drawing` | Spirograph drawing | 1 | spirograph |
| drawing | `wax-crayon-drawing` | Wax crayon drawing | 1 | crayon-cartoon |
| dyeing | `resist-dyeing` | Resist dyeing | 2 | batik, ajrak |
| dyeing | `mud-dyeing` | Mud dyeing (iron mud on tannin-treated cloth) | 1 | mudcloth |
| glass | `neon-sign-making` | Neon sign making | 1 | neon-glow |
| glass | `stained-glass` | Stained glass | 1 | stained-glass |
| glaze | `tin-glaze-painting` | Tin-glaze painting | 4 | azulejo, delft-blue, talavera, hala-blue-pottery |
| glaze | `slip-painting` | Slip painting on pottery | 1 | greek-vase |
| inlay | `brick-mosaic` | Brick mosaic | 1 | lego-voxel |
| inlay | `mosaic-setting` | Mosaic setting | 1 | byzantine-mosaic |
| lacquer | `gold-lacquer-repair` | Gold lacquer repair | 1 | kintsugi |
| lacquer | `lac-turnery` | Lac turnery | 1 | hala-lacquerware |
| optical-device | `anaglyph-stereoscopy` | Anaglyph stereoscopy | 1 | anaglyph-3d |
| optical-device | `analogue-videotape` | Analogue videotape (VHS) recording | 1 | retro-vhs |
| optical-device | `crt-display` | Cathode-ray tube display | 1 | scanlines-crt |
| optical-device | `image-intensifier` | Image intensifier | 1 | night-vision |
| optical-device | `kaleidoscope` | Kaleidoscope | 1 | kaleidoscope |
| optical-device | `lens-chromatic-aberration` | Lens chromatic aberration | 1 | chromatic-aberration |
| optical-device | `lens-defocus` | Lens defocus (bokeh) | 1 | bokeh |
| optical-device | `lenticular-printing` | Lenticular printing | 1 | lenticular |
| optical-device | `pinscreen` | Pinscreen | 1 | pin-art |
| optical-device | `refractive-glass` | Refraction through textured glass | 1 | glass-refraction |
| optical-device | `split-flap-display` | Split-flap display | 1 | split-flap |
| optical-device | `thermal-imaging` | Thermal imaging camera | 1 | thermal-camera |
| optical-device | `tilt-shift-lens` | Tilt-shift lens | 1 | tilt-shift |
| other | `clay-modelling` | Clay modelling | 2 | clay-3d, plasticine |
| other | `leather-embossing` | Leather embossing | 1 | embossed-leather |
| other | `paper-folding` | Paper folding | 1 | origami-folds |
| other | `string-art` | String art | 1 | string-art |
| painting | `cel-painting` | Cel painting (ink and paint on celluloid) | 2 | anime-cel*, retro-anime* |
| painting | `dot-painting` | Dot painting | 2 | pointillism*, aboriginal-dot-painting* |
| painting | `gouache` | Gouache | 2 | gouache, persian-miniature* |
| painting | `mud-wall-painting` | Mud-wall painting | 2 | madhubani*, warli* |
| painting | `oil-painting` | Oil painting | 2 | oil-impasto, impressionist* |
| painting | `decorative-brush-painting` | Decorative brush-stroke painting (double-loaded brush) | 1 | rosemaling* |
| painting | `enamel-sign-painting` | Enamel sign painting | 1 | truck-art* |
| painting | `ink-wash-painting` | Ink wash painting | 1 | ink-wash |
| painting | `watercolour` | Watercolour | 1 | watercolour |
| photographic | `cyanotype` | Cyanotype | 2 | blueprint*, cyanotype |
| photographic | `multiple-exposure` | Multiple exposure | 2 | double-exposure, chronophotograph |
| photographic | `cross-processing` | Cross-processing | 1 | cross-processed |
| photographic | `daguerreotype` | Daguerreotype | 1 | daguerreotype |
| photographic | `film-radiography` | Film radiography | 1 | x-ray |
| photographic | `infrared-photography` | Infrared photography | 1 | infrared |
| photographic | `silver-halide-film` | Silver-halide film | 1 | film-grain |
| photographic | `slit-scan-photography` | Slit-scan photography | 1 | slit-scan |
| photographic | `toy-camera-photography` | Toy-camera photography | 1 | lomography* |
| piercing | `piercing` | Piercing (jali, cut work) | 2 | shadow-puppet, mughal-jali |
| printing | `halftone-screening` | Halftone screening | 4 | swiss-design*, comic-book*, newspaper*, halftone |
| printing | `intaglio-engraving` | Intaglio line engraving | 3 | art-deco*, victorian*, banknote-engraving |
| printing | `screen-printing` | Screen printing | 3 | retro*, pop-art*, screen-print |
| printing | `relief-block-printing` | Relief block printing (woodcut, linocut) | 2 | linocut, ukiyo-e* |
| printing | `stamp-printing` | Stamp printing (hand-pressed relief stamp) | 2 | rubber-stamp, adinkra* |
| printing | `foil-stamping` | Hot foil stamping | 1 | gold-foil |
| printing | `letterpress` | Letterpress | 1 | letterpress |
| printing | `mechanical-tint` | Mechanical tint (screentone, Ben-Day) | 1 | manga* |
| printing | `mezzotint` | Mezzotint | 1 | mezzotint |
| printing | `risograph-printing` | Risograph printing | 1 | risograph |
| printing | `spray-stencilling` | Spray stencilling | 1 | graffiti* |
| stitch | `mirror-embroidery` | Mirror embroidery | 2 | sindhi-mirror-embroidery, sindhi-topi |
| stitch | `patchwork-quilting` | Patchwork quilting | 2 | quilt-patchwork, ralli-patchwork |
| stitch | `applique` | Appliqué | 1 | felt-story |
| stitch | `colourwork-knitting` | Colourwork knitting | 1 | knitted-pattern |
| stitch | `crochet` | Crochet | 1 | wool-crochet |
| stitch | `cross-stitch-embroidery` | Cross-stitch embroidery | 1 | cross-stitch |
| stitch | `darning-stitch-embroidery` | Darning-stitch embroidery | 1 | phulkari |
| stitch | `long-and-short-stitch-embroidery` | Long-and-short stitch embroidery (thread painting) | 1 | embroidery |
| stitch | `running-stitch-embroidery` | Running-stitch embroidery | 1 | sashiko |
| weaving | `tapestry-weaving` | Tapestry weaving | 2 | tapestry-weave, navajo-weave |
| weaving | `strip-weaving` | Narrow-strip weaving | 1 | kente |

## Distribution

| models per process | processes | entries covered |
|---|---|---|
| 1 | 59 | 59 |
| 2 | 16 | 32 |
| 3 or more | 7 | 24 |

The seven processes with three or more models are halftone screening, relief carving and tin-glaze painting (four each), then intaglio engraving, screen printing, paper cutting and pen and ink drawing (three each). Most process pages will have a single credited model. Three-quarters of the 82 processes (59) have exactly one.

## Hard calls

These are the calls most likely to be disputed, roughly in order of how much they move the map. Each one is also noted on its row in the TSV.

1. **Five style entries are filed as partly because their rendering is a print process.** Art deco and Victorian draw the picture as engraved line weight. Retro and pop art use misregistered flat screen-print inks. Swiss design renders its photograph as a line screen. The brief lists "Art Deco as a style" as no. I read that as the style's conventions (stepped frames, sunbursts), and this treatment's image is engraving. If the library wants movements kept out entirely, flip these five to no. Halftone screening and screen printing would each drop to one or two models.
2. **Blueprint is filed under cyanotype, and it is a weak model.** Most of the treatment is drafting convention: edge lines, hatching, grid, title block. Only the white-on-blue colouring comes from the cyanotype copy.
3. **Woodcut and linocut are merged** as `relief-block-printing` (linocut, ukiyo-e). A maker distinguishes them by material, so split them if the library prefers material-level pages.
4. **Printed dots go to three processes.** Comic book goes under halftone because its dots grow with tone, although period comics used Ben-Day mechanical tints. Manga goes under mechanical tint (screentone, which is fixed-tone sheets). Pop art goes under screen printing, because its blurb leads with it, and its Ben-Day edge dots are noted on the row.
5. **Dot painting is filed by technique, not medium.** Pointillism (oil) and Aboriginal dot painting (acrylic) share `dot-painting`. The Aboriginal entry itself says it borrows only the visual technique.
6. **Madhubani and Warli go under `mud-wall-painting`.** Warli models the mud wall and rice paste directly. Madhubani models only the outline-and-pattern-fill convention, so it could fairly be `no / style`.
7. **Generative entries are split by whether they model a craft.** String art, spirograph and Poisson stippling are filed as physical. Lissajous (no harmonograph modelled), hexagon mosaic (tiles only as dressing), domain warp (marbling only named), Greek meander (slip-painting colours only), Celtic knot, mandala, koru and girih stay geometric. The spirograph is the least certain of these: its geometry is the toy's, but the picture only tints the line.
8. **Devices that are not optics are filed as yes.** VHS tape, the split-flap board and the pinscreen model a physical device's behaviour, so they sit in `optical-device`. The thermal camera models the camera's readout, with brightness standing in for heat. X-ray models the film's look (a negative with grain and collimator shadow), not attenuation.
9. **Material looks without a making process are filed as no.** Chrome (reflection mapping) and holographic (a hue cycle in place of diffraction) imitate a material but model no process. Neon is yes, because it draws the picture as glowing tubes. Glass refraction is yes because it models the optics of reeded glass, beads and bubbles, a lens case under the brief. Duotone is no: it is named after two-ink offset duotones but is a gradient map. Glow sketch is no: its history cites light painting, but no exposure is modelled.
10. **Circuit board, CCTV and oscilloscope are no.** The PCB treatment models routing rules, not etching. CCTV's look is digital compression and overlays. The oscilloscope's stacked traces are a ridgeline plot that a scope cannot draw.
11. **Paper cutting is kept separate from piercing.** Papel picado and Chinese paper cut sit under paper cutting, and jali and shadow puppet under piercing. Both paper entries rely on the piercing rule that every part must stay joined, and papel picado is chisel-punched, so either could move.
12. **Hala blue pottery is filed under tin-glaze painting, as the brief asks.** Hala and Multan blue pottery is usually described as painted on a white slip under an alkaline glaze rather than on tin glaze, so the process page may want a note.
13. **Single placements worth a second look.** Persian miniature goes under gouache (opaque mineral watercolour, which the gouache entry's own history names). Sindhi topi goes under mirror embroidery, where mirrors are one of four ring ornaments. Sticker goes under die cutting, although it guesses the subject to find its cut line. Chalkboard is merged with pastel as the same dry-stick-on-tooth process. Tilt-shift is kept separate from lens defocus.
14. **Natural phenomena are filed as geometric.** Aurora, frost and drapery have no making process, and none of the five `no` kinds fits them exactly.
