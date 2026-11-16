# H. Photographic and optical

Source: https://lumenary-studio.vercel.app/theory/optical (captured 2026-11-16 for private study).

Lenses, film and light leaks: what a camera adds when light passes through glass and chemistry.

## 114  Lomography  ·  _still_

- **Comes from:** A Soviet compact camera, then a Vienna photography movement
- **Around:** 1984 camera, 1990s movement
- **Works best on:** Everyday scenes, street and travel snapshots

### Why it looks this way

Lomography celebrates what a cheap plastic camera does wrong: colours too rich, shadows too dark, corners lost, edges soft and now and then a stripe of light leaking where the camera back does not close. Each fault is recreated in turn, and together they say that the picture was taken quickly and happily, without worrying about technical quality.

### How it works

1. Scale each colour’s distance from its own luminance to boost saturation, and multiply the channels by gains for a colour cast.
2. Apply an S shaped contrast curve whose shoulders flatten more as it grows.
3. Lay a blurred copy over the sharp one through a radial mask, clear in the middle and increasingly soft towards the corners.
4. Add one or two large radial gradients near the edge, in colours matching the cast, with screen blending, which can only brighten.
5. Darken the corners with a vignette and add grain.

### The mathematics

Lomography is the look of a cheap plastic camera and film that was never meant to be pushed this far: colours too rich, shadows too dark, corners lost, the edges of the frame soft, and now and then a stripe of light that has crept in where the back of the camera does not close. Each of those faults is made in turn. Saturation scales every colour’s distance from its own luminance (by 0.6 to 1.9). A colour cast multiplies the three channels by gains, for example warm is (1.06, 1.0, 0.84). Contrast is an S-shaped curve whose shoulders flatten more as it grows.

The cheap lens is a blurred copy of the picture (one sixth of the size, enlarged) laid over the sharp one through a radial mask: clear inside a circle of 0.28 of the short side, then rising to 35% to 100% opacity at the corners, so only the middle is sharp. Light leaks are one or two large radial gradients, warm or coloured to match the cast, placed near the edge and added with screen blending, which can only brighten. The dark corners (a vignette) and the grain are added last.

$$
c'=\operatorname{clip}\Big(g_c\,\big[\,l+\sigma\,(c-l)\,\big]\Big),\qquad \sigma=0.6+1.3\,s
$$
_Saturation s and the colour cast gain g_c for each channel c; l is the luminance._

$$
y=\tfrac12+\frac{x}{1+1.1\,(k-1)\,\lvert x\rvert}\,\big(1+0.28\,(k-1)\big),\qquad x=k\,(v-\tfrac12)
$$
_The contrast curve for a contrast factor k = 1 + 1.1 × the slider._

$$
C=1-(1-C_0)\,(1-C_{\text{leak}})
$$
_Screen blending of a light leak over the picture._

### A short history

The LOMO LC-A was a compact camera made in Leningrad from 1984. Students from Vienna found one in Prague in the early 1990s, loved its saturated, vignetted pictures and founded the Lomographic Society in 1992, with a playful list of rules such as shoot from the hip and do not think. Lomography then spread through film shops and later phone apps.

### Where it is used

- Travel and street photo looks
- Social posts with a vintage film feel
- Event and party photo galleries
- Moodboards and fashion snapshots

### Try it

