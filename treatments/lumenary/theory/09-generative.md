# I. Geometric and generative

Source: https://lumenary-studio.vercel.app/theory/generative (captured 2026-11-16 for private study).

Small rules, repeated patiently, that grow a picture the way frost grows across a pane.

## 130  Particles  ·  _live_

- **Comes from:** Computer graphics and physics simulation
- **Around:** 1980s onward
- **Works best on:** High contrast pictures with one clear subject

### Why it looks this way

A particle system builds a picture out of thousands of tiny, simple things instead of one big shape. Each dot knows only two things: where its home is and how hard the cursor is pushing it away. Together they form the image, scatter when you disturb them and settle back, which looks alive although no dot is doing anything clever.

### How it works

1. Divide the picture into a grid and give each cell one particle, whose home is near the cell centre, nudged by up to 0.35 of a cell so the dots do not look like a lattice.
2. Take its colour from the picture, reduced to 4 bits per channel so the dots can be drawn in a few dozen batches.
3. Pull every particle toward its home with a spring, and slow it with damping so it settles instead of bouncing forever.
4. Push away any particle within 16 percent of the width of the cursor, hardest at its centre and fading to nothing at its edge.
5. In white mode, keep one colour and let the dot size carry the brightness.

### The mathematics

The picture is divided into a grid, and every cell becomes one particle with a home position (its “target”) near the cell centre, nudged by a random jitter of up to 0.35 of a cell so the dots do not look like a lattice. In original-colour mode each particle takes the colour of its cell, reduced to 4 bits per channel (at most 4096 colours) so that thousands of particles can be drawn in a few dozen batches instead of changing paint thousands of times. In white mode the colour is fixed and brightness is carried by the dot’s size instead.

Motion is a damped spring simulation. Each particle is pulled toward its target with a spring of stiffness 60. When the cursor is inside the canvas, any particle within 16% of the width is pushed away, hardest at the centre of the cursor and fading smoothly to nothing at its edge. Velocity is multiplied by an exponential damping factor every frame so the particles settle rather than oscillate forever. Clicking gives each nearby particle a random impulse. The step size is clamped, so a slow frame can never make the simulation explode.

$$
\mathbf a_i \;=\; k\,(\mathbf T_i-\mathbf x_i)\;+\;A\Big(1-\frac{d}{R}\Big)^{2}\,\hat{\mathbf d},\qquad d<R=0.16\,W
$$
_Spring toward the target T plus repulsion from the cursor; d is the distance to the cursor, d-hat the direction away from it. k = 60._

$$
\mathbf v\leftarrow(\mathbf v+\mathbf a\,\Delta t)\,e^{-\gamma\Delta t},\qquad \mathbf x\leftarrow\mathbf x+\mathbf v\,\Delta t,\quad\gamma=11
$$
_Semi-implicit Euler step with exponential damping._

$$
r_i=\tfrac12\,s\,\sigma\,\big(0.12+0.95\sqrt{L_i}\big)
$$
_White mode: dot radius from cell size s, size slider σ and brightness. The square root makes dot area, not radius, track brightness._

### A short history

William Reeves of Lucasfilm described particle systems in 1983 after using them for the Genesis effect, the wall of fire in Star Trek II: The Wrath of Khan (1982). Fire, smoke, sparks and rain have been made this way in films and games ever since, and the spring and damper behind each dot goes back to Hooke’s law in the seventeenth century.

### Where it is used

- Fire, smoke, sparks and rain in games and film
- Interactive website heroes and logos
- Data visualisation of crowds or populations
- Physics teaching with springs and damping

### Try it

