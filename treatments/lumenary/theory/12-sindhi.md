# L. Sindhi design

Source: https://lumenary-studio.vercel.app/theory/sindhi (captured 2026-11-16 for private study).

The patterns, crafts and scripts of Sindh, kept close to home.

## 196  Ajrak  ·  _still_

- **Comes from:** Sindh, on the Indus
- **Around:** Centuries old, a cloth still made and worn today
- **Works best on:** Pictures with a mix of light, mid and dark tones

### Why it looks this way

Ajrak is made by keeping dye out of the cloth. A resist paste goes on wherever the cotton is meant to stay pale, and the cloth is then dyed in indigo and in red from madder root. The paste holds the dye back, so the white lines of the finished shawl are the places where nothing reached the cotton. The eight-pointed star and the lattice repeat across the cloth like a map of the night sky.

### How it works

1. Lay out one block for each square of side s = W / n, where n is the number of blocks across.
2. Inside a block, use a polar test to decide what lies under every pixel: ground, star colour or resist.
3. Draw the eight-pointed star with a star polygon formula, with a resist outline, a resist ring, a resist centre and a diamond with small resist dots at each corner.
4. Dye each block in one of three states by the picture’s tone: dark blocks have a deep ground with a red star, midtones swap the two, and light blocks have a pale ground. Size each block from 82 to 100 percent of its square by the picture.
5. Print the resist from a block shifted by up to 1.5 px, and show only the shifted copy as white, since a real print is never perfect.

### The mathematics

Ajrak is the block-printed cloth of Sindh. It is made by pressing carved wooden blocks onto cotton in stages: a resist paste goes on first, wherever the cloth is meant to stay pale, and the cloth is then dyed in indigo and in red from madder root. The paste keeps the dye out, so the white lines in the finished shawl are the places where nothing reached the cotton. Many Sindhis point to the trefoil-patterned shawl on the Mohenjo-daro bust as a distant ancestor, a story told with affection and not proved.

The program lays out one block per square of side s = W / n, where n is the number of blocks across. Inside a block a polar test decides which of three things lies under each pixel: ground, star colour or resist. The star has eight points, drawn with the star polygon formula below, with a resist outline, a resist ring, a resist centre, and a diamond with small resist dots at each corner. Each block is dyed in one of three states, chosen by the tone of your picture where it sits: dark blocks carry a deep ground with a red star, midtones swap the two, and light blocks have a pale ground. Block size follows the picture too, from 82% to 100%. A real print is never perfect, so the resist is printed from a block shifted by up to 1.5 px, and only the shifted copy shows white.

$$
r(\theta)=\frac{R_1\,p_y}{p_y\cos t-p_x\sin t},\quad t=\text{fold}(\theta)\in\big[0,\tfrac{\pi}{n}\big],\quad \begin{aligned}p_x&=R_2\cos\tfrac{\pi}{n}-R_1\\ p_y&=R_2\sin\tfrac{\pi}{n}\end{aligned}
$$
_The outline of an n-pointed star (n = 8 here, R₁ = 0.94 σ, R₂ = 0.55 σ): a straight line from a tip to the next notch, written in polar form. σ is the block size factor._

$$
k=\begin{cases}0&t<0.36\\ 1&0.36\le t<0.66\\ 2&t\ge0.66\end{cases},\qquad \sigma=0.82+0.18\,(1-t)
$$
_The dye state k and block size σ from the tone t of the picture in that block. With probability 1 − f (f is “colour follows picture”) the state is a chequerboard (i + j) mod 2 instead._

$$
z=\begin{cases}\text{resist}&Z(\mathbf x+\boldsymbol\delta)=\text{resist}\\ \text{ground}&Z(\mathbf x)=\text{resist},\ Z(\mathbf x+\boldsymbol\delta)\ne\text{resist}\\ Z(\mathbf x)&\text{otherwise}\end{cases}
$$
_Misregistration: the block zone map Z is read twice, the second time shifted by δ = (1, 0.7) × 1.5 px × the hand-printed slider. White shows only where the shifted copy says so._

### A short history

Ajrak is the block-printed cloth of Sindh, pressed onto cotton by carved wooden blocks in stages. Many Sindhis point to the trefoil-patterned shawl on the Mohenjo-daro bust as a distant ancestor, a story told with affection and not proved. The shawl is given as a gift of honour to guests, worn on the shoulder, and worn on Sindhi Cultural Day, which is celebrated on the first Sunday of December. Printing families in Sindh and across the border in Kutch have kept the craft alive.

### Where it is used

- Shawls, scarves and clothing
- Gifts of honour and cultural celebrations
- Pattern and textile design
- Teaching resist printing and tessellation

### Try it

