# Primitives vocabulary — Lumenary process library

Built 2026-11-22. Vocabulary v1 was frozen before any of the 610 equations was tagged. It came from three sources, in this order:

1. **Seed, foundation pages** — the six Lumenary foundation pages (`foundations.json`): brightness and resampling, smoothing and edges, interpolation and easing, seeded randomness and noise, tone curves and colour spaces, compositing.
2. **Seed, shared helpers** — the helper functions in `src/engine/` (`utils.js`, `helpers.js`, `culture.js`, `toon.js`, `retro.js`, `history.js`), read from source.
3. **Sample** — the equations of 43 models read before the freeze, spread over every class: makli-carving, indus-seal (carving); chinese-paper-cut (cutting); pixel-art, dithering, glitch, duotone (digital); pencil-hatching, kolam, poisson-stippling (drawing); ajrak, batik (dyeing); voronoi-mosaic, flow-field, contour-lines, girih, low-poly (geometric); stained-glass (glass); hala-blue-pottery, greek-vase (glaze); byzantine-mosaic (inlay); hala-lacquerware (lacquer); snowfall (motion); bokeh, anaglyph-3d, scanlines-crt (optical-device); embossed-leather (other); madhubani, watercolour, oil-impasto (painting); cyanotype, film-grain (photographic); mughal-jali (piercing); halftone, risograph, linocut, banknote-engraving (printing); cross-stitch, phulkari, sindhi-mirror-embroidery (stitch); bauhaus, neo-brutalism (style); kente (weaving). An operation entered v1 from the sample when it recurred in two or more sample models.

Operations seen in only one sample model were held as **candidates** and not put in v1: error diffusion, CMYK separation, Delaunay triangulation, Lloyd relaxation, scanlines, cylindrical shading, specular highlight, mirror-symmetry fold, parametric curves, particle motion, easing toward a target, depth layers, drop shadow, ragged sheet edge, unsharp mask, rounded-thread shading, pentagrid. After the freeze a primitive could be added only if tagging showed three or more models applying it; each addition is listed at the end with its reason.

**Tagging rule used throughout.** An equation is tagged with a primitive when the equation itself performs that operation. A quantity that merely arrives as an input (a blurred brightness `L_b`, an edge strength `E` named in the note) does not make the equation apply blur or Sobel. When one primitive is by definition built from another and both are present (an edge outline is a thresholded Sobel magnitude), only the more specific one is tagged.

**Shared** means applied by three or more distinct models in `equation-tags.tsv`. The counts are in `primitives-summary.md`.

---

## Vocabulary v1 (frozen before tagging)

### luminance
**Name:** brightness from RGB (Rec. 709 weights)
**Plain words:** turns a colour into one number for how bright it is, weighting green most and blue least.
**Maths:** $L=\dfrac{0.2126R+0.7152G+0.0722B}{255}$ — foundation *Pixels, brightness and resampling*.
**Helpers:** `lumOf`, `lumArray`, `pixels`.
**Entered:** v1 (seed, foundation).

### coarse-grid
**Name:** coarse-grid sampling (pixelate: each cell is the average of its patch)
**Plain words:** shrinks the picture to a small grid by repeated halving, so each cell, dot, letter or stitch carries the average colour of the patch it stands for.
**Maths:** $p'_{x,y}=\tfrac14\left(p_{2x,2y}+p_{2x+1,2y}+p_{2x,2y+1}+p_{2x+1,2y+1}\right)$, repeated; a cell's colour $\bar P_{ij}$ is the mean over the cell — foundation *Pixels, brightness and resampling*.
**Helpers:** `scaleCanvas`, `sampleImage`, `fitSize`; `sampler` (smoothed colour looked up at a cell centre).
**Entered:** v1 (seed, foundation).

