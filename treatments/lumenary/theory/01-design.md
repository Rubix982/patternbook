# A. Design movements and styles

Source: https://lumenary-studio.vercel.app/theory/design (captured 2026-11-16 for private study).

Whole design languages laid over your picture. Each one brings its own palette, grid and furniture, like a small room from another decade.

## 01  Art deco  ·  _still_

- **Comes from:** Paris, then New York and Bombay
- **Around:** 1920s to 1940s
- **Works best on:** Portraits and buildings with clear light and dark shapes

### Why it looks this way

Art deco loved machines, speed and rich materials, so it drew with metal: strict symmetry, stepped outlines and lines that swell and thin like those on a banknote. Here brightness sets the thickness of each gold line, so the light parts of your picture become fat, gleaming metal and the dark parts shrink to hairlines. The picture is carried by line weight alone, which is exactly how an engraver works.

### How it works

1. Cover the page with fine horizontal bands, or with rays fanning out from a point below the picture in Sunburst mode.
2. Measure how bright the picture is along each band or ray.
3. Make the line thicker where it is bright and thinner where it is dark.
4. Fill every line with one metallic gradient laid across the whole page, so it reads as polished gold, silver or copper.
5. Add the stepped double frame, the corner fans and the title.

### The mathematics

Art deco’s signature is geometric ornament in metal. Two engraving techniques are available, both of which turn brightness into the thickness of a gold line rather than into tone. In “Lines” mode the picture is covered with horizontal bands; at every position along a band the band’s thickness is set by the brightness there, so bright areas get fat lines and dark areas hairlines, the technique of banknote engraving. The band is built as a polygon: along the top edge going right, then back along the bottom edge going left.

“Sunburst” does the same with rays fanning from a point below the picture. A ray is a direction; stepping along it samples brightness, and the ray’s width at distance r is capped at its angular share of the circle (so neighbouring rays never overlap) and shrunk by brightness. The metal is a five-stop gradient laid diagonally across the whole picture, which is what makes it read as polished gold, silver or copper. Frame ornament (double border, corner fans of three arcs and radial ticks, midpoint diamonds) is drawn with arcs and short lines, and the title is set in Bodoni with extra letter-spacing.

$$
w(x)=\text{step}\,\big(0.05+0.9\,L(x,y_c)^{0.9}\big)
$$
_Thickness of a line band at x; y_c is the band’s centre line._

$$
\hat{\mathbf d}_k=(\sin\alpha_k,\,-\cos\alpha_k),\quad\alpha_k=-\beta+\big(k+\tfrac12\big)\Delta\alpha,\quad\beta=82^{\circ}
$$
_Direction of ray k._

$$
w(r)=\min\!\Big(0.96\,\Delta\alpha\,r,\ \ \Delta\alpha\,r\,\big(0.05+0.9\,L^{0.9}\big)\Big)
$$
_Ray width at distance r from the origin: never wider than its slice Δα·r._

### A short history

The style takes its name from the 1925 Exposition internationale des arts décoratifs et industriels modernes in Paris. In the 1920s and 30s it spread through posters, cinemas, ocean liners and skyscrapers, and its stepped silhouettes and sunbursts still mark cities from New York to Mumbai. The thick and thin engraved lines used for the metal come from banknote and certificate printing, where fine line work was prized because it was hard to copy.

### Where it is used

- Invitations, cocktail menus and cinema style posters
- Luxury packaging and perfume labels
- Hotel and restaurant branding with a period feel
- Themed party graphics and film title cards

### Try it

