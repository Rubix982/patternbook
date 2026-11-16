# M. South Asian and Islamic

Source: https://lumenary-studio.vercel.app/theory/southasia (captured 2026-11-16 for private study).

Folk art and sacred geometry across South Asia and the Islamic world.

## 205  Truck Art  ·  _still_

- **Comes from:** Pakistan, and its long roads
- **Around:** Flourishing since the mid twentieth century
- **Works best on:** Bold, colourful pictures and portraits

### Why it looks this way

A Pakistani truck is a moving canvas. It is covered from bumper to roof in flat enamel colour, painted flowers, birds and poetry, and a frame of chains and rosettes, with strips of shiny reflective tape (chamak patti) that glitter in headlights. Every part is made by a specialist: the painter, the woodcarver and the metalworker. Nothing is left plain, because the truck is the driver’s home, pride and calling card.

### How it works

1. Blur the picture (radius = simplify × 1.2 px) and raise its saturation by half.
2. Give each pixel the nearest of nine enamel colours, using the redmean distance, which weights red, green and blue the way the eye does.
3. Run a majority filter over a 5 by 5 window twice so regions are flat, as brush-painted ones are.
4. Draw a black outline wherever the colour index changes and grow it by up to 2 px, then cross the brightest places (tone above 0.74) with diagonal bands of white, like chrome.
5. Wrap everything in a frame as wide as 11 percent of the shorter side, with a red rim, a yellow field of flowers and leaves, a row of pearls and a twelve-petal rosette in each corner.

### The mathematics

Pakistani truck art covers a lorry from bumper to roof in flat enamel colour, painted flowers, birds, poetry and a frame of chains and rosettes, with strips of shiny reflective tape (chamak patti) that glitter in headlights. Every part is made by a specialist: the painter, the woodcarver and the metalworker. The program keeps the look in four steps: reduce the picture to a few loud colours, outline them in black, add glints, and wrap everything in a frame.

Colour reduction first. The picture is blurred (radius = simplify × 1.2 px) and its saturation is raised by half. Each pixel then takes the nearest of nine enamel colours, using a distance that weights red, green and blue the way the eye does (the “redmean” formula below). A majority filter over a 5 × 5 window, run twice, removes specks so that regions are flat, as brush-painted ones are. A black outline is drawn wherever the colour index changes and is then grown by up to 2 px. The brightest places (tone above 0.74) are crossed by diagonal bands of white light, like chrome. The frame, as wide as 11% of the shorter side, has a red outer rim, a yellow field with a row of flowers and leaves, a row of pearls and a corner rosette of twelve petals.

$$
d^2=\Big(2+\frac{\bar r}{256}\Big)\Delta r^2+4\,\Delta g^2+\Big(2+\frac{255-\bar r}{256}\Big)\Delta b^2,\qquad \bar r=\frac{r_1+r_2}{2}
$$
_The “redmean” colour distance used to find the nearest enamel colour. It is a cheap approximation of how different two colours look._

$$
w=\operatorname{round}\big((0.2+2.2\,o)\,\mathrm{sc}\big),\qquad C\leftarrow(1-e)\,C+e\,C_{\text{ink}},\quad e=\min(1,\,1.4\,o)
$$
_Outline width w and strength e from the outline slider o (0 to 1)._

$$
g=\operatorname{smoothstep}(0.74,\,0.92,\,t)\cdot s\cdot\begin{cases}150&\operatorname{frac}\!\big(\frac{0.8x+0.6y}{7\,\mathrm{sc}}\big)<0.42\\ 40&\text{otherwise}\end{cases}
$$
_Chrome gloss added to the colour: s is the gloss slider and t the tone. The two levels make bands of light._

$$
m=\operatorname{round}\big(0.11\,\min(W,H)\,\varphi\big)
$$
_Frame width, with φ the frame slider (0 to 1). Below 6 px the frame is dropped._

### A short history

Decorating lorries, buses and rickshaws grew with the long-distance road trade of the twentieth century, drawing on Mughal and Persian ornament and on local styles such as Peshawar’s carved wooden fittings and Karachi’s painted panels. Painters often learn as apprentices and work in small workshops. Truck art has been shown in museums and festivals abroad, and a new generation of artists now paints on canvas, walls and buildings as well.

### Where it is used

- Poster, packaging and street art
- Fashion and product graphics
- Heritage festivals and museum shows
- Teaching colour reduction and outlining

### Try it