### image-gradient
**Name:** Sobel gradient (edge strength and direction)
**Plain words:** measures how fast brightness changes at each pixel and in which direction; large on outlines, near zero on flat areas.
**Maths:** $G_x=\begin{bmatrix}-1&0&1\\-2&0&2\\-1&0&1\end{bmatrix}*L,\ G_y=G_x^{\mathsf T}*L,\ \lvert\nabla L\rvert=\tfrac14\sqrt{G_x^2+G_y^2},\ \theta=\operatorname{atan2}(G_y,G_x)$ — foundation *Smoothing and finding edges*.
**Helpers:** `sobel`.
**Entered:** v1 (seed, foundation).

### blur
**Name:** box or Gaussian blur
**Plain words:** replaces each pixel by the average of a window around it, separably along rows then columns; repeating a box blur approaches a Gaussian.
**Maths:** $B(x)=\frac{1}{2r+1}\sum_{i=-r}^{r}L(x+i)$ — foundation *Smoothing and finding edges*.
**Helpers:** `boxBlur`, `blur2`, `blurredL`, `blurRGB`, `sampler`.
**Entered:** v1 (seed, foundation).

### bilinear-sample
**Name:** bilinear interpolation
**Plain words:** reads a value between pixels by blending the four neighbours by closeness.
**Maths:** $f(s,t)=(1-s)(1-t)a+s(1-t)b+(1-s)tc+std$ — foundation *Interpolation and easing*.
**Helpers:** `bilinear`, `bilinearRGB`.
**Entered:** v1 (seed, foundation).

### soft-threshold
**Name:** smoothstep threshold
**Plain words:** turns a value into a 0-to-1 mask with a soft edge between two limits, instead of a hard cut.
**Maths:** $S(x)=3u^2-2u^3,\ u=\operatorname{clamp}\!\left(\frac{x-a}{b-a},0,1\right)$ — foundation *Interpolation and easing*.
**Helpers:** `smoothstep`.
**Entered:** v1 (seed, foundation).

### seeded-random
**Name:** seeded random numbers and coordinate hashes
**Plain words:** reproducible random numbers: a seeded generator for sequences, and a hash of the pixel or cell coordinates for randomness tied to a place.
**Maths:** $s_{n+1}=(s_n+\mathrm{0x6D2B79F5})\bmod 2^{32}$ (mulberry32); $h(x,y,s)\in[0,1)$ integer hash — foundation *Seeded randomness and noise*.
**Helpers:** `rng`, `hash2`.
**Entered:** v1 (seed, foundation).

### smooth-noise
**Name:** seeded value noise and fBm
**Plain words:** smooth, cloud-like variation made by blending random values on a lattice with smoothstep; fBm adds several octaves at doubling frequency and halving weight.
**Maths:** $N(x,y)=\operatorname{lerp}(\operatorname{lerp}(h_{00},h_{10},u),\operatorname{lerp}(h_{01},h_{11},u),v)$, $u=3x_f^2-2x_f^3$; $\operatorname{fbm}=\sum_i 2^{-i}N(2^i\mathbf x)\big/\sum_i 2^{-i}$ — foundation *Seeded randomness and noise*; `fbm` in `helpers.js`.
**Helpers:** `vnoise`, `fbm`.
**Entered:** v1 (seed, foundation).

### tone-curve
**Name:** tone curve (contrast about mid-grey, gamma, toe and shoulder)
**Plain words:** remaps brightness through a monotone curve: steeper or flatter about mid-grey, a power (gamma) that moves the midtones, or a film-like toe and shoulder.
**Maths:** $L'=\operatorname{clamp}\big((L-\tfrac12)f+\tfrac12\big),\ f=\tan\frac{(c+1)\pi}{4}$; $L'=L^{\gamma}$ — foundation *Tone curves and colour spaces*.
**Helpers:** `contrast`.
**Entered:** v1 (seed, foundation).

### saturation-adjust
**Name:** saturation and lightness change (via HSL or toward grey)
**Plain words:** makes colours more or less colourful without changing their brightness much, by scaling saturation in hue-saturation-lightness, or by mixing toward the pixel's own grey.
**Maths:** $(h,s,l)\mapsto\big(h,\operatorname{clamp}(k\,s+b),\ l+\Delta l\big)$; $\mathbf c'=l+k(\mathbf c-l)$ — foundation *Tone curves and colour spaces*.
**Helpers:** `rgb2hsl`, `hsl2rgb`, `vivid`.
**Entered:** v1 (seed, foundation).

