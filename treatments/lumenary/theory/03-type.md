# C. Typographic

Source: https://lumenary-studio.vercel.app/theory/type (captured 2026-11-16 for private study).

Pictures built from letters: set, written, flipped and printed, one glyph at a time.

## 51  Kinetic type  ·  _live_

- **Comes from:** Film titles and motion graphics
- **Around:** 1950s onward
- **Works best on:** Colourful, busy pictures that fill the frame

### Why it looks this way

Type is usually something you read, but set huge and moving it becomes a window. This treatment fills the screen with heavy words that slide in alternating directions, and lets the picture show only through the letters. Because every row travels at its own speed and starts at its own phase, the composition never repeats exactly.

### How it works

1. Set the words in an extra heavy typeface and repeat them along each row with a gap.
2. Slide every row at its own speed, alternating direction, with each row starting at a different phase.
3. Draw all filled rows in white on a separate mask.
4. Brighten the picture with a gamma curve and keep it only where the mask is opaque.
5. Draw the outline rows as strokes on top of the background.

### The mathematics

The words are rendered in an extra-heavy typeface, repeated along each row with a gap between repeats, and every row slides at its own speed in alternating directions. The speed of row i is a base speed times a factor that cycles through three values, and each row starts at a different phase, so the rows never line up and the composition keeps changing.

The picture appears through the letters by masking. All filled rows are drawn in white into a separate mask canvas; the picture (brightened first) is drawn into a third canvas, and the “destination-in” blend keeps the picture only where the mask is opaque. Nothing is cut out pixel by pixel: the compositor does a per-pixel multiplication of picture by mask for us. Outline rows are drawn directly as strokes on top of the background. The brighten slider is a gamma curve applied through a 256-entry lookup table, so the cost is one table read per channel.

$$
\text{offset}_i=\Big(t\,v_i\,d_i+0.31\,i\,w\Big)\bmod w,\qquad v_i=\tfrac{s}{100}\,0.32\,W\,\big(0.6+0.25\,(i\bmod 3)\big)
$$
_Horizontal position of row i: direction d_i = ±1 alternates, w is the width of one repeat of the words._

$$
C_{\text{out}}=C_{\text{picture}}\cdot M_\alpha
$$
_Destination-in compositing: picture colour times the mask’s alpha._

$$
g=1-\tfrac12\,\frac{\text{lift}}{100},\qquad c'=255\,\Big(\frac{c}{255}\Big)^{g}
$$
_Gamma lift; g < 1 brightens the mid-tones._

### A short history

Moving type became a craft in the 1950s and 60s through title designers such as Saul Bass, whose opening for North by Northwest in 1959 is often cited as an early landmark. Desktop animation software in the 1990s opened it to everyone, and lyric videos, sports promos and social media captions now rely on it constantly.

### Where it is used

- Opening titles and lyric videos
- Event and festival promos
- Social media headline graphics
- Looping website banners

### Try it

