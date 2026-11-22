# E. Physical and 3D feel

Source: https://lumenary-studio.vercel.app/theory/physical (captured 2026-11-16 for private study).

Materials you could almost pick up: clay, leather, foil, cloth and folded paper, lit by a single lamp.

## 68  Clay 3D  ·  _still_

- **Comes from:** Stop-motion animation and sculpture
- **Around:** 20th century
- **Works best on:** Portraits and rounded objects with soft light

### Why it looks this way

Clay is a lighting problem. Treat the picture’s brightness as a height map, with bright parts raised and dark parts pressed in, and light it from one side, and a flat photograph becomes a relief you could touch. A little glossy highlight, shaded hollows and fingerprint dents then persuade the eye that a hand made it.

### How it works

1. Blur the picture twice so the surface is soft, then read brightness as height.
2. Measure the slope at each pixel to get a surface normal, the direction the clay faces.
3. Light the normal with one light whose direction you set, adding a diffuse term and a small, glossy highlight.
4. Darken hollows, where the blurred brightness is low, to fake ambient occlusion.
5. Add value noise at two scales to the slope for fingerprints, then soften and desaturate colours so they read as pigment in clay.

### The mathematics

Clay is a lighting calculation. The picture’s brightness, blurred twice so the surface is soft, is treated as a height map: bright is raised, dark is pressed in. At each pixel the slope of that surface is measured with central differences, which gives a surface normal, the direction the clay faces. The flatter the surface, the more the normal points straight at the viewer.

The normal is then lit by a single light whose direction you set with the angle slider. Two terms are added. Diffuse (Lambert) lighting is brightest where the surface faces the light. The specular term, a Blinn-Phong highlight raised to a high power, adds the small glossy shine of damp clay. Ambient occlusion is faked by darkening where the blurred brightness is low, as if hollows catch less light. “Fingerprints” are value noise at two scales added to the slope before lighting, so the surface acquires the dents of a hand. Finally the colours are desaturated and pulled toward a mid-lightness so they read as pigment in clay rather than as a photograph.

$$
\mathbf n=\frac{\big(-k\,\partial_xL_b,\ -k\,\partial_yL_b,\ 1\big)}{\left\lVert\big(-k\,\partial_xL_b,\ -k\,\partial_yL_b,\ 1\big)\right\rVert},\qquad\partial_xL_b\approx\tfrac12\big(L_b(x{+}1)-L_b(x{-}1)\big)
$$
_Surface normal from the blurred brightness; k is the depth slider._

$$
\mathbf l=\frac{(\cos\alpha,\,-\sin\alpha,\,0.7)}{\lVert\cdot\rVert},\qquad\mathbf h=\frac{\mathbf l+(0,0,1)}{\lVert\cdot\rVert}
$$
_Light direction from the angle α, and the half-vector for the highlight._

$$
I=(0.3+0.78\,\max(0,\mathbf n\!\cdot\!\mathbf l))\,(0.82+0.18\,L_b)\;+\;0.22\,(\mathbf n\!\cdot\!\mathbf h)^{28}
$$
_Diffuse × ambient occlusion, plus the specular highlight._

### A short history

Modelling in clay is as old as pottery, and clay animation brought it to the screen in the twentieth century; the word Claymation was coined by Will Vinton’s studio in 1978. The shading used here goes back to Johann Lambert’s eighteenth century law of diffuse light and to Bui Tuong Phong’s 1973 highlight model, later simplified by Jim Blinn.

### Where it is used

- Playful illustrations and kids’ media
- Packaging and brand characters
- Soft 3D looking social posts
- Mood boards for craft and toys

### Try it