### palette-snap
**Name:** palette snap by colour distance (redmean or weighted RGB)
**Plain words:** replaces a colour by the nearest colour in a fixed list (inks, flosses, tiles, pigments), nearness measured by a perceptually weighted distance.
**Maths:** $k=\arg\min_j d(\mathbf c,\mathbf p_j)$, redmean $d=(2+\tfrac{\bar r}{256})\Delta R^2+4\Delta G^2+(2+\tfrac{255-\bar r}{256})\Delta B^2$ — foundation *Tone curves and colour spaces*; `nearest`.
**Helpers:** `nearest`, `paletteIdx`, `matchPalette`.
**Entered:** v1 (seed, foundation and helper).

### mix-over
**Name:** lay a colour over the base by coverage ("over" / lerp)
**Plain words:** puts a layer of colour (a line, a wash, a dye) over what is there, with a coverage or opacity between 0 and 1.
**Maths:** $C_{\text{out}}=\alpha C_{\text{src}}+(1-\alpha)C_{\text{dst}}$, equivalently $C\leftarrow C+\alpha(C_{\text{src}}-C)$ — foundation *Tone curves and colour spaces*.
**Helpers:** `mix`.
**Entered:** v1 (seed, foundation).

### additive-blend
**Name:** additive light blend ("lighter", screen)
**Plain words:** adds light: overlapping layers get brighter, as glowing light or projected light does.
**Maths:** $C=\min(255,\ C_{\text{dst}}+C_{\text{src}})$; screen $C=1-(1-a)(1-b)$ — foundation *Compositing, speed and export*.
**Helpers:** `glowDraw` (lighter), `bloom` (screen).
**Entered:** v1 (seed, foundation).

### multiply-blend
**Name:** multiply blend (transparent inks, pigment darkening)
**Plain words:** each layer can only darken what is under it, like transparent inks or watercolour on paper.
**Maths:** $C=C_{\text{dst}}\cdot C_{\text{src}}/255$; $C=C_{\text{paper}}\prod_k(1-\text{cov}_k(1-I_k))$ — foundation *Compositing, speed and export*.
**Helpers:** none (canvas `multiply`).
**Entered:** v1 (seed, foundation).

### mask-clip
**Name:** keep the picture only inside a mask (destination-in)
**Plain words:** shows one layer only where another shape is, as letters filled with the photo.
**Maths:** $C=C_{\text{src}}\cdot M$, $M\in\{0,1\}$ or $[0,1]$ — foundation *Compositing, speed and export*.
**Helpers:** none (canvas `destination-in`).
**Entered:** v1 (seed, foundation).

### colour-ramp
**Name:** gradient map (tone to colour along stops)
**Plain words:** colours a tone value by sliding along a short list of colours, dark stop to light stop.
**Maths:** $f=t\,n,\ i=\lfloor f\rfloor,\ C=\mathbf s_i+(f-i)(\mathbf s_{i+1}-\mathbf s_i)$ — `ramp` in `helpers.js`.
**Helpers:** `ramp`.
**Entered:** v1 (seed, helper).

### kmeans-palette
**Name:** k-means colour clustering
**Plain words:** finds the k colours that best summarise the picture by repeatedly assigning pixels to the nearest centre and moving each centre to the mean of its pixels.
**Maths:** $\mu_c\leftarrow\frac{1}{|S_c|}\sum_{\mathbf p\in S_c}\mathbf p,\ S_c=\{\mathbf p: c=\arg\min_j\lVert\mathbf p-\mu_j\rVert\}$ — `kmeans` in `helpers.js`.
**Helpers:** `kmeans`, `paletteOf`.
**Entered:** v1 (seed, helper).

