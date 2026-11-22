# G. Painterly and drawn

Source: https://lumenary-studio.vercel.app/theory/painterly (captured 2026-11-16 for private study).

Brush, pencil, chalk and ink: marks that pool, bleed and build up, much as they do on a table by a window.

## 96  Watercolour  ·  _still_

- **Comes from:** European and East Asian painting
- **Around:** Centuries old, English school of the 18th and 19th centuries
- **Works best on:** Landscapes, flowers and soft portraits

### Why it looks this way

Watercolour is thin pigment carried by water, so the white of the paper shows through it and a stroke can only ever darken what lies beneath. That one fact explains the whole look: bright areas are simply left unpainted, colours bleed into one another, and pigment pools in dark rims where a wash dried. This treatment works in pigment laid over a paper colour for exactly that reason.

### How it works

1. Blur the picture by an amount set by the bleed slider to stand in for water spreading.
2. Read it from slightly displaced places, nudged by slow noise, for the wobble of a wet brush.
3. Pull each channel part way toward the nearest of seven levels, because washes settle in flat tonal steps.
4. Compute pigment as darkness times small effects: nothing in the lightest areas, uneven blooms from broad noise, granulation from fine noise, and pooling at edges.
5. Darken the paper with that pigment, then add an optional unpainted border and a faint fibre pattern.

### The mathematics

A watercolour wash is thin pigment carried by water. You see the paper through it, so a stroke can only ever darken the white underneath, and the program works in pigment (how dark each colour channel is) laid over a paper colour. The picture is first blurred, with a radius of 2 to 11 px set by the bleed slider, to stand in for water spreading. Each pixel then reads that blurred picture from a place nudged by slow noise (about ±3.5 px), the wobble of a wet brush, and each channel is pulled 55% of the way toward the nearest of seven levels, because washes settle in flat tonal steps.

The pigment at a pixel is the darkness times a handful of small effects. Very light areas get nothing at all, since a painter leaves the paper bare for the highlights. Broad noise (±21%) makes the wash bloom unevenly, and fine noise makes the pigment granulate, settling in the hollows of the paper. Where the picture has an edge the pigment pools, as it does at the rim of a drying wash, and the dark rims slider controls how much. The result darkens the paper colour; an optional unpainted border with a ragged inner edge, and a faint fibre pattern, finish the sheet.

$$
\tilde v=v+0.55\left(\frac{\operatorname{round}(7v)}{7}-v\right)
$$
_Each channel v (0 to 1) of the blurred picture is flattened toward seven levels._

$$
m=\operatorname{clip}\Big[(1-\tilde v)\;s\;\ell\;b\;g\;\big(1+1.1\,\rho\,e\big)\Big]
$$
_s is the colour strength (0.45 to 1.2), ℓ = 1 − smoothstep(0.8, 0.97, L) the lift that keeps highlights bare, b bloom, g granulation, ρ the rim slider and e = smoothstep(0.015, 0.09, edge strength) the pooling at edges._

$$
C=C_{\text{paper}}\,\big(1-0.94\,m\big)
$$
_The pigment only darkens the paper beneath it, channel by channel._

### A short history

Painting with water-based colour is ancient, but the English school of the eighteenth and nineteenth centuries, with artists such as Thomas Girtin and J. M. W. Turner, made it a major art of landscape. Albrecht Dürer had already painted detailed watercolour studies of plants and animals around 1500. Portable paint boxes later put watercolour in the hands of travellers and amateurs.

### Where it is used

- Illustration and greeting cards
- Wedding and stationery designs
- Nature and travel journal imagery
- Soft wall art and book covers

### Try it

