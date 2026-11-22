# B. Digital and technical

Source: https://lumenary-studio.vercel.app/theory/digital (captured 2026-11-16 for private study).

Machines reading, and sometimes misreading, your picture: terminals, sensors, codecs, screens and plotters, all humming quietly.

## 25  ASCII art  ·  _still_

- **Comes from:** Typewriters, line printers and early networks
- **Around:** 1960s onward
- **Works best on:** High contrast portraits and logos

### Why it looks this way

A character is a tiny picture, and some characters carry more ink than others. A full stop is nearly empty and an @ sign is nearly solid, so a row of characters can paint a row of grey tones. This treatment sorts a set of characters by how dark they are and lets each cell of your picture choose the one that matches its brightness.

### How it works

1. Measure the width of a monospace letter, and from it work out how many rows fit, since letters are taller than they are wide.
2. Average the picture into one value per character cell.
3. Apply the contrast curve to each value.
4. Look up a character from a ramp ordered from empty to solid, flipping the order on a light background.
5. Place each character individually on the grid, so alignment stays exact even if the font changes.

### The mathematics

The picture is sampled to a grid of cells, one per character. The number of columns is the detail slider; the number of rows follows from the font’s shape, because a letter is taller than it is wide. The program measures how wide the monospace font’s “M” is at a reference size, and from that works out the font size that makes the chosen number of characters exactly fill the width.

Each cell’s brightness, after the contrast curve, picks a character from a ramp ordered by how much ink it puts on the page: a space for empty, a full block or “@” for solid. On a dark background bright cells use dense characters; on a light background the mapping flips, so the picture is always shown in the right polarity. Every character is placed individually on the grid instead of being typeset as lines of text, so the alignment stays exact even if the browser falls back to a font that is not monospace.

$$
\text{fs}=\frac{W/\text{cols}}{a},\qquad\text{rows}=\operatorname{round}\!\Big(\frac{H}{\text{fs}\cdot\text{spacing}}\Big)
$$
_Font size from the advance width a (in ems) of the glyph “M”._

$$
\text{index}=\operatorname{round}\big(d\,(m-1)\big),\qquad d=\begin{cases}L'&\text{light on dark}\\1-L'&\text{dark on light}\end{cases}
$$
_Which of the m characters in the ramp to draw._

### A short history

Pictures made of typed symbols are older than computers, since typists made them from the 1890s. Kenneth Knowlton and Leon Harmon at Bell Labs built mosaic images from small printed symbols in 1966. The ASCII standard itself dates from 1963, and ASCII art spread through bulletin boards, email signatures and Usenet groups in the 1980s and 90s, wherever only plain text was available.

### Where it is used

- Terminal and README banners
- Plain text emails and signatures
- Developer themed posters and prints
- Retro computing and hacker aesthetic posts

### Try it