### grain-overlay
**Name:** film or paper grain overlay
**Plain words:** adds fine random brightness noise, sometimes with a slow mottling, over the finished picture.
**Maths:** $C\leftarrow C+A\big(0.7(N-\tfrac12)+0.5(h-\tfrac12)\big)$ — `grain` in `culture.js`; `addGrain` in `helpers.js`.
**Helpers:** `addGrain`, `grain`.
**Entered:** v1 (seed, helper).

### vignette
**Name:** vignette (radial darkening toward the corners)
**Plain words:** darkens the picture toward its edges with a radial gradient.
**Maths:** $\alpha(r)=s\cdot\operatorname{ramp}\big(\tfrac{r-0.3\min(W,H)}{0.55\,\mathrm{hyp}-0.3\min(W,H)}\big)$ — `vignette` in `helpers.js`.
**Helpers:** `vignette`.
**Entered:** v1 (seed, helper).

### auto-levels
**Name:** levels stretch (clip the darkest and lightest 2 %)
**Plain words:** stretches brightness so the darkest few percent become black and the lightest few percent white.
**Maths:** $L'=\operatorname{clamp}\big((L-q_{0.02})/(q_{0.98}-q_{0.02})\big)$ — `stretch` in `helpers.js`.
**Helpers:** `stretch`, `stretchedL`.
**Entered:** v1 (seed, helper).

### relief-shading
**Name:** relief shading from a height map and a light direction
**Plain words:** treats a height map as a surface, takes its slope at each point, and lights it from one direction, darkening hollows below their surroundings.
**Maths:** $\mathbf s=-k\nabla H,\ \mathbf n=\frac{(s_x,s_y,1)}{\sqrt{s_x^2+s_y^2+1}},\ f=\operatorname{clamp}(a+b\,(\mathbf s\cdot\mathbf l))(1-\mathrm{ao}),\ \mathrm{ao}=\operatorname{clamp}(2.4(\bar H-H))$ — `slopes` in `helpers.js`, `carvedStone` in `culture.js`; first seen in makli-carving, embossed-leather, oil-impasto.
**Helpers:** `slopes`, `carvedStone`.
**Entered:** v1 (seed, helper).

### voronoi-cells
**Name:** Voronoi / Worley cells (nearest seed)
**Plain words:** scatters seed points and gives every pixel to its nearest seed, so the picture breaks into cells; the distance to the seed gives each cell a dome or a centre.
**Maths:** $\lambda(\mathbf x)=\arg\min_i\lVert\mathbf x-\mathbf s_i\rVert,\ F_1=\min_i\lVert\mathbf x-\mathbf s_i\rVert$ — `cellular`, `voronoiLabels` in `helpers.js`.
**Helpers:** `cellular`, `voronoiLabels`.
**Entered:** v1 (seed, helper).

### crackle-network
**Name:** crackle network (cell borders where F2 − F1 is small)
**Plain words:** draws the borders between Voronoi cells as a net of thin lines: cracks in glaze or wax, lead between glass pieces, creases in leather.
**Maths:** $g=F_2(\mathbf x)-F_1(\mathbf x),\ \text{line where } g<w$ — `cellular` in `helpers.js` (returns $F_1,F_2$); first seen in batik, greek-vase, hala-blue-pottery, stained-glass, embossed-leather.
**Helpers:** `cellular`.
**Entered:** v1 (seed, helper; sample).

### iso-contours
**Name:** contour lines by marching squares
**Plain words:** traces the lines where a smooth field crosses chosen levels, like contour lines on a map.
**Maths:** $C_k=\{\mathbf x:F(\mathbf x)=\lambda_k\},\ t=\frac{\lambda-F_a}{F_b-F_a}$ — `marching`, `chainSegments` in `helpers.js`.
**Helpers:** `marching`, `chainSegments`.
**Entered:** v1 (seed, helper).

