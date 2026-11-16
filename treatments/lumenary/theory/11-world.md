# K. World cultural

Source: https://lumenary-studio.vercel.app/theory/world (captured 2026-11-16 for private study).

Patterns and crafts from around the world, studied with care.

## 172  Ukiyo-e  ·  _still_

- **Comes from:** Edo, now Tokyo, Japan
- **Around:** Seventeenth to nineteenth century
- **Works best on:** Landscapes, skies and pictures with clear shapes

### Why it looks this way

A woodblock print can only lay down flat colour, one block at a time, so the picture has to be reduced to a few solid areas before anything is carved. That limit is the look: a firm black key line, a handful of pigments, and a soft fade of colour called bokashi in the sky, which the printer makes by wiping the block. The slight slip between blocks and the grain of the wood remind you that it was pressed by hand.

### How it works

1. Blur the picture by 0.9 times the simplify slider and raise its saturation a little.
2. Match every pixel to the nearest of eight pigments an Edo printer would have had: Prussian blue, vermilion, ochre, sage, pink, grey-brown, paper and sumi ink.
3. Run a majority filter over a 5 by 5 neighbourhood twice to remove specks that a knife could never cut.
4. Draw the key line from edges, add bokashi fades in the sky, and let the wood grain and paper fibre show through the ink.
5. Shift each colour layer slightly to imitate misregistration between blocks, and stamp an artist’s seal.

### The mathematics

A woodblock print is made one colour at a time. The carver cuts a block of cherry wood for the black key line and one more block for every colour, and the printer presses damp paper onto each block in turn, lining the sheet up against two small notches in the bench. Because each block can only lay down a flat colour, the picture has to be reduced to a few areas of solid colour before anything else is done. Here the picture is blurred (radius 0.9 × the simplify slider) and its saturation is raised a little, then every pixel is matched to the nearest of eight pigments an Edo printer would have had: Prussian blue, vermilion, ochre, sage, pink, grey-brown, paper and sumi ink. A majority filter over a 5 × 5 neighbourhood, run twice, removes the specks that a knife could never cut.

The key line is drawn where the colour index changes and wherever the gradient of the lightly blurred brightness is steep. Bokashi, the graded wash a printer wipes onto the block with a damp cloth, is a blend toward Prussian blue over the top 38% of the sheet and toward pink over the bottom 18%. The wood grain shows through the pigment as long streaks (noise stretched about 87 times further along x than along y) and darkens it by up to about 20%. Misregistration is the tell of a real print: the colour layer is read from a position shifted by a pixel or two while the key line stays where it is.