- The Peshawar palette is hot and high contrast. (https://lumenary-studio.vercel.app/style/truck-art?palette=peshawar&gloss=75)
- Heavy outlines and strong simplification look like fresh enamel. (https://lumenary-studio.vercel.app/style/truck-art?simplify=7&outline=90)
- A wide frame turns the whole picture into a truck panel. (https://lumenary-studio.vercel.app/style/truck-art?frame=100&palette=karachi)

### Words worth knowing

- **Chamak patti:** Shiny reflective tape used to decorate trucks.
- **Enamel:** A glossy, hard-wearing paint.
- **Redmean:** A formula that measures colour difference more like the eye does than plain RGB distance.

### See also

- 09 Pop Art
- 05 Maximalism
- 201 Hala Lacquerware

## 206  Mughal Jali  ·  _still_

- **Comes from:** Mughal India and Pakistan
- **Around:** Sixteenth to eighteenth century
- **Works best on:** Landscapes and scenes with distance

### Why it looks this way

Jali means a net or a lattice. The Mughals carved them from single slabs of marble and red sandstone to screen windows, tombs and balconies. They let in air and a broken light and hide the people behind them. Standing in front of one, you see the world through a pattern, and the sun throws that pattern in shadow across the floor. Here the stone is a slab with openings, your picture is the scene behind, and the sun throws the lattice across it.

### How it works

1. Describe each opening with a margin function in pixels that is positive inside the hole and negative in the stone.
2. For the eight-point star, take the star’s polar radius (the same star polygon formula as the Ajrak page) minus the distance from the cell’s centre, combined with a diamond at the corners.
3. For the six-point star, split the plane into hexagons: turn the point (x, y) into hexagonal coordinates, round to the nearest hexagon and draw the star about it. The lotus has its own petal outline.
4. Shade the stone with a bevel whose depth follows the thickness slider, and cast the shadow of the lattice across the scene in the chosen sun direction.
5. Let the scene glow where the light falls through the holes.

### The mathematics

Jali means a net or a lattice. The Mughals carved them from single slabs of marble and red sandstone to screen windows, tombs and balconies: Shah Jahan’s screens round the cenotaphs at the Taj Mahal, and the windows of Salim Chishti’s tomb at Fatehpur Sikri. They let in air and a broken light, and they hide the people behind. The program turns this into a picture: the stone is a slab with openings, your picture is the scene behind it, and the sun throws the lattice across the scene.

Each opening is described by a margin function that is positive inside the hole and negative in the stone, measured in pixels. For the eight-point star, the margin is the star’s polar radius (the same star polygon formula as in the Ajrak page) minus the distance from the cell’s centre, combined with a diamond at the corners. For the six-point star the plane is split into hexagons: the point (x, y) is turned into hexagonal coordinates, rounded to the nearest hexagon, and the star is drawn about that hexagon’s centre. The mask M is the margin passed through a smoothstep 1.8 px wide. It is blurred to give a soft stone edge, and its slope gives a bevel lit by the sun. The scene is drawn only through the openings, and each pixel looks up the mask at a point shifted along the sun’s direction by the stone’s thickness, so the scene is dark where the lattice would cast a shadow.

$$
q=\frac{\frac{\sqrt3}{3}x-\frac{y}{3}}{\sigma},\qquad r=\frac{\frac23\,y}{\sigma},\qquad (q,\,-q-r,\,r)\ \to\ \text{nearest integer triple summing to }0
$$
_Hexagonal (cube) coordinates for the six-point star lattice, σ = 0.62 s. After rounding each part, the one with the largest rounding error is reset so the three still add up to zero._

$$
\mathrm{margin}=\max\big(m_1,\,m_2\big)\,\frac{s}{2},\qquad m_1=r_\star(\theta)-\rho,\quad m_2=0.34\,h-\big[(1-|u|)+(1-|v|)\big]
$$
_The eight-point opening in a cell with coordinates u, v from −1 to 1. r⋆ is the star radius with R₁ = 0.92 h and R₂ = 0.5 h, and h = 0.45 + 0.55 × the opening slider. Union of two shapes is the maximum of their margins._

$$
M=\operatorname{smoothstep}\big(-0.9,\,0.9,\,\mathrm{margin}\big),\qquad \text{lit}=M_b\big(\mathbf x+\mathbf l\,d\big),\quad d=26\,\mathrm{sc}\,\tau
$$
_The mask, and the sun lookup: τ is the thickness slider, l the unit vector of the sun’s direction and M_b the blurred mask._

$$
f_{\text{view}}=(0.38+0.9\,g)\,(0.42+0.7\,\text{lit})
$$
_How bright the scene is behind an opening: g is the light slider._

### A short history

Jali screens are found in Shah Jahan’s marble screen round the cenotaphs at the Taj Mahal and in the windows of Salim Chishti’s tomb at Fatehpur Sikri, and the tradition continued in the Rajput palaces such as the Hawa Mahal in Jaipur, built in 1799. They served as ventilation, privacy and decoration at once, and they cooled interiors by softening the sun. Modern architects have returned to the idea for facades in hot climates.

### Where it is used

- Architecture, facades and interior screens
- Lighting and lamp design
- Cut-metal and laser-cut panel design
- Pattern and tile design

### Try it

- Lotus openings are softer and floral. (https://lumenary-studio.vercel.app/style/mughal-jali?pattern=lotus&cells=6)
- Thick stone with a low sun casts deep shadows. (https://lumenary-studio.vercel.app/style/mughal-jali?depth=90&light=200)
- Small openings feel like a private, carved window. (https://lumenary-studio.vercel.app/style/mughal-jali?hole=40&glow=90)

### Words worth knowing

- **Jali:** A pierced screen of stone or wood with a repeating pattern.
- **Cenotaph:** A tomb-like monument that does not hold the body.
- **Margin function:** A function that is positive inside a shape and negative outside it.

### See also

- 208 Girih
- 202 Makli Carving
- 93 Stained Glass

## 207  Persian Miniature  ·  _still_

- **Comes from:** Persia and the Timurid, Safavid and Mughal courts
- **Around:** Thirteenth to seventeenth century and later
- **Works best on:** Portraits, gardens and scenes with clear shapes

### Why it looks this way

A Persian miniature is a small painting made for a book. The painter uses flat areas of mineral colour, draws fine ink outlines, and does not cast shadows. Space is made by stacking things up the page, and meadows are pricked with tufts of grass and small flowers. Its jewel-like colour and its calm, flat world are the opposite of a photograph, and the recipe is easy to follow.

### How it works

1. Blur the picture (simplify × 1.1 px), make it 25 percent more saturated, and snap each pixel to one of nine pigments by the redmean distance.
2. Remove specks with a majority filter run twice over a 5 by 5 window.
3. Draw outlines in dark brown ink where the colour index changes, with a strength of 0.8 × the ink slider.
4. Use fine parallel hatching for depth where the picture is dark, in place of shadows.
5. Add gold leaf, tufts of grass and a frame of gold rules and a blue band with gold teardrops on ivory paper.

### The mathematics

A Persian miniature is a small painting made for a book. The painter uses flat areas of mineral colour (lapis from the mines of Badakhshan, vermilion, malachite green, turmeric yellow and burnished gold leaf), draws fine ink outlines, and does not cast shadows. Space is made by stacking things up the page, and meadows are pricked with tufts of grass and small flowers. A frame of gold rules, a blue band with gold teardrops and a ground of ivory paper surrounds the page. The program follows the same recipe.

The picture is blurred (simplify × 1.1 px), made 25% more saturated, and snapped to one of nine pigments by the redmean distance used on the Truck Art page. Specks are removed by a majority filter, run twice over a 5 × 5 window. Outlines in dark brown ink are drawn where the colour index changes, with a strength of 0.8 × the ink slider. There are no shadows, but the painter’s trick for depth is fine parallel hatching, and the program uses it where the picture is dark: hatch lines every 3.1 px, at a slant, darken the colour by up to 34%. Tufts of grass (on green and turquoise, and sometimes elsewhere) and flecks of gold are scattered on a jittered grid of 30 px wherever there is no outline. The frame is built from ivory, a lapis band, gold rules, a red hairline and gold teardrops spaced 0.55 m apart, where m is the frame width.

$$
f=0.93+0.14\,t-\eta\,0.34\,\operatorname{smoothstep}(0.42,\,0.15,\,t)\,\big[\operatorname{frac}\!\big(\tfrac{0.7x+y}{3.1\,\mathrm{sc}}\big)<0.26\big]
$$
_Brightness of the flat colour. The second term is the hatching: η is the hatching slider, and it only applies where the tone t is below 0.42._

$$
C\leftarrow(1-\lambda)\,C+\lambda\,C_{\text{ink}},\qquad \lambda=0.8\,\iota\ \ \text{on an edge}
$$
_Ink outline with strength λ, where ι is the ink slider (0 to 1) and C_ink is the dark brown (42, 26, 16)._

$$
r_{\text{gold}}=(1+1.6\,\xi)\,\mathrm{sc}\,(0.6+0.6\,\gamma),\qquad \alpha=0.5+0.5\,\gamma
$$
_Size and opacity of a fleck of gold: ξ is a random number and γ the gold slider._

$$
m=\operatorname{round}\big(0.1\,\min(W,H)\,\varphi\big),\qquad \text{lapis band at inset }0.64\,m,\ \text{width }0.5\,m
$$
_The frame. It is dropped when m is under 8 px._

### A short history

The pigments included lapis lazuli from the mines of Badakhshan, vermilion, malachite green, turmeric yellow and burnished gold leaf. Painting for books flourished at the courts of Tabriz, Herat and Isfahan, with masters such as Kamal ud-Din Behzad in the fifteenth century, and illustrated epics such as the Shahnameh. The Mughal court developed its own school, blending Persian and Indian traditions.

### Where it is used

- Book illustration and manuscript design
- Poster, packaging and wallpaper
- Teaching flat colour, outline and pattern
- Heritage and museum projects

### Try it

- Strong gold and a heavy frame make an illuminated page. (https://lumenary-studio.vercel.app/style/persian-miniature?gold=90&frame=95)
- Fine ink lines with little hatching look crisp and calligraphic. (https://lumenary-studio.vercel.app/style/persian-miniature?ink=85&hatch=10)
- Heavy simplification gives bold flat colour. (https://lumenary-studio.vercel.app/style/persian-miniature?simplify=8)

### Words worth knowing

- **Miniature:** A small painting, here made for a manuscript.
- **Lapis lazuli:** A deep blue stone ground to make pigment.
- **Hatching:** Fine parallel lines used to suggest tone.

### See also

- 209 Madhubani
- 172 Ukiyo-e
- 193 Byzantine Mosaic

## 208  Girih  ·  _still_

- **Comes from:** The Islamic world, from Persia to Spain
- **Around:** Medieval, from about the eleventh century
- **Works best on:** Colourful pictures, which tint the stars

### Why it looks this way

Girih, from the Persian for knot, is the strapwork of Islamic buildings: bands that appear to weave over and under to make stars and polygons. The craft knowledge was geometric and practical, and the same few steps can generate an endless range of stars. Its mathematics turned out to be close to the aperiodic tilings of modern science.

### How it works

1. Build a Penrose tiling of two rhombs with de Bruijn’s pentagrid method, laying five families of parallel lines across the plane.
2. Follow Hankin’s rule: from the middle of every edge of a polygon, two lines go inward at the same angle to the edge, and each meets the line from the neighbouring edge.
3. Draw the strapwork on each rhomb, with the contact angle set by the slider, and widen the lines into straps.
4. Weave the straps over and under, and colour them classic, from the picture or both.
5. Turn the whole pattern by a chosen angle, and pick another patch of the tiling with the seed.

### The mathematics

Girih, from the Persian for knot, is the strapwork of Islamic buildings: bands that appear to weave over and under to make stars and polygons. The medieval method, as far as we can tell from scrolls kept in Topkapı Palace, was to divide the plane into a few tile shapes and draw lines across them. In 1925 Ernest Hankin gave a rule for the lines that is easy to compute: from the middle of every edge of a polygon, two lines go inward at the same angle to the edge, and each meets the line from the neighbouring edge. In 2007 Peter Lu and Paul Steinhardt showed that the girih at the Darb-i Imam shrine in Isfahan (1453) comes very close to a Penrose tiling, which never repeats.

The program uses that connection. It builds a Penrose tiling of two rhombs by de Bruijn’s pentagrid method and then draws the strapwork on each rhomb (this uses two shapes, and not the five girih tiles of the scrolls). Five families of parallel lines are laid across the plane, family i being the set of points z with z · eᵢ + γᵢ a whole number, where eᵢ is a unit vector at angle 2πi/5 and the offsets γᵢ add up to zero. Where a line of family r crosses a line of family s there is one rhomb, whose corners are found by rounding up z · eᵢ + γᵢ for the other families. If r and s are neighbouring directions the rhomb is the wide one, otherwise the narrow one. The random offsets are the “patch of the tiling” (shuffle). Each rhomb is then given Hankin’s lines at the chosen contact angle, which splits it into four kites and a central star, each coloured from your picture, a classic lapis or turquoise and ivory scheme, or both, with the lines drawn in gold.

$$
\mathbf z\cdot\mathbf e_i+\gamma_i\in\mathbb Z,\qquad \mathbf e_i=\Big(\cos\tfrac{2\pi i}{5},\ \sin\tfrac{2\pi i}{5}\Big),\qquad \sum_{i=0}^{4}\gamma_i=0
$$
_The pentagrid: five families of lines. The condition on the offsets γᵢ makes the dual a Penrose tiling._

$$
K_i=\lceil\mathbf z\cdot\mathbf e_i+\gamma_i\rceil,\qquad \mathbf v=\sum_{i=0}^{4}q_i\,\mathbf e_i,\quad q_i=\begin{cases}k_r+\{0,1\}&i=r\\ k_s+\{0,1\}&i=s\\ K_i&\text{otherwise}\end{cases}
$$
_Corners of the rhomb for the crossing of line k_r of family r and line k_s of family s. The four choices of 0 or 1 give its four corners._

$$
\mathbf m_i+t\,\mathbf d_1=\mathbf m_{i+1}+u\,\mathbf d_2,\qquad \mathbf d_1=R_{\theta}(\mathbf b-\mathbf a),\quad \mathbf d_2=R_{-\theta}(\mathbf b-\mathbf c)
$$
_Hankin’s rule for an edge ab followed by bc: the lines leaving the midpoints m_i and m_{i+1} at the contact angle θ meet where t and u are both positive. R_θ is a rotation by θ. If they do not meet, the point halfway between the midpoints is used._

$$
t=\frac{(\mathbf m_{i+1}-\mathbf m_i)\times\mathbf d_2}{\mathbf d_1\times\mathbf d_2},\qquad \frac{N_{\text{wide}}}{N_{\text{narrow}}}\to\varphi=\frac{1+\sqrt5}{2}
$$
_The parameter t, using the 2D cross product, and a famous property of Penrose tilings: wide rhombs outnumber narrow ones by the golden ratio._

### A short history

The Topkapı Scroll, a collection of pattern designs from the fifteenth or sixteenth century kept in the Topkapı Palace Library, shows that medieval designers used a small set of tile shapes. Ernest Hankin described a rule for drawing the lines in 1925. In 2007 Peter Lu and Paul Steinhardt showed that the girih at the Darb-i Imam shrine in Isfahan (1453) comes very close to a Penrose tiling. This program uses two shapes, and not the five girih tiles of the scrolls.

### Where it is used

- Architecture, tile and ceiling design
- Textile, jewellery and metalwork pattern
- Laser-cut screens and panels
- Teaching tilings and symmetry

### Try it

- A larger contact angle makes stars with fatter points. (https://lumenary-studio.vercel.app/style/girih?angle=72&size=70)
- Classic colours show the traditional palette. (https://lumenary-studio.vercel.app/style/girih?colour=classic&line=3.5)
- A small tile size packs in many small stars. (https://lumenary-studio.vercel.app/style/girih?size=30&line=1.2)

### Words worth knowing

- **Girih:** Islamic geometric strapwork, from the Persian for knot.
- **Strapwork:** Decorative bands that appear to interweave.
- **Pentagrid:** Five families of parallel lines used to build a Penrose tiling.

### See also

- 136 Penrose Tiling
- 206 Mughal Jali
- 187 Mandala

## 209  Madhubani  ·  _still_

- **Comes from:** Mithila, in Bihar and Nepal
- **Around:** Ancient tradition, on paper since the 1960s
- **Works best on:** Pictures with clear shapes and bold colour

### Why it looks this way

Madhubani, or Mithila, painting does not like empty space. Every figure is outlined and then filled with a pattern of its own, lines, dots, scales or waves, so that the painting hums with texture. The colours come from natural pigments, and women painted them on the walls of houses, especially for weddings. This treatment does the same by colour: a region of red gets a lattice, a region of yellow gets dots.

### How it works

1. Blur the picture and snap it to eight pigments: madder red, turmeric, leaf green, indigo, lamp black, paper, saffron and earth.
2. Clean regions with a majority filter and outline them in black wherever two colours meet.
3. Choose a fill pattern for each pigment: a diamond lattice on red, dots on yellow, waves on green, fish-scale arcs on blue, dots in paper white on black, concentric rings on saffron and stripes in paper white on earth.
4. Set the pattern size and strength with the sliders.
5. Add a double border with its own small motifs, like the decorated edge of a wall painting.

### The mathematics

Madhubani, or Mithila, painting comes from the Mithila region of Bihar and the neighbouring parts of Nepal. Women painted it on the walls of houses, especially for weddings, with twigs and cotton-wrapped sticks and with pigments from turmeric, indigo, soot, flowers and clay. Its most striking habit is to leave no space empty: every figure is outlined and then filled with its own pattern of lines, dots, scales or waves. The program does this by colour. It reduces the picture to eight pigments and gives most of them a fill pattern.

The picture is blurred and snapped to the eight pigments (madder red, turmeric, leaf green, indigo, lamp black, paper, saffron and earth), cleaned with a majority filter and outlined in black wherever two colours meet. Inside each region a pattern is added, chosen by the pigment: a diamond lattice on red, dots on yellow, waves on green, fish-scale arcs on blue, dots in paper white on black, concentric rings on saffron and stripes in paper white on earth. The pattern repeats every q = 1.6 × size px, and its coordinates wobble with a sine wave so that the lines look drawn by hand. A border of triangles in four colours is set round the painting between rules of black.

$$
\Big|\operatorname{frac}\!\big(\tfrac{x+y}{q}\big)-\tfrac12\Big|<0.07\ \ \text{or}\ \ \Big|\operatorname{frac}\!\big(\tfrac{x-y}{q}\big)-\tfrac12\Big|<0.07
$$
_The lattice of diagonal lines in red regions. Lines of width 0.14 q in each of two directions, so about 1 − 0.86² ≈ 26% of the region is covered._

$$
\Big\lVert\operatorname{frac}\!\big(\tfrac{\mathbf x}{q}\big)-\tfrac12\Big\rVert<0.17\quad(\phi=\pi\cdot0.17^2\approx0.09)
$$
_The dot pattern: a dot in every square. Its covering fraction φ is about 9%._

$$
\operatorname{frac}(5\rho)<0.32,\ \ \rho=\Big\lVert\operatorname{frac}\!\big(\tfrac{\mathbf x}{1.6\,q}\big)-\tfrac12\Big\rVert<\tfrac12
$$
_Concentric rings in saffron regions: five rings per unit of radius, each about a third of the ring spacing._

$$
C\leftarrow C+\tau\,\big(C_{\text{line}}-C\big),\qquad \tau=0.9\,\kappa,\quad C_{\text{line}}=\begin{cases}\text{paper}&\text{black, earth}\\ \text{ink}&\text{otherwise}\end{cases}
$$
_The fill line is blended with strength 0.9 κ, where κ is the pattern strength slider (0 to 1), so light lines are drawn on the dark pigments and dark lines on the others._

### A short history

Madhubani painting comes from the Mithila region of Bihar and the neighbouring parts of Nepal, painted with twigs and cotton-wrapped sticks and with pigments from turmeric, indigo, soot, flowers and clay. After the Bihar earthquake of 1934 the British officer William Archer photographed wall paintings in damaged houses. From the 1960s women artists such as Sita Devi, Ganga Devi and Mahasundari Devi brought the art onto paper, and it became known across India and abroad.

### Where it is used

- Wall painting, textiles and stationery
- Illustration, packaging and station murals
- Teaching colour and pattern filling
- Cultural gifts that support artists

### Try it

- Strong patterns make every colour its own texture. (https://lumenary-studio.vercel.app/style/madhubani?pattern=100&size=9)
- Few colours and thick outlines read like a folk painting. (https://lumenary-studio.vercel.app/style/madhubani?simplify=8&line=85)
- A wide border frames the picture like a wall painting. (https://lumenary-studio.vercel.app/style/madhubani?frame=100)

### Words worth knowing

- **Mithila:** The cultural region in Bihar and Nepal where Madhubani art began.
- **Natural pigment:** Colour made from plants, minerals and soot.
- **Horror vacui:** The urge to fill every empty space in an artwork.

### See also

- 210 Warli
- 211 Kolam
- 207 Persian Miniature

## 210  Warli  ·  _still_

- **Comes from:** The Warli people of Maharashtra and Gujarat
- **Around:** Ancient tradition, shown on paper from the 1970s
- **Works best on:** Pictures with a dark subject on a light ground

### Why it looks this way

Warli painting is made with a vocabulary of three shapes: a circle, a triangle and a square, which are said to come from the sun and the moon, from mountains and trees, and from a field or a hut. A person is two triangles meeting at their tips with a circle for a head and stick limbs, and a crowd of them dances in a ring. The picture decides where the crowd gathers.

### How it works

1. Make a wall texture from two noises, a broad one 90 px across and a fine one 5 px across.
2. Place candidate positions on a staggered grid with spacing 0.82 u (u is the figure size), each shifted by up to a quarter of the spacing.
3. At each position let the picture’s tone t set the chance that anything is drawn: p = min(1, 1.15 d (1 − t)^1.5), where d is the crowd slider. Dark places hold a thick crowd and light ones stay empty.
4. Draw the figures in white rice paste: dancers, animals, trees and huts, with slightly wobbly lines.
5. Add a border of small triangles and squares.

### The mathematics

Warli painting belongs to the Warli people of Maharashtra and Gujarat. It is painted on the red-brown mud walls of houses, in white rice paste, with a bamboo stick, and is often made for weddings. The vocabulary is small: a circle, a triangle and a square, said to come from the sun and the moon, mountains and trees, and a field or a hut. A human is two triangles meeting at their tips, with a circle for a head and stick limbs, and a crowd of them dances in a ring. The program fills the wall with such figures and lets the picture decide where the crowd gathers.

The wall is a texture of two noises, a broad one 90 px across and a fine one 5 px across. Candidate positions lie on a staggered grid with spacing 0.82 u (u is the figure size), each shifted by a random amount of up to a quarter of the spacing. At each position the picture’s tone t sets the chance that anything is drawn there: p = min(1, 1.15 d (1 − t)^1.5), where d is the crowd slider. Dark places therefore hold a thick crowd and light places stay empty. What is drawn is chosen at random: a figure 60% of the time, a tree 16%, a bird 10%, a hut 10% and a sun 4%. Its size also follows the picture, from 0.8 u in light places to 1.2 u in dark. A border of two frames and a chain of triangles is added when it is switched on.

$$
p(t)=\min\!\big(1,\ 1.15\,d\,(1-t)^{1.5}\big)
$$
_The chance that a grid position holds a drawing, from the tone t and crowd slider d._

$$
N\approx\sum_{\text{sites}}p(t)\ \approx\ \frac{A}{(0.82\,u)^2}\ \overline{p}
$$
_The expected number of drawings in an area A._

$$
s=u\,\big(0.8+0.4\,(1-t)\big)
$$
_The size of a figure, from the tone._

$$
\text{kind}=\begin{cases}\text{person}&h<0.60\\ \text{tree}&h<0.76\\ \text{bird}&h<0.86\\ \text{hut}&h<0.96\\ \text{sun}&\text{otherwise}\end{cases}
$$
_The pick, with h a random number fixed by the position and the seed. Figures are drawn from the top of the wall down so lower ones overlap higher ones._

### A short history

Warli painting belongs to the Warli people, an Adivasi community of Maharashtra and Gujarat. It is painted on the red-brown mud walls of houses, in white rice paste, with a bamboo stick, and is often made for weddings, around a square drawn for the goddess Palaghata. In the 1970s the artist Jivya Soma Mashe brought Warli painting onto cloth and paper, and received a Padma Shri in 2011.

### Where it is used

- Wall art, textiles and stationery
- Illustration for children’s books
- Packaging and poster design
- Cultural education and village crafts

### Try it

- A full crowd fills the darkest parts of your picture. (https://lumenary-studio.vercel.app/style/warli?crowd=100&size=20)
- Ochre walls feel like a sun-baked village. (https://lumenary-studio.vercel.app/style/warli?wall=ochre&border=true)
- A night wall makes the white figures glow. (https://lumenary-studio.vercel.app/style/warli?wall=night&crowd=60)

### Words worth knowing

- **Warli:** An Adivasi community of western India, and its painting.
- **Rice paste:** The white paint made of ground rice used on the mud walls.
- **Adivasi:** The Indigenous peoples of India.

### See also

- 209 Madhubani
- 211 Kolam
- 175 Aboriginal Dot Painting

## 211  Kolam  ·  _still_

- **Comes from:** Tamil Nadu and South India
- **Around:** Ancient, drawn every morning
- **Works best on:** Pictures with clear light and dark areas

### Why it looks this way

In Tamil Nadu and the south of India, women draw a kolam at the door each morning in rice flour, so that ants and birds are fed as they pass. The most common kind starts with a lattice of dots, called pulli, and a line that loops round them. The patterns are made by simple rules, and the same dots can make many different drawings. Here each square of four dots chooses its figure from the tone of your picture.

### How it works

1. Place dots on a square lattice with the chosen spacing.
2. For each square of four dots, draw loops (quarter circles of radius s/2 about each corner, turning inward, so four neighbouring squares draw a full circle round the shared dot), a diamond joining the midpoints of the four sides, both, or nothing.
3. Choose by the tone t (less the density slider): empty if t ≥ 0.78, loops only if 0.62 ≤ t < 0.78, diamond only if 0.4 ≤ t < 0.62, and both if t < 0.4, so dark places turn into diamonds and petals.
4. Fold the point where the picture is read for mirror symmetry, and in four-fold symmetry fold the top and bottom as well.
5. Draw the flour as a canvas of its own with grainy edges and a soft glow, laid over a floor texture.

### The mathematics

In Tamil Nadu and the south of India, women draw a kolam at the door each morning in rice flour, so that ants and birds are fed as they pass. The most common kind starts with a lattice of dots, called pulli, and a line that loops round them. Mathematicians and computer scientists have studied kolams since the 1970s, as pictures made by simple rules. The program places dots on a square lattice with the chosen spacing, and for each square of four dots it decides which of two figures to draw from the tone of your picture.

The first figure is the loop round the dots. A quarter circle of radius s/2 is drawn about each corner of the square, turning inward, so that four neighbouring squares draw a full circle round the dot they share, and the circles of neighbouring dots touch at the middle of the edge between them. The second figure is the diamond joining the midpoints of the four sides. For the tone t (less the density slider), a square is empty if t ≥ 0.78. It has only the loops if 0.62 ≤ t < 0.78, only the diamond if 0.4 ≤ t < 0.62, and both if t < 0.4, which is why dark places turn into diamonds and petals. Symmetry is made by folding the point where the picture is read, so that the left and right (and with four-fold symmetry the top and bottom) read the same tones. The flour is a canvas of its own, with grainy edges and a soft glow, laid over a floor texture.

$$
n_x=\Big\lfloor\frac{W}{s}\Big\rfloor-1,\qquad \mathbf p_{i,j}=\big(o_x+i\,s,\ o_y+j\,s\big),\quad 0\le i\le n_x,\ 0\le j\le n_y
$$
_The dot lattice. Offsets o_x, o_y centre it on the canvas, and there are (nₓ + 1)(n_y + 1) dots._

$$
\text{diamond}:\ t<0.62,\qquad \text{loops}:\ t<0.78\ \wedge\ \big(t<0.4\ \vee\ t\ge0.62\big),\qquad t=T(\mathbf c)-\delta
$$
_Which figures a square gets. T is the blurred tone at the square’s centre c, and δ is the density slider divided by 100._

$$
x\leftarrow x_c-|x-x_c|,\qquad y\leftarrow y_c-|y-y_c|\ \ (\text{four-fold only})
$$
_Folding the lookup point for mirror symmetry._

$$
w=0.11\,s\,\omega,\qquad r_{\text{dot}}=0.075\,s\,\max(0.7,\,\omega)
$$
_Line width and dot radius from the line weight slider ω._

### A short history

Kolam is drawn daily, and in the month of Margazhi (December to January) streets fill with large, elaborate ones. Related floor drawings include rangoli in much of India, muggu in Andhra Pradesh and alpana in Bengal. Mathematicians and computer scientists have studied kolams since the 1970s, as pictures made by simple rules, and Gift Siromoney and colleagues in Chennai were among the first to analyse them with array grammars.

### Where it is used

- Daily floor art and festival decoration
- Pattern, textile and logo design
- Teaching loops, symmetry and graphs
- Computer science research on picture languages

### Try it

- Four-fold symmetry makes a classic square kolam. (https://lumenary-studio.vercel.app/style/kolam?sym=four&size=24)
- Positive density clears more of the page, negative fills it. (https://lumenary-studio.vercel.app/style/kolam?density=-20&weight=1.4)
- Picture colour on a dusk floor looks like festival flour. (https://lumenary-studio.vercel.app/style/kolam?colour=picture&floor=dusk)

### Words worth knowing

- **Kolam:** A floor drawing made of rice flour or paste, drawn at the threshold.
- **Pulli:** The dots that form the lattice of a kolam.
- **Array grammar:** A set of rules for generating pictures on a grid.

### See also

- 131 Truchet Tiles
- 210 Warli
- 187 Mandala

## 212  Phulkari  ·  _still_

- **Comes from:** Punjab, in India and Pakistan
- **Around:** An old Punjabi craft, at its height in the nineteenth century
- **Works best on:** Warm, bold pictures with clear shapes; faces and flowers

### Why it looks this way

Phulkari, which means flower work, is stitched from the back of the cloth. The embroiderer picks up a few threads of the weave at a time and carries untwisted silk floss across them in long straight stitches, so the whole pattern is built from straight lines of thread. Silk shines along its length, so stitches that run one way look different from those that run the other, and the design comes from putting the two directions side by side.

### How it works

1. Cut the picture into a grid of cells, each the width of one stitch.
2. Give each cell a direction, across or up and down, in diamonds, in squares, or along the picture’s own edges.
3. Join neighbouring cells of one direction into stitches of varied length that do not line up from row to row.
4. Colour each stitch from the average of the picture beneath it, matched to the nearest silk colour, with a little dither between colours.
5. Draw each stitch as a rounded thread with a shining band, and the cloth between as a slubby plain weave.
6. Add a gold line and a border of crimson and white teeth, as on a shawl.

### The mathematics

The cloth is a grid of square cells of width w = W/n, where n is the number of stitches across. Cell (i, j) takes its direction from the pattern. For diamonds it is floor((|i - i0| + |j - j0|)/b) mod 2, where b is the block size and (i0, j0) the middle; for squares, (floor(i/b) + floor(j/b)) mod 2; for the following mode, across if the vertical gradient of the picture’s brightness at the cell is larger than the horizontal one, since a thread should run along an edge. Along each row (for across stitches) or column (for up and down ones), runs of cells with the same direction are cut into stitches of round(L (0.55 + 0.45 h)) cells, where L is the length slider and h a hash of the position, so the lengths vary and the stitches do not line up.

A stitch takes the average of the picture under it, with its saturation raised by 35% and its contrast by 12%, plus a Bayer dither offset of up to 55 levels either way from the shading slider. If its brightness is below a threshold of 0 to 0.45 it is left as bare cloth; otherwise the colour is replaced by the nearest silk colour, by redmean distance. Each stitch is a capsule, a line with round ends, of radius 0.44 w. It is shaded as a cylinder lit from the upper left, with a bright band of sheen that is strongest on across stitches (62% as strong on the others) and a darker body for up and down stitches (0.86 against 1.04). The ends dive into the cloth at 58% brightness. The cloth is a plain weave, 0.8 + 0.2 (1/2 + 1/2 sin(2 pi x/p) sin(2 pi y/p)), with slubs from two stretched noises and a shadow beside every stitch.

$$
d_{ij}=\Big\lfloor \frac{|i-i_0|+|j-j_0|}{b}\Big\rfloor \bmod 2
$$
_The direction of the stitch in a cell, for diamonds: b is the block size and (i_0, j_0) the middle._

$$
\text{length}=\operatorname{round}\big(L\,(0.55+0.45\,h)\big)
$$
_Stitch length in cells: L is the length slider and h a hash of the position, from 0 to 1._

$$
c=\operatorname{clamp}\big(\rho-\operatorname{dist}(\mathbf p,\ \text{stitch})+\tfrac12\big),\qquad \rho=0.44\,w
$$
_Coverage of a stitch: the distance from a pixel to the line of its stitch, which has round ends._

### A short history

Phulkari is the embroidery of Punjab, made in homes across what is now India and Pakistan, traditionally by the women of a family. A shawl called a bagh, which means garden, covers the whole cloth in silk stitches and was made for weddings and births, often begun when a girl was born and finished for her wedding. The floss was dyed in marigold, madder and indigo and sewn onto coarse hand-spun cotton called khaddar. After the Partition of 1947, families took their phulkaris with them, and the craft became a symbol of Punjabi heritage.

### Where it is used

- Shawls, dupattas and wedding cloths
- Cushions, bags and home textiles
- Prints and posters of Punjabi heritage
- Fashion and embroidery pattern design

### Try it

- Following the picture’s edges keeps the detail of a face better than diamonds do. (https://lumenary-studio.vercel.app/style/phulkari?pattern=flow&stitches=110)
- The picture’s own silk colours on indigo cloth give a modern shawl. (https://lumenary-studio.vercel.app/style/phulkari?palette=picture&ground=indigo)
- Longer stitches and bigger blocks are closer to a true bagh. (https://lumenary-studio.vercel.app/style/phulkari?float=7&block=8&stitches=60)

### Words worth knowing

- **Phulkari:** Punjabi embroidery whose name means flower work, in silk floss on coarse cotton cloth.
- **Darning stitch:** A long straight stitch that picks up only a few threads of the cloth, worked from the back in phulkari.
- **Floss:** Soft, untwisted silk or cotton thread used for embroidery.

### See also

- 88 Embroidery
- 87 Cross-stitch
- 198 Ralli Patchwork
- 199 Sindhi Mirror Embroidery