- High bleed and light colour make a loose, dreamy wash. (https://lumenary-studio.vercel.app/style/watercolour?bleed=90&wash=45)
- Strong rims with rough paper look like a quick plein air sketch. (https://lumenary-studio.vercel.app/style/watercolour?rim=90&paper=rough)
- Turn off the border to let the picture fill the page. (https://lumenary-studio.vercel.app/style/watercolour?margin=false)

### Words worth knowing

- **Wash:** A thin, even layer of watery paint.
- **Granulation:** Pigment that settles into the hollows of the paper and gives a speckled texture.
- **Wet-on-wet:** Painting onto paper that is still damp, so colours spread and blend.

### See also

- 103 Ink Wash
- 101 Gouache
- 100 Impressionist

## 97  Oil Impasto  ·  _still_

- **Comes from:** European oil painting
- **Around:** 17th century onward, famous in the 1880s
- **Works best on:** Landscapes and portraits with strong light

### Why it looks this way

Thick oil paint stands up from the canvas, and most of what we read as paint is light and shadow on that relief. So this treatment builds two pictures from the same brush strokes: a colour map and a height map. Each stroke is a small ridged landscape with bristle furrows and piled-up lips, and one light does the rest.

### How it works

1. Scatter short fat strokes over a jittered grid, with a second pass at half the size for details.
2. Give each stroke the colour of the blurred picture at its centre, varied by 6 percent, and an angle that mixes the picture’s edge direction with a loose random direction.
3. In the height map, make each stroke a base height with three thin bristle furrows and bright lips on both sides where paint piles up.
4. Blur the map slightly and take its slopes by finite differences, scaled by the thickness slider.
5. Light the result with a diffuse term for broad shading and a highlight for the wet shine.

### The mathematics

Thick oil paint stands up from the canvas, and most of what we read as paint is light and shadow on that relief. So two pictures are made with the same brush strokes: a colour map and a height map. Short fat strokes are scattered over a jittered grid (spacing about 0.95 of the brush size), with a second pass at half the size covering a third of the grid for the details. Each stroke takes the colour of the blurred picture at its centre, varied by ±6%, and lies at an angle that mixes two directions: along the picture’s edges (the gradient direction turned by 90 degrees) and a loose random direction near −40 degrees. The mix weight is the follow-the-shapes slider times the local edge strength.

In the height map each stroke is a little ridged landscape: a base height, three thin parallel bristle furrows along its length, and bright lips at both sides where paint piles up. The map is blurred slightly and its slopes are taken by finite differences, scaled by the thickness slider. From the slopes comes a surface normal, and the light does the rest: a diffuse term for the broad shading and a Blinn-Phong highlight for the wet shine, with the light direction set by the angle slider.

$$
\theta=\arg\Big(w\,e^{\,i(\varphi+\pi/2)}+(1-w)\,e^{\,i\theta_0}\Big),\qquad w=f\cdot\operatorname{clip}\big(12\,\lVert\nabla L\rVert\big)
$$
_Stroke angle: φ is the gradient direction, θ₀ the loose random direction, f the follow-the-shapes slider._

$$
\mathbf n=\frac{(s_x,\;s_y,\;1)}{\sqrt{s_x^2+s_y^2+1}}
$$
_s_x and s_y are the slopes of the height map, magnified by 1 to 9 with the thickness slider._

$$
C=C_{\text{paint}}\Big(0.5+0.62\,\frac{\max(0,\mathbf n\cdot\mathbf l)}{l_z}\Big)+140\,\sigma\,\max\!\big(0,\ \mathbf n\cdot\hat{\mathbf h}\big)^{26}
$$
_Diffuse shading plus a specular glint. l is the unit light direction (l_z = 0.7 before normalising), h its half-vector with the viewer, σ the wet shine slider._

### A short history

Oil paint became the main medium of European painting in the fifteenth century, and Rembrandt used thick paint to make highlights rise from a flat ground. Impasto was pushed much further by Vincent van Gogh in the 1880s. The collapsible metal paint tube, patented by John Goffe Rand in 1841, let painters carry colours outdoors.

### Where it is used

- Fine art style prints and posters
- Painterly book and album covers
- Gallery style wall decor
- Texture-rich portrait gifts

### Try it

- A large brush with thick paint is bold and sculptural. (https://lumenary-studio.vercel.app/style/oil-impasto?size=80&relief=90)
- A small brush that follows shapes closely keeps detail. (https://lumenary-studio.vercel.app/style/oil-impasto?size=15&flow=95)
- Move the light to the top to change every shadow. (https://lumenary-studio.vercel.app/style/oil-impasto?angle=270)

### Words worth knowing

- **Impasto:** Paint applied so thickly that brush strokes stand out.
- **Finite difference:** Estimating a slope by subtracting nearby values.
- **Bristle furrow:** A thin groove left by one hair of the brush.

### See also

- 100 Impressionist
- 99 Pointillism
- 68 Clay 3D

## 98  Charcoal Sketch  ·  _still_

- **Comes from:** Drawing studios, and cave walls before that
- **Around:** Prehistoric to today
- **Works best on:** Portraits and strong light and shade

### Why it looks this way

Charcoal is a powder that sticks to the bumps of the paper and slides off the hollows, so whether a pixel turns black depends on the paper’s tooth as well as on the picture. A light touch catches only the peaks and shows grain, and a heavy one fills everything. Sketchy, doubled outlines and a smudged ground complete the hand-drawn feel.

### How it works

1. Model the tooth of the paper as a mix of smooth and white noise.
2. Compute the stick’s pressure from the darkness of the lightly blurred picture, multiplied by the pressure slider and by diagonal streaks like a hand shading back and forth.
3. Ink the pixel where pressure beats the tooth, so light pressure only catches the peaks.
4. Read the edge map three times at places displaced by slow noise and keep the strongest reading, so outlines wander and double.
5. Add a heavily blurred copy as smudge, then tint everything as charcoal, conté, sanguine or graphite.

### The mathematics

Charcoal is a powder that sticks to the bumps of the paper and slides off the hollows, so darkness alone does not decide whether a pixel turns black. The paper’s tooth does too. The program models the tooth as a mix of smooth and white noise (55% and 45%) and compares the stick’s pressure with it. The pressure itself is the darkness of the lightly blurred picture, multiplied by the pressure slider and by streaks: noise stretched along the 45 degree diagonal, which gives the direction of a hand shading back and forth. Where the pressure is high the stick reaches the hollows and the pixel is solid; where it is low only the peaks catch, and the grain shows.

The outlines are drawn more than once, the way a sketcher restates a contour. The edge map is read three times at places displaced by slow noise (2 to 12 px, from the sketchy-outlines slider) and the strongest reading wins, so lines wander and double. Smudging is a heavily blurred copy of the picture: dark regions dust the paper a little grey, as if a thumb had dragged the powder around. Four media are only different ink colours (charcoal, conté, sanguine and graphite), mixed over the paper by the final coverage.

$$
\text{cov}=\operatorname{smoothstep}\big(0.6\,\tau-0.25,\ 0.6\,\tau+0.35,\ a_0\big),\qquad \tau=0.55\,n+0.45\,r
$$
_The paper tooth τ (smooth noise n, white noise r) decides which pressure values a_0 stick._

$$
\ell=\max_{k=1,2,3}\ \operatorname{smoothstep}\big(0.045,\ 0.16,\ E(\mathbf x+\boldsymbol\delta_k)\big)
$$
_The redrawn outline: the edge strength E sampled at three noise-shifted positions._

$$
C=(1-a)\,C_{\text{paper}}\,(1-0.55\,w)+a\,C_{\text{ink}}
$$
_a is the final coverage, w the smudge dusting taken from a blurred copy of the picture._

### A short history

Charcoal is among the oldest drawing materials, used on cave walls for tens of thousands of years. Renaissance artists drew studies in red chalk, or sanguine, and Nicolas-Jacques Conté invented the conté crayon in 1795. Charcoal remains the standard material for quick figure studies, because it can be rubbed out and redrawn in a moment.

### Where it is used

- Quick portrait and figure studies
- Sketchbook style illustrations
- Dramatic monochrome posters
- Art class and teaching materials

### Try it

- Sanguine on cream paper looks like an old master study. (https://lumenary-studio.vercel.app/style/charcoal-sketch?medium=sanguine&paper=cream)
- Heavy smudge and strong pressure make a moody drawing. (https://lumenary-studio.vercel.app/style/charcoal-sketch?smudge=85&pressure=90)
- Graphite with light pressure feels like a quiet pencil sketch. (https://lumenary-studio.vercel.app/style/charcoal-sketch?medium=graphite&pressure=35)

### Words worth knowing

- **Tooth:** The roughness of paper that grips the drawing material.
- **Sanguine:** A red-brown chalk used for drawing, from the Latin for blood.
- **Conté:** A hard drawing crayon made of pigment and clay, named after its inventor.

### See also

- 102 Pencil Hatching
- 104 Pastel Chalk
- 85 Mezzotint

## 99  Pointillism  ·  _still_

- **Comes from:** Paris, Neo-Impressionism
- **Around:** 1880s and 1890s
- **Works best on:** Sunlit landscapes and scenes with soft colour

### Why it looks this way

Seurat’s idea was to stop mixing paint on a palette and put pure dots of colour side by side, leaving your eye to mix them. Seen from a distance, blue and yellow dots give a vibrating green that is brighter than mixed paint. This treatment throws thousands of dots of the picture’s own colours onto a plain ground and lets the mixing happen in the viewer.

### How it works

1. Blur the picture to about the scale of one dot.
2. Throw dots at random positions and sizes, enough that a pixel lies under two to six of them on average.
3. Give each dot the colour of the blurred picture under its centre, lifted in saturation.
4. Wander each dot a little in hue, saturation and lightness, with up to 7 percent taking a complementary hue for the flecks that make shadows vibrate.
5. Let some of the plain ground show through where dots happen not to overlap.

### The mathematics

Seurat’s idea was not to mix paint on the palette but to put pure dots side by side and let the viewer’s eye mix them (optical mixture). The program blurs the picture to the scale of one dot, then throws dots of random position and size onto a plain ground. The number of dots is set so that, on average, a given pixel lies under 2 to 6 of them (the coverage slider). The radius is 1.5 to 7 px, and each dot varies from 0.72 to 1.22 times that.

Every dot takes the colour of the blurred picture under its centre and then wanders a little in hue, saturation and lightness (HSL), by an amount set by the colour jitter slider. Saturation is lifted so the colours are purer than the photograph, hue shifts by up to ±0.045 of the colour wheel, and lightness by ±0.1. Up to 7% of the dots (at full jitter) take the opposite hue at lower saturation, the flecks of complement that make a shadow vibrate in the divisionist manner. Because dots overlap at random, a few spots of ground show through, and the chance of that is a Poisson one.

$$
n=\frac{(2+4c)\,W\,H}{\pi\,r^{2}}
$$
_Number of dots for coverage slider c (0 to 1) and nominal radius r._

$$
P(\text{bare})\approx e^{-\lambda},\qquad \lambda\approx 0.96\,(2+4c)
$$
_Chance that a pixel is under no dot at all (the 0.96 allows for the spread of dot sizes)._

$$
h'=h+0.09\,v\,(u_1-\tfrac12),\quad s'=s\,(1.08+0.3\,v)+0.04,\quad l'=l+0.2\,v\,(u_2-\tfrac12)
$$
_The jitter in hue, saturation and lightness; v is the colour jitter slider and u₁, u₂ are random numbers in [0, 1]._

### A short history

Georges Seurat painted A Sunday Afternoon on the Island of La Grande Jatte in 1884 to 1886, and Paul Signac helped develop the method, called divisionism or pointillism. They drew on nineteenth century colour theory, including Michel Eugène Chevreul’s work on simultaneous contrast. The principle returns every time an image is made of dots, from halftone printing to a screen’s pixels.

### Where it is used

- Fine art style portraits and landscapes
- Posters and prints with a vibrating colour
- Teaching colour theory
- Textured album and book covers

### Try it

- Tiny dots with full coverage are close to a photograph. (https://lumenary-studio.vercel.app/style/pointillism?dot=10&cover=100)
- Big dots with strong jitter look like a classic divisionist canvas. (https://lumenary-studio.vercel.app/style/pointillism?dot=70&vivid=85)
- A dark canvas makes the colours glow. (https://lumenary-studio.vercel.app/style/pointillism?ground=dark)

### Words worth knowing

- **Optical mixture:** Colour mixed in the eye from small separate patches, not in the paint.
- **Complementary colour:** The colour opposite another on the colour wheel.
- **Divisionism:** The practice of dividing a painting into separate patches of pure colour.

### See also

- 100 Impressionist
- 80 Halftone
- 156 Poisson Stippling

## 100  Impressionist  ·  _still_

- **Comes from:** Paris
- **Around:** 1870s and 1880s
- **Works best on:** Landscapes, gardens and water

### Why it looks this way

Impressionist painters worked quickly outdoors, laying down short visible strokes of colour to catch the light before it changed. The program does the same in three passes: big brushes for the broad colour, then smaller ones only where the picture still differs from the canvas. Strokes run along lines of equal brightness, so they follow edges instead of cutting across them.

### How it works

1. In the first pass paint over a very blurry copy of the picture enlarged to the canvas.
2. In the second and third passes compare the canvas with the picture blurred to half the brush radius.
3. On a grid of cells, sample five random points, and place a stroke at the worst one if the average colour error is above a threshold.
4. Make each stroke follow the isophote, the line of equal brightness, by turning the brightness gradient by 90 degrees and stepping along it until the colour drifts too far.
5. Tone each stroke in the impressionist spirit: more saturation, lighter lightness, and shadows pushed toward violet.

### The mathematics

Impressionist painting works from coarse to fine, and so does the program, in three passes with brush radii R from about 7 to 21, 3.4 to 10 and 1.8 to 5.4 px (set by the brush size slider). The first pass paints over a very blurry copy of the picture, enlarged to the canvas. In the second and third passes the canvas is compared with a reference, the picture blurred to a radius of R/2. On a grid of cells 1.15 R wide, five random samples measure the colour error; a stroke is placed at the worst sample only if the average error per channel exceeds a threshold, so small brushes work where the picture still has detail. This is the layered-stroke method described by Hertzmann in 1998.

A stroke follows the isophote, the line of constant brightness, so it runs along an edge instead of across it. The direction is the gradient of the blurred luminance turned by 90 degrees. The stroke takes steps of 0.9 R, up to a length set by the stroke length slider, and stops early if the reference colour has drifted too far from the stroke’s colour. The colour is then toned in the Impressionist spirit: saturation is raised, lightness lifted a little, and the darks are pushed toward violet, since shadows were painted with colour, not black. A faint woven pattern can be multiplied in for canvas.

$$
\bar e=\frac{1}{15}\sum_{k=1}^{5}\big(\lvert\Delta R\rvert+\lvert\Delta G\rvert+\lvert\Delta B\rvert\big)_k>\tau,\qquad \tau=60\,(1-D)+8
$$
_A stroke is placed in a cell only if the mean error exceeds τ; D is the detail slider (the first pass paints everywhere)._

$$
\mathbf d=\frac{\big(-\partial_y L,\ \ \partial_x L\big)}{\lVert\nabla L\rVert},\qquad \mathbf x_{j+1}=\mathbf x_j+0.9\,R\,\mathbf d_j
$$
_Stroke path along the isophote of the blurred luminance L (the sign is kept the same as the previous step so the stroke does not fold back)._

$$
h'=h+\min\!\big(0.5,\ 1.4\,g\,(0.4-l)\big)\,(0.72-h)\qquad (l<0.4)
$$
_Shadow colour: dark hues slide toward violet (0.72 of the colour wheel); g is the sunlit colour slider._

### A short history

The movement is named after Claude Monet’s Impression, Sunrise, shown in 1874 at the first independent exhibition of the group in Paris. Cheap paint tubes let painters work outdoors, and the group’s short strokes of broken colour replaced the smooth finish of the academies. The layered stroke method used here was described by Aaron Hertzmann at SIGGRAPH in 1998.

### Where it is used

- Fine art style prints
- Soft, painterly posters and greeting cards
- Travel and garden imagery
- Backgrounds with brushwork

### Try it

- Large brushes and low detail give a loose, early morning scene. (https://lumenary-studio.vercel.app/style/impressionist?brush=75&detail=25)
- Small brushes with high detail are closer to a finished canvas. (https://lumenary-studio.vercel.app/style/impressionist?brush=20&detail=85)
- Long strokes flow along the shapes like wind. (https://lumenary-studio.vercel.app/style/impressionist?length=85)

### Words worth knowing

- **Isophote:** A line along which brightness is constant.
- **Plein air:** Painting outdoors, in front of the subject.
- **Broken colour:** Colours placed side by side in small strokes instead of being blended.

### See also

- 99 Pointillism
- 97 Oil Impasto
- 96 Watercolour

## 101  Gouache  ·  _still_

- **Comes from:** Illuminated manuscripts, miniatures and illustration studios
- **Around:** Medieval onward, mid 20th century illustration
- **Works best on:** Posters, landscapes and portraits with clear colour shapes

### Why it looks this way

Gouache is opaque and matte: the colour comes from the paint itself, not from the paper behind it, so a painter works from a few mixed pots and fills flat shapes. This treatment chooses a small palette from the picture, makes the colours a little chalky, and lets the shapes wobble where a hand and a wide brush would.

### How it works

1. Find a palette by k-means clustering of the picture’s colours, then make each pot chalkier.
2. Blur the picture, label each pixel with its nearest palette colour, and tidy the regions with two passes of a majority filter.
3. Read each pixel’s label from a place displaced by smooth noise, so boundaries wobble the same way on both sides.
4. Show bare paper where a different label lies a few pixels away, the thin gap between flat areas.
5. Add long streaks of noise for brush drag and a few dry-bristle flecks.

### The mathematics

Gouache is opaque and matte: the colour comes from the paint, not from the paper behind it, and a painter works from a few mixed pots. So the program chooses a palette first, by k-means clustering of the picture’s colours (the colours of paint slider sets how many), then makes the pots chalkier: saturation × 0.95 + 0.02 and lightness × 0.86 + 0.08, kept between 0.1 and 0.9. The picture is blurred (1.5 to 8.5 px), every pixel is given the label of its nearest palette colour, and two passes of a majority filter over a small neighbourhood round the ragged regions into shapes a brush could paint.

Then the hand is put back. Each pixel looks up its label at a place displaced by smooth noise (up to ±5 px), so a boundary wobbles the same way on both sides. Where a different label lies a few pixels away in any of the four directions, bare paper shows through, the thin gap left between two flat areas. A wide brush drags: long streaks of noise change the colour by a few per cent, and a few dry-bristle flecks (about 40% paper) appear where a stretched noise is high.

$$
\lambda(\mathbf x)=\arg\min_{k}\ \lVert \mathbf c(\mathbf x)-\mathbf p_k\rVert^{2},\qquad s'=0.95\,s+0.02,\quad l'=\operatorname{clip}(0.86\,l+0.08,\,0.1,\,0.9)
$$
_Each pixel takes the label of the nearest palette colour p_k; the palette itself is softened in saturation and lightness._

$$
\mathbf x'=\mathbf x+2\,w\,\big(\boldsymbol\nu(\mathbf x)-\tfrac12\big)
$$
_The wobble: ν is smooth 2D noise, w the hand-wobble slider (up to 5 px)._

$$
\text{bare}=0.9\,(0.6+0.4\,n)\quad\text{if}\ \ \lambda(\mathbf x'+g\,\mathbf e)\ne\lambda(\mathbf x')\ \text{for some}\ \mathbf e\in\{\pm\hat x,\pm\hat y\}
$$
_The gap of paper between two flat areas; g is the gaps slider in pixels and n fine noise._

### A short history

The word comes from the Italian guazzo. Opaque water-based paint was used in medieval manuscripts and in Indian and Persian miniature painting, and gouache became the favourite of poster artists and illustrators in the twentieth century. Henri Matisse painted sheets of paper with gouache to make his cut-outs, and mid-century concept artists such as Mary Blair used it for bold colour.

### Where it is used

- Poster and book illustration
- Concept art and storyboards
- Packaging and brand illustration
- Flat, retro style prints

### Try it

- Few colours with a lot of wobble look hand painted. (https://lumenary-studio.vercel.app/style/gouache?colours=4&wobble=80)
- More colours and smooth shapes read as a detailed poster. (https://lumenary-studio.vercel.app/style/gouache?colours=10&smooth=80)
- No gaps and no drag make flat digital colour. (https://lumenary-studio.vercel.app/style/gouache?gaps=0&streaks=0)

### Words worth knowing

- **Opaque:** Not letting light through, so it covers what lies underneath.
- **Palette:** The set of colours chosen for a painting.
- **Majority filter:** A filter that gives each pixel the most common label among its neighbours.

### See also

- 92 Paper Cut-out
- 22 Vector Art
- 96 Watercolour

## 102  Pencil Hatching  ·  _still_

- **Comes from:** Illustration, engraving and drawing
- **Around:** Renaissance onward
- **Works best on:** Objects and portraits with strong form

### Why it looks this way

An illustrator builds tone from layers of parallel strokes: one set in one direction, a second across it, more where the shadow is deepest. A light area has none, a mid tone has one set and the deepest shadow is crossed four times. This treatment stacks up to four layers at different angles, each appearing only once the picture is dark enough.

### How it works

1. Set up to four layers of strokes at 45, 135, 0 and 90 degrees, all turned together by the turn slider.
2. Let a layer appear only when the darkness passes its threshold of 0.16, 0.34, 0.54 or 0.74.
3. For each layer, divide the position across the strokes by the line spacing, with slow noise for the hand’s wobble, and take the integer part as the stroke index.
4. Make each stroke thicker the further the darkness is past the threshold, with its own random width and pressure seeded by its index.
5. Combine layers by taking the strongest, lighten with paper tooth, and add optional soft outlines.

### The mathematics

An illustrator builds tone from layers of parallel strokes: one set in one direction, a second set across it, a third and a fourth where the shadow is deepest. The program does the same with up to four layers whose strokes run at 45, 135, 0 and 90 degrees (all turned together by the turn slider). A layer begins to appear only when the picture’s darkness d passes its threshold t, which is 0.16, 0.34, 0.54 and 0.74 (stretched by 1.3 when there are only two layers), so highlights stay paper and the deepest shadows are crossed four times.

For one layer, the position across the strokes is the pixel’s coordinate along the layer’s normal divided by the line spacing, with slow noise added so the hand wobbles. The integer part of that number is the index of the stroke, the fractional part says where in the stroke the pixel lies. The stroke is thicker the further the darkness is past the threshold, each stroke has its own random width and pressure (seeded by its index, so every pixel along it agrees), and the layers combine by taking the strongest. Paper tooth lightens the whole thing by up to 30%, and optional soft outlines add a faint contour.

$$
u_k=\frac{x\cos\theta_k+y\sin\theta_k}{s}+2.4\,\omega\,\big(\nu-\tfrac12\big),\qquad f=u_k-\lfloor u_k\rfloor
$$
_s is the line spacing, ω the hand wobble, ν slow noise; ⌊u⌋ is the stroke number and f the place inside it._

$$
w_k=\operatorname{clip}\!\big(3.2\,(d-t_k)+0.2,\ 0,\ 0.96\big),\qquad t=(0.16,\ 0.34,\ 0.54,\ 0.74)
$$
_Stroke width grows with how far the darkness d is past the layer’s threshold._

$$
a=\max_{k}\Big[\big(1-\operatorname{smoothstep}(w_k-0.28,\ w_k,\ \lvert 2f-1\rvert)\big)\,\pi_k\Big]
$$
_Ink coverage at the pixel; π_k is the random pressure (0.62 to 1) of its stroke in layer k._

### A short history

Hatching and cross-hatching were developed in drawing and engraving long before photography, by artists such as Albrecht Dürer, who used them to model form in prints. Graphite was found at Borrowdale in England in the 1560s, and the modern pencil followed. Today hatching is used in comics, manga, technical illustration and architectural sketches.

### Where it is used

- Sketchbook and editorial illustration
- Architectural and product studies
- Comic and manga style shading
- Art lessons on tone

### Try it

- Two layers with a bold turn is a quick, graphic sketch. (https://lumenary-studio.vercel.app/style/pencil-hatching?layers=2&angle=30)
- Red lead on cream paper feels like an old study. (https://lumenary-studio.vercel.app/style/pencil-hatching?lead=red&paper=cream)
- Tighter spacing and full layers give a smooth, almost photographic result. (https://lumenary-studio.vercel.app/style/pencil-hatching?space=3.5&layers=4)

### Words worth knowing

- **Hatching:** Parallel lines used to suggest shade.
- **Cross-hatching:** A second set of lines crossing the first to make a darker tone.
- **Tooth:** The grain of paper that catches the pencil.

### See also

- 98 Charcoal Sketch
- 15 Victorian
- 82 Linocut

## 103  Ink Wash  ·  _still_

- **Comes from:** China and Japan
- **Around:** Tang dynasty onward, Zen painting from the 14th century
- **Works best on:** Mountains, trees, flowers and calm portraits

### Why it looks this way

Sumi-e builds every tone from a few dilutions of one ink and leaves most of the paper bare. The empty space is not a gap but part of the picture, and a stroke is meant to be seen as a gesture. This treatment gives the picture a few flat washes, lets the ink bleed into damp paper, drags a dry brush across the darks and adds a red seal.

### How it works

1. Measure the picture’s darkness, stretched and blurred, and rescale it from a lower bound that moves with the how-much-is-inked slider.
2. Multiply by the number of tone levels and let the integer part be the tone, with a smoothstep ramp up to the next tone.
3. Blur the result twice to show ink soaking sideways, and wobble the lookup a little with the bleed slider.
4. Darken the ink where it has an edge, the tide-line a drying wash leaves.
5. Remove ink with long dry-brush streaks in the dark areas, and multiply an optional red seal onto the lower right corner.

### The mathematics

Sumi-e builds its tones from a few dilutions of one ink and leaves most of the paper bare. The picture’s darkness d (the stretched lightness, blurred twice at a radius of 3 px, inverted) is rescaled from a lower bound l₀ that moves with the how-much-is-inked slider, then multiplied by the number of tone levels K. The integer part of the result is the tone and the fractional part is pushed up to the next tone by a smoothstep, so each tone is a flat wash with a short ramp between neighbours, like layers of diluted ink laid one over another. The result is blurred twice more, 1 to 7 px, which is the ink soaking sideways into damp paper.

At draw time the lookup wobbles a little (up to ±2.5 px × bleed). Where the ink has an edge it is darker by up to half again, the tide-line that a drying wash leaves. Dry brush is a set of long streaks, tilted slightly, that remove up to 62% of the ink in the dark areas, the white skips of a quick stroke from a nearly dry brush. Paper fibre varies the ink by ±10%, and the final colour is paper and ink mixed by the concentration v. An optional red seal (a chop) is multiplied onto the lower right corner.

$$
t=K\,\operatorname{smoothstep}(l_0,\ 1,\ d),\qquad v=\min\!\Big(1,\ \frac{1.02}{K}\big(\lfloor t\rfloor+\operatorname{smoothstep}(0.55,\,1,\ t-\lfloor t\rfloor)\big)\Big),\qquad l_0=0.6-0.5\,a
$$
_Flat tones with short ramps; a is the how-much-is-inked slider._

$$
v\ \leftarrow\ v\,\Big[1-0.62\,D\,\operatorname{smoothstep}(0.58,\,0.85,\ \sigma)\,\operatorname{smoothstep}(0.35,\,0.8,\ v)\Big]
$$
_Dry brush: σ is a noise stretched along the stroke direction, D the dry brush slider._

$$
C=C_{\text{paper}}\,(1-v)+C_{\text{ink}}\,v
$$
_The ink concentration v mixes ink over paper._

### A short history

Ink painting flourished in China under the Tang and Song dynasties and was carried to Japan by Zen monks, where Sesshū Tōyō (1420 to 1506) became its great master. Its tools are called the four treasures: brush, ink, paper and inkstone. The aesthetic of empty space, and of capturing the spirit of a subject in a few strokes, influenced Western painting and graphic design.

### Where it is used

- Calm posters and wall art
- Tea house, wellness and brand imagery
- Greeting cards and invitations
- Book covers with an Eastern feel

### Try it

- Few layers of ink with lots of paper is the most meditative. (https://lumenary-studio.vercel.app/style/ink-wash?tones=2&amount=35)
- Indigo ink on white paper looks cool and modern. (https://lumenary-studio.vercel.app/style/ink-wash?ink=indigo&paper=white)
- Heavy dry brush leaves the white skips of a quick stroke. (https://lumenary-studio.vercel.app/style/ink-wash?dry=95)

### Words worth knowing

- **Sumi-e:** Japanese for ink picture: painting in black ink.
- **Chop:** A carved seal stamped in red ink to sign a painting.
- **Dry brush:** A stroke made with little ink, leaving gaps where the paper shows.

### See also

- 96 Watercolour
- 98 Charcoal Sketch
- 86 Cyanotype

## 104  Pastel Chalk  ·  _still_

- **Comes from:** European portraiture and studio drawing
- **Around:** 16th century onward, popular in the 18th and 19th centuries
- **Works best on:** Portraits, skies and flowers

### Why it looks this way

Pastel is used on toned paper. The paper’s own colour supplies the shadows and middle tones, and the chalk goes on mostly for the lights, which is why pastel pictures glow. This treatment lays short wide strokes of lifted colour, only where the picture is light, and breaks each stroke on the grain of the paper.

### How it works

1. Paint a layer of short, wide strokes in two passes, the second half the size, along a main direction with a spread of about 0.35 radians.
2. Give each stroke the colour of the blurred picture with saturation raised by 12 percent and lightness set to 0.9 l plus 0.1, so chalk comes out brighter and softer.
3. Decide how much chalk stays from how light the picture is there, times the pressure, times a slow noise, so shadows are left to the paper.
4. Break each stroke with the paper tooth, a mix of smooth and white noise, which spatters it into dots.
5. Add a few specks of loose dust and mix paper and chalk by the final coverage.

### The mathematics

Pastel is used on toned paper. The paper’s own colour supplies the shadows and middle tones, and the chalk goes on mostly for the lights. The program paints a layer of short, wide strokes, in two passes (the second half the size and covering about half the grid) along a main direction, which is the angle slider plus a spread of ±0.35 radians. Each stroke takes the colour of the blurred picture beneath it, with saturation raised by 12% and lightness set to 0.9 l + 0.1, so chalk comes out brighter and softer than the photograph.

How much chalk actually stays on the paper depends on two things. First, how light the picture is there: the amount is (0.15 + 1.05 L) times the pressure times a slow noise, with L a heavily blurred lightness, so shadows are left to the paper. Second, the grain. The paper tooth is a mix of smooth and white noise, and the amount has to beat a threshold that rises with the tooth slider, which breaks every stroke into a spatter of dots. A few specks of loose dust (about 1%) are added, and the final colour is the paper and the chalk mixed by the coverage.

$$
\text{amt}=\operatorname{clip}\!\Big[(0.15+1.05\,L_s)\,P\,(0.8+0.4\,n)\Big],\qquad P=0.35+0.9\,\text{pressure}
$$
_Chalk offered to the paper: L_s is the blurred lightness, n slow noise._

$$
m=\alpha\ \operatorname{smoothstep}\!\Big(1.1\,\tau q-0.12(1-q)-0.05,\ \ 1.1\,\tau q+0.2+0.1(1-q),\ \ \text{amt}\Big)
$$
_Coverage: α is the stroke layer’s own alpha, τ the paper tooth noise, q the tooth slider._

$$
C=C_{\text{paper}}\,(1-m)+C_{\text{chalk}}\,m
$$
_Chalk over toned paper._

### A short history

Artists drew with dry coloured chalks as early as the fifteenth and sixteenth centuries, and pastel portraiture flourished in the eighteenth century with painters such as Rosalba Carriera and Jean-Étienne Liotard. Edgar Degas used pastel boldly in the 1870s to 1890s. Its soft, powdery finish is still prized for portraits and skies.

### Where it is used

- Portrait and landscape prints
- Soft posters and cards
- Book and album covers
- Warm, textured backgrounds

### Try it

- Navy paper makes the chalk look like moonlight. (https://lumenary-studio.vercel.app/style/pastel-chalk?paper=navy)
- Heavy tooth with low pressure gives a dry, sparkling texture. (https://lumenary-studio.vercel.app/style/pastel-chalk?tooth=90&pressure=45)
- Kraft paper with large strokes feels like a sketchbook. (https://lumenary-studio.vercel.app/style/pastel-chalk?paper=kraft&size=65)

### Words worth knowing

- **Toned paper:** Paper that is coloured, so the ground shows through the drawing.
- **Tooth:** The grain of paper that catches the chalk.
- **Soft pastel:** Pure pigment pressed into a stick with very little binder.

### See also

- 98 Charcoal Sketch
- 101 Gouache
- 96 Watercolour

## 105  Blind Contour  ·  _still_

- **Comes from:** Art school drawing exercises
- **Around:** 20th century
- **Works best on:** Objects and faces with clear outlines

### Why it looks this way

In a blind contour drawing the artist looks only at the subject and never at the page, with the pen kept on the paper. The line wanders and lands near the edge but not on it, and the result is more alive than a careful tracing. This treatment finds the edges, chains them into one continuous pen line and lets it drift.

### How it works

1. Find the picture’s edges with the Sobel gradient of a lightly blurred, stretched lightness.
2. Divide the picture into small cells and keep the strongest edge pixel in each if it passes a threshold.
3. Chain the points: start at one, jump to the nearest unused point within 2.6 cells, and repeat until none is near enough, then lift the pen and start again.
4. Drop lines shorter than four points.
5. Add drift to every point, smooth noise along the drawing plus a little jitter, and join them with quadratic curves through the midpoints so the line has no corners.

### The mathematics

In a blind contour drawing the artist looks at the subject, never at the page, and the pen stays on the paper, so the line wanders and lands near but not on the edge. The program first finds the edges (the Sobel gradient of a lightly blurred, stretched lightness). It divides the picture into cells of 3 to 6.5 px, depending on the detail slider, and keeps the strongest edge pixel in each cell if it is above a threshold between 0.03 and 0.1. These points are then chained. Start at the first unused point, jump to the nearest unused point within 2.6 cells, and repeat until nothing is near enough; then lift the pen and start a new line. Lines shorter than four points are dropped. A grid of cells makes the nearest-point search fast.

The wandering is added to every point: smooth noise travelling along the drawing (up to 14 px at full drift) plus a little random jitter (35% of that). The points are joined with quadratic curves that pass through the midpoints between neighbours, which turns a polyline into one continuous pen line with no corners. Each stroke has its own width (0.8 to 1.3 times the weight slider) and is drawn at 88% opacity on a speckled paper.

$$
\mathcal P=\Big\{\ \arg\max_{\text{cell}}E\ :\ \max_{\text{cell}}E>\vartheta\ \Big\},\qquad \vartheta=0.1-0.07\,D
$$
_Edge points: the strongest Sobel response E in each cell, if above the threshold set by the detail slider D._

$$
\mathbf q_{i+1}=\arg\min_{\mathbf q\in\mathcal P\,\setminus\,\text{used}}\lVert\mathbf q-\mathbf q_i\rVert\qquad\text{if}\quad\lVert\mathbf q_{i+1}-\mathbf q_i\rVert<2.6\,g
$$
_Chaining the points into one pen line; g is the cell size._

$$
\tilde{\mathbf q}_i=\mathbf q_i+2A\,\big(\boldsymbol\nu(0.0045\,i)-\tfrac12\big)+0.35\,A\,\big(\mathbf u-\tfrac12\big)
$$
_The hand drifts: ν is smooth noise along the line, u random numbers in [0, 1], A = 14 px × the drift slider._

### A short history

The exercise was popularised by the art teacher Kimon Nicolaïdes in his 1941 book The Natural Way to Draw, and later by Betty Edwards’s Drawing on the Right Side of the Brain. It trains the eye to see edges as they are rather than as we assume them to be, and it has become a common warm-up in art classes.

### Where it is used

- Line drawing posters and cards
- Editorial and sketchbook style art
- Art class demonstrations
- Minimal portrait prints

### Try it

- High drift gives a nervous, expressive line. (https://lumenary-studio.vercel.app/style/blind-contour?drift=90&weight=2)
- More detail draws more of the picture. (https://lumenary-studio.vercel.app/style/blind-contour?detail=90)
- Blue ink on white paper looks like a pen sketch. (https://lumenary-studio.vercel.app/style/blind-contour?ink=blue&paper=white)

### Words worth knowing

- **Contour:** The outline of a shape.
- **Quadratic curve:** A smooth curve defined by two end points and one control point.
- **Pen lift:** A break in a line where the pen leaves the paper.

### See also

- 102 Pencil Hatching
- 98 Charcoal Sketch
- 155 Contour Lines

## 106  Anime Cel  ·  _still_

- **Comes from:** Hand-painted cel animation
- **Around:** 1914 patent, television anime from 1963
- **Works best on:** Portraits and characters with clear shapes

### Why it looks this way

An animator has to paint the same character thousands of times, so the picture is simplified until that is possible. Every area gets one flat colour and at most one shadow tone with a hard edge, outlines are inked in a thin even line, and a white shape marks whatever shines. Those economies became a style, and the style outlived the paint.

### How it works

1. Smooth the picture with a filter that flattens areas and leaves outlines where they are.
2. Find a small palette of paints and give every pixel the nearest one.
3. Add one shadow tone, as a hard step where the picture is darker than its surroundings.
4. Ink lines on the dark side of edges, between unlike paints, and on small dark features such as eyes.
5. Paint white shine on spots that are very bright and brighter than what is round them.
6. Screen a blurred copy over the frame for a soft glow.

### The mathematics

A cel is painted in flat areas, so the first job is to remove everything that is not an area. The picture is smoothed with a filter that keeps edges: each pixel becomes the average of the neighbours in its row, then its column, weighted by how close they are to it in colour. Similar neighbours count fully and different ones hardly at all, so skin evens out while the outline of a face stays put. A palette is then found by k-means. Distances are measured on brightness plus two colour differences, with the colour differences weighted up, which keeps a pale skin tone apart from a grey wall of the same brightness.

Each paint gets a second, shadow tone: darker and mixed a little toward violet, as cel painters mix it. The shadow is one hard step, taken where the picture is darker than its wider surroundings. Lines come from three sources and the strongest wins: places where the smoothed picture is darker than its own blur (the dark side of every edge), boundaries between two paints that differ a lot, and small dark features such as eyes taken from the unsmoothed picture. Shine is white, placed only where a spot is both very bright and brighter than its surroundings. A soft glow is the frame shrunk, enlarged and screened over itself.

$$
p'_i=\frac{\sum_j w_{ij}\,p_j}{\sum_j w_{ij}},\qquad w_{ij}=\exp\!\Big(-\frac{\lVert p_i-p_j\rVert_1^{2}}{2\,\sigma^{2}}\Big),\quad\sigma=76.5
$$
_Edge-keeping smoothing over the pixels j within the reach of pixel i, along one row or column at a time._

$$
\mathbf f=\big(Y,\ 1.7\,(B-Y),\ 1.7\,(R-Y)\big),\qquad Y=0.299R+0.587G+0.114B
$$
_The space in which paints are found and matched._

$$
s=S_{\tau,\,\tau+0.014}\big(L_{16}-L_{2}\big),\qquad \tau=\operatorname{lerp}(0.12,\ 0.02,\ \text{shadow})
$$
_The cel shadow: L with a wide blur minus L with a narrow one, cut to a hard step._

### A short history

Earl Hurd patented the use of clear celluloid sheets for animation in 1914: characters were inked on the front, painted on the back and photographed over a background. Japanese television animation began in earnest with Astro Boy in 1963, whose tight budget made flat colour and limited movement a virtue. Studios moved to digital ink and paint around 2000. In 2006 Winnemöller, Olsen and Gooch showed how to get the look from video in real time, with the same steps used here.

### Where it is used

- Profile pictures and avatars
- Fan art and character sheets
- Posters and video thumbnails
- Storyboards from photo reference

### Try it

- Fewer paints and strong smoothing give the cleanest cel. (https://lumenary-studio.vercel.app/style/anime-cel?colours=8&smooth=85)
- Heavy black lines move it toward comic inking. (https://lumenary-studio.vercel.app/style/anime-cel?lines=100&ink=dark)
- More shine and glow suit a bright daytime scene. (https://lumenary-studio.vercel.app/style/anime-cel?shine=75&glow=60)

### Words worth knowing

- **Cel:** A clear sheet on which one frame of a character is inked and painted.
- **Bilateral filter:** A blur that averages only neighbours of similar colour, so edges survive.
- **k-means:** A method that groups values around a chosen number of centres.

### See also

- 21 Comic book
- 22 Vector Art
- 107 Retro Anime

## 107  Retro Anime  ·  _still_

- **Comes from:** Japanese animation shot on film
- **Around:** 1980s to mid 1990s
- **Works best on:** Night scenes and anything with lights or reflections

### Why it looks this way

Animation of the 1980s was painted on cels and photographed onto film, then seen on a tube television from a tape. Each step left something: paint that never reached true black, outlines photocopied a little too heavy, a halo round every light, stars on every sparkle, grain, and colour smeared sideways by the video signal. Those marks are the nostalgia.

### How it works

1. Flatten the picture into cel paint with heavy outlines.
2. Lift the darkest tones toward navy and warm the lightest toward cream.
3. Break the outlines up a little, as a photocopy does.
4. Blur the highlights widely and add them back as a warm halo.
5. Shift red one way and blue the other, and soften each row.
6. Add grain, darken the corners and draw star glints on the brightest spots.

### The mathematics

The flat paint is made the same way as in the cel treatment, with heavier outlines. What changes is the age of the materials. Old cel paint photographed on film does not reach black or white, so each paint’s darkest tones are lifted toward navy and its lightest warmed toward cream, both in proportion to the fade slider, and saturation is trimmed. Outlines were photocopied onto the cel, and the copy breaks up where the toner ran thin, so line opacity is multiplied by a thresholded noise.

Three faults of the camera and the tape are then added. Light spreads inside film around anything bright: the highlights are isolated, blurred widely and added back in a warm tone, which is the halo. Colour bleed reads the red channel a few pixels to the left and the blue a few pixels to the right, and mixes every pixel with its horizontal neighbours. Grain is a hash plus a smoother noise, and the corners darken. Star glints are drawn on the brightest spots that are far enough apart: four thin kites each, the upright pair longer than the level pair, over a small round bloom.

$$
C\leftarrow C+(C_{\text{navy}}-C)\cdot0.5f\,\big(1-S_{0,\,0.5}(l)\big),\qquad C\leftarrow C+(C_{\text{cream}}-C)\cdot0.4f\,S_{0.6,\,1}(l)
$$
_Ageing of a paint of lightness l; f is the fade slider._

$$
R'(x)=R(x-b),\qquad G'(x)=G(x),\qquad B'(x)=B(x+b),\qquad b=\operatorname{round}(3\cdot\text{bleed})
$$
_Colour bleed along each row._

$$
C\leftarrow C+(C_{\text{halo}}-C)\cdot0.75\,k\cdot B_{9}^{2}\,S_{0.72,\,0.95}(Y)
$$
_The halo: bright parts, blurred twice with a box of radius 9, blended toward a warm white; k is the halo slider._

### A short history

The 1980s were a boom for Japanese animation. Home video created a market for direct-to-tape releases from 1983, and feature films such as Akira (1988) reached audiences abroad. Cels were shot one frame at a time on a rostrum camera, and effects were made in camera: lights were cut as holes in black card and lit from behind, which gave their glow. By the late 1990s computers had replaced cel, camera and film.

### Where it is used

- City pop and synth album covers
- Aesthetic edits and wallpapers
- Retro channel art
- Posters for night events

### Try it

- Full fade and grain look like a worn tape. (https://lumenary-studio.vercel.app/style/retro-anime?fade=100&grain=85&bleed=80)
- Many glints and a strong halo turn any light into a sparkle. (https://lumenary-studio.vercel.app/style/retro-anime?glints=12&halo=90)
- Turn the faults down for a clean film print. (https://lumenary-studio.vercel.app/style/retro-anime?bleed=0&grain=15&fade=30)

### Words worth knowing

- **Halation:** A glow round bright areas, caused by light scattering inside film.
- **Rostrum camera:** A camera fixed above a table, used to photograph artwork frame by frame.
- **Chroma bleed:** Colour spreading sideways because a video signal carries it at low detail.

### See also

- 106 Anime Cel
- 29 Retro VHS
- 17 Vaporwave

## 108  Crayon Cartoon  ·  _still_

- **Comes from:** Children’s drawing and picture books
- **Around:** Wax crayons from 1903
- **Works best on:** Simple subjects: a pet, a house, a face

### Why it looks this way

A crayon drawing has rules of its own. The outline comes first and it wobbles. Colours come straight from the box, with no mixing. The filling is done in one direction, misses the corners, and lets the paper sparkle through wherever the wax skipped. It is the opposite of polish, and it is immediately warm.

### How it works

1. Reduce the picture to a few simple shapes.
2. Swap each colour for the nearest crayon in a box of sixteen.
3. Push every shape about with slow noise so that no edge is straight.
4. Fill each colour with streaks in one direction, leaving paper where the wax skipped.
5. Lift the crayon before the outline, leaving a pale gap.
6. Draw the thick dark outline last.

### The mathematics

The picture is reduced to a few simple shapes, and each shape’s colour is swapped for the nearest crayon in a box of sixteen after being made more vivid. Two shapes that land on the same crayon are treated as one, with no outline between them. Nothing drawn by a small hand is straight, so every shape is pushed about before drawing: each pixel looks up its shape at a position shifted by slow value noise. Outlines are the boundaries of the shifted shapes, thickened.

Crayon is wax dragged over rough paper. Each colour is given one stroke direction, and the pixel’s coordinates are rotated into it. A noise stretched about nineteen times longer along the stroke than across it gives the streaks. A second, fine noise is the tooth of the paper. Wax lands where the sum of the two clears a threshold that the pressure slider lowers, so light pressure leaves paper showing in the hollows. Close to an outline the coverage is cut by about half, because a child lifts the crayon before reaching the line.

$$
u=x\cos a+y\sin a,\qquad v=-x\sin a+y\cos a,\qquad a=\pi\cdot\operatorname{hash}(\text{colour})
$$
_Coordinates along (u) and across (v) the stroke direction of one colour._

$$
\text{cover}=S_{0.82-0.75w,\ 1.05-0.55w}\big(0.62\,N(0.42v,\ 0.022u)+0.5\,\text{tooth}\big)
$$
_How much wax lands: N is value noise, w the pressure slider (0.1 to 1)._

$$
\text{shape}(x,y)=\text{shape}_0\big(x+A\,(2N_1-1),\ y+A\,(2N_2-1)\big),\qquad A=7\cdot\text{wobble}
$$
_The wobble: shapes are read at a position displaced by up to A pixels._

### A short history

Wax crayons became a school staple after 1903, when Binney and Smith in Pennsylvania began selling boxes of eight colours for a nickel. Coloured chalks and pastels are far older, but the wax stick was clean, cheap and safe for small children. Illustrators have long borrowed the look for picture books, because a crayon line tells a child that this is something they could draw too.

### Where it is used

- Children’s books and classroom displays
- Birthday cards and invitations
- Parenting and family posts
- Playful explainer illustrations

### Try it

- Light pressure on sugar paper leaves most of the page showing. (https://lumenary-studio.vercel.app/style/crayon-cartoon?wax=30&paper=sugar)
- Bright crayons on black paper glow. (https://lumenary-studio.vercel.app/style/crayon-cartoon?paper=black&wax=90)
- The picture’s own colours with little wobble make a tidier drawing. (https://lumenary-studio.vercel.app/style/crayon-cartoon?box=own&wobble=15)

### Words worth knowing

- **Tooth:** The roughness of paper that catches crayon, chalk or pencil.
- **Coverage:** How much of the paper a medium actually hides.
- **Majority filter:** Giving each pixel the most common value among its neighbours, which removes specks.

### See also

- 104 Pastel Chalk
- 21 Comic book
- 102 Pencil Hatching

## 109  Glow Sketch  ·  _still_

- **Comes from:** Light painting and neon line art
- **Around:** 1930s photographs, 2010s digital drawing
- **Works best on:** Subjects with strong, simple outlines

### Why it looks this way

Draw with a light instead of a pen and the rules invert: the page is dark and the line shines. A line of light also has a halo, bright in the core and fading outward, and a hand moving fast leaves a line that wanders and doubles back. This treatment sketches the outlines of the picture three times over, hatches the shadows and lets it all glow.

### How it works

1. Find the outlines with a blur and the Sobel operator.
2. Read them three times at slightly different, noisy positions, so each outline is drawn three times.
3. Hatch the dark areas with slanted strokes, and cross them in the darkest.
4. Colour the lines with one pen, or by position for a rainbow.
5. Add the line layer to a dark page with blurred copies of itself for the halo.

### The mathematics

Outlines are found with the blur-then-Sobel pipeline, but they are not drawn where they are. The edge map is looked up three times at each pixel, each time at a position nudged by a different slow noise, and the strongest of the three is kept. One true outline therefore appears as three lines that wander apart and together, like a pen going over the same contour again. Each pass is also faded in small patches by a hash, so the lines skip.

Shadows are hatched. The pixel’s position along a diagonal, divided by the spacing of the strokes, tells how far it is from the nearest stroke centre; it is inked if it is close enough and the picture there is dark enough. A second set of strokes on the other diagonal is added only in the deepest shadows. The finished line layer is drawn with additive blending, then again from copies shrunk to a quarter and a tenth of the size. Enlarging a small copy smears each line outward, and the sum is a hard core inside a soft halo. The rainbow pen takes its hue from the position on the page.

$$
a=\max_{j=1,2,3}\ S_{\theta,\,2.3\theta}\Big(E\big(\mathbf x+A\,\mathbf n_j(\mathbf x)\big)\Big),\qquad \theta=\operatorname{lerp}(0.17,\ 0.035,\ \text{detail})
$$
_Line opacity: the edge map E read at three noisy offsets n_j of size A = 1.5 + 9 × wobble pixels._

$$
s=\Big\lvert\operatorname{frac}\frac{x+y+\delta}{p}-\tfrac12\Big\rvert,\qquad \text{hatch}=\big(1-S_{0.05,\,0.11}(s)\big)\cdot S_{0.5,\,0.62}(1-L)
$$
_First hatching direction: strokes every p = 11 px, drawn where the picture is dark. δ is a slow sway._

$$
C=E+g\,\big(\operatorname{up}(E_{1/4})+\operatorname{up}(E_{1/10})\big)+0.28\,E
$$
_The glow: the line layer E plus enlarged small copies, all added; g grows with the glow slider._

### A short history

In 1935 Man Ray photographed himself drawing in the air with a small light, a series he called Space Writing. In 1949 the photographer Gjon Mili showed the technique to Picasso, who drew centaurs and bulls in light for Life magazine. Neon signs, patented by Georges Claude in 1915, made the glowing line part of the city. Drawing apps brought “glow” brushes to everyone in the 2010s.

### Where it is used

- Music and night event posters
- Stream overlays and channel art
- Tattoo and logo sketches
- Dark-mode wallpapers

### Try it

- A very unsteady hand turns outlines into scribbles. (https://lumenary-studio.vercel.app/style/glow-sketch?wobble=95&detail=40)
- The rainbow pen on navy with no hatching is pure line. (https://lumenary-studio.vercel.app/style/glow-sketch?pen=rainbow&paper=navy&hatch=0)
- Heavy hatching and little glow look like chalk at night. (https://lumenary-studio.vercel.app/style/glow-sketch?hatch=90&glow=25&pen=white)

### Words worth knowing

- **Hatching:** Shading with closely spaced parallel lines.
- **Bloom:** A soft halo of light round something bright.
- **Additive blending:** Combining colours by adding their light, so overlaps get brighter.

### See also

- 61 Neon glow
- 105 Blind Contour
- 98 Charcoal Sketch

## 110  Chalkboard  ·  _still_

- **Comes from:** School and café blackboards
- **Around:** About 1801 onward
- **Works best on:** Pictures with bright subjects and clear outlines

### Why it looks this way

Chalk is the one common drawing tool that works by adding light to a dark ground. It is also dry and crumbly, so it only sticks to the high points of the board and every stroke is a scatter of grains. And a board has a memory: yesterday’s work is never fully erased, only spread about. Those three facts make the look.

### How it works

1. Paint the board: uneven slate with broad eraser sweeps of old chalk.
2. Make a tooth map of the board’s high points.
3. Draw the outlines in chalk, broken by the tooth.
4. Rub chalk into the bright areas with slanted side-of-the-stick strokes.
5. With coloured sticks, choose the stick nearest in hue to the picture.
6. Add the wooden frame, the tray, chalk and an eraser.

### The mathematics

A board is never clean. Its colour is multiplied by slow noise, and a second noise, stretched sideways and bent by a third, marks the broad sweeps an eraser leaves; inside those sweeps the board is blended a little toward chalk white. Chalk itself only catches on the high points of the surface, so everything drawn is gated by a tooth map made of fine value noise and a per-pixel hash. That gate is what breaks every line into grains.

Chalk draws light, so the picture is used the other way round from a pencil sketch. Outlines come from the Sobel operator, read at two slightly displaced positions so the line doubles in places. Shading goes where the picture is bright: a target amount is computed from the blurred brightness and from a noise stretched along one slanted direction, which stands for strokes made with the side of the stick, and chalk lands where the tooth exceeds a threshold that falls as the target rises. With coloured sticks, each pixel takes the stick whose hue is nearest to the picture’s there, as long as the picture is colourful enough.

$$
C_{\text{board}}=C_0\,(0.8+0.34\,m)+(C_{\text{chalk}}-C_0)\,(0.05+0.2\,\text{wipe})\cdot\text{dust}
$$
_The slate: m is mottling noise, wipe the eraser sweeps, dust the smears slider._

$$
q=S_{0.42,\,0.95}(L)\cdot s\cdot(0.55+0.6\,\text{stroke}),\qquad \alpha=0.82\,S_{0.95-0.9q,\ 1.25-0.75q}(\text{tooth}+0.35)
$$
_Side-of-chalk shading: q is how much chalk is wanted, s the shading slider._

$$
\alpha_{\text{line}}=S_{\theta,\,2.2\theta}(E)\cdot S_{0.18,\,0.5}(\text{tooth}+0.25),\qquad\theta=\operatorname{lerp}(0.16,\ 0.05,\ \text{lines})
$$
_Outlines, broken by the tooth of the board._

### A short history

James Pillans, a headmaster in Edinburgh, is credited with hanging a large slate on the classroom wall around 1801 so that a whole class could see one lesson. By the mid nineteenth century blackboards were in almost every school. Green boards of enamelled steel arrived in the twentieth century because they were lighter and easier on the eyes. School “chalk” has long been made of gypsum, not true chalk.

### Where it is used

- Café menus and shop signs
- Teaching slides and lesson covers
- Wedding and party signs
- Back-to-school posts

### Try it

- Coloured sticks on black slate make a café menu board. (https://lumenary-studio.vercel.app/style/chalkboard?chalk=colour&board=black)
- Outlines alone, with no shading, read as a quick diagram. (https://lumenary-studio.vercel.app/style/chalkboard?shade=0&lines=90)
- A dusty board looks used all day. (https://lumenary-studio.vercel.app/style/chalkboard?dust=100&shade=80)

### Words worth knowing

- **Tooth:** The fine roughness of a surface that holds chalk.
- **Fractal noise:** Several layers of smooth noise, each finer and fainter than the last.
- **Threshold:** A cut-off value: above it one thing happens, below it another.

### See also

- 104 Pastel Chalk
- 98 Charcoal Sketch
- 27 Blueprint

## 111  Whiteboard  ·  _still_

- **Comes from:** Offices and classrooms
- **Around:** Dry-wipe markers from the 1970s
- **Works best on:** Clear shapes: objects, diagrams, faces

### Why it looks this way

A marker has one line width and a handful of colours. Whoever draws with it works fast, outlines the shapes, and fills dark areas with a few diagonal strokes that run dry before the end. The board itself is glossy, so there is glare, and it is never quite clean. The result is a drawing that explains something, which is what a whiteboard is for.

### How it works

1. Paint the board: near white, glare across it, faint smears of old ink.
2. Blur the picture well and outline its shapes at one even width.
3. Fill the dark areas with slanted strokes separated by gaps.
4. Let each stroke run dry, and cross the strokes in the darkest areas.
5. Pick black, red, green or blue for each area from the picture’s colour.
6. Add the aluminium frame, the tray, the markers and the eraser.

### The mathematics

The board is almost white: slightly grey toward the corners, crossed by a soft band of glare shaped like a bell curve, and tinted in places by smears of ink that were never quite wiped off. Those ghost marks are two fractal noises, each stretched hard in one direction and cut at a threshold. Outlines are found on a copy of the picture blurred twice, because a marker cannot draw hair, only shapes. The edge strength is cut at a threshold divided by the tip size, so a broader tip simply accepts weaker edges and the line fattens.

Shading is done in strokes. The position of a pixel across the stroke direction, divided by the stroke spacing, says whether it lies in a stroke or in the gap between two. A stroke is drawn only where the picture is dark enough, and a slow noise along its length makes it run dry and stop. The darkest areas get a second set of strokes across the first. Colour is chosen per pixel from the smoothed picture: black when the colour is dull or very dark, otherwise red, green or blue by hue. A colour has to be clearly a colour to earn a coloured marker.

$$
\text{glare}=0.035\,\exp\!\Big(-\Big(\frac{0.8u+0.6v-0.62}{0.14}\Big)^{2}\Big)
$$
_The band of light across the board; u and v are the position from 0 to 1._

$$
\alpha_{\text{line}}=S_{\theta/\tau,\ 1.5\theta/\tau}(E),\qquad \tau=\operatorname{lerp}(0.9,\ 2.6,\ \text{tip})
$$
_Outline from the edge strength E of the blurred picture; τ is the tip size._

$$
\text{marker}=\begin{cases}\text{black}&\max(R,G,B)-\min(R,G,B)<62\ \text{or}\ D>0.86\\ \text{red, green or blue}&\text{by hue otherwise}\end{cases}
$$
_Choice of marker from the smoothed colour; D is the darkness of the picture._

### A short history

Enamelled steel boards that could be written on and wiped were sold from the 1960s, but they needed a damp cloth. The dry-wipe marker, whose ink sits on the surface and brushes off, arrived in the mid 1970s. Offices adopted the whiteboard first, and during the 1990s it replaced the chalkboard in many schools, partly to keep chalk dust away from computers.

### Where it is used

- Explainer videos and course slides
- Workshop and meeting summaries
- Start-up pitch decks
- Tutorial thumbnails

### Try it

- Black only with a fine tip looks like a careful diagram. (https://lumenary-studio.vercel.app/style/whiteboard?pens=black&weight=15)
- A fat tip and little detail give a bold doodle. (https://lumenary-studio.vercel.app/style/whiteboard?weight=95&detail=25)
- Heavy ghost marks make a board nobody cleaned. (https://lumenary-studio.vercel.app/style/whiteboard?wear=100&fill=30)

### Words worth knowing

- **Dry-wipe ink:** Ink that dries as a film on a smooth board and rubs off without water.
- **Chroma:** How far a colour is from grey.
- **Ghosting:** Faint traces of old writing left on a board after erasing.

### See also

- 27 Blueprint
- 105 Blind Contour
- 53 Handwritten

## 112  Rotoscope  ·  _live_

- **Comes from:** Animation traced from live action
- **Around:** Patented in 1917, digital paint-overs since 2001
- **Works best on:** Video of people and faces; pictures with clear shapes

### Why it looks this way

Tracing a photograph by hand loses most of its detail and keeps what the artist thought mattered: a few flat tones and a firm line. Because the tracing is redone for every frame, nothing lines up exactly from one drawing to the next, and the edges shiver. That shiver, called boil, is what makes a rotoscoped film feel hand-made and a little dreamlike even when the movement underneath is perfectly real.

### How it works

1. Blur the frame slightly and cut its brightness into a few flat bands, keeping each pixel’s own colour.
2. Let the edges of the bands wander with noise that is new for every drawing.
3. Find the ink line where the brightness changes quickly, and thicken it.
4. Nudge the line and the colour by two different smooth random fields, so the colour slips out of the lines.
5. Make a fresh drawing only every second frame, on twos, and hold it in between.

### The mathematics

The fill is a posterisation of a blurred copy of the frame. With brightness l from 0 to 1, after a blur of about 2.2 pixels at 640 wide, the band is chosen from l' = l + 0.14 b (nu - 1/2), where nu is value noise that changes with the drawing number and b is the boil slider. The tones are n bands of width 1/n; the pixel keeps its own colour, scaled so that its brightness becomes the middle of its band, q/l, then pushed away from grey by a saturation factor of 0.75 to 1.65 and mixed with the blurred original by the wash slider.

The ink is the Sobel gradient magnitude of the brightness passed through a smoothstep from a to 1.7a, where a falls from 0.34 to 0.09 as the line slider rises; above half strength the line is thickened with a blur and a second threshold. Two smooth random fields, each value noise on a grid of 8 pixels and read back bilinearly, are renewed for every drawing and say how far to shift each pixel: one, up to 2.4 px times the boil, for the ink, and a different one, up to 5.5 px times the slip, for the colour. Because they differ, the fill and the line drift against each other. A new drawing is made every 1/24 s times 1, 2 or 3; in between, the last drawing is shown unchanged, which is the twos of animation.

$$
\ell'=\ell+0.14\,b\,(\nu-\tfrac12),\qquad q=\frac{\lfloor n\,\ell'\rfloor+\tfrac12}{n},\qquad \mathbf C=\frac{q}{\ell}\,\mathbf C_0
$$
_Posterising: l is the brightness, n the number of tones, b the boil slider and nu value noise renewed for every drawing._

$$
m=\operatorname{smoothstep}(a,\ 1.7a,\ |\nabla\ell|),\qquad a=0.34-0.25\,L
$$
_The ink line: the gradient is a Sobel filter and L is the line slider (0 to 1)._

$$
\mathbf C_{\text{out}}=(1-m)\,\mathbf C(\mathbf p+\mathbf d_C)+m\,\mathbf C_{\text{ink}},\qquad m=m(\mathbf p+\mathbf d_L)
$$
_The colour and the ink are read at different shifts, so they never agree exactly._

### A short history

The rotoscope was patented in 1917 by Max Fleischer, who had filmed his brother Dave in a clown suit and traced the frames to make Koko the Clown. Disney studied live-action film for Snow White (1937). In 1978 Ralph Bakshi made The Lord of the Rings largely over live action, and in 2001 Richard Linklater’s Waking Life used a computer to paint over video, a method refined for A Scanner Darkly (2006). Because every frame is drawn again, boil comes with the method, and is now often added on purpose.

### Where it is used

- Music videos and title sequences
- Animated documentaries and memoirs
- Turning phone video into a painted clip
- Posters and prints of faces

### Try it

- Three tones, a firm line and plenty of boil give a graphic-novel look. (https://lumenary-studio.vercel.app/style/rotoscope?levels=3&line=80&boil=70)
- Soft washed colour and little line looks like paint laid over film. (https://lumenary-studio.vercel.app/style/rotoscope?wash=75&line=20&levels=6)
- A new drawing only every third frame makes the boil slow and jerky. (https://lumenary-studio.vercel.app/style/rotoscope?rate=3)

### Words worth knowing

- **Boil:** The shimmer of lines and edges that appears when every frame is drawn separately.
- **On twos:** Drawing one new picture for every two frames of film, which is 12 drawings a second at 24 frames.
- **Posterise:** Reduce a continuous range of tones to a few flat levels.

### See also

- 106 Anime Cel
- 108 Crayon Cartoon
- 21 Comic book

## 113  Manga  ·  _still_

- **Comes from:** Japanese comics
- **Around:** Screentone in manga since the 1960s
- **Works best on:** Portraits in strong light; pictures with a clear subject

### Why it looks this way

A comic page is printed in black ink on white paper, so every shade has to be built from marks. Manga artists do it with screentone: a sheet of tiny dots or lines stuck on the page and cut away where it is not wanted. Fine dots read as a pale grey, coarse dots as a mid grey, hatching as a darker one. The few marks still carry light, shape and mood, and the speed lines say where the eye should go.

### How it works

1. Lift the local contrast, so that faces and folds keep their shape when only a few tones are left.
2. Cut the tone into bands: bare paper, fine dots, coarse dots, hatching, cross-hatching and solid black.
3. Fill each band with a screentone of its own, laid at 45 degrees and anti-aliased.
4. Find the ink line where the tone changes fast, and add thin dark features such as eyes and creases.
5. Optionally add speed lines, only in flat, light places, and a pale wash of the picture’s colour beneath it all.
6. Finish with paper grain and a black panel frame.

### The mathematics

The picture is first given a local contrast boost, T = l + 0.9 (l - l_bar), where l_bar is a heavy blur about W/28 pixels wide, so that faces and folds keep their shape in only a few tones. T is then cut into bands. Below a black threshold s (0.07 to 0.3 from the solid-black slider) it is solid ink; above that come cross-hatching, hatching, coarse dots (a quarter of the cell inked, 0.34), fine dots (0.13) and bare paper, with the band edges at about 0.33, 0.48, 0.63 and 0.8.

A dot screen lies on a lattice turned by 45 degrees. With u = (x + y)/(sqrt(2) p) and v = (x - y)/(sqrt(2) p) for a dot spacing p, the distance from the nearest lattice point is d = sqrt(du^2 + dv^2), and a dot covering a share delta of its cell has radius r = sqrt(delta/pi); the coverage is clamp((r - d) p + 1/2), an anti-aliased edge one pixel wide. Hatching is the same idea in one dimension. Speed lines are drawn in 132 sectors around the centre, each with its own width and jitter, or as horizontal bands for rushing sideways, and are allowed only where the picture is both light (T above 0.58) and flat (its blurred gradient below 0.06), so they pass behind a face instead of across it.

$$
T=\ell+0.9\,(\ell-\bar\ell)
$$
_Local contrast: l is the brightness and its bar a wide blur._

$$
u=\frac{x+y}{\sqrt2\,p},\quad v=\frac{x-y}{\sqrt2\,p},\qquad c=\operatorname{clamp}\Big(\big(\sqrt{\delta/\pi}-\sqrt{\Delta u^{2}+\Delta v^{2}}\big)\,p+\tfrac12\Big)
$$
_A screentone dot: du and dv are the offsets from the nearest lattice point, and delta the share of the cell that is inked._

$$
\text{ink}=\max\Big(\text{tone},\ \text{rays}\cdot S_{0.58,0.72}(T)\big(1-S_{0.018,0.06}(\overline{|\nabla T|})\big),\ \text{line}\Big)
$$
_Speed lines fill only light, flat places; the outline is drawn over everything. S is smoothstep._

### A short history

Modern manga took shape in the postwar years with Osamu Tezuka, whose cinematic panels and large-eyed faces set the style from 1947. Early pages were shaded by hand with ink. From the 1960s, adhesive sheets printed with dots and lines, cut to shape with a craft knife and pressed onto the page, let artists cover large areas quickly, and by the 1980s there were hundreds of patterns to choose from. Today most tone is laid digitally, but the dot patterns are the same ones.

### Where it is used

- Comic and graphic-novel panels
- Profile pictures and posters
- Black and white print and zines
- Storyboards and character sheets

### Try it

- A burst of speed lines behind a portrait makes it an instant action frame. (https://lumenary-studio.vercel.app/style/manga?speed=focus&line=70&black=60)
- Larger tone on a cream page looks like an old printed volume. (https://lumenary-studio.vercel.app/style/manga?tone=160&paper=cream)
- A wash of colour under the tones makes a manga cover. (https://lumenary-studio.vercel.app/style/manga?wash=wash&paper=cream)

### Words worth knowing

- **Screentone:** A sheet printed with a pattern of dots or lines that is stuck onto a comic page to make grey.
- **Speed lines:** Straight lines drawn behind a subject to show movement or to focus the eye on it.
- **Cross-hatching:** Two sets of parallel lines drawn across each other to make a darker tone.

### See also

- 21 Comic book
- 80 Halftone
- 102 Pencil Hatching