### mode-filter
**Name:** majority (mode) filter
**Plain words:** each pixel takes the most common colour label in a small window, which removes specks and rounds corners of flat regions.
**Maths:** $\lambda'(\mathbf x)=\arg\max_k\#\{\mathbf y\in N_r(\mathbf x):\lambda(\mathbf y)=k\}$ — `modeFilter` in `culture.js`.
**Helpers:** `modeFilter`.
**Entered:** v1 (seed, helper).

### dilate
**Name:** morphological dilation
**Plain words:** grows a 0/1 mask outward by r pixels.
**Maths:** $m'(\mathbf x)=\max_{\lVert\mathbf y-\mathbf x\rVert_\infty\le r}m(\mathbf y)$ — `dilate` in `culture.js`.
**Helpers:** `dilate`, `edgeMask`.
**Entered:** v1 (seed, helper).

### label-boundary
**Name:** outlines between flat colour regions
**Plain words:** draws a line wherever two neighbouring pixels belong to different colour regions, stronger where the two colours differ more.
**Maths:** $e(\mathbf x)=[\lambda(\mathbf x)\ne\lambda(\mathbf x+\mathbf e_x)\ \vee\ \lambda(\mathbf x)\ne\lambda(\mathbf x+\mathbf e_y)]$ — `edgeMask` in `culture.js`, `shapeLines` in `toon.js`.
**Helpers:** `edgeMask`, `shapeLines`.
**Entered:** v1 (seed, helper).

### edge-outline
**Name:** outlines from an edge detector (blur, Sobel, threshold)
**Plain words:** draws ink where edge strength is high: blur the brightness, take the Sobel magnitude, softly threshold it.
**Maths:** $\alpha=\operatorname{smoothstep}\big(\vartheta,\,2.2\vartheta,\,\lvert\nabla(B_r*L)\rvert\big)$ — `edgeCanvas` in `helpers.js`; foundation *Smoothing and finding edges*.
**Helpers:** `edgeCanvas`.
**Entered:** v1 (seed, helper and foundation).

### glow-bloom
**Name:** glow / bloom (blurred copy added or screened over)
**Plain words:** makes bright things glow by adding a shrunk-and-enlarged (blurred) copy of them on top.
**Maths:** $C\leftarrow C\oplus a\cdot\operatorname{up}\big(\operatorname{down}_k(C)\big)$, $\oplus$ = lighter or screen — `glowDraw` in `helpers.js`, `bloom` in `toon.js`.
**Helpers:** `glowDraw`, `bloom`.
**Entered:** v1 (seed, helper).

### bilateral-smooth
**Name:** edge-preserving smoothing (separable bilateral filter)
**Plain words:** evens out flat areas while keeping outlines, by averaging only neighbours of similar colour.
**Maths:** $\mathbf c'(\mathbf x)=\frac{\sum_{\mathbf y}w\,\mathbf c(\mathbf y)}{\sum_{\mathbf y}w},\ w=e^{-\lVert\mathbf c(\mathbf y)-\mathbf c(\mathbf x)\rVert_1^2/2s^2}$ — `smoothKeepEdges` in `toon.js`.
**Helpers:** `smoothKeepEdges`, `flatten`.
**Entered:** v1 (seed, helper).

### palette-remap
**Name:** dress a derived palette in a fixed colour set, keeping tonal order
**Plain words:** gives each colour of the picture's own palette a different colour from a fixed set (crayons, wool) so dark stays dark and hues stay close.
**Maths:** $\text{cost}(i,j)=\lvert l_j-l^{*}_i\rvert+420\,\Delta h\,\min(s,0.6)\min(1,2.5s_j)+40\lvert s-s_j\rvert$, greedy assignment — `dress` in `toon.js`.
**Helpers:** `dress`.
**Entered:** v1 (seed, helper).

### dog-lines
**Name:** dark lines by difference of blurs
**Plain words:** finds thin dark features and the dark side of edges by subtracting a fine blur from a wide one.
**Maths:** $D=B_{\text{wide}}*L-B_{\text{fine}}*L$ — `darkLines` in `toon.js`.
**Helpers:** `darkLines`.
**Entered:** v1 (seed, helper).

