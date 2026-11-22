# D. Light, colour and glass

Source: https://lumenary-studio.vercel.app/theory/light (captured 2026-11-16 for private study).

Light doing what it does best: glowing, bending and bouncing through glass, ice and colour.

## 58  Glassmorphism  ·  _still_

- **Comes from:** Operating systems and interface design
- **Around:** 2000s, named around 2020
- **Works best on:** Colourful backgrounds with soft shapes

### Why it looks this way

Frosted glass is a window that hides detail but keeps colour. Put a translucent panel over a vivid picture and the panel inherits its hues while staying calm enough to hold text. This treatment builds that effect from layers: a soft shadow, a blurred copy of the picture, a tint, a diagonal sheen and a fine border that catches light on two corners.

### How it works

1. Blur the picture by shrinking it by an amount set by the frost slider and enlarging it back in doublings with smoothing.
2. Draw a soft shadow, then clip to a rounded rectangle for each panel.
3. Inside the panel draw the blurred picture, then a translucent tint, white for light glass or near black for smoke.
4. Add a diagonal sheen that fades from bright to nothing.
5. Draw a one pixel border whose brightness varies along the diagonal, and place panels from a fixed layout nudged by the seed.

### The mathematics

Frosted glass is a blurred copy of the picture shown through a window. To get a smooth blur without an expensive convolution, the picture is shrunk by a factor that depends on the frost slider and then enlarged back in successive doublings with smoothing on. Each shrink throws away fine detail, and each smooth enlargement spreads what is left, which is a low-pass filter: the more it shrinks, the lower the cutoff and the stronger the frost.

Each panel is then built in layers. A soft shadow is drawn first. The panel shape is a rounded rectangle, used as a clip, inside which the blurred picture is drawn, then a translucent tint (white for light glass, near-black for smoke) mixed in by the “over” operator, then a diagonal sheen gradient that fades from bright to nothing, and finally a one-pixel border whose brightness varies along the diagonal so the glass seems to catch light on two corners. The panels’ positions are a fixed layout nudged by a seeded random offset, so “Rearrange” always gives a new but reproducible composition.

$$
f=\frac{1}{1.5+b/5}
$$
_Down-scale factor for frost amount b (0 to 100). The blurred layer is built at f × the picture size._

$$
C=\alpha_{\text{tint}}\,C_{\text{tint}}+(1-\alpha_{\text{tint}})\,C_{\text{blur}}
$$
_Tint over blur, with α = opacity × 0.55 for light glass._

$$
r=\frac{\text{radius}}{100}\cdot0.2\cdot\min(W,H)
$$
_Corner radius is a fraction of the shorter side._

### A short history

Translucent interface glass appeared in Windows Vista’s Aero in 2006 and 2007, and Apple’s iOS 7 in 2013 used blur behind panels. The designer Michal Malewicz popularised the name glassmorphism around 2020, when macOS Big Sur and many apps and websites adopted frosted cards.

### Where it is used

- App and dashboard mock-ups
- Hero sections for websites
- Cards for music and weather screens
- Wallpapers with floating panels

### Try it