- Deep relief with the light from the left looks like a pressed sculpture. (https://lumenary-studio.vercel.app/style/clay-3d?depth=80&angle=180)
- A single colour of clay turns the picture into a monochrome relief. (https://lumenary-studio.vercel.app/style/clay-3d?mode=single)
- Strong fingerprints make it feel very hand-made. (https://lumenary-studio.vercel.app/style/clay-3d?texture=100)

### Words worth knowing

- **Height map:** An image whose brightness is read as height.
- **Surface normal:** A unit arrow pointing straight out of a surface.
- **Ambient occlusion:** Darkening in hollows, where less light can reach.

### See also

- 69 Plasticine
- 70 Embossed Leather
- 71 Gold Foil

## 69  Plasticine  ·  _still_

- **Comes from:** Modelling clay and stop-motion films
- **Around:** 1897 invention, 1970s onward on screen
- **Works best on:** Bold subjects with a few distinct colour regions

### Why it looks this way

Modelling clay comes in a handful of flat colours, so the picture is first reduced to a small box of them. Each region of one colour is then puffed up into its own pillow, dented with thumbs and lit, which is how a modeller builds a scene out of separate pieces pressed side by side.

### How it works

1. Blur lightly and find the k most typical colours with k-means, made more saturated and pulled towards the middle of lightness.
2. Give each pixel its nearest colour and remove isolated specks by a majority vote of neighbours.
3. Treat each region as a mask, blur it twice so it is high in the middle and low at the rim, and raise it to the power 1.5 for a rounded top.
4. Subtract soft round hollows at random places and add a little low-frequency noise for hand-worked unevenness.
5. Light the height map with one diffuse light and a tight highlight, and darken creases where neighbouring pieces differ.

### The mathematics

Modelling clay comes in a few flat colours, so the picture is first reduced to a small box of them. The pixels are blurred a little, k-means finds the k most typical colours (made more saturated and pulled toward the middle of the lightness range, like fresh clay), every pixel takes its nearest colour, and a majority vote over neighbouring pixels removes isolated specks. What is left is a map of regions, each one piece of clay.

Each region is then puffed up into its own pillow. The region’s mask (1 inside, 0 outside) is blurred twice, so it is high in the middle and falls away at the rim, and raised to the power 1.5 to round the top. Soft round hollows (thumb dents) are subtracted at random places and a little low-frequency noise adds the hand-worked unevenness. The slope of that height map gives a surface normal, which is lit with one diffuse light and a tight specular highlight (the gloss slider). Pixels whose neighbours two steps away belong to a different piece are darkened, which draws the creases between pieces.

$$
h(\mathbf x)=\Big(\operatorname{blur}^{2}(m_c)\Big)^{1.5}(\mathbf x)\ \ \text{inside piece } c,\qquad h\leftarrow h-a\,e^{-\lVert\mathbf x-\mathbf c\rVert^{2}/r^{2}}
$$
_The pillow height of piece c from its mask m_c, and a thumb dent of depth a and radius r at c._

$$
s=\big(0.34+0.8\,(\mathbf n\cdot\mathbf l)^{+}\big)\big(0.78+0.22\min(1,\,h+0.2)\big)\,\kappa
$$
_Shading: κ is 0.72 on a seam and 1 elsewhere._

$$
\text{spec}=0.9\,g\,\left(\Big(\tfrac{\mathbf n\cdot\mathbf m}{\lVert\mathbf m\rVert}\Big)^{+}\right)^{42}
$$
_Gloss highlight; g is the gloss slider and m the half vector between light and viewer._

### A short history

Plasticine was invented by William Harbutt in Bath, England, in 1897 and sold as a non-drying modelling material for schools. It later became the favourite of stop-motion animators, notably at Aardman Animations, whose character Morph appeared on British television in the 1970s and whose Wallace and Gromit films followed in 1989.

### Where it is used

- Playful illustrations and covers
- Children’s brand identities
- Packaging with a handmade feel
- Stop-motion style social posts

### Try it

- Fewer colours of clay give a chunkier, more toy-like picture. (https://lumenary-studio.vercel.app/style/plasticine?colours=4&puff=80)
- High gloss and deep dents make it look freshly handled. (https://lumenary-studio.vercel.app/style/plasticine?gloss=90&dents=80)
- Move the light to the top and see the pillows change. (https://lumenary-studio.vercel.app/style/plasticine?angle=270)

### Words worth knowing

- **k-means:** A method that finds a few representative colours by repeatedly averaging groups of pixels.
- **Specular:** A small, bright reflection of a light on a glossy surface.
- **Stop-motion:** Animation made by photographing a model one small move at a time.

### See also

- 68 Clay 3D
- 92 Paper Cut-out
- 44 Lego Voxel

## 70  Embossed Leather  ·  _still_

- **Comes from:** Saddlery, bookbinding and leatherwork
- **Around:** Centuries old
- **Works best on:** Bold shapes and logos

### Why it looks this way

Leather has two surfaces at once: the pebbled grain of the hide, and the shape pressed into it by a hot die. Both can be one height map. The grain comes from cellular noise, in which creases form wherever two cells meet, and the picture is added on top so that bright parts stand proud.

### How it works

1. Scatter a random site in every square of a grid and find, for each pixel, the distance to the nearest site and to the second nearest.
2. Where the two distances are nearly equal the pixel is on a crease, and near a site it is the top of a small dome.
3. Stretch and blur the picture and add it to the grain so bright parts are raised.
4. Light from the top left with a broad, soft highlight, since leather is satin not mirror, and lift the pressed-in parts a little so the relief stays readable.
5. Draw a row of saddle stitches along an inset rectangle, each with a dark shadow, a cream thread and a thin highlight.

### The mathematics

Leather has two surfaces at once: the pebbled grain of the hide and the shape pressed into it by a hot die. Both are one height map. The grain is cellular noise: scatter a random site in every square of a grid, and for each pixel find the distance F1 to the nearest site and F2 to the second nearest. Where F2 − F1 is small the pixel lies on the boundary between two cells, which becomes a crease; near a site it is the top of a little dome. The picture, stretched and blurred, is added on top so that bright parts stand proud.

The slope of the combined height gives the normal. Light comes from the top left; leather is lit with a broad, soft highlight (a low power of the half-vector product) because its finish is satin, not mirror. A tone factor then lifts the low, pressed-in parts a little and dims the raised ones, which softens the relief so the picture stays readable. The stitching is a row of short thread dashes along a rectangle inset from the edge, each drawn three times: a dark offset shadow, a cream thread, and a thin highlight.

$$
h=L_b\Big(0.7+\tfrac{e}{40}\Big)+0.07\,g\,\Big(\operatorname{smoothstep}(0,\,0.22\,s,\,F_2-F_1)\,\big(0.55+0.45\,d\big)-1\Big)
$$
_Height: L_b is the blurred picture, e the emboss slider, g the grain slider, s the grain spacing and d the dome term below._

$$
d=\max\!\Big(0,\ 1-\Big(\frac{F_1}{0.75\,s}\Big)^{2}\Big)
$$
_The dome of one pebble: highest at its site, zero at 0.75 s._

$$
\text{shade}=\big(0.3+0.85\,(\mathbf n\cdot\mathbf l)^{+}\big)\big(0.9+0.2\,(1-L_b)\big)
$$
_Diffuse shading; the second bracket is the tone factor, 1.1 where the picture is dark and 0.9 where it is bright._

### A short history

Embossed and tooled leather has covered books, saddles and furniture for centuries, and gold tooling on bookbindings spread through the Islamic world and Europe from the Middle Ages. The cellular noise used for the grain was described by Steven Worley in 1996, and it is closely related to the Voronoi diagrams of the early twentieth century.

### Where it is used

- Journal, wallet and book cover mock-ups
- Luxury brand and packaging concepts
- Textured backgrounds
- Western and heritage craft designs

### Try it

- Black leather with deep emboss looks like a premium cover. (https://lumenary-studio.vercel.app/style/embossed-leather?leather=black&emboss=85)
- Big grain on oxblood feels like old travel luggage. (https://lumenary-studio.vercel.app/style/embossed-leather?leather=oxblood&size=13)
- Switch off the stitching for a flat panel. (https://lumenary-studio.vercel.app/style/embossed-leather?stitch=false)

### Words worth knowing

- **Cellular noise:** A pattern made from distances to random points, giving cells and creases.
- **Die:** A shaped tool pressed into a material to leave its shape.
- **Saddle stitch:** A hand stitch that runs a thread through each hole twice, in opposite directions.

### See also

- 71 Gold Foil
- 68 Clay 3D
- 56 Letterpress

## 71  Gold Foil  ·  _still_

- **Comes from:** Bookbinding and fine stationery
- **Around:** Gold leaf is ancient, hot stamping from the 19th century
- **Works best on:** High contrast pictures and logos

### Why it looks this way

Foil stamping lays a thin metal film on card wherever a heated die touches it. Here your picture is the die: foil goes where the picture is bright. Crumpled foil is a field of tiny creases, each facing a different way, and so each catches a different part of the room, which is why foil sparkles.

### How it works

1. Decide where foil goes with a smoothstep around a threshold, given a slightly ragged edge by a little noise.
2. Show the card’s own colour and a fine grain everywhere else.
3. Build a crumpled height map from ridged noise at three scales, with a slow warp so the creases wander.
4. Read the up and down tilt of each facet to choose a colour from a strip that stands for what a metal sheet reflects.
5. Add a thin brighter rim along the edge of the stamped area.

### The mathematics

Foil stamping lays a thin metal film onto card wherever a heated die touches it. Here the die is your picture: the foil goes where the picture is bright (or, with the toggle, where it is dark). Coverage is a smoothstep around a threshold set by the coverage slider, with a ragged edge from a little noise, so the boundary looks torn, not cut. The rest of the card shows its own colour with fine grain.

Foil is crumpled, so its surface is a field of creases. The program builds a height map from ridged noise, the function 1 − |2n − 1| of smooth noise, which has sharp creases where the noise crosses its middle value, at three scales (the finer two weighted less) and bends the coordinates with a slow warp so the creases wander. The slope gives a normal, and the up-and-down tilt picks a position on a strip of colours that stands for what a metal sheet reflects: dark at the edges, bright in the middle. Each tiny panel therefore flashes a different tone. A thin brighter rim is added along the edge of the stamped area.

$$
c=\operatorname{smoothstep}\big(t-0.05,\ t+0.05,\ L_b+\rho\big),\qquad t=1-\tfrac{\text{cover}}{100}
$$
_Foil coverage c; ρ is a small noise that roughens the edge._

$$
h_c=0.6\,R(f_0)+0.3\,R(2.3f_0)+0.1\,R(5.1f_0),\qquad R(f)=1-\lvert 2\,n(f\mathbf x)-1\rvert
$$
_Crumple height from ridged noise R; f₀ = 1.5 × the facet slider ÷ the picture width._

$$
t_{\text{env}}=0.5+1.25\,n_y+0.55\,n_x+0.28\,(L-0.5)
$$
_Position on the foil’s colour strip from the tilt (n_x, n_y) of the normal and the picture brightness._

### A short history

Gold leaf has decorated manuscripts, icons and temples for thousands of years. Hot foil stamping, pressing metallic film onto a surface with a heated die, developed with industrial printing and now decorates book covers, wedding invitations and packaging. The ridged noise behind the crumple was popularised by the graphics researcher Ken Musgrave.

### Where it is used

- Wedding and event invitations
- Premium packaging and labels
- Book and album covers
- Award and certificate designs

### Try it

- Rose foil on dark ink card is elegant and modern. (https://lumenary-studio.vercel.app/style/gold-foil?foil=rose&base=ink)
- Heavy crumple with small facets makes a glittering sheet. (https://lumenary-studio.vercel.app/style/gold-foil?crumple=100&facet=4)
- Stamp the dark parts instead of the bright ones. (https://lumenary-studio.vercel.app/style/gold-foil?invert=true)

### Words worth knowing

- **Foil stamping:** Pressing a thin metal film onto a surface with a heated die.
- **Ridged noise:** Noise folded so that its middle value becomes a sharp crease.
- **Facet:** One small flat panel of a faceted surface.

### See also

- 64 Chrome
- 60 Holographic
- 70 Embossed Leather

## 72  Fabric Folds  ·  _still_

- **Comes from:** Studies of drapery in painting and sculpture
- **Around:** Renaissance onward
- **Works best on:** Pictures with smooth shapes and wide tonal range

### Why it looks this way

Hanging cloth falls in folds that run in one direction, and each fold is a wave across the cloth. By adding the picture’s brightness inside the wave, the folds bend wherever the picture changes, so the cloth seems to drape over the scene. Soft shading and a woven grain do the rest.

### How it works

1. Compute each fold as a sine of the position measured along the hang direction.
2. Add the picture’s brightness inside the sine so folds bend over its shapes, with slow noise to make them wander.
3. Add a second sine at 2.3 times the frequency and a bump proportional to brightness for secondary ripples.
4. Light the slope of the height map with diffuse light, a broad highlight and a soft rim of light at grazing angles where fibres scatter light.
5. Dim the shading slightly with a woven grain made from two cosines, and print the picture on the cloth or use one chosen colour.

### The mathematics

Cloth hung from above falls in folds that run in one direction. Each fold is a wave across the cloth: a sine of position, measured along the hang direction. To make the cloth drape over your picture, the picture’s brightness is added inside the sine, so the folds bend wherever the picture changes; a slow noise also nudges the position, so the folds wander. A second sine at 2.3 times the frequency, and a bump proportional to brightness, give the folds secondary ripples and make the shape of the picture stand out.

The slope of this height map is the surface normal. Cloth is lit with a diffuse term plus a broad specular highlight, and one more thing that distinguishes it from stone: a soft rim of light at grazing angles, where fibres standing up scatter light, proportional to (1 − n_z)². A woven grain, a product of two cosines at a thread spacing of a couple of pixels, dims the shading slightly. The cloth is either the picture’s own colours (softened) printed on the fabric, or one chosen colour.

$$
\varphi=2\pi\big(f\,u+w\,L_b\big),\qquad u=\frac{x\cos\theta+y\sin\theta}{W}+\eta
$$
_Phase of the folds: f is the number of folds, w = 1.6 × the “picture bends the folds” slider, θ the hang direction and η the slow wander._

$$
h=0.62\sin\varphi+0.22\sin(2.3\,\varphi+1.3+2L_b)+0.35\,L_b
$$
_Height map of the cloth._

$$
C=\text{base}\,\big(0.28+0.82\,(\mathbf n\cdot\mathbf l)^{+}\big)\,g+255\,\sigma\Big(0.45\,\big((\mathbf n\cdot\mathbf m)^{+}\big)^{18}+0.35\,(1-n_z)^{2}\Big)
$$
_Final colour: g is the weave factor (about 0.93 to 1), σ the sheen slider, m the half vector; the last term is the rim light of standing fibres._

### A short history

Artists have studied drapery for centuries. Leonardo da Vinci made careful studies of cloth dipped in clay and draped over models, and Renaissance workshops treated folded fabric as a test of skill in both painting and marble. The rim light used for the fibres is a standard trick for velvet and satin in computer graphics.

### Where it is used

- Fashion and textile mock-ups
- Theatre and event backdrops
- Elegant posters and invitations
- Soft, tactile backgrounds

### Try it

- Gold cloth with a strong sheen looks like satin. (https://lumenary-studio.vercel.app/style/fabric-folds?cloth=gold&sheen=85)
- Many fine folds read like pleated silk. (https://lumenary-studio.vercel.app/style/fabric-folds?folds=20&depth=40)
- Let the picture bend the folds as much as possible. (https://lumenary-studio.vercel.app/style/fabric-folds?warp=100)

### Words worth knowing

- **Drapery:** Cloth shown hanging or falling in folds.
- **Rim light:** A soft glow at the edge of a surface seen at a grazing angle.
- **Warp and weft:** The lengthwise and crosswise threads of a woven cloth.

### See also

- 68 Clay 3D
- 91 Tapestry Weave
- 70 Embossed Leather

## 73  Rubber Stamp  ·  _still_

- **Comes from:** Offices and mail rooms
- **Around:** Late 19th century onward
- **Works best on:** High contrast pictures and bold silhouettes

### Why it looks this way

A rubber stamp prints one flat colour or nothing, so the picture is cut to black and white and the interest comes from imperfection: uneven pressure, worn patches, pinholes and a slightly crooked angle. Those flaws are what make a stamp look pressed by a person.

### How it works

1. Cut the picture to black and white at the chosen threshold, after a small random wobble so the edge is ragged.
2. Add a double border and a banner with the word cut out of it on the same plate.
3. Remove ink with a slow noise for uneven pressure, a mid-scale noise for worn patches, and scattered single-pixel pinholes.
4. Rotate the inked layer by the tilt angle.
5. Combine it with the paper by multiplication, as ink soaking into fibres darkens what is beneath.

### The mathematics

A rubber stamp prints one flat colour or nothing, so the picture is cut to black and white: a pixel is inked where its brightness (stretched and blurred a little) is below the “where the ink goes” slider, after adding a small random wobble so the edge is ragged. A double border and a banner with the word, cut out of the banner, are drawn on the same plate.

Inking is never even. Three things remove ink from the plate: a slow noise for uneven pressure (ink strength between about 0.6 and 1), a mid-scale noise whose high values mark worn patches where the ink is almost gone, and a scatter of single-pixel pinholes. All three scale with the worn-rubber slider. The inked layer is then turned about the centre by the tilt angle and combined with the paper by multiplication, as ink soaking into the fibres darkens whatever is beneath it.

$$
\text{inked}\iff L_b+0.12\,(n-\tfrac12)+0.05\,(r-\tfrac12)<\tau,\qquad \tau=\tfrac{\text{cut}}{100}
$$
_Where the stamp carries ink; n is smooth noise and r a random number._

$$
\alpha=0.96\ \kappa\ \big(0.62+0.38\,n_1+0.14\,(n_2-\tfrac12)\big)\ \chi_{\text{wear}}\ \chi_{\text{pin}}
$$
_Ink opacity: κ is 1 on the plate; χ is 0.1 on worn patches and 0 on pinholes._

$$
C_{\text{out}}=C_{\text{paper}}\cdot\big(1-\alpha\,(1-C_{\text{ink}}/255)\big)
$$
_Multiply blend of ink and paper._

### A short history

Seals pressed into clay or wax are thousands of years old. The rubber stamp became practical after Charles Goodyear’s vulcanisation of rubber in 1839 and was in common office use by the late nineteenth century, to date, approve and file. Today stamps are a staple of crafts, scrapbooking and printmaking.

### Where it is used

- Approval and certificate style graphics
- Passport and travel stamp looks
- Handmade stationery and logos
- Printmaking and scrapbook elements

### Try it

- Blue ink with heavy wear looks like a long-used stamp. (https://lumenary-studio.vercel.app/style/rubber-stamp?ink=blue&wear=85)
- A bigger tilt makes it look pressed in a hurry. (https://lumenary-studio.vercel.app/style/rubber-stamp?tilt=12)
- Stamp your own word. (https://lumenary-studio.vercel.app/style/rubber-stamp?word=VERIFIED)

### Words worth knowing

- **Vulcanisation:** Treating rubber with sulphur and heat so that it stays elastic and firm.
- **Pinhole:** A tiny spot where no ink was transferred.
- **Multiply blend:** A way of combining layers so that the result is never lighter than either.

### See also

- 56 Letterpress
- 82 Linocut
- 84 Screen Print

## 74  Origami Folds  ·  _still_

- **Comes from:** Japan, with modern folding mathematics
- **Around:** Paper folding for centuries, modern origami from the 20th century
- **Works best on:** Colourful pictures with soft shapes

### Why it looks this way

A folded sheet shows its structure through shading: a facet that leans towards the light is bright, and one leaning away is dark. Cover a sheet with small pyramids, colour each facet from the picture and shade it by its lean, and the picture appears in a tessellation of folded paper.

### How it works

1. Divide the sheet into a grid of squares.
2. Fold each square at random in one of three ways: four small triangles meeting at the centre, or two triangles along one of the diagonals.
3. Colour each facet from the picture at its centre, slightly softened, or leave the paper white.
4. Brighten facets that lean towards the light and darken those leaning away, in proportion to the dot product of lean and light direction, with a random sign per square and a tiny tilt per facet.
5. Draw each crease as a dark line with a pale line one pixel beside it, and add paper grain.

### The mathematics

The sheet is a grid of squares. In each square the paper is folded in one of three ways, chosen at random: four small triangles meeting at the centre, or two triangles along one of the diagonals. Every triangle is a flat facet that takes its colour from the picture at its centre (slightly softened, so it looks like coloured paper), or plain white if you choose that.

What makes it look folded is shading. Each facet leans in a direction (outward from the centre for the four-facet fold, perpendicular to the diagonal for the two-facet folds). A facet leaning toward the light is brightened and one leaning away is darkened, in proportion to the dot product of its direction and the light direction in the picture plane, with a random sign per square and a small random tilt per facet. Crease lines are drawn on top as a dark line with a pale line one pixel beside it, which is how a real fold looks, and a fine grain finishes the paper.

$$
\text{shade}=1+\phi\,\Big(0.62\,\varepsilon\,(\mathbf d\cdot\mathbf l)+0.5\,(r-\tfrac12)\Big)
$$
_Brightness factor of a facet: φ is the fold-strength slider, ε = ±1 per square, d the facet’s direction, l the light direction and r a random number._

$$
\text{fold}\ \in\ \{4\text{ triangles about the centre},\ \diagdown\ \text{split},\ \diagup\ \text{split}\},\qquad P\approx 0.34,\ 0.33,\ 0.33
$$
_The three fold types, chosen with roughly equal chance (0.34, 0.33 and 0.33)._

### A short history

Paper folding developed in Japan and elsewhere over centuries, and the modern art was shaped in the twentieth century by Akira Yoshizawa, who developed the notation of dashed lines and arrows still used to record folds. Today scientists and artists such as Robert Lang use folding theory in engineering, and Koryo Miura’s Miura fold has been used to pack solar panels for spacecraft.

### Where it is used

- Paper craft and packaging inspiration
- Faceted posters and wallpapers
- Educational and geometry themed graphics
- Calm decorative backgrounds

### Try it

- Strong folds with white paper look like a sculpture. (https://lumenary-studio.vercel.app/style/origami-folds?paper=white&fold=90)
- Many tiny folds turn the picture into fine pleated paper. (https://lumenary-studio.vercel.app/style/origami-folds?cells=28)
- Fewer folds with strong creases is graphic and bold. (https://lumenary-studio.vercel.app/style/origami-folds?cells=7&crease=90)

### Words worth knowing

- **Tessellation:** A pattern that covers a surface with repeating shapes and no gaps.
- **Facet:** One flat face of a folded or faceted surface.
- **Crease:** The line where paper has been folded.

### See also

- 92 Paper Cut-out
- 43 Low-poly
- 90 Quilt Patchwork

## 75  Soft 3D  ·  _still_

- **Comes from:** 3D illustration and designer toys
- **Around:** 2020s trend
- **Works best on:** Simple scenes with a few large shapes

### Why it looks this way

Soft 3D illustration makes everything look like an inflatable toy: no hard corners, pale colour, light that seems to come from a studio softbox. The trick is that shape is shown by shading alone. Here each area of the picture is treated as its own cushion, puffed up from its outline, lit from above and given a sheen.

### How it works

1. Simplify the picture into a few flat shapes.
2. Give each shape height: zero at its outline, rising inward to a level top.
3. Work out which way the surface faces at every pixel from the slope of that height.
4. Light it softly from above, so the shaded side stays light.
5. Add a tight highlight and a broad one, darken the seams and drop small shadows.
6. Wash the colours toward pastel.

### The mathematics

The picture is first simplified into a handful of flat shapes: smoothing that keeps edges, a small palette found by k-means, and a majority filter that rounds the shapes off. Height is then invented for each shape. A map that is 0 on every outline and 1 elsewhere is blurred twice, so the zeros spread inward as a slope, and the result is raised to the power 2.2. Each shape ends up with the cross-section of a cushion: low at the seam, level in the middle. The inflation slider sets the blur radius, that is, how far in from the seam the swelling reaches.

The slopes of that height map give a surface normal at every pixel, and the normal is lit. Diffuse light is wrapped, so the side turned away from the lamp is dim, not black, as on a soft translucent toy. The sheen is the Blinn-Phong highlight computed twice, once tight and once broad. Seams are darkened, each shape drops a small shadow on its neighbour on the side away from the light, and a rim of cool light is added where the surface turns away from the viewer. The colour underneath is four parts flat paint to one part smoothed picture, so faces keep a little of their gradient.

$$
h=\Big(B_{r/2}^{2}\,B_{r}^{2}\,[\text{not an outline}]\Big)^{2.2}
$$
_Height: B² is two box blurs of the given radius; r runs from 4 to 11 pixels with the inflation slider._

$$
d=\operatorname{clamp}\big(0.62\,(\mathbf n\cdot\mathbf l)+0.42\big),\qquad \mathbf n=\frac{(s_x,\ s_y,\ 1)}{\sqrt{s_x^{2}+s_y^{2}+1}}
$$
_Wrapped diffuse light from the normal n, built from the slopes of h, and the light direction l._

$$
s=g\,\big(0.85\,(\mathbf n\cdot\mathbf h)^{46}+0.12\,(\mathbf n\cdot\mathbf h)^{7}\big),\qquad \mathbf h=\frac{\mathbf l+\mathbf v}{\lvert\mathbf l+\mathbf v\rvert}
$$
_Sheen: a tight and a broad highlight around the half vector h; v points at the viewer, g is the sheen slider._

### A short history

The shading comes from early computer graphics: Bui Tuong Phong described his highlight model in 1975 and Jim Blinn simplified it in 1977. The look is recent. Vinyl designer toys appeared in Hong Kong and Japan in the late 1990s, and around 2020 free 3D software put soft, rounded, pastel renders within reach of illustrators, who used them across apps, advertising and editorial work.

### Where it is used

- App and product illustrations
- Icons and stickers
- Children’s brand visuals
- Friendly presentation covers

### Try it

- Full inflation and sheen give a balloon animal. (https://lumenary-studio.vercel.app/style/soft-3d?puff=100&gloss=90)
- Fewer, simpler shapes read best at small sizes. (https://lumenary-studio.vercel.app/style/soft-3d?colours=6&smooth=85)
- No pastel and light from the right is closer to glazed clay. (https://lumenary-studio.vercel.app/style/soft-3d?pastel=0&light=right)

### Words worth knowing

- **Normal:** A direction pointing straight out of a surface.
- **Specular highlight:** The bright spot where a shiny surface mirrors the light.
- **Ambient occlusion:** The darkening of creases and corners where less light reaches.

### See also

- 68 Clay 3D
- 69 Plasticine
- 58 Glassmorphism

## 76  Sticker  ·  _still_

- **Comes from:** Self-adhesive labels and street culture
- **Around:** 1935 label, 1980s vinyl stickers
- **Works best on:** One subject on a plain, different-coloured background

### Why it looks this way

A die-cut sticker is recognised by its edge. The artwork is cut out along its own outline, a margin of white vinyl is left all round so the cut never touches the ink, and the whole thing sits a hair above the surface. Flat colour and a dark keyline come from the printing. Gloss and a lifting corner come from the plastic.

### How it works

1. Guess the subject from how unlike the frame’s border each pixel is, and keep the largest patch.
2. Redraw the picture in flat cartoon colour with ink lines.
3. Grow the subject’s shape outward and round it off to make the white border.
4. Add a dark keyline where artwork meets border, and a slanted band of gloss.
5. Fold one corner back in a mirror line and show its grey underside.
6. Place it on a coloured surface with a soft shadow.

### The mathematics

There is no trained model here to find the subject, so it is guessed from two cheap clues. The colour of the frame’s border is averaged over a band 4% wide, and every pixel is scored by how unlike that colour it is, plus a little for being near the middle. The score is blurred and cut at a threshold set by the slider. Of the patches that survive, the largest connected one is kept, found by flood fill, and its holes are closed by flooding the outside from the border and keeping whatever the flood could not reach. If the patch is under 5% or over 90% of the frame the guess has failed, and a rounded square is used.

The white border is the shape grown outward. Blurring the shape and taking a low level of the blur does that, and rounds every notch on the way, which is how a cutting plotter treats a sticker too. The artwork is the flat-colour cartoon of the picture, with a dark keyline where it meets the border. The sticker is built on a sheet larger than the picture, so the border has room where the subject runs off the frame. Gloss is a slanted band of light kept to the sticker’s own pixels, and the peel is a true reflection: everything beyond a diagonal line is removed and drawn again mirrored in that line, in grey.

$$
\text{score}=0.8\,\operatorname{clamp}\!\Big(\frac{\lVert C-C_{\text{edge}}\rVert_{1}}{300}\Big)+0.2\,\big(1-\operatorname{clamp}(u^{2}+v^{2})\big)
$$
_How likely a pixel is to be subject: distance of its colour C from the border’s average, and closeness to the centre (u, v from −1 to 1)._

$$
\text{border}=S_{0.035,\,0.075}\!\Big(B_{b}^{2}\,B_{4}^{2}\,M\Big)
$$
_The sticker’s outline: the mask M blurred, then blurred again by the border width b, and cut at a low level._

$$
(x,\ y)\ \mapsto\ (c-y,\ c-x)
$$
_The peel: reflection in the fold line x + y = c._

### A short history

R. Stanton Avery built the first machine for self-adhesive labels in Los Angeles in 1935. Bumper stickers followed in the 1940s. Printed vinyl and computer-driven cutting plotters made custom shapes cheap in the 1980s, and stickers became part of skateboarding and street art. Messaging apps turned them digital around 2011, when large sticker sets joined the emoji.

### Where it is used

- Laptop and water bottle stickers
- Messaging sticker packs
- Packaging seals and labels
- Shop and brand mascots

### Try it

- If the cut misses your subject, switch to a round sticker. (https://lumenary-studio.vercel.app/style/sticker?shape=circle)
- A scalloped badge with a wide border looks like a prize seal. (https://lumenary-studio.vercel.app/style/sticker?shape=badge&border=90)
- Raise the cut to take in more of the picture. (https://lumenary-studio.vercel.app/style/sticker?cut=80&peel=false)

### Words worth knowing

- **Die cut:** Cut to the shape of the artwork instead of a rectangle.
- **Keyline:** A dark outline that holds a printed shape together.
- **Flood fill:** Finding a connected area by spreading from one pixel to all its like neighbours.

### See also

- 22 Vector Art
- 21 Comic book
- 92 Paper Cut-out

## 77  Marble Museum  ·  _still_

- **Comes from:** Stone relief sculpture
- **Around:** Antiquity onward
- **Works best on:** Portraits and figures lit from one side

### Why it looks this way

A relief is sculpture that stays attached to its wall. The carver has only a few centimetres of depth, so form is suggested by slopes that catch the light. Marble adds its own character: it lets light sink in a little, which softens every shadow, and it is crossed by veins that ignore the carving completely. One spotlight in a dark room does the rest.

### How it works

1. Use the picture’s brightness, mostly blurred, as the height of the stone.
2. Find the slope at each pixel and light it from the spotlight’s direction.
3. Darken the hollows and add a polished highlight.
4. Colour the stone with soft clouding, and draw veins where a warped noise crosses its middle.
5. Hang the slab on a dark wall with a shadow, lit edges and a brass plate.

### The mathematics

A relief keeps the big forms of its subject and only hints at the small ones. The height map is therefore mostly a well-blurred copy of the brightness with a share of the sharp picture mixed in, set by the “fine chisel work” slider. Slopes of that map give a normal at every pixel. Marble lets light a little way in before scattering it back, so the diffuse term is gentle and clamped well above black. Hollows collect shade: where the surface lies below its own local average it is darkened by up to half. Polish adds a tight highlight and a faint broad one.

The stone itself is three layers of noise. Soft clouding blends the two body colours. Veins appear where a warped fractal noise crosses its middle value: folding the noise about one half turns that crossing into a ridge, and a high power thins the ridge to a line. A second, finer set is added the same way. On the gallery wall the slab is drawn at four fifths of the width with a shadow thrown away from the spotlight, its cut edges are lit or dimmed according to the side the light comes from, and a brass plate carries the title.

$$
h=(1-\tfrac12 q)\,B_{7}^{2}L+\tfrac12 q\,B_{1.5}L
$$
_Height: broad forms plus a share q of fine detail (the chisel slider, 0 to 1)._

$$
I=\operatorname{clamp}\big(0.36+0.84\,(\mathbf n\cdot\mathbf l),\ 0.2,\ 1.3\big)\cdot\Big(1-\operatorname{clamp}\big(3.2\,(\bar h-h),\,0,\,0.5\big)\Big)
$$
_Shading: soft diffuse light times the darkening of hollows; h̄ is the local average height._

$$
\text{vein}=\operatorname{clamp}\Big(1.1\,\big(1-\lvert 2N_1-1\rvert\big)^{9}+0.5\,\big(1-\lvert 2N_2-1\rvert\big)^{12}\Big)
$$
_N₁ and N₂ are warped fractal noises at two scales; the fold makes a ridge where each crosses one half._

### A short history

Relief is among the oldest forms of sculpture, from Egyptian tomb walls to the marble frieze of the Parthenon, carved around 440 BC. In fifteenth-century Florence Donatello developed rilievo schiacciato, “flattened relief”, in which a scene is modelled in a depth of millimetres. White marble from Carrara in Tuscany has been quarried since Roman times and was the stone of Michelangelo.

### Where it is used

- Memorial and commemorative portraits
- Museum and gallery posters
- Luxury brand visuals
- Book covers for history and classics

### Try it

- Deep carving with fine chisel work brings out a face. (https://lumenary-studio.vercel.app/style/marble-museum?depth=90&detail=80)
- Black Marquina with high polish is the most dramatic stone. (https://lumenary-studio.vercel.app/style/marble-museum?stone=nero&polish=90)
- Take it off the wall to use the stone as a texture. (https://lumenary-studio.vercel.app/style/marble-museum?wall=false&veins=80)

### Words worth knowing

- **Bas-relief:** Low relief: carving that projects only slightly from its background.
- **Vein:** A streak of other minerals running through marble.
- **Subsurface scattering:** Light entering a material, bouncing about inside and leaving nearby.

### See also

- 202 Makli Carving
- 68 Clay 3D
- 70 Embossed Leather

## 78  Felt Story  ·  _still_

- **Comes from:** Felt boards and felt appliqué
- **Around:** Ancient textile, twentieth-century classrooms
- **Works best on:** Simple subjects with a few clear colours

### Why it looks this way

Felt cannot hold detail. It is thick, it frays, and scissors leave a soft edge, so a felt picture is made of a few simple shapes laid one over another. Depth comes from the small shadow each layer throws, and the pieces are held by a line of running stitch just inside the edge. All of that is friendly, which is why felt is the material of the nursery.

### How it works

1. Reduce the picture to a few colours and simplify the shapes twice.
2. Mute the colours, as dyed wool is strong but never glossy.
3. Roughen every edge with fine noise.
4. Add the nap: matted fibres and the odd stray hair.
5. Shade each piece on the side away from the light, where the piece above covers it.
6. Sew a dashed line a few pixels inside every edge.

### The mathematics

The picture is cut into a few pieces of felt: smoothing that keeps edges, a small palette, and a majority filter applied twice so that every piece is a simple shape. Felt is dyed wool, strong in colour but never glossy, so each colour loses some saturation and its lightness is squeezed toward the middle. Scissors do not cut felt cleanly, so the boundary of every piece is displaced by fine noise before anything is drawn. The nap is three noises of different size added to the brightness, with the odd lighter hair.

Stitching needs to know how far each pixel is from the edge of its piece. A one-pixel outline, blurred twice with a box of radius r, becomes a ridge whose height falls off in a straight line with distance; multiplied by the box width it runs from 1 on the edge to 0 about 2r pixels in. The running stitch is the band where that value corresponds to six and a half pixels from the edge. It is broken into dashes by the pixel’s position along whichever axis the edge runs, and the thread is light on dark felt and dark on light. Layers are told apart by shadow: a pixel is shaded when the felt three pixels up and to the left is a different piece.

$$
n=(2r+1)\,B_{r}^{2}E\ \approx\ 1-\frac{d}{2r+1}
$$
_Nearness to the edge: E is the one-pixel outline, B² two box blurs of radius r = 5, d the distance from the edge in pixels._

$$
\text{stitch}\iff\Big\lvert n-\Big(1-\frac{6.5}{2r+1}\Big)\Big\rvert<\frac{1.1}{2r+1}\ \ \text{and}\ \ \operatorname{frac}\frac{a}{\ell}<0.58
$$
_A dashed line 6.5 px in from the edge: a is the position along the edge and ℓ the dash length._

$$
f=1+0.12\,(N_{0.9}-\tfrac12)+0.10\,(N_{0.22}-\tfrac12)+0.09\,(\eta-\tfrac12)
$$
_The nap: two value noises and a per-pixel hash η, as a factor on the felt’s colour._

### A short history

Felt is made by matting wet wool, with no weaving, and is one of the oldest textiles known. Felt hangings with appliqué figures were found in the frozen tombs of Pazyryk in the Altai mountains, from about the fourth century BC. In the twentieth century the felt board became a teaching tool: cut-out figures cling to a felt-covered board, and a story can be told by moving them.

### Where it is used

- Children’s book and nursery art
- Craft tutorials and patterns
- Seasonal cards and decorations
- Soft, friendly brand illustrations

### Try it

- Few pieces and heavy stitching look hand sewn. (https://lumenary-studio.vercel.app/style/felt-story?colours=5&stitch=100)
- The nursery box swaps in bright craft-shop colours. (https://lumenary-studio.vercel.app/style/felt-story?set=nursery&simple=80)
- No stitching and strong shadows look like glued layers. (https://lumenary-studio.vercel.app/style/felt-story?stitch=0&shadow=100)

### Words worth knowing

- **Appliqué:** Decoration made by sewing cut pieces of cloth onto a larger piece.
- **Nap:** The fuzzy surface of a cloth, made by its loose fibres.
- **Running stitch:** The simplest stitch: the needle goes in and out along a line, leaving dashes.

### See also

- 92 Paper Cut-out
- 90 Quilt Patchwork
- 88 Embroidery

## 79  Pin Art  ·  _live_

- **Comes from:** The pinscreen of animators, and the desk toy
- **Around:** Pinscreen animation from 1933, the desk toy from 1985
- **Works best on:** Pictures with strong light and dark shapes, and faces in side light

### Why it looks this way

A bed of loose pins is a screen made of depth. Press an object into it and every pin slides back by exactly as much as the object is high, so the surface becomes a copy of its shape. Lit from one side, the round heads turn that copy into light and shadow: the taller the pin, the more light it catches. Here the picture decides how high each pin stands, so brightness becomes height, and height becomes brightness again.

### How it works

1. Divide the picture into a grid of pins and give each the average brightness of its square, with the contrast lifted.
2. Let every pin chase that brightness like a spring: it overshoots a little and settles.
3. Add a slow ripple, and push down the pins near the cursor so that a hand seems to press into the bed.
4. Draw each head as a small shaded sphere lit from the upper left, with a bright highlight.
5. Make taller pins larger, brighter and glossier, and leave the gaps between them dark.

### The mathematics

Each pin is a damped spring chasing a target height. The target comes from the brightness l of the picture over the pin, with the contrast lifted: t = clamp(1.3 (l - 0.5) + 0.5)^0.8, or 1 minus that if the dark parts should stand out, plus a travelling ripple 0.08 w sin(2 pi (1.3 x/n_x + 0.9 y/n_y) - 1.5 tau), with w the ripple slider and tau the time. The height h obeys h'' = k (t - h) - c h', stepped in pieces of at most 16 ms. The springiness slider sets k between 60 and 14 and the damping c from just over critical to about a third of it, which is the difference between a pin that creeps into place and one that rebounds.

The cursor is a Gaussian of width 0.075 of the picture. Where it is, a pin is pushed down at once to a cap of 1 - g, where g is the Gaussian times a hold factor that eases to 1 while the cursor is inside; its velocity is cut so that it does not bounce upward, and the spring takes it back as the cursor moves on. Each pin is then drawn in its cell as a sphere of radius rho = 0.6 + 0.33 H, where H is its height times the relief slider. The normal at offset (u, v) is (u, v, sqrt(rho^2 - u^2 - v^2)) / rho; the diffuse term is its dot product with the light direction (-0.42, -0.52, 0.74), normalised, and the highlight is (2 n_z (n . L) - L_z)^36, stronger for tall pins. The head is brightened by (0.3 + 0.9 diffuse)(0.3 + 1.05 H), and the gap between pins is near black with a thin rim of light on the shaft of tall ones.

$$
h''=k\,(t-h)-c\,h',\qquad k\in[14,60],\quad c=2\sqrt{k}\,\big(1.05-0.73\,s\big)
$$
_A pin chases its target t; s is the springiness slider (0 to 1)._

$$
\rho=0.6+0.33\,H,\qquad \mathbf n=\Big(\tfrac{u}{\rho},\ \tfrac{v}{\rho},\ \sqrt{1-\tfrac{u^{2}+v^{2}}{\rho^{2}}}\Big)
$$
_A head’s radius grows with its height H, and its normal follows the sphere._

$$
B=(0.3+0.9\,\mathbf n\!\cdot\!\mathbf L)(0.3+1.05\,H),\qquad S=(2n_z\,\mathbf n\!\cdot\!\mathbf L-L_z)^{36}
$$
_Brightness of a head and its specular highlight._

### A short history

The pinscreen was invented by the animators Alexandre Alexeieff and Claire Parker, who built the first one in Paris around 1931 and used it for the short film A Night on Bald Mountain (1933). Hundreds of thousands of pins stood in a board, and light raked across them from the side drew the picture in shadow. The toy version, with loose pins that take the shape of a hand pressed into it, was patented by Ward Fleming in 1985 and has sat on desks ever since.

### Where it is used

- Desk toys and gift shop props
- Title sequences and music videos
- Relief maps and tactile pictures
- Looping backgrounds for events

### Try it

- Brass pins and a tall relief make a convincing metal wall panel. (https://lumenary-studio.vercel.app/style/pin-art?metal=brass&relief=100&pins=60)
- Fine pins in the picture’s own colours turn it into a glittering bead screen. (https://lumenary-studio.vercel.app/style/pin-art?metal=picture&pins=120)
- Stand the dark parts forward to see a portrait as if cast in a mould. (https://lumenary-studio.vercel.app/style/pin-art?invert=dark)

### Words worth knowing

- **Relief:** A sculpture whose shapes stand out from a flat background instead of standing free.
- **Specular highlight:** The small bright spot where a shiny surface mirrors the light source.
- **Spring:** A force that pulls something back towards a rest position in proportion to how far it has moved.

### See also

- 125 Lenticular
- 70 Embossed Leather
- 41 Depth Parallax