### bright-spot-pick
**Name:** pick the brightest well-separated spots
**Plain words:** chooses the n brightest points that lie at least a gap apart.
**Maths:** greedy pick of local maxima of $L$ with $\lVert\mathbf p_i-\mathbf p_j\rVert\ge g$ — `brightSpots` in `toon.js`.
**Helpers:** `brightSpots`.
**Entered:** v1 (seed, helper).

### ordered-dither
**Name:** ordered (Bayer) dithering
**Plain words:** adds a fixed, position-dependent offset from a small threshold matrix before rounding to a palette, which turns gradients into a regular pattern of two shades.
**Maths:** $c'=c+\big(B_{x\bmod 4,\,y\bmod 4}-\tfrac12\big)A$, $M_{2n}=\begin{bmatrix}4M_n&4M_n+2\\4M_n+3&4M_n+1\end{bmatrix}$ — `bayer`, `dither` in `retro.js`; seen in pixel-art, dithering.
**Helpers:** `bayer`, `dither`.
**Entered:** v1 (seed, helper; sample).

### material-ground
**Name:** procedural material ground (cloth, wood, stone)
**Plain words:** paints a background material: two colours mixed by slow fractal noise with fine grain, and for cloth a fine sine weave, for wood long streaks and growth lines.
**Maths:** $C=\big(\mathbf a+(\mathbf b-\mathbf a)\operatorname{fbm}(\mathbf x/s)\big)\big(1+w\sin\tfrac{\pi x}{p}\sin\tfrac{\pi y}{p}+\epsilon\,(h-\tfrac12)\big)$ — `clothFill`, `woodFill`, `carvedStone` in `culture.js`.
**Helpers:** `clothFill`, `woodFill`, `carvedStone`.
**Entered:** v1 (seed, helper).

### star-rosette-motif
**Name:** radial motif: star, polygon, rosette, petal
**Plain words:** draws a shape whose radius depends on the angle around a centre: an n-pointed star, a regular polygon, a ring of petals.
**Maths:** $r(\theta)=\frac{R_1p_y}{p_y\cos t-p_x\sin t},\ t=\operatorname{fold}(\theta)$; vertices $\mathbf c+\rho_j(\cos(\theta_0+\tfrac{2\pi j}{m}),\sin(\theta_0+\tfrac{2\pi j}{m}))$ — `starRadius`, `starPoints` in `culture.js`.
**Helpers:** `starRadius`, `starPoints`, `poly`, `rosette`, `leaf`.
**Entered:** v1 (seed, helper; sample ajrak, mughal-jali, makli-carving, bokeh).

### variable-width-stroke
**Name:** ribbon: a stroke of changing width along a path
**Plain words:** draws a filled shape along a path whose width varies, as a brush or burin swells and thins.
**Maths:** $\mathbf A_i=\mathbf p_i-\tfrac{w(t_i)}{2}\mathbf n_i,\ \mathbf B_i=\mathbf p_i+\tfrac{w(t_i)}{2}\mathbf n_i$ — `ribbon` in `culture.js`.
**Helpers:** `ribbon`.
**Entered:** v1 (seed, helper).

### frame-history
**Name:** ring of past frames (time buffer)
**Plain words:** keeps the last few frames of a video so a treatment can look back in time, compare, or take the median.
**Maths:** $F_{t-a}$ from a ring of $n$ frames; $\operatorname{med3}(a,b,c)$ — `history.js`.
**Helpers:** `makeRing`, `readFrame`, `med3`.
**Entered:** v1 (seed, helper).

### pixel-glyphs
**Name:** hard-pixel text and sprites
**Plain words:** draws text or small pictures as hard-edged square pixels.
**Maths:** $\alpha'=[\alpha>110]$ — `pixelText`, `sprite` in `retro.js`.
**Helpers:** `pixelText`, `sprite`.
**Entered:** v1 (seed, helper).