- Switch to Sunburst for a poster that glows upward from the bottom edge. (https://lumenary-studio.vercel.app/style/art-deco?mode=rays)
- Raise the line count and choose silver for a finer, cooler engraving. (https://lumenary-studio.vercel.app/style/art-deco?density=140&metal=silver)
- Turn the frame off to see the engraving on its own. (https://lumenary-studio.vercel.app/style/art-deco?frame=false)

### Words worth knowing

- **Engraving:** A way of printing in which the picture is cut into metal as lines. Thicker lines carry more ink or, here, more metal.
- **Sunburst:** Rays fanning from a single point, a favourite deco motif for rising suns and radio waves.
- **Stepped frame:** A border whose corners climb in steps, like the silhouette of a ziggurat or a skyscraper.

### See also

- 15 Victorian
- 02 Bauhaus
- 07 Retro

## 02  Bauhaus  ·  _still_

- **Comes from:** Weimar, Dessau and Berlin
- **Around:** 1919 to 1933
- **Works best on:** Bold scenes with a clear subject and simple shapes

### Why it looks this way

The Bauhaus school wanted design to start from the plainest forms: square, circle, triangle, and the primary colours. This treatment applies that idea to a photograph. Each tile of the picture is swapped for one simple shape, and tone is told by how much of the tile the shape fills, so a dark patch is a solid square and a bright one is a small dot.

### How it works

1. Cut the picture into a grid of square tiles.
2. Measure the average brightness of each tile.
3. Pick a shape from brightness: square, quarter circle, half circle, circle or dot, from darkest to lightest.
4. Pick a colour from the tile’s hue: red, yellow or blue, with black and paper for the extremes.
5. Turn each curved shape to follow the nearest edge in the picture.

### The mathematics

The picture is cut into square tiles, and each tile is replaced by one geometric shape, as in a Bauhaus poster. The shape depends on brightness in five bands: darkest tiles become full squares, then quarter circles, half circles, circles, and the lightest a small dot, so tone is carried by how much of the tile the shape fills. The colour depends on hue: reds become red, yellows and greens become yellow, everything else blue; very dark tiles are black, and low-saturation tiles are black, paper or blue by brightness.

The orientation of a quarter or half circle follows the picture’s own edges. The Sobel gradient at the tile gives a direction, and that direction is quantised into one of four quadrants, so the curves lean along contours. The variation slider reassigns some tiles at random using a generator seeded from the tile’s index and the seed, so “Shuffle” gives another reproducible design and the same seed always gives the same poster.

$$
\text{shape}=\begin{cases}\text{square}&L<0.22\\ \text{quarter}&L<0.45\\ \text{half}&L<0.66\\ \text{circle}&L<0.84\\ \text{dot}&\text{otherwise}\end{cases}
$$
_Shape by brightness band._

$$
\text{corner}=\Big\lfloor\frac{\operatorname{atan2}(g_y,g_x)+\pi}{2\pi}\cdot4\Big\rfloor\bmod 4
$$
_Quarter-turn orientation from the edge direction at the tile._

### A short history

Walter Gropius founded the Bauhaus in Weimar in 1919. It moved to Dessau in 1925 and to Berlin in 1932, and it closed in 1933 under political pressure. Teachers such as Wassily Kandinsky, Paul Klee, László Moholy-Nagy and Josef Albers shaped its ideas about form and colour. Kandinsky is remembered for asking which colour belongs to which basic shape, and his answer, yellow triangle, red square, blue circle, still echoes in posters today.

### Where it is used

- Poster and book cover layouts
- Brand identity systems built from a few shapes
- Wayfinding and icon design
- Tile, textile and wallpaper patterns

### Try it

- Use more tiles for a sharper portrait, in a single colour family. (https://lumenary-studio.vercel.app/style/bauhaus?tiles=32&palette=mono)
- Go coarse for a bold, almost abstract poster in dusk colours. (https://lumenary-studio.vercel.app/style/bauhaus?tiles=10&palette=dusk)
- Set variation to zero to see the pure rule with no random swaps. (https://lumenary-studio.vercel.app/style/bauhaus?variation=0)

### Words worth knowing

- **Primary colours:** Red, yellow and blue, the three from which painters traditionally mix the rest.
- **Quarter circle:** A quarter of a disc, drawn in one corner of a tile. Four orientations are possible.
- **Quantise:** To snap a smooth value, such as an edge direction, to one of a few allowed choices.

### See also

- 19 Mondrian
- 18 Memphis
- 12 Swiss Design

## 03  Neo-brutalism  ·  _still_

- **Comes from:** Web and app design
- **Around:** Early 2020s onward
- **Works best on:** Punchy subjects with strong shapes, such as products and portraits

### Why it looks this way

Neo-brutalism borrows the honesty of raw concrete architecture: nothing is hidden, nothing is blurred. Thick black outlines, flat colour and a shadow that is simply a second black rectangle make the picture look like a sticker pressed onto a page. It is loud on purpose, and it stays readable at any size.

### How it works

1. Crop the picture to fill a window, keeping the centre.
2. Blur it a little and measure brightness.
3. Cut the brightness into a few equal bands and give each band one flat colour.
4. Find edges and draw them as thick black outlines.
5. Draw a black rectangle offset behind the card as the hard shadow, then add the optional title bar.

### The mathematics

Neo-brutalism is flat colour, thick black borders and shadows that do not blur. The picture is first cropped to fill a window (the larger of the width and height ratios decides the scale, and the centre is kept), then blurred and measured for brightness. The brightness range is cut into n equal bands and each band is given one colour from a bright palette, so the picture becomes a poster of flat colour regions, with colours spread evenly through the palette.

Black outlines come from Sobel again, here with a harder smoothstep so lines are crisp, and a heavier weight meaning a wider neighbourhood. The card sits on a plain coloured background, with a black rectangle of the same size drawn offset by the shadow distance, with no blur at all, which is the whole of the “hard shadow”. A title bar with three flat squares and a title, drawn in the same black as the borders, is optional chrome. Border width and shadow offset are tied to the picture width, so the look is the same at any export size.

$$
\text{band}=\min\big(n-1,\ \lfloor L\cdot n\rfloor\big),\qquad C=P\!\left[\operatorname{round}\!\Big(\tfrac{\text{band}}{n-1}(m-1)\Big)\right]
$$
_Pick one of m palette colours P for each of n brightness bands._

$$
e=S_{\theta,1.25\theta}(\lvert\nabla L_b\rvert),\quad\theta=0.34-0.27\cdot\text{ink},\qquad C_{\text{out}}=(1-e)\,C+e\,C_{\text{black}}
$$
_Black outline strength e._

$$
k=\max\!\Big(\frac{w}{W},\frac{h}{H}\Big),\qquad\text{source rect}=\Big(\tfrac{w}{k},\tfrac{h}{k}\Big)\ \text{centred}
$$
_Cover-crop of the picture into a w × h window._

### A short history

The name comes from brutalism, the mid twentieth century architecture of exposed concrete (from the French béton brut, raw concrete). Brutalist web design appeared in the mid 2010s as a reaction to polished, identical templates. Neo-brutalism softened it with bright colours and friendly shapes and became a popular look for apps and landing pages in the early 2020s.

### Where it is used

- Landing pages and app interface kits
- Sticker, zine and poster graphics
- Indie product launches
- Social posts that need to stand out in a feed

### Try it

- Fewer colour blocks and heavier lines give a poster feel. (https://lumenary-studio.vercel.app/style/neo-brutalism?levels=3&weight=5)
- Candy colours on a pink backdrop read as playful rather than harsh. (https://lumenary-studio.vercel.app/style/neo-brutalism?palette=candy&bg=pink)
- Push the shadow to the maximum for a very dimensional card. (https://lumenary-studio.vercel.app/style/neo-brutalism?shadow=100)

### Words worth knowing

- **Hard shadow:** A shadow with no blur, drawn as a solid offset copy of the shape.
- **Posterise:** To reduce a picture to a few flat tones.
- **Brutalism:** An architectural style of raw, unfinished concrete surfaces.

### See also

- 09 Pop Art
- 22 Vector Art
- 21 Comic book

## 04  Minimalism  ·  _still_

- **Comes from:** Art and design in Japan, Germany and the United States
- **Around:** 1950s to 1970s, and still current
- **Works best on:** Pictures with one clear subject and a calm background

### Why it looks this way

Minimalism asks what can be left out. Reducing a picture to two to five flat tones removes texture and detail and leaves only the structure, while the empty margin lets the shapes breathe. The lightest tone is the colour of the paper, so the brightest parts of the picture simply dissolve into the page.

### How it works

1. Blur the picture so that fine texture cannot leave stray specks.
2. Stretch brightness to use the full range, from the darkest to the lightest value that is actually present.
3. Cut the stretched brightness into a few equal bands.
4. Give each band one flat colour, found by walking from the ink colour to the paper colour.
5. Optionally swap one mid tone for a single accent colour, and leave an empty margin all round.

### The mathematics

Minimalism here is a posterise with a lot of room around it. The picture is blurred first, so that fine texture cannot create stray specks, then its brightness is stretched to use the whole range from the darkest to the lightest value actually present. Without that stretch a dull, low-contrast photograph would collapse into one or two tones.

The stretched brightness is cut into n equal bands, and each band is assigned one flat colour, found by walking in a straight line from the ink colour to the paper colour. The lightest band is paper, so it simply disappears into the margin. The accent option swaps one mid-tone for a single colour, which is the only colour on the page.

$$
v=\operatorname{clamp}\!\left(\frac{L_b-L_{\min}}{\max(0.05,\;L_{\max}-L_{\min})}\right)
$$
_Blurred brightness stretched to 0 to 1._

$$
C_i=\mathrm{ink}+\frac{i}{n-1}\,(\mathrm{paper}-\mathrm{ink}),\qquad i=\min\big(n-1,\ \lfloor v\,n\rfloor\big)
$$
_The colour of band i, on the line from ink to paper._

### A short history

Minimal art appeared in the United States in the 1960s with artists such as Donald Judd, Agnes Martin and Frank Stella. In design the roots run deeper: the architect Mies van der Rohe is famous for the phrase “less is more”, the industrial designer Dieter Rams for “less, but better”, and Japanese aesthetics for ma, the idea that empty space is itself part of the work.

### Where it is used

- Wall prints and gallery style posters
- Portfolio and presentation images
- Book and album covers
- Calm backgrounds for websites

### Try it

- Use only two tones for the starkest possible version. (https://lumenary-studio.vercel.app/style/minimalism?tones=2&scheme=ink)
- Add one accent colour and watch it become the focus. (https://lumenary-studio.vercel.app/style/minimalism?accent=true)
- Widen the margin and soften the shapes for a quiet, paper-print look. (https://lumenary-studio.vercel.app/style/minimalism?margin=30&soften=60)

### Words worth knowing

- **Negative space:** The empty area around and between shapes. In minimalism it is as important as the shapes.
- **Contrast stretch:** Rescaling brightness so that the darkest pixel becomes black and the lightest becomes white.
- **Posterise:** To reduce a picture to a few flat tones.

### See also

- 12 Swiss Design
- 22 Vector Art
- 19 Mondrian

## 05  Maximalism  ·  _still_

- **Comes from:** Baroque and rococo ornament, revived in postmodern design
- **Around:** 1960s onward
- **Works best on:** Busy scenes with a wide range of tones

### Why it looks this way

Maximalism is the opposite of minimalism: it fears empty space, an urge sometimes called horror vacui. So every tone of the picture is given a loud colour pair and its own pattern, and even the border is packed with beads. The picture survives because tone still decides which colour is on top, so the shapes stay readable inside the noise.

### How it works

1. Cut the brightness of the picture into a few bands.
2. Give each band two colours that sit far apart on the colour wheel.
3. Choose a pattern for each band: stripes, checks, dots, waves, diagonals or diamonds, never the same for two neighbours.
4. At every pixel let the pattern decide which of the band’s two colours shows.
5. Frame the whole thing with a border of beads.

### The mathematics

Maximalism refuses to leave anything empty. The brightness (with a little extra contrast) is cut into n bands. Each band gets two colours that are far apart on the colour wheel, and a repeating pattern decides, pixel by pixel, which of the two shows: stripes, checks, dots, waves, diagonals or diamonds. Neighbouring bands use different patterns, so the picture is drawn entirely out of clashing textures.

The colours are spread round the wheel in equal steps and then moved by the seed, so the remix button changes the whole scheme but keeps the structure. Darker bands are also darker colours. A border of alternating beads, each with a pale centre, frames the whole thing.

$$
h_i=\left(h_0+0.92\,\frac{i}{n}+0.137\,\text{seed}\right)\bmod 1,\qquad h_i'=h_i+0.38
$$
_Hue of the two colours of band i._

$$
\text{stripe}(x,y)=\left\lfloor\frac{x+y}{s}\right\rfloor\bmod 2,\qquad \text{check}(x,y)=\left(\left\lfloor\frac{x}{s}\right\rfloor+\left\lfloor\frac{y}{s}\right\rfloor\right)\bmod 2
$$
_Two of the seven pattern functions. The pattern value picks one of the two colours._

### A short history

The architect Robert Venturi answered Mies van der Rohe’s “less is more” in 1966 with “less is a bore”, a line often used to introduce maximalism in design. The taste itself is much older: baroque churches, Victorian parlours and Indian block-printed textiles all cover every surface. In the 1980s the Memphis group made it playful, and it has returned in fashion and interiors several times since.

### Where it is used

- Festival and music posters
- Textile, wrapping paper and wallpaper prints
- Album art and book covers
- Mood boards for bold interiors

### Try it

- Seven bands with a small pattern size gives the busiest result. (https://lumenary-studio.vercel.app/style/maximalism?bands=7&scale=10)
- Turn the whole palette half way around the colour wheel. (https://lumenary-studio.vercel.app/style/maximalism?hue=180)
- Raise colour punch to the maximum for neon intensity. (https://lumenary-studio.vercel.app/style/maximalism?punch=100)

### Words worth knowing

- **Horror vacui:** Latin for fear of empty space: the urge to fill every part of a surface.
- **Complementary colours:** Colours opposite each other on the wheel, which look strongest side by side.
- **Band:** A slice of the brightness range that is treated as one tone.

### See also

- 18 Memphis
- 09 Pop Art
- 14 Bohemian

## 06  Futuristic  ·  _still_

- **Comes from:** Aircraft cockpits and science fiction film
- **Around:** Mid 20th century onward
- **Works best on:** Dark scenes with a clear bright subject

### Why it looks this way

A heads-up display is meant to show data without hiding the world, so it is mostly dark with a few glowing marks. This treatment keeps the shadows deep and lets only the highlights glow, then it adds the furniture of an instrument: a grid, brackets, a reticle and a readout. Together they make an ordinary picture look as if it has been measured.

### How it works

1. Map brightness through a ramp from near black through deep blue to the chosen tint and almost white.
2. Blur the brightness heavily and find the single brightest region, so that one hot pixel cannot win.
3. Draw rings, tick marks and a crosshair on that target.
4. Print the target’s position and brightness in a readout.
5. Find edges and draw them as glowing lines, with a faint grid and corner brackets on top.

### The mathematics

The picture becomes a heads-up display. Brightness is mapped through a five-stop ramp, from near-black through deep blue to the chosen tint and finally almost white, so the darkest areas stay dark and only the highlights glow. A faint grid and brackets in the corners sit on top.

The brightest region is found on purpose: the brightness is blurred heavily (radius one fortieth of the width) so that a single hot pixel cannot win, and the position of the maximum becomes the target. Concentric rings, tick marks and a crosshair are drawn there, and the readout prints the target’s position as fractions of the width and height together with its brightness. Edges are found with the Sobel pipeline and drawn as glowing lines.

$$
(t_x,t_y)=\operatorname*{arg\,max}_{x,y}\;(L*B_r)(x,y),\qquad r=\frac{W}{40}
$$
_The target is the maximum of the blurred brightness._

$$
\text{readout}=\left(\frac{t_x}{W},\ \frac{t_y}{H},\ 100\,L_b(t)\right)
$$
_What the X, Y and LUM numbers show._

### A short history

Heads-up displays were developed for military aircraft in the middle of the twentieth century so that pilots could read their instruments without looking down. Cinema borrowed the idea to suggest advanced machines and artificial senses, and today the same look appears in game interfaces and in real cars and phones.

### Where it is used

- Science fiction concept art and film titles
- Game interface mock-ups
- Technology event visuals
- Dashboards styled as scanners

### Try it

- Amber turns the scan into a warning screen. (https://lumenary-studio.vercel.app/style/futuristic?tint=amber)
- Push the outline glow to the maximum and drop the grid for a cleaner wireframe. (https://lumenary-studio.vercel.app/style/futuristic?edges=100&grid=false)
- Rename the label to make it your own scan. (https://lumenary-studio.vercel.app/style/futuristic?title=SCAN+0001)

### Words worth knowing

- **HUD:** Heads-up display: information drawn over the view in front of you.
- **Reticle:** The crosshair or ring used to mark a target.
- **Sobel edge:** A way of measuring how quickly brightness changes, which is large at edges.

### See also

- 08 Cyberpunk
- 27 Blueprint
- 36 Thermal Camera

## 07  Retro  ·  _still_

- **Comes from:** Seventies print and packaging
- **Around:** 1970s
- **Works best on:** Warm outdoor scenes and portraits

### Why it looks this way

Seventies colour was warm and earthy: harvest gold, burnt orange, avocado and brown. Limited inks also meant flat colour layers, so this treatment cuts the picture into a few bands, one ink each, and lets the edges between them wobble the way imperfectly aligned screen prints do. The cream border and stripes finish the sense of a printed object.

### How it works

1. Pick the palette and thin it to the number of bands you asked for.
2. Add a tiny ordered offset to each pixel so that band edges come out slightly ragged.
3. Cut the brightness, with adjustable contrast, into bands and print one colour per band.
4. Draw the three swooping stripes and add film grain.
5. Cut a rounded hole from a cream rectangle for the border.

### The mathematics

This is a 1970s screen print. A palette of six warm colours is thinned to n of them, evenly spaced, and the brightness (with adjustable contrast) is cut into n bands, one colour per band. Real screen prints never register perfectly, so before the cut a tiny ordered offset is added to each pixel. It breaks the edge between bands into a slightly ragged line instead of a ruler-straight one.

Three swooping stripes, a layer of film grain and a cream border with rounded corners finish the look. The border is a rectangle with a rounded hole cut out of it, filled with the even-odd rule.

$$
d(x,y)=0.045\left(\frac{4\,(x\ \&\ 3)+(y\ \&\ 3)}{16}-\tfrac12\right)
$$
_Ordered offset from a 4 × 4 pattern; & 3 keeps the low two bits._

$$
\text{band}=\operatorname{clamp}\big(\lfloor (c(L)+d)\,n\rfloor,\ 0,\ n-1\big)
$$
_c(L) is the brightness after the contrast slider._

### A short history

Screen printing became a major commercial process in the first half of the twentieth century and was taken up by artists such as Andy Warhol in the 1960s. In the 1970s it filled posters, record sleeves and packaging with earth-toned flat colour, and that palette is now shorthand for the decade.

### Where it is used

- Vintage style posters and flyers
- Record sleeves and playlist art
- Café menus and packaging
- Nostalgic social posts

### Try it

- Avocado with four bands is the classic kitchen-wall look. (https://lumenary-studio.vercel.app/style/retro?palette=avocado&bands=4)
- Push the grain up for a worn paper feel. (https://lumenary-studio.vercel.app/style/retro?grain=100)
- Try denim blue without the stripes for a calmer print. (https://lumenary-studio.vercel.app/style/retro?palette=denim&swoosh=false)

### Words worth knowing

- **Registration:** How well the separate colour layers of a print line up with each other.
- **Screen print:** Printing by pushing ink through a stencilled mesh, one colour at a time.
- **Even-odd rule:** A way of deciding which parts of a shape are inside it, used here to cut the frame’s hole.

### See also

- 09 Pop Art
- 17 Vaporwave
- 81 Risograph

## 08  Cyberpunk  ·  _still_

- **Comes from:** Science fiction novels and film
- **Around:** 1980s onward
- **Works best on:** Night scenes, street photography and portraits

### Why it looks this way

Cyberpunk pairs advanced technology with worn-out streets, and its look is neon on wet darkness. The colours here are split: shadows lean towards one neon and highlights towards another, with a hot white at the very top. Edges glow with a slight colour fringe, and rain, scanlines and a flickering sign supply the mood.

### How it works

1. Map brightness through a five stop ramp: black, the first neon, the second neon, a hot highlight.
2. Draw two edge maps as glowing lines, a fine one and a wide one, offset by a fraction of a pixel so they fringe.
3. Scatter a few hundred short slanted strokes as rain.
4. Shift some thin horizontal bands sideways for the glitch, and darken every third row for scanlines.
5. Draw the sign text three times: a wide blur, a narrow blur, then sharp white.

### The mathematics

The base is a duotone-plus: a five-stop ramp from black through the first neon, the second neon and a hot highlight. Two edge maps are then drawn as glowing lines, a fine one in the second neon and a wider one in the first, offset by a fraction of a pixel so they never quite overlap, which gives the lines a coloured fringe.

Rain is a few hundred short slanted strokes of random length and transparency. The glitch shifts some thin horizontal bands sideways by copying their pixels. Scanlines darken every third row. The neon sign is the same text drawn three times, with a wide blur, a narrow blur and finally sharp white, and it sometimes flickers.

$$
C=\operatorname{ramp}\!\big(L^{0.9};\ \text{black},\ 0.35A,\ A,\ B,\ C_{\mathrm{hi}}\big)
$$
_Brightness through the five-stop ramp._

$$
\text{row } y \text{ darkened by } 18\% \ \text{ when }\ y \bmod 3=0
$$
_The scanline rule._

### A short history

The word came from Bruce Bethke’s 1983 short story “Cyberpunk”. William Gibson’s novel Neuromancer followed in 1984, and the film Blade Runner (1982) had already given the genre its rain-soaked neon skyline. Games and anime later turned the look into a whole visual language.

### Where it is used

- Game and film poster art
- Music visuals and album covers
- Tech event flyers
- Streaming overlays and avatars

### Try it

- Acid colours with extra glow look like a club at 3 a.m. (https://lumenary-studio.vercel.app/style/cyberpunk?scheme=acid&glow=90)
- Maximum rain with no glitch keeps the picture clean and wet. (https://lumenary-studio.vercel.app/style/cyberpunk?rain=100&glitch=0)
- Change the sign to your own shop name. (https://lumenary-studio.vercel.app/style/cyberpunk?text=OPEN+LATE)

### Words worth knowing

- **Split toning:** Giving shadows one colour and highlights another.
- **Glow:** Light that appears to spread past the edge of a bright shape.
- **Chromatic fringe:** A coloured edge caused by layers of different colours sitting a hair apart.

### See also

- 17 Vaporwave
- 31 Glitch
- 29 Retro VHS
- 06 Futuristic

## 09  Pop Art  ·  _still_

- **Comes from:** Britain and the United States
- **Around:** 1950s and 1960s
- **Works best on:** Faces and strong silhouettes

### Why it looks this way

Pop art borrowed the look of mass printing: flat inks, bold outlines and the dots that cheap presses used to fake shading. Dots that grow as the tone gets darker let a few flat inks suggest smooth shading, and the 2 × 2 grid repeats the picture in different colours, the way a screen printer pulls the same image in several editions.

### How it works

1. Divide brightness into a few bands and print each in one flat ink.
2. Near the boundary with the next band, show the next ink as dots that grow as the pixel approaches it.
3. Place the dots on a staggered grid, every second column shifted by half a cell.
4. Draw outlines from edge strength in the darkest ink.
5. In grid layout, repeat the picture four times with a different set of inks in each panel.

### The mathematics

Pop art comes from comic printing. The brightness is divided into n bands and each band is printed in one flat ink. To soften the jump from one band to the next, the Ben-Day trick is used: inside a band, the next ink appears as dots that grow as the pixel gets closer to the next band, just as a printer’s dots grow in a darker tint.

The dots sit on a staggered grid (every second column is shifted by half a cell). A dot’s radius is proportional to how far through the band the pixel is. Outlines come from the edge strength with a threshold, drawn in the darkest ink. The grid layout repeats the picture four times in a 2 × 2 panel with a different set of inks for each, the way Warhol did.

$$
u=n\,c(L),\qquad b=\min(n-1,\lfloor u\rfloor),\qquad f=u-b
$$
_Band b and the position f (0 to 1) inside it._

$$
\text{dot}:\ \ (x_c)^2+(y_c)^2<\big(0.72\,s\,f\big)^2
$$
_A pixel is inside a dot of the next ink when its distance from the cell centre is less than 0.72·s·f._

$$
\lvert\nabla L\rvert>0.35-0.28\cdot\text{outline}
$$
_Where the outline ink replaces everything else._

### A short history

Pop art began in Britain in the 1950s, for example in Richard Hamilton’s 1956 collage about the modern home, and flourished in the United States in the 1960s. Roy Lichtenstein enlarged the dots of comic printing into paintings, and Andy Warhol repeated screen-printed celebrity faces in grids. The dot method is named after Benjamin Day, a nineteenth century printer.

### Where it is used

- Poster and merchandise graphics
- Album covers and profile portraits
- Party invitations
- Editorial illustration

### Try it

- A single panel with big dots looks like a Lichtenstein enlargement. (https://lumenary-studio.vercel.app/style/pop-art?layout=single&dotSize=14)
- Three inks and a strong outline give a bolder, simpler print. (https://lumenary-studio.vercel.app/style/pop-art?levels=3&outline=90)
- Tiny dots at full strength read almost like a photograph. (https://lumenary-studio.vercel.app/style/pop-art?dots=100&dotSize=5)

### Words worth knowing

- **Ben-Day dots:** A pattern of evenly spaced dots whose size changes to suggest tone.
- **Halftone:** Any method of showing tone with dots of different sizes.
- **Staggered grid:** A grid whose alternate rows or columns are shifted by half a step.

### See also

- 21 Comic book
- 07 Retro
- 03 Neo-brutalism

## 10  Editorial  ·  _still_

- **Comes from:** Magazine publishing
- **Around:** Late 19th century onward
- **Works best on:** Portraits and strong single subjects, portrait orientation

### Why it looks this way

A magazine cover is a small problem in hierarchy: one image, one masthead, and a few short lines that must be readable over anything. This treatment solves it the way a layout program would. It darkens the top and bottom so white type stays legible, stretches the masthead to the exact page width, and wraps the headline to fit.

### How it works

1. Fill the page with the photograph, optionally in monochrome or a warm sepia tone computed in code.
2. Add dark gradients at the top and bottom so type stays readable.
3. Measure the masthead and scale it so it spans the page.
4. Wrap the headline on spaces, shrinking the type by ten percent until it fits in three lines.
5. Place the issue line, the cover lines and a decorative barcode.

### The mathematics

The cover is built like a layout program would build it. The photograph fills the page; for the monochrome and warm options its pixels are first converted in code (a weighted grey with extra contrast, or a mix of the original and a sepia colour matrix), so the result does not depend on browser filters. Dark gradients at the top and bottom keep the white type readable whatever the picture is.

The masthead is measured and scaled so that it spans exactly the width of the page. The headline is wrapped greedily on spaces; if it needs more than three lines the type shrinks by 10% until it fits. The barcode is a run of bars with random widths from a fixed seed, so it is the same every time.

$$
\begin{aligned}R'&=0.393R+0.769G+0.189B\\G'&=0.349R+0.686G+0.168B\\B'&=0.272R+0.534G+0.131B\end{aligned}
$$
_The sepia colour matrix. The warm option blends 45% of it with the original colour._

$$
s=\min\!\Big(19u,\ \frac{0.88\,W}{w_{100}}\cdot 100\Big)
$$
_Masthead size s: w₁₀₀ is the measured width of the word at size 100, and u is one percent of the shorter side._

### A short history

Illustrated magazine covers developed through the late nineteenth century, and by the 1920s titles such as Time and Vogue had settled on the formula of a strong image under a recognisable masthead. The barcode on covers came later: the first product scanned with a barcode was a pack of chewing gum in 1974. The barcode here is only for decoration, since its bar widths are random.

### Where it is used

- Portfolio and personal brand mock-ups
- Newsletter and report covers
- “Cover story” posts for birthdays and milestones
- School and community magazines

### Try it

- Monochrome with a quiet accent is the serious, fashion-magazine look. (https://lumenary-studio.vercel.app/style/editorial?tone=mono&accent=d4b24c)
- Warm tone and a new headline make a travel cover. (https://lumenary-studio.vercel.app/style/editorial?tone=warm&headline=Golden+hour)
- Strip it back to the masthead and photograph only. (https://lumenary-studio.vercel.app/style/editorial?lines=false&barcode=false)

### Words worth knowing

- **Masthead:** The title of a magazine at the top of its cover.
- **Cover lines:** The short teasers printed around the main image.
- **Greedy wrapping:** Filling each line with as many words as fit, then starting a new line.

### See also

- 55 Newspaper
- 12 Swiss Design
- 20 Constructivist

## 11  Y2K  ·  _still_

- **Comes from:** Consumer electronics and early web design
- **Around:** Late 1990s to early 2000s
- **Works best on:** Bright, friendly scenes and portraits

### Why it looks this way

Around the year 2000, computers were meant to look like candy. Translucent plastic, glossy buttons, chrome and sparkles all say optimism about the digital future. This treatment recreates that with a pale colour ramp, a curved white highlight like light on plastic, and four-pointed sparkles placed where the picture is bright.

### How it works

1. Map brightness through the colour ramp of the chosen scheme, with a gentle curve that lifts the shadows.
2. Fade a white highlight in from the top over a curved edge, like light on glossy plastic.
3. Scatter sparkles by trying random points and keeping the ones where the picture is bright enough.
4. Draw each sparkle as a four-pointed star with a soft glow.
5. Optionally set everything in a brushed-metal window with a title bar and three round buttons.

### The mathematics

Y2K design is glossy, pale and slightly translucent. Brightness goes through a colour ramp for the chosen scheme (with a gentle power curve that lifts the shadows), a white highlight fades from the top over a curved edge like light on plastic, and sparkles are scattered where the picture is bright. A sparkle is a four-pointed star, drawn with a soft white glow.

The optional window is a rectangle with a rounded hole cut into a brushed-metal gradient, a title bar in two of the scheme’s colours and three traffic-light buttons. Sparkle positions are chosen by trying random points and keeping those where the brightness beats a randomised threshold between 0.62 and 0.87.

$$
C=\operatorname{ramp}\!\big(L^{0.85};\ \text{scheme stops}\big)
$$
_Brightness through the scheme’s colour ramp._

$$
\text{keep a sparkle at }(x,y)\ \text{if}\ L(x,y)>0.62+0.25\,\xi,\quad \xi\sim U(0,1)
$$
_Rejection sampling: random points are kept only on bright places._

### A short history

The look grew from products such as the 1998 iMac G3 in translucent colours, glossy operating-system interfaces of the early 2000s, and the metallic, bubbly graphics of pop music and early websites. It disappeared under flat design in the 2010s and returned as nostalgia in the 2020s.

### Where it is used

- Nostalgic social posts
- Cover art for pop releases
- Fashion lookbooks and mood boards
- Themed party graphics

### Try it

- Candy pink with extra sparkles is pure 2001. (https://lumenary-studio.vercel.app/style/y2k?scheme=candy&sparkles=90)
- Chrome and maximum gloss look like a liquid metal sticker. (https://lumenary-studio.vercel.app/style/y2k?scheme=chrome&gloss=100)
- Drop the window to use the picture as a clean cover. (https://lumenary-studio.vercel.app/style/y2k?window=false)

### Words worth knowing

- **Gloss highlight:** A bright curved band near the top of a shape that suggests a shiny surface.
- **Brushed metal:** A metal finish with fine parallel scratches, imitated here with a gradient.
- **Bevel:** A sloped edge, drawn with a light and a dark side.

### See also

- 17 Vaporwave
- 29 Retro VHS
- 58 Glassmorphism

## 12  Swiss Design  ·  _still_

- **Comes from:** Zurich and Basel
- **Around:** 1940s to 1960s
- **Works best on:** Strong, simple compositions with a clear tonal range

### Why it looks this way

Swiss designers believed that a clear grid and honest photography could communicate more than decoration. So the page here is built on a six column grid, the picture is rendered as a plain line screen of black bars, and a single red shape and heavy sans-serif title do all the rest. Everything lines up, and nothing is there by accident.

### How it works

1. Set a six column grid and place the picture across columns two to six.
2. Draw the picture as horizontal rows of thin vertical bars, whose height is the local darkness.
3. Let bright areas have no bars and dark areas fill the row.
4. Place one red shape across the picture’s edge.
5. Set the title flush left at the size that spans the picture, with small text, a rule and a page number on the same grid.

### The mathematics

Swiss design is built on a grid, and this treatment puts the photograph on one. The page has a six-column grid; the picture takes columns two to six in the upper part. It is drawn as a line screen: a set of horizontal lines, each one a row of thin vertical bars whose height is the local darkness. Bright areas have no bars and dark areas fill the row, so the picture is made only of straight black marks.

One red shape straddles the edge of the picture. The title is set in a heavy sans-serif, flush left on the margin, at the size that makes it span the picture’s width; small lines of set text, a rule and a page number are placed on the same grid.

$$
h(x,y_i)=0.98\,\big(1-L(x,y_i)\big)\,\Delta y,\qquad \Delta y=\frac{h_{\text{img}}}{N_{\text{lines}}}
$$
_Height of the bar at column x on line i; the lines are Δy apart._

$$
s=\min\!\Big(24u,\ \frac{0.98\,(w_{\text{img}}+c)}{w_{100}}\cdot100\Big)
$$
_Title size: c is the column width and w₁₀₀ the title’s measured width at size 100._

### A short history

The International Typographic Style grew in Switzerland in the 1940s and 50s through designers such as Josef Müller-Brockmann, Armin Hofmann and Emil Ruder. The typeface Helvetica appeared in 1957, and the journal Neue Grafik spread the ideas worldwide. Its principles, grid, sans-serif type and objective photography, still underpin much of modern graphic design.

### Where it is used

- Exhibition and conference posters
- Museum and event identities
- Annual reports and book layouts
- Portfolio covers

### Try it

- A red square instead of a circle changes the whole balance. (https://lumenary-studio.vercel.app/style/swiss-design?shape=square)
- Fewer lines make a coarser, more graphic picture. (https://lumenary-studio.vercel.app/style/swiss-design?lines=60)
- Turn on the black ground for a night edition. (https://lumenary-studio.vercel.app/style/swiss-design?invert=true)

### Words worth knowing

- **Grid:** An invisible set of columns and rows that every element is aligned to.
- **Flush left:** Text lined up on its left edge, with a ragged right edge.
- **Line screen:** A way of printing tone as lines whose thickness changes.

### See also

- 19 Mondrian
- 20 Constructivist
- 04 Minimalism

## 13  Surreal  ·  _still_

- **Comes from:** Paris, 1920s and 30s
- **Around:** 1924 onward
- **Works best on:** Landscapes and interiors with clear horizontal structure

### Why it looks this way

Surrealist painters took familiar things and bent their rules, as in a dream. Here the rule that bends is solidity: the whole picture slides downward like warm wax, more at the bottom, and a pale second sun hangs in a tinted sky. Because the melting varies smoothly from side to side, the drips look organic instead of random.

### How it works

1. For every pixel, read the colour from a point higher up in the original, so the picture appears to slide down.
2. Let the slide grow towards the bottom of the picture.
3. Vary the slide from column to column using smooth value noise, with the drip width setting the noise scale.
4. Tint the colours towards a dream grade, more at the top than the bottom.
5. Draw a pale second sun with a halo and faint reflection, and a few flat-bottomed clouds.

### The mathematics

The picture melts. Every pixel is drawn from a point higher up in the original, so the image appears to slide downwards, and the slide grows towards the bottom. How far a column slides varies smoothly from side to side because it is driven by value noise; the drips slider changes the width of the noise, so more drips means narrower tongues.

A dream grade pulls the colours toward a tint, more at the top (sky) than the bottom, then a pale second sun with a halo and a faint reflection and a few flat-bottomed clouds are drawn on top.

$$
\Delta(x,y)=A\,S(0.18,1,t)\,\big(0.25+0.75\,(0.75\,n_1+0.25\,n_2)\big)\,(t+0.2),\qquad t=\frac{y}{H}
$$
_How far the pixel is pulled down. A = melt × 0.34 H, S is smoothstep and n₁, n₂ are value noise at two scales._

$$
C_{\text{out}}=C\,(1-k-s_k)+T\,L\,k+S(t)\,s_k\,1.4,\quad k=0.28,\ s_k=0.22\,(1-t)
$$
_The colour grade: T is the tint, S(t) the sky colour at height t._

### A short history

Surrealism was launched by André Breton’s 1924 manifesto in Paris and drew on dreams and the unconscious. Salvador Dalí’s The Persistence of Memory (1931), with its soft watches, is the best known image of the melting idea, while Magritte and Max Ernst explored other ways of making the familiar strange.

### Where it is used

- Album and book cover art
- Editorial illustration about dreams, sleep or anxiety
- Mood and concept posts
- Fantasy photo manipulation

### Try it

- Full melt with narrow drips gives a dripping curtain of colour. (https://lumenary-studio.vercel.app/style/surreal?melt=100&drips=10)
- A moonlit grade without the second sun feels quieter. (https://lumenary-studio.vercel.app/style/surreal?grade=moon&sun=false)
- Gentle melt with heavy clouds is more of a daydream. (https://lumenary-studio.vercel.app/style/surreal?melt=25&clouds=90)

### Words worth knowing

- **Displacement:** Moving where each pixel is read from, so the picture appears to shift or bend.
- **Value noise:** Smooth random variation made by blending random values placed on a grid.
- **Colour grade:** A deliberate shift of colours to set a mood.

### See also

- 17 Vaporwave
- 31 Glitch
- 32 Pixel Sorting

## 14  Bohemian  ·  _still_

- **Comes from:** Artistic circles of 19th century Paris, revived in the 1960s and 70s
- **Around:** Boho revival, 2010s onward
- **Works best on:** Warm portraits, weddings and sunlit scenes

### Why it looks this way

The bohemian look is soft, earthy and handmade: terracotta, sage and cream, rounded shapes and dried grasses. The rainbow arch has become its symbol, so the picture here is framed in a window of nested arches, warmed by a pale orange glow and finished with a low sun and feathery pampas grass.

### How it works

1. Show the photograph inside an arch shaped window.
2. Draw arches around it, each wider than the last by a fixed gap, taking colours in turn from an earthy palette.
3. Warm the photograph by multiplying it with a pale orange and a faint brown.
4. Draw a pale sun with rays behind the arches and a row of dots for the ground.
5. Fan curved strokes with small feathery ellipses at each side as pampas grass.

### The mathematics

Boho colour is earthy and soft, and its signature shape is the rainbow arch. The picture is shown inside an arch window, and the arches around it get wider by a fixed gap each ring and take their colours in turn from an earthy palette. A warm tone is laid over the photograph by multiplying it with a pale orange, then a faint brown on top.

A pale sun with rays sits behind the arches, a row of dots marks the ground, and the pampas grass at each side is a fan of curved strokes with small feathery ellipses along their outer half, each one randomly longer or shorter.

$$
r_i=r_0+i\,g,\qquad i=1,\dots,n_{\text{rings}}
$$
_Radius of ring i: the window radius plus i times the gap g._

$$
C'=C\,\big((1-a)+a\,\tfrac{T}{255}\big),\qquad a=0.85\cdot\text{warmth}
$$
_Multiply blend with the tint T; the blend strength a follows the warm tone slider._

### A short history

The word bohemian was first used in France in the nineteenth century for artists and writers who lived outside convention, and was made famous by stories such as Henri Murger’s tales of Parisian artists. Its modern revival in fashion and interiors began in the 1960s and 70s and returned strongly in the 2010s, together with arches and pampas grass.

### Where it is used

- Wedding and baby shower stationery
- Nursery and living room wall prints
- Lifestyle brand posts
- Planner and journal covers

### Try it

- Sage with six rings is a calm, garden palette. (https://lumenary-studio.vercel.app/style/bohemian?palette=sage&rings=6)
- Rose without the sun is more modern and minimal. (https://lumenary-studio.vercel.app/style/bohemian?palette=rose&sun=false)
- Full warmth gives a golden-hour finish. (https://lumenary-studio.vercel.app/style/bohemian?warmth=100)

### Words worth knowing

- **Multiply blend:** A way of laying one colour over another so that the result is never lighter than either.
- **Pampas grass:** A tall grass with soft, feathery plumes, popular in boho décor.
- **Arch:** A curved top over an opening, repeated here as nested rings.

### See also

- 07 Retro
- 18 Memphis
- 04 Minimalism

## 15  Victorian  ·  _still_

- **Comes from:** British and American printing houses
- **Around:** 1830s to 1900
- **Works best on:** Portraits, with a clear face against a plain background

### Why it looks this way

An engraver cannot paint grey. Tone has to come from lines: thick and close together for shadow, thin and far apart for light. This treatment does the same with horizontal lines that swell and shrink with the darkness beneath them, adds crossing lines in the deepest shadows, and sets the result in an oval with an ornate frame, as keepsake portraits were.

### How it works

1. Draw many horizontal lines whose thickness follows the darkness of the picture beneath.
2. Make each line wander gently up and down on a sine wave, for the hand-cut look.
3. Add a second set of diagonal lines in the darkest places, lifting the pen where the picture is lighter than a threshold.
4. Clip the portrait to an oval and frame it with two rules and a ring of 72 beads.
5. Add the double border, corner rosettes and a caption between two rules.

### The mathematics

A steel engraving builds tone from lines. The portrait is drawn as many horizontal lines whose thickness follows the darkness underneath, so a dark area is a row of fat lines that nearly touch, and a light one has hairlines or gaps. The lines wander gently up and down with a sine wave, which gives the hand-cut look.

In the darkest places a second set of diagonal lines is added (cross-hatching), but each diagonal pen stroke lifts wherever the picture is lighter than a threshold. The cameo is clipped to an oval, framed by two rules and a ring of 72 beads; the page has a double border with a rosette in each corner and a caption between two rules.

$$
t(x,i)=1.05\,\big(1-L(x,y_i)\big)\,\Delta y
$$
_Thickness of line i at column x; Δy is the line spacing._

$$
y(x,i)=y_i+0.18\,\Delta y\,\sin(0.045\,x+0.7\,i)
$$
_The gentle waver of each line._

$$
\text{hatch where}\quad L<0.4\cdot\text{cross}+0.05
$$
_Cross-hatching is only drawn on dark places._

### A short history

Steel replaced copper for engraving plates in the 1820s because it lasted for far longer print runs. Steel-engraved portraits, book illustrations and banknotes were everywhere in the Victorian era (1837 to 1901), before photography and halftone printing took over. The wandering line and cross-hatching used here are the engraver’s tools for building tone from nothing but black ink.

### Where it is used

- Certificate and invitation styling
- Vintage book plates and almanac art
- Heritage brand labels
- Gothic and steampunk themed graphics

### Try it

- Blue ink with the maximum number of lines reads like fine banknote work. (https://lumenary-studio.vercel.app/style/victorian?ink=blue&lines=160)
- Full cross-hatching deepens every shadow. (https://lumenary-studio.vercel.app/style/victorian?cross=100)
- Turn off the oval and write your own caption. (https://lumenary-studio.vercel.app/style/victorian?oval=false&caption=A+PORTRAIT+OF+THE+AUTHOR)

### Words worth knowing

- **Cross-hatching:** Two sets of crossing lines used to build up dark tones.
- **Cameo:** A portrait presented inside an oval frame.
- **Rosette:** A circular flower shaped ornament, here placed in each corner.

### See also

- 01 Art deco
- 83 Banknote Engraving
- 55 Newspaper

## 16  Graffiti  ·  _still_

- **Comes from:** Philadelphia and New York streets, with stencil work from Paris
- **Around:** 1960s and 70s onward
- **Works best on:** High contrast portraits and bold silhouettes

### Why it looks this way

A stencil has no grey: a spot of the wall is either painted or it is not. That limit is what makes stencil portraits so striking, and this treatment keeps to it with three paint colours and a bare wall. The cut points come from the picture’s own brightness percentiles, so every photograph leaves about the same share of brick showing, however light or dark it is.

### How it works

1. Paint a brick wall first, each brick slightly lighter or darker than its neighbours.
2. Find the 20th, 40th and 58th percentile brightness of this particular picture.
3. Use those points to cut three paint layers and a bare area, like a multi-layer stencil.
4. Add a blurred copy of the stencil at low strength as overspray, plus a fine scatter of dots.
5. Start a drip wherever paint sits directly above bare wall, then outline and fill the tag.

### The mathematics

The wall is drawn first: a brick pattern with each brick slightly lighter or darker than the others. The picture is then turned into a stencil with three paint colours and a part left bare. The thresholds are not fixed numbers; they are the 20th, 40th and 58th percentiles of this picture’s own brightness, so every photograph leaves about forty percent of the wall showing, whatever its tones.

Real spray paint is not crisp, so a blurred copy of the stencil is added at low opacity as overspray, and a fine scatter of dots falls around the painted edges. Drips start where painted pixels have bare wall directly below, and run down as a short line with a round end. The tag is outlined, then filled with the light colour and a glow.

$$
\text{level}=\begin{cases}3&L<q_{0.20}\\2&L<q_{0.40}\\1&L<q_{0.58}\\0&\text{otherwise (bare wall)}\end{cases}
$$
_q is a quantile of the picture’s brightness values._

$$
C=(1-\alpha)\,C_{\text{sharp}}+\alpha\,C_{\text{blur}},\qquad \alpha=0.35\cdot\text{overspray}
$$
_Overspray: the blurred copy is blended over the sharp one._

### A short history

Modern graffiti took shape in Philadelphia in the late 1960s and in New York in the 1970s, where tags such as TAKI 183 were noticed by the press in 1971. Stencil work followed, with artists such as Blek le Rat in Paris in the early 1980s and later Banksy, who used the speed of a cut stencil to put detailed images on walls in seconds.

### Where it is used

- Street art style posters and flyers
- Streetwear and skate graphics
- Music and event artwork
- Textured backgrounds for social posts

### Try it

- A grey wall with ocean cans looks cool and industrial. (https://lumenary-studio.vercel.app/style/graffiti?wall=grey&palette=ocean)
- Maximum overspray and drips make a rough, fresh piece. (https://lumenary-studio.vercel.app/style/graffiti?spray=100&drips=100)
- Sign it with your own tag. (https://lumenary-studio.vercel.app/style/graffiti?tag=YOURS)

### Words worth knowing

- **Stencil:** A cut-out sheet used to apply paint only through the holes.
- **Overspray:** The soft haze of paint that drifts past the edge of a spray.
- **Percentile:** The value below which a given share of pixels fall. The 20th percentile is darker than 80 percent of the picture.

### See also

- 09 Pop Art
- 21 Comic book
- 23 Collage Art

## 17  Vaporwave  ·  _still_

- **Comes from:** Internet music and art communities
- **Around:** Early 2010s
- **Works best on:** Calm scenes with a clear horizon, and sculptural subjects

### Why it looks this way

Vaporwave looks back at the 1980s and 90s as a half-remembered dream of shopping malls and corporate computers. Its colours are sunset pinks and cyans, its horizon is a striped sun over a glowing grid, and its type is wide and spaced out. The colour split at every edge adds the feel of a worn videotape.

### How it works

1. Map brightness through a ramp from deep violet through magenta to cyan and near white.
2. Take the red of each pixel from a few pixels to the left and the blue from a few pixels to the right.
3. Draw the sun as a gradient disc with horizontal bars cut out of it, thicker lower down.
4. Draw the floor as a perspective grid: lines from a vanishing point on the horizon, with horizontal lines bunched near the horizon.
5. Add scanlines, and set the caption in full-width characters by shifting each letter’s character code.

### The mathematics

Vaporwave takes a sunset palette to extremes. Brightness goes through a ramp from deep violet through magenta to cyan and near-white. A chromatic offset then takes the red of each pixel from a few pixels to the left and the blue from a few pixels to the right, which splits the colours at every edge like a misaligned print.

The sun is a disc with a vertical gradient, with horizontal bars cut out of it (the bars get thicker lower down). The floor is a perspective grid: lines run from a vanishing point on the horizon to equally spaced points along the bottom edge, and horizontal lines are bunched together near the horizon with a power law. The caption is converted to full-width characters, the wide letters of vaporwave, by shifting each character’s code.

$$
y_k=h+(H-h)\left(\frac{k}{14}\right)^{2.1},\qquad k=1,\dots,13
$$
_Height of the k-th horizontal grid line below the horizon h._

$$
R=R_{\text{src}}(x-s),\quad G=G_{\text{src}}(x),\quad B=B_{\text{src}}(x+s)
$$
_Colour shift of s pixels._

$$
\text{full-width}(c)=c+\mathrm{0xFEE0}
$$
_The Unicode full-width form of a Latin letter or digit._

### A short history

Vaporwave emerged around 2010 and 2011 in online music scenes, with albums such as Oneohtrix Point Never’s Chuck Person’s Eccojams and Macintosh Plus’s Floral Shoppe becoming defining records. Its visuals gather early computer interfaces, Japanese advertising, classical statues and sunset gradients into one slightly eerie nostalgia.

### Where it is used

- Cover art for electronic music
- Retro-futurist posters
- Streaming overlays and avatars
- Aesthetic social posts

### Try it

- Strong colour shift without scanlines looks like a bleeding print. (https://lumenary-studio.vercel.app/style/vaporwave?shift=100&scan=0)
- Skip the sun and make the grid dominant. (https://lumenary-studio.vercel.app/style/vaporwave?grid=100&sun=false)
- Change the caption to a word of your own. (https://lumenary-studio.vercel.app/style/vaporwave?text=DREAMS)

### Words worth knowing

- **Vanishing point:** The spot on the horizon where parallel lines seem to meet.
- **Full-width characters:** Wide forms of letters from East Asian text standards, used here for the spaced-out look.
- **Chromatic offset:** Shifting colour channels sideways against each other.

### See also

- 07 Retro
- 11 Y2K
- 29 Retro VHS
- 08 Cyberpunk

## 18  Memphis  ·  _still_

- **Comes from:** Milan
- **Around:** 1981 to 1987
- **Works best on:** Playful, bright subjects and portraits

### Why it looks this way

The Memphis designers wanted furniture and objects that were funny, cheerful and a little rude about good taste. Their language was bright colour, cheap-looking laminates, squiggles and geometric confetti. This treatment sets a posterised picture in a panel with a hard shadow among scattered shapes, with no blur anywhere, because blur is not Memphis.

### How it works

1. Posterise the picture into four tones, using four colours from the chosen scheme.
2. Place it in a rounded, arched or circular panel with a solid offset shadow.
3. Scatter triangles, rings, squiggles, half circles, crosses and dotted rows around it at random sizes and angles.
4. Put some shapes on the panel’s edge so they overlap it.
5. Use the seed for every random choice, so shuffling is repeatable.

### The mathematics

The Memphis Group of the 1980s used loud shapes on speckled backgrounds. The picture is posterised into four tones using four colours of the scheme (darkest tone to the darkest colour) and placed in a panel (rounded, arch or circle) with a hard offset shadow in solid ink, with no blur at all.

Around it, small triangles, rings, squiggles, half circles, crosses and rows of dots are scattered at random positions, sizes and angles, and a few more are placed on the panel’s edge so that they overlap it. The seed decides everything random, so the shuffle button re-arranges the confetti.

$$
k=\min\big(3,\ \lfloor 4L\rfloor\big),\qquad C=P_k
$$
_Four equal brightness bands, one palette colour each._

$$
y_{\text{squiggle}}(t)=0.35\,s\,\sin(5\pi t),\qquad t\in[0,1]
$$
_The squiggle is two and a half sine waves._

### A short history

The Memphis Group was founded in Milan in December 1980 by Ettore Sottsass with a circle of young designers, and it presented its first collection in 1981. The name is said to come from a Bob Dylan song that was playing during the founding meeting. The group’s colourful plastic laminate furniture and patterned surfaces influenced graphics, fashion and pop culture for years after it disbanded.

### Where it is used

- Brand identity for playful products and kids’ goods
- Patterns for textiles and stationery
- Posters and covers with an eighties flavour
- Packaging for snacks and drinks

### Try it

- An arch panel with mint colours is calm for Memphis. (https://lumenary-studio.vercel.app/style/memphis?panel=arch&scheme=mint)
- Turn the confetti to the maximum for a party. (https://lumenary-studio.vercel.app/style/memphis?confetti=100)
- A round panel in lilac makes a sticker. (https://lumenary-studio.vercel.app/style/memphis?panel=circle&scheme=lilac)

### Words worth knowing

- **Laminate:** A thin patterned plastic sheet bonded to furniture surfaces, a Memphis signature.
- **Posterise:** To reduce a picture to a few flat tones.
- **Seed:** A starting number for a random generator. The same seed always gives the same result.

### See also

- 05 Maximalism
- 09 Pop Art
- 02 Bauhaus

## 19  Mondrian  ·  _still_

- **Comes from:** The Netherlands
- **Around:** 1917 to 1944
- **Works best on:** Pictures with strong straight edges, such as buildings and interiors

### Why it looks this way

Piet Mondrian reduced painting to black lines and a handful of primary colours, arranged so that nothing dominates and everything balances. This treatment finds such an arrangement inside your own picture by cutting it where its edges already are. The result is a grid that still follows the scene.

### How it works

1. Start with the whole page as one rectangle.
2. Pick the rectangle with the most going on, measured as its brightness variance times the square root of its area, with a little randomness.
3. Cut it across its longer side at the place where the average brightness on the two sides differs most.
4. Repeat until the requested number of cells is reached.
5. Rank the cells by brightness: some of the darkest turn black, and red, yellow and blue go to a share of the others.

### The mathematics

Mondrian’s grids are made here by repeatedly cutting a rectangle. Start with the whole page; at each step choose the rectangle that has the most going on (its variance of brightness times the square root of its area, with a little randomness) and cut it, in the direction of its longer side, at the place where the average brightness on the two sides differs most. The cuts therefore land on the edges of the picture.

All the statistics are cheap because of a summed-area table: a table in which each entry is the sum of everything above and to the left, so the sum of any rectangle is four lookups. The cells are then ranked by their average brightness: some of the darkest become black, and red, yellow and blue go to a share of the others. The grid lines are a fixed black width and never drawn on the outer border.

$$
S(x,y)=\sum_{i<x,\,j<y}L_{ij},\qquad \Sigma(R)=S(x_1,y_1)-S(x_0,y_1)-S(x_1,y_0)+S(x_0,y_0)
$$
_Summed-area table S and the sum of any rectangle R._

$$
\operatorname{Var}(R)=\frac{\Sigma_{L^2}(R)}{n}-\left(\frac{\Sigma_L(R)}{n}\right)^{2}
$$
_Variance from two tables, one of L and one of L²._

$$
\text{cut}=\operatorname*{arg\,max}_{c}\ \lvert\mu_A-\mu_B\rvert\,\sqrt{\min(n_A,n_B)}
$$
_Choose the cut c giving the biggest difference of mean brightness between the two halves A and B._

### A short history

Mondrian co-founded the De Stijl movement in the Netherlands, whose journal began in 1917 with Theo van Doesburg. He called his approach neoplasticism and developed his grid paintings through the 1920s and 30s. The summed-area table that makes the cuts fast is a computer graphics trick introduced by Frank Crow in 1984.

### Where it is used

- Poster and book cover art
- Fashion prints, famously a 1965 Yves Saint Laurent dress
- Layout inspiration for tiles and interfaces
- Backgrounds for presentations

### Try it

- Many cells with thin lines make a fine, almost architectural plan. (https://lumenary-studio.vercel.app/style/mondrian?cells=24&line=3)
- Few cells and thick lines look just like the classic paintings. (https://lumenary-studio.vercel.app/style/mondrian?cells=6&line=12)
- Add more colour blocks for a livelier composition. (https://lumenary-studio.vercel.app/style/mondrian?color=100)

### Words worth knowing

- **Summed-area table:** A table in which each entry holds the sum of everything above and to the left, so any rectangle’s total takes four lookups.
- **Variance:** A measure of how much values differ from their average.
- **Neoplasticism:** Mondrian’s name for his pure style of line and primary colour.

### See also

- 02 Bauhaus
- 12 Swiss Design
- 04 Minimalism

## 20  Constructivist  ·  _still_

- **Comes from:** Russia and the Soviet Union
- **Around:** 1917 to the 1930s
- **Works best on:** Strong portraits with simple backgrounds

### Why it looks this way

Constructivist designers wanted posters that acted: bold diagonals, red and black, and photographs reduced to two tones so that they read at once from across a street. The tilted layout creates energy, and a thick slab of type turns a few words into a command.

### How it works

1. Reduce the photograph to two tones with a hard threshold at the picture’s own median brightness.
2. Clip it to a rectangle rotated by the poster angle.
3. Multiply a red wedge across it and add a black frame.
4. Draw two heavy red bars and a black disc.
5. Set the slogan in a black slab on a slightly different slant.

### The mathematics

Constructivist posters are red, black and cream, with strong diagonals. The photograph is reduced to two tones with a hard threshold, black below and cream above. The threshold is the median of the picture’s own brightness (nudged by the contrast slider), so that about half the picture is black, however light or dark the original.

It is then clipped into a rectangle rotated by the poster angle, with a red wedge multiplied across it, a black frame, two heavy red bars and a black disc. The slogan sits in a black slab set on a smaller slant than the picture.

$$
C=\begin{cases}\text{black}&L<q_{\,0.5-\text{contrast}/600}\\\text{cream}&\text{otherwise}\end{cases}
$$
_Two-tone threshold at a quantile q of the picture’s brightness._

$$
\begin{bmatrix}x'\\y'\end{bmatrix}=\begin{bmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{bmatrix}\begin{bmatrix}x\\y\end{bmatrix}
$$
_The rotation applied to the photo, wedge and bars (θ is the poster angle)._

### A short history

Constructivism grew in Russia after 1917, with artists such as Alexander Rodchenko, El Lissitzky and Gustav Klutsis. El Lissitzky’s 1919 poster Beat the Whites with the Red Wedge is the best known example of its geometry. Photomontage, diagonals and heavy sans-serif type were its tools, and later designers worldwide borrowed them.

### Where it is used

- Event and exhibition posters
- Zine and book covers
- Music flyers
- Bold announcement graphics

### Try it

- A steep angle and high contrast gives the most dramatic poster. (https://lumenary-studio.vercel.app/style/constructivist?angle=35&contrast=100)
- Drop the wedge for a calmer composition. (https://lumenary-studio.vercel.app/style/constructivist?wedge=false)
- Replace the slogan with your own words. (https://lumenary-studio.vercel.app/style/constructivist?slogan=LOOK+CLOSER)

### Words worth knowing

- **Photomontage:** A picture made by combining and cropping several photographs.
- **Median:** The middle value: half of the pixels are darker and half lighter.
- **Slab type:** Heavy letters with thick, block-like strokes.

### See also

- 12 Swiss Design
- 09 Pop Art
- 19 Mondrian

## 21  Comic book  ·  _still_

- **Comes from:** American comic printing
- **Around:** 1930s onward
- **Works best on:** Faces and action scenes with clear edges

### Why it looks this way

Cheap comics were printed with a few flat inks, black outlines and dots, so the inked look is mostly a matter of constraints. Posterising limits the colours, edge detection supplies the pen lines, and a lattice of dots in the shadows imitates the press. Together they turn photographic realism into drawing.

### How it works

1. Snap brightness to a small number of levels and rescale each pixel’s colour so it keeps its hue at the flat level.
2. Raise saturation around each pixel’s own grey value.
3. Blur the picture, find edges, and darken pixels toward black in proportion to edge strength.
4. In darker but not black tones, lay a lattice of dots on a 45 degree grid.
5. Darken any pixel that falls inside a dot whose radius grows as the tone gets darker.

### The mathematics

Three ideas make a photograph look inked. First, posterisation: brightness is snapped to a small number of levels, and the colour is rescaled so each pixel keeps its hue but takes the flat brightness of its level, giving the large flat areas of printed colour. Saturation is then pushed up around the pixel’s own grey value, which is the “pop” slider.

Second, outlines: the same blur-then-Sobel edge detector as in neon glow, but here the edge strength darkens the pixel toward black, so outlines are inked rather than glowing. Third, Ben-Day dots, the mechanical dot patterns of old printing. In the darker (but not black) tones a lattice of dots is laid on a 45° grid, and a pixel is darkened if it falls inside a dot whose radius grows as the tone gets darker. Rotating coordinates by 45° is just a sum and difference scaled by 1/√2.

$$
q=\frac{\operatorname{round}\big(L\,(n-1)\big)}{n-1},\qquad C'=C\cdot\frac{q+0.06}{L+0.06}
$$
_Posterise to n levels and rescale colour to the new brightness; the 0.06 keeps blacks stable._

$$
u=\frac{x+y}{\sqrt2\,s},\quad v=\frac{y-x}{\sqrt2\,s},\qquad\text{dot if }\sqrt{(u-\lfloor u\rceil)^2+(v-\lfloor v\rceil)^2}<0.18+0.32\Big(1-\frac{q}{0.62}\Big)
$$
_Dot lattice at 45° with spacing s; ⌊·⌉ rounds to the nearest integer. Applied for tones 0.02 < q < 0.62; dots darken colour to 50%._

$$
C_{\text{out}}=C\,\big(1-S_{\theta,1.35\theta}(\lvert\nabla L_b\rvert)\big)
$$
_Ink: edge strength darkens toward black._

### A short history

Comic books took their classic form in the late 1930s, when Superman appeared in Action Comics in 1938. Their four-colour printing could not make smooth gradients, so artists and printers used flat colour and dot patterns instead. Pop artists such as Roy Lichtenstein later enlarged those dots into fine art in the early 1960s.

### Where it is used

- Avatars and profile pictures
- Invitations and party posters
- Video thumbnails
- Classroom and storytelling materials

### Try it

- Three colour steps with strong ink lines gives a clean, graphic panel. (https://lumenary-studio.vercel.app/style/comic-book?levels=3&ink=100)
- Turn the dots off for a cartoon look. (https://lumenary-studio.vercel.app/style/comic-book?dots=false)
- Larger dots and extra colour pop make it look newsprint-loud. (https://lumenary-studio.vercel.app/style/comic-book?dotSize=120&pop=100)

### Words worth knowing

- **Posterise:** To reduce a picture to a few flat tones.
- **Ben-Day dots:** A regular pattern of dots whose size changes to show tone.
- **Inking:** Drawing the final black lines over a pencil sketch.

### See also

- 09 Pop Art
- 22 Vector Art
- 03 Neo-brutalism

## 22  Vector Art  ·  _still_

- **Comes from:** Computer graphics
- **Around:** 1960s onward, mainstream since the late 1980s
- **Works best on:** Portraits and scenes with distinct colour regions

### Why it looks this way

A vector illustration is made of shapes rather than pixels, so it has flat colour and crisp, curved edges. A photograph is the opposite, so the job is to find the few colours that describe the picture and then clean up the borders between them. K-means clustering does the first part and a blur-and-snap step does the second.

### How it works

1. Blur the picture and raise its saturation so that grain does not create islands.
2. Choose k starting colours, assign every pixel to the nearest, move each colour to the average of its pixels, and repeat.
3. Give every pixel its cluster’s colour.
4. Blur the flat image and snap each pixel back to the nearest palette colour, which rounds the staircase corners.
5. Darken pixels whose neighbour belongs to a different cluster to draw the outline.

### The mathematics

Vector illustrations are flat areas of colour with clean edges, and the way to get that from a photograph is to cut the picture into a small palette. First the picture is blurred (so that grain does not produce islands) and its saturation is raised. Then k-means clustering finds the k colours that best describe it: start with k random colours from the picture, assign every pixel to the nearest one, move each colour to the average of its pixels, and repeat.

Every pixel then takes its cluster’s colour. The edges between clusters are still stair-stepped, so the flat image is blurred and each pixel is snapped back to the nearest palette colour, which rounds the corners. Finally the pixels whose neighbour belongs to a different cluster are darkened to draw the outline. The blurs are written as arithmetic on the pixel arrays rather than as browser filters, so they work in every browser.

$$
c_i\leftarrow\frac{1}{\lvert S_i\rvert}\sum_{p\in S_i}p,\qquad S_i=\{\,p:\ \lVert p-c_i\rVert\le\lVert p-c_j\rVert\ \forall j\,\}
$$
_One k-means step: assign each pixel to its nearest centre, then move the centre to the mean of its pixels._

$$
C'=\ell+s\,(C-\ell),\qquad \ell=0.299R+0.587G+0.114B
$$
_Saturation s: each channel moves away from (s > 1) or towards (s < 1) the grey value ℓ._

### A short history

Ivan Sutherland’s Sketchpad in 1963 showed that a computer could store drawings as geometry. Adobe Illustrator brought vector drawing to designers in 1987, and Scalable Vector Graphics became a web standard around 2001. The k-means method is older still, described by Stuart Lloyd in 1957 and named by James MacQueen in 1967.

### Where it is used

- Starting points for logos and icons
- Stickers, decals and vinyl cutting
- Screen print colour separations
- Flat style profile pictures

### Try it

- Three colours and strong outlines make a bold sticker. (https://lumenary-studio.vercel.app/style/vector-art?colors=3&outline=60)
- Twelve colours with smooth edges keep much more of the photograph. (https://lumenary-studio.vercel.app/style/vector-art?colors=12&smooth=100)
- Boost saturation for a vivid flat illustration. (https://lumenary-studio.vercel.app/style/vector-art?sat=160)

### Words worth knowing

- **k-means:** A method that groups pixels into k clusters by repeatedly averaging.
- **Cluster:** A group of pixels that are close in colour.
- **Vector:** A graphic described by shapes and curves instead of a grid of pixels.

### See also

- 04 Minimalism
- 21 Comic book
- 43 Low-poly

## 23  Collage Art  ·  _still_

- **Comes from:** Cubist Paris and Dada Berlin
- **Around:** 1912 onward
- **Works best on:** Busy scenes and group photographs

### Why it looks this way

A collage shows its seams. The torn edges, the shadow under each scrap and the overlap of pieces tell you that the picture has been cut and rebuilt by hand. Here the photograph is sliced into a grid, every piece is torn and rotated a little, and the pieces are dropped back over coloured paper and a speckled desk.

### How it works

1. Cut the photograph into a grid of pieces.
2. Draw each piece as a rectangle outline with 28 points, each nudged by a random amount, so the edge wobbles like torn paper.
3. Fill the torn shape with the matching part of the picture, slightly larger than its cell so neighbours overlap, and add a shadow below it.
4. Rotate and move the pieces by random amounts scaled by the scatter slider, and draw them in random order.
5. Lay scraps of plain paper and a speckled desk underneath, and stick strips of translucent tape on a few pieces.

### The mathematics

The photograph is cut into a grid of pieces, and each piece is drawn as a torn rectangle: its outline is a rectangle with 28 points, each moved by a random amount, so the edge wobbles like torn paper. The torn shape is filled with the matching part of the picture, a little larger than its cell so neighbours overlap, and a shadow below it makes the paper look lifted.

Pieces are rotated and moved by random amounts scaled by the scatter slider, and drawn in random order so that some lie over others. Underneath, scraps of plain coloured paper and a speckled desk give the scene depth. Strips of translucent tape are placed on a few pieces.

$$
\text{source rect}=\left(\frac{(i+\tfrac12)c_w-0.53\,c_w}{0.86},\ \frac{(j+\tfrac12)c_h-0.53\,c_h}{0.86},\ \frac{1.06\,c_w}{0.86},\ \frac{1.06\,c_h}{0.86}\right)
$$
_The part of the photograph shown on piece (i, j) of size c_w × c_h; the photograph fills 86% of the page._

$$
\theta=0.7\,(\xi-\tfrac12)\cdot\text{scatter},\qquad \xi\sim U(0,1)
$$
_The random rotation of each piece._

### A short history

The word collage comes from the French coller, to glue. Pablo Picasso and Georges Braque began pasting paper into their paintings around 1912, and Dada artists such as Hannah Höch used cut photographs to make sharp social commentary in Berlin from 1919. Kurt Schwitters built whole works out of scraps, and Henri Matisse’s late paper cut-outs gave the idea a joyful colour.

### Where it is used

- Zine and mixed-media covers
- Mood boards and scrapbooks
- Album art
- Social posts with a handmade feel

### Try it

- Ten big pieces with rough tears look like a fast, bold collage. (https://lumenary-studio.vercel.app/style/collage-art?pieces=10&tear=100)
- Maximum scatter without tape makes a loose, tumbled pile. (https://lumenary-studio.vercel.app/style/collage-art?scatter=100&tape=false)
- Forty fine pieces with little scatter keep the picture easy to read. (https://lumenary-studio.vercel.app/style/collage-art?pieces=40&scatter=10)

### Words worth knowing

- **Papier collé:** French for pasted paper, the Cubists’ name for their paper collages.
- **Photomontage:** A picture made by combining and cropping several photographs.
- **Seed:** A starting number for a random generator, so that a result can be repeated.

### See also

- 13 Surreal
- 05 Maximalism
- 09 Pop Art

## 24  Mono Essay  ·  _still_

- **Comes from:** Online video essays and minimalist editorial design
- **Around:** 2010s onward
- **Works best on:** One clear subject against a plain background

### Why it looks this way

A quiet essay video asks you to listen, so its pictures step back. Colour goes, the blacks deepen until most of the frame is dark, and grain makes a still image feel like film. Over that, a few thin white lines do the pointing: a contour around the forms, a circle, a rule, one short sentence. The picture becomes a diagram of an idea.

### How it works

1. Reduce the picture to brightness and stretch it to the full range.
2. Sink it: a smoothstep sends everything below a limit to black, and a vignette darkens the corners.
3. Blur a copy heavily and draw thin white lines along its levels of equal brightness, one pixel wide whatever the slope.
4. Find the centre of everything that stands out from the mean tone, and draw a circle and a ticked rule from it.
5. Add grain, a few scratches and dust, then set the sentence small with wide letter spacing.

### The mathematics

The picture is reduced to brightness, stretched so that its darkest and lightest 2% clip, and then sunk. A smoothstep between two limits set by the “depth of the blacks” slider decides which greys survive: everything below the lower limit becomes black. The result is raised to the power 1.2 and scaled to 88%, so nothing in the frame is quite white, and a vignette takes away up to 55% more toward the corners. Grain is the sum of a per-pixel hash and a smoother value noise; a few vertical scratches and rare dust specks are drawn from the same seed.

The white contours are lines of equal brightness on a copy of the picture blurred twice with a box of radius 16 pixels. For each level, the distance from a pixel to the contour is estimated as the difference in brightness divided by the local slope, and the line is drawn where that distance is under about a pixel. Dividing by the slope is what keeps the line the same width on a gentle gradient and on a sharp edge. The circle is centred on the average position of everything that differs from the picture’s mean tone, each place weighted by the square of that difference.

$$
v=0.88\,S_{a,b}(L)^{1.2},\qquad a=0.08+0.3\,c,\quad b=1.02-0.12\,c
$$
_Tone: L is the stretched brightness, S the smoothstep and c the “depth of the blacks” slider (0 to 1)._

$$
d\approx\frac{\lvert L_w-\ell\rvert}{\lvert\nabla L_w\rvert},\qquad \alpha=1-S_{0.5w,\,1.3w}(d)
$$
_Distance d to the contour at level ℓ on the blurred brightness L_w, and the opacity of a line of width w._

$$
\mathbf c=\frac{\sum_i w_i\,\mathbf x_i}{\sum_i w_i},\qquad w_i=\big(L_{w,i}-\bar L\big)^{2}
$$
_Centre of the circle: the weighted mean position of what stands out from the mean tone._

### A short history

The essay film is older than the internet: Hans Richter described the form in 1940, and Chris Marker’s Sans Soleil (1983) is its best-known example. On video platforms in the 2010s the video essay became a genre of its own, often one voice over spare black-and-white visuals. The thin white diagram lines borrow from technical drawing and from the conceptual art of the 1960s, where a line and a caption could be the whole work.

### Where it is used

- Title cards for video essays
- Quote posts and newsletter headers
- Book and podcast cover art
- Slides that carry one idea each

### Try it

- One contour and deep blacks leave almost nothing but the line. (https://lumenary-studio.vercel.app/style/mono-essay?lines=1&contrast=90)
- A warm tone and heavy grain look like an old print. (https://lumenary-studio.vercel.app/style/mono-essay?tone=warm&grain=85)
- Turn the circle off and keep three contours for a map of the picture. (https://lumenary-studio.vercel.app/style/mono-essay?figure=false&lines=3)

### Words worth knowing

- **Contour:** A line that joins points of equal value, here equal brightness.
- **Vignette:** A gradual darkening toward the corners of a picture.
- **Letter spacing:** Extra room set between the letters of a word.

### See also

- 04 Minimalism
- 10 Editorial
- 155 Contour Lines