$$
k(\mathbf x)=\arg\min_j\ d\big(\mathbf c'(\mathbf x),\,\mathbf p_j\big),\qquad s'=1.15\,s+0.04
$$
_Each pixel takes the index of the nearest pigment p_j to its blurred colour c′ (saturation s raised to s′), using a redmean-weighted colour distance._

$$
k'(\mathbf x)=\arg\max_j\ \big|\{\mathbf y\in N(\mathbf x):\ k(\mathbf y)=j\}\big|
$$
_The majority filter: the most common index among the neighbours N(x) wins._

$$
\lambda=\max\!\Big(e_{\text{idx}}\,\big(0.5+0.5\,w\big),\ w\,\operatorname{smoothstep}\big(\tau,\,2.1\tau,\,\lVert\nabla L\rVert\big)\Big),\qquad \tau=0.24-0.17\,w
$$
_The key line: e_idx is 1 on a boundary between colours, ‖∇L‖ the gradient of the lightly blurred brightness and w the key line slider (0 to 1). The ink is mixed in with strength λ, at most 0.95._

$$
t_{\text{top}}=b\Big(1-\tfrac{y}{0.38H}\Big)_+^{1.5}\big(0.5+0.2\,n\big),\qquad C\leftarrow(1-t)\,C+t\,C_{\text{blue}}
$$
_Bokashi at the top: b is the slider and n a slow noise that makes the edge of the fade uneven._

### A short history

Ukiyo-e means pictures of the floating world, the pleasure districts and theatres of Edo. Suzuki Harunobu produced the first full colour prints in 1765, and Katsushika Hokusai and Utagawa Hiroshige made landscapes famous in the early nineteenth century, including Hokusai’s Great Wave. Prussian blue, imported in the 1820s, gave the skies and seas of that period their depth. The prints reached Europe in the nineteenth century and influenced artists such as Monet and Van Gogh.

### Where it is used

- Poster and book cover illustration
- Packaging and tea or sake labels
- Teaching printmaking and colour separation
- Travel and landscape graphics

### Try it

- Strong bokashi turns a plain sky into a dawn. (https://lumenary-studio.vercel.app/style/ukiyo-e?bokashi=95)
- Aged paper gives the look of a collected print. (https://lumenary-studio.vercel.app/style/ukiyo-e?paper=aged&wood=80)
- High simplification shows how few colours the blocks allowed. (https://lumenary-studio.vercel.app/style/ukiyo-e?simplify=9&reg=60)

### Words worth knowing

- **Bokashi:** A gradual fade of colour made by wiping ink on the block.
- **Key block:** The block that prints the black outlines.
- **Registration:** The way blocks are lined up so colours meet exactly.

### See also

- 82 Linocut
- 84 Screen Print
- 183 Sashiko

## 173  Papel Picado  ·  _still_

- **Comes from:** Mexico
- **Around:** Centuries old, with tissue paper from the 19th century
- **Works best on:** Bright, simple pictures with warm colour

### Why it looks this way

Papel picado means punched paper. Banners of tissue are strung across streets and altars for fiestas and for the Day of the Dead, and they flutter in the wind, so the light through the holes keeps moving. Holes are the whole drawing here: the more light a place in your picture has, the wider the cut, so the picture shows through the openings.

### How it works

1. Draw each banner as a rectangle of width w and height 1.18 w, with a zigzag lower edge of seven teeth and a fold at the top where the string runs.
2. Hang rows from straight lines, shift alternate rows by half a banner and tilt each by a few hundredths of a radian.
3. Cut by painting in destination-out mode, so cuts remove paper and show what is behind.
4. Add a border of small holes and a 7 by 7 lattice in the middle, where each hole is sized by the blurred brightness of the picture at that cell.
5. Colour the tissue from a fiesta, pastel or marigold palette, or from the picture, with a see-through setting.

### The mathematics

Papel picado, “punched paper”, is made by stacking fifty or so sheets of tissue and tapping steel chisels through them with a mallet. The banners are strung across streets and altars for fiestas and for the Day of the Dead. In the program each banner is a rectangle of width w and height 1.18 w with a zigzag lower edge (seven teeth, depth 0.07 h) and a fold at the top where the string runs. Rows of banners hang from straight lines, alternate rows are shifted by half a banner, and each one is tilted by a few hundredths of a radian.

The cuts are made by painting in destination-out mode, so they remove paper and show whatever is behind. A border of small holes runs inside the edge, and the middle is a 7 × 7 lattice of cells. At the centre of each cell the program reads the blurred brightness t of your picture and sets the hole radius from it, so bright places get wide holes and dark places get pin-pricks. The tissue is thin, so a share of the picture is also painted over the paper itself, and a soft shadow falls behind the whole sheet.

$$
r=\frac{c}{2}\,\big(0.1+0.95\,t^{0.85}\big)\,\big(0.5+h\big),\qquad r\le 0.62\,c
$$
_Hole radius in a lattice cell of side c: t is the picture’s brightness there and h the hole size slider (0.3 to 1). Holes under 0.9 px are skipped._

$$
\phi\approx\frac{\pi r^2}{c^2}=\frac{\pi}{4}\,\big(0.1+0.95\,t^{0.85}\big)^2\,(0.5+h)^2
$$
_The fraction of each cell that is open, for round holes. It is how much of the picture shows through._

$$
C=(1-\alpha)\,C_{\text{paper}}+\alpha\,C_{\text{picture}},\qquad \alpha=0.55\,\sigma
$$
_The tissue is a little see-through: σ is the see-through slider._

### A short history

Paper cutting in Mexico has roots in the bark paper (amate) of the Aztecs and in tissue that crossed the Pacific on the Manila galleons from the sixteenth century. The banners are made today by stacking fifty or so sheets and tapping steel chisels through them with a mallet. Papel picado is a symbol of Día de Muertos, on the first and second of November, when it decorates altars for the dead.

### Where it is used

- Fiesta, wedding and Día de Muertos decoration
- Banners and bunting designs
- Packaging and cultural festival graphics
- Classroom paper craft

### Try it

- Pastel tissue on a dusk sky looks like the evening of a festival. (https://lumenary-studio.vercel.app/style/papel-picado?colour=pastel&backdrop=dusk)
- Flower-shaped holes give a floral lace. (https://lumenary-studio.vercel.app/style/papel-picado?shape=flower&holes=90)
- Thicker tissue hides more of the backdrop. (https://lumenary-studio.vercel.app/style/papel-picado?tissue=70)

### Words worth knowing

- **Papel picado:** Mexican banners of tissue paper cut with patterns.
- **Amate:** Bark paper made in Mexico since before the Spanish arrived.
- **Día de Muertos:** The Day of the Dead, a celebration of remembered family and friends.

### See also

- 174 Chinese Paper Cut
- 92 Paper Cut-out
- 182 Talavera

## 174  Chinese Paper Cut  ·  _still_

- **Comes from:** China
- **Around:** More than a thousand years old
- **Works best on:** Bold silhouettes and faces

### Why it looks this way

A paper-cut is made from one sheet, so every part has to stay joined to the rest. Fine detail therefore comes from slits, crescents and teeth rather than loose islands. Dark areas stay solid, midtones turn to lace and bright areas open out completely, which gives a graded picture from nothing but cuts. Red is the colour of luck.

### How it works

1. Compute darkness v = 1 − L from the blurred brightness L.
2. Cut away the paper where v is below a lower threshold T₀.
3. Above it, let a cut amount k rise smoothly as the picture gets lighter, deciding how wide each slit or how big each crescent is.
4. Write each pattern (slits, crescents, teeth or dots) as a simple condition on the pixel position with a pattern size q.
5. Add a border of cuts and a shadow so the paper looks lifted from the background.

### The mathematics

Jianzhi is cut from a single sheet, with scissors or a small knife, and red is the colour of luck. Everything must stay joined to the rest of the sheet, so fine detail is made from slits, crescents and teeth rather than from loose islands. The program works from darkness v = 1 − L, where L is the blurred brightness. Where v is below a lower threshold T₀ the paper is cut away. Above it, a cut amount k rises smoothly as the picture gets lighter, and k decides how wide each slit or how big each crescent is. Dark areas therefore stay solid, midtones turn to lace and light areas open out completely.

The four cut patterns are written as simple conditions on the pixel position, with q the pattern size. In every one, k = 0 cuts nothing and a larger k cuts more, so the open fraction follows the picture. The edge of the sheet is a frame: a solid rim, then a band of diamond-shaped holes with small round holes between them, and a flower of eight cut petals in each corner. The paper layer is blurred by one pixel and thresholded to give clean edges, textured with fine fibres and dropped onto a cream backing with a shadow.

$$
k=\operatorname{smoothstep}\big(T_1+0.3,\ T_0,\ v\big),\qquad T_1=\tfrac{p}{100},\ \ T_0=T_1-\tfrac{f}{100}
$$
_The cut amount: p is the “paper left” slider and f the fine cutting range. Below T₀ everything is cut._

$$
\Big|\operatorname{frac}\!\Big(\tfrac{x+y+\frac{q}{2}\sin\frac{x}{1.8q}}{q}\Big)-\tfrac12\Big|<\tfrac{k}{2}
$$
_A slit: diagonal stripes with a slight wobble. A stripe of width k leaves exactly a fraction 1 − k of the paper._

$$
\operatorname{frac}\!\big(\tfrac{y}{q}\big)<0.92\,k\,(1-\tau_w),\qquad \tau_w=2\Big|\operatorname{frac}\!\big(\tfrac{x}{q}+\tfrac{\lfloor y/q\rfloor}{2}\big)-\tfrac12\Big|
$$
_Teeth: rows of triangles whose height grows with k._

### A short history

Paper was invented in China, and the oldest surviving paper-cuts, found in tombs at Turpan, date from about the sixth century. Windows are decorated with paper-cuts at the Spring Festival, and the character for double happiness is cut for weddings. Chinese paper-cut was added to UNESCO’s list of intangible cultural heritage in 2009.

### Where it is used

- Window decorations for festivals and weddings
- Greeting cards and New Year graphics
- Silhouette and stencil design
- Lace-like logos and packaging

### Try it

- Black paper with fine crescents looks like lace. (https://lumenary-studio.vercel.app/style/chinese-paper-cut?paper=black&pattern=crescent)
- Keep more paper for a bolder, simpler cut. (https://lumenary-studio.vercel.app/style/chinese-paper-cut?cut=80&size=12)
- Gold paper with teeth gives a festive border. (https://lumenary-studio.vercel.app/style/chinese-paper-cut?paper=gold&pattern=teeth&frame=100)

### Words worth knowing

- **Jianzhi:** The Chinese art of paper cutting.
- **Positive and negative:** The cut-away parts and the paper that remains.
- **Silhouette:** A shape seen as a solid outline.

### See also

- 173 Papel Picado
- 92 Paper Cut-out
- 93 Stained Glass

## 175  Aboriginal Dot Painting  ·  _still_

- **Comes from:** The Western Desert, Australia
- **Around:** Acrylic painting from 1971
- **Works best on:** Landscapes, which fit the contour rings

### Why it looks this way

This treatment borrows only a visual technique, rows of dots in earth colours on dark ground. A real work carries what a picture cannot: the stories and law of a Country, which belong to the people and families who hold them. Dots were used in part to cover the meaning of a design from people who were not meant to read it. Please read this as a tribute and not as a copy, and look for the real paintings.

### How it works

1. Blur the picture’s brightness heavily to a smooth field F.
2. Find the contour lines where F crosses each of n evenly spaced levels, using marching squares, and chain the pieces into curves.
3. Place dots of radius R along each curve every 2.3 R of arc length, with a little jitter.
4. Colour each ring from the ochre palette by level, in bands, or from the picture.
5. Fill the ground between rings with scattered small dots, on black, red or night ground.

### The mathematics

The acrylic dot paintings of the Western Desert began at Papunya in 1971, when men of several language groups began to paint on boards and canvas the designs that belonged to their Country and its stories. Dots were used in part to cover the sacred meaning of a design from people who were not meant to read it. This treatment borrows only the visual technique, rows of dots in earth colours on dark ground, and cannot carry what a real work carries, so please read it as a tribute and not as a copy.

To build the rings the picture’s brightness is blurred heavily to a smooth field F. Marching squares finds the contour lines where F crosses each of n evenly spaced levels, the segments are chained into curves, and dots of radius R are placed along each curve every 2.3 R of arc length, with a little jitter. Each dot is a disc with a small highlight and a small shadow so it reads as a blob of paint. Because the contours of a smooth field crowd together where it changes quickly, dots bunch up along the edges of your picture and thin out across flat areas. Fine dots on a staggered lattice fill the ground between the rings.

$$
\{\mathbf x:\ F(\mathbf x)=\ell_i\},\qquad \ell_i=0.07+0.86\,\frac{i+\tfrac12}{n}
$$
_The ring i is the contour of the blurred brightness F at level ℓᵢ._

$$
\Delta=2.3\,R,\qquad N\approx\frac{\Lambda}{\Delta}
$$
_Dots sit Δ apart along a contour of length Λ, so a longer ring simply holds more of them._

$$
\delta x\approx\frac{0.86}{n\,\lVert\nabla F\rVert}
$$
_The spacing between neighbouring rings: it shrinks where the gradient of F is large, which is why dots crowd at edges._

$$
j=\min\big(5,\ \lfloor 6\,\ell\rfloor\big)
$$
_Dot colour by light level: ℓ picks one of six ochres from deep red up to cream._

### A short history

In 1971 men of several language groups at Papunya, in the Northern Territory, began to paint on boards and canvas, with the encouragement of a schoolteacher, Geoffrey Bardon, the designs that belong to their Country and its stories. The Papunya Tula Artists company followed in 1972. Today Aboriginal artists across Australia, working through their own art centres, are among the best known painters in the world.

### Where it is used

- Learning about Aboriginal art and Country
- Contour and elevation visualisation
- Educational projects made with respect
- Pointillist abstractions

### Try it

- Banded colours show the rings as separate layers of country. (https://lumenary-studio.vercel.app/style/aboriginal-dot-painting?colour=bands&rings=15)
- Tiny dots on a red ground give a fine, dense texture. (https://lumenary-studio.vercel.app/style/aboriginal-dot-painting?dot=3&ground=red)
- Few ground dots leave the rings clear. (https://lumenary-studio.vercel.app/style/aboriginal-dot-painting?fill=10)

### Words worth knowing

- **Country:** In Aboriginal English, the land, waters and stories a people belong to.
- **Papunya:** The community in the Northern Territory where the Western Desert art movement began.
- **Ochre:** An earth pigment in yellows, reds and browns.

### See also

- 99 Pointillism
- 155 Contour Lines
- 179 Mudcloth

## 176  Batik  ·  _still_

- **Comes from:** Java, Indonesia
- **Around:** Centuries old
- **Works best on:** Pictures with clear shapes and mid tones

### Why it looks this way

Batik keeps dye out of cloth. Where hot wax lies, the cloth stays the colour it was, so the maker draws first, dyes next, and adds more wax between baths, working from light to dark. The look is dotted outlines, small marks that fill the shapes and a web of fine cracks where the dye crept through broken wax.

### How it works

1. Match your picture to a cream (the undyed cloth) and six dyes, according to the scheme: soga browns, bright coastal colours or indigo.
2. Clean the regions with a majority filter.
3. Draw the cream outlines in two zones around every boundary: a thin continuous line and a wider zone of dots, as a canting makes them.
4. Fill each dye region with its own mark: dots, dashes, crosses, rings, waves or triangles.
5. Add crackle, a web of lines where dye reached the cloth through broken wax.

### The mathematics

Batik is a way of keeping dye out of cloth. Hot wax is drawn on with a canting, a small copper cup with a spout, and where the wax lies the cloth stays the colour it was. Dyeing then proceeds from light to dark, with more wax added between baths. Java’s courts developed strict patterns in soga brown and indigo, and the coast favoured brighter colours. The program matches your picture to a cream (the undyed cloth) and six dyes, cleans the regions with a majority filter, and then adds what the wax-worker does by hand.

Outlines are cream, the wax-resist line, and there are two zones around every boundary: a thin continuous line and a wider zone that holds a lattice of dots, as canting dots do. Each dye region is filled with its own small mark (dots, dashes, crosses, rings, waves or triangles, chosen by the dye), a filling called isen-isen. Finally the wax cracks. Cracks are found with a Worley cellular noise: the difference between the distances to the nearest and second nearest seed points is small along cell borders, and where it is below the vein width the dye is let in.

$$
g=F_2(\mathbf x)-F_1(\mathbf x),\qquad \text{vein where } g<w=(0.7+1.2\,c)\,\mathrm{sc}
$$
_Crackle: F₁ and F₂ are the distances to the nearest and second nearest seed. g is zero on the boundary between two cells._

$$
q=0.8\Big(1-\frac{g}{w}\Big),\qquad C\leftarrow C+q\,(C_{\text{dark}}-C)
$$
_Dye creeping in: darkest in the middle of the crack and fading to nothing at its edge. It only applies where slow noise exceeds 0.62 − 0.4c._

$$
\Big\lVert\operatorname{frac}\!\big(\tfrac{\mathbf x}{q}\big)-\tfrac12\Big\rVert<0.17
$$
_The simplest isen-isen mark: a dot in every square of side q. The others are similar conditions on the same coordinates._

### A short history

Wax-resist dyeing is found in several parts of the world, but Java developed it into a refined art. The courts of Yogyakarta and Surakarta kept strict patterns, such as parang, in soga brown and indigo, while coastal towns favoured brighter colours. The copper stamp (cap) made batik quicker in the nineteenth century. UNESCO listed Indonesian batik as intangible heritage in 2009, and Indonesia marks National Batik Day on 2 October.

### Where it is used

- Clothing, scarves and home textiles
- Packaging and fashion graphics
- Teaching resist techniques
- Cultural festivals and tourism

### Try it

- Indigo with strong crackle looks like a worn heirloom. (https://lumenary-studio.vercel.app/style/batik?scheme=indigo&crackle=85)
- The coastal scheme is brighter and bolder. (https://lumenary-studio.vercel.app/style/batik?scheme=pesisir&marks=90)
- High simplification shows the wax-drawn regions clearly. (https://lumenary-studio.vercel.app/style/batik?simplify=8&size=9)

### Words worth knowing

- **Canting:** A small copper cup with a spout, used to draw lines of hot wax.
- **Resist:** A material that keeps dye from reaching the cloth.
- **Soga:** A brown dye from the bark of the soga tree.

### See also

- 179 Mudcloth
- 196 Ajrak
- 177 Kente

## 177  Kente  ·  _still_

- **Comes from:** The Asante and Ewe of Ghana
- **Around:** Centuries old
- **Works best on:** Colourful pictures with large areas of colour

### Why it looks this way

Kente is woven on a narrow loom that makes a band only about a hand’s breadth wide, and many bands are sewn edge to edge into a cloth. In a warp-faced band the lengthwise threads hide the weft, so the colour you see is the warp, and where the weaver wants a pattern a block of weft is floated across the surface. The result is stripes broken by small blocks, with colours chosen from a traditional few.

### How it works

1. Make each strip four cells wide, with cells 1.2 times as tall as wide, and offset odd strips by half a cell so blocks do not line up across seams.
2. Give every cell the nearest of seven cloth colours (gold, red, green, black, blue, white and orange) to the picture’s colour.
3. Inside a strip, group cells in blocks of three units in height, and float some as horizontal weft.
4. Show thread relief with light and shade between the threads.
5. Choose motif blocks with the float slider, and a new weave with the seed.

### The mathematics

Kente is woven by the Asante and the Ewe of Ghana on a narrow loom that makes a band only a hand’s breadth wide. The long bands are cut and sewn edge to edge, and a large cloth uses a couple of dozen of them. In a warp-faced band the lengthwise threads hide the weft completely, so the colour you see is the colour of the warp, and where the weaver wants a pattern a block of weft is floated across on the surface instead. The program follows that structure. Each strip is four cells wide, the cells are as tall as 1.2 of their width, and odd strips are offset by half a cell so that the blocks do not line up across seams.

Every cell takes the nearest of seven cloth colours (gold, red, green, black, blue, white, orange) to your picture’s colour. Inside a strip, blocks of three units in height (a unit is half the strip width) are either warp-faced, drawn as vertical threads with an accent thread on every sixth one, or weft-float blocks that carry a small diamond, zigzag, check or cross motif in the strip’s accent colour. Threads are shaded across their width so each looks like a rounded yarn, and the seam between strips is a dark line at half brightness.

$$
y'=y+\tfrac{h_c}{2}\,(s\bmod 2),\qquad h_c=1.2\,\tfrac{w_s}{4}
$$
_Odd strips s are offset by half a cell height h_c; w_s is the strip width._

$$
P(\text{weft block})=0.75\,m,\qquad f=1-0.3\,\rho\,\big(1-\sin\pi u\big)
$$
_The chance that a block is a float motif (m is the slider), and the rounded-thread shading: u runs 0 to 1 across one thread and ρ is the thread relief slider. The coefficient is 0.3 for floats and 0.32 for warp threads._

$$
k=\arg\min_j\ d\big(\mathbf c',\mathbf p_j\big),\qquad \mathbf c'=\operatorname{boost}\big(\bar{\mathbf c}\big)
$$
_The cell colour: the blurred picture colour with saturation raised by 1.5, matched to the cloth palette._

### A short history

Tradition connects kente with Bonwire, where two hunters are said to have learned to weave by watching a spider. The cloth was long worn by Asante kings and other royalty, and each pattern and colour carries a meaning. Kente is now worn at weddings, graduations and festivals in Ghana and by people across the African diaspora. The word is said to come from kenten, the Asante word for basket.

### Where it is used

- Fashion, graduation stoles and home textiles
- Branding and cultural celebrations
- Teaching weaving structure
- Pattern and border design

### Try it

- Narrow strips give a fine, busy weave. (https://lumenary-studio.vercel.app/style/kente?size=20&motifs=85)
- Wide strips show the blocks of float clearly. (https://lumenary-studio.vercel.app/style/kente?size=60&thread=90)
- Few float blocks look closer to a plain striped cloth. (https://lumenary-studio.vercel.app/style/kente?motifs=10)

### Words worth knowing

- **Warp:** The lengthwise threads on a loom.
- **Weft:** The threads that cross the warp.
- **Float:** A thread passed over several others on the surface of the cloth.

### See also

- 91 Tapestry Weave
- 189 Navajo Weave
- 179 Mudcloth

## 178  Adinkra  ·  _still_

- **Comes from:** The Akan peoples of Ghana and Côte d’Ivoire
- **Around:** Nineteenth century and earlier
- **Works best on:** High contrast pictures

### Why it looks this way

Adinkra symbols are visual sayings. Each one stands for a proverb or a value: the heart for patience and tolerance, the fern for endurance, the ram’s horns for strength and humility. They are stamped in dark ink in squares on cloth, so a cloth is a page of sayings, and here the symbols grow larger and heavier where your picture is dark.

### How it works

1. Carry ten symbols drawn with strokes and fills: rings, heart, sankofa, horns, star, fern, twist, comb, handcuffs and tree.
2. Divide the cloth into squares with three-line rules made with a comb, as on the real cloth.
3. In each square read the shade v of the picture, its darkness on light cloth or its brightness on dark cloth, and stamp a symbol sized by v.
4. Add the ink’s slight uneven pressure and let the picture tint the cloth.
5. Choose ink from bark brown, picture colour or gold, on cream, indigo, red or ochre cloth.

### The mathematics

Adinkra cloth comes from the Akan peoples of Ghana and Côte d’Ivoire. Symbols are carved into pieces of calabash and stamped onto cotton with a dark dye boiled from tree bark. The cloth was first worn at funerals, and the word is often given as meaning “goodbye”. Each symbol carries a saying: the heart of patience and tolerance, the fern of endurance, the ram’s horns of strength and humility. The program carries ten of them (rings, heart, sankofa, horns, star, fern, twist, comb, handcuffs and tree), drawn with strokes and fills and cut with small details.

The cloth is divided into squares by three-line rules made with a comb, as on the real cloth. In each square the program reads the shade v of your picture, which is its darkness on light cloth and its brightness on dark cloth, and stamps a symbol whose size grows with v. Very light squares are left bare. Since a stamp’s area grows as the square of its size, the ink on the cloth rises quickly with darkness, which gives the picture its depth. The ink is never even: its opacity is multiplied by a fine noise, so some of it is thin or missing, as with a real stamp.

$$
u=0.45\,s\,\big(1-f+f\,(0.3+0.7\,v)\big),\qquad \text{stamp only if } v\ge 0.12
$$
_Half the stamp size: s is the square size and f the size-follows-shade slider._

$$
\rho_{\text{ink}}\propto\frac{u^2}{s^2}\propto\big(0.3+0.7\,v\big)^2
$$
_The share of a square covered by ink, for filled symbols._

$$
a=\operatorname{clamp}\big(0.55+0.9\,n(\mathbf x),\,0,\,1\big)
$$
_Uneven inking: the alpha of the stamped layer is scaled by a noise n of wavelength about 5 px._

$$
C_{\text{cloth}}\leftarrow C_{\text{cloth}}\,\big((1-\beta)+\beta\,C_{\text{picture}}\big)
$$
_A multiply blend with strength β = 0.7 × the tint slider, which dyes light cloth with the picture. Indigo and red cloth use a screen blend at 0.35 instead._

### A short history

Adinkra cloth was first worn at funerals, and the word is often given as meaning goodbye. Symbols are carved into pieces of calabash and stamped on cotton with a dark dye boiled from tree bark. Tradition links the name to Nana Kwadwo Agyemang Adinkra, a king of Gyaman. Symbols such as Sankofa, which says to go back and fetch what you forgot, are now used on buildings, jewellery and logos.

### Where it is used

- Textile and fashion design
- Educational material about proverbs and values
- Architecture and gate ironwork
- Branding that honours the culture

### Try it

- Gold ink on indigo looks like a festival cloth. (https://lumenary-studio.vercel.app/style/adinkra?cloth=indigo&ink=gold)
- Strong shading makes the symbols follow the picture closely. (https://lumenary-studio.vercel.app/style/adinkra?follow=100&size=40)
- Fewer rules leave the symbols open. (https://lumenary-studio.vercel.app/style/adinkra?rules=10&tint=70)

### Words worth knowing

- **Adinkra:** A set of symbols of the Akan people, each carrying a saying.
- **Sankofa:** A symbol and saying about learning from the past.
- **Calabash:** A gourd, here carved into stamps.

### See also

- 179 Mudcloth
- 177 Kente
- 73 Rubber Stamp

## 179  Mudcloth  ·  _still_

- **Comes from:** The Bamana of Mali
- **Around:** Centuries old
- **Works best on:** Pictures with distinct light and dark regions

### Why it looks this way

Bogolanfini, mud cloth, is made by painting cloth with mud that has fermented for months. The iron in the mud reacts with tannin in the cloth to make a black that does not wash out. Here each tone of the picture is given its own motif, from bare cloth through dots, zigzags and crosses to solid mud, so the picture becomes a pattern of patterns.

### How it works

1. Set a level from 0 to 4 that rises with the picture’s darkness, and keep regions clean with a majority filter.
2. Give each level its own motif: bare cloth, dots, zigzag rows, crosses, and solid mud pricked with small holes.
3. Where two levels meet, clear the pattern within about 3.4 px of the boundary and draw a mud line about 1 px on either side.
4. Add a hand-painted wobble to every stroke.
5. Sew the cloth in narrow strips, with visible seams, as it is woven.

### The mathematics

Bogolanfini, “mud cloth”, is made by the Bamana of Mali. Cotton woven in narrow strips is soaked in a tea of leaves rich in tannin, designs are painted on with mud that has been fermented in a jar for months, and the iron in the mud reacts with the tannin to give a deep black that does not wash out. The background is then bleached, which leaves the black motifs on pale cloth. The strips are sewn together side by side, and the seams show.

Here the picture sets a level from 0 to 4, rising with darkness, and a majority filter keeps regions clean. Each level has its own motif: bare cloth, dots, zigzag rows, crosses, and solid mud pricked with small holes. Where two levels meet, the pattern is cleared within about 3.4 px of the boundary and a mud line about 1 px either side of it is drawn, like the outlines a painter draws first. The pattern coordinates are bent by a smooth noise (up to about 2.5 px) to give the unsteadiness of a hand, and the mud is thinner at its edges. Every 96 px a seam of stitches divides a strip from the next.

$$
\ell=\min\big(4,\ \lfloor 5\,v\rfloor\big),\qquad v=1-L\ \ (\text{or } L \text{ if inverted})
$$
_The level from the blurred brightness L._

$$
\bar m_\ell\approx\{\,0,\ 0.07,\ 0.26,\ 0.41,\ 0.955\,\}
$$
_The share of cloth the motif of each level covers: nothing; dots of radius 0.15 q; a band 0.26 q wide; a cross with arms 0.3 q × 0.84 q; and solid mud with holes of radius 0.12 q._

$$
m_2:\ \Big|\operatorname{frac}\!\Big(\tfrac{y+\frac{q}{2}\tau}{q}\Big)-\tfrac12\Big|<0.13,\qquad \tau=2\,\Big|\operatorname{frac}\tfrac{x}{q}-\tfrac12\Big|
$$
_The zigzag motif: a band bent by the triangle wave τ._

### A short history

The Bamana weave cotton in narrow strips, soak it in a tea of leaves rich in tannin, paint patterns with fermented mud and then bleach the background. The designs often carry meanings of history, proverbs and protection. In the late twentieth century the Malian designer Chris Seydou brought bogolan into fashion, and it is now worn around the world.

### Where it is used

- Fashion, cushions and home textiles
- Pattern design and surface design
- Teaching tone and texture with limited motifs
- Cultural heritage projects

### Try it

- Mud on the light parts reverses the picture. (https://lumenary-studio.vercel.app/style/mudcloth?invert=true)
- Larger motifs and strong outlines read like painted cloth. (https://lumenary-studio.vercel.app/style/mudcloth?size=20&outline=95)
- Rust cloth gives a warm, earthy palette. (https://lumenary-studio.vercel.app/style/mudcloth?cloth=rust&hand=80)

### Words worth knowing

- **Bogolanfini:** Mud cloth, from the Bamana language of Mali.
- **Tannin:** A plant chemical that reacts with iron to make black.
- **Motif:** A repeated design element.

### See also

- 178 Adinkra
- 176 Batik
- 177 Kente

## 180  Azulejo  ·  _still_

- **Comes from:** Portugal and Spain
- **Around:** Sixteenth century onward
- **Works best on:** Pictures with large soft areas

### Why it looks this way

An azulejo painter works with cobalt oxide on an unfired white glaze of tin. The cobalt sinks in as the tile is fired and cannot be corrected, so the thickness of the paint decides how dark the blue becomes. Tiles are painted one by one so that the corner of each tile holds part of a rosette, and four tiles together make a whole flower.

### How it works

1. Blur the picture twice and map it to a four-stop ramp from deep cobalt through mid blue and a pale wash to white glaze, with a streak of noise standing for the brush.
2. Lay tiles on a grid with a thin grout line and a small bevel lit from the top left.
3. Paint a pattern on every tile so that the corner of one tile holds a quarter of a rosette, completed by its three neighbours.
4. Add brush lines and glaze crackle.
5. Choose a pigment: cobalt, manganese purple or copper green.

### The mathematics

The word comes from the Arabic for “small polished stone”. Spain and Portugal took up painted tiles in the sixteenth century, and in Portugal blue and white came to cover churches, stations and the fronts of houses. The painter works with cobalt oxide on an unfired glaze of tin that is white and opaque. The cobalt sinks in as the tile is fired and cannot be changed, so the thickness of the paint sets how dark the blue is. The program mimics that. The picture is blurred twice and mapped to a four-stop ramp from deep cobalt through a mid blue and a pale wash to white glaze, with a streak of noise that stands in for the brush.

Tiles are laid on a grid with a thin grout line and a small bevel that is lit from the top left. A pattern is painted on every tile in which the corner of one tile holds a quarter of a rosette, so four tiles together make a whole flower, and a small flower sits in the middle of each. The pattern is blended in the dark pigment on the light parts of the picture and in white glaze on the dark parts, so it is never lost. Edge detection adds a fine brush outline, and a Worley crackle gives the glaze its hairline cracks.

$$
a=\min(u,1-u),\quad b=\min(v,1-v),\quad \rho=\sqrt{a^2+b^2},\quad \theta=\operatorname{atan2}(b,a)
$$
_Distances from the nearest tile corner, in tile units (u and v run 0 to 1 across the tile)._

$$
\text{petal if } \rho<0.3\,\big(0.56+0.44\,|\cos 4\theta|\big),\qquad \text{ring if } |\rho-0.4|<0.014
$$
_The quarter rosette. |cos 4θ| has eight lobes round a full circle, so four tiles meeting make eight petals._

$$
C\leftarrow C+q\,(P-C),\qquad q=0.15+0.8\,p,\quad P=\begin{cases}\text{cobalt}&\text{wash}>\tfrac12\\ \text{glaze}&\text{otherwise}\end{cases}
$$
_The painted pattern: p is the slider, and P the pigment chosen so it always contrasts with the wash beneath._

### A short history

The word comes from the Arabic az-zulayj, small polished stone. Portugal and Spain took up painted tiles in the sixteenth century, and the Portuguese king Manuel I is said to have admired tiles in Seville in 1503. In the seventeenth and eighteenth centuries blue and white came to cover churches, palaces, stations and the fronts of houses, including the panels at São Bento station in Porto, painted by Jorge Colaço and completed in 1930.

### Where it is used

- Wall and floor tile design
- Street signs and facades in Portuguese cities
- Pattern and textile design
- Ceramics teaching

### Try it

- Manganese purple makes a rarer, older look. (https://lumenary-studio.vercel.app/style/azulejo?ink=manganese&pattern=80)
- Large tiles show the rosette clearly. (https://lumenary-studio.vercel.app/style/azulejo?size=150&line=70)
- Heavy crackle looks like old glaze. (https://lumenary-studio.vercel.app/style/azulejo?crackle=90)

### Words worth knowing

- **Azulejo:** A painted and glazed ceramic tile from Portugal or Spain.
- **Tin glaze:** An opaque white glaze made with tin oxide.
- **Cobalt oxide:** A mineral used for blue pigment.

### See also

- 181 Delft Blue
- 182 Talavera
- 83 Banknote Engraving

## 181  Delft Blue  ·  _still_

- **Comes from:** Delft, the Netherlands
- **Around:** Seventeenth century onward
- **Works best on:** Landscapes, buildings and still lifes

### Why it looks this way

Delftware was the Dutch answer to the Chinese porcelain that ships brought to Europe. It is ordinary earthenware dressed up with white tin glaze and painted in cobalt blue. The painter’s brush follows the form of the thing, and darker passages are built up by going over them more than once, so blue builds into shadow in layers.

### How it works

1. Blur the picture heavily to a smooth brightness field F.
2. At every point, find the direction along which F does not change, perpendicular to its gradient, and lay strokes along those lines so they curve round shapes.
3. Scatter seeds on a jittered grid and shuffle them.
4. In each layer, paint at a seed only if the brightness there is below a threshold that starts at 0.70 and falls by 0.17 for each layer, so dark places are painted over several times.
5. Add outlines, glaze crackle and, if chosen, a plate shape with a rim.

### The mathematics

Delftware was the Dutch answer to Chinese porcelain in the seventeenth century. It is earthenware coated with white tin glaze and painted in cobalt before the glaze is fired. The painter’s brush follows the form of the thing being drawn, and darker passages are built up by going over them more than once. The program does the same. It blurs your picture heavily to a smooth brightness field F, finds at every point the direction along which F does not change, which is perpendicular to its gradient, and lays strokes along those lines so they curve round shapes.

Seeds are scattered on a jittered grid and shuffled. In each of the layers a seed paints only if the brightness there is below a threshold that falls from 0.70 by 0.17 for each layer, so a dark place is painted over several times and a light place once or not at all. A stroke follows the field in both directions for the chosen length, flipping the field’s sign when needed so that it keeps going the same way. The plate has a painted rim of ticks and dots between rings, a soft highlight on the glaze, and a net of cracks from Worley noise, 16 px across, bent slightly so that the lines are not straight.

$$
\mathbf t=\frac{\big(-\partial_y F,\ \partial_x F\big)}{\lVert\nabla F\rVert},\qquad \mathbf x_{n+1}=\mathbf x_n+\Delta\,\mathbf t(\mathbf x_n)
$$
_A stroke follows the isophote, the line of equal brightness. Δ is 2.6 px and the sign of t is chosen to agree with the previous step. Where the gradient is nearly zero a fixed angle of about 0.7 radians takes over._

$$
\text{paint if } T(\mathbf x_0)\le\theta_\ell+0.08\,(\xi-\tfrac12),\qquad \theta_\ell=0.70-0.17\,\ell
$$
_Layer ℓ threshold, tested on T, a lightly blurred brightness (the heavy blur F only steers the strokes). ξ is a random number per seed, so the limit is a little ragged._

$$
\alpha=0.2+0.5\,\frac{\theta_\ell-T}{\theta_\ell},\qquad w=w_0\,\big(0.7+0.5\,(1-T)\big)
$$
_The darker the place, the more opaque and the wider the stroke._

### A short history

Dutch potters in Delft developed blue and white earthenware in the seventeenth century, in imitation of Ming porcelain imported by the Dutch East India Company. De Koninklijke Porceleyne Fles, founded in 1653, is still producing Delftware today. Windmills, tulips and landscapes remain popular subjects.

### Where it is used

- Plates, vases and tiles
- Gift and souvenir design
- Interior pattern and wallpaper
- Illustration with a limited blue palette

### Try it

- Four layers build deep shadows. (https://lumenary-studio.vercel.app/style/delft-blue?depth=4&stroke=1.5)
- Full-sheet mode shows the picture without the plate rim. (https://lumenary-studio.vercel.app/style/delft-blue?shape=full)
- Long strokes follow the form like an engraver’s line. (https://lumenary-studio.vercel.app/style/delft-blue?length=55&outline=20)

### Words worth knowing

- **Delftware:** Tin-glazed earthenware made in and around Delft.
- **Earthenware:** Pottery fired at a low temperature, which stays slightly porous.
- **Gradient:** The direction in which brightness changes fastest.

### See also

- 180 Azulejo
- 86 Cyanotype
- 103 Ink Wash

## 182  Talavera  ·  _still_

- **Comes from:** Puebla, Mexico, descended from Spanish majolica
- **Around:** Sixteenth century onward
- **Works best on:** Colourful pictures with warm and cool areas

### Why it looks this way

Talavera is painted by hand, so no two tiles are quite alike: the motif sits a little off-centre, a little tilted, and the line wavers. Its palette of cobalt, yellow, green and orange is limited by what survives the kiln. Each tile here takes its ground from the light in the picture, from cobalt in the shadows to white glaze in the lights.

### How it works

1. Make a tile for every cell of a grid and choose its ground by brightness, from cobalt in the shadows through green, orange and yellow to white glaze.
2. Paint two accent colours on each ground, chosen to contrast: yellow and white on cobalt, for example, and cobalt with orange on white.
3. Let the warmth of the picture at that tile (red above blue) decide which of the two accents leads.
4. Paint a four-way flower or star, offset and tilted slightly by a hand wobble.
5. Add grout lines and glaze shine.

### The mathematics

Talavera de Puebla is tin-glazed earthenware with a protected name. It descends from Spanish majolica, and its palette of cobalt, yellow, green and orange is limited by what survives the kiln. The tiles are painted by hand, so no two are quite alike: the motif is a little off-centre, a little tilted, and the line wavers. The program makes a tile for every cell of a grid and chooses the ground by brightness, from cobalt in the shadows through green, orange and yellow to white glaze in the lights.

Two accent colours are painted on each ground, chosen to contrast: yellow and white on cobalt, for example, and cobalt with orange on white. Which of the two leads is decided by the warmth of the picture at that tile (red above blue means warm), so the hues of your picture reach the tile in a small way. A tile carries either an eight-petal flower with four leaves in its corners, or two eight-pointed stars with four round bosses. A thin painted border runs inside the edge, and a glaze shine covers the lot.

$$
g=\min\big(4,\ \lfloor 5\,t\rfloor\big)\ \in\ \{\text{cobalt, green, orange, yellow, glaze}\}
$$
_The ground of a tile from its blurred brightness t._

$$
\mathbf v_k=r_k\,\Big(\cos\tfrac{k\pi}{8},\ \sin\tfrac{k\pi}{8}\Big),\qquad r_k=\begin{cases}R_1&k\ \text{even}\\ R_2&k\ \text{odd}\end{cases}
$$
_The vertices of an eight-pointed star: tips at R₁ and notches at R₂ (0.85 u and 0.42 u for the large star, 0.5 u and 0.26 u for the small one)._

$$
\text{lead colour}=\begin{cases}\text{fg}_1&R>B\\ \text{fg}_2&\text{otherwise}\end{cases}
$$
_The warm-or-cool rule: R and B are the red and blue values of the picture’s boosted colour at the tile._

### A short history

Talavera de Puebla descends from Spanish majolica, brought to New Spain in the sixteenth century, and it also took on Indigenous and Asian influences. It has a protected designation of origin. In 2019 UNESCO added the artisanal Talavera of Puebla and Tlaxcala, together with the ceramics of Talavera de la Reina and El Puente del Arzobispo in Spain, to its list of intangible heritage.

### Where it is used

- Wall tiles, sinks and kitchen ware
- Architecture and courtyards
- Mexican folk-art graphics
- Craft and restoration projects

### Try it

- Star motifs give a more geometric, Moorish look. (https://lumenary-studio.vercel.app/style/talavera?motif=star&size=80)
- A little hand wobble keeps tiles alive; a lot makes them playful. (https://lumenary-studio.vercel.app/style/talavera?hand=90)
- Wide grout makes each tile stand alone. (https://lumenary-studio.vercel.app/style/talavera?grout=90)

### Words worth knowing

- **Majolica:** Tin-glazed pottery painted with bright colours.
- **Denomination of origin:** A legal protection for products made in a particular place by tradition.
- **Kiln:** An oven used to fire pottery.

### See also

- 180 Azulejo
- 181 Delft Blue
- 173 Papel Picado

## 183  Sashiko  ·  _still_

- **Comes from:** Rural Japan
- **Around:** Edo period onward
- **Works best on:** Pictures with clear light and dark areas

### Why it looks this way

Sashiko means little stabs. It began as a way for farming families to strengthen and mend cloth with white thread on indigo, and the stitch patterns became beautiful in their own right. In the simplest kind, hitomezashi, every row and column is stitched with running stitches, each starting either on the beat or half a beat off, and squares, crosses and diamonds appear from nothing.

### How it works

1. Write r_j and c_i for the starting beat of row j and column i, each 0 or 1.
2. Draw the stitch on row j between points i and i + 1 if i + r_j is even, and the stitch on column i between j and j + 1 if j + c_i is even.
3. At any grid point exactly one of the two horizontal stitches and exactly one of the two vertical stitches meet, so the stitches join into closed loops.
4. Choose the starting beats at random, or from patterns that make diamonds, waves or steps.
5. Draw the thread thicker and brighter where the picture is light, on indigo, black or madder cloth.

### The mathematics

Sashiko means “little stabs”. It began as a way for farming families in Japan to mend and strengthen cloth with white thread on indigo, and the stitch patterns became beautiful in their own right. Hitomezashi, “one-stitch”, is the simplest kind. You stitch every row and every column on a grid with running stitches that are as long as the gaps between them, and you start each row and each column either on the beat or half a beat off. That is all, and yet squares, crosses and diamonds appear.

There is a tidy reason for this. Write r_j and c_i for the starting beat of row j and column i. The stitch on row j between points i and i + 1 is drawn if i + r_j is even, and the stitch on column i between j and j + 1 is drawn if j + c_i is even. At any grid point exactly one of the two horizontal stitches next to it is drawn, and exactly one of the two vertical ones, so every point is a right-angle bend. The stitches therefore form paths that never cross or branch. In the program the thread is thicker and brighter in the light parts of the picture and thin and dim in the dark ones.

$$
h_{i,j}=\big[(i+r_j)\bmod 2=0\big],\qquad v_{i,j}=\big[(j+c_i)\bmod 2=0\big]
$$
_Whether the horizontal stitch (i, j) and the vertical stitch (i, j) are drawn. The bits r and c are random, alternating, or taken from a wave or a step pattern._

$$
h_{i-1,j}+h_{i,j}=1,\qquad v_{i,j-1}+v_{i,j}=1
$$
_Each grid point has one horizontal and one vertical stitch, which is why the lines turn at every point and never meet._

$$
w=s\,\big(0.05+0.34\,\omega\,t^{1.4}\big),\qquad k=0.3+0.7\,t
$$
_Thread width and brightness: s is the stitch length, ω the weight slider and t the brightness of the picture under the stitch._

### A short history

Sashiko developed in rural Japan during the Edo period, when cotton was precious and clothes were patched and layered, especially in the north. Cloth mended for generations in this way is called boro. Hitomezashi patterns have also caught the interest of mathematicians in recent years, who have studied the loops and regions that they form.

### Where it is used

- Mending and visible repair
- Bags, coasters and home textiles
- Modern embroidery and pattern design
- Teaching parity and patterns

### Try it

- Diamonds are the classic hitomezashi pattern. (https://lumenary-studio.vercel.app/style/sashiko?pattern=diamonds)
- Gold thread on black looks like a night festival. (https://lumenary-studio.vercel.app/style/sashiko?tint=gold&cloth=black)
- Short stitches give a fine, dense grid. (https://lumenary-studio.vercel.app/style/sashiko?size=7&weight=80)

### Words worth knowing

- **Hitomezashi:** One-stitch sashiko, made of running stitches on a grid.
- **Boro:** Cloth that has been mended and patched over many years.
- **Parity:** Whether a whole number is even or odd.

### See also

- 87 Cross-stitch
- 88 Embroidery
- 90 Quilt Patchwork

## 184  Kintsugi  ·  _still_

- **Comes from:** Japan
- **Around:** Fifteenth century onward
- **Works best on:** Pictures with rich glaze-like colour

### Why it looks this way

Kintsugi, golden joinery, mends broken pottery with lacquer mixed with gold powder and leaves the break visible. It treats damage as part of the object’s history. The program breaks your picture the way a bowl breaks, with cracks that wander, then puts the pieces back a little out of line and traces every crack in gold.

### How it works

1. Bend the coordinates with smooth noise, by up to about 0.35 of the shard size at full jaggedness.
2. Find the Worley cells of the bent plane. Where the distance to the nearest seed equals the distance to the second nearest, two shards meet, and that line is the crack.
3. Set the width of the gold where g = F₂ − F₁ is below the seam width.
4. Put each shard back slightly out of true, reading the picture from a point shifted by the misalignment, with a slight brightness change.
5. Leave a few lost pieces filled with gold, and add a bevel of light along the seams.

### The mathematics

Kintsugi, “golden joinery”, mends broken pottery with lacquer mixed with gold powder, and it leaves the break visible, even celebrated. The program breaks your picture the way a bowl breaks: with cracks that wander. It first bends the coordinates with smooth noise, by up to about 0.35 of the shard size at full jaggedness, and then finds the Worley cells of the bent plane. Where the distance to the nearest seed equals the distance to the second nearest, two shards meet, and that line is the crack. The width of the gold is set where the difference g = F₂ − F₁ is below the seam width w.

Each shard is put back a little out of true: it reads the picture from a point shifted by up to the misalignment amount, with its own random shift, and it has its own slight brightness. Close to a seam the glaze thickens and darkens, and right at the edge the pale body of the pot shows through. A random share of shards, set by the lost-pieces slider, is missing altogether and filled in gold. The gold is a four-stop ramp from dark bronze to pale yellow, lit as two soft ridges on either side of the crack, with a fine noise to give the surface a hammered texture.

$$
g(\mathbf x)=F_2(\mathbf x)-F_1(\mathbf x),\qquad \text{gold where } g<w
$$
_Worley cells of side S with their distances F₁ ≤ F₂ to the two nearest seeds. g = 0 on the shared boundary of two shards._

$$
\mathbf x'=\mathbf x+J\Big(2\,\big(\operatorname{fbm}(2\mathbf x/S)-\tfrac12\big)+\tfrac12\,\big(\operatorname{vnoise}(8.3\,\mathbf x/S)-\tfrac12\big)\Big)
$$
_The wandering crack: the coordinates are displaced by a broad noise and a finer ripple before the cells are found (the y shift uses a second copy of the noise). J is 0.35 S times the jaggedness slider._

$$
\mathbf x_{\text{src}}=\mathbf x+2\,\delta\,\big(h_1-\tfrac12,\ h_2-\tfrac12\big),\qquad \delta=7\,\mu\,\mathrm{sc}
$$
_Each shard reads the picture from a shifted place: h₁ and h₂ are fixed random numbers for the shard and μ the misalignment slider._

$$
\text{gold}=\operatorname{ramp}\big(0.35+0.5\,b(f)+\eta\big),\qquad f=\frac{g}{w},\quad b(\tfrac12)=\tfrac{\sqrt2}{2},\ b(0)=b(1)=0
$$
_Lit gold: b is zero on the crack and on the seam’s edge and highest between, giving a rolled bead. η is fine noise._

### A short history

A story, which may be a legend, says that the shogun Ashikaga Yoshimasa sent a broken tea bowl to China in the fifteenth century and it came back mended with ugly metal staples, which led Japanese craftsmen to look for a more beautiful repair. The lacquer used is urushi, and kintsugi is often linked to the idea of wabi-sabi, finding beauty in what is imperfect. Worley cells were described by Steven Worley in 1996.

### Where it is used

- Ceramic repair and craft
- Art about resilience and healing
- Branding with a gold-seam motif
- Procedural cracks in 3D art

### Try it

- Thick seams make the break the star of the picture. (https://lumenary-studio.vercel.app/style/kintsugi?seam=10&jag=80)
- Little misalignment looks like a clean, careful repair. (https://lumenary-studio.vercel.app/style/kintsugi?shift=10&fill=0)
- Lost pieces filled with gold are the boldest version. (https://lumenary-studio.vercel.app/style/kintsugi?fill=50&size=150)

### Words worth knowing

- **Urushi:** The sap of the lacquer tree, used as a Japanese lacquer.
- **Wabi-sabi:** An aesthetic that finds beauty in what is simple, worn and imperfect.
- **Worley noise:** A pattern of cells made from the distance to the nearest random points.

### See also

- 135 Voronoi Mosaic
- 71 Gold Foil
- 93 Stained Glass

## 185  Celtic Knot  ·  _still_

- **Comes from:** Early medieval Ireland and Britain
- **Around:** Seventh to ninth century and later
- **Works best on:** Bold shapes with strong colour

### Why it looks this way

Interlace is the signature of the insular art of Ireland and Britain: ribbons that pass over and under each other without end. The simplest way to draw it is a plait, a lattice of diagonal strands in which each strand goes over the next one it meets, then under, then over. The rule is so regular that it can be drawn pixel by pixel.

### How it works

1. Use two coordinates u = (x + y)/c and v = (x − y)/c that run along the two diagonals.
2. The strand going one way sits where u is near the middle of its unit cell, and the other where v is.
3. Where the two overlap, decide which is on top by the parity of ⌊u⌋ + ⌊v⌋, so it flips at every crossing and each strand alternates over and under.
4. Shade the ribbons with a highlight and draw outlines to separate them.
5. Colour each length of ribbon from the picture beneath it, and add a frame if wanted.

### The mathematics

Interlace is the signature of insular art, the style of the Book of Kells and the great stone crosses of Ireland: ribbons that pass over and under each other for ever. The simplest way to draw it is a plait, a lattice of straight strands at ±45° where each strand goes over the next one it meets, then under, then over. The program draws exactly that, at the pixel level. Two coordinates u = (x + y)/c and v = (x − y)/c run along the two diagonals. The strand going one way sits where u is near the middle of its unit cell, and the other where v is.

Where the two overlap, the strand on top is decided by the parity of the cell, ⌊u⌋ + ⌊v⌋. Walking along a strand one cell at a time changes one of the two integers by one, so the parity flips at every crossing and the strand alternates over and under without ever having to be told. Each length of strand between two crossings takes its colour from the picture at its middle. Each strand is shaded as a cylinder, with a highlight, a dark outline at its edges, and a shadow on the lower strand next to the crossing. A gold stud sits in the diamond-shaped gap at each lattice point.

$$
u=\frac{x+y}{c},\qquad v=\frac{x-y}{c},\qquad \Big|\operatorname{frac}(u)-\tfrac12\Big|<h\ \ \text{or}\ \ \Big|\operatorname{frac}(v)-\tfrac12\Big|<h
$$
_The two families of strands, with h half the ribbon width (the width slider divided by 200)._

$$
\text{strand }u\text{ is on top}\iff(\lfloor u\rfloor+\lfloor v\rfloor)\ \text{is even}
$$
_Over and under, set by the cell parity._

$$
s=\frac{d}{h},\qquad f=0.55+0.5\sqrt{1-s^2}-0.18\,s+0.25\,e^{-\left(\frac{s+0.38}{0.16}\right)^2}
$$
_Cylinder shading: s runs −1 to 1 across the ribbon, with a soft highlight just off centre. The outline darkens where |s| passes 0.78._

### A short history

Interlace appears in the Lindisfarne Gospels, made around 715, in the Book of Kells, from about 800, and on stone crosses such as those at Monasterboice. It was not unique to the Celts and had earlier roots in Roman mosaics and in Anglo-Saxon and Pictish art. George Bain published methods for constructing the patterns in his book Celtic Art in 1951.

### Where it is used

- Manuscript and book decoration
- Jewellery and tattoo design
- Architecture and stonework
- Logos and borders

### Try it

- Gold ribbons on night ground look like an illuminated page. (https://lumenary-studio.vercel.app/style/celtic-knot?colour=gold&ground=night)
- Small knots form a fine plait. (https://lumenary-studio.vercel.app/style/celtic-knot?size=18&width=30)
- Emerald on vellum is a gentle green. (https://lumenary-studio.vercel.app/style/celtic-knot?colour=emerald&ground=vellum)

### Words worth knowing

- **Interlace:** A pattern of strands that cross over and under one another.
- **Insular art:** The art of Ireland and Britain in the early Middle Ages.
- **Parity:** Whether a whole number is even or odd.

### See also

- 187 Mandala
- 208 Girih
- 87 Cross-stitch

## 186  Rosemaling  ·  _still_

- **Comes from:** The valleys of Norway
- **Around:** Eighteenth and nineteenth century
- **Works best on:** Warm pictures with bright and dark contrast

### Why it looks this way

Rosemaling, rose painting, grew up in Norwegian valleys where country painters decorated chests, bowls and walls in imitation of the grander baroque and rococo styles of the towns. It is built from only a few brush strokes: the C-scroll, the S-scroll, the teardrop petal and the leaf. The painter loads the brush with two colours so every stroke has a light edge and a dark one.

### How it works

1. Lay motifs on a staggered grid of spacing g.
2. Choose the motif from the picture’s brightness v: a flower where v is above 0.62, a pair of scrolls from 0.32 to 0.62, and a spray of three leaves below that.
3. Make the size follow brightness too: R = g (0.3 + 0.34 v).
4. Pick the nearest of six folk paints (red, ochre, green, blue, cream and brick) to the picture’s colour, or use the picture’s own colours.
5. Shade every stroke from a light edge to a dark edge, on a teal, black, green or cream ground.

### The mathematics

Rosemaling, “rose painting”, grew up in the valleys of Norway in the eighteenth century, where country painters decorated chests, bowls and walls in imitation of the grander baroque and rococo styles of the towns. It is built from a few brush strokes (the C-scroll, the S-scroll, the teardrop petal, the leaf), and the painter loads the brush with two colours so that every stroke has a light edge and a dark one. The program lays motifs on a staggered grid of spacing g and decides which motif by the brightness v of your picture there: a flower where v is above 0.62, a pair of scrolls from 0.32 to 0.62, and a spray of three leaves below that.

Size follows brightness too: R = g (0.3 + 0.34 v). The colour is the nearest of six folk paints (red, ochre, green, blue, cream and brick) to the picture’s colour, and each paint has a partner for the flower’s centre. Scrolls are tapering ribbons that spiral inward, drawn in pairs turning opposite ways, flowers have petals that are ellipses laid around the centre with a pale highlight, and every shape has a thin dark outline. Scrolls are drawn first, then leaves, then flowers, smallest first, so the largest blossoms sit on top.

$$
\text{kind}=\begin{cases}\text{flower}&v>0.62\\ \text{scroll}&0.32<v\le0.62\\ \text{leaves}&\text{otherwise}\end{cases},\qquad R=g\,(0.3+0.34\,v)
$$
_Motif choice and size (each size is also multiplied by a random 0.92 to 1.08). Places with v below 0.07 (1.4 − d), where d is the density slider, are left bare._

$$
r(t)=R\,(1-0.78\,t),\qquad \varphi(t)=\varphi_0\pm 1.35\,(2\pi)\,t,\qquad w(t)=R\big(0.34\,(1-t)^{0.8}+0.05\big)
$$
_A scroll: a spiral inward over 1.35 turns, drawn as a ribbon that tapers from thick to thin._

$$
\varphi_i=\frac{2\pi i}{n}-\frac{\pi}{2},\qquad i=0,\dots,n-1
$$
_The directions of the n petals of a flower, starting from the top._

### A short history

The painted style spread across valleys such as Telemark, Hallingdal and Gudbrandsdalen, each with its own manner, and flourished from around the middle of the eighteenth century. After a decline it was revived in Norway, and Norwegian immigrants carried it to the American Midwest, where Per Lysne and others kept it alive at places such as Vesterheim in Iowa.

### Where it is used

- Furniture, boxes and plates
- Folk art decoration and craft classes
- Surface pattern and illustration
- Heritage projects and museums

### Try it

- The classic palette on teal looks like a farmhouse chest. (https://lumenary-studio.vercel.app/style/rosemaling?colour=classic&ground=teal)
- Many petals make fuller roses. (https://lumenary-studio.vercel.app/style/rosemaling?petals=9&size=100)
- Low density leaves space and shows scrolls only. (https://lumenary-studio.vercel.app/style/rosemaling?density=30)

### Words worth knowing

- **Rosemaling:** Norwegian decorative painting with scrolls, flowers and leaves.
- **C-scroll:** A brush stroke shaped like the letter C.
- **Telemark:** A region of Norway known for a graceful style of rosemaling.

### See also

- 88 Embroidery
- 91 Tapestry Weave
- 15 Victorian

## 187  Mandala  ·  _still_

- **Comes from:** Buddhist and Hindu traditions
- **Around:** Ancient, with sacred forms still made today
- **Works best on:** Colourful pictures with many hues

### Why it looks this way

In the Buddhist and Hindu traditions a mandala is a plan of a sacred world, built from the centre outward in rings. The program has no meaning of its own to give, but it builds the geometry faithfully: a centre, rings that grow outward, and a symmetry that repeats every motif a whole number of times, with the colours of every petal drawn from your picture.

### How it works

1. Place the centre in the middle of the canvas, and make K rings, each of thickness Δ = R_max/(K + 0.7), reaching the corners.
2. Give the pattern n₀-fold rotational symmetry, so every ring repeats its motif a whole multiple of n₀ times.
3. Choose each ring’s count so its motifs are about as wide as the ring is thick, and turn every second ring by half a step so petals sit in the gaps of the ring before it.
4. Use six motifs in turn: lotus petals, beads, triangles, scallops, diamonds and more.
5. Colour each motif from the picture, and pick out the lines in gold with a soft glow.

### The mathematics

The Sanskrit word means “circle”. In the Buddhist and Hindu traditions a mandala is a plan of a sacred world, built from the centre outward in rings, and the sand mandalas of Tibet are made grain by grain and then swept away. The program has no meaning of its own to give them, but it builds the geometry faithfully. The centre is the middle of the canvas, the rings reach to the corners, and there are K of them, each of thickness Δ = R_max/(K + 0.7). The symmetry is n₀-fold rotational: every ring repeats its motif a whole multiple of n₀ times.

A ring’s count is chosen so its motifs are about as wide as the ring is thick, and every second ring is turned by half a step so petals sit in the gaps of the ring before it. Six motifs take turns: lotus petals, beads, triangles, scallops, diamonds and leaf pairs. Each is drawn in the colour of your picture at its own place (or, if you choose to mirror the colours, at the matching place in a single wedge so that the colour pattern is symmetrical too), outlined in gold, with a lighter inner shape. At the heart is a star of n₀ points.

$$
\rho_o(k)=R_{\max}-k\,\Delta,\qquad \Delta=\frac{R_{\max}}{K+0.7},\qquad R_{\max}=\tfrac12\sqrt{W^2+H^2}
$$
_The outer radius of ring k._

$$
n_k=n_0\,\max\!\Big(1,\ \operatorname{round}\frac{2\pi\,\rho_m}{1.15\,n_0\,\Delta}\Big)
$$
_The number of motifs in a ring of mid radius ρ_m: a multiple of n₀, so each ring is as symmetric as the whole._

$$
\vartheta'=\min\big(\vartheta_s,\ \tfrac{2\pi}{n_0}-\vartheta_s\big),\qquad \vartheta_s=\big(\vartheta+\tfrac{\pi}{2}\big)\bmod\tfrac{2\pi}{n_0}
$$
_Mirrored colours: an angle is folded into a single wedge, where the picture is read, so the colours repeat as the shapes do._

### A short history

The Sanskrit word means circle. Tibetan sand mandalas are made grain by grain over days and then swept away, a teaching about impermanence. Carl Jung, in the early twentieth century, drew mandalas himself and saw them as symbols of wholeness. Similar radial designs are found in many places, from Gothic rose windows to Islamic geometric patterns.

### Where it is used

- Meditation and colouring pages
- Textile and tile pattern design
- Logos and decorative art
- Teaching rotational symmetry

### Try it

- Twenty-four-fold symmetry makes a delicate rosette. (https://lumenary-studio.vercel.app/style/mandala?fold=24&rings=16)
- Mirror the colours for a calmer, balanced result. (https://lumenary-studio.vercel.app/style/mandala?mirror=true)
- Strong gold lines on maroon give a temple banner look. (https://lumenary-studio.vercel.app/style/mandala?ground=maroon&line=90)

### Words worth knowing

- **Mandala:** A circular diagram used in Buddhist and Hindu practice.
- **Rotational symmetry:** A shape that looks the same after turning by a certain angle.
- **Impermanence:** The idea that all things change and pass.

### See also

- 118 Kaleidoscope
- 185 Celtic Knot
- 208 Girih

## 188  Maori Koru  ·  _still_

- **Comes from:** Aotearoa New Zealand
- **Around:** Long held, painted in meeting houses for generations
- **Works best on:** Landscapes with soft light

### Why it looks this way

The koru is the unfurling frond of the silver fern, a young leaf curled into a spiral and about to open. It stands for new life and growth. In the painted rafter patterns of Māori meeting houses, kōwhaiwhai, spirals repeat along a beam in red, white and black. These patterns carry meaning for the people who hold them, so this treatment is a visual homage and not a substitute for the real thing.

### How it works

1. Draw each koru as a ribbon that starts as a short stem arriving from the side and swells into a spiral of 1.2 turns that tapers to a small round bulb.
2. Use an Archimedean spiral, with the radius falling in a straight line with the angle, which is not quite the logarithmic spiral of a real frond but draws the same loop.
3. Set korus on a staggered grid and size them by the picture’s brightness.
4. In flowing mode alternate orientation by a half turn, with a slight tilt that changes from row to row, so pairs make S-shaped chains. Mirrored and ring modes arrange them in other ways.
5. Colour them red, white and black in traditional mode, fading to bare ground in the shade, or from the picture.

### The mathematics

The koru is the unfurling frond of a silver fern, a young leaf curled into a spiral and about to open. It stands for new life and is used in the painted rafter patterns of Māori meeting houses, kōwhaiwhai, where spirals repeat along a beam in red, white and black. In the program a koru is a ribbon that starts as a short stem arriving from the side and swells into a spiral of 1.2 turns that tapers to a small round bulb. The turn is an Archimedean spiral, r falling in a straight line with the angle, which is not quite the logarithmic spiral of a real frond but draws the same loop.

Korus sit on a staggered grid. In flowing mode the orientation alternates by a half turn from one to the next, with a slight tilt that changes from row to row, so that pairs make S-shaped chains; in mirrored mode neighbours reflect each other; and in the ring mode every koru turns to face round the centre. Size grows with the light of the picture, R = 0.46 g (1 − 0.6 f + 0.9 f v). Bright places are white, mid-tones are red and dark places are left bare, each with a line along the middle in a contrasting colour, on a black wood-grain ground.

$$
r(q)=R\,(1-0.74\,q),\qquad \varphi(q)=\tfrac{\pi}{2}+1.2\,(2\pi)\,q,\qquad q\in[0,1]
$$
_The spiral part: centre at the origin, radius falling linearly with the angle._

$$
w(q)=R\big(0.36\,(1-q)^{0.9}+0.13\big),\qquad r_{\text{bulb}}=0.14\,R
$$
_Width along the body and the bulb at the end. The stem is a gentle swell from 0.22 R to 0.36 R._

$$
\text{fill}=\begin{cases}\text{white}&v>0.55\\ \text{red}&0.06\le v\le0.55\\ \text{none}&v<0.06\end{cases}
$$
_The traditional paints, by the light of the picture where the koru sits (on the cream ground the white becomes black)._

### A short history

Kōwhaiwhai are painted on the rafters of wharenui, meeting houses, and each pattern has names and stories. The koru is also a modern symbol of New Zealand, appearing on the livery of its national airline. Māori artists today continue to carve, paint and weave using these forms, and ask that they be treated with respect.

### Where it is used

- Learning about kōwhaiwhai and Māori design
- Respectful decoration and education
- Spiral pattern design
- Illustrations of ferns and growth

### Try it

- Mirrored korus face each other like a pair of unfurling fronds. (https://lumenary-studio.vercel.app/style/maori-koru?turn=mirror)
- Traditional red on a cream ground is the most familiar look. (https://lumenary-studio.vercel.app/style/maori-koru?colour=trad&ground=cream)
- Strong size following the light grows spirals where the picture is bright. (https://lumenary-studio.vercel.app/style/maori-koru?follow=100&size=45)

### Words worth knowing

- **Koru:** A spiral shape based on the unfurling fern frond.
- **Kōwhaiwhai:** Painted patterns on the rafters of Māori meeting houses.
- **Wharenui:** A Māori meeting house.

### See also

- 148 Phyllotaxis
- 185 Celtic Knot
- 172 Ukiyo-e

## 189  Navajo Weave  ·  _still_

- **Comes from:** The Diné (Navajo) of the American Southwest
- **Around:** Centuries old, with rug trade from the 19th century
- **Works best on:** Bold pictures with strong shapes

### Why it looks this way

A Diné rug is woven on an upright loom, and every block of colour is a short run of weft pulled tight. An edge that is not square therefore has to step, so a diagonal becomes a staircase and a curve becomes a serrated line. The program does the same with a grid of yarn blocks laid over your picture, and its serrated edges are part of the look.

### How it works

1. Lay a grid of cells (the yarn blocks) over the picture and give each the nearest colour of the chosen wool, or, for the natural greys, a grey chosen by brightness.
2. Create symmetry by folding the picture: for left-to-right mirroring the sample x becomes min(x, W − x), and for four-way symmetry y is folded as well.
3. Serrate edges by shifting the sample point a quarter of a cell one way on even rows and the other way on odd ones.
4. Frame the rug with a plain or stepped zigzag border.
5. Add fringe to the ends and subtle wool texture.

### The mathematics

Diné, or Navajo, weaving is done on an upright loom, and the tradition says that Spider Woman taught the people to weave. Every block of colour is a short run of weft pulled tight, so edges that are not square have to be stepped, and a diagonal becomes a staircase. Regional styles are known by their wool: the red grounds of Ganado, the natural greys and browns of Two Grey Hills. The program lays a grid of cells (the yarn blocks) over the picture and gives each the nearest colour of the chosen wool, or, for the natural greys, a grey picked by its brightness.

Symmetry is made by reading the picture folded: for left-to-right mirroring the sample x becomes min(x, W − x), and for four-way symmetry y is folded as well. Serrating shifts the sample point a quarter of a cell one way on even rows and the other way on odd rows (half a cell between neighbours), so that vertical edges turn into the zigzag teeth of real rugs. A border can be added: stripes, or the stepped zigzag, which is a triangle wave z(a) of the position a along the edge, and the red cells are those whose distance d from the border satisfies d − 2 = z or d − 2 = 4 − z, making a chain of diamonds. Each cell shows rows of yarn, a little fuzz and a slight darkening where one block meets the next, and fringe hangs from the ends.

$$
x'=\min(x,\ W-x),\qquad y'=\min(y,\ H-y)
$$
_Mirroring in the sample point: the right-hand side of the rug is a reflection of the left, and with four-way symmetry the bottom of the top._

$$
z(a)=\min\big(a\bmod 8,\ 8-(a\bmod 8)\big),\qquad \text{red if } d-2\in\{z(a),\ 4-z(a)\}
$$
_The stepped zigzag border. d is the distance in cells from the rug’s edge and a the cell’s position along it._

$$
f=\Big(0.74+0.26\sin\big(\pi\,\operatorname{frac}(2\,y_c)\big)\Big)\,\big(0.93+0.14\,\xi\big),\qquad y_c=\tfrac{y-y_0}{c}
$$
_Yarn: two ridges of weft per cell (y_c is the position across the cell) with a fuzz noise ξ._

### A short history

Diné tradition says that Spider Woman taught the people to weave. Regional styles are known by their wool and colour: the red grounds of Ganado, whose style was encouraged by trader John Lorenzo Hubbell, and the natural greys and browns of Two Grey Hills. Weavers still work today, and the best way to honour the tradition is to buy from Diné weavers directly.

### Where it is used

- Rug and blanket design
- Southwestern interior and pattern design
- Education about weaving and stepped geometry
- Giving credit to and supporting Diné weavers

### Try it

- Two Grey Hills uses natural wool and quiet geometry. (https://lumenary-studio.vercel.app/style/navajo-weave?palette=twogrey&border=simple)
- Four-way symmetry makes a classic centred rug. (https://lumenary-studio.vercel.app/style/navajo-weave?sym=quad&size=12)
- Turn serration off for a smoother, pixel-like weave. (https://lumenary-studio.vercel.app/style/navajo-weave?serrate=false)

### Words worth knowing

- **Diné:** The name the Navajo use for themselves, meaning the People.
- **Weft:** The threads woven across the warp.
- **Serration:** A stepped, sawtooth edge formed by the weave.

### See also

- 177 Kente
- 91 Tapestry Weave
- 26 Pixel art

## 190  Aztec Glyphs  ·  _still_

- **Comes from:** The Mexica of central Mexico
- **Around:** Fourteenth to sixteenth century
- **Works best on:** Pictures with strong light and dark, which raise and lower the relief

### Why it looks this way

The Mexica carved in stone, and the best known piece is the Sun Stone, a disc whose rings hold the twenty signs for the days of the ritual count. Twenty signs run against thirteen numbers to give the 260 days of the sacred year. Brighter places in your picture stand higher out of the stone here, and a raking light gives each glyph a shadow.

### How it works

1. Make a wall of square tablets, each with a raised plate, a raised border and one of eleven glyphs: the spiral of wind, the five-dot movement sign, the stepped fret, the sun, the serpent, the flower, water, the flint, the house, the face and an eight-pointed star.
2. Set the height of the plate to 0.18 + 0.4 t where t is the picture’s brightness, with the border adding 0.22 and the glyph 0.42.
3. Paint the heights on a hidden grey canvas, blur it by about a pixel and light it as a relief, from the slope of the surface.
4. Choose the light direction in degrees, and the stone: basalt, sandstone or limestone.
5. Add traces of pigment and weathering that gather in the hollows.

### The mathematics

The Mexica carved in stone, and the best known piece is the Sun Stone, a disc whose rings hold the twenty signs for the days of the ritual count. Twenty signs run against thirteen numbers to give the 260 days of the sacred year. The program makes a wall of square tablets, each with a raised plate, a raised border and one of eleven glyphs (the spiral of wind, the five-dot movement sign, the stepped fret, the sun, the serpent, the flower, water, the flint, the house, the face and an eight-pointed star), drawn with strokes of different widths. The plate is higher where your picture is brighter: its height is 0.18 + 0.4 t, the border adds 0.22 and the glyph 0.42.

The heights are painted on a hidden grey canvas, blurred by about a pixel, and lit as a relief. The slope of the surface is found from differences of height. Light from the chosen direction brightens the faces that look toward it. Cracks and corners are darkened by an occlusion term, which is large where the surface is lower than its own blur. A wash of the picture’s colours is mixed into the stone, and the glyphs carry stronger paint, because the Mexica painted their stone. Weathering adds long streaks and patches of lichen.

$$
H=\rho\,h_{\text{canvas}}+0.25\,\bar L,\qquad h_{\text{plate}}=0.18+0.4\,t
$$
_The height map: ρ is the depth slider, h_canvas the drawn heights and L̄ a broad blur of the picture’s brightness, which gives the whole wall a gentle swell._

$$
f=\operatorname{clamp}\big(0.74+0.7\,(\mathbf s\cdot\mathbf l),\ 0.3,\ 1.45\big)\,(1-a),\qquad \mathbf s=-k\,\nabla H
$$
_Relief lighting: l = (cos α, sin α) is the direction to the light and k = 22 + 70 ρ scales the slope._

$$
a=\operatorname{clamp}\big(2.4\,(\bar H-H),\ 0,\ 0.55\big)
$$
_Occlusion: where the height H is below its own blur H̄ (a groove) the surface is darkened by up to 55%._

### A short history

The Sun Stone, often called the Aztec calendar, was found in Mexico City in 1790. The 260-day count, the tonalpohualli, combined twenty day signs with thirteen numbers. Mexica carvers decorated temples, altars and sculpture, and the glyphs are still studied by archaeologists and honoured by Nahua communities today.

### Where it is used

- Museum and education material
- Relief and stone texture design
- Games and illustration with Mesoamerican themes, made with care
- Teaching calendars and numbers

### Try it

- A low light from the side makes the relief deepest. (https://lumenary-studio.vercel.app/style/aztec-glyphs?light=180&relief=95)
- Heavy pigment recalls a painted temple. (https://lumenary-studio.vercel.app/style/aztec-glyphs?paint=95&wear=20)
- Strong weathering gives an ancient wall. (https://lumenary-studio.vercel.app/style/aztec-glyphs?wear=90&stone=sandstone)

### Words worth knowing

- **Mexica:** The people commonly called the Aztecs, who built Tenochtitlan.
- **Tonalpohualli:** The 260-day sacred count of Mesoamerica.
- **Raking light:** Light that strikes a surface at a low angle and brings out relief.

### See also

- 191 Hieroglyphs
- 70 Embossed Leather
- 68 Clay 3D

## 191  Hieroglyphs  ·  _still_

- **Comes from:** Ancient Egypt
- **Around:** About 3200 BCE to the 4th century CE
- **Works best on:** Pictures with warm and cool contrast

### Why it looks this way

The Egyptians cut their writing in two ways. In raised relief the background is cut away and the signs stand out. In sunk relief the signs are cut into the surface, which lets them be read in the strong light of an outside wall, where a hollow throws a clear shadow. Both were painted, in lapis blue, red ochre, malachite green, yellow ochre and black. The signs here are chosen for how they look and do not spell a message.

### How it works

1. Write in columns divided by double rules, with a horizontal band every six lines, and face signs alternately in neighbouring columns, since hieroglyphs face the start of the line.
2. Draw twelve signs: the ankh, the eye, water, the feather, the sun disc, the djed pillar, the was sceptre, a snake, a duck, an owl, a lotus and a basket.
3. Cut each in with a dark stroke on a middle-grey plate, so the lighting finds a hollow.
4. Make the signs fuller and the pigment stronger where the picture is bright.
5. Light the relief from a chosen direction and add weathering to limestone, sandstone or granite.

### The mathematics

The Egyptians cut their writing in two ways. In raised relief the background is cut away and the signs stand out. In sunk relief the signs are cut into the surface, which lets them be read in the strong light of an outside wall, where a hollow throws a clear shadow. Both were painted, in lapis blue, red ochre, malachite green, yellow ochre and black. The program writes in sunk relief: columns of signs, divided by double rules, with a horizontal band every six lines, and signs that face alternate ways in neighbouring columns, since hieroglyphs face the start of the line.

Twelve signs are drawn (the ankh, the eye, water, the feather, the sun disc, the djed pillar, the was sceptre, a snake, a duck, an owl, a lotus and a basket). Each is cut in with a dark stroke on a middle-grey plate, so after blurring the signs sit lower than their surroundings, and the double rules are cut as raised ridges. A broad blur of the picture’s brightness lifts the whole surface slightly where it is bright. A sign is drawn larger the brighter the picture is under it, from half to full size. The paint that fills a sign is the nearest of the five pigments to the picture’s colour, and a wash of the picture tints the stone.

$$
H=\rho\,\big(0.59-0.49\,\chi\big)+0.18\,\bar L,\qquad \chi\in\{0,1\}\ \text{inside a sign}
$$
_Sunk relief: the plate is at 150/255, a sign is cut down to 25/255 (a depth of 0.49 ρ) and L̄ is a broad blur of brightness._

$$
u=\tfrac{s}{2}\,\big(0.5+0.5\,t\big)
$$
_The half-size of a sign in a cell of height s, from the picture’s brightness t._

$$
f=\operatorname{clamp}\big(0.74+0.7\,(\mathbf s\cdot\mathbf l),\ 0.3,\ 1.45\big)\,(1-a),\qquad \mathbf s=-k\,\nabla H
$$
_Lit as in the Aztec relief: with the light from the chosen direction and an occlusion term a that darkens the grooves._

### A short history

The Rosetta Stone, found in 1799, carried the same decree in hieroglyphs, Demotic and Greek. Jean-François Champollion announced the decipherment in 1822. Egyptian writing was used for more than three thousand years, and the last known inscription, at Philae, dates from 394 CE.

### Where it is used

- Museum and education material
- Relief and stone texture design
- Teaching writing systems and decipherment
- Themed illustration made with care

### Try it

- Deep relief with a low light shows each sign as a shadow. (https://lumenary-studio.vercel.app/style/hieroglyphs?relief=95&light=200)
- Granite gives a darker, harder stone. (https://lumenary-studio.vercel.app/style/hieroglyphs?stone=granite&paint=40)
- Strong paint recalls a freshly coloured tomb. (https://lumenary-studio.vercel.app/style/hieroglyphs?paint=100&wear=10)

### Words worth knowing

- **Sunk relief:** Carving in which the design is cut into the surface.
- **Cartouche:** An oval that encloses a royal name.
- **Malachite:** A green mineral used as a pigment.

### See also

- 190 Aztec Glyphs
- 70 Embossed Leather
- 203 Indus Seal

## 192  Greek Meander  ·  _still_

- **Comes from:** Ancient Greece
- **Around:** From about the ninth century BCE
- **Works best on:** Strong tonal pictures

### Why it looks this way

The meander, or Greek key, is a line that runs round and round without ever breaking, turning back on itself at right angles. The name comes from the river Maiandros, which winds. It frames Greek pots as a band of unbroken fret, and here the paint is thicker where your picture is darker, so the picture appears in the weight of the line.

### How it works

1. Draw a key unit in a band six units high: the line goes up the left side, along the top, down the right, back toward the left, up again and then a short way right, and sits on a rule at the bottom.
2. Repeat the unit every eight units, with alternate bands mirrored and shifted by half a period.
3. Read the shade v at the middle of each segment and set the paint width from it.
4. Offer three styles: black-figure (black slip on red-orange clay), red-figure (a black ground with the clay left showing) and white ground.
5. Add rule lines and tint the clay from the picture.

### The mathematics

The meander takes its name from the river Maiandros, which winds. The key pattern runs round Greek pots from the geometric period onward. In black-figure vases the painter draws in a slip that fires black on the red-orange clay. In red-figure vases the ground is painted black and the figures are left in the colour of the clay, and the program offers both, together with a white-ground style. A key unit is drawn in a band six units high. Its line goes up the left side, along the top, down the right, back toward the left, up again and then a short way right, and sits on a rule at the bottom. The unit repeats every eight units, and alternate bands are mirrored and shifted by half a period.

The width of the paint follows the picture. Each segment of the pattern reads the shade v at its middle, which is the darkness of the picture for black paint and the brightness for red-figure, and draws its line with a width between 0.18 and about 1.2 units. Dark places get thick, heavy fret and light places a thread. The hook is made of straight segments of lengths 6, 5, 4, 3, 2 and 1.5, which is 21.5 units, and with the rule underneath and the pair of border rules the paint covers a fraction of the band that grows with the line width. The clay itself is mottled, and a share of the picture is multiplied into it (screened on the black ground of the red-figure style).

$$
w=u\,\Big(0.18+\beta\,\big(1-f+f\,v^{0.9}\big)\Big),\qquad u=\frac{\text{key size}}{6}
$$
_Line width at a segment: β is the weight slider and f the weight-follows-picture slider._

$$
\ell_{\text{hook}}=6+5+4+3+2+1.5=21.5\,u,\qquad \ell_{\text{cell}}=21.5\,u+8\,u+16\,u
$$
_Length of line in one 8 u by 9 u cell: the hook, the rule it stands on, and the two border rules._

$$
\phi\approx\frac{\ell_{\text{cell}}\,w}{8u\cdot 9u}=0.63\,\frac{w}{u}
$$
_The share of the clay covered by paint: about 11% at the thinnest line and up to 75% at the heaviest, which is how the line weight draws the picture._

### A short history

The key pattern runs round Greek pots from the geometric period onward, and later it was used by the Romans and revived in neoclassical architecture and fashion. Black-figure vases were painted in Corinth and Athens from the seventh century BCE, and the red-figure technique appeared in Athens around 520 BCE. The river Maiandros is now the Büyük Menderes in Turkey, and gave its name to the English word meander.

### Where it is used

- Borders for pottery, textiles and architecture
- Logos and branding with a classical air
- Interior and wallpaper design
- Teaching Greek vase painting

### Try it

- Red-figure reverses the black and the clay. (https://lumenary-studio.vercel.app/style/greek-meander?figure=red&follow=95)
- White ground looks like a funeral vase. (https://lumenary-studio.vercel.app/style/greek-meander?figure=white&weight=50)
- Small keys form a dense frieze. (https://lumenary-studio.vercel.app/style/greek-meander?size=26&rules=false)

### Words worth knowing

- **Meander:** A winding line, from the river Maiandros, or the fret pattern named after it.
- **Black-figure:** Vase painting in which figures are painted in black on a clay ground.
- **Slip:** A watery clay used for painting pottery before firing.

### See also

- 191 Hieroglyphs
- 19 Mondrian
- 193 Byzantine Mosaic

## 193  Byzantine Mosaic  ·  _still_

- **Comes from:** Ravenna and Constantinople
- **Around:** Fifth to fifteenth century
- **Works best on:** Portraits and pictures with strong light and shadow

### Why it looks this way

Mosaic setters pushed each small cube into wet plaster at a slight angle, so the surface glitters as the viewer moves, and they laid the cubes in rows that follow the shapes, a flow called andamento. Gold tesserae, made by sealing a leaf of gold between layers of glass, catch the light of candles. The program lays its rows along the contours of the picture and sets the brightest parts in gold.

### How it works

1. Blur the picture to a smooth brightness F and find at each point the direction that runs along its contours, perpendicular to the gradient, easing to a gentle slant where F is nearly flat.
2. Try seeds in random order, first on a grid of 1.05 tessera widths and then on a finer one.
3. From a free seed, grow a row of tesserae both ways, along the flow, as far as there is room.
4. Colour each tessera from the picture matched to a palette of smalti (opaque glass), or use the picture’s colour, and set the brightest ones in gold.
5. Add dark outlines and slight tilts, so each cube catches the light differently.

### The mathematics

The mosaics of Ravenna and Constantinople are made of tesserae, small cubes of coloured glass and stone, and of gold tesserae in which a leaf of gold is sealed between two layers of glass. The setters pushed each cube into wet plaster at a slight angle, so the surface glitters as the viewer moves, and they laid the cubes in rows that follow the shapes, a flow called andamento. The program works the same way. It blurs the picture to a smooth brightness F and finds at each point the direction that runs along its contours, perpendicular to the gradient. Where F is nearly flat the direction fades to a gentle slant, so rows go on across empty areas.

Seeds are tried in random order, first on a grid of spacing 1.05 tessera widths and then on a finer one. From a free seed a row grows both ways in steps of 1.03 tessera widths for as long as the next place is free, meaning no other tessera lies within 0.98 widths, and for at most 90 cubes. Each cube is a square of about 0.88 widths, turned to the direction of the row with a small random tilt. Cubes in the brightest places are gold, and where the picture has a sharp edge they are black. All others take the nearest of eight glass colours, or the picture’s own colour if you ask for it. A light edge and a dark edge on every cube make each look like a facet of glass.

$$
\mathbf d=\frac{w\,\hat{\mathbf t}+(1-w)\,\hat{\mathbf b}}{\big\lVert w\,\hat{\mathbf t}+(1-w)\,\hat{\mathbf b}\big\rVert},\qquad w=\operatorname{smoothstep}\big(0.003,\,0.03,\,\lVert\nabla F\rVert\big)
$$
_t̂ is the unit contour direction, b̂ a slight slant (0.3 rad) and w how strong the gradient is._

$$
\mathbf x_{n+1}=\mathbf x_n+1.03\,s\,\mathbf d(\mathbf x_n),\qquad \text{place only if } \min_j\lVert\mathbf x_{n+1}-\mathbf x_j\rVert\ge 0.98\,s
$$
_Growing a row of tesserae of size s._

$$
\text{gold if } L>1-0.5\,g-0.1+0.12\,(\xi-\tfrac12)
$$
_Gold in the light: g is the gold slider and ξ a random number per cube, so the edge of the gold is ragged._

### A short history

The mosaics of Ravenna, such as those in San Vitale (consecrated in 547) with the portraits of the emperor Justinian and the empress Theodora, and the mosaics of Constantinople, are among the best known in the world. Gold tesserae became common in Christian church decoration from around the fifth century. Mosaics later spread across the Byzantine, Islamic and Western worlds.

### Where it is used

- Church, mosque and public building decoration
- Floors, murals and pool tiles
- Portrait and pixel-style art
- Teaching craft and andamento

### Try it

- Lots of gold makes the light parts shine like a church apse. (https://lumenary-studio.vercel.app/style/byzantine-mosaic?gold=95&outline=70)
- Small tesserae give a fine, painterly portrait. (https://lumenary-studio.vercel.app/style/byzantine-mosaic?size=4&outline=30)
- Large tesserae show the row structure. (https://lumenary-studio.vercel.app/style/byzantine-mosaic?size=16&gold=30)

### Words worth knowing

- **Tessera:** A small cube of glass or stone used in a mosaic.
- **Andamento:** The flow of the rows in a mosaic.
- **Smalti:** Opaque coloured glass used for mosaic cubes.

### See also

- 93 Stained Glass
- 135 Voronoi Mosaic
- 71 Gold Foil

## 194  Shadow Puppet  ·  _still_

- **Comes from:** Java and Bali, China, India, Turkey
- **Around:** More than a thousand years
- **Works best on:** A dark figure in profile against a light background

### Why it looks this way

A shadow puppet is not looked at, it is looked through. The audience sits on the far side of a lit cloth and sees only what the figure blocks, so the maker draws with holes: rows of small punched openings let the lamp through and pick out a jewel, a fold or an eye. Held close to the cloth the shadow is sharp; drawn back, it softens and grows.

### How it works

1. Make everything darker than a threshold into one solid figure.
2. Lay a slanted lattice of points over the figure.
3. Punch a round hole wherever the figure is lighter than its surroundings, and in bands that follow its forms.
4. Cut slits along its strongest inner edges.
5. Blur the figure by its distance from the cloth.
6. Light a woven cloth from behind with one lamp, let a little colour through the hide, and add the rods.

### The mathematics

A shadow figure is everything darker than a threshold. As in the platform level, the threshold is found by rank: the blurred brightness values are sorted and the one at the chosen fraction is used, so the figure always covers the share of the frame the slider asks for. The pierced pattern is laid out on a slanted lattice. At each lattice point a round hole is punched if the figure there is lighter than its surroundings, or if it lies in one of the bands where the heavily blurred brightness passes set levels. Those bands follow the forms of the picture like the rows of chisel marks on a leather puppet. Slits are added along the strongest inner edges.

A puppet held away from the cloth throws a soft shadow, so the mask is blurred by a radius set by the distance slider. The cloth is lit from behind by one lamp: brightness falls off with distance from the lamp along an eased curve and is mapped through three colours, from a dark edge through a warm middle to a hot centre, with a fine weave and some unevenness. Where the mask is solid the cloth is almost black. Painted hide is translucent, so with the tint slider up a little of the lamp’s light comes through in the picture’s own colours.

$$
\theta=L_{(\lceil q\,N\rceil)},\qquad m=1-S_{\theta-0.015,\ \theta+0.015}(L_w)
$$
_The figure: θ is the brightness at rank qN among all pixels, L_w the blurred brightness._

$$
\text{hole at }(g_x,g_y)\iff L_f-L_m>0\ \ \text{or}\ \ \big\lvert\operatorname{frac}(k\,L_m)-\tfrac12\big\rvert<0.15
$$
_Punch rule at a lattice point: L_f is a fine blur, L_m a wide one, k between 5 and 11 bands._

$$
t=S_{0,1}\!\Big(1-\frac{\lvert\mathbf x-\mathbf x_{\text{lamp}}\rvert}{R}\Big),\qquad C=\operatorname{ramp}_{\text{edge}\to\text{warm}\to\text{hot}}(t)
$$
_The lit cloth; R is 62% of the frame’s diagonal._

### A short history

Shadow theatre is old across Asia. In Java and Bali, wayang kulit figures are cut from buffalo hide, pierced with fine chisels and painted, and a single puppeteer, the dalang, performs epics through the night by the light of an oil lamp; UNESCO recognised it in 2003. Chinese shadow puppetry flourished in the Song dynasty and uses translucent coloured hide. India has several leather puppet traditions, and Turkey has Karagöz.

### Where it is used

- Theatre and festival posters
- Storytelling and folklore illustrations
- Book covers and title cards
- Lantern and night market graphics

### Try it

- Dense piercing shows the chisel work. (https://lumenary-studio.vercel.app/style/shadow-puppet?holes=100&soft=10)
- Draw the figure back from the cloth for a large soft shadow. (https://lumenary-studio.vercel.app/style/shadow-puppet?soft=90&holes=30)
- Painted hide under a rose lantern glows with colour. (https://lumenary-studio.vercel.app/style/shadow-puppet?tint=90&cloth=rose)

### Words worth knowing

- **Wayang kulit:** The shadow puppet theatre of Java and Bali; kulit means skin or leather.
- **Dalang:** The puppeteer, who moves every figure, speaks every voice and leads the music.
- **Penumbra:** The soft outer part of a shadow, where the light is only partly blocked.

### See also

- 174 Chinese Paper Cut
- 173 Papel Picado
- 176 Batik

## 195  Greek Vase  ·  _still_

- **Comes from:** Ancient Greece: Corinth and Athens
- **Around:** Black-figure from about 700 BC, red-figure from about 530 BC
- **Works best on:** Pictures with strong shapes and clear dark or light figures

### Why it looks this way

Greek vase painters had no colours to mix, only one black glaze and the red of the clay. So every figure had to be a silhouette, and detail had to be scratched or drawn as line. That limit made the style: bold shapes, the profile view, and a border of repeating pattern to hold the picture in. A photograph pressed through it loses its shading and keeps its outline, which is what a silhouette is for.

### How it works

1. Lift the local contrast, then cut the picture into two tones at a level set by how much is to be painted.
2. In black-figure the dark shapes are glaze on bare clay; in red-figure the light shapes are the clay and the ground is glazed.
3. Scratch fine lines through the glaze to the clay for black-figure, or draw them in glaze on the clay for red-figure.
4. Add red and white over the glaze where the picture is warm or cool, as painters did for cloth and skin.
5. Draw a meander border above and below, shade the pot darker towards its sides, and age it with stains and cracks.

### The mathematics

The picture is first given a local contrast boost, T = l + 0.85 (l - l_bar), with l_bar a wide blur, after a small blur has taken out the grain. A threshold t, from 0.16 to 0.62 with the slider for how much is painted, cuts it in two with a soft edge of 0.035. For black-figure the glaze mask is G = smoothstep(t + 0.035, t - 0.035, T), the dark shapes; for red-figure it is 1 - smoothstep(1 - t - 0.035, 1 - t + 0.035, T), the ground. The mask is blurred and sharpened again with smoothstep(0.4, 0.6) so that outlines are smooth. The border is a row of meander hooks drawn as a stroked path on a separate canvas, and added to the mask.

The clay is a base colour times a mottling of fractal noise (plus or minus 10%), a fine grain and a slight darkening next to the glaze; the glaze is near black with a faint sheen of noise. Scratched lines are where the Sobel gradient of the brightness exceeds a limit that falls as the scratch slider rises, together with thin dark features; they are mixed in as clay colour inside the glaze for black-figure, and as glaze inside the clay for red-figure. For the added colours, the blurred picture is read where the glaze is: if its chroma is above 0.14 it is painted crimson where it is warmer than blue, and white where it is cooler. Finally the pot is shaded by 1 - 0.62 c s^2.3, where s is the distance from the centre line (0 to 1) and c the curve slider, with a soft highlight on the left, and aged by stains, a net of cracks from the edges of a cellular (Voronoi) pattern, and a few chips of bare clay.

$$
T=\ell+0.85\,(\ell-\bar\ell),\qquad G=\operatorname{smoothstep}(t+0.035,\ t-0.035,\ T)
$$
_Black-figure: the glaze mask G is where the boosted brightness T falls below the threshold t._

$$
\text{shade}=1-0.62\,c\,|2u-1|^{2.3}
$$
_The curve of the pot: u is the position across the picture (0 to 1) and c the curve slider._

$$
\text{crack}=1-\operatorname{smoothstep}\big(0.5\sigma,\ 1.5\sigma,\ 0.9\,(d_2-d_1)\big)
$$
_A net of cracks from a Voronoi pattern: d_1 and d_2 are the distances to the nearest and second nearest points, and sigma is the picture scale._

### A short history

Black-figure pottery began in Corinth about 700 BC and was perfected in Athens, where painters drew figures in a slip that turned black in a three-stage firing and scratched details through to the clay. Around 530 BC the Andokides Painter and his circle reversed it: red-figure left the figures the colour of the clay and painted the ground, so that details could be drawn with a brush. The meander, or Greek key, is a running hook pattern and among the oldest decorations of the Greek world.

### Where it is used

- Museum shop prints and book covers
- Packaging for olive oil, wine and food
- Tattoo and ceramic design
- Posters for classical events and plays

### Try it

- Red-figure on pale clay gives the crisp look of a classical vase painting. (https://lumenary-studio.vercel.app/style/greek-vase?mode=red&clay=pale)
- More painted area and strong scratching keep the details of a face. (https://lumenary-studio.vercel.app/style/greek-vase?figures=62&incise=85)
- Less age and no border make it a clean, modern pot design. (https://lumenary-studio.vercel.app/style/greek-vase?age=10&border=false)

### Words worth knowing

- **Black-figure:** A vase painting style in which figures are black glaze on the clay and details are scratched through it.
- **Red-figure:** A vase painting style in which figures are left the colour of the clay and the ground is painted black.
- **Meander:** A continuous line that turns back on itself in right angles, also called the Greek key.

### See also

- 192 Greek Meander
- 193 Byzantine Mosaic
- 197 Hala Blue Pottery