### tone-line-screen
**Name:** line screen whose line width follows tone (hatching, engraving, linocut)
**Plain words:** covers the picture with parallel lines (straight, wavy or wandering) whose thickness grows where the picture is darker; several layers at different angles give cross-hatching.
**Maths:** $u=\frac{x\cos\theta+y\sin\theta}{s}+\text{wobble},\ f=u-\lfloor u\rfloor,\ \text{ink}=\big[\lvert 2f-1\rvert<w(d)\big]$ — first seen in linocut, pencil-hatching, banknote-engraving, indus-seal, chinese-paper-cut.
**Helpers:** none shared.
**Entered:** v1 (sample).

### tone-dot-lattice
**Name:** dot lattice whose dot area follows tone (halftone screen)
**Plain words:** a grid of dots, often rotated, where each dot's area is proportional to the ink the picture needs there.
**Maths:** $\mathbf p_{ij}=\mathbf c+sR(\theta)\binom{i}{j},\ r=\tfrac12 s\sqrt{\text{ink}}\ \ (\pi r^2\propto\text{ink})$ — first seen in halftone.
**Helpers:** none shared.
**Entered:** v1 (sample; named in the brief).

### lattice-repeat
**Name:** repeat on a lattice (square, brick or hexagonal cells)
**Plain words:** splits the plane into repeating cells and works in each cell's own coordinates, to place a motif or a pattern in every cell: dots, stripes, rings, stars.
**Maths:** $\mathbf u=\operatorname{frac}(\mathbf x/q)-\tfrac12$; brick/hex rows $\mathbf p_{ij}=(is+\tfrac s2(j\bmod2),\ j\tfrac{\sqrt3}{2}s)$; hex cube coordinates rounded to a triple summing to 0 — first seen in madhubani, batik, kolam, sindhi-mirror-embroidery, mughal-jali, kente.
**Helpers:** none shared.
**Entered:** v1 (sample).

### tone-bands
**Name:** posterize into tone bands (thresholds pick a level, colour or motif)
**Plain words:** cuts brightness into a few bands and gives each band one value: a flat colour, a dye state, or a shape.
**Maths:** $\text{band}=\min(n-1,\lfloor L\,n\rfloor)$; $k=\sum_j[t\ge\vartheta_j]$ — first seen in neo-brutalism, bauhaus, contour-lines, watercolour, ajrak, kolam.
**Helpers:** none shared.
**Entered:** v1 (sample).

### misregistration
**Name:** misregistration offsets (plates or channels read at a shift)
**Plain words:** reads one printing plate, resist block or colour channel at a slightly shifted position, so the layers do not line up exactly.
**Maths:** $I_k(\mathbf x)=P_k(\mathbf x+\boldsymbol\delta_k)$; $R'(x)=R(x-d),\ B'(x)=B(x+d)$ — first seen in ajrak, risograph, glitch.
**Helpers:** none shared.
**Entered:** v1 (sample; named in the brief).

### coordinate-warp
**Name:** coordinate warp (read the source at remapped positions)
**Plain words:** builds the output by looking the picture up somewhere else: a displacement per pixel or per strip, a barrel distortion, a wrap round a cylinder.
**Maths:** $C'(\mathbf x)=C\big(T(\mathbf x)\big)$, e.g. barrel $T(\mathbf n)=\mathbf n\,\frac{1+k\lVert\mathbf n\rVert^2}{1+k}$ — first seen in scanlines-crt, hala-lacquerware, anaglyph-3d, glitch.
**Helpers:** none shared (`bilinear` when sub-pixel).
**Entered:** v1 (sample).

### tone-to-height
**Name:** height map from tone and pattern (emboss)
**Plain words:** builds a height surface from the picture's (blurred) brightness, plus a carved or pressed pattern and fine noise, ready to be lit.
**Maths:** $H=a\,T_b+\text{pattern}+\eta$ — first seen in embossed-leather, makli-carving, indus-seal.
**Helpers:** none shared (input to `slopes` / `carvedStone`).
**Entered:** v1 (sample).

