# F. Print and craft

Source: https://lumenary-studio.vercel.app/theory/craft (captured 2026-11-16 for private study).

Ink, thread, paper and glass: slow, handmade things, rebuilt from arithmetic.

## 80  Halftone  ·  _still_

- **Comes from:** Photoengraving and offset printing
- **Around:** 1880s onward
- **Works best on:** Portraits and high contrast photographs

### Why it looks this way

A press can lay down ink or leave paper bare, nothing in between, so printers fake grey with dots: small for light, large for dark. Your eye blends them when they are small enough. Colour printing repeats that with four inks, each on its own lattice turned to a different angle, so the dots interleave in a neat rosette instead of fighting each other.

### How it works

1. Rotate a square lattice by the screen angle and lay it over the picture.
2. Sample the picture at each lattice point.
3. Draw a circle whose area is proportional to the ink that tone needs, so the radius is the square root of the tone.
4. In four colour mode, separate the picture into cyan, magenta, yellow and black and draw four lattices at 15, 75, 0 and 45 degrees with the multiply blend.
5. In colour on black mode, let dots grow with brightness and take the cell’s colour.

### The mathematics

Printing cannot make grey, only ink or no ink, so a printer fakes tone with dots of varying size arranged on a regular lattice. The same trick is done here. A square lattice with spacing s is rotated by the screen angle and laid over the picture; at every lattice point the picture is sampled and a circle is drawn whose area is proportional to how much ink that tone needs. Area grows with the square of the radius, so the radius is the square root of the tone.

In four-colour mode the picture is separated into cyan, magenta, yellow and black the way a print shop does, and four lattices are drawn with the “multiply” blend so the inks combine like transparent printing inks. The four lattices use the traditional screen angles of 15°, 75°, 0° and 45° (shifted together by the angle slider), because overlaying grids at the same angle causes visible moiré while grids at well-separated angles produce the small rosette pattern seen in magazines. “Color on black” turns it around: dots grow with brightness and take the cell’s colour, normalised so the strongest channel is full.

$$
\mathbf p_{ij}=\mathbf c+s\,R(\theta)\begin{bmatrix}i\\ j\end{bmatrix},\qquad R(\theta)=\begin{bmatrix}\cos\theta&-\sin\theta\\ \sin\theta&\cos\theta\end{bmatrix}
$$
_Dot centres on a lattice of spacing s rotated by θ about the picture centre c._

$$
r=\tfrac12\,s\,g\cdot1.06\,\sqrt{\operatorname{adj}(1-L)}\qquad\text{since}\quad\pi r^{2}\propto\text{ink}
$$
_Radius of a one-ink dot; g is dot gain and adj() the contrast curve._

$$
K=1-\max(R,G,B),\qquad C=\frac{1-R-K}{1-K},\quad M=\frac{1-G-K}{1-K},\quad Y=\frac{1-B-K}{1-K}
$$
_RGB to CMYK separation (channels in 0 to 1)._

### A short history

Stephen Horgan printed the first halftone photograph in a daily newspaper in 1880, and Frederic Ives patented a halftone process in 1881. Four colour offset printing through the twentieth century made the dot the basis of nearly every magazine, and it is why a close look at a printed photograph shows rosettes.

### Where it is used

- Newspaper and magazine style imagery
- Poster and print design
- Pop art and retro effects
- Screen print separations

### Try it