- Fewer, bigger particles make a bold pointillist portrait. (https://lumenary-studio.vercel.app/style/particles?density=60&size=2)
- A very strong cursor force makes the picture explode. (https://lumenary-studio.vercel.app/style/particles?force=100)
- White mode shows the picture only through dot size. (https://lumenary-studio.vercel.app/style/particles?mode=white&density=150)

### Words worth knowing

- **Damping:** A force that slows motion, so a spring settles instead of oscillating for ever.
- **Target:** The home position a particle is pulled toward.
- **Jitter:** A small random offset that breaks up a regular grid.

### See also

- 158 Boids
- 151 Physarum
- 156 Poisson Stippling

## 131  Truchet Tiles  ·  _still_

- **Comes from:** A Dominican priest in Paris
- **Around:** 1704
- **Works best on:** Pictures with good light and dark contrast

### Why it looks this way

Truchet tiles show how a very small rule can produce endless variety. One tile, turned in one of two ways, is placed by chance, and because every arc ends at the middle of a side, arcs from neighbouring tiles always meet and join into winding paths. The picture then controls only the weight of the lines, so the paths thicken in shadows and thin out in the lights.

### How it works

1. Draw each tile with two quarter circles, centred on opposite corners, that meet the midpoints of the sides.
2. Choose between the two orientations with a hash of the tile’s position, so the same seed always gives the same pattern.
3. Measure the darkness of the picture under the tile, averaged over 0.45 of a tile width.
4. Scale the line width, or the disc radius, with that darkness, from a hairline in the lights to a bold stroke in the shadows.
5. In busy areas, optionally split a tile into smaller ones so detail shows.

### The mathematics

In 1704 the Dominican Sébastien Truchet noticed that one square tile, divided by its diagonal into a light and a dark half, makes endless patterns when the copies are turned at random. In the arc version used here each tile carries two quarter circles of radius s/2, centred on opposite corners, which meet the midpoints of the sides. The tile is placed in one of two orientations, chosen by a hash of its position, and because every arc ends at a side midpoint, arcs of neighbouring tiles always join into winding paths. Quarter discs and plain diagonals use the same grid.

The picture decides how heavy each tile is. Its darkness under the tile, averaged over a radius of 0.45 tile widths, scales the line width (or the disc radius), from a hairline in the lights to a bold stroke in the shadows. The picture shows through slider mixes between a uniform weight and the full tonal weight, and on the night paper the roles reverse (light is heavy). Colour comes from the picture, a little darker than the original, or from a single ink. With smaller tiles in detail on, a tile whose four quarters differ strongly in tone, with variance above 0.006, is replaced by four half-size tiles.

$$
w=s\,\big(0.06+0.5\,\hat t\big),\qquad \hat t=(1-\beta)\,\tfrac12+\beta\,t
$$
_Line width of a tile of side s: t is the picture’s darkness under it (1 minus lightness on light paper), β the picture-shows-through slider._

$$
\sigma^{2}=\sum_{i=1}^{4}\big(t_i-\bar t\big)^{2}>0.006\ \Longrightarrow\ \text{split into four tiles of side } s/2
$$
_The quadtree rule: t_i is the tone of the i-th quarter of the tile._

$$
\text{flip}=\big[\,h(\text{tile}_x,\ \text{tile}_y,\ \text{seed})\ge\tfrac12\,\big]
$$
_The random orientation of each tile comes from a hash h of its position, so the pattern is the same each time you redraw with the same seed._

### A short history

Sébastien Truchet, a Dominican priest and engineer, published a study of patterns made from one square tile divided along its diagonal in 1704. The work was largely forgotten until Cyril Stanley Smith and Pauline Boucher revived it in a paper in 1987. A single line of Commodore 64 BASIC called 10 PRINT, which prints one of two diagonal slashes at random, makes the same kind of pattern and became a favourite of early programmers.

### Where it is used

- Maze and pattern generators
- Textile, tile and wallpaper design
- Game levels and textures
- Teaching tilings and topology

### Try it

- The diagonal tile is the original, with plain zigzag paths. (https://lumenary-studio.vercel.app/style/truchet-tiles?tile=diag&size=20)
- Quarter discs give a bold, graphic look. (https://lumenary-studio.vercel.app/style/truchet-tiles?tile=quarter&colour=ink)
- Full tonal weight with small tiles shows the picture clearly. (https://lumenary-studio.vercel.app/style/truchet-tiles?weight=100&size=14)

### Words worth knowing

- **Tiling:** A way of covering a surface with shapes without gaps or overlaps.
- **Hash:** A function that turns a position into a repeatable pseudo random number.
- **Topology:** The study of how shapes are connected, regardless of their exact size.

### See also

- 146 Wave Function Collapse
- 134 Hexagon Mosaic
- 136 Penrose Tiling

## 132  Op Art Moire  ·  _still_

- **Comes from:** Optical art
- **Around:** 1960s
- **Works best on:** Bold shapes and portraits with simple tones

### Why it looks this way

When two fine patterns of lines overlap, broad bands appear that are in neither of them. These are beats, the visual cousin of two close musical notes giving a slow throb. Op artists realised that these illusions seem to shimmer and move, and that a small change in the lines makes a large change in the bands, so the picture bends one set of lines and the beats follow its shapes.

### How it works

1. Draw one plain set of lines, rings or waves with a fixed period.
2. Draw a second set with the same period, turned a little or with a shifted centre.
3. Shift the coordinate across the second set by up to 9 periods times the picture’s lightness minus a half, so the lines swerve around shapes.
4. Set the thickness of the second set from the picture’s tone, mixing the duty cycle between a half and a value that follows darkness.
5. The beats are not drawn at all: they appear where the two sets cross, and for equal period at an angle α they are p / (2 sin(α/2)) apart.

### The mathematics

When two sets of fine regular lines overlap, broad dark and light bands appear that are in neither set. They are the beats of the two patterns, the same effect as two close musical notes giving a slow throb. The program draws two sets. The first is a plain set of parallel lines (or rings, or gentle waves) of period p. The second has the same period but is turned by the angle slider, or has its centre shifted for rings. For two sets of equal period at an angle α the bands are p / (2 sin(α/2)) apart, so a small turn makes wide, dramatic fringes.

The picture enters in two ways. First it bends the second set: the coordinate across its lines is shifted by up to 9 periods times (L − ½), where L is the lightness, so the lines swerve around shapes and the beats trace them. Second, it sets the weight: the duty cycle of the second set is mixed between ½ and 0.12 + 0.76 (1 − L), so lines are thick in the dark and thin in the light. Each stripe is anti-aliased with a smoothstep one pixel wide, and the two sets combine as ink coverage, as if printed one over the other.

$$
\Lambda=\frac{p}{2\sin(\alpha/2)}
$$
_Spacing of the moiré bands for equal periods p and a relative turn α._

$$
u_2'=u_2+\omega\,\big(L-\tfrac12\big),\qquad \omega=9\,\text{warp}
$$
_The picture bends the second set: u₂ is the coordinate across its lines, in periods._

$$
\text{cov}=1-(1-A)(1-B),\qquad A=1-\operatorname{smoothstep}\!\big(\tfrac{\delta_A}{2}-a,\ \tfrac{\delta_A}{2}+a,\ \operatorname{dist}(u_1)\big)
$$
_Ink coverage of the union; dist(u) = |u − ⌊u⌋ − ½| is the distance to the nearest stripe centre, a = 0.8 px / period the anti-alias width, δ the duty cycle._

### A short history

The word moiré is French and refers to watered silk, in which two layers of cloth make shimmering patterns. Op art, as a name, appeared in Time magazine in 1964, and the exhibition The Responsive Eye at the Museum of Modern Art in New York in 1965 made artists such as Bridget Riley and Victor Vasarely famous. Engineers also use moiré fringes to measure tiny strains and displacements.

### Where it is used

- Posters, fabrics and graphic design
- Detecting strain and deformation in engineering
- Avoiding unwanted screen patterns in printing and photography
- Visual perception experiments

### Try it

- Concentric rings give the classic target fringes. (https://lumenary-studio.vercel.app/style/op-art-moire?kind=rings&angle=0)
- A bigger turn of the second grid packs the bands closer. (https://lumenary-studio.vercel.app/style/op-art-moire?angle=12)
- Strong warp lets the picture appear in the bending lines. (https://lumenary-studio.vercel.app/style/op-art-moire?warp=90&weight=85)

### Words worth knowing

- **Moiré:** A pattern that appears when two regular patterns overlap.
- **Beat:** A slow variation that arises when two close frequencies are combined.
- **Duty cycle:** The share of each period that is filled with ink.

### See also

- 118 Kaleidoscope
- 145 Warped Grid
- 143 Lissajous Curves

## 133  Spirograph  ·  _still_

- **Comes from:** Geometry and a drawing toy
- **Around:** 1965 toy, older mathematics
- **Works best on:** Pictures with large areas of tone

### Why it looks this way

A small wheel rolls inside a larger ring and a pen sits in one of its holes. Because the wheel turns faster than it travels, the pen swings out and back in again, drawing loops. The shape depends on the ratio of the two wheels. When the ratio is a fraction of whole numbers, the curve closes after a certain number of turns, so every gear pair has its own personality.

### How it works

1. Scale the ring to 1 and call the wheel’s relative size k, then trace the pen at (1 − k) cos t + h cos(((1 − k)/k) t), (1 − k) sin t − h sin(((1 − k)/k) t).
2. Find how many times around the wheel must travel before the curve closes: the wheel’s teeth divided by the greatest common divisor of its teeth and the ring’s 144.
3. Draw the curve as many short segments, 220 for each turn.
4. Colour each segment by the picture at its midpoint.
5. In the rosette layout, repeat the process in a grid of small spirographs with random coprime ratios and pen holes.

### The mathematics

A spirograph curve is a hypotrochoid: the path of a pen held in a hole of a small wheel (radius r) that rolls without slipping around the inside of a larger ring (radius R). With the ring scaled to 1 and k = r/R, the pen is at (1 − k) cos t + h cos(((1 − k)/k) t) horizontally and (1 − k) sin t − h sin(((1 − k)/k) t) vertically, where h is the pen’s distance from the wheel’s centre. The curve closes when the wheel has gone round q = N / gcd(n, N) times, for a wheel of n teeth in a ring of N = 144 teeth, and that is the number of turns drawn.

In the single-curve layout one large curve is drawn as many short segments (220 per turn). Each segment is coloured by the picture at its midpoint, so the picture appears through the weaving. The rosettes layout is a grid of small spirographs, each with a random wheel ratio from a list of coprime pairs (2/5, 3/7, 3/8 and so on) and a random pen hole. Each is scaled to fit its cell, using the largest radius the curve reaches, (1 − k) + h, and its colour is that of the picture at the cell’s centre. With size follows the picture the rosette is smaller in the highlights or the shadows, so the grid forms a halftone.

$$
\begin{aligned}x(t)&=(1-k)\cos t+h\cos\!\Big(\tfrac{1-k}{k}\,t\Big)\\ y(t)&=(1-k)\sin t-h\sin\!\Big(\tfrac{1-k}{k}\,t\Big)\end{aligned}\qquad k=\frac{n}{N}
$$
_The hypotrochoid for a wheel of n teeth in a ring of N = 144; h = 1.6 k × the pen-hole slider._

$$
q=\frac{N}{\gcd(n,\,N)},\qquad t\in[0,\ 2\pi q]
$$
_The curve closes after q turns._

$$
\rho_{\max}=(1-k)+h,\qquad R_{\text{cell}}=\frac{c\,f}{2\,\rho_{\max}}
$$
_Scale for a rosette: c is the cell size, f the size-follows-picture factor (0.42 to 1)._

### A short history

Curves made by rolling circles were studied by Dürer in the sixteenth century and by many mathematicians after him, and the Polish engineer Bruno Abakanowicz built a drawing instrument for them in the 1880s. The British engineer Denys Fisher turned the idea into the Spirograph toy, shown in 1965 and sold in the United States by Kenner from 1966. It has been a classroom favourite ever since.

### Where it is used

- Decorative patterns and engraving
- Banknote security backgrounds and guilloché
- Gear and cam design
- Teaching ratios and number theory

### Try it

- A single big curve with many teeth looks like fine lacework. (https://lumenary-studio.vercel.app/style/spirograph?mode=one&teeth=97)
- A pen hole near the centre gives a gentler, rounder rosette. (https://lumenary-studio.vercel.app/style/spirograph?hole=30)
- Fewer rosettes on a cream paper look like a printed sampler. (https://lumenary-studio.vercel.app/style/spirograph?cells=5&paper=cream)

### Words worth knowing

- **Hypotrochoid:** The path of a point on a circle that rolls inside another circle.
- **Coprime:** Two whole numbers that share no factor other than 1.
- **Guilloché:** A pattern of fine interlacing curves, used on banknotes.

### See also

- 143 Lissajous Curves
- 83 Banknote Engraving
- 142 String Art

## 134  Hexagon Mosaic  ·  _still_

- **Comes from:** Geometry and nature
- **Around:** Ancient to modern
- **Works best on:** Wide views with soft colour

### Why it looks this way

The hexagon is the shape that divides a flat surface into equal cells with the least boundary. Bees, basalt columns, soap foam and graphene all use it for that reason. The program lays out a honeycomb and gives each cell the average colour beneath it, so the picture becomes tiles, and the gaps between become grout.

### How it works

1. Space the cell centres √3 s apart in a row, with rows 1.5 s apart and every second row shifted by half a width.
2. Average the picture over a disc of 0.75 s around each centre to find the cell’s colour.
3. In flat mode, draw each hexagon, shrink it by the gap value, and add a gentle glaze gradient and a pale inner edge.
4. In shrinking mode, scale the radius with the tone, 0.25 + 0.85 t, which gives a halftone.
5. In tumbling blocks mode, cut each hexagon into three rhombi shaded 1.14, 0.86 and 0.6 times the colour, which gives the illusion of cubes.

### The mathematics

A honeycomb is the tiling of the plane by regular hexagons, the shape that covers a surface with the least edge. With the hexagon’s corner-to-centre distance s, the centres of a row are √3 s apart, the rows are 1.5 s apart, and each odd row is shifted by half a width. The corner angles are π/6 + mπ/3. Each cell is given the colour of the picture averaged over a disc of radius 0.75 s around its centre, so a cell is one flat, glazed tile.

Three ways of drawing the cells are offered. Flat tiles fill each cell, with a gap slider that shrinks the hexagon and lets the colour behind show as grout, and a glaze that adds a diagonal gradient (from about 20% brighter to 22% darker) and a thin pale inner edge. In shrinking cells the radius scales with the tone, 0.25 + 0.85 t, which turns the honeycomb into a halftone. In tumbling blocks each hexagon is cut into three rhombi shaded 1.14, 0.86 and 0.62 times the cell colour, which reads as a cube seen from a corner, the old tumbling-blocks quilt pattern.

$$
\mathbf c_{ij}=\Big(\sqrt3\,s\,\big(j+\tfrac12\,(i\bmod 2)\big),\ \ \tfrac32\,s\,i\Big),\qquad \theta_m=\tfrac{\pi}{6}+\tfrac{m\pi}{3}
$$
_Hexagon centres (row i, column j) and corner angles._

$$
r=s\,(1-g)\,\big(0.25+0.85\,t\big)
$$
_Radius in the shrinking-cells mode: g is the gap slider and t the tone (1 − tone on a cream ground)._

$$
C_{\text{face}}=k_f\,C_{\text{cell}},\qquad (k_1,\ k_2,\ k_3)=(1.14,\ 0.86,\ 0.62)
$$
_Shading of the three faces of a tumbling block._

### A short history

The Greek mathematician Pappus suggested in the fourth century that bees choose hexagons because they use the least wax. The honeycomb conjecture was proved only in 1999 by Thomas Hales. The tumbling blocks pattern is an old quilt design, and hexagonal grids are used in board games, computer strategy games and weather and mapping systems.

### Where it is used

- Wall and floor tile design
- Hex based game maps
- Geographic data grids and heat maps
- Honeycomb structures in engineering

### Try it

- Tumbling blocks turn the picture into a pile of cubes. (https://lumenary-studio.vercel.app/style/hexagon-mosaic?mode=cubes&size=20)
- Shrinking cells make a halftone from hexagons. (https://lumenary-studio.vercel.app/style/hexagon-mosaic?mode=size&gap=0)
- Small cells on a night background glow like stained glass. (https://lumenary-studio.vercel.app/style/hexagon-mosaic?size=8&back=night)

### Words worth knowing

- **Honeycomb conjecture:** The statement that hexagons divide a plane into equal areas with the least perimeter.
- **Grout:** The material between tiles.
- **Halftone:** Tone made from dots of different sizes.

### See also

- 90 Quilt Patchwork
- 135 Voronoi Mosaic
- 80 Halftone

## 135  Voronoi Mosaic  ·  _still_

- **Comes from:** Mathematics and geography
- **Around:** Dirichlet 1850, Voronoy 1908
- **Works best on:** Pictures with strong edges

### Why it looks this way

Scatter some points and give every spot on the page to whichever point is nearest. The result is a set of irregular cells that look like cracked glaze, giraffe skin, dried mud and soap bubbles, because nature often grows from seeds that claim the space around them. More points in the detailed parts of a picture make smaller cells there.

### How it works

1. Place seeds by rejection sampling: accept a random point with a probability that is high at strong edges (Sobel strength) and low in flat areas.
2. Label every pixel with its nearest seed using jump flooding, which takes about log₂ of the picture size in passes rather than checking every seed.
3. Run Lloyd relaxation: move each seed to the weighted centre of its cell, and relabel. A few rounds even out the cells.
4. Paint each cell with the average colour of the picture inside it.
5. Draw borders and a faceting gradient on top for a look of glaze.

### The mathematics

The Voronoi cell of a seed is the set of points nearer to that seed than to any other. Here the seeds are scattered by rejection sampling: a random point is accepted with probability equal to an importance value that is high where the picture has strong edges (the Sobel strength, scaled to its maximum and boosted ×2.2) and low (0.06) where it is flat, so cells crowd together around the detail. The gather-in-detail slider mixes this importance with a uniform 1. Every pixel is given the label of its nearest seed by jump flooding, which finds nearest seeds in about log₂ of the picture size passes instead of comparing against all of them.

Lloyd relaxation then moves each seed to the centroid of its cell, weighted by the importance squared, and the labels are recomputed. A few rounds even out the cells and give the soft, almost organic look of a cracked glaze, while still keeping more of them where the picture is detailed. Each cell is painted with the mean colour of the picture within it. The faceting slider adds a gentle dome of light across each cell, and the borders slider darkens the pixels next to a neighbouring cell by up to 55%.

$$
\lambda(\mathbf x)=\arg\min_{i}\ \lVert\mathbf x-\mathbf s_i\rVert,\qquad P(\text{accept }\mathbf s)=\text{imp}(\mathbf s)
$$
_Cell labels, and the rejection rule for seeds._

$$
\text{imp}=(1-\delta)+\delta\,\Big(0.06+0.94\,\min\!\big(1,\ 2.2\,\tfrac{E}{E_{\max}}\big)\Big)
$$
_Importance: E is the edge strength, δ the gather-in-detail slider._

$$
\mathbf s_i\leftarrow\frac{\sum_{\mathbf x\in V_i}w(\mathbf x)\,\mathbf x}{\sum_{\mathbf x\in V_i}w(\mathbf x)},\qquad w=\text{imp}^{2}+0.002
$$
_One round of Lloyd relaxation._

### A short history

Descartes drew such diagrams in 1644 to show the distribution of matter in the heavens. Peter Gustav Lejeune Dirichlet used them in 1850 and Georgy Voronoy generalised them in 1908. Physician John Snow’s 1854 map of cholera deaths around the Broad Street pump is often described as an informal example. Stuart Lloyd’s relaxation was written in 1957 and published in 1982, and Adrian Secord used weighted Voronoi diagrams for stippling in 2002.

### Where it is used

- Finding the nearest hospital, shop or station
- Terrain and map generation in games
- Crack and cell textures in 3D art
- Mesh generation in engineering

### Try it

- Thousands of cells make a fine stained-glass portrait. (https://lumenary-studio.vercel.app/style/voronoi-mosaic?cells=2000&edge=20)
- Few cells and strong faceting look like low-poly glass. (https://lumenary-studio.vercel.app/style/voronoi-mosaic?cells=150&bevel=85)
- No relaxing leaves the cells random and uneven. (https://lumenary-studio.vercel.app/style/voronoi-mosaic?relax=0)

### Words worth knowing

- **Voronoi cell:** The region of points that are nearer to one seed than to any other.
- **Lloyd relaxation:** Moving each seed to the centre of its cell to make cells more even.
- **Jump flooding:** A fast way to find the nearest seed for every pixel.

### See also

- 93 Stained Glass
- 43 Low-poly
- 156 Poisson Stippling

## 136  Penrose Tiling  ·  _still_

- **Comes from:** Mathematical recreations and crystallography
- **Around:** 1974
- **Works best on:** Pictures with smooth colour regions

### Why it looks this way

A tiling that repeats can be slid over itself and matched, but a Penrose tiling cannot. It never repeats and yet it is ordered, with five-fold symmetry that ordinary periodic tilings are forbidden to have. Two rhombus shapes are all it takes, and the golden ratio runs through every proportion in it.

### How it works

1. Start with ten thin Robinson triangles arranged round the centre in a decagon.
2. Deflate every triangle: a thin one becomes two, a thick one becomes three, with new vertices placed along the old edges in the golden ratio.
3. Each round shrinks the edges by 1/φ and multiplies the number of triangles by about 2.618.
4. Look up the picture at the centroid of each triangle to find its colour.
5. Merge the triangle halves back into rhombi when drawing, with thick and thin tiles shaded in picture, two-tone or mixed mode.

### The mathematics

The Penrose tiling uses two rhombi, a thin one with angles of 36 and 144 degrees and a thick one with 72 and 108, which together cover the plane without ever repeating. It has local five-fold symmetry, which no periodic tiling can have. The program builds it from Robinson triangles, the halves of the rhombi. It starts with ten thin triangles arranged round the centre in a decagon, then repeatedly deflates every triangle into smaller ones. A thin triangle becomes two (one of each kind) and a thick one becomes three, with the new vertices dividing the old edges in the golden ratio φ = (1 + √5)/2.

Each deflation shrinks the edges by 1/φ and multiplies the number of triangles by φ² ≈ 2.618, the larger eigenvalue of the substitution matrix. The subdivisions slider sets how many rounds are made. For colour, each triangle looks up the picture at its centroid. In picture mode the thick tiles are made 4% lighter and the thin ones 6% darker, so the two shapes can be told apart; in duo mode they take gold and teal, shaded by the picture’s tone; in mixed mode the picture colour and the duo colour are mixed 60:40. Optional lines trace the triangles’ outer edges.

$$
P=A+\frac{B-A}{\varphi},\qquad Q=B+\frac{A-B}{\varphi},\qquad R=B+\frac{C-B}{\varphi},\qquad \varphi=\frac{1+\sqrt5}{2}
$$
_The new vertices when a triangle ABC is deflated._

$$
\begin{pmatrix}n_0'\\ n_1'\end{pmatrix}=\begin{pmatrix}1&1\\ 1&2\end{pmatrix}\begin{pmatrix}n_0\\ n_1\end{pmatrix},\qquad \lambda=\frac{3\pm\sqrt5}{2}=\varphi^{2},\ \varphi^{-2}
$$
_Counts of thin (n₀) and thick (n₁) triangles; the growth per round is φ² ≈ 2.618._

$$
N_k\approx 10\,\varphi^{2k},\qquad \ell_k=\ell_0\,\varphi^{-k}
$$
_Number of triangles and edge length after k deflations._

### A short history

The English mathematician and physicist Roger Penrose found these tilings in 1974, building on work by Robert Berger. In 1982 Dan Shechtman observed metal crystals with five-fold symmetry that should have been impossible, called quasicrystals, and won the Nobel Prize in Chemistry in 2011. Peter Lu and Paul Steinhardt argued in 2007 that medieval Islamic girih tilings came close to the same idea.

### Where it is used

- Floor and wall design, such as paving at the Oxford Mathematical Institute
- The study of quasicrystals in materials science
- Cryptography and computer science research on tilings
- Art and architecture

### Try it

- Deep subdivision with thin gold lines looks like a jewel. (https://lumenary-studio.vercel.app/style/penrose-tiling?depth=8&lineCol=gold&line=0.6)
- Two-tone mode shows the two shapes clearly. (https://lumenary-studio.vercel.app/style/penrose-tiling?mode=duo&depth=5)
- Turn the pattern to find a new centre of symmetry. (https://lumenary-studio.vercel.app/style/penrose-tiling?turn=18)

### Words worth knowing

- **Aperiodic:** Never repeating, however far you look.
- **Golden ratio:** The number (1 + √5)/2, about 1.618, which appears in the proportions of the tiles.
- **Quasicrystal:** A crystal with order but no repeating unit.

### See also

- 208 Girih
- 187 Mandala
- 134 Hexagon Mosaic

## 137  Fractal Flame  ·  _still_

- **Comes from:** Chaos games and iterated function systems
- **Around:** 1992, published 2003
- **Works best on:** Colourful pictures, which tint the flame

### Why it looks this way

A point jumps around the plane again and again, each time by one of a few chosen rules. Most of the points end up in a thin, tangled set, and the places the point visits often become bright. The rules include curved folds, and these give the result its smoke, silk and feather look. It is a drawing made by counting visits.

### How it works

1. Pick a start point, then at each step choose one of three or four transforms at random, weighted.
2. Apply it: an affine map, followed by two nonlinear variations such as sinusoidal, spherical, swirl, horseshoe or heart.
3. Throw away the first 24 steps, then add the position to a histogram of visits for a few million steps.
4. Keep a running colour: the point’s colour moves halfway toward the colour of the chosen transform at each step.
5. Convert counts to brightness using a logarithm, with gamma, so both dense and faint regions are visible.

### The mathematics

A fractal flame (Scott Draves, 2003) is found by a game of chance. Pick a point. Choose one of three or four transforms at random (each with its own weight), apply it, and plot where the point lands; repeat a few million times. Each transform is an affine map (a rotation, scale and shift) followed by two nonlinear variations V mixed with weights w₁ + w₂ = 1. The variations are named, familiar curves: sinusoidal, spherical (dividing by r²), swirl, horseshoe, polar, handkerchief, heart, disc, spiral, julia, bubble and fisheye. They fold the plane, and the folds are what makes a flame look like smoke and fabric. The first 24 steps are thrown away, and the points are accumulated in a histogram.

Colour is carried by a running mean: each transform has a colour index c_i and the point’s colour moves halfway toward it at every step, so a pixel’s colour is the average of the routes by which it was reached. Since many random sets of transforms make dull or empty pictures, the program tries up to 60 seeds. For each it plots 30,000 points, finds the middle 94% of their range, and keeps the candidate only if it is a real picture (a decent extent and at least 130 of 24 × 24 cells occupied); the view is then fitted to that range. The histogram is shown by log-density tone mapping, the standard flame trick that lets a dense core glow and faint filaments remain visible, with a white-hot core added where the density is highest. With rotational symmetry s > 1, each point is rotated by a random multiple of 2π/s.

$$
(x,y)\ \leftarrow\ w_1\,V_{j_1}\!\big(A_i(x,y)\big)+w_2\,V_{j_2}\!\big(A_i(x,y)\big),\qquad A_i(x,y)=(a\,x+b\,y+e,\ c\,x+d\,y+f)
$$
_One step of the chaos game with the randomly chosen transform i._

$$
V_{\text{sph}}=\frac{(x,\,y)}{r^{2}},\qquad V_{\text{swirl}}=\big(x\sin r^{2}-y\cos r^{2},\ \ x\cos r^{2}+y\sin r^{2}\big)
$$
_Two of the twelve variations (spherical and swirl), with r² = x² + y²._

$$
t=\operatorname{clip}\!\Big[\Big(\frac{\ln(1+n)}{\ln(1+n_{\max})}\Big)^{0.72}B\Big],\qquad C=(1-t)\,C_{\text{bg}}+1.25\,\frac{t}{n}\sum c\ +\ 0.35\cdot255\,t^{3.5}
$$
_Log-density tone mapping: n is the hit count of a pixel, B the brightness slider, Σc the sum of the colours that landed there._

### A short history

Scott Draves designed fractal flames in 1992 and published the algorithm in 2003, building on iterated function systems, which John Hutchinson formalised in 1981 and Michael Barnsley popularised in the 1980s. Draves also created Electric Sheep, a screen saver from 1999 in which thousands of computers dream and vote on flames. Flame fractals appear in programs such as Apophysis.

### Where it is used

- Generative art and wallpaper
- Screen savers and music visuals
- Texture generation for film and games
- Teaching chaos and iterated functions

### Try it

- Three-fold symmetry makes a flower-like flame. (https://lumenary-studio.vercel.app/style/fractal-flame?sym=3)
- Sharp folds give crystalline, feathery shapes. (https://lumenary-studio.vercel.app/style/fractal-flame?family=sharp&quality=85)
- The ember palette is the classic fire look. (https://lumenary-studio.vercel.app/style/fractal-flame?colour=ember&bright=75)

### Words worth knowing

- **Affine map:** A transform made of rotation, scaling and shifting.
- **Iterated function system:** A set of transforms applied again and again to build a fractal.
- **Histogram:** A count of how often each position was visited.

### See also

- 153 Strange Attractors
- 138 Mandelbrot Fill
- 62 Aurora

## 138  Mandelbrot Fill  ·  _still_

- **Comes from:** Complex dynamics
- **Around:** Julia 1918, Mandelbrot 1980
- **Works best on:** Colourful pictures with large smooth areas

### Why it looks this way

Take a number, square it, add a constant, and repeat. Some starting numbers fly off to infinity and some never do. The boundary between them is one of the most intricate shapes known, and zooming in reveals smaller copies of the whole. In this treatment the orbit is also a probe: when it passes through a window over the plane, it picks up the colour of your picture at that spot.

### How it works

1. Map each pixel to a point of the complex plane, inside a chosen view such as the seahorse valley or the triple spiral.
2. Iterate zₙ₊₁ = zₙ² + c, with c from the pixel for the Mandelbrot set, or z₀ from the pixel and a fixed c for a Julia set.
3. Stop when |z|² passes 400 or after the chosen number of steps.
4. Lay a window |Re z| < hₓ, |Im z| < hᵧ over the plane and stretch the picture across it: the first time an orbit passes through it, the pixel takes that colour, darkened if it arrived late.
5. Add a glow on the edge of the set, and colour the pixels that never land from a palette.

### The mathematics

The Mandelbrot set is the set of complex numbers c for which the orbit z₀ = 0, zₙ₊₁ = zₙ² + c stays bounded. A Julia set uses the same rule with c fixed (here at distance 0.7885 from the origin, at the angle set by the Julia-shape slider) and the starting point z₀ taken from the pixel. Every pixel is mapped to a point of the complex plane inside a chosen view (the whole set, the seahorse valley, the elephant valley, the triple spiral or a small copy), widened or narrowed by the zoom, and its orbit is followed for up to the detail number of steps. The orbit is declared escaped when |z|² passes 400.

The picture comes in as an orbit trap. A window |Re z| < hₓ, |Im z| < hᵧ around the origin is laid over the plane and your picture is stretched across it. The first time an orbit passes through the window, the pixel takes the colour of the picture at that spot, and a late arrival is darkened: the factor is 0.5 + 0.5 e^(−n/7). Because orbits near the set’s boundary wander, they sample the picture at scattered points, and the picture appears in thousands of distorted copies. The pixels whose orbits never touched the window but escaped get a smooth iteration count, ν = n + 1 − log₂(log₂|zₙ|), run through a cyclic colour ramp, with a glow near the edge that fades as e^(−n/14); orbits that never escape and never touch the window are left near black.

$$
z_{n+1}=z_n^{2}+c,\qquad \text{Mandelbrot: } z_0=0,\ c=\text{pixel};\quad \text{Julia: } z_0=\text{pixel},\ c=0.7885\,e^{i\alpha}
$$
_The two kinds of orbit._

$$
\text{colour}=C_{\text{picture}}\!\Big(\tfrac12\big(\tfrac{\operatorname{Re}z_n}{h_x}+1\big)W,\ \ \tfrac12\big(1-\tfrac{\operatorname{Im}z_n}{h_y}\big)H\Big)\cdot\big(0.5+0.5\,e^{-n/7}\big)
$$
_The orbit trap: n is the first step with |Re z| < hₓ and |Im z| < hᵧ._

$$
\nu=n+1-\log_2\!\big(\log_2\lvert z_n\rvert\big)
$$
_Smooth escape count, used for the colour of pixels that escaped without touching the window._

### A short history

Gaston Julia and Pierre Fatou studied iteration of complex functions around 1918, but without computers they could not see the shapes. Benoit Mandelbrot, working at IBM, first drew the set in 1980 and named fractals in his 1975 book, later expanded as The Fractal Geometry of Nature in 1982. Orbit traps of this kind were developed in the 1980s, including by Clifford Pickover.

### Where it is used

- Computer art and wallpaper
- Benchmarking processors and graphics cards
- Teaching complex numbers and chaos
- Modelling coastlines, clouds and terrain

### Try it

- The seahorse valley is the most famous close-up. (https://lumenary-studio.vercel.app/style/mandelbrot-fill?view=seahorse&zoom=2)
- A Julia set shows a different member of the family. (https://lumenary-studio.vercel.app/style/mandelbrot-fill?kind=julia&julia=120)
- A smaller window shows more of the original picture inside. (https://lumenary-studio.vercel.app/style/mandelbrot-fill?window=160)

### Words worth knowing

- **Complex number:** A number with a real part and an imaginary part, drawn as a point on a plane.
- **Orbit:** The sequence of points produced by applying a rule repeatedly.
- **Orbit trap:** A shape used to colour a point by where its orbit passes.

### See also

- 137 Fractal Flame
- 153 Strange Attractors
- 159 Domain Warp

## 139  Reaction-diffusion  ·  _live_

- **Comes from:** Mathematical biology
- **Around:** 1952 theory, 1990s computer art
- **Works best on:** Pictures with soft light and shadow

### Why it looks this way

Turing asked how a uniform ball of cells could grow stripes or spots. His answer was that two chemicals that react and spread at different speeds can organise themselves. One feeds the other, and the other spreads more slowly, so small bumps grow and push each other apart. The picture steers where each pattern appears.

### How it works

1. Keep two chemicals on a grid: a food U and an activator V.
2. At each step, V turns U into more V (the term u v²), and V is removed at a rate f + k while U is fed at rate f.
3. Let both spread, U at 0.21 and V at 0.105, using a five-point Laplacian with clamped edges.
4. Make f and k vary from cell to cell with the picture’s tone, so light and dark regions sit at different places in the pattern map.
5. Choose a preset pair of f and k: coral, worms, spots, maze or dividing cells.

### The mathematics

Alan Turing proposed in 1952 that two chemicals that react and spread at different speeds can organise themselves into spots and stripes. This is the Gray-Scott model. A food chemical U is fed in at rate f. An activator V turns U into more V (the reaction U + 2V → 3V, which gives the term u v²) and is removed at rate f + k. Both spread, the food faster than the activator (Dᵤ = 0.21, Dᵥ = 0.105 in grid units). Depending on f and k the same rules grow coral, worms, spots, mazes or cells that divide; the preset sets the pair, and each step is one explicit Euler step on a grid about 1/2.8 of the picture’s width with a five-point Laplacian and clamped edges.

The picture steers the chemistry. f and k are not constants but vary from cell to cell by the picture’s tone, f = f₀ + s (tone − ½) × 0.02 and k = k₀ + s (tone − ½) × 0.005, so bright and dark regions sit at different places in the pattern map and grow different textures, spots on one side and stripes on the other, and the picture emerges from the growth. The grid starts as U = 1 with scattered 3 × 3 patches (2% of cells) where U = 0.5 and V ≈ 0.25. Pressing and dragging seeds the same kind of patch under the pointer. V is shown through a smoothstep as ink, as an ember colour ramp, or as the picture’s own colours.

$$
\begin{aligned}\frac{\partial u}{\partial t}&=D_u\nabla^{2}u-u\,v^{2}+f\,(1-u)\\[2pt] \frac{\partial v}{\partial t}&=D_v\nabla^{2}v+u\,v^{2}-(f+k)\,v\end{aligned}
$$
_The Gray-Scott equations; D_u = 0.21 and D_v = 0.105._

$$
\nabla^{2}u\approx u_N+u_S+u_E+u_W-4\,u,\qquad u\leftarrow u+\Delta t\,\dot u,\ \ \Delta t=1
$$
_The discrete Laplacian on the grid and the Euler step._

$$
f=f_0+0.02\,s\,\big(\tau-\tfrac12\big),\qquad k=k_0+0.005\,s\,\big(\tau-\tfrac12\big)
$$
_The picture’s steering: τ is the tone (0 to 1), s the steering slider._

### A short history

Alan Turing published The Chemical Basis of Morphogenesis in 1952. The Belousov-Zhabotinsky reaction, shown to make spirals and rings in a dish, gave experiments to match. In 1991 Greg Turk, and separately Andrew Witkin and Michael Kass, brought reaction-diffusion to computer graphics, and in 1993 John Pearson charted the patterns of the Gray-Scott model. In 1995 Kondo and Asai showed that the stripes of angelfish move over time as such a model predicts.

### Where it is used

- Modelling animal coats, shells and fingerprints
- Procedural textures for games and film
- Generative art and architecture
- Chemistry and developmental biology teaching

### Try it

- Worms give long, winding stripes. (https://lumenary-studio.vercel.app/style/reaction-diffusion?preset=worms)
- Mitosis makes cells that keep dividing. (https://lumenary-studio.vercel.app/style/reaction-diffusion?preset=mitosis&speed=10)
- Strong steering shows the picture more clearly. (https://lumenary-studio.vercel.app/style/reaction-diffusion?steer=90)

### Words worth knowing

- **Morphogen:** A chemical that gives cells signals about form and position.
- **Laplacian:** A measure of how different a point is from its neighbours, which drives diffusion.
- **Gray-Scott model:** A pair of equations for feeding and killing two chemicals that spread.

### See also

- 151 Physarum
- 152 Differential Growth
- 150 Cellular Automata

## 140  Flow Field  ·  _still_

- **Comes from:** Fluid dynamics and generative art
- **Around:** 1997 method, popular from the 2010s
- **Works best on:** Pictures with clear outlines

### Why it looks this way

A streamline is the path a speck of dust would take in a steady wind. Drawing many of them, evenly spaced, shows the whole shape of the wind. Here the wind swirls according to smooth noise, but near edges in your picture it turns to run along them, so outlines appear as places where the flow bends.

### How it works

1. Make the direction field from fractal noise, with an angle θ = 2π × 2.2 × fbm, so it swirls without jumps.
2. Where the picture has an edge, rotate the field toward the edge’s tangent, perpendicular to the gradient of lightness.
3. Place seeds on a jittered grid and accept one only if it is at least 0.8 of the spacing from every existing line.
4. Trace each line both ways in steps of 0.45 of the spacing, stopping when it comes too close to another.
5. Draw the lines with width and colour from the picture.

### The mathematics

A streamline is a curve that is everywhere tangent to a vector field. The field here is made of a direction angle θ taken from smooth noise, θ = 2π × 2.2 × fbm(νx), so that it swirls without ever jumping. Where the picture has an edge, the field is bent toward the tangent of the edge, the direction perpendicular to the gradient of the lightness, with a weight w = follow × smoothstep(0.015, 0.12, |∇L|). Streamlines then run along outlines instead of across them, and the picture’s shapes appear as the places where the flow turns.

To keep the lines evenly spaced and uncrossed the program uses the method of Jobard and Lefer (1997). Seeds are laid on a jittered grid and shuffled. A seed is accepted only if it is at least 0.8 of the spacing from every existing line point. From it a line is traced both ways in steps of 0.45 of the spacing (up to 260 each way), and it stops as soon as the next point would come too close to another line, or to its own older points (the most recent 14 steps are exempt, so it does not stop itself). The check looks only in a 5 × 5 neighbourhood of a grid with cells of spacing/√2. Each line is drawn as a smooth curve whose width follows the tone at its middle and whose colour is the picture’s there.

$$
\mathbf d=\frac{(1-w)\,(\cos\theta,\ \sin\theta)+w\,\mathbf t}{\big\lVert(1-w)\,(\cos\theta,\ \sin\theta)+w\,\mathbf t\big\rVert},\qquad \mathbf t=\frac{(-\partial_y L,\ \partial_x L)}{\lVert\nabla L\rVert}
$$
_Field direction: θ from noise, t the edge tangent, w the follow weight._

$$
\mathbf x_{j+1}=\mathbf x_j+h\,\mathbf d(\mathbf x_j),\qquad h=0.45\,s
$$
_One step of a streamline; s is the line spacing._

$$
\text{stop if }\ \lVert\mathbf x_{j+1}-\mathbf y\rVert<0.8\,s\ \ \text{for any other line point }\mathbf y
$$
_The separation rule that keeps the lines evenly spaced._

### A short history

Streamlines are old tools in fluid dynamics. Bruno Jobard and Wilfrid Lefer published the evenly spaced method in 1997 for scientific visualisation of wind and flow. In the 2010s and 2020s, flow fields became a staple of generative art, with artists such as Tyler Hobbs using them for collections like Fidenza in 2021.

### Where it is used

- Wind, current and field visualisation
- Hair and fur direction in 3D art
- Generative art prints and plotter drawings
- Engineering flow analysis

### Try it

- Tight spacing and strong following draw the picture in fine hair. (https://lumenary-studio.vercel.app/style/flow-field?space=3&follow=90)
- Large swirls feel like wind over a field. (https://lumenary-studio.vercel.app/style/flow-field?scale=85&follow=30)
- Ink lines on night paper glow like silk threads. (https://lumenary-studio.vercel.app/style/flow-field?colour=night)

### Words worth knowing

- **Streamline:** A curve that is everywhere tangent to a flow.
- **fbm:** Fractal Brownian motion, a sum of noise at several scales.
- **Tangent:** The direction along a curve at a given point.

### See also

- 159 Domain Warp
- 155 Contour Lines
- 151 Physarum

## 141  Circle Packing  ·  _still_

- **Comes from:** Geometry
- **Around:** Ancient, with modern computer methods
- **Works best on:** Pictures with a clear contrast between dark and light

### Why it looks this way

Packing circles into a space is the problem of fitting round things as tightly as they will go. By letting the picture set how large each circle may grow, the same process draws a portrait out of bubbles, where large circles gather in the chosen tones and small ones fill the gaps.

### How it works

1. Try random points and ask how big a circle could be centred there.
2. Take the smallest of four limits: the radius the picture asks for, the distance to the four walls, and the distance to every neighbour minus its radius and the gap.
3. If the answer is at least the smallest allowed radius, place the circle.
4. Use a grid of cells as wide as the largest circle so only the nine nearest cells are searched.
5. The wanted radius is r_min × 1.6 + (r_max − 1.6 r_min) f^0.9, where f is the tone, so large circles gather where the picture asks.

### The mathematics

The program fills the picture with circles that never overlap, each as large as the room allows. It tries random points, and at each one asks how big a circle could be. The answer is the smallest of four things: the radius the picture asks for, the distances to the four walls, and the distance to every neighbouring circle minus its radius and the gap. If the answer is at least the smallest allowed radius, the circle is placed. A grid with cells the size of the largest circle means only the nine nearest cells need to be searched, and the number of attempts grows with the area divided by the smallest circle’s area.

The picture decides the radius it asks for. With size following the light or the dark, the wanted radius is r_min × 1.6 + (r_max − 1.6 r_min) f^0.9, where f is the tone (or one minus it), so large circles gather in the chosen tones and small ones fill everything else. Each circle takes the picture’s colour at its centre. Circles can be drawn as flat discs, as rings whose stroke is 0.28 of the radius, or as glossy beads with a radial gradient lit from the upper left, brightened ×1.4 + 50 at the highlight and darkened to 0.62 at the rim.

$$
r=\min\Big(r_{\text{want}},\ x,\ W-x,\ y,\ H-y,\ \min_k\big[\lVert\mathbf p-\mathbf p_k\rVert-r_k-g\big]\Big),\qquad \text{accept if } r\ge r_{\min}
$$
_The largest circle that fits at point p, given the other circles (centres p_k, radii r_k) and the gap g._

$$
r_{\text{want}}=1.6\,r_{\min}+\big(r_{\max}-1.6\,r_{\min}\big)\,f^{0.9}
$$
_The radius the picture asks for; f is the tone, or 1 − tone when the dark parts should be large._

### A short history

Apollonius of Perga described circles tangent to three others in the third century BC. René Descartes wrote a relation among four touching circles in 1643, rediscovered by Frederick Soddy in 1936 as a poem. The circle packing theorem, proved by Koebe in 1936 and later developed by Thurston in the 1980s, links packings to networks of points.

### Where it is used

- Bubble charts and hierarchical data views
- Packaging, cable bundles and pipes
- Logo and poster design
- Cell and foam structure studies

### Try it

- Large circles gathering in the light parts invert the look. (https://lumenary-studio.vercel.app/style/circle-packing?size=light)
- Ring mode makes bubbles with open centres. (https://lumenary-studio.vercel.app/style/circle-packing?look=ring&gap=3)
- Tiny minimum circles fill almost every gap. (https://lumenary-studio.vercel.app/style/circle-packing?min=1.5&max=30)

### Words worth knowing

- **Packing:** Placing shapes in a space without overlap.
- **Apollonian gasket:** A fractal made by filling gaps between circles with more circles.
- **Tangent:** Touching at a single point.

### See also

- 120 Bokeh
- 156 Poisson Stippling
- 135 Voronoi Mosaic

## 142  String Art  ·  _still_

- **Comes from:** Mathematical teaching and craft
- **Around:** Curve stitching in the 1860s, computed portraits from 2016
- **Works best on:** High contrast portraits

### Why it looks this way

A single thread wound back and forth between nails can render a face, because every pass of the thread darkens the path it covers a little, and many thin lines add up to tone. The trick is choosing the next nail so that each pass lands on the darkest part still unpainted.

### How it works

1. Turn the picture into a target on a 240-pixel grid, where T = (1 − L)^1.2 for dark thread on a light board, or L^1.2 for pale thread on black.
2. Place the nails on a circle or along the frame.
3. From the current nail, test every other nail, skipping the nearest two on each side, and measure the mean target along each straight line.
4. Pick the best, halve the score of any path used before, wind the thread there and subtract the thread strength from the target along the line.
5. Stop at the chosen thread length or when no line scores above 0.012.

### The mathematics

String art makes a picture from one long thread wound between nails on a board, and the program winds it greedily. The picture becomes a target T on a 240-pixel grid: T = (1 − L)^1.2 for a dark thread on a light board, or L^1.2 for a pale thread on black, so T is large where thread is wanted. The nails stand on a circle or on the edge of a rectangle. At each turn, from the nail where the thread now is, every other nail is tried (the two nearest nails on either side are skipped) and the mean target along the straight line to it is measured. The best nail is chosen, a path used before has its score halved, and the thread is wound there.

Winding a line uses up some of the target, since that darkness is now covered: the strength slider s is subtracted from T along the line (never below 0). The winding stops when the chosen number of lines is reached or no line scores above 0.012. When the thread is drawn, the lines are blended by multiplying (dark thread) or adding (pale thread) with opacity a = 1.15 s (kept between 0.05 and 0.6), so the density builds up with overlap just as real threads do. In the picture-colour option each segment takes the colour of the picture at its midpoint.

$$
j^{*}=\arg\max_{j}\ \frac{1}{\ell_{ij}}\sum_{\mathbf x\in\text{line}(i,\,j)}T(\mathbf x),\qquad T=\begin{cases}(1-L)^{1.2}&\text{dark thread}\\ L^{1.2}&\text{pale thread}\end{cases}
$$
_The next nail j from the current nail i; ℓ is the length of the line in grid steps._

$$
T(\mathbf x)\leftarrow\max\big(0,\ T(\mathbf x)-s\big)\quad\text{along the chosen line}
$$
_The target is used up by the thread laid down._

$$
\tau_k=(1-a)^{k}
$$
_Light that survives k overlapping threads of opacity a, the reason overlapping threads build tone._

### A short history

Mary Everest Boole, a mathematics teacher, introduced curve stitching with cards and thread in the 1860s to teach geometry. Nail and thread pictures became a craft in the twentieth century. In 2016 the artist Petros Vrellis published a portrait made with a single thread around a circular loom, which started a wave of programs that find the thread path.

### Where it is used

- Portraits and wall art for gifts
- Teaching envelopes of curves
- CNC and robot drawing
- Laser cut and woven designs

### Try it

- Plenty of lines and a pale thread on a dark board shine like light. (https://lumenary-studio.vercel.app/style/string-art?colour=white&lines=4500)
- A frame of nails makes a rectangular portrait. (https://lumenary-studio.vercel.app/style/string-art?shape=frame)
- A fainter thread gives a softer, more graduated tone. (https://lumenary-studio.vercel.app/style/string-art?strength=8&lines=5000)

### Words worth knowing

- **Greedy algorithm:** A method that picks the best-looking next step each time without looking ahead.
- **Envelope:** The curve that a family of straight lines seems to trace.
- **Opacity:** How much a layer hides what is beneath it.

### See also

- 133 Spirograph
- 149 Hilbert Curve
- 98 Charcoal Sketch

## 143  Lissajous Curves  ·  _still_

- **Comes from:** Acoustics and physics
- **Around:** 1857
- **Works best on:** Dark backgrounds with bright centres

### Why it looks this way

If one point swings left and right while another swings up and down at a different rate, the pair trace a curve. Simple ratios of the two rates make loops and knots that close up. The phase decides how open the curve is, from a straight line to an ellipse and a tangled figure between.

### How it works

1. Compute x = A sin(a t + φ) and y = B sin(b t).
2. For whole numbers a and b, the curve closes; if they share a factor g it repeats after 2π/g.
3. In knot mode, draw one big curve as 2,600 short segments, with the chosen number of ribbons, each with the phase advanced by 0.22 radians.
4. Colour each segment from the picture at its midpoint and set its width from darkness.
5. In table mode, draw a grid in which the cell in column i and row j holds the curve with frequencies (i + 1, j + 1).

### The mathematics

A Lissajous curve is the path of a point that swings horizontally with frequency a and vertically with frequency b: x = A sin(a t + φ), y = B sin(b t). When a and b are whole numbers the curve closes and forms loops and knots; the ratio a : b gives the number of lobes along each side, and the phase φ opens or closes the figure from a line to an ellipse. If a and b share a factor g, the curve repeats after 2π/g.

Two layouts are offered. The knot is one large curve, drawn as 2,600 short segments, with the chosen number of ribbons: copies with the phase advanced by 0.22 radians each, nested like a twisted band. Each segment takes the colour of the picture at its midpoint, and its width follows the darkness, from half to twice the line width. The table is the classic Lissajous chart: a grid in which the cell in column i and row j holds the curve of frequencies (i + 1, j + 1). The cell’s curve is sized by the tone beneath it, R = 0.42 c (0.55 + 0.45 √(0.2 + h)), where c is the cell width and h the heaviness (darkness), and coloured by the picture.

$$
x(t)=A\sin(a\,t+\varphi),\qquad y(t)=B\sin(b\,t),\qquad t\in[0,2\pi]
$$
_The curve; A and B are 47% of the width and height in the knot layout._

$$
T=\frac{2\pi}{\gcd(a,\,b)}
$$
_The period of the curve for whole-number frequencies._

$$
(a,\ b)_{ij}=(i+1,\ j+1),\qquad R_{ij}=0.42\,c\,\big(0.55+0.45\sqrt{0.2+h_{ij}}\big)
$$
_The table: frequencies for the cell at column i, row j, and its size from the picture’s heaviness h._

### A short history

Jules Antoine Lissajous studied the figures in 1857 by bouncing a beam of light off mirrors attached to two tuning forks. The American navigator Nathaniel Bowditch had described them in 1815. Victorian harmonographs drew similar figures with pendulums. Oscilloscopes in X-Y mode show Lissajous figures when two signals are compared, and laser shows use them.

### Where it is used

- Comparing signal frequencies on an oscilloscope
- Laser light shows
- Decorative art and harmonograph prints
- Teaching harmonic motion

### Try it

- Equal frequencies with a quarter-turn phase give a circle. (https://lumenary-studio.vercel.app/style/lissajous-curves?mode=knot&a=5&b=5&phase=90)
- A 3 to 2 ratio draws a trefoil-like knot. (https://lumenary-studio.vercel.app/style/lissajous-curves?a=3&b=2&ribbons=5)
- The table shows how every ratio looks at once. (https://lumenary-studio.vercel.app/style/lissajous-curves?mode=table&cells=7)

### Words worth knowing

- **Frequency:** The number of swings per unit time.
- **Phase:** How far through its cycle one swing is compared with another.
- **Harmonograph:** A pendulum machine that draws curves.

### See also

- 40 Oscilloscope
- 133 Spirograph
- 153 Strange Attractors

## 144  Metaballs  ·  _still_

- **Comes from:** Computer graphics
- **Around:** 1980s
- **Works best on:** Pictures with bright spots on dark ground, or the reverse

### Why it looks this way

Metaballs are blobs that have no outline of their own. Each ball contributes a field that fades with distance, and the fields add up. Wherever the sum is above a level, there is body. When two balls are far apart each stands alone, and as they approach, the fields add in the gap until a smooth neck of matter joins them. That melting is what makes the shape look like liquid.

### How it works

1. Give each ball a field (1 − r²/R²)³ out to R = 2.6 times its radius, and zero beyond.
2. Add all the fields, and call a pixel inside the body wherever the total passes the level, which moves from 0.95 (apart) to 0.28 (merged) with the slider.
3. Choose ball positions by rejection sampling with probability 0.04 + 0.96 w^1.3, where w is the tone of the picture (light, dark or even).
4. Light the surface by treating the field as a height and using its gradient as a normal.
5. Take colour from the picture underneath, with an optional faint ghost of the original behind.

### The mathematics

Metaballs are blobs defined by a field, not by a surface. Each ball contributes a smooth field that falls to zero at a finite radius, f(r) = (1 − r²/R²)³ for r < R, with R = 2.6 times the ball’s radius. The fields of all the balls are added into one field F, and the body of the shape is wherever F is above a level. Where two balls are far apart each stands alone; as they come close the fields add up in between and the two bodies join with a smooth neck. The how-readily-they-merge slider moves the level between 0.95 (balls stay apart) and 0.28 (they melt together).

Balls are placed by rejection sampling. A random point is accepted with probability 0.04 + 0.96 w^1.3, where w is the picture’s tone there (for light places), its complement (for dark places) or 1 (anywhere), and the ball’s radius also grows with w. The surface is lit by treating F as a height: its gradient gives a normal n = (−∂ₓF, −∂ᵧF, 0.22/(0.3 + level)), normalised, with a diffuse term from a light at upper left and a tight specular highlight (power 22). The colour of the ball is the picture’s own, multiplied by 0.45 to 1.15 with the light. The edge is antialiased with a smoothstep of ±0.03 around the level.

$$
f(r)=\Big(1-\frac{r^{2}}{R^{2}}\Big)^{3}\ \ (r<R),\qquad F(\mathbf x)=\sum_i f_i\big(\lVert\mathbf x-\mathbf p_i\rVert\big)
$$
_The kernel of one ball and the total field._

$$
\text{inside}=\operatorname{smoothstep}\big(\lambda-0.03,\ \lambda+0.03,\ F\big),\qquad \lambda=0.95-0.67\,g
$$
_The body: g is the merge slider._

$$
\mathbf n=\frac{(-F_x,\ -F_y,\ \nu)}{\lVert(-F_x,\ -F_y,\ \nu)\rVert},\quad \nu=\frac{0.22}{0.3+\lambda},\qquad C=C_{\text{pic}}\,(0.45+0.7\,\mathbf n\cdot\mathbf l)+178\,G\,(\mathbf n\cdot\mathbf h)^{22}
$$
_Shading from the field’s gradient; l and h are the light and highlight directions, G the gloss slider._

### A short history

Jim Blinn introduced the blobby model in 1982 while working on ways to draw molecules, and similar ideas were developed by researchers in Japan and by the Wyvill brothers in the mid 1980s. Metaballs became a standard tool in 3D modelling programs and a classic demoscene effect, and the moving blobs of lava lamps are a physical cousin.

### Where it is used

- Fluid and organic shapes in 3D modelling
- Medical scans and isosurface visualisation
- Demoscene and game effects
- Interface animations that merge and separate

### Try it

- High merge makes the balls melt into one shape. (https://lumenary-studio.vercel.app/style/metaballs?goo=90)
- Low merge keeps clear bubbles apart. (https://lumenary-studio.vercel.app/style/metaballs?goo=5&gloss=85)
- Balls gathering in the dark parts invert the portrait. (https://lumenary-studio.vercel.app/style/metaballs?where=dark&count=700)

### Words worth knowing

- **Implicit surface:** A surface defined by where a function equals a value.
- **Isosurface:** The set of points where a field has the same value.
- **Rejection sampling:** Choosing random points and keeping each with a chosen probability.

### See also

- 67 Liquid morph
- 165 Ink in Water
- 130 Particles

## 145  Warped Grid  ·  _still_

- **Comes from:** Data art and graphic design
- **Around:** 1970 plot, 1979 record sleeve
- **Works best on:** Portraits with clear light and dark regions

### Why it looks this way

A picture can be shown without drawing it, simply by the way it disturbs something regular. A plain grid pushed around by light and dark looks like a sheet of rubber with a picture set in it, and stacked horizontal lines that rise over bright areas look like a mountain range. The shapes appear from the lines crowding and spreading, not from any colour being filled.

### How it works

1. Blur the lightness over about 10 pixels and take its gradient by central differences.
2. In grid mode, move each point of the lines to x′ = x − k ∇L, so lines crowd on one side of every light-to-dark edge and spread on the other.
3. Give each short piece of line the picture’s colour and a thickness between 0.45 and 1.85 times the line width, from its tone.
4. In ridges mode, stack horizontal lines and lift each one over the picture, so bright (or dark) regions form hills.
5. Hide lines behind the ridges in front, so the hills look solid.

### The mathematics

Two quite different drawings use the same idea, that a picture can be shown as the way it disturbs something regular. In the grid layout, a set of horizontal and vertical lines is pushed around by the picture’s gradient: each point is moved to x′ = x − k ∇L, where L is the lightness blurred over about 10 px and ∇L is taken by central differences. The strength k is the strength slider times 1,080 pixels (at 800 px wide). The lines crowd together on one side of every light-to-dark edge and spread on the other, as if the picture were a lens set in the page, and so the picture’s shapes appear without any of its colours being drawn. Each short piece of line takes its colour from the picture and its thickness (0.45 to 1.85 times the line width) from the tone.

The ridges layout is the old stacked-lines portrait of the pulsar radio signal made famous by the cover of Unknown Pleasures. Horizontal lines are lifted by A v^1.4, where v is the tone (light or dark, your choice) and A is up to 5.2 line spacings, tapered to 35% at the left and right edges. The lines are drawn from the top down, and each one is filled underneath with the paper colour, so that it hides the lines behind it. That hidden-line removal is the painter’s algorithm: nearer things are painted over farther ones.

$$
\mathbf x'=\mathbf x-k\,\nabla L(\mathbf x),\qquad k=1080\,\sigma\,\frac{W}{800},\qquad \partial_xL\approx\frac{L(x+2)-L(x-2)}{4}
$$
_Grid mode: σ is the strength slider and L the blurred lightness._

$$
y_j(x)=y_j-A\,v(x)^{1.4}\,e(x),\qquad e(x)=0.35+0.65\,\operatorname{smoothstep}\!\Big(0,\ 0.12,\ \frac{\min(x,\,W-x)}{W}\Big)
$$
_Ridges mode: A = 5.2 σ × the line spacing; e tapers the ridge toward the sides._

### A short history

The stacked-ridge picture is best known from the cover of Joy Division’s album Unknown Pleasures (1979), designed by Peter Saville. It uses a plot of radio pulses from the pulsar CP 1919 that Harold Craft made for his Cornell thesis in 1970, reprinted in the Cambridge Encyclopaedia of Astronomy. Such stacked plots are now called joy plots or ridgeline plots in data visualisation.

### Where it is used

- Record sleeves, posters and book covers
- Ridgeline charts in data journalism
- Terrain and signal visualisation
- Textile and relief graphics

### Try it

- Ridges with the dark rising give a mountain portrait. (https://lumenary-studio.vercel.app/style/warped-grid?mode=ridges&up=dark)
- Many fine lines make the picture cleaner. (https://lumenary-studio.vercel.app/style/warped-grid?lines=120&warp=70)
- Mono lines on cream paper look like an etching. (https://lumenary-studio.vercel.app/style/warped-grid?colour=mono&paper=cream)

### Words worth knowing

- **Gradient:** The direction and rate in which a value, such as brightness, changes fastest.
- **Ridgeline plot:** A set of overlapping curves stacked one above another.
- **Pulsar:** A spinning neutron star that sends out regular pulses of radio waves.

### See also

- 155 Contour Lines
- 140 Flow Field
- 132 Op Art Moire

## 146  Wave Function Collapse  ·  _still_

- **Comes from:** Constraint solving and procedural generation
- **Around:** 2016
- **Works best on:** Pictures with a clear mix of light and dark

### Why it looks this way

The name comes from quantum mechanics, where something can be in many states until it is measured. Here every cell starts as every possible tile, and the algorithm repeatedly settles the most constrained cell. Because neighbours must agree about the edge they share, one choice forces others, and the whole sheet falls into a consistent drawing without any plan.

### How it works

1. Treat each tile as a square with a line leaving through any of its four sides, a 4-bit number, so there are 16 tiles.
2. Apply the one rule: two neighbouring tiles must both have a line through their shared side, or neither. The sheet’s edge is closed.
3. Start every cell with all 16 possibilities held in a 16-bit mask.
4. Pick the cell with the fewest tiles left (lowest entropy, plus a little random noise to break ties), then choose one of its tiles with weights from the picture.
5. Propagate: remove from neighbours any tile that no longer fits, and repeat until all cells are settled.

### The mathematics

Wave function collapse (Maxim Gumin, 2016) borrows its name and its picture of a superposition from quantum mechanics, but it is a constraint-solving algorithm. Here a tile is a square with a line leaving through any of its four sides (north, east, south, west), a 4-bit number, so there are 16 tiles. The single rule is that two neighbouring tiles must agree on the side they share: either both have a line through it or neither does. The edge of the sheet is closed, so no line leaves the picture. At the start every cell may be any of the 16 tiles, a set held as a 16-bit mask.

The solver picks the cell with the fewest tiles still possible (its lowest entropy, with a little random noise of 0.4 to break ties) and collapses it: one of its remaining tiles is chosen by chance. The chances come from the picture. Each tile k has a weight exp(−(n_k − target)²/1.1), where n_k is the number of line ends on the tile and the target is higher in the heavy, dark parts of the picture and lower in the light, set by the density slider; the empty tile has its weight multiplied by 0.3. The choice is then propagated: neighbours lose the tiles that no longer agree, and so do their neighbours, until nothing more changes. A cell left with no possibility is drawn blank. The tiles are drawn as straight lines, rounded corner arcs or chamfered corners.

$$
c^{*}=\arg\min_{c\ \text{uncollapsed}}\big(\,\lvert D_c\rvert+0.4\,u\,\big)
$$
_The next cell to collapse: |D_c| is the number of tiles still possible there, u a random number in [0, 1]._

$$
w_k=m_k\,\exp\!\Big(-\frac{(n_k-\tau)^{2}}{1.1}\Big),\qquad \tau=(1-\delta)\,1.6+\delta\,(0.3+3.2\,h)
$$
_Chance weight of tile k: n_k its line ends, m_k = 0.3 for the empty tile and 1 otherwise, h the heaviness of the picture under the cell, δ the density slider._

$$
k'\ \text{allowed next to }k\ \text{on side }d\iff\big[k\ \&\ b_d\neq0\big]=\big[k'\ \&\ b_{d+2}\neq0\big]
$$
_The adjacency rule on bits: the shared side must either have a line on both tiles or on neither (d + 2 is the opposite side)._

### A short history

Maxim Gumin published the algorithm in 2016, building on the model synthesis of Paul Merrell (2007) and on texture synthesis research. It spread quickly in game design, where it was used in titles such as Bad North, Caves of Qud and Townscaper to build levels and towns that always make sense.

### Where it is used

- Procedural levels, maps and towns for games
- Texture and pattern synthesis
- Architecture and layout generation
- Constraint puzzles such as Sudoku

### Try it

- Chamfered corners give a circuit-board look. (https://lumenary-studio.vercel.app/style/wave-function-collapse?draw=chamfer)
- Strong picture control makes dense lines in the dark. (https://lumenary-studio.vercel.app/style/wave-function-collapse?density=100&size=14)
- Ink on night paper makes a glowing maze. (https://lumenary-studio.vercel.app/style/wave-function-collapse?colour=ink&paper=night)

### Words worth knowing

- **Entropy:** Here, a measure of how many choices a cell still has.
- **Constraint propagation:** Passing the consequences of a choice to neighbouring cells.
- **Bitmask:** A number whose binary digits mark which options are possible.

### See also

- 131 Truchet Tiles
- 37 Circuit Board
- 150 Cellular Automata

## 147  L-system Trees  ·  _still_

- **Comes from:** Theoretical biology
- **Around:** 1968
- **Works best on:** Landscapes and pictures with bright spots for leaves

### Why it looks this way

Plants grow by repeating one rule at every tip: a shoot grows, then splits. An L-system captures that as a grammar, a rule that rewrites a part of the plant into more parts. Run it a few times and a trunk becomes a crown of thousands of twigs, all different, all following the same rule, which is how real trees look.

### How it works

1. Draw a branch with a length and width, then start two children from its end (three with a 14 percent chance after the first generations).
2. Turn each child by plus or minus the spread angle times a random factor between 0.6 and 1.4, plus a share of the wind and a little jitter.
3. Make each child as long as the decay slider times a random 0.82 to 1.18, and 0.72 times as wide.
4. Stop when the depth runs out or the branch is shorter than 3 px, and place a leaf there; a few leaves appear on the way.
5. Colour each leaf from the picture and add a faint wash of the original behind.

### The mathematics

Aristid Lindenmayer introduced L-systems in 1968 as a grammar for the growth of plants: a string is rewritten again and again, and a drawing is made from the result. A branching tree is the rule “a branch becomes a branch with two branches on its end”, and the program draws it by recursion. A branch of length ℓ and width w is drawn, and then two children start from its end (and, with a 14% chance beyond the first two generations, three). The children turn by ± the spread angle times a random factor between 0.6 and 1.4, plus a share (0.35) of the wind angle and a little jitter, are the decay slider times a random 0.82 to 1.18 as long, and 0.72 times as wide. The number of generations is the depth of the recursion.

A branch ends when the depth runs out or when its length falls below 3 px; there a leaf is placed, and a few leaves appear on the way (5%) near the tips. If the lengths shrink by a factor δ each generation, a tip cannot rise higher than the geometric sum ℓ₀/(1 − δ) above the root, which is why a tree stays inside the frame. All leaves are shuffled and drawn as translucent discs (82% opacity) with the colour of the picture at their position, so the tree’s crown becomes a loose, pointillist portrait. The first three generations (the trunk and main boughs) are drawn a little darker, and the faint picture behind is an option.

$$
\ell_{k+1}=\delta\,u\,\ell_k\ (u\in[0.82,\,1.18]),\qquad w_{k+1}=0.72\,w_k,\qquad a_{k+1}=a_k\pm s\,(0.6+0.8\,u')+0.35\,\omega
$$
_Length, width and direction of the children; δ the decay, s the spread, ω the wind._

$$
N\approx\sum_{k=0}^{g}2^{k}=2^{g+1}-1,\qquad H\le\frac{\ell_0}{1-\delta}
$$
_The number of branches for g generations, and the bound on a tree’s height._

### A short history

The Hungarian-born biologist Aristid Lindenmayer introduced L-systems in 1968 to describe how filaments of algae grow. In 1990 Przemysław Prusinkiewicz and Lindenmayer published The Algorithmic Beauty of Plants, which showed how the method draws realistic plants. Procedural trees and plants in films and games are grown with descendants of this idea.

### Where it is used

- Trees and plants in games and film
- Botanical models of growth
- Fractal art and plotter drawings
- Teaching recursion in programming

### Try it

- A wide spread with short decay gives a rounded oak. (https://lumenary-studio.vercel.app/style/l-system-trees?spread=45&decay=70&depth=11)
- A strong wind leans the whole crown. (https://lumenary-studio.vercel.app/style/l-system-trees?wind=28)
- A forest of many small trees fills the picture. (https://lumenary-studio.vercel.app/style/l-system-trees?trees=6&depth=8)

### Words worth knowing

- **L-system:** A set of rewriting rules that grows a string, and from it a drawing.
- **Recursion:** A rule that uses itself to do its job.
- **Generation:** One round of applying the rule.

### See also

- 157 Space Colonization
- 152 Differential Growth
- 148 Phyllotaxis

## 148  Phyllotaxis  ·  _still_

- **Comes from:** Botany and mathematics
- **Around:** Observed for centuries, explained in 1979
- **Works best on:** Round compositions and portraits

### Why it looks this way

In a sunflower the seeds sit in curving rows that run both clockwise and anticlockwise, and the number of rows is almost always two neighbouring Fibonacci numbers. The reason is simple. If each new seed is placed a fixed angle round from the last, and that angle is the golden angle, no seed ever lines up with another for long, so the seeds pack as evenly as they can.

### How it works

1. Place seed number i at angle i α from the centre, with α = 2π/φ², about 137.5 degrees.
2. Place it at a distance c √(i + ½) from the centre, which gives every seed an equal share of area.
3. Choose c = R/√n so that the n seeds just reach the picture’s edge.
4. Look up the colour of the picture at each seed, and let the size follow the picture’s tone by an adjustable amount.
5. Draw each as a disc, petal or square, turning petals along the radius.

### The mathematics

In a sunflower the seeds are packed in spirals that run both ways, and the number of spirals is nearly always two neighbouring Fibonacci numbers, such as 34 and 55. Helmut Vogel showed in 1979 that this follows from one simple rule: seed number i is placed at the angle iα from the centre and at the distance c√(i + ½), where α is the golden angle, 2π/φ² ≈ 137.5°. The square root puts the seeds at equal density, since the area inside radius r_i is π r_i² = π c² (i + ½), which grows by the same amount for each seed.

The golden angle is the most irrational of all angles, in the sense that its continued fraction [0; 2, 1, 1, 1, …] is the slowest to approximate by a fraction. No two seeds line up along a ray for long, and the spirals are only the near-alignments, which come at Fibonacci counts. The constant c is chosen so that the n seeds reach the corner of the picture: c = R/√n, with R half the diagonal. The turn between seeds slider lets you leave the golden angle and see the spiral give way to rays, which shows how special it is. Each seed is a disc, a square turned with its angle or an elliptical petal, with a size set by the spacing and by the picture’s tone, and it takes the picture’s colour.

$$
\theta_i=i\,\alpha,\qquad r_i=c\sqrt{i+\tfrac12},\qquad \alpha=\frac{2\pi}{\varphi^{2}}\approx137.5^{\circ}
$$
_Vogel’s model: seed i in polar coordinates._

$$
c=\frac{R}{\sqrt n},\qquad \bar d=c\sqrt{\pi}
$$
_The scale that makes n seeds fill the radius R, and the mean spacing between seeds._

$$
\rho_i=\tfrac12\,\bar d\;\sigma\;1.35\,\big[\,(1-f)+f\,(0.15+h_i)\,\big]
$$
_Seed radius: σ is the seed size slider, f the size-follows-picture slider, h_i the heaviness of the picture at the seed._

### A short history

Phyllotaxis means leaf arrangement, a word from the 1750s, and its Fibonacci numbers were noted by Karl Schimper and Alexander Braun in the 1830s. The Bravais brothers recognised the golden angle in 1837. Helmut Vogel gave the simple formula in 1979, and in 1992 Stéphane Douady and Yves Couder reproduced the pattern with drops of magnetic fluid dripping onto a dish.

### Where it is used

- Natural patterns in botany and plant breeding
- Logo, textile and jewellery design
- Antenna and lens layouts that avoid regular gaps
- Teaching the golden ratio

### Try it

- The exact golden angle gives crisp spirals. (https://lumenary-studio.vercel.app/style/phyllotaxis?angle=137.51)
- A tiny change of angle breaks the spirals into rays. (https://lumenary-studio.vercel.app/style/phyllotaxis?angle=137&dots=12000)
- Petals make a flower head. (https://lumenary-studio.vercel.app/style/phyllotaxis?shape=petal&size=100)

### Words worth knowing

- **Golden angle:** About 137.5 degrees, the angle that divides a circle in the golden ratio.
- **Fibonacci numbers:** The sequence 1, 1, 2, 3, 5, 8, 13, and so on, each the sum of the last two.
- **Parastichy:** One of the spiral rows seen in a sunflower or pine cone.

### See also

- 147 L-system Trees
- 141 Circle Packing
- 187 Mandala

## 149  Hilbert Curve  ·  _still_

- **Comes from:** Mathematics
- **Around:** 1891
- **Works best on:** Pictures with fine detail

### Why it looks this way

The Hilbert curve is one unbroken line that visits every cell of a square grid and never crosses itself. Points that are near each other along the line are also near each other on the page, which makes it a good way to fold a long list into a flat image without tearing neighbourhoods apart. Here that line takes its colour from your picture.

### How it works

1. Order k covers a 2ᵏ by 2ᵏ grid in 4ᵏ steps, and is built by recursion: four copies of the previous order, the two lower ones turned a quarter turn in opposite directions, joined end to end.
2. The program skips the recursion and converts each step number into a grid position two binary digits at a time, turning and flipping the partial position as it goes.
3. Neighbouring steps are always neighbouring cells, so the line is continuous.
4. Draw from cell centre to cell centre, with the colour of the picture at each cell.
5. Let the line weight follow the picture’s darkness.

### The mathematics

David Hilbert described in 1891 a curve that passes through every cell of a square grid and never crosses itself. The curve of order k covers a 2ᵏ × 2ᵏ grid in 4ᵏ steps. It is built by recursion: divide the square into four quarters, draw a curve of the next lower order in each (the two at the bottom turned by a quarter turn, one clockwise and one anti-clockwise), and join them end to end. The program does not recurse. It converts the step number d, two binary digits at a time, into a grid position: for s = 1, 2, 4, …, take rx = (t >> 1) & 1 and ry = (t xor rx) & 1, turn and flip the partial position if ry = 0, add s·rx and s·ry, and shift t by two bits.

Neighbouring steps are always neighbouring cells, so the line is continuous. Its useful property is locality: points close along the curve are close in the plane (the converse is not always true). The line is drawn from cell centre to cell centre, with the width set by the weight slider and made to follow the picture’s heaviness, and each segment takes the colour of the picture at its midpoint. The total length of the line is (4ᵏ − 1) cells of width W/2ᵏ, almost 2ᵏ times the width of the picture, which is why high orders look like a dense engraving.

$$
n=2^{k},\qquad \text{cells}=n^{2}=4^{k},\qquad \text{length}=\big(4^{k}-1\big)\frac{W}{2^{k}}\approx2^{k}\,W
$$
_Grid, number of cells and the length of the line for order k._

$$
r_x=\big\lfloor t/2\big\rfloor\,\&\,1,\quad r_y=(t\oplus r_x)\,\&\,1,\quad (x,y)\leftarrow(x+s\,r_x,\ \ y+s\,r_y)
$$
_One step of the conversion from the number along the curve to its place (after the rotation of the partial position when r_y = 0)._

$$
w=c\,\lambda\,\big[(1-f)+f\,(0.2+1.1\,h)\big]
$$
_Line width: c is the cell width, λ the weight slider, f the follow slider, h the heaviness beneath._

### A short history

Giuseppe Peano published the first space-filling curve in 1890, and David Hilbert found the simpler version in 1891. The curve is used to index points in databases and maps, in image processing and for cache friendly memory layouts. The webcomic xkcd used it to draw a map of the internet in 2006, since addresses close in number stay close on the map.

### Where it is used

- Spatial indexing in databases
- Mapping long lists, such as internet addresses, onto a plane
- Image compression and halftoning
- Plotter and laser drawings

### Try it

- A low order shows the shape of the curve itself. (https://lumenary-studio.vercel.app/style/hilbert-curve?order=3&line=0.9)
- A high order with a thin line draws the picture as one thread. (https://lumenary-studio.vercel.app/style/hilbert-curve?order=8&line=0.4)
- Butt caps give crisp, mechanical corners. (https://lumenary-studio.vercel.app/style/hilbert-curve?cap=butt&colour=ink)

### Words worth knowing

- **Space-filling curve:** A line that passes through every point of a region.
- **Locality:** Points close along the curve are also close in the plane.
- **Recursion:** A rule that builds a shape from smaller copies of itself.

### See also

- 131 Truchet Tiles
- 142 String Art
- 146 Wave Function Collapse

## 150  Cellular Automata  ·  _live_

- **Comes from:** Mathematics and computing
- **Around:** 1940s theory, Life in 1970
- **Works best on:** Pictures with a good spread of light and dark

### Why it looks this way

A cellular automaton is a world made of squares that live, die or are born according to a rule about their neighbours. Nothing in the rule mentions gliders, guns or oscillators, and yet they appear. It is a small experiment in how complex behaviour can arise from very simple local rules, and the picture sets only where life starts out thickest.

### How it works

1. Hold a grid of alive and dead cells that wraps round at the edges like a torus.
2. Update every cell at once: a dead cell is born if its number of living neighbours is in the birth set B, and a living cell survives if the number is in the survival set S.
3. Use the Life-like rules: Life B3/S23, HighLife B36/S23, Day and Night B3678/S34678, Coral B3/S45678 and Maze B3/S12345.
4. Start each cell alive with a probability that rises with the picture’s tone, so the picture shows as a density of life.
5. Fade dead cells slowly with an afterglow so you can see where life has been, and let the cursor plant new cells.

### The mathematics

A cellular automaton is a grid of cells, each alive or dead, that all update together by a rule that looks only at its eight neighbours. The rules here are of the “Life-like” kind: a dead cell becomes alive if its number of living neighbours is in the birth set B, and a living cell stays alive if the number is in the survival set S. Conway’s Life is B3/S23, HighLife B36/S23, Day and Night B3678/S34678, Coral B3/S45678 and Maze B3/S12345. The grid wraps at the edges, like the surface of a torus.

The picture sets where life begins: each cell is alive at the start with probability clip(d (0.25 + 1.5 τ)), where d is the crowding slider and τ the picture’s tone (stretched to the full range), so the picture appears as a density of life, thicker in the light parts. The generations per second slider sets the speed (at most six generations per frame). Dead cells remember: the afterglow value h is 1 while a cell lives and then shrinks each frame by the afterglow factor, which draws fading ghosts behind the moving patterns. If the sheet becomes quiet, with less than 5% alive when the generation count is a multiple of 60, a scatter of new cells (12% × tone) is added. Pressing and dragging plants a 7 × 7 patch of random cells (55% of them alive).

$$
s_{t+1}(i)=\begin{cases}[\,n_i\in S\,]&\text{if } s_t(i)=1\\[2pt] [\,n_i\in B\,]&\text{if } s_t(i)=0\end{cases},\qquad n_i=\sum_{j\in\text{8 neighbours}}s_t(j)
$$
_The update rule; B and S are the birth and survival sets of the chosen rule._

$$
P(s_0=1)=\operatorname{clip}\big[\,d\,(0.25+1.5\,\tau)\,\big]
$$
_Initial state, with the tone τ of the picture and the crowding d._

$$
h_{t+1}=\begin{cases}1&\text{alive}\\ \gamma\,h_t&\text{dead}\end{cases}
$$
_The afterglow, with γ the afterglow slider._

### A short history

John von Neumann and Stanislaw Ulam explored self-reproducing cells in the 1940s. John Conway invented the Game of Life in 1970, and Martin Gardner introduced it to the public in Scientific American the same year. Stephen Wolfram surveyed one-dimensional automata in the 1980s, and Life, as well as his Rule 110, has been proved able to compute anything a computer can.

### Where it is used

- Modelling growth, forest fires and traffic
- Procedural cave and terrain generation in games
- Teaching emergence and computation
- Generative art and music

### Try it

- Maze grows winding corridors from a scatter. (https://lumenary-studio.vercel.app/style/cellular-automata?rule=maze&start=12)
- Coral builds slow, solid reefs. (https://lumenary-studio.vercel.app/style/cellular-automata?rule=coral&speed=8)
- A long afterglow draws trails of every moving shape. (https://lumenary-studio.vercel.app/style/cellular-automata?trail=95&colour=phosphor)

### Words worth knowing

- **Cellular automaton:** A grid of cells that all update together by a local rule.
- **Glider:** A small pattern in Life that travels across the grid.
- **Emergence:** Complex behaviour that arises from simple rules.

### See also

- 146 Wave Function Collapse
- 139 Reaction-diffusion
- 39 Matrix Rain

## 151  Physarum  ·  _live_

- **Comes from:** Biology and computing
- **Around:** Experiments in 2000, model in 2010
- **Works best on:** Pictures with bright shapes on dark ground

### Why it looks this way

A slime mould is a single cell with no brain, and yet it finds short routes through a maze and builds networks that look like rail maps. Each part follows a simple rule: move toward the strongest scent of its own kind, and leave scent behind. Trails that many cells use grow stronger and trails nobody uses fade, so the best routes win.

### How it works

1. Give each agent a position and heading, and let it sense the trail map at three points a distance d ahead: straight and 28 degrees left and right.
2. If the middle reading is highest, go straight; if both sides are higher, turn at random; otherwise turn toward the higher side.
3. Step one cell forward and deposit 0.3 units of chemical.
4. Each frame blur the trail map with a small kernel and multiply by the decay factor, so trails spread and fade.
5. Add food from the picture, so cells are drawn toward the light (or the dark) parts of it.

### The mathematics

The slime mould Physarum polycephalum has no brain, and yet it finds short routes between food sources and builds networks that resemble railway maps. Jeff Jones (2010) modelled it with agents that follow one another’s scent. Each agent has a position and a heading. It senses the trail map at three points a distance d ahead: straight on, and 28 degrees to the left and to the right. If the middle reading is the highest it goes straight on. If both sides are higher than the middle it turns at random one way or the other by the turning angle. If one side is higher it turns toward that side. Then it steps one cell forward and deposits 0.3 units of chemical there.

The trail map is a field in its own right. After every step it is blurred with the kernel (1 1 1 / 1 4 1 / 1 1 1) divided by 12, which spreads the scent a little, and multiplied by a decay factor, so old trails fade. What the agents sense is the trail plus 0.7 × the attraction slider × a food map, and the food map is the picture’s tone stretched to the full range (light or dark, your choice). The picture is the landscape of nutrients, and the mould builds its channels toward it. Two steps are made per frame, the agents are as many as a share of the grid cells, and pressing and dragging drops a burst of chemical, which agents follow.

$$
S_{\pm}=T\big(\mathbf x+d\,(\cos(\alpha\pm\beta),\ \sin(\alpha\pm\beta))\big)+\kappa\,F,\qquad \beta=28^{\circ}
$$
_The left and right sensor readings (and the centre one with β = 0); T is the trail, F the food map and κ = 0.7 × the attraction slider._

$$
\alpha'=\begin{cases}\alpha&S_0>S_{-},\,S_{+}\\ \alpha\pm\tau\ (\text{random sign})&S_0<S_{-},\,S_{+}\\ \alpha\pm\tau\ (\text{toward the larger})&\text{otherwise}\end{cases}
$$
_The steering rule; τ is the sharpness of turns._

$$
T\ \leftarrow\ \delta\;\frac{\big(\begin{smallmatrix}1&1&1\\1&4&1\\1&1&1\end{smallmatrix}\big)\ast T}{12}
$$
_Diffusion and decay of the trail map after each step; δ is the trail-length slider._

### A short history

Toshiyuki Nakagaki and colleagues showed in 2000 that Physarum polycephalum can solve a maze. In 2010 Atsushi Tero and colleagues placed oat flakes in the pattern of cities around Tokyo and the mould grew a network similar to the real rail system. Jeff Jones published the agent model in 2010, and it has been used in generative art and network design research.

### Where it is used

- Network and route planning research
- Generative art and music visuals
- Teaching self-organisation
- Texture design with vein-like patterns

### Try it

- Long-lasting trails make thick, stable networks. (https://lumenary-studio.vercel.app/style/physarum?decay=98&agents=12)
- Strong attraction pulls the mould into the shape of your picture. (https://lumenary-studio.vercel.app/style/physarum?food=80)
- Seeking the dark grows around the bright shapes. (https://lumenary-studio.vercel.app/style/physarum?seek=dark&colour=moss)

### Words worth knowing

- **Slime mould:** A single celled organism that moves and feeds in a network.
- **Agent:** A small program with its own position and rules.
- **Stigmergy:** Coordination through marks left in the environment.

### See also

- 139 Reaction-diffusion
- 158 Boids
- 152 Differential Growth

## 152  Differential Growth  ·  _still_

- **Comes from:** Biology and generative design
- **Around:** 2010s
- **Works best on:** Pictures with mid tones and shadows

### Why it looks this way

When a skin grows faster than what lies under it, it has to fold. The folds of a brain, a lettuce leaf, a coral and a ruffled collar all come about this way. The program models a growing line: neighbours pull together, strangers push apart, and extra points are inserted as the line stretches, so it buckles into coral. Shadows fold tighter than lights.

### How it works

1. Hold a closed loop of points with a rest length ℓ.
2. Add a spring to each neighbour (0.22 times the stretch), a smoothing pull toward the midpoint of the neighbours (0.06), and a repulsion from non-adjacent points closer than about 2.6 ℓ.
3. Push points back from the picture’s margin, add a little jitter and limit each step to half a rest length.
4. Insert a point wherever an edge has stretched beyond 1.55 ℓ, and sometimes in longer edges, so the loop lengthens.
5. Let the picture change ℓ locally, so folds are smaller in the shadows, and use a spatial hash to keep the search fast.

### The mathematics

Many natural folds, from the cortex of a brain to a lettuce leaf or a coral, come from growth that is not matched to the space available. The program models it with a closed loop of points. Each point feels a spring to its two neighbours that pulls it to a rest length ℓ (the force is 0.22 times the stretch), a smoothing pull toward the midpoint of its neighbours (0.06), a repulsion from every other non-adjacent point closer than about 2.6 ℓ (of strength (1 − d/R)² × 0.5 ℓ), a push back from the picture’s margin, and a tiny random jitter. The step of a point is limited to half a rest length. A spatial hash keeps the repulsion search close to linear in the number of points.

Growth is the insertion of points. Wherever an edge has stretched beyond 1.55 ℓ a point is added at its midpoint, and any edge longer than 0.7 ℓ may get one with a probability of 3.5% per round. The loop lengthens but has to fit in the same sheet, so it buckles, and the repulsion makes it fold rather than cross itself. The picture sets the rest length: ℓ is reduced where the picture is heavy (dark on light paper), down to 0.55 times, so shadows fold into finer, tighter detail and the lights stay open. Each edge is then drawn with a width (0.55 to 1.65 times the line width) and a colour from the picture. The run takes 180 to 540 rounds, or stops at 3,000 to 14,000 points.

$$
\mathbf F_i=0.22\sum_{j\in\{i-1,\,i+1\}}\big(\lVert\mathbf p_j-\mathbf p_i\rVert-\ell_i\big)\,\hat{\mathbf e}_{ij}+0.06\Big(\tfrac{\mathbf p_{i-1}+\mathbf p_{i+1}}{2}-\mathbf p_i\Big)
$$
_Springs to the two neighbours and the smoothing pull; ê is the unit vector from i to j._

$$
\mathbf F^{\text{rep}}_i=\sum_{j}\Big(1-\frac{d_{ij}}{R_{ij}}\Big)^{2}0.5\,\ell_i\,\hat{\mathbf e}_{ji},\qquad R_{ij}=1.3\,(\ell_i+\ell_j),\ \ d_{ij}<R_{ij}
$$
_Repulsion from the other points that are not neighbours on the loop._

$$
\ell(\mathbf x)=\ell_0\big[(1-f)+f\,\big(0.55+1.0\,(1-h)\big)\big]
$$
_The picture sets the rest length: h is the heaviness at x and f the tightness slider._

### A short history

Biologists and mathematicians have studied how growth creates folds for a long time. A 2014 gel model of the developing brain, by Tuomas Tallinen, L. Mahadevan and colleagues, showed that the folds of the cortex follow from a swelling outer layer on a core. Studios such as Nervous System and artists such as Anders Hoff brought differential growth into design from the 2010s.

### Where it is used

- Jewellery, lamps and lace-like design
- Models of brain folding and tissue growth
- Generative art and plotter drawings
- Organic textures for 3D art

### Try it

- Small folds make fine, brain-like coral. (https://lumenary-studio.vercel.app/style/differential-growth?edge=3&grow=90)
- Large folds make bold, ruffled shapes. (https://lumenary-studio.vercel.app/style/differential-growth?edge=13&seeds=2)
- Ink on night paper looks like lace. (https://lumenary-studio.vercel.app/style/differential-growth?colour=ink&paper=night)

### Words worth knowing

- **Cortex:** The folded outer layer of the brain.
- **Rest length:** The length at which a spring pulls neither way.
- **Spatial hash:** A grid used to find nearby points quickly.

### See also

- 139 Reaction-diffusion
- 147 L-system Trees
- 151 Physarum

## 153  Strange Attractors  ·  _live_

- **Comes from:** Chaos theory
- **Around:** 1960s onward
- **Works best on:** Colourful pictures, which tint the cloud

### Why it looks this way

A strange attractor is the shape drawn by a point that follows a simple rule for ever. The point never repeats and never escapes, and two points that start close together move apart quickly, which is the sign of chaos, yet both stay on the same fine, filamented set. A tiny change in four numbers gives a completely different picture.

### How it works

1. Use one of two maps: Clifford’s x′ = sin(a y) + c cos(a x), y′ = sin(b x) + d cos(b y), or Peter de Jong’s x′ = sin(a y) − cos(b x), y′ = sin(c x) − cos(d y).
2. Each frame follow 48 points for 1,100 steps each.
3. Add every landing to a density histogram half the size of the picture.
4. Dim the histogram each frame by the linger factor, so the image is a running average that shows a glowing cloud.
5. Let the four numbers drift slowly, so the attractor breathes, and tint it from the picture.

### The mathematics

A strange attractor is the shape drawn by a point that follows a simple rule forever: the point never repeats and never escapes, and nearby starting points move apart exponentially (the sign of chaos) while still staying on one fine, filamented set. Two such maps are used. Clifford’s is x′ = sin(a y) + c cos(a x), y′ = sin(b x) + d cos(b y); Peter de Jong’s is x′ = sin(a y) − cos(b x), y′ = sin(c x) − cos(d y). A small change in the four numbers a, b, c and d gives a completely different picture, and three sets that are known to make good pictures are provided for each map.

Each frame 48 points are followed for 1,100 steps each, and every landing is added to a density histogram the size of half the picture. The histogram is dimmed by the linger factor on every frame, so the image is a running average that shows the attractor as a glowing cloud. Because |x′| and |y′| cannot be bigger than 1 + |c| and 1 + |d| for Clifford (and 2 for de Jong), the picture is scaled to fit those bounds exactly. The four numbers drift in time, each by a sine of its own speed and an amount set by the drift slider (up to 0.22), so the attractor breathes; the pointer adds up to ±0.3 to a and b. The brightness is a log-density tone map, and either a flame ramp or the picture’s own colours (each cell’s average) give the colour.

$$
\begin{aligned}x'&=\sin(a\,y)+c\cos(a\,x)\\ y'&=\sin(b\,x)+d\cos(b\,y)\end{aligned}\qquad\qquad \begin{aligned}x'&=\sin(a\,y)-\cos(b\,x)\\ y'&=\sin(c\,x)-\cos(d\,y)\end{aligned}
$$
_Clifford (left) and de Jong (right) maps._

$$
a(t)=a_0+0.22\,\delta\,\sin(\omega_a t+\phi_a)+0.6\,\big(p_x-\tfrac12\big),\qquad\text{similarly }b,\ c,\ d
$$
_The drifting parameters: δ is the drift slider, p the pointer position (the pointer acts on a and b only)._

$$
v=\operatorname{clip}\Big[\Big(\frac{\ln(1+n)}{\ln(1+n_{\max}/2)}\Big)^{1.2}G\Big]
$$
_The log-density tone map: n is the number of landings in a cell and G the glow slider._

### A short history

Edward Lorenz found chaos in a weather model in 1963, and Michel Hénon published his map in 1976. Peter de Jong’s and Clifford Pickover’s maps became popular in the 1980s and 1990s, especially through Pickover’s books on computers, pattern and chaos. Strange attractors now appear in studies of weather, circuits, heartbeats and population dynamics.

### Where it is used

- Studying chaos in weather, circuits and populations
- Generative art and screensavers
- Music visualisation
- Teaching sensitive dependence on initial conditions

### Try it

- De Jong gives silkier, more symmetric clouds. (https://lumenary-studio.vercel.app/style/strange-attractors?type=dejong)
- A strong drift makes the attractor morph quickly. (https://lumenary-studio.vercel.app/style/strange-attractors?drift=90&glow=85)
- The ember palette gives a fiery glow. (https://lumenary-studio.vercel.app/style/strange-attractors?colour=ember&fade=94)

### Words worth knowing

- **Attractor:** A set that a system settles into over time.
- **Chaos:** Extreme sensitivity to starting conditions, in a rule that is not random.
- **Density histogram:** A count of how often each position was visited.

### See also

- 137 Fractal Flame
- 143 Lissajous Curves
- 138 Mandelbrot Fill

## 154  Fourier Epicycles  ·  _live_

- **Comes from:** Mathematics and ancient astronomy
- **Around:** Ptolemy’s epicycles, Fourier 1822
- **Works best on:** Bold shapes with one clean outline

### Why it looks this way

Any closed curve can be drawn by a chain of turning circles, each riding on the rim of the one before. This is the idea behind the Fourier series: break a shape into pure rotations of different speeds and sizes. A few big circles trace the rough outline, and each additional small one adds finer detail, so the picture sharpens as circles are added.

### How it works

1. Find a long closed contour in a lightly blurred, half-size copy of the picture with marching squares, at the level chosen by the slider.
2. Resample it at 1,024 points of equal arc length and treat each point as a complex number z(t).
3. Compute all 1,024 Fourier coefficients c_k once, using a discrete Fourier transform.
4. Sort them by size and keep the largest few: z(t) = Σ c_k e^(2πikt), each a circle of radius |c_k| turning k times per cycle.
5. Chain the circles, each starting at the rim of the one before, and trace the tip of the last one.

### The mathematics

Any closed curve can be built from circles. Write the curve as a complex number z(t) and the Fourier series says z(t) = Σ c_k e^(2πikt), where each term is a circle of radius |c_k| turning k times per cycle (backwards for negative k), and each rides on the rim of the one before it. This is the old idea of epicycles, which Ptolemy used for the planets, made exact. The program finds an outline in your picture by marching squares on a lightly blurred, half-size copy at a level chosen by the slider, preferring a long closed contour (an open one is traced there and back, so it closes). It resamples the outline at 1,024 points of equal arc length and computes all 1,024 coefficients by a direct discrete Fourier transform, once.

The coefficients are sorted by size, and the circles slider keeps the largest ones. The sum of the squares of the coefficients left out is exactly the mean-square error of the drawing (Parseval’s identity), so every extra circle adds detail in order of importance; with a handful the outline is a smooth blob, with a few hundred it is a drawing. The positions of the pen tip are worked out for 1,400 moments of the cycle, and the visible trail is the most recent part of them (the trail length slider), fading with age. With show the circles on, the chain of turning circles and their spokes is drawn from the biggest to the smallest. The period slider is the number of seconds for one full drawing.

$$
z(t)=\sum_{k}c_k\,e^{\,2\pi i\,k\,t},\qquad c_k=\frac{1}{M}\sum_{m=0}^{M-1}z_m\,e^{-2\pi i\,k\,m/M},\quad M=1024
$$
_The series and its discrete coefficients; the circle k has radius |c_k| and turns k times per cycle._

$$
\varepsilon^{2}=\frac1M\sum_{m}\big\lvert z_m-\hat z_m\big\rvert^{2}=\sum_{k\notin K}\lvert c_k\rvert^{2}
$$
_Parseval: the squared error of a drawing with the set K of kept circles._

### A short history

Ancient astronomers, among them Hipparchus and Ptolemy, explained the wandering of planets with circles on circles called epicycles. Joseph Fourier showed in 1822 that any periodic signal is a sum of waves. The mathematician John von Neumann is said to have joked that with four parameters he could fit an elephant, and in 2010 researchers did draw one with just a handful of Fourier terms. A 2019 video by Grant Sanderson of 3Blue1Brown made the picture of drawing with circles widely known.

### Where it is used

- Audio, image and video compression
- Signal analysis in physics and engineering
- Teaching the Fourier transform
- Drawing machines and animation

### Try it

- Few circles give a rough, wobbly sketch. (https://lumenary-studio.vercel.app/style/fourier-epicycles?terms=8&trail=100)
- Many circles reproduce the outline closely. (https://lumenary-studio.vercel.app/style/fourier-epicycles?terms=200&rings=false)
- A gold pen on the circles looks like an orrery. (https://lumenary-studio.vercel.app/style/fourier-epicycles?colour=gold&period=24)

### Words worth knowing

- **Epicycle:** A circle whose centre moves along the rim of another circle.
- **Fourier series:** A sum of waves or rotations that rebuilds a shape or signal.
- **Marching squares:** A method for finding contour lines on a grid.

### See also

- 143 Lissajous Curves
- 40 Oscilloscope
- 133 Spirograph

## 155  Contour Lines  ·  _still_

- **Comes from:** Cartography and surveying
- **Around:** 1700s onward
- **Works best on:** Pictures with smooth tonal shapes

### Why it looks this way

A contour line joins points of the same height, and on a map where lines crowd together the ground is steep. Reading your picture’s brightness as height turns it into a landscape and lets the same map language describe it: tight lines at sharp edges, wide gaps in the smooth parts, a heavier line at regular steps to help the eye count.

### How it works

1. Smooth the lightness by the chosen radius and treat it as a height F(x, y).
2. For each level k/n, find the line F = k/n with marching squares on cells about 1.5 px wide.
3. Find where the line crosses each cell side by interpolation: t = (level − F_a)/(F_b − F_a).
4. Chain the pieces into long polylines and draw them as smooth curves.
5. Draw every fifth line heavier as an index contour, and tint the bands between.

### The mathematics

A contour line joins the points of a landscape that have the same height. The program reads the picture’s lightness as height, F(x, y), after smoothing it by the slider’s radius, and draws the lines F = k/n for k = 1, …, n − 1, where n is the number of heights. To find a line it uses marching squares: the picture is covered by little cells (about 1.5 px wide), and the cells whose corners are partly above and partly below the level are crossed by the line. Its position on a side comes from linear interpolation, t = (level − F_a)/(F_b − F_a). The pieces are chained into long polylines and drawn as smooth quadratic curves. Where the picture changes quickly the lines crowd together, since their spacing is about 1/(n |∇F|), as on a map where the hill is steep.

Mapmakers draw every fifth or so line heavier (an index contour) and tint the bands between. Both are here: the heavier line is 1.9 times as thick, set by the heavier-line-every slider. The tint is a hypsometric ramp from green through ochre and brown to snow-white, evaluated at the middle of each band, or the picture’s own colours flattened to the band by scaling each colour by (0.55 + 0.6 b)/(0.55 + 0.6 F). Lines can be ink, brown like old maps, or the colour of the picture darkened.

$$
C_k=\Big\{\mathbf x:\ F(\mathbf x)=\tfrac{k}{n}\Big\},\qquad \Delta s\approx\frac{1}{n\,\lVert\nabla F\rVert}
$$
_The contour of height k/n and the spacing between neighbouring lines._

$$
t=\frac{\lambda-F_a}{F_b-F_a}
$$
_Where a contour crosses a cell side between corner values F_a and F_b, for the level λ (marching squares)._

$$
b=\frac{\lfloor nF\rfloor+\tfrac12}{n}
$$
_The band value that picks the tint between two lines._

### A short history

Edmond Halley published a map of lines of equal magnetic variation in 1701, among the first uses of lines of equal value. In the 1770s, during the experiment on the Scottish mountain Schiehallion, Charles Hutton used contour lines to calculate the mountain’s volume. Contours became the standard way to show relief on topographic maps in the nineteenth century.

### Where it is used

- Topographic maps and hiking guides
- Weather charts with isobars and isotherms
- Medical and engineering scans
- Decorative terrain art

### Try it

- Many levels with the picture tinting each band look like a survey map. (https://lumenary-studio.vercel.app/style/contour-lines?levels=40&fill=picture)
- Heavy smoothing turns the picture into gentle hills. (https://lumenary-studio.vercel.app/style/contour-lines?smooth=14&levels=14)
- No fill and ink lines look like a pen drawing. (https://lumenary-studio.vercel.app/style/contour-lines?fill=none&ink=ink)

### Words worth knowing

- **Contour line:** A line joining points of equal height.
- **Index contour:** A heavier line drawn at regular steps for easy reading.
- **Isoline:** Any line of equal value, such as pressure or temperature.

### See also

- 145 Warped Grid
- 140 Flow Field
- 103 Ink Wash

## 156  Poisson Stippling  ·  _still_

- **Comes from:** Sampling theory and scientific illustration
- **Around:** 1980s computer graphics
- **Works best on:** Portraits and engravings-style subjects

### Why it looks this way

Random dots clump and leave gaps, while a grid shows its rows. The eye prefers something in between: dots that are random but never too close. This is called blue noise, and it looks smooth and natural because it has no long-range pattern. Here the minimum distance shrinks in the shadows, so the dots crowd together there and thin out in the lights.

### How it works

1. Set the minimum distance r(x) = r_max − (r_max − r_min) h^γ, where h is the darkness under the point and γ the contrast.
2. Try random points, up to 4.5 times the area divided by r_min², at most 900,000 of them.
3. Keep a point only if its distance from every dot kept so far is at least the mean of the two radii.
4. Use a grid of cells r_max wide so only the nine nearest cells need checking.
5. Draw each dot in ink, sepia or the picture’s colour.

### The mathematics

Stippling makes tone from dots. Placing them at random leaves clumps and gaps that look wrong, whereas placing them on a grid shows the grid. Poisson-disk sampling is in between: dots are random, but no two are closer than a minimum distance. Here the minimum distance is not fixed but follows the picture: r(x) = r_max − (r_max − r_min) h^γ, where h is the heaviness (darkness on light paper) and γ the contrast slider. Random points are tried (up to 4.5 times the area divided by r_min², at most 900,000), and a point is kept if its distance to every dot already kept is at least the mean of the two radii, (r_p + r_q)/2. A grid of cells r_max wide means only the nine nearest cells are searched.

The result is blue noise: even in texture, with no long-range pattern. Because each dot excludes a disc of about r around it, the number of dots per unit area goes roughly as 1/r², so the density rises quickly as the spacing shrinks, and the shadows are dark. The dots are also larger in the shadows, by up to 1.95 times (1 + 0.95 h²), and their colour is black, sepia, cream on night paper or the picture’s own, darkened.

$$
r(\mathbf x)=r_{\max}-\big(r_{\max}-r_{\min}\big)\,h(\mathbf x)^{\gamma}
$$
_The local minimum spacing; h is the heaviness of the picture at x._

$$
\text{keep }\mathbf p\ \Longleftrightarrow\ \lVert\mathbf p-\mathbf q\rVert\ \ge\ \tfrac12\big(r(\mathbf p)+r(\mathbf q)\big)\quad\text{for every kept }\mathbf q
$$
_The acceptance rule of the dart throwing._

$$
\rho(\mathbf x)\propto\frac{1}{r(\mathbf x)^{2}},\qquad \rho_{\text{dot}}=r_p\,k\,\big(1+0.95\,h^{2}\big)
$$
_Approximate density of dots, and the drawn dot radius (k is the dot size slider)._

### A short history

Stippling is an old technique in pen and ink illustration, used for botany and anatomy. Robert Cook introduced stochastic sampling to computer graphics in 1986, and Don Mitchell and others developed blue noise sampling in the early 1990s. Robert Bridson published a fast algorithm in 2007. The psychologist John Yellott observed in 1983 that the receptor cells in a monkey’s eye are arranged in a similar pattern.

### Where it is used

- Pen and ink style illustration and print
- Sampling for ray tracing and image processing
- Placing trees, rocks and stars in games
- Halftoning and dithering

### Try it

- Fine spacing and small dots look like a pen drawing. (https://lumenary-studio.vercel.app/style/poisson-stippling?fine=1.5&dot=25)
- Sepia ink makes an old natural history plate. (https://lumenary-studio.vercel.app/style/poisson-stippling?colour=sepia&paper=cream)
- Higher contrast pushes more dots into the shadows. (https://lumenary-studio.vercel.app/style/poisson-stippling?gamma=180)

### Words worth knowing

- **Blue noise:** Random points with no clumps and no regular pattern.
- **Poisson-disk sampling:** Random sampling in which no two points are closer than a chosen distance.
- **Stipple:** To make tone by a pattern of dots.

### See also

- 80 Halftone
- 34 Dithering
- 135 Voronoi Mosaic

## 157  Space Colonization  ·  _still_

- **Comes from:** Computational botany
- **Around:** 2005 to 2007
- **Works best on:** Dark shapes on a light ground

### Why it looks this way

Plants compete for light, and a branch grows toward open space. The algorithm scatters food and lets branches grow toward the nearest food they can sense. When a branch reaches a morsel it eats it, so the next branch has to reach further. This is enough to make trees, roots and the veins of a leaf, and the picture decides where the food is.

### How it works

1. Scatter attractors (food), thicker where you want growth, and start a few nodes at the roots.
2. Each round, every attractor finds the nearest node within the sensing distance.
3. Every node with at least one attractor in its care grows a new node a step D away, in the direction of the sum of the unit vectors toward its attractors.
4. Remove any attractor that comes within 2.4 D of a node.
5. Stop when no attractor is influencing anything, after 900 rounds, or at 40,000 nodes, and thicken the branches near the root.

### The mathematics

In 2007 Adam Runions and colleagues described how veins in a leaf and branches in a tree can be grown by competition for space. Scatter a cloud of attractors (the food), thick where you want growth. Start a few nodes at the roots. Each round, every attractor finds the nearest node within a sensing distance (the reach slider, a share of the picture’s width), and every node with at least one attractor in its care grows a new node: a step D away in the direction of the sum of the unit vectors to its attractors, with a tiny jitter. Any attractor that comes within 2.4 D of a node is eaten. The loop ends when no attractor is influencing anything, after 900 rounds, or at 40,000 nodes.

The picture decides where the food is: an attractor is kept with probability (1 − f) + f (0.03 + 0.97 h^1.4), where h is the heaviness of the picture there, so branches grow toward the dark parts and the picture appears as the density of the network. The roots can be along the bottom, in the middle (a vein network) or all around the edge. For thickness the program counts the descendants of each node, and draws a branch with a width proportional to the square root of that count: the cross-section area then adds up at every junction, which is Leonardo da Vinci’s rule for tree branches. Each segment takes the picture’s colour.

$$
\mathbf n_v=\sum_{a\in S(v)}\frac{\mathbf a-\mathbf v}{\lVert\mathbf a-\mathbf v\rVert},\qquad \mathbf v_{\text{new}}=\mathbf v+D\,\frac{\mathbf n_v}{\lVert\mathbf n_v\rVert}
$$
_Growth of node v toward the attractors S(v) that it is nearest to (within the sensing distance)._

$$
\text{eat }\mathbf a\ \text{ if }\ \min_v\lVert\mathbf a-\mathbf v\rVert<2.4\,D
$$
_The kill distance._

$$
w_i=1.5\,w_0\sqrt{\frac{c_i}{c_{\max}}},\qquad c_i=1+\sum_{j\in\text{children}(i)}c_j
$$
_Branch width from the number c of nodes it feeds, so that areas add up at junctions._

### A short history

Adam Runions and colleagues described the venation algorithm for leaves in 2005, and Runions, Brendan Lane and Przemyslaw Prusinkiewicz extended it to trees in 2007. It has been used for procedural plants in films and games, and for modelling blood vessels, rivers, roads and lightning.

### Where it is used

- Procedural trees, roots and leaf veins
- Modelling rivers, blood vessels and road networks
- Lightning and crack effects
- Generative art

### Try it

- Roots at the bottom grow a tree upward. (https://lumenary-studio.vercel.app/style/space-colonization?root=bottom&thick=10)
- Roots on the edges grow inward like frost. (https://lumenary-studio.vercel.app/style/space-colonization?root=edges&density=100)
- A short reach makes dense, fine veins. (https://lumenary-studio.vercel.app/style/space-colonization?reach=6&step=3)

### Words worth knowing

- **Attractor:** A point of food that branches grow toward.
- **Venation:** The pattern of veins in a leaf.
- **Procedural:** Generated by rules, not drawn by hand.

### See also

- 147 L-system Trees
- 152 Differential Growth
- 151 Physarum

## 158  Boids  ·  _live_

- **Comes from:** Artificial life
- **Around:** 1986
- **Works best on:** Pictures with a dark background and bright shapes

### Why it looks this way

A flock of starlings moves as one, with no leader and no plan. Craig Reynolds showed that three rules, applied by each bird to its neighbours only, are enough to give that behaviour. Add a pull toward the light parts of a picture, and a brush for each bird, and the flock slowly paints.

### How it works

1. Give each bird a position and velocity, and let it see neighbours within 46 px at 720 px wide, found through a hash grid.
2. Separation: steer away from anything too close, growing strongly as it nears.
3. Alignment: steer toward the average heading of neighbours. Cohesion: steer toward their average position.
4. Add the gradient of the picture’s brightness, so birds climb toward light, plus a gentle push from the cursor and a little random force.
5. Clamp the speed between 0.45 and 1 times the top speed, wrap round at the edges like a torus, and paint with the colour under each bird.

### The mathematics

Craig Reynolds showed in 1986 that the flocking of birds needs no leader, only three rules that each bird applies to its neighbours: separation (steer away from those too close), alignment (steer toward their average heading) and cohesion (steer toward their average position). The program applies them to birds that see the neighbours within 46 px (at 720 px wide), found through a hash grid. Alignment has strength 1.6 times the flocking slider, cohesion 1.2 times it, and separation is a push away from anything within 0.38 of the sensing distance, growing to 220 as it nears. A little random force is added, and the speed is clamped between 0.45 and 1 times the top speed. The world wraps round like a torus.

Two forces come from the picture and from you. The pull toward light is the gradient of the picture’s normalised lightness (a Sobel gradient), times the pull slider, so birds climb toward the bright parts. The pointer attracts birds within 40% of the picture’s width, and repels them while pressed. Most of all, each bird paints. On every step it draws a line from its last position to its new one on a persistent canvas, in the colour of the picture beneath it, and the flock slowly paints the picture. The comet look fades that canvas by 14% each step so only trails remain, and shows the birds as small arrowheads. The painting is done inside the step, so the first-frame thumbnail has paint on it.

$$
\mathbf f_i=1.6\,\Phi\,(\bar{\mathbf v}-\mathbf v_i)+1.2\,\Phi\,(\bar{\mathbf x}-\mathbf x_i)+220\sum_{j:\,d_{ij}<0.38\,\rho}\Big(1-\frac{d_{ij}}{0.38\,\rho}\Big)\frac{\mathbf x_i-\mathbf x_j}{d_{ij}}
$$
_Alignment, cohesion and separation; Φ is the flocking slider, ρ the sensing distance, and the bars are averages over neighbours._

$$
\mathbf f_i\mathrel{+}=\sigma\,\nabla L(\mathbf x_i)+\text{noise},\qquad \mathbf v_i\leftarrow\mathbf v_i\,\frac{\operatorname{clip}\big(\lVert\mathbf v_i\rVert,\ 0.45\,v_{\max},\ v_{\max}\big)}{\lVert\mathbf v_i\rVert}
$$
_The pull toward light (σ the pull slider) and the speed limit._

### A short history

Craig Reynolds presented boids (bird-oid objects) in 1986 and published the paper in 1987. Flocking of this kind was used for the swarm of bats and the army of penguins in Batman Returns in 1992, and Reynolds received a Scientific and Technical Academy Award in 1998. Similar rules guide drone swarms and crowd simulations.

### Where it is used

- Crowds, flocks and schools in film and games
- Swarm robotics and drone research
- Generative painting and music visuals
- Studying collective animal behaviour

### Try it

- Comet mode shows each bird as a bright streak. (https://lumenary-studio.vercel.app/style/boids?look=comet&count=900)
- A tight flock swirls into dense clouds. (https://lumenary-studio.vercel.app/style/boids?flock=90&speed=60)
- Strong pull toward light paints the bright shapes first. (https://lumenary-studio.vercel.app/style/boids?seek=90&size=2)

### Words worth knowing

- **Boid:** A simulated bird-like agent following simple flocking rules.
- **Separation, alignment, cohesion:** The three rules of flocking.
- **Torus:** A world that wraps round, so leaving one side re-enters the other.

### See also

- 130 Particles
- 151 Physarum
- 140 Flow Field

## 159  Domain Warp  ·  _live_

- **Comes from:** Procedural graphics
- **Around:** 2002 onward
- **Works best on:** Photographs with colour and texture

### Why it looks this way

Instead of asking the picture for the colour at a pixel’s own place, ask for the colour at a place that noise has moved it to. Do it again to the noise itself and the result folds back on itself like marbled paper or ink in water. A small amount of bending only wobbles the picture, and a larger amount turns it into smoke.

### How it works

1. For each pixel at p, compute a displacement d(p) from fractal noise and read the picture at p + d(p).
2. With one layer, d is the noise q = (fbm(p), fbm(p + c₁)).
3. With two layers, evaluate the noise again at a point q has moved: r = (fbm(p + 4q + c₂), fbm(p + 4q + c₃)). With three, repeat once more.
4. Compute the field on a coarse lattice of 5 px cells at half size and interpolate it bilinearly to stay fast.
5. Let time slowly shift the noise to animate it, and shade the folds for depth.

### The mathematics

Domain warping is a technique popularised by Inigo Quilez: rather than computing a value f(p) of noise, compute it at a point that noise has moved, f(p + h(p)). Here the idea is turned toward a picture. Each pixel asks the picture for its colour not at its own place but at a displaced one, x + d(x), and the displacement d is made from fractal noise. With one layer d is the noise q = (fbm(p), fbm(p + c₁)). With two layers the noise is evaluated again at a point that q has moved, r = (fbm(p + 4q + c₂), fbm(p + 4q + c₃)). With three layers the process is repeated once more. Each warp feeds into the next, which gives the folded, marbled flow. The fractal noise fbm is a normalised sum of three octaves with amplitudes ½, ¼, ⅛.

To keep the animation fast the field is computed on a coarse lattice of 5 px cells, at half the size of the picture, and interpolated bilinearly. Time slowly shifts the offsets c in different directions, so the folds drift, and the pointer smoothly moves the noise’s origin, so you can steer the pattern. A lookup that would leave the picture is mirrored back in, so it never runs out. The shading adds a little light and dark following the noise value itself, k = 1 + s (f − ½) × 0.9, which makes the folds look like dyed marbling.

$$
\mathbf q=\big(\operatorname{fbm}(\mathbf p),\ \operatorname{fbm}(\mathbf p+\mathbf c_1)\big),\qquad \mathbf r=\big(\operatorname{fbm}(\mathbf p+4\mathbf q+\mathbf c_2),\ \operatorname{fbm}(\mathbf p+4\mathbf q+\mathbf c_3)\big)
$$
_Two layers of warping; a third repeats the step with r in place of q._

$$
C(\mathbf x)=k\;I\Big(\mathbf x+2A\,\big(\mathbf w-\tfrac12\big)\,W_h\Big),\qquad k=1+0.9\,s\,\big(f-\tfrac12\big)
$$
_The warped lookup: w is the last layer’s noise, A = 0.34 × the amount slider, W_h the width of the working picture, f the noise value that shades the folds and s the shading slider._

### A short history

Inigo Quilez popularised domain warping in shader programming in the early 2000s, building on Ken Perlin’s noise function of 1983, for which Perlin received an Academy Award in 1997. The visual result is close to the old craft of marbling paper, such as Japanese suminagashi and Turkish ebru.

### Where it is used

- Procedural textures for skies, marble and terrain
- Shader art and music visuals
- Backgrounds and animated wallpapers
- Image distortion effects in video

### Try it

- Three layers give deep, marbled folds. (https://lumenary-studio.vercel.app/style/domain-warp?layers=3&amount=70)
- A small amount gently ripples the picture like water. (https://lumenary-studio.vercel.app/style/domain-warp?amount=15&layers=1)
- Slow speed and big swirls feel like drifting smoke. (https://lumenary-studio.vercel.app/style/domain-warp?speed=15&scale=80)

### Words worth knowing

- **Noise:** Smooth random values used to create natural looking variation.
- **fbm:** Fractal Brownian motion, a sum of noise at several scales.
- **Displacement:** Moving a point from where it is to somewhere else.

### See also

- 67 Liquid morph
- 165 Ink in Water
- 163 Heat Haze

## 160  Ridgeline  ·  _still_

- **Comes from:** Pulsar astronomy and album art
- **Around:** The pulsar plot of 1970; the album sleeve of 1979
- **Works best on:** Pictures with a bright subject on a dark or plain ground

### Why it looks this way

A stack of lines, each lifted where the picture is bright, gives the strongest sense of a hill from the least ink. Because every line hides those behind it, the eye does the rest: it reads the bumps as a surface with a light on it, and fills in the face. It is about the cheapest way to draw a shape, and it is why the pulsar plot looked like a mountain range.

### How it works

1. Blur the picture so that a ridge follows shapes and not noise.
2. Space horizontal baselines evenly down the picture.
3. Lift each baseline, point by point, by the brightness of the picture beneath it.
4. Fill below each line with the background colour, so that it hides the lines behind it.
5. Stroke the line, with a soft glow, in white, amber, green or the picture’s own colours.

### The mathematics

With n lines, the spacing is d = (H - 2m) / (n + a), where m is the margin (5% of the width) and a is the height of the ridges in line spacings (0.5 to 9). Line i has its baseline at y_i = m + a d + i/(n - 1) (H - 2m - a d). Along the line, at columns whose spacing shrinks as the detail slider rises, the point is lifted by a d b^1.12, where b is the brightness of the picture beneath it after two box blurs of radius 0.42 d (or 1 - b if the ridges should rise where the picture is dark). Lines further back are drawn narrower by the factor lerp(1 - 0.42 P, 1, i/(n - 1)), with P the perspective slider.

The lines are drawn from the back, the top, to the front. Each one is first filled down to the bottom of the picture with the background colour, which is the whole of the hidden-line removal: anything drawn earlier, and now lower on the page, disappears. The line is then stroked, with a wider, fainter copy beneath it for the glow. For the picture’s own colours the stroke is a horizontal gradient whose stops are the blurred colour of the picture at the line’s row, brightened until the strongest channel reaches 255.

$$
y_i(x)=y_i^{0}-a\,d\,b(x,y_i^{0})^{1.12},\qquad d=\frac{H-2m}{n+a}
$$
_The height of line i: b is the blurred brightness, a the ridge height in line spacings and n the number of lines._

$$
k_i=(1-0.42\,P)+0.42\,P\,\frac{i}{n-1},\qquad x_i=c_x+(x-c_x)\,k_i
$$
_Perspective: lines further back are drawn narrower about the centre c_x._

### A short history

In 1967 Jocelyn Bell Burnell found the first pulsars, and in 1970 the astronomer Harold Craft plotted successive pulses of the pulsar CP 1919 as stacked lines, each hiding those behind it. The picture appeared in the Cambridge Encyclopaedia of Astronomy (1977), and in 1979 the designer Peter Saville used it, as white on black, for Joy Division’s album Unknown Pleasures. It has been copied ever since. The method itself, a hidden-line plot, goes back to the first computer graphics of the 1960s.

### Where it is used

- Album and poster art
- Portraits in a single colour
- Data art and science posters
- T-shirts and prints

### Try it

- Fewer, taller ridges on black look like the original pulsar plot. (https://lumenary-studio.vercel.app/style/ridgeline?lines=60&relief=400&ink=white)
- Black ink on paper with the hidden lines left showing gives an engraved look. (https://lumenary-studio.vercel.app/style/ridgeline?ink=paper&hidden=false&glow=0)
- The picture’s own colours with some perspective make a glowing landscape. (https://lumenary-studio.vercel.app/style/ridgeline?ink=picture&persp=70)

### Words worth knowing

- **Hidden-line removal:** Drawing a 3D shape so that lines behind a nearer surface are not shown.
- **Baseline:** The flat line a ridge would lie on if the picture beneath it were completely dark.
- **Polyline:** A line made of many short straight segments joined end to end.

### See also

- 40 Oscilloscope
- 155 Contour Lines
- 28 Wireframe 3D

## 161  Photomosaic  ·  _still_

- **Comes from:** Computer graphics and mosaic art
- **Around:** Photomosaic software of the 1990s
- **Works best on:** Pictures with a variety of colours; faces and landscapes

### Why it looks this way

Seen from far away the picture is one thing; seen up close it is made of hundreds of others. The eye blends whatever is smaller than it can resolve, so a tile needs only the right average colour to disappear into the whole, while keeping enough detail of its own to reward a closer look. Here the tiles are pieces of the same photograph, so the picture is built out of itself.

### How it works

1. Cut the picture into pieces at four sizes, and add a mirrored copy of each.
2. Describe every piece by the average colour of its four quarters and of the whole.
3. Describe every cell of the grid in the same way, from the picture itself.
4. Pick for each cell the piece with the nearest description, with a growing penalty for pieces already used, and never the same as a neighbour.
5. Shift the tile’s colours towards what the cell needs, a little less in the darkest and lightest cells, and lay it down with a small gap.

### The mathematics

Each tile and each cell of the grid is described by a signature of 15 numbers: the mean red, green and blue of its four quarters, and of the whole. The library holds square crops at four sizes, 0.11, 0.17, 0.26 and 0.4 of the picture’s short side, at positions on a jittered grid, together with a mirrored copy of each. For a cell, the cost of tile t is D(t) = the sum of (s_cell - s_t)^2 over the first 12 numbers (the four quarters) + 0.35 lambda u_t, where u_t is the number of times t has been used and lambda rises from 1 to 1401 with the variety slider. The cheapest tile wins, except that it can never be the tile to the left or the one above.

The tile is then fitted to its cell. Its pixels v are moved towards the cell’s mean colour m_c: v' = (1 - k) v + k (m_c + delta (v - m_t)), where m_t is the tile’s own mean, k is the colour match slider, and delta = 0.38 + 0.62 (1 - |l - 128| / 128) keeps less detail in very dark and very light cells, where a real print would have little contrast. At k = 1 every tile has exactly the average colour of its cell, and detail is all that remains of the original tile. The gap, up to 10% of a cell on each side, shows the grout.

$$
D(t)=\sum_{q=1}^{12}\big(\sigma_q^{\text{cell}}-\sigma_q^{t}\big)^{2}+0.35\,\lambda\,u_t,\qquad \lambda=1+1400\,V
$$
_The cost of using tile t in a cell: u_t is how often it is already used and V is the variety slider (0 to 1)._

$$
v'=(1-k)\,v+k\,\big(m_c+\delta\,(v-m_t)\big)
$$
_Colour fitting: v is a tile pixel, m_t the tile’s mean, m_c the cell’s mean and k the colour match._

$$
\delta=0.38+0.62\Big(1-\frac{|\ell-128|}{128}\Big)
$$
_How much of the tile’s own detail is kept, by the brightness l of the cell._

### A short history

Mosaics of small stones, called tesserae, are thousands of years old, and the Romans and Byzantines used tiny coloured pieces to make pictures that read from across a hall. The photographic version came in the 1990s: in 1993 Robert Silvers, then at MIT, developed software that built a picture from many small photographs, and mosaic posters made of family snapshots were familiar by the end of the decade. The matching step is a nearest-neighbour search, now used all over computing.

### Where it is used

- Posters and wedding gifts
- Brand walls and event backdrops
- Memory collages from a photo album
- Large prints seen from far and near

### Try it

- More tiles with a thin gap give the effect of a screen. (https://lumenary-studio.vercel.app/style/photomosaic?tiles=90&gap=2)
- Tiles that each show the whole picture make a classic mosaic of copies. (https://lumenary-studio.vercel.app/style/photomosaic?from=whole&tiles=40)
- A low colour match keeps the tiles’ own colours and shows more of each small picture. (https://lumenary-studio.vercel.app/style/photomosaic?match=35&mix=80)

### Words worth knowing

- **Tessera:** One small piece of stone, glass or tile in a mosaic.
- **Nearest neighbour:** The item in a collection whose description is closest to a given one.
- **Signature:** The short list of numbers, here average colours, that stands for a tile when matching.

### See also

- 135 Voronoi Mosaic
- 193 Byzantine Mosaic
- 134 Hexagon Mosaic