### poisson-disc
**Name:** minimum-spacing placement (Poisson disc / dart throwing)
**Plain words:** places points (dots, tesserae, line steps) only where they are at least a minimum distance from every point already kept, which spreads them evenly without a grid; the distance may follow tone.
**Maths:** keep $\mathbf p\iff\lVert\mathbf p-\mathbf q\rVert\ge\tfrac12\big(r(\mathbf p)+r(\mathbf q)\big)\ \forall$ kept $\mathbf q$ — first seen in poisson-stippling, low-poly, byzantine-mosaic, flow-field.
**Helpers:** none shared.
**Entered:** v1 (sample).

### importance-sampling
**Name:** placement by importance (tone or edge strength sets the chance or density)
**Plain words:** decides where to put marks or seeds by a map of importance: a point is accepted with a probability (or packed at a density) that rises with darkness, lightness or edge strength.
**Maths:** $P(\text{accept }\mathbf s)=\operatorname{imp}(\mathbf s)$; $\rho(\mathbf x)\propto 1/r(\mathbf x)^2$ — first seen in voronoi-mosaic, low-poly, bokeh, hala-blue-pottery, poisson-stippling.
**Helpers:** none shared.
**Entered:** v1 (sample).

### edge-tangent-field
**Name:** orientation from the image's edge direction (tangent field)
**Plain words:** turns marks (strokes, tiles, rows of tesserae) to follow the picture's contours, often blended with a noise direction where the edges are weak.
**Maths:** $\mathbf t=\frac{(-\partial_yL,\ \partial_xL)}{\lVert\nabla L\rVert},\ \mathbf d=\frac{(1-w)(\cos\theta,\sin\theta)+w\mathbf t}{\lVert\cdot\rVert}$ — first seen in flow-field, byzantine-mosaic, oil-impasto, bauhaus.
**Helpers:** none shared (built on `sobel`).
**Entered:** v1 (sample).

### streamline-trace
**Name:** trace a path along a direction field (Euler steps)
**Plain words:** grows a line, a row of tiles or a stroke by stepping repeatedly in the direction the field gives at the current point.
**Maths:** $\mathbf x_{j+1}=\mathbf x_j+h\,\mathbf d(\mathbf x_j)$ — first seen in flow-field, byzantine-mosaic.
**Helpers:** none shared.
**Entered:** v1 (sample).

### sdf-shape
**Name:** shape from a distance or margin function (anti-aliased)
**Plain words:** defines a shape by how far each pixel is inside or outside it (union is the larger margin), then turns that distance into a soft-edged coverage.
**Maths:** $\text{cov}=\operatorname{clamp}\big(\rho-\operatorname{dist}(\mathbf p,\text{shape})+\tfrac12\big)$; $m_{A\cup B}=\max(m_A,m_B)$; $\text{cov}=\operatorname{smoothstep}(-w,w,m)$ — first seen in mughal-jali, phulkari, makli-carving.
**Helpers:** none shared.
**Entered:** v1 (sample).

### stitch-grid
**Name:** stitch field (the picture as a grid of thread stitches)
**Plain words:** lays a grid of stitch cells over the picture; each cell gets one thread colour and a stitch with a direction and length, drawn as a thread.
**Maths:** $s=W/n$; per cell a thread colour, direction $d_{ij}$, length $\ell_{ij}$; thread coverage by distance to the stitch segment — first seen in cross-stitch, phulkari, sindhi-mirror-embroidery.
**Helpers:** none shared.
**Entered:** v1 (sample; named in the brief).

### resist-mask
**Name:** resist mask (where a resist blocks the dye)
**Plain words:** a mask of where wax, paste or mud covers the cloth: the dye reaches everywhere else, and the ground colour stays under the resist, except where the resist cracks or shifts.
**Maths:** $C=\begin{cases}C_{\text{ground}}&R(\mathbf x)=1\\ C_{\text{dye}}&\text{otherwise}\end{cases}$ — first seen in ajrak, batik.
**Helpers:** none shared.
**Entered:** v1 (sample; named in the brief).