- Strong leak and a green cast look like an expired roll. (https://lumenary-studio.vercel.app/style/lomography?leak=85&cast=green)
- Heavy vignette with high contrast is the classic toy-camera look. (https://lumenary-studio.vercel.app/style/lomography?vig=90&contrast=80)
- Cool cast with little leak is calmer. (https://lumenary-studio.vercel.app/style/lomography?cast=cool&leak=10)

### Words worth knowing

- **Vignette:** Darkening toward the corners of a picture.
- **Light leak:** Stray light that reaches the film through a gap and leaves a bright streak.
- **Screen blend:** A way of combining layers that can only brighten the result.

### See also

- 115 Film Grain
- 122 Cross-Processed
- 29 Retro VHS

## 115  Film Grain  ·  _still_

- **Comes from:** Photographic emulsions
- **Around:** 19th century onward
- **Works best on:** Portraits and street scenes with mid tones

### Why it looks this way

Film makes its picture from tiny silver crystals, and where there are few of them, or where they are nearly all exposed, the picture is smooth. In the middle tones the clumps show most. So grain is not uniform noise: it is strongest in the mid tones, weaker in deep shadow and bright highlights, and it picks up a faint colour from the dyes. A film stock also has its own tone curve and colour balance.

### How it works

1. Lift the darkest level to a toe value and hold the lightest below a shoulder value, with a gentle S in between.
2. Apply the colour balance of the chosen stock: black and white, a warm portrait film, vivid slide film or cool night film.
3. Make grain from soft blobs at the grain size plus a fine speckle, with strength following a parabola that peaks in the mid tones.
4. On colour stocks give each channel 60 percent shared grain and 40 percent its own.
5. Add halation, a red-orange fringe from highlights bouncing through the film base, then dust, scratches and faded blacks.

### The mathematics

A film stock is a recipe of three things: a tone curve, a colour balance and a grain. The tone curve here lifts the darkest level to a toe value and holds the lightest below a shoulder value, with a gentle S in between made by mixing a straight line (55%) with a smoothstep (45%). Four stocks are modelled: a black-and-white 400, a portrait colour film that is a little desaturated and warm, a vivid slide film, and a cool, grainy night film. The faded blacks slider then lifts everything toward grey by up to 12%, the milky shadows of an old print.

Grain is silver crystals clumped together, so it is not uniform noise. Its strength follows the parabola 0.2 + 3.2 l (1 − l), strongest in the mid-tones and weaker in deep shadow and bright highlights, where the film is nearly empty or nearly saturated. It is made of soft blobs (smooth noise at the grain size) plus a fine speckle (white noise). On colour stocks each channel receives 60% of a shared grain and 40% of its own, so the grain is faintly coloured. Halation is the red-orange fringe made when bright light bounces back through the film base: the picture is shrunk to one eighth, its highlights are kept and tinted, and the result is blown up and screened back. Dust, hairs and long scratches are drawn at random on top.

$$
f(v)=t_0+(t_1-t_0)\,\big[\,0.55\,v+0.45\,\operatorname{smoothstep}(0,1,v)\,\big]
$$
_t₀ is the stock’s toe and t₁ its shoulder._

$$
n=A\,\mu(l)\,\Big[\,1.5\,\big(\nu-\tfrac12\big)+0.9\,\big(r-\tfrac12\big)\Big],\qquad \mu(l)=0.2+3.2\,l\,(1-l)
$$
_Grain: ν smooth noise at grain size, r white noise, A = 0.27 × the amount slider × the stock’s grain factor._

$$
H=\operatorname{smoothstep}(0.62,\ 0.95,\ L_{1/8})\cdot(1,\ 0.38,\ 0.16)
$$
_Halation: the highlights of the one-eighth-scale picture, tinted red-orange (grey for black and white film)._

### A short history

Photographic film coated with light sensitive silver halide crystals replaced glass plates at the end of the nineteenth century. Kodak Tri-X, introduced in 1954, became a favourite of photojournalists for its grain and speed, and later stocks such as Fuji Velvia in 1990 and Kodak Portra in the late 1990s gave particular looks to colour. Film grain is still added to digital footage to make it feel organic.

### Where it is used

- Photo and video colour grading
- Portrait and wedding retouching looks
- Posters with a film texture
- Cinematic stills

### Try it

- Black and white film with coarse grain looks like 1960s reportage. (https://lumenary-studio.vercel.app/style/film-grain?stock=tri&size=3.5&amount=80)
- Portra with light grain is warm and gentle. (https://lumenary-studio.vercel.app/style/film-grain?stock=portra&amount=30)
- Strong halation gives a glowing, dreamy red fringe. (https://lumenary-studio.vercel.app/style/film-grain?halation=85)

### Words worth knowing

- **Silver halide:** The light sensitive crystals that form an image on traditional film.
- **Halation:** A glow around bright highlights caused by light bouncing back through the film.
- **Toe and shoulder:** The curved ends of a tone curve, where shadows and highlights are gently compressed.

### See also

- 114 Lomography
- 122 Cross-Processed
- 123 Daguerreotype

## 116  Infrared  ·  _still_

- **Comes from:** Scientific and fine art photography
- **Around:** 1910 onward
- **Works best on:** Landscapes with trees, grass and open sky

### Why it looks this way

Chlorophyll reflects near-infrared light very strongly, so in infrared photography green leaves glow nearly white and a blue sky, which reflects very little, goes almost black. A screen can show only visible light, so this treatment estimates the infrared brightness from colour: how green a pixel is, and how blue, pushes it up or down.

### How it works

1. Measure greenness as how far green leads the larger of red and blue, scaled by the foliage slider.
2. Measure blueness as how far blue leads the larger of red and green, scaled by the sky slider.
3. Estimate infrared brightness as mostly green with a little red and blue, boosted by greenness and pulled down by blueness.
4. Render it as black and white, as false colour with red and blue swapped, or as pink foliage that records infrared as red.
5. Add a dreamy glow from the highlights of a small copy screened back on, then a light vignette and grain.

### The mathematics

Chlorophyll reflects near-infrared light very strongly, so in infrared photography green leaves glow nearly white, and a blue sky, which reflects little, goes almost black. A screen can only show the visible spectrum, so the program estimates the infrared brightness from colour. The greenness is how far the green channel leads the larger of red and blue, γ = clip((G − 0.85 max(R, B)) × 3.2), scaled by the foliage slider. The blueness is clip((B − 0.9 max(R, G)) × 3), scaled by the sky slider. The estimate is mostly green and a little red and blue, boosted by the greenness and pulled down by the blueness.

Three renderings are offered. Black and white simply shows that estimate. False colour makes the channel swap used in digital infrared photography, in which red and blue exchange roles and infrared feeds the blue, so foliage turns pale cyan-white. Pink foliage records infrared as red, which makes leaves pink and shifts red objects toward yellow. A dreamy glow follows: highlights of a copy at one seventh the size are kept and screened back on. A light vignette and grain finish it.

$$
\gamma=\operatorname{clip}\big[\,3.2\,(G-0.85\max(R,B))\,\big]\,\lambda,\qquad \beta=\operatorname{clip}\big[\,3\,(B-0.9\max(R,G))\,\big]\,\kappa
$$
_Greenness γ and blueness β; λ is the foliage slider and κ the sky slider._

$$
\iota=\operatorname{clip}\big(0.18\,R+0.62\,G+0.1\,B+0.65\,\gamma-0.5\,\beta\big)
$$
_The estimated infrared brightness: leaves up, sky down._

$$
(R',G',B')=\Big(0.9\,(1-0.35\,\beta)\,B+0.12\,\iota,\ \ 0.55\,G+0.45\,\iota,\ \ 0.55\,R+0.55\,\iota+0.2\,\gamma\Big)
$$
_False colour: red and blue are swapped and infrared leads the blue channel._

### A short history

The American physicist Robert W. Wood published the first infrared landscape photographs in 1910, and the glow of foliage is still called the Wood effect. Kodak’s Aerochrome film, developed in the 1940s for spotting camouflage, turned foliage red and later became a favourite of artists. Digital cameras can be converted to infrared today.

### Where it is used

- Surreal landscape and nature art
- Album and book cover images
- Fashion and editorial colour looks
- Dreamy backgrounds

### Try it

- Pink foliage is the classic dreamlike look. (https://lumenary-studio.vercel.app/style/infrared?mode=pink&leaf=85)
- Black and white with a dark sky is stark and graphic. (https://lumenary-studio.vercel.app/style/infrared?mode=mono&sky=90)
- High glow with low contrast feels soft and ethereal. (https://lumenary-studio.vercel.app/style/infrared?glow=85&contrast=20)

### Words worth knowing

- **Near-infrared:** Light just beyond visible red, invisible to the eye but recorded by some sensors.
- **Wood effect:** The bright appearance of foliage in infrared photographs.
- **False colour:** Colour that does not come from the real scene but from a chosen mapping.

### See also

- 36 Thermal Camera
- 35 Night Vision
- 122 Cross-Processed

## 117  Tilt-Shift  ·  _still_

- **Comes from:** View cameras and architectural photography
- **Around:** Lenses from the 1900s, miniature effect from the 2000s
- **Works best on:** High-angle city, harbour and crowd scenes

### Why it looks this way

A tilt-shift lens tips its plane of focus so that only a thin band is sharp and the rest falls quickly into blur. That is also what happens when you photograph a tiny scene up close, so a street photographed this way tricks the brain into seeing a model. Boosted colour and contrast add the gloss of a toy.

### How it works

1. Build five versions of the picture in advance, with blur radii of 0, 1.6, 3.6, 7 and 12 pixels scaled by the blur slider.
2. For each pixel measure its distance from the band: a straight line through the focus point, tilted by the angle slider, or an ellipse for the radial shape.
3. Pass the distance through a smoothstep that starts at the band’s half width and ends further on, scaled to a position among the five levels.
4. Mix the two nearest levels linearly so blur grows smoothly.
5. Raise saturation and contrast, up to 1.85 and 1.45 times, for the look of glossy paint.

### The mathematics

A tilt-shift lens tips its plane of focus, so only a thin band is sharp and the rest falls quickly into blur. That is the cue we associate with macro photography of a tiny scene, which is why a street photographed this way looks like a model. The program builds five versions of the picture in advance (blur radii 0, 1.6, 3.6, 7 and 12 px, all scaled by the blur slider) and chooses between them for each pixel by its distance from the band. For a straight band this is the distance to a line through the focus point tilted by the angle slider; for the radial shape it is an ellipse, slightly squeezed horizontally.

The distance passes through a smoothstep, starting at the half-width of the band and ending 0.38 of the picture height further on, and is scaled to a position between 0 and 4 along the five levels. The pixel is a linear mix of the two nearest levels, so the blur grows smoothly. Finally colour and contrast are raised (saturation up to 1.85 times, contrast up to 1.45), the glossy paint of a toy.

$$
t=4\,\operatorname{smoothstep}\!\Big(h,\ h+0.38\,H,\ \big\lvert(\mathbf x-\mathbf c)\cdot\mathbf n\big\rvert\Big),\qquad \mathbf n=(-\sin\alpha,\ \cos\alpha)
$$
_Position along the blur levels; h is half the band width, c the focus point, α the tilt. For the radial shape the distance is √((1.15 Δx)² + Δy²)._

$$
C=(1-\phi)\,B_{\lfloor t\rfloor}+\phi\,B_{\lfloor t\rfloor+1},\qquad \phi=t-\lfloor t\rfloor
$$
_B₀ is the sharp picture, B₁ to B₄ the blurred ones._

$$
C'=\tfrac12+k_c\Big(l+k_s\,(C-l)-\tfrac12\Big)
$$
_The model-making boost: saturation k_s and contrast k_c._

### A short history

Tilt and shift movements on view cameras were used in the nineteenth and twentieth centuries to control perspective in architecture, using principles described by Theodor Scheimpflug in 1904. In the early 2000s photographers such as Olivo Barbieri used them on cities seen from above, and the miniature look became a popular effect in photography and video.

### Where it is used

- Cityscape and travel photo effects
- Toy and diorama style posters
- Real estate and architecture mock-ups
- Playful video and thumbnail looks

### Try it

- A thin band near the top feels like a tiny city seen from a roof. (https://lumenary-studio.vercel.app/style/tilt-shift?focus=35&width=10)
- A radial shape keeps the middle sharp like a macro lens. (https://lumenary-studio.vercel.app/style/tilt-shift?shape=radial&blur=85)
- Tilt the band to lean the focus across the scene. (https://lumenary-studio.vercel.app/style/tilt-shift?angle=20)

### Words worth knowing

- **Plane of focus:** The flat slice of the scene that is perfectly sharp.
- **Scheimpflug principle:** The rule that explains how tilting a lens tilts the plane of focus.
- **Depth of field:** The range of distances that appear acceptably sharp.

### See also

- 120 Bokeh
- 41 Depth Parallax
- 42 Isometric

## 118  Kaleidoscope  ·  _still_

- **Comes from:** Optical toys
- **Around:** 1816 onward
- **Works best on:** Colourful, busy pictures and flowers

### Why it looks this way

A kaleidoscope is two mirrors set at an angle that folds a view into repeated copies of a single wedge, each reflected from the last. That reflection is what makes the joins seamless. This treatment folds the angle of every pixel into one wedge and uses it to read the picture, so a fan shaped piece of your picture repeats all the way around.

### How it works

1. For each pixel find its polar angle about the centre, subtract the turn, and take it modulo the wedge angle 2π divided by n.
2. If the result lies in the second half of the wedge, mirror it back so neighbouring wedges are reflections.
3. Use the folded angle as a direction in the source picture, and the pixel’s distance from the centre, shrunk by the zoom, as how far to look.
4. Reflect any coordinate that leaves the picture back in, so there are no empty areas.
5. Sample with bilinear interpolation and optionally darken the pixels near each mirror line by up to 40 percent.

### The mathematics

A kaleidoscope is two mirrors set at an angle of π/n, which fold the view into n copies of one wedge, alternately reflected. For each pixel the program works out its polar angle φ about the centre, subtracts the turn, and takes it modulo the wedge angle 2π/n. If the result lies in the second half of the wedge it is mirrored back (2π/n minus the value), so neighbouring wedges are reflections of each other and their joins are seamless.

That folded angle is then used as a direction in the source picture. The point looked up is a window centre (the look-left-to-right and up-and-down sliders) plus the pixel’s distance from the centre, shrunk by the zoom, along the direction (cos, sin) of the folded angle plus the rotation of the wedge. In other words the wedge is a fan-shaped piece of the picture. When the lookup would leave the picture its coordinate is reflected back in, as with a mirror, so the pattern has no empty areas. The picture is sampled with bilinear interpolation. The optional dark joins darken the pixels within a few pixels of each mirror line by up to 40%.

$$
\varphi'=\big(\varphi-\tau\big)\bmod\frac{2\pi}{n},\qquad \psi=\begin{cases}\varphi' & \varphi'\le \pi/n\\[2pt] 2\pi/n-\varphi' & \text{otherwise}\end{cases}
$$
_Folding the angle: τ is the turn of the pattern, n the number of mirrors._

$$
\mathbf s=\mathbf c_0+2\,k\,r\,\big(\cos(\psi+\sigma),\ \sin(\psi+\sigma)\big)
$$
_The source point: c₀ the window centre, r the distance from the pattern’s centre, k half the zoom, σ the wedge rotation._

$$
\operatorname{refl}_L(v)=L-\big\lvert\,L-(v\bmod 2L)\,\big\rvert
$$
_Reflecting a coordinate back into the picture of width (or height) L._

### A short history

Sir David Brewster invented the kaleidoscope in Scotland in 1816 and patented it in 1817. The name comes from Greek words meaning beautiful form to see. It was a sensation within a few years, with hundreds of thousands sold in London in months, and the same mirror symmetry underlies the patterns of tiles, textiles and mandalas.

### Where it is used

- Mandala and pattern design
- Textile and wallpaper concepts
- Psychedelic poster and cover art
- Backgrounds and loops

### Try it

- Twelve mirrors make a fine snowflake. (https://lumenary-studio.vercel.app/style/kaleidoscope?n=12&zoom=60)
- Zoom in and slide the window to find new patterns in one picture. (https://lumenary-studio.vercel.app/style/kaleidoscope?zoom=150&sx=30&sy=70)
- Turn off the dark joins for a seamless fold. (https://lumenary-studio.vercel.app/style/kaleidoscope?rim=false)

### Words worth knowing

- **Wedge:** A pie slice of the picture that is repeated all around.
- **Reflection:** Flipping a shape as though in a mirror.
- **Modulo:** The remainder after dividing, used to wrap an angle into a range.

### See also

- 187 Mandala
- 131 Truchet Tiles
- 132 Op Art Moire

## 119  Anaglyph 3D  ·  _still_

- **Comes from:** 19th century stereoscopy
- **Around:** 1850s onward, popular in the 1950s and 2010s
- **Works best on:** Landscapes and scenes with a clear foreground and background

### Why it looks this way

Your two eyes see a scene from slightly different places, and near things shift more between the two views than far things do. A single photograph carries no depth, so the program guesses one, shifts each eye’s view sideways by it, and then colours the two views so that a pair of coloured glasses separates them again for each eye.

### How it works

1. Guess a depth map from a heavily blurred lightness: bright is near, dark is near, a ground plane in which lower means nearer, or a mix.
2. Shift each pixel sideways by its depth minus the focus depth, up to 46 pixels.
3. Look up the left view at x minus the shift, and the right view at x plus the shift, with bilinear sampling.
4. Pixels at the focus plane do not shift and sit at the screen, while nearer and farther ones separate in opposite directions.
5. Combine the two views by the glasses: red from the left and green and blue from the right for red and cyan, and so on, optionally keeping some original colour.

### The mathematics

The two eyes see a scene from slightly different places, and nearer things shift more between the two views than farther ones (parallax). A single photograph carries no depth, so the program guesses a depth map d from a heavily blurred lightness (two box blurs of about 6 px at 800 px). You choose the guess: bright is near, dark is near, a ground plane in which lower in the frame means nearer, or a mix of lightness (55%) and ground (45%). Each pixel is then moved sideways by s = (d − d_focus) × up to 46 px. The left view looks up the picture at x − s and the right at x + s, with bilinear sampling. Pixels at the focus plane do not shift at all and sit at the screen; nearer and farther ones separate in opposite directions.

Coloured glasses then sort the two views to the two eyes. Red and cyan: the red filter passes only the red channel, so the output takes red from the left view and green and blue from the right. Magenta and green take red and blue from the left and green from the right. Amber and blue take red from the left, blue from the right and mostly the left’s green. The keep-colour slider mixes each view with its own luminance first: at 0 each view is grey and only the fringes carry colour, at 1 the full colour of the picture is kept (and the eyes argue a little).

$$
s=(d-d_f)\cdot 46\,\kappa\,\frac{W}{800},\qquad d=\begin{cases}L_b & \text{bright is near}\\ 1-L_b & \text{dark is near}\\ y/H & \text{ground}\\ 0.55\,L_b+0.45\,y/H & \text{mixed}\end{cases}
$$
_Disparity: d is the guessed depth from the blurred luminance L_b, d_f the focus plane and κ the depth slider._

$$
\mathbf a=C(x-s,\ y),\qquad \mathbf b=C(x+s,\ y),\qquad \mathbf a'=l_a+k\,(\mathbf a-l_a)
$$
_The two views (left a, right b) and the keep-colour mixing with each view’s own luminance l._

$$
(R,G,B)_{\text{red-cyan}}=\big(a'_R,\ \ b'_G,\ \ b'_B\big)
$$
_What the glasses combine; for the other pairs the channels are assigned as described above._

### A short history

Charles Wheatstone described the stereoscope in 1838, and Wilhelm Rollmann made the first anaglyphs in 1853 by printing two views in complementary colours. Louis Ducos du Hauron patented the process for photographs in 1891. Red and cyan 3D appeared in books, comics and cinema in the twentieth century, and again in the 2010s on early home 3D.

### Where it is used

- 3D poster and comic effects
- Retro science and sci-fi graphics
- Teaching how depth perception works
- Playful photos for glasses owners

### Try it

- Deep, strong 3D with mixed depth looks dramatic through glasses. (https://lumenary-studio.vercel.app/style/anaglyph-3d?depth=90&src=mix)
- Magenta and green glasses use another pair of colours. (https://lumenary-studio.vercel.app/style/anaglyph-3d?glasses=mg)
- Keep more original colour to hide the red and blue fringes. (https://lumenary-studio.vercel.app/style/anaglyph-3d?keep=90)

### Words worth knowing

- **Parallax:** The apparent shift of near objects against far ones when the viewpoint changes.
- **Stereoscopy:** Giving an illusion of depth with two slightly different images.
- **Anaglyph:** A picture made of two views in different colours, sorted by coloured glasses.

### See also

- 41 Depth Parallax
- 124 Chromatic Aberration
- 125 Lenticular

## 120  Bokeh  ·  _still_

- **Comes from:** Lens optics and photography
- **Around:** The word spread in the 1990s
- **Works best on:** Night scenes and pictures with scattered bright lights

### Why it looks this way

Out of focus, every point of light in a scene turns into a small image of the lens opening, and the blur that results is called bokeh. Bright points make bright discs, and the shape of the aperture decides whether they are round, hexagonal or even heart shaped. This treatment blurs the picture and then scatters discs of light where the picture is brightest.

### How it works

1. Shrink the picture to a very small size and enlarge it again for a cheap blur, laid over a near black field.
2. Lay a grid of cells about 1.05 times the disc size and place one candidate disc in each at a jittered position.
3. Keep a candidate with a probability that rises steeply with the brightness of the small picture there.
4. Give each kept disc the colour of the picture, boosted toward full brightness, and draw it with additive blending at low opacity, so overlaps add up.
5. Draw a thin brighter ring on its rim, in the aperture shape: circle, hexagon, pentagon, star or heart.

### The mathematics

Out of focus, every point of light in a scene becomes a small image of the lens opening, and the blur that results is called bokeh. The program first makes a cheap blur: the picture is shrunk to between about 35 and 200 pixels across (the out-of-focus slider sets how far) and enlarged again, laid at 78% on a near-black field. Then it places discs of light. A grid of cells of about 1.05 times the disc size is laid over the picture and each cell is given one candidate disc at a jittered position. The candidate is kept with a probability that rises steeply with the brightness of the small picture at that point, scaled by the how-many-lights slider, so highlights become discs and shadows stay dark.

A kept disc takes the colour of the picture there, boosted toward full brightness, and is drawn with additive blending at low opacity, so where discs overlap their light adds up. A thin brighter ring is drawn on its rim, as in lenses whose bokeh is brighter at the edge. The aperture shape is a regular polygon (a hexagon for six blades, a pentagon for five), a ten-point star whose points alternate between the full radius and 0.48 of it, a heart made of two Bézier curves, or a plain circle. Each disc has a random size (0.45 to 1.3 times the size slider, a bit bigger when the light is bright) and a random rotation.

$$
P(\text{disc})=\operatorname{smoothstep}\big(0.7\,\vartheta,\ \vartheta+0.35,\ l\big)\,\big(0.04+0.62\,\delta\big)
$$
_The chance that a cell holds a disc: l is the lightness of the small picture, ϑ the lights-come-from threshold, δ the density._

$$
\mathbf v_j=\mathbf c+\rho_j\big(\cos(\theta_0+\tfrac{2\pi j}{m}),\ \sin(\theta_0+\tfrac{2\pi j}{m})\big),\qquad \rho_j=\begin{cases}r & \text{polygon}\\ r,\ 0.48\,r\ \text{alternately} & \text{star}\end{cases}
$$
_The vertices of a disc: m is 6, 5 or 10 and θ₀ a random turn._

$$
C=\min\Big(255,\ \sum_i \alpha_i\,\mathbf c_i\,\mathbb 1_{\text{disc}_i}(\mathbf x)\Big),\qquad \alpha_i=0.05+0.15\,g\,\big(0.5+0.5\,l_i\big)
$$
_Additive blending of the discs over the blurred picture; g is the brightness slider._

### A short history

The word comes from the Japanese boke, meaning blur or haze. It was popularised in English in the late 1990s by the photographer and writer Mike Johnston in Photo Techniques magazine. Photographers choose lenses partly for the character of their bokeh, which depends on the aperture blades and the lens design.

### Where it is used

- Night and city photo effects
- Festive and celebration backgrounds
- Portrait and wedding photo looks
- Dreamy wallpapers

### Try it

- Heart shaped lights are a ready-made romantic look. (https://lumenary-studio.vercel.app/style/bokeh?shape=heart&size=55)
- Many tiny discs make a field of sparkles. (https://lumenary-studio.vercel.app/style/bokeh?size=18&density=90)
- Hexagonal discs with strong rims look like a real lens. (https://lumenary-studio.vercel.app/style/bokeh?shape=hex&ring=85)

### Words worth knowing

- **Aperture:** The adjustable opening in a lens that lets light in.
- **Additive blending:** Combining lights by adding their brightness.
- **Circle of confusion:** The blur disc made by a point of light that is out of focus.

### See also

- 117 Tilt-Shift
- 61 Neon glow
- 115 Film Grain

## 121  Double Exposure  ·  _still_

- **Comes from:** Early photography and cinema
- **Around:** 1860s onward, a design trend in the 2010s
- **Works best on:** Portraits and profiles against a plain background

### Why it looks this way

When two pictures are recorded on one frame of film, light adds, so one picture shows through wherever the other was dark. This treatment recreates that with a window: the photograph’s tones decide where a second scene shows through, and the two are toned in the same pair of inks so they feel like one image. The second scene is drawn from scratch, with distant layers lighter than near ones for depth.

### How it works

1. Tone the photograph into two inks, a dark and a light one, with a ramp over its lightness.
2. Compare its blurred tones with a level, using a smoothstep whose width is the softness of the window, and decide whether dark or light parts open it.
3. Draw the second scene in the same inks: mountains from layered noise, pine rows from stacked triangles, a city from three ranks of buildings, or a moon with stars and clouds.
4. Make each far layer lighter and each near one darker, with fog between them for aerial perspective.
5. Inside the window mix the scene in with a screen blend, 80 percent replacement and 20 percent film, with the photograph’s lightness modulating the scene’s brightness.

### The mathematics

In a double exposure two pictures are recorded on one frame. Light adds on the film, so one picture shows through wherever the other was dark. The program imitates it with a window. The photograph is toned into two inks (a dark and a light one, chosen by the ink slider) by a ramp over its lightness. Its tones, blurred twice at about 5 px, are then compared with a level: where the tone passes the level, by a smoothstep whose width is the softness of the window, the window is open. You choose whether the dark or the light parts open it.

The second scene is drawn from scratch, in the same two inks. Mountains are six ridgelines made of layered noise, pines are rows of stacked triangles, a city is three ranks of buildings with scattered lit windows, and the moon is a disc with stars and bands of cloud. Each far layer is lighter and each near one darker, with a gradient of fog between them, the aerial perspective that makes the depth. Inside the window the scene replaces the photograph and is mixed with a screen blend, 80% replacement and 20% film. The photo detail slider lets the lightness of the photograph modulate the brightness of the scene, so its face or its shapes are still readable.

$$
m=\operatorname{smoothstep}\big(\lambda-\sigma,\ \lambda+\sigma,\ v\big),\qquad v=\begin{cases}L_b&\text{light opens}\\ 1-L_b&\text{dark opens}\end{cases}
$$
_The window: λ is the level slider and σ = 0.02 + 0.5 × the softness slider._

$$
s'=s\cdot\operatorname{clip}\big(0.87+0.9\,D\,(L-\tfrac12),\ 0,\ 1.15\big)
$$
_The scene’s brightness follows the photograph’s lightness L; D is the photo detail slider._

$$
C=0.8\Big[(1-0.96\,m)\,b+0.96\,m\,s'\Big]+0.2\Big[255-\frac{(255-b)\,(255-0.55\,m\,s')}{255}\Big]
$$
_The base b (the toned photograph) with the scene inside the window, plus a screen blend of the two._

### A short history

Double exposures happened by accident in the earliest photographs and were used on purpose in the 1860s by spirit photographers who printed ghostly figures over portraits. Filmmakers such as Georges Méliès used them for early special effects. The portrait-with-a-landscape version became a design trend in the 2010s, and it was widely seen in the title sequence of the TV series True Detective in 2014.

### Where it is used

- Poster and album cover art
- Portrait and nature composites
- Film title and social media graphics
- Gifts and prints with a symbolic image

### Try it

- Pines in forest green make a classic woodland portrait. (https://lumenary-studio.vercel.app/style/double-exposure?scene=pines&tint=forest)
- A moon scene in blue is quiet and nocturnal. (https://lumenary-studio.vercel.app/style/double-exposure?scene=moon&tint=blue)
- Let the light parts open the window instead of the dark. (https://lumenary-studio.vercel.app/style/double-exposure?fill=light)

### Words worth knowing

- **Double exposure:** Recording two images on a single frame of film.
- **Aerial perspective:** The way distant things look paler and bluer because of the air between.
- **Screen blend:** A way of combining layers so the result is never darker than either.

### See also

- 13 Surreal
- 63 Duotone
- 62 Aurora

## 122  Cross-Processed  ·  _still_

- **Comes from:** Darkroom and lab experiments
- **Around:** 1990s fashion and art photography
- **Works best on:** Street, fashion and landscape photographs with bold colour

### Why it looks this way

Cross processing means developing film in the chemistry meant for another kind of film. The three dye layers then respond to light in unusual ways, each with its own tone curve, so shadows lean towards one hue, highlights towards another and contrast jumps. This treatment stores each look as a curve per colour channel and applies them to your picture.

### How it works

1. Store each look as a list of knots for each of the red, green and blue channels.
2. Join the knots with a Catmull-Rom spline, a smooth curve that passes through every knot, and evaluate it once for each of the 256 input values to make a lookup table.
3. Look up every channel of every pixel in its own table and mix the original with the result by the strength slider.
4. Scale saturation around luminance and lift the blacks for the faded look.
5. Add a vignette and grain.

### The mathematics

Cross processing means developing a film in the chemistry meant for another kind of film. The three dye layers then respond to light in unusual ways, each with its own tone curve, so the shadows lean toward one hue, the highlights toward another and the contrast jumps. The program stores each look as a list of knots for each channel, for example the blue curve of slide film in colour-negative chemistry starts at 0.17 and ends at 0.74, and joins them with a Catmull-Rom spline, a smooth curve that passes through every knot. The curve is evaluated once for each of the 256 input values and kept as a lookup table.

Each channel of each pixel is looked up in its own table, and the strength slider mixes the original with the result. Saturation is then scaled around the luminance (0.7 to 1.6) and blacks can be lifted by up to 10% for the faded look. A vignette and grain complete the film. The three looks are slide film in colour chemistry, negative film in slide chemistry, and a teal and amber grade.

$$
y(t)=\tfrac12\Big[\,2p_1+(p_2-p_0)\,t+(2p_0-5p_1+4p_2-p_3)\,t^2+(3p_1-p_0-3p_2+p_3)\,t^3\Big]
$$
_Catmull-Rom spline through the knots p₀ … p₃; t runs from 0 to 1 between p₁ and p₂._

$$
c'=(1-a)\,c+a\,\operatorname{LUT}_c(c)
$$
_Each channel c through its own table, mixed by the strength a._

$$
C=f+(1-f)\operatorname{clip}\big(l+\sigma\,(c'-l)\big),\qquad \sigma=0.7+0.9\,s,\ \ f\le 0.1
$$
_Saturation s around the luminance l, then faded blacks f._

### A short history

Slide film is developed in a process called E-6 and colour negative film in C-41, and swapping them was a trick of photographers and labs for decades. It became a signature of fashion and music photography in the 1990s and was taken up by lomography fans who liked its unpredictable colour. Many phone filters imitate it.

### Where it is used

- Fashion and editorial photo looks
- Music and event photography grading
- Social posts with a retro film feel
- Poster and album art

### Try it

- The teal look is the modern orange and teal grade. (https://lumenary-studio.vercel.app/style/cross-processed?look=teal&amount=90)
- Negative film in slide chemistry gives deep, contrasty colour. (https://lumenary-studio.vercel.app/style/cross-processed?look=negative&sat=70)
- A little strength gives a gentle, subtle shift. (https://lumenary-studio.vercel.app/style/cross-processed?amount=40&fade=30)

### Words worth knowing

- **Cross processing:** Developing film in chemistry meant for a different type of film.
- **Tone curve:** A graph that maps input brightness to output brightness.
- **Catmull-Rom spline:** A smooth curve that passes through all its control points.

### See also

- 115 Film Grain
- 114 Lomography
- 63 Duotone

## 123  Daguerreotype  ·  _still_

- **Comes from:** Paris
- **Around:** 1839 to the 1860s
- **Works best on:** Formal portraits and still lifes

### Why it looks this way

A daguerreotype is an image on a silver plate polished like a mirror. Tilt it one way and the plate reflects something dark, so the picture looks like a positive. Tilt it the other way and it reflects something bright and seems to turn into a negative. Tarnish creeping in from the edges and a brass mat give it its antique look.

### How it works

1. Mix lightness with its inverse by the tilt slider and add a little contrast about the middle.
2. Map the result through a ramp of dark, mid and light colours for silver, blue or gold plates.
3. Blur by 0.5 to 3.5 pixels, since the lenses of the day were soft.
4. Grow tarnish rings inward from the edge of the window, cycling blue, violet and amber like the interference colours of an oil slick.
5. Add polish marks, scratches and dust, and frame it with a brass mat that has metal grain, bevel rings and a band of glare.

### The mathematics

A daguerreotype is an image on a silver plate polished like a mirror. Tilted one way the plate reflects something dark and the picture looks like a positive; tilted the other way it reflects something bright and the picture seems to turn into a negative. The tilt slider mixes the lightness with its inverse, v = (1 − 0.92 t) L + 0.92 t (1 − L), then adds a little contrast about the middle. Three tones (silver, blue and gold) are each a ramp of a dark, a mid and a light colour. The lenses of the day were soft, so the picture is blurred by 0.5 to 3.5 px.

Tarnish creeps in from the edge of the plate. Let e be the distance to the edge of the window (0 at the edge, 1 in the middle). A ring is open where e plus a noise is below a reach that grows with the tarnish slider, and its colours cycle through blue, violet and amber as sin(16 e + 5 n + offset) with the three colour channels one third of a turn apart, the same kind of thin-film interference as an oil slick. Polish marks, scratches and dust are added to the plate, and a brass mat (a gradient with metal grain, bevel rings and a band of glare) frames it in an oval or a rectangle.

$$
v=\operatorname{clip}\Big(1.18\,\big[(1-0.92\,\tau)\,L+0.92\,\tau\,(1-L)-\tfrac12\big]+\tfrac12\Big)
$$
_The mirror: τ is the tilt slider and L the softened lightness._

$$
\text{ring}=\operatorname{smoothstep}\big(\rho,\ 0,\ e+0.22\,(n-\tfrac12)\big),\qquad \rho=0.04+0.34\,T
$$
_Where the tarnish reaches; T is the tarnish slider and n noise._

$$
c_j=\tfrac12+\tfrac12\sin\!\Big(16\,e+5\,n+\tfrac{2\pi j}{3}\Big),\qquad j=0,1,2\ \ (R,G,B)
$$
_The iridescent colour of the tarnish: three phases of a thin-film interference._

### A short history

The French government announced Louis Daguerre’s process in 1839 and gave it to the world free of charge, apart from in Britain, where it was patented. Each daguerreotype was a unique plate, fragile and kept in a case. The process was replaced in the 1850s and 1860s by cheaper methods that could be copied, but its detail and mirror like depth are still admired.

### Where it is used

- Historical and period style portraits
- Heritage and museum themed graphics
- Vintage invitations and stationery
- Gothic and steampunk art

### Try it

- Tilt the plate to see the picture turn into a negative. (https://lumenary-studio.vercel.app/style/daguerreotype?tilt=100)
- A gold plate with a rectangular mat looks like a keepsake case. (https://lumenary-studio.vercel.app/style/daguerreotype?tone=gold&frame=rect)
- Heavy tarnish with scratches looks like an heirloom. (https://lumenary-studio.vercel.app/style/daguerreotype?tarnish=90&scratch=80)

### Words worth knowing

- **Daguerreotype:** An early photograph made on a silvered copper plate.
- **Tarnish:** A dull or coloured film that forms on metal as it reacts with the air.
- **Mat:** The decorative border placed around a picture inside its frame.

### See also

- 115 Film Grain
- 15 Victorian
- 86 Cyanotype

## 124  Chromatic Aberration  ·  _still_

- **Comes from:** Optics
- **Around:** Understood since the 17th century
- **Works best on:** High contrast edges, such as signs, branches and city lights

### Why it looks this way

Glass bends each colour of light by a slightly different amount, a property called dispersion, so a lens cannot bring red, green and blue into exactly the same place. The channels land a little apart, and edges split into colour. This treatment does what the lens does: it reads red, green and blue from slightly different places, and the difference grows toward the edges of the picture.

### How it works

1. In radial mode keep the green channel where it is, read red from a point further out and blue from a point further in.
2. Scale the shift by half the amount times one minus the edge strength plus 2.2 times the edge strength times the squared distance from the centre, so with full edge strength it grows with the square of distance.
3. In sideways mode shift red and blue by a fixed amount along one direction, like a prism.
4. In full spectrum mode take seven samples along the line, with red weighted from one end, blue from the other and green from the middle, each normalised to add to 1.
5. Add an optional soft glow from a tenth-scale copy screened on.

### The mathematics

A glass lens bends each colour of light by a slightly different amount, a property called dispersion. The result is lateral chromatic aberration: the red, green and blue images are enlarged by slightly different factors, so they separate more the farther they are from the centre of the picture. The program does what the lens does. In the radial mode the green channel stays where it is, the red channel is read from a point u further out, and the blue from a point u further in. The shift has the size A/2 × [(1 − e) + 2.2 e ρ²], where ρ is the distance from the centre divided by the half-diagonal and e the strongest-at-the-edges slider, so with e = 1 it grows with the square of the distance.

The sideways mode shifts red and blue by a fixed amount along one direction (the angle slider), like a prism, optionally growing toward the edges. The full-spectrum mode takes seven samples along the line from −u to +u. Red takes its weight from the + end, blue from the − end and green from the middle, and each channel’s weights are normalised to add up to 1, so a flat colour comes through unchanged and an edge is smeared into a rainbow. A soft glow (a tenth-scale copy, screened on) is optional.

$$
\lvert\mathbf u\rvert=\frac{A}{2}\Big[(1-e)+2.2\,e\,\rho^{2}\Big],\qquad \mathbf u\parallel(\mathbf x-\mathbf c),\quad \rho=\frac{\lVert\mathbf x-\mathbf c\rVert}{R}
$$
_Radial shift: A is the amount in pixels, e the edge slider, c the centre and R the half-diagonal._

$$
R'(\mathbf x)=R(\mathbf x+\mathbf u),\qquad G'(\mathbf x)=G(\mathbf x),\qquad B'(\mathbf x)=B(\mathbf x-\mathbf u)
$$
_The three channels are sampled at different places (bilinear interpolation)._

$$
C'_c(\mathbf x)=\sum_{k=0}^{6} w_c(k)\;C_c\!\Big(\mathbf x+\mathbf u\,\big(\tfrac{k}{3}-1\big)\Big),\qquad w_c\propto\max\big(0,\ 1-\gamma_c\lvert t_k-t_c\rvert\big)
$$
_Full-spectrum mode: t_k = k/6; t_c = 1, ½, 0 and γ_c = 1.7, 2.3, 1.7 for red, green and blue; weights add up to 1._

### A short history

Isaac Newton showed in 1666 that a prism splits white light into colours, and he built the first reflecting telescope in 1668 partly to avoid the coloured fringes of lenses. Chester Moore Hall and John Dollond developed achromatic lenses, which combine two glasses to cancel much of the fringing, in the eighteenth century. Today it is a flaw that photographers correct, and an effect designers add on purpose.

### Where it is used

- Glitch and cyber aesthetics
- Photo realism for CGI and game scenes
- Music and event poster looks
- Optics teaching

### Try it

- Strong radial fringing with edges maxed looks like a cheap lens. (https://lumenary-studio.vercel.app/style/chromatic-aberration?amount=90&edge=100)
- Sideways mode with a diagonal angle looks like a glitch. (https://lumenary-studio.vercel.app/style/chromatic-aberration?mode=side&angle=45)
- Full spectrum smears edges into a rainbow. (https://lumenary-studio.vercel.app/style/chromatic-aberration?mode=spread)

### Words worth knowing

- **Dispersion:** Different colours bending by different amounts when light passes through glass.
- **Lateral chromatic aberration:** Colour fringes caused by different magnification of each colour.
- **Achromatic lens:** A lens made from two kinds of glass to bring two colours to the same focus.

### See also

- 31 Glitch
- 119 Anaglyph 3D
- 65 Glass Refraction

## 125  Lenticular  ·  _live_

- **Comes from:** Printing and novelty design
- **Around:** 1940s onward, popular in the 1960s and 70s
- **Works best on:** Bold pictures that change meaning when altered

### Why it looks this way

A lenticular print is a sheet of tiny cylindrical lenses over two pictures that have been cut into thin strips and interlaced. Each lens sends one strip to your eye from one angle and the other strip from another, so as you move, the picture flips. This treatment makes a second picture from the first, interlaces the two under virtual lenses and tilts them with your pointer.

### How it works

1. Make the second picture from the first by a negative, a night blue ramp, opposite hues, black and white or sepia.
2. For each lens of width w, work out how far across the lens each column is: x divided by w, modulo 1.
3. Show picture A where that is below a split point and picture B above it, with the split following the tilt.
4. Track the pointer across the picture with a smooth catch-up, and sway on its own with a slow sine when the pointer is away.
5. Slide the pictures in opposite directions with the tilt, up to 1.4 lens widths, for parallax, and add a moving shine band and dark lens seams.

### The mathematics

A lenticular print is a sheet of tiny cylindrical lenses laid over two pictures that have been cut into thin strips and interlaced, A B A B. Each lens sends the A strip to your eye from one viewing angle and the B strip from another, so as you move the picture seems to flip. The program makes the second picture from the first by one of five alterations (a negative, a night-blue ramp, the opposite hues, black and white or sepia), then for each lens of width w it works out how far across the lens each column is, u = (x/w) mod 1. The lens shows picture A where u is below a split point and B above it. The split point follows the tilt: split = ½ (1 + θ).

The tilt θ is a number between −1 and 1. It follows your pointer across the picture (the left edge is −1, the right edge 1) with a smooth, exponential catch-up, and when the pointer is away it sways by itself as a slow sine wave. The two pictures also slide in opposite directions with the tilt, by up to 1.4 lens widths, which is the parallax that makes a lenticular look deep. The lens shine adds a bright band that moves across each lens, darkens the lens edges and the seam, so the strips read as ribbed plastic.

$$
u=\frac{x}{w}\bmod 1,\qquad \text{show B if }\ u\ge\tfrac12\,(1+\theta)
$$
_w is the lens width in pixels and θ the tilt._

$$
\theta\ \leftarrow\ \theta+(\theta^{*}-\theta)\,\big(1-e^{-7\,\Delta t}\big),\qquad \theta^{*}=\begin{cases}2p_x-1&\text{pointer inside}\\ 0.95\,s\,\sin(0.75\,t)&\text{otherwise}\end{cases}
$$
_The tilt eases toward its target; p_x is the pointer’s horizontal position (0 to 1) and s the sway slider._

$$
x_{\text{src}}=x\mp\theta\,\delta,\quad \delta=1.4\,P\,w;\qquad k=1+S\Big(0.3\,e^{-(u-h)^{2}/0.018}-0.12\,\operatorname{smoothstep}(0.62,\,1,\,\lvert 2u-1\rvert)\Big)
$$
_Parallax shift (minus for A, plus for B; P the parallax slider) and the shine multiplier; h = ½ + 0.38 θ is where the glint sits in each lens, S the shine slider._

### A short history

Lenticular imaging developed in the early twentieth century, and flip images and 3D cards became common novelties in the 1950s and 60s, found in cereal packets, on postcards and on album covers. The same principle is used in some glasses-free 3D displays.

### Where it is used

- Flip card and collectible style graphics
- Before and after reveals
- Album and poster mock-ups
- Playful packaging ideas

### Try it

- A negative flip is dramatic and graphic. (https://lumenary-studio.vercel.app/style/lenticular?alter=negative)
- Narrow lenses and strong parallax give a deep, fine ribbing. (https://lumenary-studio.vercel.app/style/lenticular?lens=4&depth=80)
- Switch off the sway to control the flip with the pointer only. (https://lumenary-studio.vercel.app/style/lenticular?sway=0)

### Words worth knowing

- **Lenticular lens:** A cylindrical lens, one of many in a ribbed sheet.
- **Interlacing:** Alternating thin strips of two or more pictures.
- **Parallax:** The apparent shift of things at different depths when the viewpoint changes.

### See also

- 119 Anaglyph 3D
- 41 Depth Parallax
- 60 Holographic

## 126  Cinematic  ·  _still_

- **Comes from:** Feature film photography and grading
- **Around:** Widescreen from 1953, digital grading from 2000
- **Works best on:** People, and scenes with lights in the frame

### Why it looks this way

A film frame is recognised by a few habits. Skin is warm and everything else leans cool, because orange and teal sit opposite each other and make a face stand out. Bright lights bloom, and through an anamorphic lens they throw a blue streak across the frame. There is grain. And the picture is wider than a television, which the black bars announce.

### How it works

1. Set the saturation, then tint the shadows one way and the highlights another.
2. Add contrast with an S-shaped curve.
3. Blur the bright parts and blend them back as a warm bloom.
4. Smear only the brightest lights sideways and add them in blue.
5. Darken the corners and add grain, strongest in the mid tones.
6. Add black bars, and a subtitle if you write one.

### The mathematics

A film grade moves colour by tone. Saturation is set first, by scaling each channel’s distance from the pixel’s brightness. Then comes split toning: one tint is added to the shadows and another to the highlights, with weights that are the squares of darkness and of brightness, so mid tones are barely touched. In the default grade the shadows gain blue and green and the highlights gain red, which sets skin, which is orange, against everything else. An S-shaped curve about mid grey adds contrast.

Lenses and film add the rest. Bloom isolates the bright parts, blurs them widely and blends them back in a warm tone. Streaks use a stricter mask of only the brightest lights and blur it along the rows alone, three times, which approximates a wide Gaussian in one direction; the result is added in blue, as a cylindrical anamorphic lens smears a point of light into a horizontal line. Corners are darkened, and grain is made strongest in the mid tones. The bars bring the frame toward the chosen shape, but each stops at one eighth of the height so an upright picture is not reduced to a strip.

$$
C\leftarrow C+2k\,\big((1-l)^{2}\,\mathbf s+l^{2}\,\mathbf h\big)
$$
_Split toning: s and h are the shadow and highlight tints, l the brightness, k the grade strength._

$$
v\leftarrow v+1.6\,c\,\big(3v^{2}-2v^{3}-v\big)
$$
_Contrast: a blend toward the smoothstep curve; c is the grade’s contrast times k._

$$
\text{bar}=\min\!\Big(\frac{H-W/\rho}{2},\ \frac{H}{8}\Big)
$$
_Height of each black bar for a frame of ratio ρ, when the picture is taller than that ratio._

### A short history

CinemaScope arrived in 1953 with The Robe, squeezing a wide picture onto ordinary film with an anamorphic lens, and the streaked highlights of such lenses became part of the look. Colour was once set in the laboratory. In 2000 O Brother, Where Art Thou? became the first feature graded entirely on a computer, and the control that gave led, within a decade, to the teal and orange palette of blockbuster cinema.

### Where it is used

- Film and short video posters
- Travel and wedding photographs
- Video thumbnails and channel banners
- Storyboards and mood frames

### Try it

- Bleach bypass with heavy grain is a war film. (https://lumenary-studio.vercel.app/style/cinematic?grade=bleach&grain=80&amount=90)
- Golden hour with strong bloom and no bars flatters a portrait. (https://lumenary-studio.vercel.app/style/cinematic?grade=gold&bloom=80&bars=none)
- Add a line of dialogue to finish the frame. (https://lumenary-studio.vercel.app/style/cinematic?text=We+were+never+lost.)

### Words worth knowing

- **Colour grading:** Adjusting the colour and contrast of a film after it is shot.
- **Anamorphic lens:** A lens that squeezes a wide view sideways onto the film, to be stretched again on projection.
- **Split toning:** Tinting shadows and highlights with different colours.

### See also

- 115 Film Grain
- 122 Cross-Processed
- 120 Bokeh

## 127  Chronophotograph  ·  _live_

- **Comes from:** Early motion study in physiology
- **Around:** Marey’s photographic gun of 1882 and fixed-plate work after it
- **Works best on:** A bright subject moving across a dark background

### Why it looks this way

Before film, nobody could say exactly what a galloping horse’s legs were doing. Marey answered by exposing one plate again and again, so that every instant of a movement lay on the same picture. It works because a bright figure on a black ground adds light to the plate wherever it goes and takes none away. Strobe photography still does the same, and the result shows time as a shape.

### How it works

1. Turn each frame into what goes on the plate: a toned picture with the background pushed towards black.
2. Every fraction of a second, keep a copy of the current frame in a ring of past exposures.
3. Lay the exposures down from the oldest to the newest, each dimmer the older it is, always keeping the brighter value.
4. On video, optionally find what moves by comparing with the still background, and lay down only that.
5. On a still picture, slide a smaller copy across the plate on a swinging path, so there is motion to record.
6. Add a faint measuring grid and a dark vignette like a laboratory plate.

### The mathematics

The plate is a running maximum. Every exposure is a copy of the picture with its background crushed, E = l^0.92 smoothstep(a, a + 0.4, l) tinted silver or sepia, where l is the brightness and a is the black point (0 to 0.55). The newest exposure has weight 1 and one that is j exposures old has weight (1 - j/K)^x, with K the number of exposures and x between 0.35 and 3.2 from the fade slider. The plate is P = max over j of w_j E_j, taken for each colour channel, which is exactly what a second flash does to a film that already holds an image: it can only add light.

A new exposure is stored every g milliseconds from the latest video frame, so the exposures are g apart. A still picture has no past to store, so it is shrunk to half size, given a soft oval edge, and moved on a path x(t) = 0.29 W sin(1.3 t) with a small bounce 0.03 H sin(2.6 t + 0.8); the exposures are the same picture at earlier points on that path. In the mode that keeps only what moves, the still background is found as the per-pixel median of the newest frame, one from the middle of the trail and the oldest; each exposure is mixed in where it differs from that background by more than 22 levels, and the background itself is dimmed by half.

$$
E=\ell^{0.92}\,\operatorname{smoothstep}(a,\ a+0.4,\ \ell),\qquad w_j=\Big(1-\frac{j}{K}\Big)^{x}
$$
_An exposure with its background crushed, and the weight of an exposure that is j steps old._

$$
P=\max_{j}\ \big(w_j\,E_j\big)
$$
_The plate keeps the brightest value that any exposure gave, in each colour channel._

$$
\mathbf x(t)=\big(0.29\,W\sin 1.3t,\ \ 0.03\,H\sin(2.6t+0.8)\big)
$$
_The path a still picture is swung along, so that there is motion to record._

### A short history

Étienne-Jules Marey, a French physiologist, wanted to measure how bodies move. In 1882 he built a camera shaped like a gun that took twelve exposures a second on one rotating plate, and soon after he moved to a fixed plate with a single lens, dressing his subjects in black with white lines on the limbs so that their paths showed as lines. His pictures influenced the Futurists and Duchamp’s Nude Descending a Staircase (1912). Harold Edgerton’s flash photographs, from the 1930s, brought the method into modern science and the studio.

### Where it is used

- Sport and movement analysis
- Dance and fashion photography
- Title cards for films about motion
- Posters and album art

### Try it

- More exposures with a long gap draw the whole swing as a fan of figures. (https://lumenary-studio.vercel.app/style/chronophotograph?shots=14&gap=300&fade=40)
- Keep colour and the background for a pastel strobe look. (https://lumenary-studio.vercel.app/style/chronophotograph?tone=colour&ground=keep)
- On video, laying down only what moves keeps the room and leaves ghosts of the people. (https://lumenary-studio.vercel.app/style/chronophotograph?ground=movers&shots=8)

### Words worth knowing

- **Chronophotography:** Photography that records the successive phases of a movement, on one plate or in a series of pictures.
- **Stroboscope:** A light that flashes at regular intervals, freezing a moving subject in each flash.
- **Lighten blend:** Combining two pictures by keeping, at each pixel, the brighter of the two values.

### See also

- 121 Double Exposure
- 128 Slit-scan
- 33 Datamosh

## 128  Slit-scan  ·  _live_

- **Comes from:** Photo-finish cameras and special effects
- **Around:** Finish-line cameras from the 1940s; the stargate of 2001 in 1968
- **Works best on:** Video with a clear direction of movement; bold still pictures

### Why it looks this way

An ordinary camera takes the whole frame at one instant. A slit camera looks through a gap a few pixels wide and records that strip over and over as time passes, laying the strips side by side. Whatever is still piles up into stripes, whatever moves is drawn as its own shape, and a runner crossing the line is drawn as an outline of time. When the slit also moves across a still picture, the picture stretches wherever the slit slows down.

### How it works

1. Choose a narrow slit of the frame: a single column or row.
2. At a steady rate, copy that slit into a strip that scrolls away, so that the newest slit enters at one edge.
3. For the time warp, keep a ring of recent frames and take each row from a different age of it.
4. On a still picture, sweep the slit across it and back, or shear the frames, so that there is something to scan.
5. Read between two neighbouring columns, so the strip stays smooth.

### The mathematics

Finish line. The output is a strip with one line per output column (or row), kept in a ring. Each step of dt seconds adds n = floor(r dt) lines, the remainder carried to the next step, where r runs from 60 to 520 lines per second as the speed slider rises, scaled to the picture’s size. A new line is the picture’s colours along the slit at position s, read as a linear mix of the two nearest columns. On a video the slit stays where the slider put it, so every line of a step comes from the newest frame.

With no motion in a still picture, the slit itself is moved, so that the scroll has something to turn into an image: s(t) = c + A asin(0.92 sin(w (t - t0) + 1.3)) / asin(0.92), a triangle wave with rounded ends in which A is 0.46 of the picture and w is set so that the slit crosses at 0.8 of the scroll speed. If the slit and the scroll moved at the same speed the strip would reproduce the picture exactly; a slower slit stretches it, a faster one squeezes it, and one moving the other way mirrors it.

Time warp. A ring of K = 18 frames is filled at intervals of T/18, with T from 0.3 to 2.6 seconds. For each pixel a lag f between 0 and 1 comes from its position: y/H from the top, x/W from the left, the distance from the middle over the half diagonal for the tunnel, or 0.5 + 0.5 sin(pi (1.6 x/W + 2.2 y/H) - 1.6 tau) for the rolling ripple, which also moves with time. The pixel is read from the frames at lag f (K - 1) and the next one, mixed by the fractional part. For a still picture the frames are the same picture shifted along a path by up to 0.1 W, which turns the lag into a wave of shear.

$$
s(t)=c+A\,\frac{\arcsin\!\big(0.92\,\sin(\omega(t-t_0)+1.3)\big)}{\arcsin 0.92}
$$
_The slit swept across a still picture: a triangle wave with rounded ends, where A is 0.46 of the picture._

$$
\Delta u=\frac{v}{r}
$$
_Picture pixels per strip line: v is the slit’s speed across the picture and r the scroll rate. Below 1 the picture is stretched, above 1 squeezed, and with a negative sign mirrored._

$$
C(x,y)=(1-\phi)\,F_{a}(x,y)+\phi\,F_{a+1}(x,y),\qquad a+\phi=f(x,y)\,(K-1)
$$
_The time warp: F_a is the frame a steps back and f the lag, from 0 to 1._

### A short history

The slit camera was first used to settle photo finishes at race tracks in the 1940s: film moved past a slit aimed at the finish line, so the picture showed who crossed first, with time running along the film. In 1968 Douglas Trumbull used a much larger version to make the psychedelic stargate corridor in 2001: A Space Odyssey, moving artwork past a slit while the camera shutter stayed open. The same trick is now a standard video effect, and finish-line cameras record thousands of lines a second.

### Where it is used

- Sports results and race timing
- Title sequences and music videos
- Experimental portraits and abstract prints
- Time-lapse art from video

### Try it

- A vertical scroll turns a still picture into a rolling curtain of its own rows. (https://lumenary-studio.vercel.app/style/slit-scan?way=down)
- A slow, wide time warp from the middle makes a tunnel, as in the stargate. (https://lumenary-studio.vercel.app/style/slit-scan?mode=warp&shape=tunnel&spread=85)
- A rolling ripple warp makes a video wave like a flag. (https://lumenary-studio.vercel.app/style/slit-scan?mode=warp&shape=ripple&spread=40)

### Words worth knowing

- **Slit:** A narrow opening that lets through only a strip of the scene.
- **Photo finish:** A picture of the finish line of a race, made with a slit camera so that time runs across the image.
- **Time warp:** An effect in which different parts of a frame show different moments.

### See also

- 127 Chronophotograph
- 67 Liquid morph
- 33 Datamosh

## 129  Tiny Planet  ·  _still_

- **Comes from:** Panoramic photography and map projection
- **Around:** Stereographic maps from antiquity, tiny-planet photos since the 2000s
- **Works best on:** Wide pictures with flat ground and open sky

### Why it looks this way

Roll a wide picture into a ring, with the ground inwards and the sky outwards, and it becomes a little round world with you standing on it. The left and right edges meet round the back, and the ground shrinks to a point in the middle. The trick works because the stereographic projection, which maps a sphere onto a plane, keeps small shapes the right way round, so buildings and trees still look like themselves while the horizon curls.

### How it works

1. Treat each column of the picture as a direction round the planet and each row as a distance from its centre.
2. Map the bottom row to the centre and the top row to the planet’s edge, with a curve that crowds the lower rows inward.
3. For every output pixel, work out the angle and the radius, and read the picture back at the matching column and row.
4. Average several samples near the centre, where a whole row is squeezed into a few pixels, to keep it smooth.
5. Cross-fade the left and right sides, or mirror them, so that no seam shows.
6. Past the top edge, continue the sky as a soft haze of the picture’s own colours.

### The mathematics

For an output pixel at offset (dx, dy) from the centre, the angle is theta = atan2(dy, dx) plus the turn, and the radius is r. The picture’s column is u = theta / 2 pi times the number of times round, and its row comes from the radius through the inverse of a curve g. With s running from 0 at the bottom row to 1 at the top row, g(s) = (1 - k) s + k tan(s phi / 2) / tan(phi / 2), where k is the curve slider and phi = 2.45 radians is the width of the projected view. At k = 0 this is the plain polar map, with the radius growing evenly with the row; at k = 1 it is the stereographic projection of a sphere, which crowds the lower rows into the middle. A pixel at radius r reads the row s = g^-1 (r / R), where R is the planet’s radius, found by a binary search in a table of 1024 values of g.

Near the centre one output pixel spans many picture pixels, because a whole row is squeezed into a short circle of radius r. The sampler therefore averages up to 12 samples round the circle, and up to 3 along the radius, which removes the moire of stripes that a single sample would give. The two sides are joined either by mirroring or by cross-fading the last 14% of the width into the first with a smoothstep weight. Beyond the top row the sky is a strip made from the average colour of the top 5% of each column, blurred sideways round the loop, and faded towards its overall average as the radius approaches the far pole of the sphere, at s = pi / phi.

$$
g(s)=(1-k)\,s+k\,\frac{\tan(s\varphi/2)}{\tan(\varphi/2)},\qquad \varphi=2.45
$$
_How far from the centre row s lands: k is the curve slider, and s runs from 0 at the bottom to 1 at the top._

$$
\theta=\operatorname{atan2}(\Delta y,\Delta x)+\tau,\qquad u=\frac{n\,\theta}{2\pi},\qquad s=g^{-1}\!\big(r/R\big)
$$
_The picture is read at column u and row s: n is the number of times round and tau the turn._

$$
N_\theta=\Big\lceil \frac{0.86\,n\,W}{2\pi r}\Big\rceil\quad(\le 12)
$$
_How many samples are averaged round a circle of radius r, so that the centre stays smooth._

### A short history

The stereographic projection was known to the ancient Greeks, and Ptolemy described it in the second century for charting the sky. It preserves angles, which is why it is used for polar maps and in the design of wide-angle lenses. The little-planet look came to photography with panorama software in the 2000s, when a spherical panorama could be projected stereographically with the ground at the centre. It spread across photo-sharing sites and became a staple of drone and travel photography.

### Where it is used

- Travel and drone photography
- Social posts and album covers
- Maps of cities and campuses
- Dome and planetarium art

### Try it

- Raise the curve and shrink the planet for a small world floating in a haze. (https://lumenary-studio.vercel.app/style/tiny-planet?curve=85&zoom=55&sky=soft)
- Turn the planet and repeat the picture twice round for a mandala of the scene. (https://lumenary-studio.vercel.app/style/tiny-planet?repeat=2&spin=90)
- A black sky and a bright rim make it a little moon. (https://lumenary-studio.vercel.app/style/tiny-planet?sky=black&rim=80)

### Words worth knowing

- **Stereographic projection:** A way of mapping a sphere onto a plane from the opposite pole, which keeps angles and small shapes.
- **Nadir:** The point on a sphere directly beneath the viewer, here the centre of the planet.
- **Equirectangular:** A panorama format in which the horizontal axis is longitude and the vertical axis is latitude.

### See also

- 118 Kaleidoscope
- 145 Warped Grid
- 65 Glass Refraction