- Four colour mode with large dots shows the printing process itself. (https://lumenary-studio.vercel.app/style/halftone?mode=cmyk&cells=50)
- Fine dots at 45 degrees are close to a photograph. (https://lumenary-studio.vercel.app/style/halftone?cells=160&angle=45)
- Colour on black glows like a lit billboard. (https://lumenary-studio.vercel.app/style/halftone?mode=color)

### Words worth knowing

- **Screen angle:** The angle at which a dot lattice is rotated.
- **Moiré:** A wavy interference pattern made when two regular grids overlap at nearly the same angle.
- **CMYK:** Cyan, magenta, yellow and black: the four inks of most colour printing.

### See also

- 55 Newspaper
- 09 Pop Art
- 84 Screen Print

## 81  Risograph  ·  _still_

- **Comes from:** Japanese stencil duplicators
- **Around:** 1980s machine, art-print revival since the 2000s
- **Works best on:** Illustrations, portraits and landscapes with clear tonal masses

### Why it looks this way

A risograph prints one colour per pass, so its pictures are built from two or three overlapping inks with a grainy fill and a hint of misregistration. This treatment makes two plates from the picture, one for shadows and one for almost everything, lays ink as random grain instead of dots, and multiplies the inks so overlaps mix like real transparent inks.

### How it works

1. Make plate one from the darkness raised to the power 1.35, which carries the shadows.
2. Make plate two from the darkness raised to the power 0.75, which carries almost everything, and read it from a position a few pixels away.
3. Compare each plate with a threshold of 0.5 plus a mix of white and smooth noise to decide where to ink, and smooth the comparison slightly.
4. Multiply the two inks together, so overlaps become a deeper third colour.
5. Multiply in a faint paper fibre pattern.

### The mathematics

A risograph is a stencil duplicator that prints one ink colour per pass, which is why its pictures are built from two or three colours that overlap. Here two plates are made from the picture’s darkness. Plate one carries the shadows (darkness to the power 1.35). Plate two carries almost everything (darkness to the power 0.75, times 0.92) and is read from a position a few pixels away, because paper never goes back through the machine in exactly the same place.

A riso plate lays ink as a random grain, not as dots. For each pixel the plate’s value is compared with a threshold that is not 0.5 but 0.5 plus a mix of white noise and smooth noise, scaled by the grain slider: where the value beats the threshold the pixel is inked. Smoothing the comparison over a small range (±0.09) avoids hard pixels. The two inks combine by multiplication, the way transparent inks do, so the overlap of blue and pink is a deep purple, and a faint fibre pattern is multiplied in to look like paper.

$$
a_1=(1-L)^{1.35},\qquad a_2=0.92\,\big(1-L(\mathbf x+\boldsymbol\delta)\big)^{0.75}
$$
_The two plates; δ is the misregistration offset, about 7 px across and 4.5 px up at full strength._

$$
\text{cov}_k=\operatorname{smoothstep}\big(\vartheta_k-0.09,\ \vartheta_k+0.09,\ a_k\big),\qquad \vartheta=\tfrac12+\big(0.55\,r+0.45\,n-\tfrac12\big)G
$$
_Coverage by ink k; r is white noise, n smooth noise, G = 0.25 + 1.3 × the grain slider._

$$
C=C_{\text{paper}}\prod_{k=1}^{2}\Big(1-\text{cov}_k\,\delta_k\,\big(1-I_k/255\big)\Big)
$$
_Multiply blend of the two inks I_k on the paper; δ_k is the ink density slider times a faint patchy unevenness._

### A short history

The Japanese company Riso Kagaku developed the Risograph as a fast, cheap duplicator for schools and offices, and it reached the market in the 1980s. Illustrators and small presses adopted it in the 2000s for its soft colour, grain and low cost, and riso zines and prints are now a recognisable look.

### Where it is used

- Zines, posters and art prints
- Independent book and album covers
- Event flyers with a handmade feel
- Illustration portfolios

### Try it

- Teal and orange gives a punchy, warm and cool contrast. (https://lumenary-studio.vercel.app/style/risograph?pair=teal-orange)
- Strong misregistration looks like a rushed print run. (https://lumenary-studio.vercel.app/style/risograph?miss=90&grain=80)
- White paper with dense ink looks clean and modern. (https://lumenary-studio.vercel.app/style/risograph?paper=white&density=120)

### Words worth knowing

- **Misregistration:** When separate colour layers do not line up exactly.
- **Spot colour:** An ink printed by itself rather than mixed from others.
- **Plate:** The stencil or surface that carries one colour.

### See also

- 84 Screen Print
- 63 Duotone
- 80 Halftone

## 82  Linocut  ·  _still_

- **Comes from:** Printmaking
- **Around:** Early 1900s onward
- **Works best on:** Strong portraits and landscapes with clear forms

### Why it looks this way

A linocut is printed from a block with the light parts cut away, so tone has to come from area and line: the darkest places are left solid, middle tones become lines that thicken with darkness, and the lights are gouged out. This treatment lays lines across the picture and bends them with the picture’s brightness, so they swing round shapes the way a carver’s hand does.

### How it works

1. Lay a set of parallel lines across the picture at the chosen angle.
2. Bend each line’s coordinate with slow noise and with the picture’s brightness.
3. For every pixel measure its distance from the middle of its line and ink it if that is smaller than a width that grows with darkness.
4. Add a slow swell along each line to mimic the taper of a V-shaped gouge.
5. Add solid ink along strong edges as carved outlines, and knock small holes in the ink with roller specks.

### The mathematics

A linocut is printed from a block of lino with the white parts cut away; what is left stands up and takes the ink. So tone has to be made from line and area: the darkest parts are left uncut (solid ink), the middle tones become lines whose ink width follows the darkness, and the lights are cut away almost entirely. The program lays a set of parallel lines across the picture. Each line’s coordinate is bent by slow noise and by the picture’s brightness, so the lines swing round shapes as a carver’s hand does.

At every pixel it finds how far it is from the middle of its line (0 at the centre, 1 at the gouge between lines) and inks it if that distance is smaller than a width that grows with darkness, with a slowly changing swell along each line to mimic the taper of a V-gouge. Optional carved outlines add solid ink wherever the Sobel edge strength is high. A few roller specks, noise above 0.86, knock small holes in the ink.

$$
u=\frac{n\,(x\cos\theta+y\sin\theta)}{W}+3.2\,w\,(\nu-\tfrac12)+1.5\,w\,(\tfrac12-L_b),\qquad f=u-\lfloor u\rfloor
$$
_Line coordinate: n lines across, θ the direction, w the wander slider and ν slow noise; f is the position within a line._

$$
q=\min\!\big(1.08,\ 1.12\,d^{0.85}\,s\big),\quad s=0.78+0.45\,\nu',\qquad d=1-\text{contrast}(L_b)
$$
_Cut width q from the darkness d, with the taper s along the line._

$$
a=\operatorname{smoothstep}\big(\lvert 2f-1\rvert-0.08,\ \lvert 2f-1\rvert+0.02,\ q\big)\ \text{if } q>0.06,\ \text{else }0
$$
_Ink coverage a at the pixel._

### A short history

Linoleum was patented by Frederick Walton in the 1860s as a floor covering. By the early 1900s printmakers, among them the German expressionists of Die Brücke, were carving it because it was softer than wood. Pablo Picasso made a famous series of colour linocuts in the 1950s, and the technique remains popular in schools and studios.

### Where it is used

- Poster and book cover art
- Greeting cards and wrapping designs
- Folk-art and craft styled illustration
- Printmaking practice studies

### Try it

- Fewer, thicker cuts look bold and hand carved. (https://lumenary-studio.vercel.app/style/linocut?lines=36&wave=70)
- Rust ink without outlines is softer. (https://lumenary-studio.vercel.app/style/linocut?ink=rust&outline=false)
- Rotate the cuts to a different direction. (https://lumenary-studio.vercel.app/style/linocut?angle=100)

### Words worth knowing

- **Gouge:** A curved carving tool that removes a groove of material.
- **Relief print:** A print made from the raised parts of a block.
- **Block:** The piece of lino or wood that is carved and inked.

### See also

- 85 Mezzotint
- 84 Screen Print
- 73 Rubber Stamp

## 83  Banknote Engraving  ·  _still_

- **Comes from:** Security printing
- **Around:** 19th century onward
- **Works best on:** Portraits with clear faces

### Why it looks this way

Banknotes were made to be difficult to forge, so their portraits are built from fine engraved lines whose thickness changes with tone, surrounded by guilloche rosettes drawn by rolling one circle inside another. This treatment does both: thick ribbons in the shadows, hairlines in the lights, and curves that look like machined lacework.

### How it works

1. Draw the picture as horizontal ribbons inside a rounded window.
2. Walk along each line in short steps, read the darkness beneath, and set the half thickness to a power of that darkness, capped at half the line spacing.
3. Shift lines down where the picture is light and up where it is dark, and add a gentle sine wave so the surface looks modelled.
4. Add the security devices: a faint tint of fine wavering lines, a double frame, and guilloche rosettes repeated seven times with slightly different pen offsets.
5. Set an invented numeral, serial number and title in a Bodoni face.

### The mathematics

Engraved banknote portraits are made of lines, not dots. Each line is a ribbon whose thickness changes with the tone it passes through: thick in the shadows, thin in the lights. The program draws the picture as n horizontal ribbons inside a rounded window. For each line it walks along x in short steps, reads the darkness under it and sets the half-thickness to a power of that darkness, capped at half the line spacing, so the thickest ribbons almost touch. The two edges are then joined into one filled shape.

The lines also move: they are shifted down where the picture is light and up where it is dark, and given a gentle sine wave, which makes the surface look modelled instead of printed. Around the portrait come the usual security-print devices. A faint wavering tint of very fine lines covers the note; a double frame surrounds it; and the rosettes are guilloche patterns, curves drawn by rolling one circle inside another (a hypotrochoid), repeated seven times with a slightly different pen offset so they interleave, and scaled by 0.62. A numeral, a serial number and a title are set in a Bodoni face; the wording is invented.

$$
\text{half}=\min\!\Big(\tfrac p2,\ 0.52\,p\,d^{0.9}+0.18\,\sigma\Big),\qquad d=1-\text{contrast}(L,0.2)
$$
_Half thickness of the ribbon; p is the line spacing, σ the scale of the picture._

$$
y_c=y_i+(\tfrac12-d)\,1.4\,p\,\kappa+0.35\,p\,\kappa\,\sin(0.018\,x+0.45\,i)
$$
_Centre line of ribbon i, κ being the swing slider._

$$
\begin{aligned}x&=(R-r)\cos t+\delta\cos\!\Big(\tfrac{R-r}{r}\,t\Big)\\ y&=(R-r)\sin t-\delta\sin\!\Big(\tfrac{R-r}{r}\,t\Big)\end{aligned},\quad r=0.34R,\ \delta\approx0.78R
$$
_The guilloche curve (hypotrochoid), traced over eight turns of t._

### A short history

Engraved banknotes grew from the engraving of plates for books and bank bills, and the early nineteenth century saw intricate machine-turned patterns added against forgery. The first postage stamp, the Penny Black of 1840, had an engine-turned background for the same reason. Today’s banknotes still combine engraving and guilloche with newer security features. The wording in this treatment is invented, and the note is not real money.

### Where it is used

- Certificates and diplomas
- Vintage and heritage graphics
- Portrait art with a fine line look
- Stationery and invitation design

### Try it

- Brown ink with a high line count looks like a nineteenth century bond. (https://lumenary-studio.vercel.app/style/banknote-engraving?ink=brown&lines=130)
- Strong line swing exaggerates the sculpted look. (https://lumenary-studio.vercel.app/style/banknote-engraving?swing=90)
- Turn off the rosettes to see only the portrait. (https://lumenary-studio.vercel.app/style/banknote-engraving?rosettes=false)

### Words worth knowing

- **Guilloche:** An intricate pattern of interlaced curves made by machine or by a rolling circle.
- **Intaglio:** A printing method in which ink sits in grooves cut into a metal plate.
- **Hypotrochoid:** The curve traced by a point on a circle rolling inside a larger circle.

### See also

- 15 Victorian
- 85 Mezzotint
- 01 Art deco

## 84  Screen Print  ·  _still_

- **Comes from:** Stencil printing in Asia, then commercial presses and art studios
- **Around:** Commercial use from the 1900s, pop art in the 1960s
- **Works best on:** Bold portraits and graphic scenes

### Why it looks this way

Screen printing pushes ink through a mesh, one colour at a time. Cut the picture into brightness bands, print the lightest ink over the darkest regions and add darker inks over smaller areas, and the dark parts receive every ink in turn. Because inks are transparent they multiply, so overlaps create new colours without extra plates.

### How it works

1. Cut the picture into bands: the lightest ink covers every pixel darker than 0.84, the next everything darker than 0.62, then 0.41, then 0.21.
2. Print each ink as a separate flat layer.
3. Combine the layers by multiplication, so yellow over red becomes orange and the full stack is near black.
4. Shift each pass by its own small random offset for misregistration.
5. Wobble the thresholds with smooth noise for ragged edges and add a faint cross-hatch from the mesh.

### The mathematics

Screen printing pushes ink through a mesh with a stencil, one colour at a time. The picture is cut into brightness bands, one per ink, from light to dark: the lightest ink (say yellow) covers every pixel darker than 0.84, the next covers everything darker than 0.62, then 0.41, then 0.21. So a dark region receives all the inks, one on top of the other, and a light region only the first.

Inks are transparent and are combined by multiplication, so the overlap of yellow and red is orange and the full stack is nearly black, as in a real print. Three imperfections make it feel physical. Each pass is shifted by its own small random offset (misregistration). The threshold is wobbled by smooth noise, so the edges are slightly ragged. And the ink film is a little uneven, with a faint cross-hatch from the mesh. With fewer inks the program picks a subset (the second and fourth for two, the first, third and fourth for three).

$$
\text{cov}_k=1-\operatorname{smoothstep}\big(\vartheta_k-0.012,\ \vartheta_k+0.012,\ L(\mathbf x+\mathbf o_k)+r\big),\qquad \vartheta=(0.84,\,0.62,\,0.41,\,0.21)
$$
_Coverage by ink k: o_k is that pass’s offset and r the edge noise._

$$
C=C_{\text{paper}}\prod_k\Big(1-\text{cov}_k\,\phi_k\,\big(1-I_k/255\big)\Big),\qquad \phi_k=0.93+0.07\,n
$$
_Multiply overprint; φ is the unevenness of the ink film._

$$
w=1-0.07\,m\,\Big(\tfrac12+\tfrac12\cos\tfrac{2\pi x}{\lambda}\cos\tfrac{2\pi y}{\lambda}\Big)
$$
_Mesh texture: m is the slider and λ the mesh spacing._

### A short history

Stencil printing through silk or fine mesh was used in East Asia for centuries. Commercial screen printing spread in the early 1900s, and in the 1930s artists proposed the name serigraphy for fine art prints. Andy Warhol made the technique famous in the 1960s, and it is still the main way to print posters, t-shirts and gig bills.

### Where it is used

- Poster and gig bill design
- T-shirts and merchandise
- Album and event artwork
- Limited edition art prints

### Try it

- Two inks with strong misregistration is a punk poster. (https://lumenary-studio.vercel.app/style/screen-print?passes=2&miss=85)
- The ice palette is cool, calm and modern. (https://lumenary-studio.vercel.app/style/screen-print?palette=ice)
- Smooth edges and little mesh look like a clean commercial print. (https://lumenary-studio.vercel.app/style/screen-print?rough=5&mesh=10)

### Words worth knowing

- **Serigraphy:** The art term for fine art screen printing.
- **Pass:** One run of the paper under one ink.
- **Mesh:** The woven screen through which ink is pushed.

### See also

- 81 Risograph
- 09 Pop Art
- 80 Halftone

## 85  Mezzotint  ·  _still_

- **Comes from:** Copper plate printmaking
- **Around:** Invented in 1642, popular in 17th to 19th century Europe
- **Works best on:** Dark, moody pictures with soft light

### Why it looks this way

Mezzotint begins with darkness and works towards light. A copper plate is roughened evenly with a toothed tool so that it holds ink as a dense field of pits and prints solid black. The engraver then burnishes the plate smooth where the picture should be lighter, and smoother copper holds less ink, so tone is made from the density of tiny pits instead of lines or dots.

### How it works

1. Make a random value for each point, a mix of 62 percent white noise per grain cell and 38 percent smooth noise, to stand for the plate’s roughness.
2. Raise the picture’s darkness to a power set by the burnishing slider.
3. Ink the pixel where darkness beats the roughness, softening the decision with a smoothstep of width plus or minus 0.1.
4. Dark areas win almost everywhere and print black. Light areas win only at the roughest pits and stay mostly white with scattered specks.
5. Add a bevelled plate mark where the plate pressed into the paper.

### The mathematics

Mezzotint begins with a copper plate roughened all over with a rocker, so that it holds ink as a dense field of pits and prints solid black. The engraver then burnishes the plate smooth where the picture should be lighter; smoother copper holds less ink. Tone is therefore made from the density of tiny pits, not from lines or dots.

The program does the same in reverse. A random value, a mix of 62% white noise (per grain cell) and 38% smooth noise, stands for how rough the plate is at each point. Darkness is raised to a power (the burnishing slider controls how much) and compared with that value: where darkness wins, the pixel takes ink, softened by a smoothstep of width ±0.1. Dark areas win nearly everywhere and are black; light areas win only at the roughest pits and stay white with scattered black specks, which is exactly the velvet gradation of the original. A bevelled edge shows where the plate pressed into the paper.

$$
d=(1-L)^{\,0.8+0.5\,b},\qquad n=0.62\,r+0.38\,\nu
$$
_Darkness after burnishing b (0 to 1), and the roughness n of the plate (r white noise per grain cell, ν smooth noise)._

$$
a=\operatorname{smoothstep}\big(t-0.1,\ t+0.1,\ 1.08\,d\big),\qquad t=\tfrac12+(n-\tfrac12)(1.1-0.3\,b)
$$
_Ink coverage a at a pixel._

### A short history

The method is credited to Ludwig von Siegen, a German officer, in 1642, and Prince Rupert of the Rhine introduced it to England. In the eighteenth century it became the English favourite for reproducing portraits and paintings, valued for its velvety darks, before photography replaced it.

### Where it is used

- Dramatic portrait and still life prints
- Gothic and moody poster art
- Book plates and fine art reproductions
- Backgrounds with a velvet black

### Try it

- Heavy burnishing gives bright highlights on a deep ground. (https://lumenary-studio.vercel.app/style/mezzotint?burnish=85)
- Sepia ink with coarse grain feels antique. (https://lumenary-studio.vercel.app/style/mezzotint?ink=sepia&grain=3)
- Hide the plate mark to fill the page. (https://lumenary-studio.vercel.app/style/mezzotint?plate=false)

### Words worth knowing

- **Rocker:** A toothed, curved tool rocked across a plate to roughen it.
- **Burnisher:** A smooth tool used to polish areas of the plate so they hold less ink.
- **Plate mark:** The dent a plate leaves around a print.

### See also

- 83 Banknote Engraving
- 15 Victorian
- 98 Charcoal Sketch

## 86  Cyanotype  ·  _still_

- **Comes from:** Early photography
- **Around:** 1842 onward
- **Works best on:** Silhouettes, plants and pictures with strong light and shade

### Why it looks this way

A cyanotype is a sun print: paper coated with iron salts turns Prussian blue where light strikes it and washes white where it does not. It has no greys other than varying blue. This treatment maps the picture’s brightness onto that chemistry and adds what hand coating always brings: blotches, brush strokes and a ragged edge where the liquid pooled.

### How it works

1. Stretch the picture, shift it by the exposure slider and add contrast.
2. Send the result through a five colour ramp from deep blue in the shadows to near white in the highlights. Tea and green toning swap in other ramps.
3. Change the tone slightly with two noises, one slow and blotchy and one long and thin like a brush stroke.
4. Stop the coating short of the sheet edge in a ragged line from two more noises, with a darker pooled edge.
5. Show bare cream paper outside the edge and multiply a fine fibre noise over everything.

### The mathematics

A cyanotype is made by coating paper with iron salts and exposing it to sunlight; where light strikes, the salts turn Prussian blue, and where it does not they wash away and leave white paper. The treatment maps brightness onto that chemistry. The picture is stretched, shifted by the exposure slider and given contrast; the result runs a five-colour ramp from deep blue (shadows) to near white (highlights). Tea toning and green toning swap in a different ramp.

Hand-coated paper is never even. Two noises, one slow and blotchy, one long and thin like a brush stroke, change the tone slightly (the uneven-coating slider). The coating stops short of the sheet edge in a ragged line made from two more noises, and where the liquid pooled at the boundary the print is darker; outside the edge the bare cream paper shows. A fine fibre noise is multiplied over everything.

$$
t=\operatorname{clamp}\big(\text{contrast}\big(L+0.4\,\epsilon+\pi,\ c\big)\big),\qquad \pi=0.28\,u\,(n_1-\tfrac12)+0.12\,u\,(n_2-\tfrac12)
$$
_Tone t: ε is the exposure slider, c the contrast and u the uneven-coating slider._

$$
C=\text{ramp}(t),\qquad c=\operatorname{smoothstep}(-2\sigma,\ 2\sigma,\ e-m+\rho)
$$
_Colour from the five-stop ramp; c is how coated the pixel is: e the distance to the sheet edge, m = 0.055 of the short side, ρ the ragged-edge noise, σ the picture scale._

$$
C\leftarrow C\,\big(1-0.8\,p\big),\qquad p=0.22\,c\,\big(1-\operatorname{smoothstep}(0,\ 9\sigma,\ e-m+\rho)\big)
$$
_Darkening where the liquid pooled along the edge._

### A short history

Sir John Herschel invented the cyanotype in 1842. In 1843 Anna Atkins used it to publish photographic records of seaweeds, often called the first book illustrated with photographs. Engineers later copied their drawings with it, producing the original blueprints, and artists and schoolchildren still make sun prints with the same chemistry.

### Where it is used

- Botanical and nature prints
- Craft and photography projects
- Blue toned wall art and posters
- Cover art with a handmade feel

### Try it

- Tea toning warms the blue into brown. (https://lumenary-studio.vercel.app/style/cyanotype?tone=tea)
- Overexposure bleaches the print towards white. (https://lumenary-studio.vercel.app/style/cyanotype?exposure=30)
- Uneven coating with no brushed edge looks more like a full sheet. (https://lumenary-studio.vercel.app/style/cyanotype?uneven=80&brush=false)

### Words worth knowing

- **Prussian blue:** A deep blue pigment formed in the cyanotype chemistry.
- **Exposure:** How long and how strongly light strikes the paper.
- **Toning:** Changing the colour of a photographic print with a chemical bath.

### See also

- 27 Blueprint
- 63 Duotone
- 103 Ink Wash

## 87  Cross-stitch  ·  _still_

- **Comes from:** Counted thread embroidery
- **Around:** Centuries old, charted patterns from the 19th century
- **Works best on:** Bold, simple subjects with distinct colours

### Why it looks this way

Cross-stitch is counting: the cloth is a grid of holes, and every stitch fills exactly one square. That makes the whole craft a pixel art problem. Shrink the picture to one pixel per square, limit the colours to a box of flosses and draw an X in each square, with back threads below and front threads on top for a woven look.

### How it works

1. Shrink the picture to one pixel per square of cloth.
2. Find the k most representative colours with k-means, made slightly more saturated, and give each square the nearest.
3. Optionally leave squares lighter than 0.86 bare.
4. Draw the cloth with faint threads along every grid line and a dark hole at every corner.
5. Draw each stitch as two strokes: back strokes first in a slightly darker shade, then a soft shadow, then the front strokes with a thin pale highlight for the twist.

### The mathematics

Cross-stitch counts. The cloth (aida) is a grid of holes and every stitch fills one square, so the picture is first shrunk to one pixel per square, the “stitches across” slider. The colours are then limited to the box of flosses you chose: k-means clustering finds the k most representative colours of the small picture (made slightly more saturated) and each square takes the nearest one. The “bare” option skips squares lighter than 0.86, leaving the cloth showing.

Each stitch is a cross of two strokes drawn with round caps, inset from the corners of its square. All the back strokes (one diagonal) are drawn first in a slightly darker shade, then a soft offset shadow, then the front strokes in the true colour (the other diagonal), then a thin pale highlight along each front thread to suggest twist. The cloth itself is drawn first: faint threads along every grid line, and a small dark hole at every corner.

$$
s=\frac{W}{n},\qquad \text{inset}=0.15\,s,\qquad \text{thread width}=0.34\,s
$$
_Geometry of a stitch for n stitches across._

$$
c(i,j)=\arg\min_{f\in F}\ \big\lVert \bar P_{ij}-f\big\rVert_{\text{redmean}}
$$
_Each square takes the floss in the set F nearest to the average colour of its pixels; redmean is a distance that weights red and blue by brightness._

### A short history

Counted thread embroidery has been worked for many centuries. Samplers, in which girls recorded stitches, alphabets and mottoes, were made from the sixteenth century onward, and printed charts of the nineteenth century, such as Berlin wool work, spread patterns widely. Today cross-stitch is a hobby for people who enjoy slow, careful making.

### Where it is used

- Craft patterns and gifts
- Pixel art in thread
- Nursery and home decor ideas
- Nostalgic textile style graphics

### Try it

- A black cloth makes the colours glow. (https://lumenary-studio.vercel.app/style/cross-stitch?cloth=black&flosses=10)
- Leave the light areas bare for a sampler look. (https://lumenary-studio.vercel.app/style/cross-stitch?bare=true)
- Fewer stitches across makes a chunkier, more graphic pattern. (https://lumenary-studio.vercel.app/style/cross-stitch?across=40&flosses=6)

### Words worth knowing

- **Aida:** A cloth woven with a grid of holes for counted embroidery.
- **Floss:** Embroidery thread made of loosely twisted strands.
- **Sampler:** A piece of embroidery made to show off stitches or to record patterns.

### See also

- 88 Embroidery
- 26 Pixel art
- 89 Knitted Pattern

## 88  Embroidery  ·  _still_

- **Comes from:** Textile traditions across the world
- **Around:** Thousands of years old
- **Works best on:** Pictures with clear edges and rich colour

### Why it looks this way

An embroidered picture is drawn with thousands of short threads laid in the direction the shape runs, so a face is stitched around the cheek and a leaf along the vein. This treatment follows that logic: each stroke runs along the edge it sits on, in a colour taken from the picture, and is shaded to look glossy.

### How it works

1. Scatter a jittered grid of stroke centres over the picture and put them in random order.
2. For each, find the direction of the edge: the thread runs perpendicular to the gradient. Where there is no edge, use a lazy angle that changes slowly.
3. Blend the two directions by an amount that grows with edge strength and with the follow slider.
4. Choose floss colours by k-means and give each stroke the nearest to the colour of a quarter-size copy at its centre.
5. Draw each stroke three times: a dark offset shadow, the thread itself, and a thin lighter line to one side for sheen, on linen with a wooden hoop.

### The mathematics

Embroidered pictures are drawn with short glossy threads laid in the direction the shape runs. The program scatters a jittered grid of stroke centres over the picture and puts them in random order. For each one it finds the direction of the picture’s edge: the gradient (the slope of brightness) points across an edge, so the thread runs perpendicular to it. Where there is no edge the thread would have no direction at all, so a lazy angle is used instead: a base angle plus a random shift that is constant over each 16-pixel square. The two directions are blended by an amount that grows with the edge strength and with the “follow the shapes” slider.

The k floss colours come from k-means on the picture, and each stroke takes the floss nearest to the colour of a quarter-size copy at its centre. It is drawn three times: a dark, offset shadow, the thread itself in a brightness varied by about ±10%, and a thin lighter line slightly to one side for the sheen. The background is linen, flecks of short horizontal and vertical threads. The hoop is a wooden ellipse with a highlight, with the area outside it dark.

$$
\theta_e=\operatorname{atan2}(G_x,\,-G_y),\qquad w=\phi\ \operatorname{clamp}(14\,\lvert\nabla L\rvert)
$$
_Thread direction along the edge (the gradient G turned by 90°), and the weight w of edge-following; φ is the follow slider._

$$
\theta=\operatorname{atan2}\!\big(w\sin\theta_e+(1-w)\sin\theta_0,\ \ w\cos\theta_e+(1-w)\cos\theta_0\big)
$$
_Blend with the lazy direction θ₀ by adding unit vectors._

### A short history

Embroidery is among the oldest decorative arts. The Bayeux Tapestry, made in the eleventh century, is in fact an embroidery in wool on linen. In 1828 Josué Heilmann in Alsace built an early embroidery machine, and today computerised machines stitch logos and motifs on clothing from digital files.

### Where it is used

- Patches, badges and apparel logos
- Craft and textile inspired illustration
- Heritage and handmade brand graphics
- Gift and keepsake designs

### Try it

- Short strokes with many flosses make a fine, painterly stitch. (https://lumenary-studio.vercel.app/style/embroidery?density=4&flosses=16)
- Let threads follow the shapes strongly. (https://lumenary-studio.vercel.app/style/embroidery?follow=100)
- Hide the hoop to fill the whole frame. (https://lumenary-studio.vercel.app/style/embroidery?hoop=false)

### Words worth knowing

- **Floss:** Embroidery thread made of loosely twisted strands.
- **Satin stitch:** Parallel stitches laid close together to cover an area smoothly.
- **Hoop:** A ring that holds cloth taut while it is stitched.

### See also

- 87 Cross-stitch
- 89 Knitted Pattern
- 91 Tapestry Weave

## 89  Knitted Pattern  ·  _still_

- **Comes from:** Hand knitting, with Nordic and Fair Isle traditions
- **Around:** Knitting for about a thousand years, Fair Isle patterns from the 19th century
- **Works best on:** Bold, simple pictures with a few colours

### Why it looks this way

Plain knitting is a lattice of V shaped stitches, each made of two plump legs of yarn, and it is wider than tall. If you draw one stitch well, with round legs, plies and a shadow, you can stamp it at every grid position and it looks like a real jumper. Colour changes between stitches then give you the picture.

### How it works

1. Reduce the picture to one pixel per stitch.
2. Choose yarn colours by k-means and give each stitch the nearest.
3. For each yarn colour draw one stitch as a small picture: two ellipses tilted 0.42 radians in opposite directions with a gradient that makes them look round, slanted lines for the plies and a soft shadow.
4. Stamp that stitch at every position of the grid, which is about 1 to 0.74 in width to height.
5. Replace the top and bottom rows with a Fair Isle border, a repeating eight by seven motif of small diamonds in the darkest and lightest yarns.

### The mathematics

Plain knitting (stockinette) is a lattice of V-shaped stitches, each made of two plump legs of yarn. A knit stitch is wider than it is tall, about 1 to 0.74 here. The program draws one stitch once for every yarn colour, as a small picture: two ellipses tilted 0.42 radians in opposite directions, each filled with a gradient that is dark at the edges and bright in the middle so it looks round, with slanted lines across for the plies of the yarn and a soft shadow underneath. That sprite is then stamped at every position of the grid.

The yarn colours come from k-means on a picture with one pixel per stitch; each stitch takes the nearest. The Fair Isle border replaces the top and bottom rows (up to eight of each) with a repeating eight-by-seven motif, a lattice of small diamonds followed by a blank row and a solid row, knitted in the darkest and lightest of the chosen yarns, in the manner of a Nordic jumper.

$$
w=\frac{W}{n},\qquad h=0.74\,w,\qquad \text{rows}=\Big\lceil\frac{H}{h}\Big\rceil+1
$$
_Stitch width, height and number of rows for n stitches across._

$$
\text{leg}:\ \ r_x=0.26\,w,\quad r_y=0.62\,h,\quad \text{tilt}=\mp0.42\ \text{rad}
$$
_Each of the two legs is an ellipse of these radii._

### A short history

Knitting is known from Egypt around the eleventh century, and knitted colour patterns developed in Scandinavia and the Shetland Islands. Fair Isle gets its name from a small island in Shetland, and the style became fashionable far beyond it when the Prince of Wales wore a Fair Isle pullover in 1921.

### Where it is used

- Jumper and winter themed graphics
- Cosy seasonal cards and posters
- Craft patterns and charts
- Textile and pattern design ideas

### Try it

- More stitches across give a finer fabric. (https://lumenary-studio.vercel.app/style/knitted-pattern?across=80&yarns=8)
- Three yarn colours make it look like a classic jumper. (https://lumenary-studio.vercel.app/style/knitted-pattern?yarns=3)
- Turn off the Fair Isle border for a plain panel. (https://lumenary-studio.vercel.app/style/knitted-pattern?border=false)

### Words worth knowing

- **Stockinette:** The plain knitted fabric with V shaped stitches on one side.
- **Fair Isle:** Stranded colour knitting with small repeating patterns.
- **Ply:** One of the strands twisted together to make yarn.

### See also

- 87 Cross-stitch
- 88 Embroidery
- 90 Quilt Patchwork

## 90  Quilt Patchwork  ·  _still_

- **Comes from:** Textile traditions worldwide
- **Around:** Centuries old
- **Works best on:** Bold pictures with simple colour regions

### Why it looks this way

A quilt makes a picture from scraps: cut cloth into squares or triangles, choose the colour that best matches each part of the picture, and sew them together. The quilting stitches then pull each patch into a gentle puff, light on top and shadowed at the seams. Printed fabrics add pattern to some patches for extra life.

### How it works

1. Divide the picture into squares, or split each square into two triangles along a randomly chosen diagonal.
2. Choose k fabric colours by k-means and give each patch the nearest to the picture’s colour at its centre.
3. Give a chosen fraction of patches a pattern in a lighter or darker shade of their own colour: dots, stripes, a check, florets or diagonal lines.
4. Puff each patch with a radial gradient, white at 20 percent near the middle and black at 30 percent at the rim.
5. Draw a thin dark seam and a dashed running stitch on a copy of the patch outline shrunk to 82 percent.

### The mathematics

A quilt is a grid of fabric patches. The picture is divided into squares, or each square into two triangles along a randomly chosen diagonal, and each patch takes the nearest of k fabric colours (from k-means, slightly softened) to the colour of the picture at its centre. A chosen fraction of patches, set by the printed-fabrics slider, also gets a pattern in a lighter or darker shade of its own colour: dots, stripes, a check, florets or diagonal lines.

Quilting makes each patch puff up. That is faked with a radial gradient: white at 20% opacity near the middle and black at 30% at the rim, so the patch looks lit from above and shadowed at the seams. The seam is a thin dark line, and the running stitch is a dashed light line on a copy of the patch outline shrunk to 82% about its centre. A little grain finishes the cloth.

$$
s=\frac{W}{n},\qquad \text{patch colour}=\arg\min_{f\in F}\big\lVert \bar P(\text{centre})-f\big\rVert
$$
_Patch size for n patches across, and its fabric._

$$
\text{pattern}\iff h<\pi,\qquad \text{kind}=\Big\lfloor \frac{5\,h}{\pi}\Big\rfloor
$$
_A patch is printed when its random number h is below the printed-fabrics slider π (0 to 1); the kind of print is chosen from five._

### A short history

Patchwork and quilting appear in many cultures, from the kantha of Bengal and the ralli of Sindh to the quilts of Britain and North America, where they used up worn clothing as well as celebrated skill. The Quilts of Gee’s Bend, made by a community of women in Alabama, were shown in major museums in the 2000s and brought wide attention to the craft as art.

### Where it is used

- Textile and home decor inspiration
- Craft and sewing project plans
- Warm, handmade looking posters
- Pattern ideas for fabrics

### Try it

- Small squares with strong prints look like a classic quilt. (https://lumenary-studio.vercel.app/style/quilt-patchwork?shape=squares&across=24&prints=85)
- Few patches make a big, bold block pattern. (https://lumenary-studio.vercel.app/style/quilt-patchwork?across=7&fabrics=5)
- Hide the stitching for a flatter, graphic look. (https://lumenary-studio.vercel.app/style/quilt-patchwork?stitch=false)

### Words worth knowing

- **Patch:** A single piece of cloth in a patchwork.
- **Wadding:** The soft layer inside a quilt that gives it body.
- **Running stitch:** A simple stitch that passes in and out of the cloth in a row.

### See also

- 198 Ralli Patchwork
- 87 Cross-stitch
- 92 Paper Cut-out

## 91  Tapestry Weave  ·  _still_

- **Comes from:** Weaving workshops of Europe, the Middle East and the Americas
- **Around:** Many centuries
- **Works best on:** Landscapes and simple scenes with clear colour regions

### Why it looks this way

In tapestry the coloured weft is passed back and forth over a hidden warp and packed so tightly that the warp disappears and the picture is built of horizontal rows. A pass of wool is round, so it is bright in its middle and dark where it dips, and hand beaten rows never run quite straight. These details turn a neat mosaic into something woven.

### How it works

1. Divide the picture into rows (passes of weft) and into cells about as wide as a row is tall, and take one colour per cell.
2. Limit the colours to k wool colours by k-means.
3. Shift odd rows by half a cell, as in real weaving, and wave the row boundaries a little with the wobble slider.
4. Light each pass as a round strand, with a sine raised to the power 0.55, and alternate cells slightly in brightness to show the over and under.
5. Show the dark warp where each row dips, and draw loose warp ends as a fringe at the bottom.

### The mathematics

In a tapestry the weft, a coloured wool, is passed back and forth over a hidden warp, packed so tightly that the warp disappears and the picture is made of horizontal rows. The program divides the picture into rows (the passes of weft slider) and into cells about as wide as a row is tall, takes one colour per cell from a picture of that size, and limits the colours to k wool colours by k-means. Odd rows are shifted by half a cell, as in real weaving, and the row boundaries wave a little (the wobble slider) because hand-beaten weft is never straight.

The lighting is within each row: a pass of wool is round, so it is bright in the middle and dark where it dips against its neighbours, a sine raised to the power 0.55. Cells alternate slightly in brightness in a checkerboard to show the over-under of the weave. Fine noise along the row is the fuzz of the wool. Where the row dips, the dark warp shows through, by an amount set by the visible-warp slider. The fringe at the bottom is the loose ends of the warp, drawn as pale curved threads.

$$
k=\big(0.34+0.8\,b\big)\,o\,\Big(0.9+0.1\sin\pi f_x\Big),\qquad b=\big(\sin\pi f_y\big)^{0.55}
$$
_Brightness of the wool: f_y and f_x are the positions across the row and across the cell (0 to 1), o is 1 or 0.9 in a checkerboard._

$$
k\leftarrow k\,\Big(1-\omega\,g\,\big(0.35+0.35\,w\big)\Big),\ \ w=\tfrac12+\tfrac12\sin\tfrac{2\pi x}{c},\qquad g=1-\operatorname{smoothstep}\big(0,\ 0.14,\ \min(f_y,1-f_y)\big)
$$
_The warp showing through at the edges of a row; ω is the visible-warp slider, c the cell width and the sine-based factor the pattern of the hidden warp threads._

### A short history

Woven tapestries hung in medieval castles and cathedrals. The Gobelins manufactory in Paris was established in the seventeenth century, and the Renaissance painter Raphael designed cartoons in 1515 and 1516 for tapestries for the Sistine Chapel. In the twentieth century the Bauhaus weaving workshop, with artists such as Anni Albers, made tapestry a modern art.

### Where it is used

- Wall hanging and textile design ideas
- Craft and heritage themed visuals
- Warm, earthy poster art
- Cover art with a handmade feel

### Try it

- Many fine passes look like a detailed Gobelins panel. (https://lumenary-studio.vercel.app/style/tapestry-weave?rows=140&yarns=10)
- High wobble gives a very hand-woven look. (https://lumenary-studio.vercel.app/style/tapestry-weave?wobble=95)
- Remove the fringe for a framed tapestry. (https://lumenary-studio.vercel.app/style/tapestry-weave?fringe=false)

### Words worth knowing

- **Warp:** The fixed lengthwise threads on a loom.
- **Weft:** The crosswise thread that is woven through the warp.
- **Cartoon:** A full-size design used as a pattern for a tapestry or fresco.

### See also

- 87 Cross-stitch
- 189 Navajo Weave
- 72 Fabric Folds

## 92  Paper Cut-out  ·  _still_

- **Comes from:** Folk paper cutting and modern collage
- **Around:** Centuries old, cut-out painting in the 20th century
- **Works best on:** Landscapes and portraits with soft tonal masses

### Why it looks this way

A paper cut-out landscape is a stack of layers, each a sheet cut with scissors, each throwing a soft shadow on the one below. If you cut the picture’s brightness into bands like a contour map and stack coloured sheets, the depth is created by shadow alone. Swapping the colours changes the whole mood without changing the shapes.

### How it works

1. Blur the picture’s brightness to round off detail.
2. Make layer i exist wherever brightness is above the threshold i divided by n, with a very short smoothstep at the edge for a sharp cut.
3. Colour layers from dark at the bottom to light at the top, from a palette or from the picture’s own colours.
4. For each layer, shift its mask a few pixels away from the light, blur it twice, and darken the sheets beneath wherever that shadow falls outside the layer.
5. Composite from the bottom up, add a hairline of light at the cut edges and multiply in paper fibre.

### The mathematics

The picture’s brightness, blurred to round off detail, is cut into bands like a contour map. Layer i is a sheet of coloured paper that exists wherever the brightness is above the threshold i/n, with a very short smoothstep at the edge so it is a sharp cut. The bottom layer is the whole sheet. Papers go from dark (bottom) to light (top), taken either from a built-in palette or from the picture’s own k-means colours sorted by brightness.

What makes it look cut and stacked is the shadow. For each layer the mask is shifted a few pixels away from the light and blurred twice; where that shifted, blurred shape falls outside the layer itself, the sheets beneath are darkened. The layers are composited from the bottom up: darken by the shadow of the layer, then replace by the layer’s colour where its mask is on. A hairline of extra light is added right at the cut edges, and paper fibre noise is multiplied in.

$$
m_i=\operatorname{smoothstep}\big(\tfrac in-0.012,\ \tfrac in+0.012,\ L_b\big),\qquad i=1,\dots,n-1
$$
_The mask of layer i, with n layers in all._

$$
s_i=\operatorname{blur}^{2}\big(m_i(\mathbf x-\mathbf d)\big),\qquad \mathbf d=5\,\sigma\,(-\cos\alpha,\ \sin\alpha)
$$
_Shadow of layer i: the mask displaced away from the light (angle α) and blurred twice._

$$
C\leftarrow\big(C\,(1-0.55\,\delta\,s_i\,(1-m_i))\big)(1-m_i)+c_i\,m_i
$$
_Compositing one layer; δ is the shadow slider and c_i the colour of paper i._

### A short history

Paper cutting is a folk art in China, Poland, Mexico and many other places. In the 1940s and 1950s Henri Matisse, limited by illness, cut and arranged painted paper in large works such as The Snail, and Lotte Reiniger made silhouette animated films from cut paper in the 1920s. Layered paper shadow boxes are now a popular craft.

### Where it is used

- Layered landscape and poster art
- Children’s book and craft illustration
- Paper craft and shadow box designs
- Greeting cards

### Try it

- Seven layers in forest greens feel like a mountain range. (https://lumenary-studio.vercel.app/style/paper-cut-out?layers=7&palette=forest)
- A deeper shadow gives the layers more lift. (https://lumenary-studio.vercel.app/style/paper-cut-out?shadow=100&smooth=30)
- Use the picture’s own colours for the paper. (https://lumenary-studio.vercel.app/style/paper-cut-out?palette=picture)

### Words worth knowing

- **Layer:** One sheet in a stack, each cut to a different shape.
- **Contour:** A line or band of equal value, as on a map.
- **Silhouette:** A solid dark shape seen against a lighter background.

### See also

- 173 Papel Picado
- 174 Chinese Paper Cut
- 74 Origami Folds

## 93  Stained Glass  ·  _still_

- **Comes from:** Medieval cathedrals and Islamic architecture
- **Around:** Around 1000 onward
- **Works best on:** Bold pictures with clear colour

### Why it looks this way

Stained glass is a mosaic of coloured pieces held in dark lead, lit from behind so that the colour glows. Its irregular pieces come naturally from cellular noise: each point belongs to the nearest of a set of random sites. Lead lies where two sites are nearly equally close, and each piece is darker near the lead and brighter in the middle, as real glass is.

### How it works

1. Scatter a random site in every square of a coarse grid and give each pixel to its nearest site, making irregular convex pieces.
2. Take each piece’s colour from the picture, blurred to about the size of a piece and read at the site, then boost saturation and brightness.
3. Place lead where the distances to the nearest and second nearest sites nearly match, drawn as a dark bar with a soft highlight along its crown.
4. Make each piece darker towards the lead and brighter in the middle, with ripple from two layers of noise.
5. Light it with a backlight that fades away from the top left.

### The mathematics

Stained glass is a mosaic of coloured pieces held in lead strips. The pieces here come from cellular noise: a random site in every square of a coarse grid, with each pixel belonging to the nearest site, which makes irregular convex shapes. Each piece’s colour is the picture, blurred to about the size of a piece, read at the site, then made more saturated and brighter, like glass lit from behind.

Lead lies on the boundary between two pieces: a pixel is lead where the distance to the nearest site and to the second nearest nearly match, that is where F2 − F1 is below the lead width. Lead is a dark bar with a soft highlight along its crown. Glass is not flat: it is darker toward the lead and brighter in the middle of a piece (a smoothstep of the distance to the site), rippled by two layers of noise, and lit by a backlight whose strength you set and which fades away from the top left.

$$
\text{lead}\iff F_2-F_1<\lambda,\qquad \lambda=0.9\,\sigma\,\ell
$$
_Where lead lies: F₁ and F₂ are the distances to the nearest and second-nearest sites, ℓ the lead slider and σ the picture scale._

$$
k=\big(0.55+0.55\,m+\rho\big)\,\big(0.58+0.42\,\beta\big)\,\gamma\,\big(0.78+0.22\,q\big),\qquad m=1-\operatorname{smoothstep}(0.1s,\ 0.7s,\ F_1)
$$
_Glass brightness: m is the nearness to the middle of the piece, ρ the ripple, β the backlight slider, γ the fade across the picture and q the distance from the lead._

$$
(h,\ s,\ l)\mapsto\big(h,\ \operatorname{clamp}(1.35\,s+0.12),\ \operatorname{clamp}(0.78\,l+0.14,\ 0.22,\ 0.78)\big)
$$
_Colour of a piece, in hue, saturation and lightness._

### A short history

Coloured glass windows filled the great cathedrals of medieval Europe, as at Chartres in the early thirteenth century and Sainte-Chapelle in Paris, finished in 1248, and pierced windows of coloured glass are also found in Islamic architecture. Louis Comfort Tiffany developed new copper foil methods in the late nineteenth century. The cellular partition behind the pieces is the Voronoi diagram, studied by Georgy Voronoy in 1908.

### Where it is used

- Window and lampshade design ideas
- Church, mosque and heritage themed graphics
- Colourful posters and covers
- Backgrounds with a luminous feel

### Try it

- Thick lead and larger pieces look like a church window. (https://lumenary-studio.vercel.app/style/stained-glass?pieces=12&lead=9)
- Very small pieces with fine lead give a delicate mosaic. (https://lumenary-studio.vercel.app/style/stained-glass?pieces=40&lead=2)
- Full backlight makes the glass glow. (https://lumenary-studio.vercel.app/style/stained-glass?glow=100)

### Words worth knowing

- **Voronoi diagram:** A division of the plane in which each point belongs to its nearest site.
- **Came:** The grooved lead strip that holds pieces of glass together.
- **Backlight:** Light shining from behind so that it passes through the material.

### See also

- 135 Voronoi Mosaic
- 193 Byzantine Mosaic
- 43 Low-poly

## 94  Wool Crochet  ·  _still_

- **Comes from:** Hooked yarn craft
- **Around:** Printed patterns from the 1820s
- **Works best on:** Bold shapes and few colours

### Why it looks this way

Crochet builds cloth one loop at a time with a single hook, and every stitch shows. A picture in crochet is a grid, like knitting, but the stitches are chunkier, each row is worked in the opposite direction to the last, and the edge is usually finished with a decorative border. The charm is in the slight unevenness of something made by hand.

### How it works

1. Average the picture to one colour per stitch.
2. Find a few wool colours and give each stitch the nearest one.
3. Draw each stitch as two strands leaning into a V, each with a shadow and a highlight.
4. Shift every second row by half a stitch and reverse the overlap of its strands.
5. Work a border of shells, five stitches fanned from one foot.
6. Add a little fuzz: fine noise and the odd stray fibre.

### The mathematics

The picture is averaged down to one colour for each stitch, and a small palette of wools is found on that tiny image by k-means. Every stitch then takes the wool nearest to its own colour. Wool is matt, so the palette loses a little saturation and its lightness is squeezed away from pure black and white. When a basket of fixed colours is chosen instead, each palette colour is given a different colour from the basket, matched by its rank from dark to light and then by hue, so the picture keeps its tonal order.

One stitch is two strands of yarn leaning together into a V. Each strand is drawn three times along the same line: wide and dark, then narrower in the wool’s colour, then a thin light line off to one side. Together they read as a round thread lit from the left. Rows are worked back and forth, so every second row sits half a stitch across and its strands overlap the other way round. The shell border is the same stitch repeated five times around a shared foot, fanned by a fixed angle. Fuzz is a little noise and the occasional bright fibre over the whole piece.

$$
w=\frac{W-2e}{n},\qquad \text{rows}=\operatorname{round}\!\Big(\frac{H-2e}{0.86\,w}\Big)
$$
_Stitch width w from n stitches across and the border width e. Stitches are a little shorter than wide._

$$
\text{strand}:\ (0.22w,\ 0.1h)\to(0.5w,\ 0.92h),\qquad (0.78w,\ 0.1h)\to(0.5w,\ 0.92h)
$$
_The two strands of one stitch, in a cell w wide and h tall. Line width is 0.36 w._

$$
\theta_q=(q-2)\cdot0.42\ \text{rad},\qquad q=0,\dots,4
$$
_The five stitches of one shell, fanned about its foot._

### A short history

Crochet as we know it appears in Europe in the early nineteenth century; the Dutch magazine Penélopé printed patterns in 1823. In Ireland during the famine of the 1840s, crocheted lace became a cottage industry that fed families. The granny square, made from leftover yarn, spread in the twentieth century, and Japan’s amigurumi, small crocheted creatures, made the craft popular with a new generation.

### Where it is used

- Blanket and cushion pattern charts
- Gifts and baby announcements
- Craft shop and market branding
- Cosy seasonal posts

### Try it

- Fewer, bigger stitches look like chunky yarn. (https://lumenary-studio.vercel.app/style/wool-crochet?stitches=28&colours=5)
- Baby pastels redraw the picture in a soft basket of wools. (https://lumenary-studio.vercel.app/style/wool-crochet?wool=pastel&fuzz=70)
- Many stitches without the border keep the most detail. (https://lumenary-studio.vercel.app/style/wool-crochet?stitches=85&border=false)

### Words worth knowing

- **Single crochet:** The basic short stitch, worked into the row below.
- **Shell:** Several stitches worked into one foot so that they fan out.
- **Quantisation:** Reducing many colours to a small fixed set.

### See also

- 89 Knitted Pattern
- 87 Cross-stitch
- 91 Tapestry Weave

## 95  Parchment  ·  _still_

- **Comes from:** Manuscript books on animal skin
- **Around:** About 200 BC to 1500
- **Works best on:** Figures and objects with clear light and shade

### Why it looks this way

Before paper reached Europe, books were written on prepared animal skin, which is tough, slightly translucent and never quite flat or even in colour. Ink bit into it and has since browned. A page was planned like a building: a ruled text block, a picture in a painted frame, and a large red initial to mark where reading begins.

### How it works

1. Build the skin: mottling, a darker rim, rusty foxing and fine pores.
2. Shade the picture with parallel pen lines that thicken as the tone darkens.
3. Cross them with a second set in the deepest shadows, and add outlines.
4. Thin the ink unevenly and fade it in patches.
5. Frame the picture in red and gold, rule the lines, paint the capital and write the script.

### The mathematics

The skin is built first. A fractal noise gives broad mottling, the distance to the nearest edge (with its threshold wobbled by more noise) gives the darker rim that handling leaves, and the product of two thresholded noises gives foxing, the rusty freckles of old leaves. These add up to a stain amount that blends a pale vellum colour toward a brown one; the age slider scales all three. A fine hash and a value noise stand in for the pores of the hide.

The picture is drawn the way an engraver shades: with parallel lines whose thickness carries the tone. The lines run on a slight slant and a slow wave. At each pixel the distance to the nearest line centre is compared with a width that grows with darkness, so pale areas get hairlines and dark areas nearly solid ink. Past a darker threshold a second set crosses the first. Outlines come from the Sobel operator. The ink is then thinned by noise, since it sits unevenly on skin, and faded in patches. The border, the ruled lines, the red capital and the script are ordinary canvas drawing on top.

$$
s=\operatorname{clamp}\big(0.9\,a\,(m-0.35)+\text{rim}\,(0.35+0.5a)+0.5\,a\,\text{fox}\big)
$$
_Stain amount: m is the mottling noise, a the age slider. The skin colour is a blend from vellum to brown by s._

$$
\alpha_1=1-S_{0.8w,\,0.8w+0.22}(d_1),\qquad w=\operatorname{clamp}\big(1.25\,(D-0.22)\big)\cdot h
$$
_Hatching: d₁ is the distance to the nearest line centre (0 to 1), D the darkness of the picture, h the hatching slider._

$$
d_1=2\,\Big\lvert\operatorname{frac}\!\Big(\frac{y+0.35x+6\sin(0.012y+0.004x)}{p}\Big)-\tfrac12\Big\rvert
$$
_Lines every p = 5.2 px, slanted and gently waved._

### A short history

Parchment takes its name from Pergamon in Asia Minor, where by tradition it was perfected in the second century BC. From late antiquity to the nineteenth century most European writing was done in iron gall ink, made from oak galls and iron salts, which goes on pale and darkens to brown-black. Monastic scribes developed the illuminated page, with red headings called rubrics and gold leaf, as in the Book of Kells of about 800.

### Where it is used

- Wedding and event invitations
- Fantasy maps and game handouts
- Certificates and awards
- Covers for history and folklore

### Try it

- A very old skin with heavy hatching looks like a museum leaf. (https://lumenary-studio.vercel.app/style/parchment?age=95&hatch=85)
- Indigo ink on a young skin is clean and legible. (https://lumenary-studio.vercel.app/style/parchment?ink=blue&age=20)
- Give the whole page to the picture. (https://lumenary-studio.vercel.app/style/parchment?layout=full&lines=80)

### Words worth knowing

- **Vellum:** Fine parchment, usually calfskin.
- **Rubric:** A heading or initial written in red.
- **Foxing:** Rust-coloured spots that appear on old paper and skin.

### See also

- 83 Banknote Engraving
- 54 Calligraphy Portrait
- 207 Persian Miniature