- Fewer, bigger rows let the picture read through clearly. (https://lumenary-studio.vercel.app/style/kinetic-type?rows=4&lift=70)
- Many rows at high speed feel like a ticker wall. (https://lumenary-studio.vercel.app/style/kinetic-type?rows=11&speed=80)
- Use your own word. (https://lumenary-studio.vercel.app/style/kinetic-type?text=HELLO)

### Words worth knowing

- **Kinetic typography:** Text that moves as part of the design.
- **Mask:** A shape that decides which parts of an image stay visible.
- **Gamma curve:** A curve that brightens or darkens mid tones without changing black and white.

### See also

- 57 Ticker Text
- 52 Split-flap
- 55 Newspaper

## 52  Split-flap  ·  _live_

- **Comes from:** Railway stations and airports
- **Around:** 1950s to the 2000s
- **Works best on:** High contrast pictures with simple shapes

### Why it looks this way

A split-flap board has no screen: each character is a drum of flaps, and to change a letter the drum clatters through every character in between. This treatment recreates that. A cell showing a target number flips that many times, and since cells start with different delays the picture resolves as a ripple across the board.

### How it works

1. Turn the picture into a grid of cells and read the brightness of each.
2. Pick a target position on the drum from the brightness: a ten symbol drum from blank to heavy, or letters and digits.
3. Flip each cell through that many flaps at 70 milliseconds a flap.
4. Delay each cell according to its row, column and a little random hash, so the picture appears in a diagonal wave.
5. Draw each flap in two halves: the top shrinks towards the hinge, then the new bottom opens out.

### The mathematics

A real split-flap board holds a drum of characters; to show a letter, the drum flips through every character before it, one flap at a time. The program does exactly that. The picture becomes a grid of cells, and each cell’s brightness picks a target position on its drum (a ten-symbol drum running from blank to heavy, or the alphabet and digits). A cell showing target number t flips t times at a fixed 70 milliseconds a flap.

Cells do not start together. Each has a delay that grows with its column and row plus a small random amount from a coordinate hash, so the picture resolves in a diagonal ripple. After a hold, the board flips on through the rest of the drum back to blank, and the cycle repeats. A single flap is drawn in two halves: in the first half of its turn the top flap falls, shrinking vertically toward the hinge; in the second half the new bottom flap opens out. The vertical scale of a hinged card seen from the side is the cosine of its angle; the code uses a straight line from 1 to 0 to 1 as a cheap stand-in for that cosine, which looks the same at this speed.

$$
t_i=\operatorname{round}\big(L'_i\,(M-1)\big),\qquad L'=\operatorname{clamp}\big((L-\tfrac12)\cdot1.4+\tfrac12\big)
$$
_Target drum position of cell i on a drum of M characters._

$$
\delta_{x,y}=0.011\,x+0.009\,y+0.08\,h(x,y),\qquad s=\Big\lfloor\frac{\tau-\delta}{0.07}\Big\rfloor
$$
_Start delay of a cell, and the number of flaps it has completed at time τ._

$$
\text{scale}=\begin{cases}1-2f&0\le f<\tfrac12\ \text{(top flap falls)}\\2f-1&\tfrac12\le f<1\ \text{(bottom flap opens)}\end{cases}\ \approx\ \lvert\cos\pi f\rvert
$$
_Vertical scale of the moving flap during one flip, f being progress through it._

### A short history

Flap displays were developed in the 1950s, and the Italian company Solari di Udine made them a fixture of railway stations and airports across the world. Their rhythm of clacking was one of the sounds of travel until LED and LCD boards replaced most of them in the 2000s and 2010s. Some are still kept for their charm.

### Where it is used

- Departure board style title graphics
- Retro station and travel themed posters
- Intros and countdowns
- Reveal animations

### Try it

- Letters and digits make the picture spell out its tones. (https://lumenary-studio.vercel.app/style/split-flap?charset=alnum)
- More tiles give a sharper reveal. (https://lumenary-studio.vercel.app/style/split-flap?cols=70)
- Original colours turn it into a flipping mosaic. (https://lumenary-studio.vercel.app/style/split-flap?color=original&cols=30)

### Words worth knowing

- **Drum:** The rotating spool of flaps that carries the characters.
- **Hinge:** The line along which each flap turns.
- **Hash:** A function that gives repeatable pseudo-random numbers from inputs.

### See also

- 57 Ticker Text
- 51 Kinetic type
- 44 Lego Voxel

## 53  Handwritten  ·  _still_

- **Comes from:** Notebooks and calligrams
- **Around:** Ancient, with calligrams from 1918
- **Works best on:** Portraits and high contrast scenes

### Why it looks this way

When we write by hand we press harder, and write bigger, when we are in a hurry or mean something strongly. This treatment turns that human variation into tone. Dark parts of the picture get large, heavy, dark letters, and light parts are left as bare paper, so a picture appears out of a handwritten sentence.

### How it works

1. Draw the page: paper, ruled lines or grid, a red margin and three binder holes.
2. Stretch the picture so its darkest 2 percent are black and its lightest 2 percent white, then blur it.
3. Write the sentence one letter at a time, line after line, starting again when it runs out.
4. For each letter, read the darkness above its baseline and make it larger, bolder and more opaque where it is dark.
5. Lift the pen where the picture is very light, and turn each letter a couple of degrees at random so it does not look typeset.

### The mathematics

The page is drawn first: paper, ruled lines (or a square grid), a red margin and three binder holes. Then your sentence is written out one letter at a time, left to right, line after line, starting again from the beginning whenever it runs out. Before writing, the picture’s brightness is stretched so that its darkest 2% become black and its lightest 2% white, then blurred, so each letter reads a smooth tone and not one noisy pixel.

A pen presses harder where the picture is dark. For every letter the program looks at the darkness d just above its baseline and makes the letter larger, bolder (weight 700 once d passes one half) and more opaque. Where d is under 0.07 the pen lifts and nothing is written, so the paper shows through the highlights. Each letter is also turned by a random couple of degrees at most and its size varies by a few percent, which is what stops it looking typeset. The “Pen pressure” slider widens the gap between light and heavy writing.

$$
v=\operatorname{clamp}\!\left(\frac{L-L_{2\%}}{\max(0.08,\;L_{98\%}-L_{2\%})}\right),\qquad d=1-\bar v
$$
_Brightness stretched between its 2nd and 98th percentiles, blurred (the bar), and turned into darkness d._

$$
s=1.28\,q\,\big(0.62+(0.55+0.35\,\pi)\,d\big)\,(0.94+0.12\,u),\qquad q=\frac{0.9\,H}{n}
$$
_Letter size: q is the line pitch for n lines, π the pressure slider (0 to 1) and u a random number from 0 to 1._

$$
\alpha=\min\!\big(1,\;0.16+d\,(0.7+0.55\,\pi)\big)
$$
_Ink opacity of one letter._

### A short history

Shape poetry, in which words form the thing they describe, goes back to ancient Greek poets. Guillaume Apollinaire gave it a modern name in 1918 with his Calligrammes. Pictures made of writing appear in many scripts, and notebook doodles of the same kind are among the oldest habits of anyone with a pen.

### Where it is used

- Gifts and cards with a personal message
- Poetry and lyric posters
- Journal and notebook style graphics
- Portraits made from a favourite quote

### Try it

- Black ink on a plain page is the cleanest version. (https://lumenary-studio.vercel.app/style/handwritten?ink=black&paper=plain)
- More lines of writing give a finer portrait. (https://lumenary-studio.vercel.app/style/handwritten?lines=65)
- Use your own sentence. (https://lumenary-studio.vercel.app/style/handwritten?text=for+you%2C+with+love)

### Words worth knowing

- **Calligram:** A poem or text arranged so that it forms a picture of its subject.
- **Baseline:** The invisible line that letters sit on.
- **Tone:** How light or dark a part of a picture is.

### See also

- 54 Calligraphy Portrait
- 55 Newspaper
- 56 Letterpress

## 54  Calligraphy Portrait  ·  _still_

- **Comes from:** Calligraphic traditions of Europe, the Middle East and East Asia
- **Around:** Centuries old
- **Works best on:** Portraits and strong silhouettes

### Why it looks this way

A calligrapher builds tone with layers of ink. Here the letters swell and overlap in the dark parts of the picture, so they pile into black, and stay small and thin in the light parts, where the parchment shows between them. The whole portrait is made of one sentence and one idea: more letters on top of each other means darker.

### How it works

1. Draw a parchment page with faint stains and a double ink border.
2. Letter the sentence in a flowing script on lines that rise or fall by the chosen slant.
3. Make letters very large and heavy where the picture is dark, and small and thin where it is light.
4. Advance each letter by only about 62 percent of its own width, so neighbours overlap and ink builds up.
5. Turn letters to follow the baseline with a tiny random wobble, and stamp an optional red seal.

### The mathematics

The page is parchment (a radial gradient, a few faint stains) with a double border in ink. The sentence is then lettered in a flowing script on lines that rise or fall by the slant you choose. What makes it a portrait is that the letters change size: where the picture is dark they are very large and heavy, and since each letter only advances about 62% of its own width, neighbouring letters pile up on each other and the ink builds into black. In the light parts they are small and thin and the parchment shows between them.

Spaces advance by a fixed fraction of the size, and every letter is turned to follow the baseline with a tiny random wobble. The picture is stretched and blurred as in Handwritten, so the tones are smooth. An optional red seal, a rounded square with a pale inner frame and a single letter, is stamped in the bottom corner. Layering rather than drawing is the whole idea: tone comes from how many letters overlap, much as it does in an engraving.

$$
s=b\,\big(0.3+1.45\,d^{1.15}\big),\qquad b=1.7\,\frac{0.8\,H}{n}
$$
_Letter size from darkness d; b is a base size set by the number of lines n._

$$
\Delta x=\max(0.12\,s,\;0.62\,w)\ \ \text{(letters)},\qquad \Delta x=0.3\,s\ \ \text{(spaces)}
$$
_How far the pen moves after a letter of measured width w._

$$
y(x)=y_0+m\,(x-\tfrac W2),\qquad m=0.35\tan\theta,\qquad \alpha=0.3+0.55\,d
$$
_The sloping baseline for a slant of θ, and the ink opacity._

### A short history

Writing arranged into images is a long tradition. Greek poets shaped words into wings and altars more than two thousand years ago, and Persian and Ottoman calligraphers composed names and verses into the outlines of birds, boats and lions. Red seals, small stamps of a name, mark a finished work in many East Asian traditions.

### Where it is used

- Commemorative gifts and wedding keepsakes
- Quote and poetry prints
- Book and album covers
- Cultural heritage themed art

### Try it

- Indigo ink with a steeper slant feels like a fountain pen. (https://lumenary-studio.vercel.app/style/calligraphy-portrait?ink=indigo&slant=10)
- More lines make a finer, more photographic portrait. (https://lumenary-studio.vercel.app/style/calligraphy-portrait?lines=38)
- Add your own words in place of the sentence. (https://lumenary-studio.vercel.app/style/calligraphy-portrait?text=a+name%2C+a+line%2C+a+promise)

### Words worth knowing

- **Calligraphy:** The art of beautiful writing.
- **Slant:** The angle at which letters lean from vertical.
- **Seal:** A small stamp in red ink that signs a work.

### See also

- 53 Handwritten
- 56 Letterpress
- 15 Victorian

## 55  Newspaper  ·  _still_

- **Comes from:** Printing presses and newsrooms
- **Around:** Halftone newspapers since the 1880s
- **Works best on:** Strong portraits and news-like scenes

### Why it looks this way

Newspapers cannot print grey. They print black dots of different sizes on pale paper and rely on your eye to blend them, so a photograph is really a field of dots. This treatment lays a lattice of such dots over the picture and builds the rest of a front page around it with a masthead, a headline, rules and columns.

### How it works

1. Lay a lattice of dots rotated by 45 degrees, the angle where a regular pattern is least noticeable.
2. At each lattice point read the brightness and draw a dot whose radius grows with the square root of the darkness, so inked area follows darkness.
3. Fit the masthead to the page width by measuring and scaling it.
4. Wrap the headline into at most three lines, shrinking it by 8 percent steps until it fits.
5. Fill the columns with greeked text, bars standing in for words, and add paper grain and a warm vignette.

### The mathematics

A printed photograph has no grey, only black dots of different sizes on white paper, small ones for light areas and large ones for dark. The eye blends them. Here the dots sit on a lattice turned 45°, the angle at which the eye notices a regular pattern least. For each lattice point the program reads the picture’s brightness L at that spot and draws a dot whose radius grows with the square root of the darkness, which makes the inked area proportional to the darkness. In the deepest tones the dots are big enough to merge and the page goes solid black.

The rest of the page is typeset around it. The masthead is fitted to the page width by measuring the text at one size and scaling; the headline is wrapped into at most three lines and shrunk by 8% steps until it fits; thin and thick rules separate the sections; and the remaining columns are filled with “greeked” text, bars of random length standing in for words, with the occasional subhead. Paper grain and a warm vignette finish it.

$$
\begin{pmatrix}x\\y\end{pmatrix}=\frac{1}{\sqrt2}\begin{pmatrix}a+b\\ b-a\end{pmatrix},\qquad a,b\in s\,\mathbb Z
$$
_Lattice points: a square grid of spacing s turned by 45°._

$$
r=0.62\,s\,\sqrt{1-L(x,y)}
$$
_Dot radius; the inked fraction of a cell is πr²/s², proportional to the darkness 1 − L._

$$
F=\min\!\left(u_0,\ \frac{0.98\,w_{\text{page}}}{w_{100}}\cdot 100\right)
$$
_Masthead font size: the text measured at 100 px has width w₁₀₀, and is scaled to fill 98% of the page width._

### A short history

The first halftone photograph in a daily newspaper appeared in the New York Daily Graphic in 1880, made by Stephen Horgan. Frederic Ives patented a halftone process in 1881, and crossed-line screens soon made it routine. By the early twentieth century newspapers printed photographs every day, and the dot became so familiar that artists later made it into pop art.

### Where it is used

- Parody and editorial mock-ups
- Birthday and anniversary front pages
- Posters with a vintage press look
- Story and thumbnail graphics

### Try it

- Large dots on grey stock look like a coarse tabloid. (https://lumenary-studio.vercel.app/style/newspaper?dot=10&paper=grey)
- Fine dots make the photograph almost smooth. (https://lumenary-studio.vercel.app/style/newspaper?dot=3)
- Write your own front page. (https://lumenary-studio.vercel.app/style/newspaper?masthead=The+Morning+Post&headline=Local+Photograph+Declared+Wonderful)

### Words worth knowing

- **Halftone:** A way of showing tone with dots whose size changes.
- **Masthead:** The newspaper’s name at the top of the front page.
- **Greeking:** Using bars or nonsense text to stand in for real words in a layout.

### See also

- 80 Halftone
- 56 Letterpress
- 09 Pop Art

## 56  Letterpress  ·  _still_

- **Comes from:** The printing press
- **Around:** Since the 1450s, revived from the late 1990s
- **Works best on:** Bold pictures and portraits with clear tones

### Why it looks this way

Letterpress is printing with a raised plate pressed into thick, soft paper, so the ink arrives with a physical dent. That dent is the whole charm: a shadow on one wall, a lit edge on the other. This treatment draws a one colour plate and then treats the paper as a height field so that the impression catches light.

### How it works

1. Build the plate as black on transparent: a 45 degree halftone of the picture, two rules and the title.
2. Turn the plate into an ink map between 0 and 1.
3. Soften the map with two small blurs, the give of the paper, and measure its slope.
4. Light from the top left, so the lower right wall of each dent is lit and the upper left wall is in shadow.
5. Add fibre and speckle to the paper, darken ink slightly at the edges, and knock small holes in the ink for wear.

### The mathematics

Letterpress is printing with a raised plate pressed into thick cotton paper, so the ink arrives with a physical dent. The treatment builds the plate first, as black on transparent: a 45° halftone of your picture, two rules and the title. That layer becomes an ink map a(x, y) between 0 and 1.

The paper is then treated as a height field. The ink map is softened with two small blurs (the paper’s give) and its slope is measured with a Sobel filter. Light comes from the top left, so the lower-right wall of every dent is lit and the upper-left wall falls in shadow, which is how the impression shows. Paper tone gets a little fibre and speckle noise. Ink is the one chosen colour, a touch darker at the edges where it squashes outward, and the “ink wear” slider knocks small holes in it, the way a worn plate prints.

$$
r=0.72\,s\,\sqrt{1-L}
$$
_Halftone dot radius on the plate; s is the dot spacing._

$$
v=1-5.2\,\delta\,(G_x+G_y)-0.07\,\delta\,\tilde a+\eta,\qquad \tilde a=\text{blur}^2(a)
$$
_Paper shading v: δ is the impression slider, G the Sobel slopes of the softened ink map, η small noise._

$$
C=v\,\Big(P+k\,\big(\sigma\,I-P\big)\Big),\qquad k=a\,(1-h)
$$
_Final colour: paper P toward ink I by the ink amount k; h is 0.55 on worn speckles and σ shades the ink._

### A short history

Johannes Gutenberg’s movable type press of around 1450 made letterpress the main way of printing for centuries. Offset printing replaced it in the twentieth century, but from the late 1990s designers rediscovered the deep impression on cotton stock, and it became a favourite for wedding invitations and business cards.

### Where it is used

- Wedding and event stationery
- Business cards and brand cards
- Greeting cards and art prints
- Premium packaging inserts

### Try it

- Oxblood ink on cream paper looks warm and traditional. (https://lumenary-studio.vercel.app/style/letterpress?ink=oxblood&paper=cream)
- Deep impression with little wear is crisp and luxurious. (https://lumenary-studio.vercel.app/style/letterpress?depth=95&wear=5)
- Add your own title. (https://lumenary-studio.vercel.app/style/letterpress?title=With+thanks)

### Words worth knowing

- **Impression:** The dent a raised plate leaves in paper.
- **Height field:** An image whose values are read as heights.
- **Cotton stock:** A thick soft paper made from cotton fibre, ideal for deep impressions.

### See also

- 55 Newspaper
- 80 Halftone
- 73 Rubber Stamp

## 57  Ticker Text  ·  _live_

- **Comes from:** Stock exchanges and news signs
- **Around:** 1860s onward
- **Works best on:** Contrasty pictures with bright subjects

### Why it looks this way

A ticker wall is rows of text sliding sideways, each carrying symbols, prices and arrows. Individually they are noise, but if every letter lights up according to the brightness of the picture it passes over, the picture appears in the flow, as if the market itself were drawing it.

### How it works

1. Build each row from short tokens of your symbols, a price and an arrow, repeated until it is wider than the screen.
2. Alternate the direction of the rows and give each its own speed.
3. Sample a small, contrast stretched copy of the picture at the centre of each letter as it is drawn.
4. Make the letter brighter where the picture is brighter, with a glow on the brightest.
5. Draw letters in batches grouped by intensity and hue so the fill colour changes only a couple of dozen times a frame.

### The mathematics

A trading-floor display is rows of text sliding sideways. Each row is built from short tokens made of your symbols, a price and an arrow, for instance “LUM 217.40 ▲1.8%”, repeated until the row is wider than the screen; the text itself is random but fixed by the seed. Rows alternate direction and each has its own speed, so the whole wall never moves in step.

The picture is carried by brightness. A small, contrast-stretched copy of your picture is sampled at the centre of each letter at the moment it is drawn, and the brighter that spot the brighter the letter, so as text slides over a bright area it lights up and over a dark area it fades. The brightest letters get a glow. In green-and-red mode the hue is a property of the token (up or down) and only the intensity comes from the picture. To keep it fast, letters are drawn in batches grouped by intensity and hue, so the fill colour changes only a couple of dozen times per frame.

$$
x_i(t)=\Big(\big(i\,c+\varepsilon\,(v\,\rho\,t+o)\big)\bmod T\Big)-c,\qquad T=n\,c
$$
_Position of character i: c is the character width, n the characters in the row, ε = ±1 the direction, v the row speed, ρ the speed slider, o an offset._

$$
\alpha=\operatorname{clamp}\!\big(0.07+\sigma\,B^{1.5}\cdot1.05+(1-\sigma)\cdot0.55\big)
$$
_Letter intensity from the picture brightness B under it; σ is the “picture strength” slider._

### A short history

The stock ticker was invented in the 1860s: Edward Calahan’s version of 1867 printed prices on a paper tape, and Thomas Edison improved it soon after. Electric signs followed. The New York Times building in Times Square carried a moving news sign from 1928, and scrolling displays have been a symbol of fast information ever since.

### Where it is used

- Finance and business themed visuals
- News and sports style overlays
- Title cards with a data feel
- Looping backgrounds for streams and talks

### Try it

- Amber on black is an old terminal tape. (https://lumenary-studio.vercel.app/style/ticker-text?colour=amber)
- Maximum picture strength shows the portrait clearly. (https://lumenary-studio.vercel.app/style/ticker-text?picture=100&rows=48)
- Swap in your own symbols. (https://lumenary-studio.vercel.app/style/ticker-text?text=ART+SUN+SEA+SKY)

### Words worth knowing

- **Ticker:** A device or display that shows a running stream of prices or news.
- **Token:** A short chunk of text treated as one unit.
- **Batching:** Grouping similar drawing operations so they run faster.

### See also

- 51 Kinetic type
- 52 Split-flap
- 39 Matrix Rain