- A small set of dots gives a delicate, newspaper-like result. (https://lumenary-studio.vercel.app/style/ascii-art?charset=dots&detail=160)
- Binary turns the picture into a screen of zeros and ones. (https://lumenary-studio.vercel.app/style/ascii-art?charset=binary&detail=90)
- Keep the original colours for a vivid, glowing text portrait. (https://lumenary-studio.vercel.app/style/ascii-art?color=original&bold=true)

### Words worth knowing

- **Monospace:** A typeface in which every character takes the same width, so columns line up.
- **Character ramp:** A list of characters ordered from the lightest to the heaviest.
- **ASCII:** A 1963 standard that assigned numbers to the letters, digits and symbols of English text.

### See also

- 34 Dithering
- 39 Matrix Rain
- 38 QR Barcode Art

## 26  Pixel art  ·  _still_

- **Comes from:** Early computers and game consoles
- **Around:** 1970s onward
- **Works best on:** Simple subjects such as faces, objects and landscapes

### Why it looks this way

Pixel art is a craft of limits. With only a few dozen pixels across and a handful of colours, every pixel matters. This treatment makes the three decisions an artist makes: how coarse the grid is, which colours to allow, and how to fake the missing shades with dithering.

### How it works

1. Shrink the picture to the chosen width by repeated halving, then adjust saturation.
2. Choose a palette: a fixed historical one, or an adaptive one found by k-means clustering.
3. Add a tiny offset from a 4 × 4 Bayer pattern to each pixel.
4. Replace every pixel with the nearest palette colour, with green weighted a little more than red and blue.
5. Enlarge the small image without smoothing, so each pixel becomes a crisp square.

### The mathematics

Pixel art is three decisions: how few pixels, which colours, and how to hide the loss. The picture is reduced to the chosen width using the same halving as everywhere else and saturation is adjusted. The palette is either a fixed historical one (such as a handheld console’s four greens) or adaptive: k-means clustering finds the k colours that best represent the picture. It starts with k colours spread along the brightness order, then repeats ten times: assign every sampled pixel to its nearest colour, and move each colour to the average of its pixels. Only up to about six thousand sample pixels are used, which keeps it quick.

Each pixel is then replaced by its nearest palette colour, but first a small offset from a Bayer matrix is added, a fixed 4 × 4 pattern of thresholds. Pixels that sit between two palette colours then fall on one side or the other in a regular checkerboard-like pattern, and the eye blends them back into an intermediate tone. This is ordered dithering. Distance is measured with weights favouring green, 0.9 for red, 1.2 for green and 0.8 for blue, which approximates how sensitive we are to each. The small image is finally enlarged without smoothing, so each pixel becomes a crisp square.

$$
B=\frac1{16}\begin{bmatrix}0&8&2&10\\12&4&14&6\\3&11&1&9\\15&7&13&5\end{bmatrix},\qquad c'=c+\Big(B_{x\bmod4,\;y\bmod4}-\tfrac12\Big)A
$$
_Ordered dithering: add a position-dependent offset of amplitude A before choosing the palette colour._

$$
d^{2}=0.9\,\Delta R^{2}+1.2\,\Delta G^{2}+0.8\,\Delta B^{2}
$$
_Weighted squared distance used to find the nearest palette colour._

$$
\mu_c\;\leftarrow\;\frac{1}{\lvert S_c\rvert}\sum_{\mathbf p\in S_c}\mathbf p,\qquad S_c=\{\mathbf p:\ c=\arg\min_{j}\lVert\mathbf p-\mu_j\rVert\}
$$
_One k-means step (Lloyd’s algorithm), repeated ten times._

### A short history

The term pixel art was published in 1982 by Adele Goldberg and Robert Flegal at Xerox PARC, but the craft grew from game and computer hardware: the four greens of the 1989 Game Boy, the few colours of the CGA card in 1981, and the 16 colour palettes of home computers. Today it is a deliberate style, used even when hardware limits no longer apply.

### Where it is used

- Game sprites and backgrounds
- Avatars and emoji
- Retro posters and stickers
- App icons with a handmade feel

### Try it

- Game Boy green at low resolution is instantly recognisable. (https://lumenary-studio.vercel.app/style/pixel-art?palette=gameboy&width=48)
- Eight adaptive colours with strong dithering gives a classic 16 bit scene. (https://lumenary-studio.vercel.app/style/pixel-art?colors=8&dither=70)
- Turn on the pixel grid to see each square. (https://lumenary-studio.vercel.app/style/pixel-art?grid=true&width=40)

### Words worth knowing

- **Palette:** The fixed set of colours an image is allowed to use.
- **Ordered dithering:** Faking in-between shades by comparing pixels with a repeating pattern of thresholds.
- **k-means:** A method that finds a few representative colours by repeatedly averaging groups of pixels.

### See also

- 34 Dithering
- 44 Lego Voxel
- 42 Isometric

## 27  Blueprint  ·  _still_

- **Comes from:** Architecture and engineering offices
- **Around:** 1840s process, widely used 1870s to 1990s
- **Works best on:** Buildings, machines and objects with clear outlines

### Why it looks this way

A blueprint is a drawing meant to be read, so it is made of lines: outlines, hatching, dimensions and a title block. This treatment turns your picture into exactly that. Edges become drawn lines, shadow becomes hatching, and the page is furnished with a drafting grid and annotations, so the photograph reads like a technical study.

### How it works

1. Blur the picture and find its edges, with the line weight setting how coarse the neighbourhood is.
2. Where the picture is darker than a threshold, draw a field of diagonal lines, and where it is darker still, cross it with a second set.
3. Add a drafting grid, with every fifth line stronger.
4. Mix paper and line colours according to the strength of lines, hatching and grid.
5. Draw the double border, dimension lines with arrowheads, the title block and registration crosses.

### The mathematics

A blueprint is a drawing, so the picture is turned into lines. Edges come from the usual blur-then-Sobel pass, with the line weight slider setting the Sobel step so thicker lines mean looking at a coarser neighbourhood. Shading is not done with grey but with hatching, as draughtsmen do: where the blurred picture is darker than a threshold a field of diagonal lines is drawn, and where it is darker still a second set at the opposite diagonal crosses it. The lines are one pixel wide, repeated every sp pixels, and found by testing a position’s remainder, so no line has to be drawn at all.

A drafting grid is added the same way (a minor line every 1/40 of the width, with every fifth line stronger). Each pixel’s final colour is a straight mix of the paper colour and the line colour by the strength a of all these things, so lines have soft edges. The sheet furniture is drawn on top: a double border, dimension lines with arrowheads (a filled triangle at each end, rotated to the line’s angle), a title block, and registration crosses at the edge midpoints.

$$
a=\max\Big(S_{\theta,1.7\theta}(\lvert\nabla L_b\rvert),\ a_{\text{hatch}},\ a_{\text{grid}}\Big)
$$
_Line strength at a pixel is the strongest of edge, hatching and grid._

$$
a_{\text{hatch}}=\begin{cases}0.5&D>\lambda_1\ \text{and}\ (x+y)\bmod s<w\\0.4&D>\lambda_2+0.2\ \text{and}\ (x-y)\bmod s<w\end{cases},\qquad D=1-\bar L
$$
_Cross-hatching: D is local darkness; the modulo picks out evenly spaced diagonals._

$$
C=C_{\text{paper}}+(C_{\text{line}}-C_{\text{paper}})\,a
$$
_Linear mix of paper and ink._

### A short history

The cyanotype process, invented by Sir John Herschel in 1842, made white lines on a deep blue ground and let engineers copy drawings cheaply. Anna Atkins used it in the 1840s for her botanical books. Architects and engineers relied on blueprints from the 1870s until diazo prints and then computer drawing replaced them, and the name stuck for any detailed plan.

### Where it is used

- Product and architecture presentation visuals
- Maker and engineering posters
- Technical themed backgrounds
- Mock-up sheets for portfolios

### Try it

- The whiteprint sheet looks like a modern drafting copy. (https://lumenary-studio.vercel.app/style/blueprint?scheme=whiteprint)
- High line detail with heavy hatching gives a rich study. (https://lumenary-studio.vercel.app/style/blueprint?detail=90&hatch=90)
- Rename the sheet to label your own drawing. (https://lumenary-studio.vercel.app/style/blueprint?title=STUDY+NO.+7)

### Words worth knowing

- **Cyanotype:** A photographic printing process that produces a blue image, the origin of the word blueprint.
- **Hatching:** Parallel lines drawn to suggest shade.
- **Title block:** The box on a drawing that gives its name, number and author.

### See also

- 37 Circuit Board
- 15 Victorian
- 06 Futuristic

## 28  Wireframe 3D  ·  _live_

- **Comes from:** Early computer graphics and radio astronomy plots
- **Around:** 1960s onward
- **Works best on:** Pictures with a bright subject on a dark ground

### Why it looks this way

If brightness is read as altitude, a picture becomes a landscape, and a few hundred lines are enough to show it. This treatment builds that landscape and then does by hand what a 3D engine does: it rotates, tilts and projects it. Drawing the lines from back to front and filling under each one hides what is behind it, so ridges appear to stand in front of each other.

### How it works

1. Sample the picture onto a grid and blur it lightly.
2. Turn every grid point into a 3D point whose height is its brightness.
3. Rotate it about the vertical axis, following your cursor or turning on its own, then tilt it towards the camera.
4. Project the points with perspective so nearer ones are drawn larger.
5. Draw lines from back to front, filling under each with the background colour so closer ridges hide farther ones.

### The mathematics

Brightness is read as altitude. The picture is sampled onto a grid (up to 170 columns by the chosen number of lines), lightly blurred, and every grid point becomes a 3D point whose height is its brightness. The program then does what a 3D engine does, by hand: rotate the terrain about the vertical axis (the yaw, which follows your cursor or turns by itself), tilt it toward the camera (the pitch), and project it onto the screen with perspective, so that nearer points are drawn larger.

In ridgeline mode there is no depth buffer. Instead the lines are drawn from the back of the terrain to the front, and each line is first filled with the background colour below it. A closer ridge therefore hides the lines behind it, which is the painter’s algorithm and the way the famous pulsar album cover was drawn. Line opacity and thickness increase toward the front for a sense of depth. Mesh mode skips the fill and draws both rows and columns.

$$
\begin{aligned}X&=x\cos\psi-z\sin\psi,\qquad Z=x\sin\psi+z\cos\psi\\ Y'&=y\cos\varphi-Z\sin\varphi,\qquad Z'=Z\cos\varphi+y\sin\varphi\end{aligned}
$$
_Yaw ψ about the vertical axis, then pitch φ. (x, y, z) is the terrain point, with y = height × brightness._

$$
s=\frac{S\,D}{D-Z'},\qquad (x_{\text{screen}},y_{\text{screen}})=(c_x+X\,s,\ c_y-Y'\,s),\quad D=3.2
$$
_Perspective projection from a camera at distance D; points with larger Z′ (nearer) get a larger scale s._

### A short history

Interactive 3D graphics began with Ivan Sutherland’s work in the 1960s, and the wireframe style defined early games such as Elite in 1984. The hidden-line trick used here is the painter’s algorithm, formalised in the early 1970s. Stacked ridge plots became famous through the 1979 Joy Division album Unknown Pleasures, whose cover reproduces a plot of pulsar pulses first drawn by Harold Craft in his 1970 thesis.

### Where it is used

- Terrain and data visualisation
- Album and poster art
- Technology and science visuals
- Loopable backgrounds for video

### Try it

- Mesh mode draws both rows and columns, like a net over the picture. (https://lumenary-studio.vercel.app/style/wireframe-3d?mode=mesh&lines=56)
- Tall relief seen from a low camera makes a dramatic skyline. (https://lumenary-studio.vercel.app/style/wireframe-3d?height=90&tilt=30)
- Switch off the auto turn and drag across it by hand. (https://lumenary-studio.vercel.app/style/wireframe-3d?spin=0)

### Words worth knowing

- **Perspective projection:** Mapping 3D points to a flat screen so that distant things look smaller.
- **Painter’s algorithm:** Drawing from the farthest thing to the nearest so that nearer things cover the rest.
- **Yaw and pitch:** Turning left or right, and tilting up or down.

### See also

- 40 Oscilloscope
- 42 Isometric
- 43 Low-poly

## 29  Retro VHS  ·  _live_

- **Comes from:** Home video recorders
- **Around:** 1976 to the early 2000s
- **Works best on:** Everyday scenes, party photos and street shots

### Why it looks this way

A worn tape is a record of small mechanical failures: the picture wobbles, colours smear, a band of noise rolls up the screen and the bottom of the frame bends. Each of those flaws is simple arithmetic on lines of the picture, and together they create the feel of a memory that has been replayed too often.

### How it works

1. Raise contrast by 12 percent and add a faint cool cast, as if the picture had been copied.
2. Shift every line sideways by the sum of two slow sine waves plus a little random jitter that changes 24 times a second.
3. Drift a tracking band down the screen, throwing lines far to the side inside it and adding dropout speckle.
4. Sample red, green and blue at slightly different horizontal positions for colour bleed.
5. Dim alternate rows, add static and corner shading, and stamp the PLAY overlay.

### The mathematics

Every flaw of a worn tape is reproduced as arithmetic on scanlines. The picture is first dubbed: contrast is raised by 12% and a faint cool cast added. Then each horizontal line of the picture is shifted sideways by an amount that is the sum of two slow sine waves (the line wobble) and a small random jitter that changes every frame at 24 frames a second. A tracking band, a few percent of the picture tall, drifts down the screen; inside it, lines are thrown far to the side by random amounts, with a bright speckle of dropout noise. The bottom of the frame always carries heavy shifting, as on a real head-switch.

Colour bleed comes from sampling the three channels at different horizontal offsets: red a few pixels to one side (averaged over two taps for a smear), green in place, blue to the other side. Alternate rows are dimmed to make scanlines, a noise table adds static, and a radial gradient darkens the corners. The “PLAY” and counter overlay is drawn as monospace text with a one-pixel offset shadow.

$$
\Delta x(y,t)=a_1\sin(0.05\,y+3.1\,t)+a_2\sin(0.013\,y-1.4\,t)+a_3\,\big(h(y,\text{frame})-\tfrac12\big)
$$
_Horizontal shift of scanline y. The a’s scale with the distortion slider and the width._

$$
\Delta x_{\text{band}}=\Big(1-\frac{\lvert y-y_c(t)\rvert}{b}\Big)^{2}\big(h-0.3\big)\,0.11\,W\,\text{dist}
$$
_Extra shift inside the tracking band of half-height b whose centre y_c moves with time._

$$
R=\tfrac12\big(S_r(x{+}c)+S_r(x{+}c{+}3)\big),\quad G=S_g(x),\quad B=S_b(x{-}c)
$$
_Colour bleed: each channel sampled at its own horizontal offset c._

### A short history

JVC introduced VHS in Japan in 1976, and it won the format battle against Sony’s Betamax in the 1980s. Rental shops and camcorders made it the way a generation recorded birthdays, holidays and television. Each copy lost a little quality, which is why smeared colour and tracking noise now stand for nostalgia.

### Where it is used

- Found footage and horror style visuals
- Music video and lyric clip looks
- Nostalgia posts and stories
- Intros and transitions for retro video

### Try it

- Heavy tracking and noise looks like a tape found in a drawer. (https://lumenary-studio.vercel.app/style/retro-vhs?distortion=90&noise=80)
- Light distortion keeps the picture legible but unmistakably analogue. (https://lumenary-studio.vercel.app/style/retro-vhs?distortion=20&scan=30)
- Hide the PLAY overlay for a cleaner frame. (https://lumenary-studio.vercel.app/style/retro-vhs?osd=false)

### Words worth knowing

- **Tracking:** Keeping the tape head aligned with the recorded lines. When it slips, bands of noise appear.
- **Dropout:** A short white speck or streak where the tape lost its signal.
- **Colour bleed:** Colour that spreads sideways past the edge of an object.

### See also

- 30 Scanlines CRT
- 31 Glitch
- 17 Vaporwave

## 30  Scanlines CRT  ·  _still_

- **Comes from:** Television and early computer monitors
- **Around:** 1930s to the 2000s
- **Works best on:** Bright, colourful pictures and game screenshots

### Why it looks this way

A cathode-ray tube draws a picture one line at a time with a beam that excites coloured phosphor dots on a curved glass face. All of that leaves a trace: the bulging shape, visible lines, a texture of colour stripes and a soft glow. Recreating them in turn makes a flat picture feel as if it is glowing from inside a box.

### How it works

1. For each output pixel work out where it should come from on the flat picture using barrel distortion, which gives the curved face and dark rounded corners.
2. Multiply in the phosphor mask, which makes every third column favour red, green or blue.
3. Dim a soft band once per line pair to make the scanlines, then add static.
4. Add two blurred copies on top for glow.
5. Finish with a vignette, a glass reflection and a bezel with a rounded window.

### The mathematics

A cathode-ray tube has a curved face, so the picture is bent. For each pixel of the output the program works out where on the flat picture it should come from, using a barrel distortion: the further a point is from the centre, the further out it samples, and the corners fall off the edge of the picture and turn black, which gives the rounded corners. The sampled colour is an interpolation of the four nearest pixels.

Three tube effects are multiplied in. The phosphor mask makes every third column favour red, green or blue (or darkens every third column, for an aperture grille). Scanlines dim a soft band once per line pair. Static is a hash of the pixel position. Finally, two blurred copies are added on top for bloom, then a vignette, a glass reflection and a bezel with a rounded window.

$$
f(x,y)=\frac{1+k\,(n_x^{2}+n_y^{2})}{1+k},\qquad k=0.34\cdot\text{curve},\quad n\in[-1,1]
$$
_Barrel distortion factor; the output pixel at normalised position n samples the source at n·f._

$$
s(y)=1-0.55\,\sigma\left(\tfrac12+\tfrac12\cos\frac{2\pi y}{p}\right)
$$
_The scanline dip: σ is the scanline slider and p the line period in pixels._

### A short history

Karl Ferdinand Braun built the first cathode-ray tube in 1897. Television sets from the 1930s used them, colour sets from the 1950s added three phosphors and a shadow mask, and CRT monitors served computers and consoles into the 2000s before flat panels replaced them. Retro games are still designed around CRT blur and scanlines.

### Where it is used

- Retro gaming screenshots and capture overlays
- Nostalgic video and stream looks
- Posters with a vintage screen feel
- Sci-fi and hacker visuals

### Try it

- Strong curve and scanlines look like an old portable television. (https://lumenary-studio.vercel.app/style/scanlines-crt?curve=90&scan=85)
- An aperture grille gives the vertical stripe look of a studio monitor. (https://lumenary-studio.vercel.app/style/scanlines-crt?mask=grille)
- Switch off the bezel to fill the frame with the tube. (https://lumenary-studio.vercel.app/style/scanlines-crt?bezel=false)

### Words worth knowing

- **Phosphor:** A material that glows when struck by the electron beam.
- **Barrel distortion:** A bulging warp, strongest at the edges, like looking at a curved screen.
- **Bloom:** Light that seems to leak around bright areas.

### See also

- 29 Retro VHS
- 31 Glitch
- 40 Oscilloscope

## 31  Glitch  ·  _still_

- **Comes from:** Corrupted digital signals and files
- **Around:** 1990s onward
- **Works best on:** Strong, clean subjects so the corruption stands out

### Why it looks this way

A glitch is a signal that was copied wrongly, and its visual vocabulary is small: colours split apart, strips slide sideways, and blocks appear in the wrong place. This treatment keeps a copy of the picture and drops pieces of that copy back at the wrong positions, which is the same kind of mistake a faulty decoder makes.

### How it works

1. Split the colour channels, taking red a few pixels from the left and blue a few from the right.
2. Keep a copy of the result.
3. Shift thin horizontal strips sideways by random distances, tinting some cyan or magenta.
4. Copy rectangles from one place and paste them somewhere else, some with the difference blend mode to make negatives.
5. Add white hairlines and speckles, using the seed for every random choice.

### The mathematics

A glitch is a signal that was copied wrong. It starts with a channel split: the red of each pixel is taken from a few pixels to the left and the blue from a few to the right, so every edge gets a coloured fringe. A copy of this result is kept, and pieces of the copy are then drawn back over the picture.

Row slices are thin horizontal strips shifted sideways by a random distance (and drawn a second time one picture-width away, so a wrapped strip leaves no gap); some are tinted cyan or magenta. Stolen blocks are rectangles copied from one place and pasted in another, a few with the difference blend mode to turn them to negatives. White hairlines and speckles finish it. Everything random comes from the seed.

$$
R'(x)=R(x-d),\quad G'(x)=G(x),\quad B'(x)=B(x+d)
$$
_Channel split of d pixels._

$$
\text{strip}(y_0,h):\ \ P'(x,y)=P\big((x-\Delta)\bmod W,\ y\big),\quad y_0\le y<y_0+h
$$
_A slice displaced by Δ with wrap-around._

### A short history

Glitch as a creative practice grew from musicians such as Oval in the 1990s who deliberately treated scratched discs as instruments. Visual artists followed with databending, and Rosa Menkman’s Glitch Studies Manifesto of 2010 gave the field a language. Streaming errors, broken downloads and video compression bugs are the everyday cousins of the style.

### Where it is used

- Music and event artwork
- Title cards and transitions
- Tech and cyber themed posters
- Thumbnails that need tension

### Try it

- Maximum channel split without slices looks like a 3D print misregistered. (https://lumenary-studio.vercel.app/style/glitch?rgb=100&slices=0)
- Many strips and stolen blocks give heavy corruption. (https://lumenary-studio.vercel.app/style/glitch?slices=55&blocks=36)
- Turn off the tint for a more monochrome error. (https://lumenary-studio.vercel.app/style/glitch?tint=false)

### Words worth knowing

- **Channel split:** Shifting the red, green and blue layers of a picture against each other.
- **Databending:** Altering the data of a file on purpose to produce visual or audio errors.
- **Difference blend:** A way of combining layers that shows how much they differ, turning equal areas black.

### See also

- 33 Datamosh
- 32 Pixel Sorting
- 29 Retro VHS

## 32  Pixel Sorting  ·  _still_

- **Comes from:** Generative art and creative coding
- **Around:** Around 2010 onward
- **Works best on:** Pictures with a bright sky or large smooth areas

### Why it looks this way

Sorting is the most ordinary operation in computing, and it does something strange to a picture: it keeps the colours but destroys the positions. If only the pixels inside a certain brightness range are sorted, the rest of the picture holds its structure while the chosen parts melt into long, tidy streaks.

### How it works

1. Walk along a column (or row) of the picture.
2. Start collecting pixels when the brightness enters the chosen band.
3. Stop when it leaves the band or when the run reaches a random cap, the streak length.
4. Sort the collected pixels by the chosen key: brightness, hue, red or blue.
5. Write them back in sorted order, leaving every pixel outside the band untouched.

### The mathematics

Pixel sorting takes runs of pixels and puts them in order. Walk along a column (or row); wherever the brightness is inside the chosen band, start collecting pixels, and stop when it leaves the band or when the run reaches a random cap (the streak length). Sort the collected pixels by a key, and write them back in sorted order. Pixels outside the band are never touched, so a sharp structure remains in the places the sorting skips.

The key can be brightness, red, blue or hue. Bright regions sorted from dark to light grow a smear that gets brighter as it goes; reversing the order flips the direction. The cost is a sort per run, so it is O(N log n) for runs of length n.

$$
\text{run}=\{\,p_t,\dots,p_{e-1}\ :\ \ell\le L(p_i)\le h\,\},\qquad e-t\le\text{cap}
$$
_Pixels in the brightness band [ℓ, h], up to a maximum length._

$$
H=\frac{1}{6}\begin{cases}\big((G-B)/c\big)\bmod 6&\max=R\\(B-R)/c+2&\max=G\\(R-G)/c+4&\max=B\end{cases},\quad c=\max-\min
$$
_The hue key, from 0 to 1._

### A short history

Pixel sorting was popularised around 2010 by the artist Kim Asendorf, who published a short script that sorted rows and columns of photographs. It has since become one of the signatures of glitch art. The idea was never new in mathematics, but it was a happy accident to point it at pictures.

### Where it is used

- Album and single artwork
- Poster and cover art
- Abstract wall prints
- Opening frames for videos

### Try it

- Sort horizontally by hue for rainbow smears. (https://lumenary-studio.vercel.app/style/pixel-sorting?dir=h&by=hue)
- Long streaks from a low threshold melt the whole sky. (https://lumenary-studio.vercel.app/style/pixel-sorting?streak=100&lo=15)
- Reverse the order to flip the direction of the smear. (https://lumenary-studio.vercel.app/style/pixel-sorting?reverse=true)

### Words worth knowing

- **Threshold:** A cut-off value that decides whether a pixel is included.
- **Sort key:** The property pixels are ordered by, such as brightness or hue.
- **Run:** A stretch of consecutive pixels that is sorted together.

### See also

- 31 Glitch
- 33 Datamosh
- 13 Surreal

## 33  Datamosh  ·  _still_

- **Comes from:** Video compression errors
- **Around:** 2000s onward
- **Works best on:** Scenes with strong shapes and plenty of colour

### Why it looks this way

Video files save space by storing most frames as instructions: this block came from over there, moved by this much. If the frame that resets the picture is deleted, the instructions keep being applied to old pixels, and colour drags along the motion. Here the picture is split into blocks, each with a motion vector, and the vectors are applied again and again.

### How it works

1. Split the picture into square blocks.
2. Give each block a motion vector from smooth value noise, so neighbours move together in a swirl.
3. Run several frames, each time replacing a block by the block one vector behind it, with a little random variation.
4. With a probability that falls over time, refresh a block from the original so the picture is not entirely lost.
5. Shrink some blocks to one pixel and enlarge them for the flat, blocky patches of damaged video.

### The mathematics

Video compression stores most frames as instructions: “this block came from over there, moved by this much”. Datamoshing deletes the frame that resets the picture, so the instructions keep being applied to old pixels. The treatment imitates this. The picture is split into square blocks, and each block gets a motion vector from smooth value noise, so neighbouring blocks move together in a swirl.

The picture is then run through several frames. In each one, every block is replaced by the block that lies one motion vector behind it, in the previous frame, with a little random variation. After many frames paint is dragged along the vectors, like a smear. Two things keep it from losing the picture completely: with some probability, which falls over time, a block is refreshed from the original, and at the end some blocks are shrunk to one pixel per block and enlarged, which gives the flat, blocky patches of a damaged video.

$$
F_{f+1}(\mathbf b)=F_f\big(\mathbf b-\rho\,\mathbf v_{\mathbf b}\big),\qquad \rho\sim U(0.6,1.4)
$$
_The block at position b takes the content of the block displaced backwards by its motion vector v._

$$
P_{\text{refresh}}(f)=\tfrac12\,\text{keep}\,\Big(1-\frac{f}{F}\Big)
$$
_Chance that a block is restored from the original in frame f of F._

### A short history

Datamoshing appeared in experimental video in the mid 2000s, with early work by artists such as Takeshi Murata, and reached a wide audience through music videos around 2009 and 2010. It exploits the structure of compressed video, in which a few full frames are followed by many frames that only describe change.

### Where it is used

- Music video and visualiser looks
- Transitions and title sequences
- Experimental poster art
- Thumbnails with a motion feel

### Try it

- Long smears with little of the original look like pure paint dragged across the page. (https://lumenary-studio.vercel.app/style/datamosh?frames=40&keep=5)
- Bigger blocks make a rougher, more digital collapse. (https://lumenary-studio.vercel.app/style/datamosh?block=40&flat=25)
- Low motion keeps the picture readable. (https://lumenary-studio.vercel.app/style/datamosh?motion=15&keep=70)

### Words worth knowing

- **Motion vector:** An arrow that says how far and in which direction a block of pixels moved between frames.
- **I-frame:** A full frame in a compressed video, which resets the picture.
- **Value noise:** Smooth random variation made by blending random values placed on a grid.

### See also

- 31 Glitch
- 32 Pixel Sorting
- 29 Retro VHS

## 34  Dithering  ·  _still_

- **Comes from:** Printing and early computer graphics
- **Around:** 1970s onward
- **Works best on:** Smooth gradients and portraits

### Why it looks this way

When there are only a few colours to choose from, a smooth gradient has nowhere to go. Dithering fakes the missing shades by mixing the colours that exist, because your eye blends small dots into an in-between tone. The result keeps the sense of a smooth picture using nothing but black and white, or a handful of colours.

### How it works

1. Shrink the picture by the pixel size and stretch it for contrast.
2. For small palettes, use brightness alone, and for colour palettes, find the nearest colour with a weighting that suits human vision.
3. In ordered dithering, compare each pixel with a fixed pattern of thresholds, a Bayer matrix, and round up or down accordingly.
4. In error diffusion, round the pixel and push the rounding error onto neighbours that have not been processed yet.
5. Enlarge the result without smoothing so the dots stay crisp.

### The mathematics

A dither fakes shades with a handful of colours. The picture is first shrunk (the pixel-size slider) and stretched for contrast. For palettes of four tones or fewer, only brightness is used and the nearest palette tone is found by brightness; for colour palettes the nearest colour is found with a weighting that suits human vision.

There are two families. Ordered dithering compares each pixel with a fixed pattern of thresholds (Bayer’s matrices, built by repeatedly tiling and scaling a smaller one) and rounds up or down accordingly, giving a regular crosshatch. Error diffusion rounds the pixel and pushes the rounding error onto neighbours that have not been processed yet: Floyd-Steinberg spreads it over four of them, Atkinson spreads only three quarters of it over six, which keeps highlights and shadows cleaner and is the look of the first Macintosh.

$$
M_{2n}=\begin{bmatrix}4M_n&4M_n+2\\4M_n+3&4M_n+1\end{bmatrix}
$$
_Bayer matrix recursion; the entries are then normalised to the range −½ to +½._

$$
e=p-q(p),\qquad p_j\leftarrow p_j+w_j\,e
$$
_Error diffusion: p is the pixel, q(p) its palette colour and w the neighbour weights._

$$
\text{Floyd-Steinberg: }\tfrac{7}{16},\tfrac{3}{16},\tfrac{5}{16},\tfrac{1}{16}\qquad\text{Atkinson: }\tfrac18\ \text{ on six neighbours}
$$
_The two diffusion kernels._

### A short history

Bryce Bayer published the ordered dither matrices in 1973, and Robert Floyd and Louis Steinberg described error diffusion in 1976. Bill Atkinson devised the variation used in the original Macintosh’s MacPaint in 1984, spreading only three quarters of the error so highlights and shadows stay clean. Dithering is still used in GIF images, e-paper and printers.

### Where it is used

- Retro computer and Macintosh style art
- E-ink and low power display images
- Printing and engraving with few inks
- Stylised poster and sticker work

### Try it

- Atkinson in the Mac palette is the classic 1984 look. (https://lumenary-studio.vercel.app/style/dithering?method=atkinson&palette=mac)
- Bayer 8 gives a regular woven pattern. (https://lumenary-studio.vercel.app/style/dithering?method=bayer8&scale=3)
- Amber on black is a monochrome terminal. (https://lumenary-studio.vercel.app/style/dithering?palette=amber&method=floyd)

### Words worth knowing

- **Error diffusion:** Passing the rounding error of one pixel to its unprocessed neighbours.
- **Bayer matrix:** A square grid of thresholds designed so the dots spread evenly.
- **Palette:** The fixed set of colours that may be used.

### See also

- 26 Pixel art
- 25 ASCII art
- 38 QR Barcode Art

## 35  Night Vision  ·  _still_

- **Comes from:** Military and wildlife optics
- **Around:** 1960s onward
- **Works best on:** Dark scenes and silhouettes

### Why it looks this way

An image intensifier collects a few photons, multiplies them electronically and shows them on a green phosphor screen. The result is bright but noisy, and its look is easy to recognise: green, grainy, with halos around lights and a round field of view. This treatment lifts the shadows, adds noise and scenery of the same kind.

### How it works

1. Lift the shadows with a power curve whose exponent drops as gain rises, then multiply the result.
2. Add a share of a blurred copy for the glow around bright things.
3. Add noise and rare bright speckles.
4. Send the result through a four-stop ramp: near black, dark green, bright green, almost white.
5. Mask it with a lens (one circle, or two for binoculars), dim every third row and draw the HUD.

### The mathematics

An image intensifier collects a few photons and multiplies them electronically, so everything is a bright green with a lot of noise. The treatment lifts the shadows with a power curve whose exponent drops as gain rises, multiplies the result, adds a share of a blurred copy (the glow around bright things) and adds noise and rare, bright speckles. The result goes through a four-stop colour ramp that is nearly black, then dark green, then bright green, then almost white.

A mask built from circles gives the lens: one for a monocular, two overlapping for binoculars, with a soft darkening near the rim. Every third row is slightly dimmed. The HUD is drawn in text with a crosshair.

$$
v=L^{\,1-0.5g}\,(1+0.9g)+0.35\,g\,L_b+\nu
$$
_g is the gain from 0 to 1, L_b the blurred brightness and ν noise._

$$
C=\operatorname{ramp}\big(\operatorname{clamp}(v);\ \text{stops}\big)
$$
_Colour from the phosphor ramp._

### A short history

Infrared and image-intensifier devices were developed for the military in the 1940s and 50s, and the first generation of starlight scopes reached the field in the 1960s. Later generations were far more sensitive. The green colour is a design choice: the human eye can distinguish more shades of green than of other colours.

### Where it is used

- Thriller and found-footage styled scenes
- Wildlife trail camera looks
- Game and film overlays
- Posters with a surveillance feel

### Try it

- Binocular view with high gain looks like a field scope. (https://lumenary-studio.vercel.app/style/night-vision?view=binocular&gain=85)
- A white phosphor tube is a modern look. (https://lumenary-studio.vercel.app/style/night-vision?tint=white)
- Heavy grain with the HUD off feels like a raw sensor. (https://lumenary-studio.vercel.app/style/night-vision?noise=90&hud=false)

### Words worth knowing

- **Image intensifier:** A tube that amplifies faint light electronically and shows it on a phosphor screen.
- **Gain:** How much a signal is multiplied.
- **Phosphor:** A coating that glows when hit by electrons.

### See also

- 36 Thermal Camera
- 30 Scanlines CRT
- 06 Futuristic

## 36  Thermal Camera  ·  _still_

- **Comes from:** Infrared imaging
- **Around:** 1960s onward
- **Works best on:** Portraits and warm subjects against cooler backgrounds

### Why it looks this way

A thermal camera shows heat as false colour on a small, coarse sensor. This treatment does not measure temperature. It borrows brightness as a stand-in for heat, cuts the picture into sensor cells and sends the values through a colour ramp, so warm, bright areas glow like a body in an infrared scan.

### How it works

1. Cut the picture into cells the size of the sensor pixel, and take the brightness at the centre of each.
2. Add a very small amount of noise to each cell.
3. Treat brightness as heat and stretch its contrast about the middle.
4. Send the heat through the chosen colour ramp.
5. Find the hottest spot, mark it with a crosshair and a reading, and draw the scale bar.

### The mathematics

A thermal camera has a small sensor and shows temperature as false colour. To imitate the coarse sensor, the picture is cut into cells (the sensor pixel), and each cell takes the brightness at its centre; a very small amount of noise per cell is added. Brightness is treated as heat, with contrast stretched about the middle, and the heat value goes through the chosen colour ramp.

The hot spot is the maximum of the heat over a coarse grid (it ignores the borders so the label stays on the picture) and the reading is a straight line from 18 °C to 38 °C. The scale bar draws the same ramp from top to bottom with three labels.

$$
h=\operatorname{clamp}\big((L_b-\tfrac12)\,k+\tfrac12\big),\qquad k=1+1.7\cdot\text{contrast}
$$
_Heat from the blurred brightness._

$$
T=18+20\,h\ \ {}^{\circ}\mathrm{C}
$$
_The temperature shown for heat h between 0 and 1._

### A short history

William Herschel discovered infrared radiation in 1800 by placing a thermometer beyond the red end of a sunlit spectrum. Thermal imaging cameras reached industry and the military in the second half of the twentieth century, and cheaper uncooled sensors in the 1990s took them into firefighting, building inspection and wildlife work. The ironbow palette is a common choice for showing heat.

### Where it is used

- Science and technology posters
- Building and home energy illustrations
- Sci-fi and security camera looks
- Playful “heat vision” portraits

### Try it

- The rainbow palette separates tones the most clearly. (https://lumenary-studio.vercel.app/style/thermal-camera?palette=rainbow)
- A very coarse sensor reads like a cheap early camera. (https://lumenary-studio.vercel.app/style/thermal-camera?sensor=12)
- Black hot flips the scale, as many cameras can. (https://lumenary-studio.vercel.app/style/thermal-camera?invert=true&palette=white)

### Words worth knowing

- **False colour:** Colour that does not come from the real scene but from a scale that maps values to colours.
- **Infrared:** Light just beyond red, invisible to us, emitted by warm objects.
- **Sensor pixel:** One cell of the camera’s detector.

### See also

- 35 Night Vision
- 06 Futuristic
- 26 Pixel art

## 37  Circuit Board  ·  _still_

- **Comes from:** Electronics manufacturing
- **Around:** 1940s onward
- **Works best on:** Portraits and pictures with clear edges and some flat areas

### Why it looks this way

A circuit board is a drawing in copper: straight runs, 45 degree corners, round pads with holes. Those rules happen to turn any picture into a pattern that is both technical and graphic. Here the traces follow the picture’s own edges, snapped to four directions, while the green soldermask still contains the picture itself.

### How it works

1. Tint and darken the picture to make the board surface.
2. In the darkest areas, add a diagonal copper hatch like a ground plane.
3. On a grid, measure the edge direction in each cell, turn it to run along the edge, and snap it to horizontal, vertical or either diagonal.
4. Where traces are crowded, add round pads with holes and small vias.
5. Place chips with pins on calm areas, never overlapping, and print part numbers such as R12 and C7 on empty cells.

### The mathematics

The board colour is the picture itself, tinted and darkened, so the picture is still in the soldermask. In the darkest areas a diagonal hatching of copper is added, like the ground plane of a real board. Over it, copper traces are drawn on a grid. In each cell the edge direction is measured with the Sobel operator on a blurred brightness map; the trace follows the edge, so its direction is perpendicular to the gradient, and it is snapped to the nearest of four angles (horizontal, vertical or the two diagonals), because circuit boards use 45° routing.

Where traces are crowded, round pads with holes and small vias are added at random. Chips are rectangles with pins on their long sides, placed on calm parts of the picture and never overlapping each other, and silk-screen part numbers (R12, C7) are placed on empty cells.

$$
\theta=\operatorname{atan2}(G_y,G_x)+\tfrac{\pi}{2},\qquad q=\operatorname{round}\!\Big(\frac{\theta}{\pi/4}\Big)\bmod 4
$$
_The trace is along the tangent of the edge; q picks one of four directions._

$$
w=w_0\,\big(0.55+0.75\min(1,\,1.6\,m)\big)
$$
_Trace width grows with the edge strength m, relative to the strongest edge._

### A short history

The printed circuit was developed by Paul Eisler in the 1930s and 40s and was used widely in electronics after the Second World War. Its 45 degree routing came from the need to avoid sharp corners that were hard to etch and prone to faults. Today almost every electronic device contains one, and their patterns have become a decorative language of their own.

### Where it is used

- Technology and engineering branding
- Posters for electronics and maker events
- Wallpaper and backgrounds with a hardware feel
- Game and sci-fi interface art

### Try it

- A black board with a dense grid looks like a modern motherboard. (https://lumenary-studio.vercel.app/style/circuit-board?board=black&density=80)
- Lower the edge threshold for many more traces. (https://lumenary-studio.vercel.app/style/circuit-board?thresh=5)
- Remove the chips for a pure trace drawing. (https://lumenary-studio.vercel.app/style/circuit-board?chips=false)

### Words worth knowing

- **Soldermask:** The coloured coating over a board that protects the copper.
- **Via:** A small plated hole that joins traces on different layers.
- **Ground plane:** A large copper area that serves as a shared return path.

### See also

- 27 Blueprint
- 06 Futuristic
- 39 Matrix Rain

## 38  QR Barcode Art  ·  _still_

- **Comes from:** Retail and manufacturing codes
- **Around:** 1950s barcode, 1994 QR code
- **Works best on:** Bold, high contrast pictures and logos

### Why it looks this way

A QR code looks like noise but follows strict structure: three large squares in the corners, a smaller alignment square and alternating timing lines. This treatment copies that structure so the picture looks like a code at a glance, then fills the free cells from the photograph. It will not scan, but it keeps the visual language of a machine-readable label.

### How it works

1. Lay out the three finder squares, the alignment square and the timing lines.
2. Measure brightness for every other module.
3. Add a Bayer threshold to it and make the module black when the result is below a half, which is an ordered dither.
4. In bar mode, stack thin bands and place bars at fixed spacing along each one.
5. Make each bar’s width follow the darkness of the picture, and print a row of digits beneath.

### The mathematics

A QR code is a square of black and white modules with three large squares in the corners that tell a scanner where it is. This treatment keeps those finder patterns, a smaller alignment pattern and the alternating timing lines, so it looks like a code at a glance, and fills every other module from the picture. A module is black when the picture’s brightness there, shifted by a Bayer threshold, is below a half. The shifted threshold is an ordered dither, so mid-greys come out as a regular mix of black and white. It is not a working code and will not scan.

In barcode mode the picture is a stack of thin bands. In each band the bars are placed at a fixed spacing along the width, and the width of each bar follows the darkness of the picture at that point, so dark places have thick bars and light places thin ones. A row of digits is printed under it.

$$
\text{finder}(a,b)=\begin{cases}1&m=3\ \text{or}\ m\le1\\0&m=2\end{cases},\qquad m=\max(\lvert a-3\rvert,\lvert b-3\rvert)
$$
_The 7 × 7 finder pattern: a ring, a gap and a centre block._

$$
\text{module}=1\ \Leftrightarrow\ L+0.9\,(B_{ij}-\tfrac12)<\tfrac12
$$
_Ink when the brightness plus a Bayer offset is below a half._

$$
w=u\,\big(0.12+0.88\,(1-L)\big)
$$
_Bar width in barcode mode, for a unit width u._

### A short history

The barcode was patented by Norman Woodland and Bernard Silver in 1952, and the first product was scanned in a supermarket in 1974. The QR code was created in 1994 by Masahiro Hara at Denso Wave to track car parts in Japan, and it became everyday with smartphone cameras. Real codes use error correction, so part of the code can be damaged and still scan.

### Where it is used

- Packaging and label inspired design
- Tech and retail aesthetic posters
- Backgrounds with a coded look
- Stickers and badges

### Try it

- High detail with round modules softens the grid. (https://lumenary-studio.vercel.app/style/qr-barcode-art?modules=85&dots=true)
- White on black is a night version. (https://lumenary-studio.vercel.app/style/qr-barcode-art?invert=true)
- Switch to bars for a barcode portrait. (https://lumenary-studio.vercel.app/style/qr-barcode-art?mode=bars)

### Words worth knowing

- **Module:** One small square of a QR code.
- **Finder pattern:** The large square in a corner that lets a scanner locate and orient the code.
- **Ordered dither:** Turning grey into black and white dots using a repeating threshold pattern.

### See also

- 34 Dithering
- 25 ASCII art
- 37 Circuit Board

## 39  Matrix Rain  ·  _live_

- **Comes from:** Science fiction cinema
- **Around:** 1999 onward
- **Works best on:** High contrast pictures with a bright subject

### Why it looks this way

The falling green characters are a visual idea about code made visible. Every column of this treatment has its own speed, trail and starting point, and the bright head of each drop leaves a fading trail. The picture appears because a drop glows brighter where the picture is brighter, and because bright regions hold a faint steady glow between drops.

### How it works

1. Reduce the picture to one brightness value per character cell.
2. Give each column its own fall speed, trail length and offset, fixed by the seed.
3. Move the head of each drop down and fade the brightness along the trail behind it.
4. Make drops brighter where the picture is bright, and keep a faint glow in bright regions between drops.
5. Change characters at random, slowly in the trail and quickly at the head, and group them into ten brightness levels so painting stays fast.

### The mathematics

The picture is reduced to one value per character cell. Each column has its own fall speed, trail length and starting offset, all fixed by the seed, so a column is a repeating drop. The head of a drop at time t is a position that moves down at that column’s speed and wraps round after it has left the bottom and its trail has gone. Behind the head the brightness falls off along the trail.

The picture shows through in two ways: a drop is brighter where the picture is brighter, and even between drops the bright parts of the picture hold a faint, constant glow of characters. The characters change at random, using a hash of the column, row and time, slowly in the trail and fast at the head. The head is drawn white with a glow. Characters are batched into ten brightness levels so that the program only changes the paint colour ten times a frame.

$$
h_c(t)=\big(t\,r\,s_c+o_c\big)\bmod(N+\ell_c+6)-0.2\,\ell_c
$$
_Head position of column c in rows. r is the speed slider, s the column speed, o its offset, N the number of rows and ℓ the trail length._

$$
a=\left(1-\tfrac{d}{\ell}\right)^{1.6}\big(1-\sigma+\sigma\,(0.3+1.25\,B)\big)+0.62\,\sigma\,B^{1.4}
$$
_Brightness of the character d rows behind the head. B is the picture brightness at the cell and σ the picture strength._

### A short history

The digital rain was designed for the 1999 film The Matrix by Simon Whiteley, who has said that the characters came from scans of Japanese cookbooks. It became shorthand for the idea of a hidden layer of code, and has been a screensaver, a meme and a tribute many times since.

### Where it is used

- Hacker and code themed backgrounds
- Technology event visuals
- Stream overlays and screensavers
- Title cards for talks and videos

### Try it

- Amber kana looks like a very old terminal. (https://lumenary-studio.vercel.app/style/matrix-rain?tint=amber&glyphs=kana)
- Strong picture strength shows the portrait clearly. (https://lumenary-studio.vercel.app/style/matrix-rain?picture=100)
- Fast, tiny glyphs make a dense downpour. (https://lumenary-studio.vercel.app/style/matrix-rain?size=9&speed=90)

### Words worth knowing

- **Glyph:** The shape of a single character.
- **Trail:** The fading line of characters behind the head of a drop.
- **Hash:** A function that turns inputs into pseudo-random but repeatable numbers.

### See also

- 25 ASCII art
- 35 Night Vision
- 37 Circuit Board

## 40  Oscilloscope  ·  _still_

- **Comes from:** Electronic test equipment
- **Around:** 1930s onward
- **Works best on:** Pictures with a bright subject on a dark ground

### Why it looks this way

An oscilloscope shows a signal as a glowing line on a gridded screen. Stack a few dozen such lines and let each rise with the brightness of the picture, and you get a landscape of peaks that still contains a portrait. Hiding each line behind the one in front is what makes the stack read as a surface.

### How it works

1. Make one trace for each of a set of rows of the picture.
2. Along each trace, make its height above its baseline the brightness raised to the power 1.5, so only the brightest parts become tall peaks.
3. Flatten both ends to the baseline so lines meet the frame.
4. Draw from back to front, filling the area below each trace with the screen colour before stroking it.
5. Add the graticule of eight columns by ten rows and a glow made of two blurred copies.

### The mathematics

The picture is drawn as a stack of waveforms, in the manner of the well-known stacked plot of a pulsar’s pulses. There is one trace for each of n rows of the picture. Along the trace, its height above its baseline is the brightness of the picture at that point, raised to the power 1.5 so that only the brightest parts make tall peaks. Both ends are flattened to the baseline so the lines meet the frame.

Traces are drawn from the back (top) to the front (bottom). To hide the parts of earlier traces that would be behind a later one, each trace fills the area below itself with the screen colour before it is stroked, which is the painter’s algorithm. The graticule has eight columns by ten rows with fine ticks on the centre lines. Glow is two blurred copies added on top.

$$
y_i(t)=b_i-A\,L_b(t,\,b_i)^{1.5}\,e(t),\qquad e(t)=\min\!\big(1,\ 14\min(t,1-t)\big)
$$
_Height of trace i at position t from 0 to 1; b is the baseline and e the taper at the ends._

$$
A=\Delta b\,\big(1.2+4.2\cdot\text{amp}\big)
$$
_The amplitude, in multiples of the spacing between traces._

### A short history

Karl Ferdinand Braun’s cathode-ray tube of 1897 made oscilloscopes possible. In 1958 William Higinbotham at Brookhaven National Laboratory made Tennis for Two, one of the first video games, on an oscilloscope screen. Stacked waveform plots entered popular culture with Joy Division’s Unknown Pleasures in 1979, and a small scene of oscilloscope music has grown since.

### Where it is used

- Music and album artwork
- Science and electronics posters
- Data art and backgrounds
- Retro lab and sci-fi graphics

### Try it

- Amber phosphor with many traces is a delicate engraving. (https://lumenary-studio.vercel.app/style/oscilloscope?phosphor=amber&lines=110)
- Strong amplitude gives tall, dramatic peaks. (https://lumenary-studio.vercel.app/style/oscilloscope?amp=95)
- Turn off hiding to see through every line. (https://lumenary-studio.vercel.app/style/oscilloscope?hidden=false)

### Words worth knowing

- **Graticule:** The grid printed on an oscilloscope screen for reading values.
- **Trace:** The glowing line that shows the signal.
- **Painter’s algorithm:** Drawing the farthest things first so nearer ones cover them.

### See also

- 28 Wireframe 3D
- 30 Scanlines CRT
- 35 Night Vision

## 41  Depth Parallax  ·  _live_

- **Comes from:** Animation, games and phone cameras
- **Around:** 1930s concept, 2010s depth photos
- **Works best on:** Landscapes and tables with a foreground and a background

### Why it looks this way

Two things at different distances shift by different amounts when you move your head, and that difference is parallax. A flat photograph has no distances, so this treatment guesses them: brighter things are nearer, and things lower in the frame are nearer. Shifting each point by its guessed depth makes the flat picture appear to turn as the cursor moves.

### How it works

1. Blend two guesses of depth: brightness, and height in the frame.
2. Blur the depth twice so it changes smoothly instead of with every speck of texture.
3. Move each point sideways in proportion to how far its depth is from the focus plane, in the direction of the camera.
4. Look up the depth where the pixel lands, twice, because the first guess lands on a different depth than the pixel started on.
5. Ease the camera towards the cursor, or let it drift in a slow figure of eight, and run the warp on a small copy for speed.

### The mathematics

A flat photograph has no depth, so the program invents one. Depth is a mix of two guesses: brighter things are nearer (or the reverse, if you choose), and things lower in the frame are nearer, which is true of most landscapes and tables. The brightness is blurred twice so that depth changes smoothly, not with every speck of texture.

To look at the picture from a slightly different place, each point is moved sideways in proportion to how far its depth is from the focus plane, in the direction of the camera, so near and far things shift by different amounts, which is parallax. The shift is found by looking up the depth where the pixel lands, twice, because the first guess lands on a different depth than the pixel started on. The camera follows the cursor with smooth easing, or drifts on a slow figure-of-eight when the cursor is away. The warp runs on a smaller copy of the picture, which is then enlarged, to stay fast on a phone.

$$
D=0.62\,L_b+0.38\,\frac{y}{H}
$$
_The invented depth, between 0 (far) and 1 (near)._

$$
\mathbf s=\mathbf x-\mathbf c\odot\big(\kappa,\ 0.55\,\kappa\big)\,(D-f),\qquad \kappa=\text{depth}\cdot0.075\,W_b
$$
_Where the output pixel x reads from; c is the camera position from −1 to 1 and f the focus plane._

$$
\mathbf c\leftarrow\mathbf c+(\mathbf c^{*}-\mathbf c)\,\big(1-e^{-6\Delta t}\big)
$$
_Easing of the camera towards its target c*._

### A short history

Disney’s multiplane camera, used in the 1930s, created depth in animation by moving painted glass layers at different speeds. Side-scrolling games used the same idea from the early 1980s. In the 2010s phones began to store a real depth map with photographs, which made it possible to move a still picture like a tiny 3D scene.

### Where it is used

- Living photographs and hero images on websites
- Social posts with depth
- Presentation backgrounds
- Previews of depth-aware photos

### Try it

- Maximum depth with dark as near reverses the guess. (https://lumenary-studio.vercel.app/style/depth-parallax?depth=100&near=dark)
- Move the focus plane closer to the front to pin the foreground. (https://lumenary-studio.vercel.app/style/depth-parallax?focus=20)
- Turn off the drift to keep it still until you move. (https://lumenary-studio.vercel.app/style/depth-parallax?drift=false)

### Words worth knowing

- **Parallax:** The apparent shift of near objects against far ones when the viewpoint moves.
- **Depth map:** An image whose values say how far away each pixel is.
- **Focus plane:** The depth that stays still while everything else moves.

### See also

- 42 Isometric
- 28 Wireframe 3D
- 43 Low-poly

## 42  Isometric  ·  _still_

- **Comes from:** Technical drawing, then video games
- **Around:** 1820s theory, 1980s games
- **Works best on:** Pictures with clear light and dark regions, such as cityscapes

### Why it looks this way

Isometric drawing shows three faces of a cube with no vanishing point, so every block has the same size wherever it sits. That makes it a natural way to turn a picture into a city of columns, with height following brightness. Three fixed shades on the three faces suggest a light source and give the flat blocks volume.

### How it works

1. Reduce the picture to a small grid.
2. Make each cell a block with the cell’s colour and a height from its brightness, after an auto-levels stretch.
3. Draw each block as three flat faces: a top, a left side and a right side with fixed brightness multipliers.
4. Project with the 2:1 dimetric view, so a step on a grid axis moves half a tile across and a quarter of a tile down.
5. Draw blocks in order of i plus j, from back to front, and scale the city to fit.

### The mathematics

The picture is reduced to a small grid and every cell becomes a block. A block’s colour is the cell’s colour; its height is the cell’s brightness, stretched so the darkest cell in the picture is as low as the lightest is tall (an “auto-levels” step that keeps flat pictures from producing a flat city). Each block is drawn as three flat faces: a top, a left side and a right side.

The projection is the 2:1 “dimetric” used in pixel-art games, where every step along a grid axis moves half a tile across and a quarter of a tile down. It is not mathematically isometric (which would use 30° and a 1:1.15 ratio) but it keeps lines on whole-pixel steps and looks cleaner. Because there is no depth buffer, blocks are drawn in order of i + j, back to front, so nearer blocks cover farther ones. The three faces get fixed brightness multipliers, which is Lambert shading for a light at a fixed position, and the whole city is scaled to fit the canvas.

$$
X=X_0+(i-j)\,\frac{w}{2},\qquad Y=Y_0+(i+j)\,\frac{w}{4}-h
$$
_Screen position of the top of block (i, j) with tile width w and block height h._

$$
h=\Big(\frac{L-L_{\min}}{\max(0.05,\,L_{\max}-L_{\min})}\Big)^{1.1}H_{\max}+0.08
$$
_Block height from normalised brightness._

$$
C_{\text{top}}=1.08\,C,\qquad C_{\text{left}}=0.62\,C,\qquad C_{\text{right}}=0.40\,C
$$
_Face shading._

### A short history

William Farish formalised isometric projection at Cambridge in 1822, and engineers used it for technical drawings. Video games adopted it in the 1980s with titles such as Zaxxon and Q*bert, and city builders like SimCity 2000 in 1993 made it familiar. The 2:1 version used here keeps lines on whole pixel steps, which is why pixel artists prefer it.

### Where it is used

- Data and city style visualisations
- Game and pixel art backgrounds
- Architecture and infographic art
- Playful poster work

### Try it

- Tall blocks with narrow gaps feel like a dense skyline. (https://lumenary-studio.vercel.app/style/isometric?height=100&gap=10)
- Greyscale blocks look like a clean architectural model. (https://lumenary-studio.vercel.app/style/isometric?mono=true)
- Make dark areas tall to invert the city. (https://lumenary-studio.vercel.app/style/isometric?invert=true)

### Words worth knowing

- **Isometric:** Greek for equal measure: a view in which all three axes are shown at equal scale.
- **Dimetric 2:1:** A projection where each step moves two units across for one down, loved by pixel artists.
- **Lambert shading:** Brightness that depends on the angle between a surface and the light.

### See also

- 44 Lego Voxel
- 43 Low-poly
- 26 Pixel art

## 43  Low-poly  ·  _still_

- **Comes from:** 3D graphics and illustration
- **Around:** 1990s onward
- **Works best on:** Portraits, animals and landscapes with clear forms

### Why it looks this way

Low-poly style rebuilds a picture from a few hundred flat triangles. The skill lies in choosing where to put the corners: many near edges, where the picture changes quickly, and few on flat ground. The triangles are then joined by Delaunay triangulation, which avoids long thin slivers, and each is painted one flat colour.

### How it works

1. Place points along the frame so the mesh covers the whole picture.
2. Try random points, keeping one with a probability that rises with edge strength and only if it is far enough from points already kept.
3. Allow a smaller minimum distance near edges, so triangles are small there.
4. Join the points with Delaunay triangulation by the Bowyer-Watson method.
5. Fill each triangle with the average of four samples of the picture plus a small random brightness change.

### The mathematics

The picture is turned into a mesh of triangles. First points are chosen: some along the frame, so the mesh covers the whole picture, and the rest by random trial. A trial point is kept with a probability that rises with the edge strength there, and it must be at least a minimum distance from every point already kept, with a smaller minimum near edges, so triangles are small where the picture changes quickly and large on flat ground.

The points are joined by Delaunay triangulation, the unique mesh in which no point lies inside the circumscribed circle of any triangle, which avoids long thin triangles. It is built by the Bowyer-Watson method: add the points one at a time; remove every triangle whose circle contains the new point; and join the new point to the edges of the hole. Each triangle is filled with the average of four samples of the picture and a small random brightness change.

$$
P_{\text{keep}}=(1-\beta)\,0.55+\beta\,(0.06+0.94\,e),\qquad r=b\,(0.95-0.62\,\beta\,e)
$$
_Acceptance probability and minimum spacing r; β is “follow edges”, e the edge strength 0 to 1 and b = √(WH/N)._

$$
(x-u_x)^2+(y-u_y)^2<R^2
$$
_Point (x, y) is inside the circumcircle of a triangle with centre u and radius R._

$$
\begin{aligned}u_x&=\frac{a^2(b_y-c_y)+b^2(c_y-a_y)+c^2(a_y-b_y)}{D}\\u_y&=\frac{a^2(c_x-b_x)+b^2(a_x-c_x)+c^2(b_x-a_x)}{D}\end{aligned},\quad D=2\big(a_x(b_y-c_y)+b_x(c_y-a_y)+c_x(a_y-b_y)\big)
$$
_Circumcentre of triangle a, b, c, where a² means a_x² + a_y². The circumradius follows from the distance to any corner._

### A short history

Boris Delaunay described his triangulation in 1934, and Adrian Bowyer and David Watson published the incremental algorithm independently in 1981. Polygon models defined 3D games in the 1990s, from Virtua Fighter to the first PlayStation titles. Later, artists adopted the faceted look on purpose for posters, wallpapers and logos.

### Where it is used

- Wallpapers and posters
- Logos and brand patterns
- Faceted portrait art
- Game and app backgrounds

### Try it

- A few hundred points make a bold, graphic portrait. (https://lumenary-studio.vercel.app/style/low-poly?points=250&shade=50)
- More points that follow the edges keep fine detail. (https://lumenary-studio.vercel.app/style/low-poly?points=1200&edges=90)
- Draw the facet lines to show the mesh. (https://lumenary-studio.vercel.app/style/low-poly?lines=true)

### Words worth knowing

- **Delaunay triangulation:** The mesh in which no point lies inside the circle through any triangle’s corners.
- **Facet:** One flat face of a mesh.
- **Mesh:** A network of connected points and the shapes between them.

### See also

- 22 Vector Art
- 42 Isometric
- 28 Wireframe 3D

## 44  Lego Voxel  ·  _still_

- **Comes from:** Toy bricks and voxel graphics
- **Around:** 1958 brick, 2010s voxel art
- **Works best on:** Bold, colourful subjects and simple faces

### Why it looks this way

A brick mosaic is a palette problem. Each stud can only be one of the colours that bricks come in, so the picture is rebuilt from a small, fixed set. A little ordered dithering lets a smooth gradient become a mix of two neighbouring brick colours, and the drawn studs with their shadows and shine make it feel like plastic.

### How it works

1. Reduce the picture to one pixel per stud, each the average of its patch.
2. Add a small offset from a 4 × 4 Bayer pattern so gradients mix two brick colours.
3. Replace each stud with the nearest brick colour, using a weighting that favours red in bright colours and blue in dark ones.
4. Draw each stud as a short cylinder with a shadow, a darker side, a lighter top and a pale arc of shine.
5. Give each brick a light top and left edge and a dark bottom and right edge.

### The mathematics

The picture is reduced to one pixel per stud, so a stud is an average of its patch. A brick has one of a fixed set of real brick colours, so each stud takes the nearest colour in the set. Distance between colours uses a weighting that gives the red channel more weight when the colours are bright and the blue more when they are dark, which is closer to how colours look than a plain distance. Before the nearest colour is found, a small offset from a 4 × 4 Bayer pattern is added, so that smooth gradients become a mixture of two brick colours instead of one hard step.

Each stud is a short cylinder drawn with a shadow, a darker side, a lighter top and a pale arc of shine. The brick under it gets a light top and left edge and dark bottom and right edge.

$$
d^2=\Big(2+\frac{\bar r}{256}\Big)\Delta R^2+4\,\Delta G^2+\Big(2+\frac{255-\bar r}{256}\Big)\Delta B^2,\qquad \bar r=\frac{R_1+R_2}{2}
$$
_The “redmean” colour distance._

$$
C_{\text{stud}}\in\{0.74\,C,\ 1.07\,C\}
$$
_The side of the stud is drawn at 74% of the brick colour and the top at 107%._

### A short history

The LEGO brick in its modern interlocking form was patented in 1958 in Denmark. Mosaics from plates of single-colour studs became a hobby of their own, and LEGO later sold sets that build art from them. A voxel is a pixel with volume, and games such as Minecraft turned the idea of a world made of cubes into mainstream culture.

### Where it is used

- Toy and kids’ brand visuals
- Party and gift graphics
- Mosaic planning and portrait ideas
- Playful avatars

### Try it

- Fewer studs make a chunkier, more readable mosaic. (https://lumenary-studio.vercel.app/style/lego-voxel?studs=24)
- The greys palette gives a smooth sculptural portrait. (https://lumenary-studio.vercel.app/style/lego-voxel?palette=greys&studs=60)
- Switch the shine off for matte bricks. (https://lumenary-studio.vercel.app/style/lego-voxel?shine=false)

### Words worth knowing

- **Stud:** The round bump on top of a brick.
- **Voxel:** A pixel in three dimensions: a small cube in a grid.
- **Ordered dithering:** Mixing nearby colours in a regular pattern to suggest shades between them.

### See also

- 26 Pixel art
- 42 Isometric
- 34 Dithering

## 45  Retro Console  ·  _still_

- **Comes from:** The first 3D home consoles
- **Around:** Mid 1990s
- **Works best on:** Scenes with depth: streets, rooms, landscapes

### Why it looks this way

Early 3D consoles had to draw a world thirty times a second on very little hardware, and every shortcut left a mark. Polygon corners snapped to whole pixels, so surfaces wobbled. Textures were stretched without perspective, so they swam. Colour was stored in few bits and dithered. Distance was hidden in fog. Together those faults are a look that a generation remembers.

### How it works

1. Shrink the picture to a few hundred lines.
2. Lay a mesh over it, nudge every corner and round it to a whole pixel.
3. Inside each triangle, read the picture at a straight blend of its three corners, with no perspective.
4. Fade the upper part of the frame toward a fog colour taken from the picture.
5. Cut the colour to a small depth, deciding ties with a 4 by 4 Bayer pattern.
6. Enlarge without smoothing and darken part of every line.

### The mathematics

The picture is shrunk until its longer side has the chosen number of lines, and a mesh of squares about one eleventh of the frame high is laid over it. Every corner of the mesh is nudged by a random amount and then rounded to a whole pixel, which is what early consoles did to the corners of their polygons. Each square is split into two triangles, and inside a triangle the place the texture is read from is a straight blend of its three corners. That blend ignores perspective, so the picture kinks along the diagonal of every square and seems to swim. Each triangle is also lit as one flat face, a few percent lighter or darker than its neighbour.

Distance is faked by height in the frame: the upper part fades toward a fog colour taken from the average of the top third of the picture. Finally the colour is cut to the chosen depth, 32, 8 or 4 levels a channel. A value between two levels is rounded up or down by comparing its remainder with a 4 by 4 Bayer matrix, so a smooth gradient becomes a regular weave of two neighbouring shades instead of a band. Scan lines darken the lower part of every picture line, and the game display is drawn into the small frame so that its pixels match the picture’s.

$$
\mathbf u=(1-s-t)\,\mathbf v_{00}+s\,\mathbf v_{10}+t\,\mathbf v_{01},\qquad s+t<1
$$
_Where a pixel reads the texture: s and t are its position inside the square, v the nudged and rounded corners. The other triangle uses the three remaining corners the same way._

$$
q=\Big\lfloor\frac{c}{\Delta}\Big\rfloor+\Big[\operatorname{frac}\frac{c}{\Delta}>\tfrac12+\big(B_{x,y}-\tfrac12\big)\,a\Big],\qquad \Delta=\frac{255}{n-1}
$$
_Ordered dithering of a channel value c to n levels: B is the Bayer threshold at the pixel (0 to 1) and a the dithering slider._

$$
C\leftarrow C+(C_{\text{fog}}-C)\cdot f\cdot\max\!\Big(0,\,1-\frac{y}{0.62\,h}\Big)\,(0.55+0.45\,L)
$$
_Fog: strongest at the top of the frame, gone below 62% of its height; f is the fog slider._

### A short history

Home consoles moved to 3D in the mid 1990s: the Sega Saturn and the first Sony PlayStation in 1994, the Nintendo 64 in 1996. The PlayStation worked with whole-pixel vertex positions and textures mapped without perspective correction, which gave its games their famous shimmer, and it dithered its 15-bit colour. Around 2015 independent developers began to copy those limits on purpose, and the “low-poly retro” look became a style in its own right.

### Where it is used

- Game jam art and retro game mock-ups
- Music visuals and album covers
- Nostalgic social posts
- Title screens for videos

### Try it

- Few lines and 64 colours go back to the earliest 3D. (https://lumenary-studio.vercel.app/style/retro-console?lines=120&depth=6)
- Full wobble with no fog shows the mesh at work. (https://lumenary-studio.vercel.app/style/retro-console?wobble=100&fog=0)
- Turn the display and scan lines off for a clean low-resolution frame. (https://lumenary-studio.vercel.app/style/retro-console?hud=false&scan=false)

### Words worth knowing

- **Affine mapping:** Stretching a texture across a triangle in straight proportion, ignoring perspective.
- **Vertex:** A corner of a polygon.
- **Ordered dithering:** Mixing two shades in a fixed pattern to suggest the shades between them.

### See also

- 26 Pixel art
- 43 Low-poly
- 34 Dithering

## 46  Pixel Platformer  ·  _still_

- **Comes from:** Side-scrolling platform games
- **Around:** 1985 to the mid 1990s
- **Works best on:** Pictures with clear light and dark areas

### Why it looks this way

A platform level is a grid. Every square is either something to stand on or empty air, and a whole world is built from a small set of tiles. Treat the dark parts of a picture as ground and the light parts as sky and it becomes such a level: blocks, ledges with grass, coins to collect and a score along the top.

### How it works

1. Divide the picture into tiles of eight game pixels.
2. Average each tile for its colour and brightness.
3. Sort the brightnesses and make the darkest share of the tiles solid.
4. Draw solid tiles as bevelled brick blocks, and put grass on every block with air above it.
5. Show the picture itself, coarsely, in the open tiles.
6. Hang coins above some ledges, stand the little explorer on one, and draw the score bar.

### The mathematics

A tile is eight game pixels square, and the number of tiles across fixes the size of a game pixel. The picture is sampled at four by four points per tile; their average gives the tile its colour and its brightness. Which tiles are solid is decided by rank, not by a fixed brightness: all the tile brightnesses are sorted, and the value at the chosen fraction of the list becomes the threshold. A dark photograph and a pale one therefore both produce a level with the same share of ground.

A solid tile is drawn as a block: its colour, a lighter edge above and to the left, a darker edge below and to the right, and two courses of brick. A solid tile with open air above it is a ledge and grows a cap of grass with a ragged lower edge. Open tiles show the picture itself at four blocks to the tile, so it stays readable behind the level. Colours are made more saturated and then rounded to 32 levels a channel, which is how sixteen-bit consoles stored them. A coin is hung above a ledge with a probability set by the slider, wherever the two tiles above it are free.

$$
g=\operatorname{round}\!\Big(\frac{W}{8\,n}\Big),\qquad T=8\,g
$$
_Size of a game pixel g and of a tile T, from the canvas width W and n tiles across._

$$
\theta=L_{(\lceil q\,N\rceil)},\qquad \text{solid}\iff L_{ij}\le\theta
$$
_The threshold is the brightness of the tile at rank qN in sorted order; q is the “how much is solid” slider._

$$
c'=\frac{255}{31}\,\operatorname{round}\!\Big(\frac{31\,c}{255}\Big)
$$
_Five bits a channel: 32 levels._

### A short history

Donkey Kong (1981) made jumping between platforms a game, and Super Mario Bros. (1985) made the level scroll. Consoles of the time drew the screen from a table of small tiles, usually 8 by 8 pixels, because memory was too scarce to store whole pictures. The 16-bit machines that followed around 1990 kept the tiles and added more colours and layers. Tile maps are still how most 2D games are built.

### Where it is used

- Birthday and invitation cards
- Game-themed profile pictures
- Classroom and coding club posters
- Retro thumbnails for videos

### Try it

- More solid tiles turn the picture into a cave. (https://lumenary-studio.vercel.app/style/pixel-platformer?ground=70)
- Small tiles keep more of the picture. (https://lumenary-studio.vercel.app/style/pixel-platformer?tiles=38&coins=20)
- The green handheld palette has just four shades. (https://lumenary-studio.vercel.app/style/pixel-platformer?palette=handheld)

### Words worth knowing

- **Tile:** A small square image reused many times to build a level.
- **Tile map:** The grid that says which tile goes where.
- **Sprite:** A small picture, such as a character or a coin, drawn over the background.

### See also

- 26 Pixel art
- 44 Lego Voxel
- 45 Retro Console

## 47  Hologram HUD  ·  _live_

- **Comes from:** Science fiction film and aircraft cockpits
- **Around:** 1950s displays, 1977 film holograms
- **Works best on:** A single subject with strong outlines

### Why it looks this way

A film hologram is drawn in light, so it can only add brightness and can never be darker than the room. It is built of scan lines, it flickers because the signal is weak, and it is surrounded by instruments that tell you someone is measuring it. This treatment rebuilds each of those signs: light added to darkness, lines, dropouts, tearing and a ring of dials.

### How it works

1. Turn the picture into a layer of one colour, most solid where it is bright and along its outlines.
2. Add that layer to a dark ground, flickering, with a dropout now and then.
3. Redraw a few bands shifted sideways to tear the image.
4. Slide a pattern of dark scan lines upward and sweep a bright band down.
5. Draw brackets, a reticle that follows the cursor, turning rings and moving bars.

### The mathematics

The picture is turned into a layer of coloured light. Its opacity at a pixel grows with the brightness there and with the edge strength (blur, then Sobel), so outlines are the most solid part, and the colour is pushed toward white along the same outlines. The layer is added to a near-black ground, since light adds. The whole layer flickers as the product of two sine waves of unrelated frequency, and fourteen times a second a hash decides whether it drops to 45% for an instant.

Tearing is done nine times a second: up to three horizontal bands are drawn a second time, shifted sideways. Scan lines are one small strip of pattern tiled down the frame and slid upward at a steady speed, and a brighter band sweeps down every few seconds. The instruments are plain strokes: corner brackets, a reticle that eases toward the cursor (and wanders on a figure of eight when left alone), rings of ticks turning at different speeds and a row of bars whose heights follow value noise in time.

$$
\alpha=\operatorname{clamp}\big(0.1+0.75\,L+k\,\lvert\nabla L\rvert\big),\qquad k=2.6\cdot\text{outline}
$$
_Opacity of the hologram layer at a pixel._

$$
a(t)=\big(1-0.14f+0.14f\,\sin 31t\,\sin 7.3t\big)\cdot d(t)
$$
_Brightness of the whole layer: f is the flicker slider, d is 0.45 during a dropout and 1 otherwise._

$$
\mathbf r\leftarrow\mathbf r+(\mathbf r^{*}-\mathbf r)\,\min(1,\,6\,\Delta t)
$$
_The reticle r eases toward its target r*, the cursor or the idle path._

### A short history

Dennis Gabor invented holography in 1947 and received the Nobel Prize for it in 1971, but the flickering blue figure most people picture comes from cinema, above all the message scene in Star Wars (1977). The head-up display is older and real: military aircraft began projecting flight data onto glass in front of the pilot in the 1950s. Film designers joined the two into the screen language of science fiction.

### Where it is used

- Science fiction titles and overlays
- Gaming channel intros
- Tech event visuals
- Interface concept art

### Try it

- Amber light and slow flicker look like an old radar. (https://lumenary-studio.vercel.app/style/hologram-hud?colour=amber&flicker=15)
- Heavy tearing makes a signal about to be lost. (https://lumenary-studio.vercel.app/style/hologram-hud?glitch=100&flicker=80)
- Hide the instruments to keep only the projected figure. (https://lumenary-studio.vercel.app/style/hologram-hud?hud=0&lines=80)

### Words worth knowing

- **HUD:** Head-up display: information drawn over the view so you need not look down.
- **Reticle:** The aiming mark at the centre of a sight.
- **Additive blending:** Combining colours by adding their light, so the result only gets brighter.

### See also

- 60 Holographic
- 30 Scanlines CRT
- 35 Night Vision

## 48  Data Bars  ·  _still_

- **Comes from:** Statistical graphics
- **Around:** 1786 bar chart, 2010s data art
- **Works best on:** Bold shapes with strong light and shade

### Why it looks this way

A bar chart turns a number into a height. A picture is a grid of numbers, one brightness for every spot, so it can be charted: slice it into rows, and in each row let a bar stand as tall as the picture is bright. From across the room the bars blend into the picture. Up close each row is a true chart of one strip of it.

### How it works

1. Average the picture down to a grid, one cell for each bar.
2. Take each cell’s brightness, or its darkness, as the value.
3. Give every row its own baseline and raise a bar from it in proportion to the value.
4. Fill the bar with the cell’s colour, with a gold ramp, or as a block with a top and a side.
5. Rule the baselines and write the scale once.

### The mathematics

The picture is averaged down to a grid with one cell for each bar. A cell’s value is its brightness, or one minus its brightness when bars are to stand tall on the dark parts. Each row of the grid has its own baseline, and a bar rises from it to a height in proportion to the value, never quite to nothing: the smallest bar is 3% of the full height. Read from a distance the rows of bars are a coarse halftone; read up close each row is an honest chart of the brightness along one strip of the picture.

The three looks differ only in how a bar is filled. Flat bars take the cell’s own colour, a little more saturated. Gold bars ignore the colour and read a ramp of five golds by the value, with a light stripe and a dark flank to suggest polished metal. Blocks add a side and a top, each a parallelogram pushed back and up by the same offset, one darker and one lighter than the face. That is an oblique projection, the kind used in spreadsheet charts.

$$
h=H_{\text{full}}\,(0.03+0.97\,v),\qquad v=L\ \text{or}\ 1-L
$$
_Bar height from the cell value v. H_full is 86% of the row height._

$$
t=0.2+0.8\,v,\qquad C_{\text{gold}}=\operatorname{ramp}(t)
$$
_Gold look: the value picks a place on a ramp from dark bronze to pale gold._

$$
(x,\,y,\,z)\ \mapsto\ \big(x+z,\ y-\tfrac12 z\big)
$$
_Blocks: a point z behind the face is drawn to the right and half as far up._

### A short history

William Playfair published the first bar chart in 1786, comparing Scotland’s trade with its partners, and in a few pages invented the line chart and later the pie chart as well. Bars became the plainest way to compare amounts. In the 2010s designers began treating data as material: charts built as physical objects, and “bar chart races” in which the bars overtake each other in time.

### Where it is used

- Covers for reports and presentations
- Posters for data and finance events
- Portraits for analysts and scientists
- Section dividers in dashboards

### Try it

- Gold bars on black suit an awards slide. (https://lumenary-studio.vercel.app/style/data-bars?look=gold&bars=70)
- Blocks on paper look like a printed 3D chart. (https://lumenary-studio.vercel.app/style/data-bars?look=blocks&ground=paper&bars=36)
- Let the bars stand tall on the dark parts for a negative. (https://lumenary-studio.vercel.app/style/data-bars?tall=dark)

### Words worth knowing

- **Baseline:** The line a bar stands on, where its value is zero.
- **Oblique projection:** A simple way to draw depth: the back is shifted sideways and up, with no vanishing point.
- **Halftone:** A picture made from marks whose size carries the tone.

### See also

- 80 Halftone
- 42 Isometric
- 25 ASCII art

## 49  X-ray  ·  _still_

- **Comes from:** Medical radiography
- **Around:** 1895
- **Works best on:** Objects and portraits with clear structure

### Why it looks this way

X-rays pass through soft things and are stopped by dense ones, and the film records what got through. So a radiograph is a negative: bone is pale, air is black, and edges glow where a dense shell is seen side on. The treatment turns the picture’s tones over, sharpens its structure, adds the grain of a short exposure and tints it like blue-based film on a light box.

### How it works

1. Turn the brightness over, so dark things become bright.
2. Push each pixel away from the average of its surroundings to bring out structure.
3. Add the edge strength, so outlines shine.
4. Add noise that is strongest in the darker greys.
5. Darken a soft border where the collimator kept the beam off the film.
6. Tint from the film’s base colour to its full density, then add a glow, a lead letter and a line of data.

### The mathematics

A radiograph is a negative: dense things stop the rays and stay pale on the film. The treatment therefore turns the stretched brightness over, so that the dark parts of the picture shine. Structure is then added by unsharp masking: each pixel is pushed away from the average of its surroundings, taken from a copy blurred twice with a box of radius 14 pixels. Edge strength from the Sobel operator is added on top, which makes outlines glow the way the dense shell of a bone does, and a power of 1.25 deepens the mid tones.

Noise is added in proportion to how dark a pixel is, because in a real exposure the grainiest areas are the ones that received the fewest photons. The collimator, the pair of lead shutters that limits the beam, is a soft-edged rectangle that leaves the border of the film almost unexposed. Colour comes last: each channel is blended from the film’s base colour to its full density along a slightly different curve, red slowest and blue fastest, which gives the blue cast of medical film. A soft glow, a lead letter and a line of exposure data finish the plate.

$$
v\leftarrow\operatorname{clamp}\!\big(v+s\,(v-\bar v)+k\,\lvert\nabla L\rvert\big)^{1.25},\qquad v=1-L
$$
_Structure: v̄ is the wide blur of v, s the structure slider times 1.5 and k the bright-edges slider times 1.6._

$$
v\leftarrow v+g\,\eta\,\big(0.4+0.6\,(1-v)\big)
$$
_Mottle: η is noise between −1 and 1, g the mottle slider times 0.16._

$$
R=\operatorname{lerp}(b_R,f_R,\,0.4t^{2}+0.6t),\quad G=\operatorname{lerp}(b_G,f_G,\,t),\quad B=\operatorname{lerp}(b_B,f_B,\,t^{0.82})
$$
_From film base b to full density f; t is the eased value 0.35 S(v) + 0.65 v._

### A short history

Wilhelm Röntgen discovered X-rays in Würzburg in November 1895 while experimenting with a cathode-ray tube, and within weeks made the famous image of his wife Anna Bertha’s hand with her ring. He received the first Nobel Prize in Physics in 1901. Hospitals adopted the method within a year. Film gave way to digital detectors from the 1980s onward, but the convention of pale bone on a dark ground has stayed.

### Where it is used

- Halloween and horror graphics
- Science and medical teaching material
- Album covers and band posters
- Product teardown illustrations

### Try it

- Strong structure and bright edges read as bone. (https://lumenary-studio.vercel.app/style/x-ray?structure=90&edges=85)
- Fluoroscope green looks like a live screen from the 1950s. (https://lumenary-studio.vercel.app/style/x-ray?film=green&glow=70)
- Leave the tones the right way up for a ghostly print. (https://lumenary-studio.vercel.app/style/x-ray?invert=false&film=sepia)

### Words worth knowing

- **Radiograph:** A picture made by X-rays passing through an object.
- **Collimator:** Lead shutters that limit the beam to the area being examined.
- **Unsharp masking:** Sharpening by subtracting a blurred copy of a picture from itself.

### See also

- 35 Night Vision
- 36 Thermal Camera
- 116 Infrared

## 50  CCTV  ·  _live_

- **Comes from:** Security and surveillance video
- **Around:** Closed-circuit television from the 1940s, digital recorders from the 1990s
- **Works best on:** Wide scenes with a figure or object away from the middle

### Why it looks this way

Security video looks the way it does because of what it is for: to record a lot, cheaply, for a long time. A wide lens sees the whole room, a slow frame rate and heavy compression keep the files small, and a cheap sensor fills the dark with noise. None of it is meant to be beautiful, which is why it reads as evidence, and why a gentle portrait run through it suddenly feels like something caught.

### How it works

1. Bend the picture with a barrel lens so the middle swells and the corners pull in and darken.
2. Wash the colour out, or turn it to grey or to the green of night vision, then add sensor noise and a flicker of the gain.
3. Take a new frame only a few times a second and hold it in between.
4. Flatten each small block of the frame towards its own average colour, and now and then let a block fail to update.
5. Score a coarse grid by how much changed there, or how busy the picture is, and draw a tracking box round the best cluster.
6. Stamp the camera name, a running clock and a blinking REC dot over the top.

### The mathematics

The lens is a lookup table built once for the picture size. For a pixel at offset d from the centre, measured in half diagonals, the picture is read at the point d / f, where f = 1 - 1.6 k r^2 + 0.1 k, r is the distance from the centre and k is 0.55 times the lens slider. Because f falls towards the corners, the lookup there reaches farther out, so the corners are pulled in and the middle swells: barrel distortion. The same table holds a vignette that darkens with r, more strongly for a stronger lens. Colours are read from the nearest pixel, as a cheap sensor would.

Each camera frame is built pixel by pixel: the colour is washed to 55% saturation, or turned to grey, or mapped to a green ramp from (l - 110) x 1.45 + 120, then multiplied by the vignette and a flicker factor and added to noise taken from a hash of the pixel and the frame number. Compression then works on blocks about W/80 pixels wide: each block is pulled towards its mean by a factor that falls from 1 to 0.22 as the compression slider rises, and with probability 0.045 Q^2 a block keeps its previous contents. A new frame is made only every 1/fps seconds, and between frames the last one is shown with every other line darkened by 12%, for interlacing.

The tracking box comes from a grid 20 cells wide. On a video each cell sums the colour change since the last camera frame; on a still picture it sums the strength of the edges (a Sobel filter). The grid is blurred by one cell, the highest cell is found, and the box is the bounding box of the cells within three of it that score above 45% of it. The box moves 40% of the way to its target at every camera frame, so it follows smoothly. On a still picture the detector swaps to the second best place every 3.2 seconds.

$$
f=1-1.6\,k\,r^{2}+0.1\,k,\qquad \mathbf p_{\text{src}}=\mathbf c+\frac{\mathbf p-\mathbf c}{\max(0.35,\ f)}
$$
_The barrel lens: r is the distance from the centre in half diagonals and k is 0.55 times the lens slider._

$$
C'=\bar C_b+(1-0.78\,Q)\,(C-\bar C_b)
$$
_Compression: every pixel of a block moves towards the block average; Q is the compression slider (0 to 1)._

$$
P(\text{block frozen})=0.045\,Q^{2}
$$
_The chance, at each camera frame, that a block keeps its old contents._

### A short history

Closed-circuit television was first used in Germany in 1942 to watch rocket launches from a safe distance, and spread to banks and shops in the 1960s. Tapes were reused until they wore out, which gave the grainy, smeared look. Digital recorders in the 1990s replaced tape with block-based compression, whose square artefacts became the new signature. Motion detection, which records only when the picture changes, followed soon after and is behind the boxes drawn over the footage in modern systems.

### Where it is used

- Thriller and found-footage scenes
- Album art and lo-fi music videos
- Social posts that look like caught evidence
- Game and escape-room props

### Try it

- Night vision with heavy compression turns any picture into a grainy infrared recording. (https://lumenary-studio.vercel.app/style/cctv?look=night&quality=80&noise=60)
- Slow the camera to three frames a second and strengthen the lens for an old lobby feed. (https://lumenary-studio.vercel.app/style/cctv?fps=3&lens=70)
- Switch off the overlay and the box to keep only the look of the video itself. (https://lumenary-studio.vercel.app/style/cctv?osd=false&detect=false)

### Words worth knowing

- **Barrel distortion:** A lens effect in which straight lines bow outward and the middle of the picture swells.
- **Macroblock:** A small square of a compressed video frame that is stored and updated as a unit.
- **Gain:** The amplification of the sensor signal; more gain brightens a dark scene and adds noise.

### See also

- 29 Retro VHS
- 35 Night Vision
- 36 Thermal Camera