- Smoked glass with strong frost reads as a dark mode card. (https://lumenary-studio.vercel.app/style/glassmorphism?tint=smoke&blur=85)
- One large panel is a clean frame for a title. (https://lumenary-studio.vercel.app/style/glassmorphism?panels=1&radius=40)
- Low frost keeps the picture clear behind the glass. (https://lumenary-studio.vercel.app/style/glassmorphism?blur=15&opacity=20)

### Words worth knowing

- **Low-pass filter:** A filter that removes fine detail and keeps only broad shapes, which is what blur does.
- **Sheen:** A soft highlight across a surface.
- **Over operator:** The standard rule for laying a translucent layer over another.

### See also

- 66 Frosted Ice
- 65 Glass Refraction
- 59 Gradient mesh

## 59  Gradient mesh  ·  _live_

- **Comes from:** Vector illustration software and modern interfaces
- **Around:** 1998 tool, 2020s trend
- **Works best on:** Colourful scenes without fine detail

### Why it looks this way

A gradient mesh forgets the shapes of a picture and keeps only where its colours are. The picture is reduced to a small grid of colour points and the program draws a smooth surface through them, so what remains is mood: a soft field in your picture’s own palette. Slow warping makes the colours drift like oil on water.

### How it works

1. Reduce the picture to a small grid of colour points.
2. Push each colour a little: more saturation, and more contrast around mid lightness.
3. Build a smooth surface by blending the four nearest mesh points with eased weights, so there are no creases.
4. Warp where the surface is read with two nested sine waves that change slowly with time.
5. Compute at no more than 180 pixels wide, enlarge it, and lay a film of noise on top to prevent banding.

### The mathematics

The picture is reduced to a small grid of colour points (the mesh), and their colours are pushed a little: saturation up, contrast around mid-lightness up, both controlled by the vividness slider. The output is not the picture but a smooth surface that passes through those colours, built by interpolating between the four nearest mesh points with eased weights so there are no visible seams or creases.

The motion comes from warping where the surface is read. Every output pixel looks up the mesh at a position that has been pushed around by two nested sine waves that change slowly with time, so the colours drift like oil on water without the mesh itself ever changing. The surface is computed at no more than 180 pixels wide, which is plenty for something so smooth, and the canvas’s own smoothing scales it up to size. A tile of noise is laid over the top using the “overlay” blend to add a trace of film grain that stops the soft gradients from banding.

$$
u=u_0+w\,\sin\!\big(3.4v_0+0.9\tau+1.2\sin(2.2u_0+0.6\tau)\big),\quad v=v_0+w\,\cos\!\big(3.0u_0-0.8\tau+1.2\sin(2.6v_0-0.5\tau)\big)
$$
_Warped lookup position; w = warp × 0.16._

$$
C(u,v)=\sum_{a,b\in\{0,1\}}\omega_a(e_x)\,\omega_b(e_y)\,P_{i+a,\,j+b},\qquad e=3f^{2}-2f^{3}
$$
_Bilinear blend of the four nearest mesh colours P with eased fractional weights._

### A short history

The Gradient Mesh tool arrived in Adobe Illustrator in 1998, giving illustrators smooth, hand-controlled colour transitions. In the 2020s soft mesh gradients became a common background in websites, wallpapers and music apps, replacing the flat colours of the previous decade.

### Where it is used

- Website and app backgrounds
- Album and playlist covers
- Phone wallpapers
- Calm title backgrounds for videos

### Try it

- More colour points follow the picture more closely. (https://lumenary-studio.vercel.app/style/gradient-mesh?points=9&vivid=55)
- A slow drift with little warp feels like breathing. (https://lumenary-studio.vercel.app/style/gradient-mesh?speed=15&warp=25)
- Strong grain gives a printed, risograph feel. (https://lumenary-studio.vercel.app/style/gradient-mesh?grain=90)

### Words worth knowing

- **Mesh:** A grid of points that carry colours or positions.
- **Interpolation:** Working out values between known points.
- **Banding:** Visible steps in a smooth gradient caused by too few shades.

### See also

- 62 Aurora
- 67 Liquid morph
- 63 Duotone

## 60  Holographic  ·  _live_

- **Comes from:** Optics, then packaging and fashion
- **Around:** 1947 hologram, 1980s foils, 2010s trend
- **Works best on:** Dark pictures with bright shapes

### Why it looks this way

Holographic foil is covered in microscopic grooves that split light into colours, so the colour you see depends on the angle you look from. A screen has no angle, so this treatment makes up a stand-in coordinate from brightness, position and time and reads a rainbow from it. Because brightness is part of the coordinate, the rainbow follows the shapes in your picture.

### How it works

1. Mix three things into one coordinate: the pixel’s brightness, its position across a tilted axis, and time.
2. Wrap the coordinate into the range 0 to 1 and use it as a hue, looked up in a table of 512 saturated colours.
3. Mix the foil colour with the base picture by the intensity slider, weighted by brightness so shadows stay dark.
4. Sweep a soft white band, shaped like a Gaussian bell, across the tilted axis. Hovering moves it to the cursor.
5. Every tenth of a second, set a tiny random share of the brighter pixels to white for sparkle.

### The mathematics

Real holographic foil changes colour with the viewing angle. Here the “angle” is replaced by a coordinate that mixes three things: the pixel’s own brightness, its position across a tilted axis, and time. That coordinate is wrapped into the range 0 to 1 and used as a hue, looked up in a precomputed table of 512 fully saturated colours. Because brightness is part of the coordinate, the rainbow follows the shapes in your picture rather than lying on top of it like a gradient.

The foil colour is mixed with the base picture (greyscale or original) in proportion to the intensity slider, and weighted by brightness so shadows stay dark. A soft white band, shaped like a Gaussian bell across the tilted axis, sweeps over the surface; hovering moves it to the cursor. Finally, sparkle sets a tiny random fraction of the brighter pixels to white every tenth of a second, using a coordinate hash so each frame’s glitter is different but cheap.

$$
h=\operatorname{frac}\!\big(\sigma\,L+0.9\,(u\cos\theta+v\sin\theta)+\tau\big),\qquad\theta=0.6\ \text{rad}
$$
_Hue of the foil at a pixel: brightness L, spread σ, position along the tilted axis, drift τ._

$$
C=(1-k)\,C_{\text{base}}+k\,C_{\text{foil}}(h)\,(0.35+0.9L)
$$
_Mix of base picture and foil; k is the intensity slider._

$$
\text{band}=e^{-q^{2}}\,b\cdot0.75,\qquad q=\frac{(u\cos\theta+v\sin\theta)-p}{w}
$$
_The moving light band: a Gaussian of width w centred at position p._

### A short history

Dennis Gabor invented holography in 1947 and won the Nobel Prize for it in 1971. Embossed holograms became familiar on credit cards in the 1980s as a hard-to-copy security feature. Iridescent foil later spread to packaging, trading cards and fashion, and had a strong revival in the 2010s.

### Where it is used

- Trading card and sticker style art
- Packaging mock-ups
- Poster and cover art with a shimmer
- Fashion and beauty branding

### Try it

- Spread the colours wide for a full rainbow across the picture. (https://lumenary-studio.vercel.app/style/holographic?spread=3&intensity=80)
- Keep the original colours under the foil for a subtler sheen. (https://lumenary-studio.vercel.app/style/holographic?base=color&intensity=35)
- Turn the sparkle up for glitter foil. (https://lumenary-studio.vercel.app/style/holographic?sparkle=100)

### Words worth knowing

- **Iridescence:** Colour that changes with the viewing angle.
- **Diffraction grating:** A surface with fine grooves that splits light into its colours.
- **Gaussian:** A smooth bell shaped curve.

### See also

- 64 Chrome
- 62 Aurora
- 71 Gold Foil

## 61  Neon glow  ·  _live_

- **Comes from:** Neon sign making
- **Around:** 1910s onward
- **Works best on:** Pictures with clear outlines, such as portraits and architecture

### Why it looks this way

A neon sign is a thin tube of gas that glows along its whole length, so what you see is a line with a soft halo. This treatment keeps only the edges of the picture and draws each as a tube. The glow comes from adding shrunk, smoothed copies of the line layer back at full size, which behaves like a wide halo around a hard core.

### How it works

1. Blur the picture and find its edges with the Sobel pipeline.
2. Keep pixels whose edge strength is above a threshold set by the detail slider and colour them with a diagonal gradient between your two neons.
3. Shrink the line layer four times, each by half, and draw every smaller copy back at full size with additive blending.
4. Add a faint copy of the original underneath if you want it.
5. Flicker the whole sign with two sine waves of different frequency and an occasional dip to 45 percent.

### The mathematics

The picture is reduced to its outlines with the blur-then-Sobel pipeline described in the foundations. Where the edge strength exceeds a threshold the pixel becomes a bright line; the threshold is chosen by the detail slider, so more detail means a lower threshold and more lines. The lines are coloured by a diagonal gradient between your two neon colours, or by a brightened copy of the original colours.

Glow is the interesting part. A true Gaussian blur of the whole image would be slow, so the line layer is shrunk four times, each time to half the size, and every smaller copy is drawn back at full size with additive blending. Smoothing during enlargement spreads each line’s light outward, and the sum of several scales behaves like a wide, soft halo around a hard core. This is the same idea as a mipmap pyramid. Finally the whole sign flickers, as old neon does, with two sine waves of different frequency and an occasional brief dip to 45%.

$$
a=S_{\theta,\,2\theta}\big(\lvert\nabla L_b\rvert\big),\qquad\theta=\operatorname{lerp}(0.26,\,0.03,\ \text{detail})
$$
_Line opacity: smoothstep of the edge strength of the blurred brightness L_b._

$$
C_{\text{out}}=E+\sum_{j=1}^{4} g\,w_j\,\operatorname{up}(E_j),\qquad w=(0.95,0.85,0.75,0.65)
$$
_Additive bloom: E is the sharp line layer, E_j the same layer at 1/2^j size, up() the smooth enlargement, g the glow slider._

$$
f(t)=0.93+0.05\sin(9.1\,t)+0.03\sin(23.7\,t)
$$
_Flicker brightness; multiplied by 0.45 when (0.37 t) mod 1 > 0.965._

### A short history

Georges Claude showed neon lighting at the Paris Motor Show in 1910, and neon signs reached the United States in the early 1920s. Their colours dominated city nights for fifty years and still say “open late” to most of us. The glow trick used here is related to the mipmap pyramid, introduced by Lance Williams in 1983.

### Where it is used

- Nightlife and music posters
- Cafe and bar signage mock-ups
- Gaming and streaming backgrounds
- Sci-fi and cyberpunk visuals

### Try it

- High detail with strong glow turns a portrait into a sign. (https://lumenary-studio.vercel.app/style/neon-glow?detail=90&glow=95)
- Source colours keep the picture’s own palette in the tubes. (https://lumenary-studio.vercel.app/style/neon-glow?mode=source)
- Switch off the flicker for a steady sign. (https://lumenary-studio.vercel.app/style/neon-glow?flicker=false)

### Words worth knowing

- **Additive blending:** Combining lights by adding their brightness, so overlaps get brighter.
- **Mipmap:** A stack of the same image at half, quarter and smaller sizes.
- **Sobel:** A way of measuring how quickly brightness changes, which is large on an edge.

### See also

- 08 Cyberpunk
- 06 Futuristic
- 62 Aurora

## 62  Aurora  ·  _still_

- **Comes from:** The polar skies
- **Around:** Seen for all of human history
- **Works best on:** Pictures with bright shapes against darker areas

### Why it looks this way

An aurora is a curtain of glowing gas that hangs from a bright lower edge and fades upward. This treatment lets the bright parts of your picture be the source of that glow. From each source it sends a curtain up the page that fades at a steady rate, then streaks it with noise and colours it by how far it has risen from its source.

### How it works

1. Stretch and heavily blur the picture, and turn brightness into source strength with a smoothstep from 0.22 to 0.85.
2. Walk each column from bottom to top carrying a value that is replaced by a stronger source or fades by a constant factor.
3. Multiply it by two layers of value noise that change fast from left to right and slowly from bottom to top, for streaks.
4. Colour by distance from the source: green, then teal, violet and pink.
5. Add the light onto a dark blue sky, scatter stars where the sky is dark, and draw two rows of near black pines.

### The mathematics

An aurora is a curtain of glowing gas that hangs down from a ceiling of light and fades upward. The treatment keeps that shape. The picture is stretched and blurred heavily, and only its brighter parts count as sources: a smoothstep from 0.22 to 0.85 turns brightness into source strength. Then, for each column of pixels, the program walks from the bottom to the top carrying a running value that is either replaced by a stronger source or fades by a constant factor. The result is that every bright patch sends a curtain upward, and the length of the curtain is set by the fade rate.

Real curtains are streaky, so the value is multiplied by two layers of value noise that change quickly from left to right but slowly from bottom to top. The colour comes from how far a pixel is from the source that fed it: green near the source, then teal, violet and pink further up, the order real auroras follow. Light adds rather than blends, so the glow is added to a dark blue sky. Stars appear only where the sky is dark, and the pine ridge is two rows of layered triangles in near black.

$$
c_y=\max\!\big(s_y,\ \delta\,c_{y+1}\big),\qquad \delta=1-\frac{1}{H\,(0.05+0.75\,\ell)}
$$
_The smear, from the bottom row upward: s is the source strength, ℓ the “curtain height” slider (0 to 1)._

$$
a=\operatorname{clamp}\!\big(c\cdot\text{ray}\cdot k\big),\qquad g=0.95\,a^{2}(3-2a)+0.12\,a
$$
_Intensity after the ray streaks and brightness gain k, then shaped so faint light stays faint and strong light glows._

$$
\text{colour}=\text{ramp}\!\Big(\operatorname{clamp}\tfrac{d}{0.55\,H}\Big),\qquad \text{pixel}=\text{sky}+g\cdot\text{colour}
$$
_d is the number of rows since the source._

### A short history

Galileo gave the northern lights their name, aurora borealis, in 1619. The Norwegian scientist Kristian Birkeland argued in the early 1900s that they come from charged particles streaming from the Sun and guided by the Earth’s magnetic field. The greens and reds come from oxygen high in the atmosphere, and blues and purples from nitrogen.

### Where it is used

- Travel and nature posters
- Wallpapers and calm backgrounds
- Fantasy and music cover art
- Winter greeting cards

### Try it

- Crimson with tall curtains is a rare storm. (https://lumenary-studio.vercel.app/style/aurora?palette=crimson&length=90)
- Polar colours with strong ray streaks look cold and crisp. (https://lumenary-studio.vercel.app/style/aurora?palette=polar&rays=90)
- Hide the pines for pure light. (https://lumenary-studio.vercel.app/style/aurora?trees=false)

### Words worth knowing

- **Aurora:** Light made when charged particles from the Sun strike gases in the upper atmosphere.
- **Smoothstep:** A curve that turns a straight ramp into an S shape, easing in and out.
- **Value noise:** Smooth random variation made by blending random numbers on a grid.

### See also

- 59 Gradient mesh
- 61 Neon glow
- 14 Bohemian

## 63  Duotone  ·  _still_

- **Comes from:** Offset printing
- **Around:** 20th century, popular in digital branding since the 2010s
- **Works best on:** Pictures with strong light and shade

### Why it looks this way

Duotone throws away colour and keeps tone, then pours the tone into two inks. Every pixel is brightness only, mixed between a shadow colour and a highlight colour. That constraint is why duotone ties a set of mixed photographs together so well: whatever the original colours, they all end up in the same pair.

### How it works

1. Turn each pixel into a single brightness value.
2. Bend it with a power curve so the midpoint slider decides which brightness lands halfway between the two colours.
3. Add or remove contrast.
4. Mix between the shadow and highlight colours by that value.
5. Add a little film grain to prevent banding in smooth gradients.

### The mathematics

Duotone throws away colour and keeps tone. Each pixel’s brightness is first bent by a power curve so that the “midpoint” slider decides which brightness lands exactly halfway between the two colours, then given more or less contrast, and finally used as the mix between your shadow colour and your highlight colour. Black becomes the first, white the second, and everything else is a straight blend of the two.

Because only one number per pixel survives, the effect depends entirely on the tonal map of the picture, which is why a good duotone starts from a picture with strong light and shade. A little film grain is added at the end to stop the smooth gradients from banding.

$$
t=\operatorname{clamp}\!\Big(\big(L^{\gamma}-\tfrac12\big)(1+c)+\tfrac12\Big),\qquad \gamma=\frac{\ln 0.5}{\ln m}
$$
_Tone t: L is brightness, m the midpoint slider (0.2 to 0.8; L = m maps to ½) and c the contrast slider._

$$
\text{pixel}=A+(B-A)\,t
$$
_A is the shadow colour and B the highlight colour, mixed per channel._

### A short history

In printing a duotone uses two inks, often black and a spot colour, to give a photograph a richer tonal range than black alone. In the 2010s brands such as Spotify popularised bold digital duotones for imagery, and the technique became a staple of social and music graphics.

### Where it is used

- Brand imagery with a consistent look
- Album and playlist covers
- Website hero images
- Poster series with a shared palette

### Try it

- Ocean tones are cool and calm. (https://lumenary-studio.vercel.app/style/duotone?preset=ocean)
- Acid colours with high contrast look like a club flyer. (https://lumenary-studio.vercel.app/style/duotone?preset=acid&contrast=70)
- Move the midpoint toward the shadows to brighten the picture. (https://lumenary-studio.vercel.app/style/duotone?mid=30)

### Words worth knowing

- **Spot colour:** A single ink printed by itself rather than mixed from others.
- **Midpoint:** The brightness that falls exactly halfway between the two colours.
- **Banding:** Visible steps in a smooth gradient.

### See also

- 81 Risograph
- 86 Cyanotype
- 59 Gradient mesh

## 64  Chrome  ·  _still_

- **Comes from:** Car design and computer graphics
- **Around:** 1950s cars, 1990s CGI
- **Works best on:** Pictures with smooth shapes and bright highlights

### Why it looks this way

Chrome is a mirror, so what you see in it is the room around it, not the object. To fake that, brightness is treated as a height map, bright parts are hills, and each pixel looks up a different part of an imaginary sky: dark overhead, bright near the horizon, then a darker ground. Steeper slopes reflect other parts of the sky, and that is what makes the metal look liquid.

### How it works

1. Mix two blurs of different size, so shapes are smooth but keep some fine detail.
2. Read the slope of the map to get a surface normal, an arrow pointing out of the surface.
3. Work out the reflected direction, and use its up and down part to choose a position on a strip that stands for the world.
4. Shift where flat areas land on the strip with the horizon slider.
5. Add a small hard highlight from a light at the top left. Gold and cobalt use different strips.

### The mathematics

Chrome is a mirror, so what you see in it is not the object but the room around it. To fake that, the picture’s brightness is treated as a height map: bright parts are hills. Two blurs of different size are mixed so the shapes are smooth but still have some fine detail. The slope of the map at each pixel gives a surface normal, a unit arrow that points out of the surface; the steeper the slope, the more the arrow leans.

A leaning surface reflects a different part of the sky. The reflected direction is worked out from the normal, and its up-and-down part chooses a position on a strip that stands for the world: dark sky overhead, a bright band near the horizon, a hard edge where the horizon is, then a darker ground and a light floor. The “horizon” slider shifts where flat areas land on the strip. A small, hard highlight, a specular spot from a light at the top left, is added on top. Gold and cobalt use different strips.

$$
h=0.82\,\overline{L}_{r}+0.18\,\overline{L}_{r/3}
$$
_Height map: two box blurs of radius r and r/3 mixed._

$$
\mathbf n=\frac{(-k\,G_x,\ -k\,G_y,\ 1)}{\lVert(-k\,G_x,\ -k\,G_y,\ 1)\rVert},\qquad \mathbf r=\big(2n_zn_x,\ 2n_zn_y\big)
$$
_Normal from the Sobel slopes G (k grows with the relief slider) and the sideways part of the mirror direction for a viewer looking straight down._

$$
t=t_0+0.4\,r_y+0.08\,r_x+0.08\,h,\qquad t_0=0.12+0.42\,\eta
$$
_Position on the environment strip (0 top, 1 bottom); η is the horizon slider._

$$
\text{spec}=\left(\max\!\Big(0,\ \frac{\mathbf n\cdot\mathbf m}{\lVert\mathbf m\rVert}\Big)\right)^{90}
$$
_The highlight; m is halfway between the light direction and the viewer._

### A short history

Chrome trim defined cars of the 1950s. In computer graphics, James Blinn and Martin Newell described reflection mapping in 1976, the method of looking up a surrounding picture from a surface’s angle. The liquid metal villain of the film Terminator 2 in 1991 brought the look to a worldwide audience.

### Where it is used

- Poster and title lettering with a metal finish
- Y2K and futuristic design
- Album and fashion graphics
- Product style renders

### Try it

- Gold with deep relief looks like a cast medal. (https://lumenary-studio.vercel.app/style/chrome?metal=gold&depth=90)
- Cobalt with lower smoothness has more crisp, electric ridges. (https://lumenary-studio.vercel.app/style/chrome?metal=cobalt&smooth=25)
- Switch off the sharp gleam for a satin finish. (https://lumenary-studio.vercel.app/style/chrome?gleam=false)

### Words worth knowing

- **Surface normal:** A unit arrow pointing straight out of a surface.
- **Environment map:** A picture of the surroundings that a shiny surface reflects.
- **Specular highlight:** A small bright spot where a surface mirrors a light.

### See also

- 60 Holographic
- 71 Gold Foil
- 11 Y2K

## 65  Glass Refraction  ·  _still_

- **Comes from:** Architectural glass and optics
- **Around:** Optics theory 10th and 17th centuries, reeded glass in 20th century design
- **Works best on:** Pictures with clear colours and strong shapes

### Why it looks this way

Glass bends light, so what you see through it comes from somewhere else. Ribs squeeze and mirror slices of the scene, beads show tiny upside-down copies, and bubbles magnify their middles. Because glass bends blue more than red, each colour channel is bent a little differently and edges pick up coloured fringes.

### How it works

1. For each output pixel decide where in the picture to look, and take that colour.
2. For ribbed glass, run the sampling point across a wider part of the picture than the rib itself, and backwards, so each rib shows a squeezed, mirrored slice.
3. For beads, do the same in two directions on a hexagonal grid. For bubbles, magnify the middle of each disc.
4. Sample the three colour channels with slightly different strengths for the coloured fringes.
5. Shade each lens with a darker rim and a small bright window reflection, drawing lenses one at a time inside their bounding boxes.

### The mathematics

Glass bends light, so what you see through it comes from somewhere else. For every output pixel the program decides where in the picture to look, and takes that colour instead. Ribbed glass is a row of cylinder lenses: within each rib the sampling point runs across a wider part of the picture than the rib itself, and backwards, so each rib shows a squeezed, mirrored slice of the scene. Glass beads are tiny spheres on a hexagonal grid doing the same in two directions, and the sheet between them is dark. Bubbles are the opposite kind of lens: they magnify the middle of the disc, because the sampling radius is smaller than the pixel’s own radius.

Glass bends blue more than red, so the three colour channels are each sampled with a slightly different strength, which gives coloured fringes. Each lens is also shaded: beads are darker toward the rim, both kinds get a small bright window reflection at the top left, and bubbles get a thin ring of light at the edge. Lenses are drawn one at a time inside their bounding boxes (largest bubble first), so the cost is the area of the lenses, not of lenses times pixels.

$$
x'_c=x_0-u\,\frac w2\,(0.3+3.2\,\beta)\,f_c,\qquad f_R=1+2\delta,\ f_G=1,\ f_B=1-2\delta
$$
_Ribbed glass: x₀ is the rib centre, u from −1 to 1 the position in the rib, w its width, β the bend slider, δ = 0.1 × the colour-split slider._

$$
\mathbf p'_c=\mathbf c-\mathbf n\,R\,(0.6+1.9\,\beta)\,f_c
$$
_Glass bead: n is the pixel’s position in the bead (−1 to 1), R its radius; the minus sign inverts the image._

$$
\mathbf p'_c=\mathbf c+\hat{\mathbf n}\,R\,\rho^{\,e_c},\qquad \rho=\lVert\mathbf n\rVert,\quad e_c=(1+1.1\,\beta)\big(1+(c-1)\,\delta\big)
$$
_Bubble: a pixel at radius ρ looks at radius ρ^e, nearer the centre, so the middle is magnified._

### A short history

The law of refraction was written down by Ibn Sahl around 984 and rediscovered by Willebrord Snell in the early 1600s. Isaac Newton showed in 1666 that a prism splits white light into colours. Fluted and reeded glass became a favourite of Art Deco interiors and returned as a popular detail in modern homes and shops.

### Where it is used

- Interior and architecture style mock-ups
- Abstract privacy glass looks
- Poster and cover art
- Light and optics illustrations

### Try it

- Wide ribs with strong bend look like a shower screen. (https://lumenary-studio.vercel.app/style/glass-refraction?mode=reeded&size=12&bend=85)
- Tiny beads turn the picture into a glittering mosaic. (https://lumenary-studio.vercel.app/style/glass-refraction?mode=ball&size=5)
- Bubbles with a strong colour split look like soap film. (https://lumenary-studio.vercel.app/style/glass-refraction?mode=bubbles&split=80)

### Words worth knowing

- **Refraction:** The bending of light as it passes from one material into another.
- **Dispersion:** Different colours bending by different amounts, which splits white light.
- **Lens:** A shaped piece of glass that bends light to focus or spread it.

### See also

- 66 Frosted Ice
- 58 Glassmorphism
- 124 Chromatic Aberration

## 66  Frosted Ice  ·  _still_

- **Comes from:** Cold windows
- **Around:** Always
- **Works best on:** Pictures with a clear subject near the middle

### Why it looks this way

Frost scatters light, so a frozen window blurs everything behind it and leaves crystal ridges that look like cracks and feathers. A clear patch wiped by a hand shows the scene sharply for a moment. This treatment blurs the picture strongly, grows crystals from layered noise, and wipes one patch clean.

### How it works

1. Blur each colour channel strongly with two box blurs.
2. Bend the coordinates with two layers of smooth value noise.
3. Compute a ridged version of the noise, 1 minus the absolute value of 2n minus 1, at two scales, so lines appear where the noise crosses its middle.
4. Raise it to the fifth power to keep only the strongest ridges, add sparkle, and push the colours toward pale blue, thicker near the edges of the pane.
5. Wipe a curved patch where the sharp picture shows, with its edge wobbled by noise and a brighter ridge just outside.

### The mathematics

Frosted glass scatters light, so the first step is blurring the picture strongly, each colour channel separately, with two box blurs. The frost itself is made from noise. Two layers of smooth value noise bend the coordinates (a “warp”), and a ridged version of the noise, 1 − |2n − 1|, is computed at two scales, so lines appear where the noise crosses its middle value: they look like cracks and crystal edges. Raising that to the fifth power keeps only the strongest ridges. A scatter of single bright pixels adds sparkle, and the same warp shifts the blurred picture sideways by a few pixels, as ice does.

Frost is thicker toward the edges of a pane, so its amount grows with distance from the centre. The result is pushed toward a pale icy blue. Finally comes the clear patch, a stroke wiped by a hand: the distance of each pixel to a curved path of points, wobbled by low-frequency noise so the edge is not a perfect ellipse. Inside the stroke the sharp picture shows; just outside it, the wiped-away frost piles up in a brighter ridge.

$$
q=1-\lvert 2\,n(x\,\phi+5w_x,\ y\,\phi+5w_y)-1\rvert,\qquad \text{crystal}=(0.65\,q_1+0.35\,q_2)^{5}
$$
_Ridged noise at two scales, with warp w; φ is the frost frequency (a little lower vertically)._

$$
\text{white}=\operatorname{clamp}\!\big(f\,(0.14+0.55\,\text{crystal})+0.22\,f\,\varsigma\big),\qquad f=\phi_0\,(0.55+0.45\,e)
$$
_How much white frost covers a pixel: φ₀ is the frost slider, e the nearness to the pane edge and ς 1 on sparkle pixels._

$$
C\leftarrow C+(C_{\text{ice}}-C)\,(0.28\,f+0.7\,\text{white}),\qquad m=1-\operatorname{smoothstep}\big(0.84\,\rho_0,\ 0.97\,\rho_0,\ d\big)
$$
_Tint toward pale ice; m is how clear the wiped patch is at distance d from its path, of radius ρ₀._

### A short history

Window frost forms when water vapour freezes directly onto cold glass, without becoming liquid first. Wilson Bentley photographed snow crystals through a microscope from 1885, and in the 1930s Ukichiro Nakaya began growing and classifying them in a laboratory. Frost patterns have inspired ornament for centuries, from lace to engraved glass.

### Where it is used

- Winter greeting cards and posters
- Cosy social posts
- Backgrounds for seasonal campaigns
- Mood and weather illustrations

### Try it

- Heavy frost with a small clear patch hides almost everything. (https://lumenary-studio.vercel.app/style/frosted-ice?frost=95&size=25)
- Move the wiped patch to the side to reveal another part of the scene. (https://lumenary-studio.vercel.app/style/frosted-ice?x=25&y=70)
- Light frost with low blur is a gentle misting. (https://lumenary-studio.vercel.app/style/frosted-ice?frost=35&blur=6)

### Words worth knowing

- **Ridged noise:** Noise folded so that its middle value becomes a sharp ridge.
- **Domain warp:** Bending the coordinates before looking something up.
- **Scatter:** The spreading of light in many directions by a rough or crystalline surface.

### See also

- 58 Glassmorphism
- 65 Glass Refraction
- 62 Aurora

## 67  Liquid morph  ·  _live_

- **Comes from:** Film effects and creative coding
- **Around:** 1988 morphing, 1990s liquid metal
- **Works best on:** Portraits and strong colour shapes

### Why it looks this way

The picture is never changed, only looked up in a different place. A smooth, slowly moving field of offsets tells each pixel where to read from, so everything seems to flow. The field is built from sines whose phases are bent by other sines, so the motion never quite repeats.

### How it works

1. Compute a vector field of offsets from sine waves whose phases are themselves bent by other sines.
2. Calculate it only at nodes six pixels apart and blend it up to every pixel bilinearly.
3. For every output pixel read the source at the shifted position.
4. Add a ripple at the cursor, a ring shaped wave that decays with distance and travels outward.
5. Read red, green and blue at slightly different strengths of the offset for the colour split, and brighten or dim by the field’s vertical slope for sheen.

### The mathematics

The picture is never changed, only looked up in a different place. For every output pixel the program computes an offset and reads the source pixel at the shifted position. The offsets form a smooth, slowly moving vector field built from sines whose phases are themselves bent by other sines (a simple form of domain warping), which is what gives the motion its liquid, non-repeating look.

To keep it fast the field is calculated only at nodes six pixels apart and then blended up to every pixel bilinearly. Three effects ride on top. The cursor adds a ripple: a ring-shaped wave that decays exponentially with distance and travels outward over time. Colour split reads the red, green and blue channels at slightly different strengths of the same offset, so the channels drift apart like a prism. Sheen brightens or dims each pixel according to the vertical slope of the field, as if the surface were catching light.

$$
f_1=\sin\!\big(5.5F v+1.3\tau+1.6\sin(3.1F u+0.7\tau)\big),\quad f_2=\cos\!\big(5.0F u-1.1\tau+1.5\sin(2.7F v-0.9\tau)\big)
$$
_The two components of the field at normalised position (u, v), wave scale F and time τ._

$$
\mathbf d=A\,(f_1,f_2)\;+\;e^{-\rho/(0.2W)}\sin(0.07\rho-7t)\,\max(A,0.02W)\,0.9\,\hat{\boldsymbol\rho}
$$
_Total displacement; A = strength × 0.07 W. The second term is the cursor ripple at distance ρ._

$$
R(\mathbf x)=S(\mathbf x+\mathbf d(1+s)),\quad G(\mathbf x)=S(\mathbf x+\mathbf d),\quad B(\mathbf x)=S(\mathbf x+\mathbf d(1-s))
$$
_Colour split: each channel samples the source S at a different multiple of the offset._

### A short history

Computer morphing made its film debut in Willow in 1988, built at Industrial Light and Magic, and became a sensation in Terminator 2 and the Black or White music video in 1991. Warping coordinates with layered noise, often called domain warping, was later taught widely by shader artists such as Inigo Quilez.

### Where it is used

- Fluid background loops
- Music visualisers and album art
- Playful avatar effects
- Transitions between images

### Try it

- High strength with fine waves looks like water. (https://lumenary-studio.vercel.app/style/liquid-morph?strength=85&scale=3)
- Very slow, wide waves feel like a lava lamp. (https://lumenary-studio.vercel.app/style/liquid-morph?speed=15&scale=0.8)
- Maximum colour split turns it into a prism. (https://lumenary-studio.vercel.app/style/liquid-morph?split=100)

### Words worth knowing

- **Vector field:** A map that assigns an arrow, here an offset, to every point.
- **Domain warping:** Bending the coordinates used to look something up.
- **Bilinear interpolation:** Blending the four nearest values by distance.

### See also

- 59 Gradient mesh
- 13 Surreal
- 159 Domain Warp