- The classic mix of red and indigo is the shawl most people picture. (https://lumenary-studio.vercel.app/style/ajrak?dye=classic&print=70)
- Indigo only gives a cool, deep night cloth. (https://lumenary-studio.vercel.app/style/ajrak?dye=indigo&border=80)
- Smaller blocks show finer detail from your picture. (https://lumenary-studio.vercel.app/style/ajrak?size=30&follow=100)

### Words worth knowing

- **Resist:** A paste or wax that keeps dye from reaching the cloth.
- **Madder:** A plant whose root gives a red dye.
- **Block printing:** Pressing carved wooden blocks onto cloth to print a pattern.

### See also

- 200 Sindhi Topi
- 176 Batik
- 198 Ralli Patchwork

## 197  Hala Blue Pottery  ·  _still_

- **Comes from:** Hala, Sindh
- **Around:** Centuries old
- **Works best on:** Landscapes and pictures with soft shadows

### Why it looks this way

Blue pottery is painted on white glaze with cobalt and turquoise, then fired once, so the colour sinks into the glaze and cannot be changed. The painter has to know what each stroke will become. The designs are vines, leaves and small flowers, drawn so that every curve leads into the next. Here the picture becomes a cobalt wash, and vines follow its contours across the glaze.

### How it works

1. Blur the picture twice (radius smooth × 0.9 px) to a field T.
2. Blend the glaze colour toward cobalt by v = 0.78 w (1 − T)^1.5, where w is the wash slider, so shadows turn deep blue and highlights stay white.
3. Find the contour lines of T at evenly spaced levels by marching squares, join them into curves, and draw them with a width that falls from 3.9 px at the darkest contour to 1.7 px at the lightest.
4. Place leaves on alternate sides of each vine about every 24 px, turned 0.95 radians from the tangent, in turquoise and cobalt by turns.
5. Add small flowers, and the fine crackle of old glaze.

### The mathematics

Hala, a town in the Matiari district, is one of the places where blue pottery is still made in Sindh. It shares a tradition with Multan and with Persia: a white glaze painted in cobalt blue and turquoise, then fired once, so the colour sinks into the glaze and cannot be changed. The designs are vines, leaves and small flowers. The program paints your picture as a cobalt wash and then lays vines along it.

The wash comes first. The picture is blurred twice (radius smooth × 0.9 px) to a field T, and the glaze colour is blended toward cobalt by v = 0.78 w (1 − T)^1.5, where w is the wash slider, so shadows turn deep blue and highlights stay white. Vines are the contour lines of T at evenly spaced levels, found by marching squares, joined into curves and drawn with a width that falls from 3.9 px at the darkest contour to 1.7 px at the lightest. Leaves sit on alternate sides of each vine about every 24 px, turned 0.95 radians (about 54°) from the tangent, in turquoise and cobalt by turns. Flowers (five oval petals round a turquoise centre) are placed on a jittered grid, only where the picture is dark enough. Old glaze cracks, and the program finds the cracks with Worley noise.

$$
C=C_{\text{glaze}}+\big(C_{\text{cobalt}}-C_{\text{glaze}}\big)\,v,\qquad v=0.78\,w\,(1-T)^{1.5}
$$
_Cobalt wash. T is the doubly blurred brightness and w the wash slider (0 to 1)._

$$
\{\mathbf x:\ T(\mathbf x)=\lambda_k\},\quad \lambda_k=\frac{k}{N},\ \ k=1,\dots,N-1,\qquad w_k=(1.7+2.2\,(1-\lambda_k))\,\mathrm{sc}
$$
_Vine k is a contour of T at level λₖ. N is the “vines” slider; darker contours are drawn thicker._

$$
e=F_2-F_1<1.1\,\mathrm{sc}\ \Rightarrow\ C\leftarrow C\,\big(1-0.3\,c\,(1-\tfrac{e}{1.1\,\mathrm{sc}})\big)
$$
_Crackle: F₁ and F₂ are the distances to the nearest and second nearest Worley points (cell 54 px), and c is the crackle slider. The line darkens the glaze._

$$
\text{flower if } T(\mathbf x)\le 0.34\,(0.4+q)\ \text{ and }\ \xi\le q
$$
_Where a flower may sit: q is the flowers slider and ξ a random number per grid point._

### A short history

Hala, a town in the Matiari district, is one of the places where blue pottery is still made in Sindh. It shares a tradition with Multan and with Persia, and Sindh has a long tradition of blue glazed tile, as seen on the Shah Jahan Mosque at Thatta (1647). Potters work in small family kilns, and the craft depends on knowledge passed from one generation to the next.

### Where it is used

- Plates, vases and tiles
- Mosque and shrine decoration
- Gifts and craft markets
- Pattern design with a cobalt palette

### Try it

- A turquoise glaze gives the bright, shallow-water look. (https://lumenary-studio.vercel.app/style/hala-blue-pottery?ground=turquoise&wash=40)
- Many vines make a dense, floral garden. (https://lumenary-studio.vercel.app/style/hala-blue-pottery?levels=13&leaves=90&flowers=80)
- Heavy crackle looks like an old family plate. (https://lumenary-studio.vercel.app/style/hala-blue-pottery?crackle=95&ground=cream)

### Words worth knowing

- **Glaze:** A glassy coating fired onto pottery.
- **Cobalt:** A mineral that gives a deep blue pigment.
- **Crackle:** A fine web of cracks in old glaze.

### See also

- 180 Azulejo
- 181 Delft Blue
- 202 Makli Carving

## 198  Ralli Patchwork  ·  _still_

- **Comes from:** Sindh and its neighbouring deserts
- **Around:** Traditional, made by women over generations
- **Works best on:** Bright pictures with clear blocks of colour

### Why it looks this way

A ralli is a quilt made from scraps. In Sindh it is a women’s art: cloth from old clothes is cut into squares and triangles, laid out in bold patterns and stitched down in rows of running thread, often in several layers. Nothing is wasted, and the result is warm, bright and personal. Your picture is cut into patches, and each takes a colour from a bright palette.

### How it works

1. Make a square grid of side s. When the diamond set is chosen, turn each point by 45° to (u, v) = ((x + y), (y − x))/√2 before applying the grid, so squares stand on their points.
2. Keep each square whole, cut it into two triangles by a diagonal, or into four by both.
3. Give each piece the colour of the picture at its own centre, with saturation raised by 1.5, snapped to the nearest of nine cloth colours (or an earthy set).
4. Print some pieces as cotton with dots, stripes, checks or diamonds.
5. Stitch dashes 4.6 px inside every seam, to hold the layers together.

### The mathematics

A ralli is a quilt made from scraps, and in Sindh it is a women’s art: cloth from old clothes is cut into squares and triangles, laid out in bold patterns, and stitched down with rows of running thread, often in several layers. The word is said to come from a verb meaning to mix, which suits a cloth made of many colours. The program cuts your picture into patches and gives each one a colour from a bright palette of nine (or an earthy one).

The quilt is a square grid of side s. When the “on the diagonal” setting is chosen, the point (x, y) is turned by 45° to (u, v) = ((x + y), (y − x))/√2 before the grid is applied, so the squares stand on their points. A square can be kept whole, cut into two triangles by its diagonal, or into four by both. Each piece takes the colour of the picture at its own centre (saturation raised by 1.5), snapped to the nearest cloth colour, and some pieces are printed cotton with dots, stripes, checks or diamonds. Stitching lies 4.6 px inside every seam as dashes, in a thread that is lighter than dark patches and darker than light ones. A dark line marks the seam itself, and the patch is shaded to look puffed near it.

$$
u=\frac{x+y}{\sqrt2},\qquad v=\frac{y-x}{\sqrt2},\qquad (i,j)=\big(\lfloor u/s\rfloor,\ \lfloor v/s\rfloor\big)
$$
_Cell index on the diagonal grid. With “square on” the rotation is skipped._

$$
d_{\text{diag}}=\frac{|a+b|}{\sqrt2}\ \ (\text{halves}),\qquad d_{\text{diag}}=\frac{\big||a|-|b|\big|}{\sqrt2}\ \ (\text{quarters}),\qquad a=f_u-\tfrac12,\ b=f_v-\tfrac12
$$
_The distance, in cell units, from the cut line. (f_u, f_v) is the position inside the cell. |a + b|/√2 is the distance from a point to the line a + b = 0._

$$
d_{\text{seam}}=s\,\min\!\big(d_{\text{edge}},\,d_{\text{diag}}\big),\qquad f=0.82+0.2\,\operatorname{smoothstep}\big(0,\,10\,\mathrm{sc},\,d_{\text{seam}}\big)
$$
_Distance to the nearest seam and the puffing of each patch: 18% darker at the seam._

$$
\big|d_{\text{seam}}-4.6\,\mathrm{sc}\big|<0.55\,\mathrm{sc}\ \ \wedge\ \ \operatorname{frac}\!\Big(\frac{0.8x+1.3y}{6.5\,\mathrm{sc}}\Big)<0.55
$$
_The stitch: a band 1.1 px wide, broken into dashes (55% on)._

### A short history

The word is said to come from a verb meaning to mix, which suits a cloth made of many colours. Rallis are made in Sindh and in the neighbouring regions of Thar, Cholistan and Kutch, and are often made as gifts and for a daughter’s wedding. Each family has its own colours, and the ralli remembers the clothes it was made from.

### Where it is used

- Bedspreads, throws and cushions
- Wedding and dowry gifts
- Patchwork and quilt design
- Upcycling and sustainable fashion

### Try it

- Quarters cut in four give a lively, kaleidoscope-like quilt. (https://lumenary-studio.vercel.app/style/ralli-patchwork?split=quarters&size=45)
- Square set keeps the patches upright and calm. (https://lumenary-studio.vercel.app/style/ralli-patchwork?layout=square&split=whole)
- Earthy cloth feels like a quilt that has been washed many times. (https://lumenary-studio.vercel.app/style/ralli-patchwork?cloth=earth&print=80)

### Words worth knowing

- **Ralli:** A patchwork quilt of Sindh and nearby regions.
- **Running stitch:** A simple stitch that passes in and out of the cloth in a line.
- **Patch:** A piece of cloth sewn into a larger pattern.

### See also

- 90 Quilt Patchwork
- 183 Sashiko
- 199 Sindhi Mirror Embroidery

## 199  Sindhi Mirror Embroidery  ·  _still_

- **Comes from:** Sindh and the deserts of Thar
- **Around:** Traditional, worn at weddings and festivals
- **Works best on:** Bright pictures with lights and shadows

### Why it looks this way

Abhla bharat, mirror embroidery, sets small discs of mirror or mica into dark cloth and rings each one with thread. Each disc catches the light and flashes as the wearer moves, and the thread glows in colours that talk to one another. The program lays mirrors on a lattice, lets each one reflect a patch of your picture, and takes the thread colours from the same place.

### How it works

1. Lay mirrors on a triangular lattice: each row is 0.866 s below the last (that is √3/2, the height of an equilateral triangle) and every other row is shifted by half a spacing, so every mirror has six neighbours at the same distance.
2. Take the main thread colour c₁ from the picture under each mirror, push the saturation up by 1.7, and scale it by 0.92 + 0.28 t.
3. Turn the hue by 0.45 of a full circle (162°, close to the opposite) for the partner thread c₂, and use a pale petal thread c₃.
4. Around each mirror stitch ten leaf-shaped stitches and a ring of short spokes, alternating c₁ and c₂.
5. Fill the gaps between neighbours with small crosses of seed stitch, and add a shine to each mirror.

### The mathematics

Abhla bharat is mirror embroidery: small discs of reflective glass or mica are held to the cloth with a lattice of stitches that cross over the edge, and then the thread is worked round them in rings. It is done on shirts, cushions, camel decorations and the cloth of the bride. The program lays mirrors on a triangular lattice. Each row is 0.866 s below the last (that is √3/2, the height of an equilateral triangle) and every other row is shifted by half a spacing, so every mirror has six neighbours at the same distance.

Thread colours are taken from the picture under each mirror. The colour is pushed to higher saturation (× 1.7) and gives the main thread c₁, scaled by 0.92 + 0.28 t. The partner thread c₂ has its hue turned by 0.45 of a full circle (162°, close to the opposite), and the petal thread c₃ is pale. Around each mirror go ten leaf-shaped stitches and then a ring of short spokes, alternating c₁ and c₂, and between neighbouring mirrors small crosses of seed stitch fill the gaps at the centres of the lattice triangles. The mirror itself shows a piece of your picture: a square 6.8 mirror radii wide is shrunk into the disc and flipped left to right, as a curved glass would show it, with a highlight and a darker rim.

$$
\mathbf p_{i,j}=\Big(i\,s+\tfrac{s}{2}\,(j \bmod 2),\ \ j\,\tfrac{\sqrt3}{2}\,s\Big)
$$
_The mirror lattice. Row j sits √3/2 s below row j − 1 and odd rows are shifted by half a step._

$$
r_m=0.37\,s\,\mu,\qquad \phi=\frac{\pi r_m^2}{s\cdot\frac{\sqrt3}{2}s}=\frac{2\pi}{\sqrt3}\,(0.37\,\mu)^2
$$
_Mirror radius (μ is the mirror size slider, 0.25 to 0.8) and the fraction of the cloth that is glass._

$$
\mathbf q_1=\mathbf p+\big(\tfrac{s}{2},\ \tfrac{\sqrt3}{6}s\big),\qquad \mathbf q_2=\mathbf p+\big(s,\ \tfrac{\sqrt3}{3}s\big)
$$
_The seed stitches sit at the centres of the two triangles that each lattice point owns (one third and two thirds of the way down a triangle of height dy)._

$$
\text{magnification}=\frac{2\,r_m}{2\times3.4\,r_m}=\frac{1}{3.4},\qquad h_2=h_1+0.45
$$
_The mirror shrinks the surrounding picture by a factor of 3.4. The second thread’s hue h₂ is the first hue plus 0.45 of a turn._

### A short history

Mirror work has a long history across Sindh, Gujarat and Rajasthan. Small discs of reflective glass or mica are held to the cloth with a lattice of stitches that cross over the edge, then the thread is worked round them in rings. It decorates shirts, cushions, camel trappings and the cloth of the bride, and each community and family has its own patterns.

### Where it is used

- Clothing, bags and cushion covers
- Bridal and festive textiles
- Surface and pattern design
- Craft education and heritage projects

### Try it

- Large mirrors give a bold, shining cloth. (https://lumenary-studio.vercel.app/style/sindhi-mirror-embroidery?mirror=75&size=90)
- Maroon cloth feels like a wedding tray. (https://lumenary-studio.vercel.app/style/sindhi-mirror-embroidery?cloth=maroon&thread=85)
- Little shine and close spacing look like a quiet night sky. (https://lumenary-studio.vercel.app/style/sindhi-mirror-embroidery?shine=20&size=34)

### Words worth knowing

- **Abhla bharat:** Mirror embroidery in Sindhi.
- **Mica:** A shiny mineral that splits into thin sheets, used for the first mirrors.
- **Seed stitch:** Tiny scattered stitches that fill a space.

### See also

- 200 Sindhi Topi
- 88 Embroidery
- 198 Ralli Patchwork

## 200  Sindhi Topi  ·  _still_

- **Comes from:** Sindh
- **Around:** Traditional, worn today at weddings and on Sindhi Cultural Day
- **Works best on:** Colourful, high contrast pictures

### Why it looks this way

The Sindhi topi is a round cap with a notch cut for the forehead, embroidered all over in rings of triangles, diamonds and tiny mirrors. Seen from above, the rings are circles and the pattern is easiest to read, so that is how the program draws it. Each cell is stitched in a colour taken from your picture, like a small mosaic of thread.

### How it works

1. Make K rings between an inner radius r₀ = 0.11 R and 0.96 R, each of width h = (0.96 R − r₀)/K.
2. Let four kinds of ornament take turns going outward: triangles, diamonds, zigzags and mirrors.
3. Cut each ring into n cells, with n = 2 ⌈(2π ρ / (c h)) / 2⌉, where ρ is the ring’s middle radius and c the cell shape slider, so n is always even and triangles can alternate pointing out and in.
4. Turn odd rings by half a cell, as in real caps.
5. Choose each cell’s colour from the eight thread colours of the topi, matched to the picture, with the ground of each ring alternating between cream and black.

### The mathematics

The Sindhi topi is a round cap with a notch cut for the forehead. It is embroidered all over in rings of triangles, diamonds and tiny mirrors, and it is worn with the ajrak at weddings and on Sindhi Cultural Day. The program draws it as if you were looking down on the crown, where the rings are circles and the pattern is easiest to see. There are K rings between an inner radius r₀ = 0.11 R and 0.96 R, each of width h = (0.96 R − r₀)/K, and four kinds of ornament take turns going outward: triangles, diamonds, zigzags and mirrors.

Each ring is cut into n cells, with n = 2 ⌈(2π ρ / (c h)) / 2⌉, where ρ is the ring’s middle radius and c the cell shape slider. n is always even so triangles can alternate pointing out and in. Odd rings are turned by half a cell, as in real caps. A cell’s colour is chosen from the eight thread colours of the topi by finding the nearest to the picture’s (saturated) colour at the middle of the cell. The ground of the ring alternates between cream and black. In the centre a ring of twelve petals surrounds a larger mirror, and the edge is a scalloped rim of round beads.

$$
h=\frac{0.96\,R-r_0}{K},\qquad r_0=0.11\,R,\qquad \rho_k=r_0+\big(k+\tfrac12\big)h
$$
_Ring width and the middle radius of ring k (k = 0 is innermost)._

$$
n_k=\Big\lceil \tfrac12\max\!\Big(8,\ \operatorname{round}\frac{2\pi\rho_k}{c\,h}\Big)\Big\rceil\times 2,\qquad \alpha_j=\frac{2\pi j}{n_k}+(k \bmod 2)\frac{\pi}{n_k}
$$
_Number of cells in ring k, made even, and the start angle of cell j. Odd rings are shifted by half a cell._

$$
\text{ornament}(k)=\{\text{triangle, diamond, zigzag, mirror}\}[\,k \bmod 4\,]
$$
_The order of ornaments from the centre outward._

$$
r_{\text{scallop}}=\frac{2\pi\,(0.99\,R)}{N_s}\cdot\frac{1}{2.2},\qquad N_s=\operatorname{round}\frac{2\pi(0.99\,R)}{0.9\,h}
$$
_The beads on the rim are a little larger than half their spacing, so they overlap into a scallop._

### A short history

The Sindhi topi is worn with the ajrak at weddings, at festivals and on Sindhi Cultural Day, celebrated on the first Sunday of December. The notch is often explained as letting the forehead touch the ground in prayer. Caps are embroidered and sewn by hand by makers in towns and villages across Sindh.

### Where it is used

- Caps, gifts and cultural celebrations
- Embroidery and textile design
- Radial pattern and logo design
- Teaching polar coordinates

### Try it

- More rings give a finer and busier cap. (https://lumenary-studio.vercel.app/style/sindhi-topi?rings=10&cap=120)
- Maroon cloth with mirrors on looks festive. (https://lumenary-studio.vercel.app/style/sindhi-topi?cloth=maroon&mirrors=true)
- Wider cells make bold, chunky ornaments. (https://lumenary-studio.vercel.app/style/sindhi-topi?cut=140&rings=4)

### Words worth knowing

- **Topi:** A cap, in several South Asian languages.
- **Ring:** A band of pattern around the centre of the cap.
- **Polar coordinates:** A way of describing a point by its distance and angle from a centre.

### See also

- 196 Ajrak
- 199 Sindhi Mirror Embroidery
- 187 Mandala

## 201  Hala Lacquerware  ·  _still_

- **Comes from:** Hala, Sindh
- **Around:** Traditional craft, still practised
- **Works best on:** Pictures with rich colour

### Why it looks this way

Lacquerware is made on a lathe. While the wooden piece spins, a stick of lac, a resin that softens with heat, is held against it, and the friction melts a thin layer onto the wood. One colour after another is laid on, and fine lines are scratched through the top coat to show the colour beneath. That is why the colour runs around the piece in rings.

### How it works

1. Draw a lathe-turned piece in the dark: a vase, a cylinder or an egg-shaped jar, with a soft shadow at its foot.
2. Map each pixel at horizontal offset dx from the axis to an angle φ = arcsin(dx/ρ) on the surface of the cylinder, where ρ is the piece’s half-width at that height.
3. Wrap the picture round the piece by reading it at x = W (½ + φ/π), so it takes half a turn to run across your picture and it is squeezed near the edge.
4. Fill every band (as tall as the band slider times 1.3 px) with a single colour averaged from the picture.
5. Scratch fine lines through the top coat, and add the sheen of polished lac.

### The mathematics

Lacquerware from Hala is turned on a lathe. While the wooden piece spins, a stick of lac (a resin that softens with heat) is held against it and friction melts a thin layer onto the wood. The turner can lay on one colour after another, and fine lines are scratched through the top coat to show the colour beneath. This is why the bands of colour run round the piece in rings. The program makes this as a picture of a lathe-turned piece in the dark: a vase, a cylinder or a jar, with a soft shadow at its foot.

Everything depends on one idea. A cylinder seen from the front maps a pixel at horizontal offset dx from the axis to an angle φ = arcsin(dx/ρ) on its surface, where ρ is the piece’s half-width at that height. The picture is wrapped round the piece by reading it at x = W (½ + φ/π), so it takes half a turn to run across your picture, and near the edge of the piece the picture is squeezed, as it would be on a real cylinder. Every band (as tall as the band slider times 1.3 px) takes the average colour of its row of the picture, and a share of the local colour is mixed in. The result is matched to the nearest of seven lac colours. The edges of the picture are scratched in gold. A diffuse term cos φ darkens the sides of the piece and two narrow highlights stand for the shine of the polish.

$$
u=\frac{x-x_c}{\rho(y)},\qquad \varphi=\arcsin u,\qquad x_{\text{src}}=W\Big(\tfrac12+\frac{\varphi}{\pi}\Big)
$$
_Wrapping the picture round a cylinder. u runs from −1 to 1 across the piece and x_src is where the picture is read. Without “wrap” it is read at x._

$$
\frac{dx}{d\varphi}=\rho\cos\varphi\ \ \Rightarrow\ \ \text{picture density}\propto\frac{1}{\cos\varphi}
$$
_Why the picture looks squeezed near the sides: equal steps of angle cover less and less width on screen._

$$
\rho_{\text{egg}}(t)=0.45\,W\,\sin^{0.55}\!\big(\pi(0.04+0.92\,\hat t)\big),\qquad \rho_{\text{cyl}}=0.33\,W
$$
_Two of the three profiles; t̂ runs 0 to 1 over the height of the piece. The vase profile is a sum of smoothstep curves._

$$
f=(0.3+0.7\cos\varphi)\,\big(1-0.45\operatorname{smoothstep}(0.82,1,|u|)\big),\qquad s=0.75\,e^{-\left(\frac{u+0.42}{0.16}\right)^2}+0.3\,e^{-\left(\frac{u-0.68}{0.07}\right)^2}
$$
_Shading and the two highlights, a broad one on the left and a narrow one on the right. The highlight is added with weight equal to the polish slider._

### A short history

Lac is the resin made by tiny insects and used for centuries across South Asia for lacquer and sealing wax. In Sindh the craft of lacquered, lathe-turned wood is closely tied to Hala, where bed legs, cradles, toys and boxes are made. It is a craft of family workshops, and demand for it has been under pressure from cheaper goods.

### Where it is used

- Furniture legs, boxes, toys and household items
- Craft markets and cultural gifts
- Teaching how a cylinder maps to a flat picture
- Product mock-ups with a lacquer finish

### Try it

- An egg-shaped piece wraps the picture round a rounder form. (https://lumenary-studio.vercel.app/style/hala-lacquerware?shape=egg&wrap=true)
- Thin bands with strong scratches look finely turned. (https://lumenary-studio.vercel.app/style/hala-lacquerware?band=3&scratch=95)
- Without wrapping, the picture stays flat on the piece. (https://lumenary-studio.vercel.app/style/hala-lacquerware?wrap=false&polish=85)

### Words worth knowing

- **Lac:** A resin made by insects, used to make lacquer.
- **Lathe:** A machine that spins a piece of wood so it can be shaped and coated.
- **Arcsine:** The inverse of sine, used here to find an angle from a distance.

### See also

- 197 Hala Blue Pottery
- 205 Truck Art
- 70 Embossed Leather

## 202  Makli Carving  ·  _still_

- **Comes from:** The Makli hills near Thatta, Sindh
- **Around:** Fourteenth to eighteenth century
- **Works best on:** Pictures with bright and dark regions

### Why it looks this way

The Makli necropolis is one of the largest burial grounds in the world, and its tombs are carved in sandstone and limestone with rosettes, lozenges, arcades and flowing foliage. The soft stone has been worn by the sun, by rain and by the salt in the air. This treatment fills the page with a repeating cell of relief and lights it like a wall, with the picture setting how deep the carving is.

### How it works

1. Build the relief as a height map. In the eight-petal rosette the flower’s outer edge is at radius p(θ) = 0.8 (0.52 + 0.48 |cos 4θ|), the petals rise to 0.62 with a thin groove along the middle, a boss rises to 0.95 at the centre, a ring surrounds the flower, and corner ornaments rise to 0.55.
2. Use a diamond plate, a groove, a centre boss and corners for the lozenge pattern.
3. Multiply the height by 0.12 + 1.15 T², where T is the blurred brightness, so bright regions are deeply cut and dark regions are shallow.
4. Light the height map from the chosen direction and shade by its slope.
5. Add weathering, which wears the carving and stains the stone, and tint the stone from the picture.

### The mathematics

The Makli necropolis, near Thatta, is one of the largest burial grounds in the world, and its tombs from the fourteenth to the eighteenth centuries are carved in sandstone and limestone with rosettes, lozenges, arcades and flowing foliage. The soft stone has been worn by the sun, by rain and by the salt in the air. The program fills the page with a repeating cell of relief and lights it like a wall.

The relief is a height map. In the eight-petal rosette, the outer edge of the flower is at radius p(θ) = 0.8 (0.52 + 0.48 |cos 4θ|), the petals are raised to 0.62 with a thin groove along their middle, a boss rises to 0.95 at the centre, a ring surrounds the flower, and corner ornaments rise to 0.55. The lozenge pattern has a diamond plate, a groove, a centre boss and corners. In both, the picture sets how deep the carving is: the height of the pattern is multiplied by 0.12 + 1.15 T², where T is the blurred brightness, so bright regions are deeply cut and dark regions are shallow. Light from the chosen direction, a darkening where the surface is lower than its own blur (ambient occlusion), a stain of the picture’s colour, long water streaks and patches of lichen finish the surface.

$$
p(\theta)=0.8\,\big(0.52+0.48\,|\cos4\theta|\big),\qquad h_{\text{petal}}=0.62\,\operatorname{smoothstep}\big(-w,\,w,\,p(\theta)-\rho\big)
$$
_The rosette’s outline and petal height. w = 0.05 is the softness of the edge, and ρ the distance from the cell’s centre (cell coordinates from −1 to 1)._

$$
H=P\,\big(0.12+1.15\,T^2\big)+0.9\,T_s+\eta
$$
_The final height map: P is the carved pattern, T the picture’s blurred brightness, T_s a much broader blur (which gives a gentle swell) and η a fine noise._

$$
f=\operatorname{clamp}\!\big(0.74+0.7\,(\mathbf s\cdot\mathbf l),\ 0.3,\ 1.45\big)\,(1-a),\qquad a=\operatorname{clamp}\big(2.4\,(\bar H-H),\,0,\,0.55\big)
$$
_Lighting by the slope s = −k∇H (k = 70 × depth) against the light direction l, and occlusion a where the height is below its own blur H̄._

### A short history

Makli, near Thatta, is a UNESCO World Heritage Site, inscribed in 1981. Its tombs and mausoleums were built from the fourteenth to the eighteenth centuries under the Samma, Arghun, Tarkhan and Mughal rulers. Visitors are struck by the stone carving and by the glazed tile, and conservation work continues against the weather, salt and neglect.

### Where it is used

- Relief and stone texture design
- Architecture and heritage education
- Tile and panel design
- Games and illustration set in historic landscapes

### Try it

- Lozenges give a calmer, geometric carving. (https://lumenary-studio.vercel.app/style/makli-carving?pattern=lozenge&size=90)
- Strong relief with a low sun raises each petal as a shadow. (https://lumenary-studio.vercel.app/style/makli-carving?relief=95&light=200)
- Heavy weathering looks like centuries of salt and sun. (https://lumenary-studio.vercel.app/style/makli-carving?weather=95&stone=limestone)

### Words worth knowing

- **Necropolis:** A large cemetery, from the Greek for city of the dead.
- **Relief:** Carving in which the design stands out from the background.
- **Rosette:** A circular, flower-like ornament.

### See also

- 206 Mughal Jali
- 197 Hala Blue Pottery
- 70 Embossed Leather

## 203  Indus Seal  ·  _still_

- **Comes from:** The Indus Valley civilisation, including Mohenjo-daro
- **Around:** About 2600 to 1900 BCE
- **Works best on:** Animal or figure shapes with clear outlines

### Why it looks this way

Thousands of small square seals were found at Mohenjo-daro and the other cities of the Indus civilisation. Each is a line of signs above a figure, often a bull, an elephant or a tiger, carved in reverse so that pressing it into wet clay leaves the picture standing out. The script has never been deciphered, which makes the seals feel like messages from a very distant friend.

### How it works

1. Draw a square of side 0.8 W on a hidden canvas, with a frame and a band for the signs along the top, 0.2 of the seal’s height.
2. Set a row of n signs, chosen at random from eleven strokes, from the right.
3. Below the band, draw lines from the picture itself: edges found with a Sobel operator on a blurred copy, and hatching whose thickness rises as the picture darkens, in rows 4.6 px apart.
4. In clay mode, show the lines as relief pressed out of the clay; in steatite mode, show the cut stone.
5. Light the surface from a corner and add the grain of the material.

### The mathematics

Thousands of small square seals were found at Mohenjo-daro and the other cities of the Indus civilization, which flourished from about 2600 to 1900 BCE. They are mostly carved in steatite, a soft stone, with a line of signs along the top and a figure below, often a bull, an elephant or a tiger. The script has never been deciphered. Most seals are read from right to left, since the signs crowd toward the left end when the carver ran out of room, so the program sets them out that way. When the seal is pressed into wet clay, the carved lines stand out in relief on the clay.

The picture is the figure. A square of side 0.8 W is drawn on a hidden canvas, with a frame, a band for the signs along the top (0.2 of the seal’s height), and a row of n signs chosen at random from eleven strokes, set from the right. Below the band, lines are drawn from the picture itself: edges, found with a Sobel operator on a blurred copy; hatching with thickness rising as the picture darkens, in rows 4.6 px apart; and a cross-hatch where the picture is very dark. The result is a map C that is 1 on a cut line. In clay mode the seal’s area is pressed down and the lines stand up from it. In steatite mode the lines are cut into the pale stone and filled with dark. Either way the map becomes a height map, and light from the upper left gives it relief.

$$
C=\max\big(C_{\text{signs}},\ e,\ h\big),\qquad e=\operatorname{smoothstep}(0.05,0.15,\lVert\nabla T\rVert)\,(0.4+0.6\,\varepsilon)
$$
_The cut lines: the signs and frame, the outline e of the picture (ε is the engraving slider), and the hatching h._

$$
h=\Big[\operatorname{frac}\!\big(\tfrac{y}{p}\big)<\theta\Big],\qquad \theta=\varepsilon\,\operatorname{clamp}\big(1.5\,(0.6-T),\,0,\,0.78\big)
$$
_Hatching: lines every p = 4.6 px whose thickness θ rises as the tone T falls below 0.6._

$$
H_{\text{clay}}=-0.24\,[\text{inside}]+0.34\,C,\qquad H_{\text{steatite}}=-0.3\,[\text{outside}]-0.3\,C
$$
_Heights before blurring: the clay is pressed down under the seal and the cut lines leave ridges; on the stone the surround is cut away and the lines cut in._

$$
x_i=x_0+S-7\,\mathrm{sc}-\big(i+\tfrac12\big)\,\frac{S-14\,\mathrm{sc}}{n}
$$
_The centre of sign i, counted from the right-hand end of the band._

### A short history

The seals are mostly carved in steatite, a soft stone, and most are read from right to left, since the signs crowd toward the left end when the carver ran out of room. Mohenjo-daro was excavated from the 1920s and is a UNESCO World Heritage Site. The script of about four hundred signs has resisted every attempt to decipher it. The signs here are random strokes and do not spell anything.

### Where it is used

- Education about ancient Sindh and the Indus civilisation
- Stamp and seal design
- Poster and cover illustration
- Teaching how reversed carving prints

### Try it

- Steatite shows the seal itself, as a museum object. (https://lumenary-studio.vercel.app/style/indus-seal?mode=steatite&relief=80)
- More signs give a longer line of text. (https://lumenary-studio.vercel.app/style/indus-seal?signs=8&engrave=90)
- Few signs and a deep relief look like a single impression. (https://lumenary-studio.vercel.app/style/indus-seal?signs=3&relief=95)

### Words worth knowing

- **Steatite:** A soft stone, also called soapstone, easy to carve.
- **Seal:** A carved object used to stamp a mark in clay or wax.
- **Undeciphered script:** A writing system whose meaning we cannot yet read.

### See also

- 204 Sindhi Script
- 191 Hieroglyphs
- 73 Rubber Stamp

## 204  Sindhi Script  ·  _still_

- **Comes from:** Sindh
- **Around:** Standardised in 1853, with a poetry tradition far older
- **Works best on:** Portraits and pictures with bright, clear shapes

### Why it looks this way

Sindhi is written in the Arabic script with letters of its own, for sounds that Arabic does not have: ٻ ڀ ٽ ٿ ڄ ڃ ڇ ڌ ڏ ڙ ڪ ڳ ڱ ڻ and others. The letters join, and each takes a different shape at the start, the middle and the end of a word. This treatment sets words in rows, right to left, and lets your picture decide how large and heavy each word is, so the page reads as a calligraphic portrait.

### How it works

1. Give each word to the browser, which shapes and joins it with the Noto Naskh Arabic font, and set the text right to left.
2. Give each line a pitch of 1.45 times the letter size and fill it from the right, one word after another, with a gap of 0.32 to 0.42 of the font size.
3. Measure each word at the base size and read the tone v of the picture at its middle (the brightness on a dark page, the darkness on a cream one).
4. Set the size again from v, and make the word bold where v is above 0.45.
5. Colour the words from the picture, in gold, or in plain ink.

### The mathematics

Sindhi is written in the Arabic script with extra letters of its own, for sounds that Arabic does not have: ٻ ڀ ٽ ٿ ڄ ڃ ڇ ڌ ڏ ڙ ڪ ڳ ڱ ڻ and others. The letters join, and each takes a different shape at the start, the middle and the end of a word. The program does not do the joining itself; it gives each word to the browser, which shapes it with the Noto Naskh Arabic font, and sets the text right to left. The word list is short and is made of everyday words: Sindh, the Indus, love, peace, earth, light, a friend, language, book, water, sun, moon, art, poem, melody, knowledge, gift and lamp. It was drafted without a native proofread, so treat the spelling as provisional.

Each line has a pitch of 1.45 times the letter size. Words fill the line from the right, one after another, with a gap of 0.32 to 0.42 of the font size. The size of each word follows your picture: the program measures the word at the base size, reads the tone v of the picture at its middle (the brightness on a dark page, the darkness on a cream one) and sets the size again from v. The words are bold where v is above 0.45. Where the picture is bright, the words are large and heavy; where it is dark, small and thin. The page therefore reads as a calligraphic portrait.

$$
f_s=s\,\big(1-\tfrac{\kappa}{2}+\kappa\,v\big),\qquad \text{weight}=\begin{cases}700&v>0.45\\ 400&\text{otherwise}\end{cases}
$$
_Font size from tone: s is the letter size and κ the “size follows light” slider. v = 0 gives half size at κ = 1, and v = 1 gives one and a half._

$$
x_{n+1}=x_n-w_n-f_s\,(0.32+0.1\,\xi),\qquad w_n=\text{measured width of word } n
$$
_Setting a line from right to left. ξ is a random number per word._

$$
y_r=(r+1)\cdot1.45\,s,\qquad N_{\text{lines}}\approx\frac{H}{1.45\,s}
$$
_Line positions._

$$
k_{\text{ink}}=0.45+0.6\,v\ \ (\text{gold}),\qquad k_{\text{ink}}=0.75+0.4\,v\ \ (\text{picture colours, dark page})
$$
_Ink brightness also follows tone, so the bright areas are lit from within._

### A short history

In 1853 the British administration adopted an Arabic-based alphabet of 52 letters for Sindhi, after a period in which several scripts were in use. Sindhi is also written in Devanagari in India. The language carries a great poetic tradition, notably Shah Abdul Latif Bhittai in the eighteenth century, whose verses are still sung at his shrine. The built-in word list here was drafted without a native proofread, so treat its spelling as provisional.

### Where it is used

- Posters, cards and cultural projects
- Calligraphy practice and type design
- Learning to recognise Sindhi letters
- Portrait gifts with a name or poem

### Try it

- Gold ink on an indigo page makes a festival poster. (https://lumenary-studio.vercel.app/style/sindhi-script?ink=gold&paper=indigo)
- Strong size following the light builds a clear portrait. (https://lumenary-studio.vercel.app/style/sindhi-script?contrast=100&size=24)
- Letters mode shows the shapes of the alphabet itself. (https://lumenary-studio.vercel.app/style/sindhi-script?source=letters)

### Words worth knowing

- **Naskh:** A clear, rounded style of Arabic script, good for reading.
- **Joining forms:** The different shapes a letter takes at the start, middle or end of a word.
- **Right to left:** The direction in which Arabic-script languages are written.

### See also

- 54 Calligraphy Portrait
- 203 Indus Seal
- 53 Handwritten

