# J. Motion and live

Source: https://lumenary-studio.vercel.app/theory/motion (captured 2026-11-16 for private study).

Things that move: rain, haze, fireflies, ink and snow drifting over your picture, stars and water, and a picture that comes apart and finds its way back.

## 162  Rain on Glass  ·  _live_

- **Comes from:** Weather, physics and cinema
- **Around:** Timeless, a shader favourite since the 2010s
- **Works best on:** Cityscapes and landscapes with soft colour

### Why it looks this way

A misted window hides the world behind a soft blur, and a drop of water that runs down it clears a trail of sharp glass. Each drop is also a tiny lens, which shows the scene behind it upside down. The mood is one of shelter: the weather outside, a quiet view in, and your finger drawing a line through the fog.

### How it works

1. Make the mist from the picture shrunk to a tenth of its size and enlarged again, tinted pale blue-grey, with opacity from 0.12 to 0.62 set by the mist slider.
2. Keep a hidden mask of where the glass has been cleared, and draw the sharp picture over the mist wherever the mask is white.
3. Let small drops sit still and larger ones run down in jerks, leaving a trail that clears the mask.
4. Draw each drop as a little lens that shows the scene upside down, with a highlight and a shadow.
5. Every 0.12 seconds reduce the mask by 3.5 percent so the mist slowly returns, and wipe a soft stroke 7 percent of the width wide where the pointer moves.

### The mathematics

The window is two layers: a pane misted with condensation, and the clear glass beneath it. The mist is the picture shrunk to a tenth of its size and enlarged again (a strong blur), tinted pale blue-grey with an opacity of 0.12 to 0.62 from the mist slider. A second, invisible layer is a mask that records where the glass has been cleared. Where the mask is white the sharp picture is drawn over the mist, so every drop that runs down the pane leaves a clear trail, and so does your finger when you move the pointer across it (a soft stroke 7% of the width wide). The mist comes back slowly: every 0.12 seconds the mask is reduced by 3.5%, the way condensation re-forms.

Small drops sit still, with radii from 1.2 to 5.7 px skewed toward the small end. Big drops run. A running drop speeds toward a terminal speed that grows with its size, with a smooth approach (rate 3 per second), stops now and again for 0.1 to 0.7 seconds and slows to 30% of its speed, which is the stick-and-slip of real drops, and slides sideways in proportion to the slant of the wind. It also sheds tiny droplets behind it at about 3 per second. Each drop larger than about 2.6 px is a little lens. Water on glass focuses the scene behind it, and the image in a drop is upside down. The program draws it by clipping a circle and filling it with a patch of the picture rotated by 180 degrees and 3.2 times wider than the drop, then adding a dark rim, a soft highlight and a pale ring.

$$
C=(1-m)\,C_{\text{mist}}+m\,C_{\text{sharp}},\qquad m\leftarrow 0.965\,m\ \ \text{every }0.12\ \text{s}
$$
_The pane: m is the clear-glass mask, which fades back toward mist._

$$
v\leftarrow v+\big(v_t-v\big)\min(1,\,3\,\Delta t),\qquad v_t=v_{\text{run}}\,\mu\,\frac{r}{6},\qquad \Delta x=v\,\Delta t\,\tan\alpha
$$
_A running drop: v_t is the terminal speed (μ a random factor from 0.6 to 1.4 and r the radius) and α the slant._

$$
\mathbf x_{\text{src}}=\mathbf c-3.2\,(\mathbf x-\mathbf c)
$$
_The lens of a drop: a point x inside a drop centred at c shows the picture at x_src, so the image is inverted (the minus sign) and 3.2 times larger in extent than the drop._

### A short history

Condensation and raindrops on windows are as old as glass, and photographers have long used them to frame a mood, from film noir streets to the wet neon cities of science fiction. In computer graphics, a rain-on-glass shader became a popular exercise in the late 2010s because it combines lenses, blur and simple physics in a few lines.

### Where it is used

- Film and game atmospheres
- Calming screensavers and backgrounds
- Photo and video overlays
- Teaching refraction with water drops

### Try it

- Heavy rain on thick mist hides the view almost completely. (https://lumenary-studio.vercel.app/style/rain-on-glass?rain=90&fog=90)
- Big, slow drops show the upside-down scene clearly. (https://lumenary-studio.vercel.app/style/rain-on-glass?size=150&run=20)
- Wind slants the trails like a storm. (https://lumenary-studio.vercel.app/style/rain-on-glass?wind=35&rain=80)

### Words worth knowing

- **Condensation:** Water vapour turning to liquid on a cool surface.
- **Refraction:** The bending of light as it passes from one material to another.
- **Mask:** A hidden layer that says where an effect is applied.

### See also

- 66 Frosted Ice
- 65 Glass Refraction
- 165 Ink in Water

## 163  Heat Haze  ·  _live_

- **Comes from:** Optics and atmospheric science
- **Around:** Understood since the 17th century
- **Works best on:** Landscapes, roads and skylines

### Why it looks this way

Warm air is thinner than cool air, and thinner air bends light a little less. Over a hot road the air is a shifting mix of slightly different densities, so the rays of light that cross it are bent from moment to moment and the view wobbles. The ripples rise because the warm air itself rises.

### How it works

1. Use the Gladstone-Dale relation n − 1 = Kρ: the refractive index depends on density, and density depends on temperature, ρ ∝ 1/T at constant pressure.
2. Build a displacement field from fractal noise stretched vertically (horizontal frequency 1.3 times the vertical 0.45, in units of ripple size).
3. Scroll the noise upward as time passes, so the ripples rise.
4. Read the picture at each pixel’s displaced position, stronger near the heat source (the bottom, the centre, or everywhere).
5. Shift the red and blue channels slightly apart for colour fringes, and add a warm tint where it is hottest.

### The mathematics

Air bends light. How much depends on its density, through the Gladstone-Dale relation n − 1 = Kρ, and density depends on temperature, ρ ∝ 1/T at constant pressure. So warm air rising from the ground is a swirling mix of slightly different refractive indices, and the rays that pass through it are deflected a little differently from moment to moment. That is the shimmer over a hot road. The program displaces each pixel’s lookup of the picture by a vector built from fractal noise stretched in the vertical direction (the horizontal frequency is 1.3 times the vertical one’s 0.45, in units of the ripple size), and the noise scrolls upward as time goes on, so the ripples rise. The displacement is up to 3.2% of the width at full strength, a little less sideways than up and down, with a slight net lift.

A heat weight w from 0 to 1 says how hot each place is. It rises from the bottom as smoothstep(0.1, 1, y/H)^1.3 for heat from the ground, is a broad Gaussian blob for heat from the middle, or is 0.8 everywhere. The pointer adds a Gaussian flame around itself that eases in at 4 per second and out at 2 per second. Red and blue light are bent by slightly different amounts (dispersion), and the program reads the three channels with the displacement scaled by 1 − s, 1 and 1 + s, which gives colour fringes at edges; s is 0.9 × the colour fringes slider. The warm tint adds red and yellow in proportion to the local displacement. The field is computed on a lattice of 6 px cells at half size and interpolated bilinearly.

$$
n-1=K\rho,\qquad \rho\propto\frac{1}{T}
$$
_Why warm air bends light: hot air is thinner, so its refractive index is lower._

$$
\mathbf d=A\,w\,\Big(2\big(\nu_1-\tfrac12\big),\ \ 1.1\big(\nu_2-\tfrac12\big)-0.12\Big),\qquad \nu=\operatorname{fbm}\big(1.3\,\lambda u,\ 0.45\,\lambda v+1.4\,\tau\big)
$$
_Displacement of the lookup: A is 0.032 × strength × width, w the heat weight, λ the ripple frequency, τ the time._

$$
C_j(\mathbf x)=I_j\big(\mathbf x+(1+(j-1)\,s)\,\mathbf d\big),\qquad j=0,1,2\ \ (R,G,B)
$$
_Each colour channel is looked up with its own share of the displacement._

### A short history

In the seventeenth century Robert Hooke noticed that hot air rising from a candle bends light, and in 1864 August Toepler built the schlieren method to photograph such invisible flows. Mirages on deserts and roads are the same effect on a bigger scale. Stars twinkle for a similar reason, and astronomers call the blur the seeing.

### Where it is used

- Heat shimmer over roads, engines and fires in film and games
- Schlieren photography of airflow and shock waves
- Teaching refraction and mirages
- Dreamy or desert atmospheres

### Try it

- Heat from everywhere shakes the whole picture. (https://lumenary-studio.vercel.app/style/heat-haze?source=all&strength=70)
- Fine, quick ripples look like a desert road. (https://lumenary-studio.vercel.app/style/heat-haze?scale=15&speed=80)
- Strong colour fringes and a warm tint make a fierce furnace. (https://lumenary-studio.vercel.app/style/heat-haze?split=85&warm=90)

### Words worth knowing

- **Refractive index:** A number that says how much a material slows and bends light.
- **Mirage:** An image bent by layers of air at different temperatures.
- **Schlieren:** A method of photographing changes in air density.

### See also

- 162 Rain on Glass
- 124 Chromatic Aberration
- 159 Domain Warp

## 164  Fireflies  ·  _live_

- **Comes from:** Nature and folklore
- **Around:** Timeless
- **Works best on:** Landscapes, gardens and night pictures

### Why it looks this way

A firefly makes light by chemistry, with almost no heat, and blinks it as a signal. The sky of a summer night, the quiet and a few drifting sparks give a special mood, and a picture seen only by these points of light becomes a place you discover bit by bit. Each one lights the patch beneath it.

### How it works

1. Give each firefly a position, heading and its own rhythm, and let the heading drift smoothly: its rate of change is 5 × (n − ½) where n is slow noise.
2. Move it at the speed set by the slider with a slight upward float, and let it re-enter at the opposite edge.
3. When the pointer is in the picture, pull fireflies in: within half the picture’s width the pull is 55 px per second at the pointer, falling off linearly.
4. Blink each on its own period of 1.4 to 3.8 seconds and its own phase, with brightness b = lerp(1, w^2.2, blink).
5. Darken the picture by the night value and add a soft glow from each firefly, revealing the picture beneath.

### The mathematics

On a summer night the picture sits in near darkness, and each firefly lights the patch of it beneath. Every firefly has a position, a heading and its own rhythm. The heading drifts smoothly: its rate of change is 5 × (n − ½) where n is slow noise, so the flight curves lazily, and the speed is set by the slider with a slight upward float. Fireflies leave one edge and re-enter at the opposite one. When the pointer is inside the picture it draws them in: within half the picture’s width the pull is 55 px per second at the pointer and falls off linearly with distance. Each blinks on its own period of 1.4 to 3.8 seconds and its own phase, with a brightness b = lerp(1, w^2.2, blink), where w = ½ + ½ sin(2πt/T + φ); the power makes each flash short and the dark between them long.

The lighting is built in layers. First a near-black field with the picture at a fraction 1 − night of its brightness. Then a mask is painted: each firefly stamps a soft radial sprite (radius 30 to 125 px times 0.6 to 1.1, according to its brightness) at an opacity equal to b, and stamps combine as 1 − Π(1 − bᵢ gᵢ), so overlapping lights add up without ever exceeding 1. The sharp picture seen through this mask is added to the dark base with additive blending. Last, each firefly draws a small halo in its colour (green-gold, amber, cool white or pink) and a bright white core, also additively.

$$
\dot a=5\,\big(n(0.4\,t+s)-\tfrac12\big),\qquad \mathbf v=\big(\cos a,\ \sin a\big)\,v_0\,\kappa-(0,\,4)
$$
_A firefly’s heading a and velocity: n is slow noise, s the firefly’s own offset and κ its personal speed factor (0.6 to 1.4)._

$$
b=(1-\beta)+\beta\Big(\tfrac12+\tfrac12\sin\big(\tfrac{2\pi t}{T}+\varphi\big)\Big)^{2.2}
$$
_The blinking: β is the blinking slider, T the firefly’s period and φ its phase._

$$
m=1-\prod_i\big(1-b_i\,g_i(\mathbf x)\big),\qquad C=C_{\text{night}}+0.9\,m\,C_{\text{picture}}+\sum_i b_i\,h_i(\mathbf x)\,\mathbf c
$$
_The light mask m, and the final colour: g and h are the radial profiles of the mask and halo sprites, c the firefly colour._

### A short history

Fireflies produce light with luciferin and the enzyme luciferase in a reaction that gives off very little heat. In Japan, hotaru-gari, going to watch fireflies, has been a summer pastime for centuries. Some species in Southeast Asia and in the Great Smoky Mountains blink together, a synchrony that biologists and mathematicians such as Steven Strogatz have studied as an example of coupled oscillators.

### Where it is used

- Atmospheric scenes in film, games and websites
- Teaching bioluminescence and synchrony
- Summer and fairytale designs
- Ambient screensavers

### Try it

- A few amber fireflies on a very dark night feel like embers. (https://lumenary-studio.vercel.app/style/fireflies?count=20&night=95&colour=amber)
- A big swarm with strong blinking gives a festival. (https://lumenary-studio.vercel.app/style/fireflies?count=150&blink=100)
- Pink and wide glow looks like a fairytale. (https://lumenary-studio.vercel.app/style/fireflies?colour=pink&glow=130)

### Words worth knowing

- **Bioluminescence:** Light produced by a living thing through chemistry.
- **Luciferase:** The enzyme that makes fireflies glow.
- **Coupled oscillators:** Rhythms that influence each other and can fall into step.

### See also

- 120 Bokeh
- 61 Neon glow
- 166 Snowfall

## 165  Ink in Water  ·  _live_

- **Comes from:** Fluid dynamics and Japanese marbling
- **Around:** Suminagashi, 12th century, curl noise 2007
- **Works best on:** Colourful pictures, where the ink takes colour

### Why it looks this way

Ink in still water does two things at once. Slow currents carry it along, and diffusion spreads it out. Real water moves without bunching up or leaving gaps, so the ink curls and blooms in long wisps. The program uses a flow with that same property, and each wisp carries the colour of the picture where it was released.

### How it works

1. Release a drop as a burst of about 380 particles (times the ink slider) in a disc 9 px across, each with a small outward push.
2. Carry every particle with a flow from curl noise: if ψ is smooth noise, the velocity v = (∂ψ/∂y, −∂ψ/∂x) has zero divergence, so the flow is incompressible.
3. Measure the gradient by central differences over 6 px and damp the velocity by 0.9 per step so particles follow the current.
4. Give each particle the colour of the picture where it was released and draw up to 6,500 of them as translucent, soft sprites.
5. Fade the ink slowly, by the linger value, so old wisps thin out.

### The mathematics

Ink in still water spreads by two means: it is carried along by slow currents (advection) and it diffuses. The program uses up to 6,500 ink particles. A drop is a burst of about 380 particles (times the ink-in-each-drop slider) in a small disc 9 px across, each given a small outward push. Every particle is carried by a flow made from curl noise. If ψ(x, y, t) is a smooth scalar noise, the velocity v = (∂ψ/∂y, −∂ψ/∂x) has zero divergence, which means the flow is incompressible. The ink therefore swirls and curls without bunching up or leaving gaps, as real ink in water does. The gradient is measured by central differences over 6 px, the velocity is damped by 0.9 per step so it follows the currents with some inertia, and a little random jitter and a gentle sinking are added.

Each particle draws a translucent disc on a persistent canvas whose radius grows as 1 + 0.45 × its age, with an opacity of 0.07 (1 − age/life)^0.6, so the layers add up as 1 − Π(1 − a) and darken where the ink is thick. The ink’s colour is that of the picture where the drop was released, made 1.5 times as saturated and set to 0.82 of its brightness on light water or 1.25 of it on dark water, so each drop is a distinct hue. The release spot is chosen from six random candidates as the one with the most colour (largest difference between its strongest and weakest channel). The canvas is pulled back toward the water colour at every frame, by 7% down to 0.3% per frame at 30 per second according to how long the ink lingers. Moving the pointer across the water releases small drops.

$$
\mathbf v=F\,\Big(\frac{\partial\psi}{\partial y},\ -\frac{\partial\psi}{\partial x}\Big),\qquad \nabla\!\cdot\mathbf v=0
$$
_Curl noise: ψ is smooth noise that also drifts with time, F the strength of the currents._

$$
a_{\text{total}}=1-\prod_i\big(1-a_i\big),\qquad a_i=0.07\,\Big(1-\frac{\text{age}}{\text{life}}\Big)^{0.6}\Big(0.6+0.4\,q\Big)
$$
_Layered translucent discs; q is the ink-per-drop slider._

$$
C\leftarrow(1-\lambda)\,C+\lambda\,C_{\text{water}},\qquad \lambda=\operatorname{lerp}\big(0.07,\ 0.003,\ \ell\big)\,30\,\Delta t
$$
_The ink thins out: ℓ is the linger slider._

### A short history

Suminagashi, the Japanese art of floating ink on water and lifting the pattern onto paper, dates to the twelfth century. In 1883 Osborne Reynolds released a thread of dye in a glass pipe to show how smooth flow turns into turbulence. Robert Bridson, Jim Hourihan and Marcus Nordenstam introduced curl noise to computer graphics in 2007 as a cheap way to make convincing fluid motion.

### Where it is used

- Smoke, fluid and magic effects in film and games
- Marbling and paper art
- Flow visualisation in engineering
- Calming backgrounds

### Try it

- Strong currents and long lingering ink make dramatic ribbons. (https://lumenary-studio.vercel.app/style/ink-in-water?flow=90&linger=95)
- Tiny curls feel like smoke. (https://lumenary-studio.vercel.app/style/ink-in-water?scale=12&amount=40)
- Ink on a dark pool glows. (https://lumenary-studio.vercel.app/style/ink-in-water?water=dark&rate=70)

### Words worth knowing

- **Advection:** Being carried along by a flow.
- **Diffusion:** Spreading out from a crowded place to an emptier one.
- **Curl noise:** Noise turned into a flow that never bunches up.

### See also

- 159 Domain Warp
- 67 Liquid morph
- 96 Watercolour

## 166  Snowfall  ·  _live_

- **Comes from:** Photography, animation and weather
- **Around:** Multiplane camera 1937
- **Works best on:** Landscapes with depth, houses and trees

### Why it looks this way

A few flakes at three depths make a room of space. Near flakes are big, fast and soft, because they are out of focus, while far ones are small, slow, sharp and faint. That mix of motion parallax and atmospheric perspective is what the brain uses to judge distance, so the snow makes the picture feel deep, with a cold light settling on it.

### How it works

1. Give each flake a depth z between 0 and 1, drawn as u^1.6 so most are far away.
2. Make near flakes larger (radius 2.2 + 14 z² px), faster (0.35 + 1.1 z times the base speed) and more transparent and soft, with opacity from 0.45 to 0.95.
3. Move each downward at (14 + 90 × fall) × (0.35 + 1.1 z) px per second, with a sideways drift from the wind and a gentle sway.
4. Steer the wind with the cursor and wrap flakes at the edges.
5. Tint the picture with a cold light and add a drift of snow along the ground.

### The mathematics

The snow is a lesson in depth cues. Each flake has a depth z between 0 and 1, drawn as u^1.6 so that most flakes are far away. The near ones are bigger (radius 2.2 + 14 z² px), fall faster (0.35 + 1.1 z times the base fall speed), sway more, and are drawn with a soft, blurry sprite and a higher opacity (0.45 to 0.95), as the near objects are out of focus for a camera focused on the scene. The far ones are small, sharp, slow and faint. That is motion parallax together with atmospheric perspective, and it is why a dozen flakes make a room of space. Flakes wrap round at the edges.

Each flake moves with the speed v = (14 + 90 × fall) × (0.35 + 1.1 z) px per second downward and a sideways drift made of the wind times (0.3 + z) plus a sine sway of 14 × (0.4 + z) px. The wind is the wind slider plus the pointer’s offset from the middle (up to ±100 px per second), and it eases toward its target at 2 per second so a gust builds and fades. Under the snow the picture sits in a cold light: a blue wash (opacity 0.22 × the frost slider) and a luminosity blend with a cool grey (0.35 × frost) that cools and slightly mutes its colours. Snow banked on the ground is a white gradient rising from the bottom edge to up to a fifth of the height.

$$
z=u^{1.6},\qquad \rho=(2.2+14\,z^{2})\,k,\qquad \alpha=\operatorname{lerp}\big(0.45,\ \alpha_1,\ z\big)
$$
_Depth, flake radius and opacity: u is a random number in [0, 1], k the size slider and α₁ 0.8 for soft near flakes, 0.95 for sharp ones._

$$
\dot y=(14+90\,\phi)\,(0.35+1.1\,z),\qquad \dot x=\omega\,(0.3+z)+14\,(0.4+z)\sin(\varsigma\,t+\varphi)
$$
_Motion of a flake: φ is the fall slider, ω the wind, ς and φ the flake’s own sway rate and phase._

$$
\omega\leftarrow\omega+(\omega^{*}-\omega)\,\min(1,\,2\,\Delta t),\qquad \omega^{*}=0.7\,w+200\,\big(p_x-\tfrac12\big)
$$
_The wind eases toward its target (w the wind slider, p the pointer position, in pixels per second at 720 px wide)._

### A short history

The Walt Disney studio built a multiplane camera and used it for The Old Mill in 1937, placing painted glass layers at different distances to make parallax in animation. Wilson Bentley photographed snowflakes under a microscope from 1885, and Ukichiro Nakaya classified snow crystals in the 1930s. The snow globe, a favourite souvenir, goes back to the nineteenth century.

### Where it is used

- Winter scenes in games, film and websites
- Holiday cards and greetings
- Teaching depth cues and parallax
- Calming backgrounds

### Try it

- A blizzard needs heavy snow and strong wind. (https://lumenary-studio.vercel.app/style/snowfall?amount=100&wind=80&fall=70)
- Few, large, slow flakes feel quiet and dreamy. (https://lumenary-studio.vercel.app/style/snowfall?amount=20&size=150&fall=15)
- Strong frost and ground snow make a deep winter. (https://lumenary-studio.vercel.app/style/snowfall?frost=90&drift=90)

### Words worth knowing

- **Motion parallax:** Near things appear to move faster than far things.
- **Atmospheric perspective:** Distant things look paler and less sharp.
- **Multiplane camera:** A camera that shoots layers at different distances to create depth.

### See also

- 164 Fireflies
- 162 Rain on Glass
- 41 Depth Parallax

## 167  Night Sky  ·  _live_

- **Comes from:** Star charts and astrophotography
- **Around:** Antiquity onward
- **Works best on:** Bright subjects on a dark background

### Why it looks this way

People have always drawn pictures in the stars by joining a few bright points and letting the mind fill in the rest. This treatment runs that backwards. It starts with the picture, scatters stars most thickly where it is bright, and joins points along its outlines into constellations. Twinkle, a faint glow and the odd meteor make it a sky.

### How it works

1. Place stars at random, keeping each with a chance that grows with the picture’s brightness there.
2. Give each star a size, and a brightness read from the picture under it.
3. Make each star twinkle on its own period.
4. Pick the strongest outline point in each cell of a coarse grid and join neighbours with thin lines.
5. Lay a dark, soft, blue copy of the picture behind everything.
6. Brighten stars near the cursor, and send a meteor across now and then.

### The mathematics

Stars are placed by rejection sampling. A random position is proposed and kept with a probability that rises steeply with the picture’s brightness there; if it is refused, another is proposed, up to 24 times. Bright areas therefore end up crowded and dark ones nearly empty. Each star has a size drawn so that most are small and a few are large, and its brightness is read from the picture under it. Twinkle is a sine wave with its own period and phase for every star, taking away up to three quarters of its light.

Constellations follow the outlines. The frame is divided into a coarse grid, the pixel with the strongest edge in each cell becomes an anchor star, and each anchor is joined to its two nearest neighbours if they are close enough. Behind everything lies the picture itself, shrunk to under a hundred pixels and recoloured to deep blue, with a band of fractal noise for the Milky Way. With a video, the stars stay where they are and only their brightness is read again from each frame. The cursor adds light to stars near it, and a meteor crosses on a path fixed by the seed every few seconds.

$$
P(\text{keep}\mid\mathbf x)=0.07+L(\mathbf x)^{1.7}
$$
_Chance that a proposed star position is kept._

$$
b_i(t)=b_i\,\Big(1-0.75\,\tau\,\big(\tfrac12+\tfrac12\sin(2\pi t/T_i+\varphi_i)\big)\Big),\qquad b_i=L^{1.05}\,(0.7+0.5\,z_i)+0.03
$$
_Brightness of star i: z is its size (0 to 1), τ the twinkle slider, T between 1.2 and 4.8 seconds._

$$
\text{link }(i,j)\iff j\in\text{two nearest anchors of }i\ \text{and}\ \lvert\mathbf a_i-\mathbf a_j\rvert<1.9\,c
$$
_Constellation lines; c is the size of a grid cell._

### A short history

Ptolemy listed 48 constellations in the Almagest in the second century, and most are still in use. In 1922 the International Astronomical Union fixed the modern list at 88, and in 1930 it published exact boundaries so that every star belongs to one of them. Stars twinkle because their light is bent by moving air on its way down, which is why they are steady when seen from space.

### Where it is used

- Anniversary and memorial keepsakes
- Space-themed posters and invitations
- Planetarium and science club graphics
- Calm animated backgrounds

### Try it

- Many stars and no lines give a dense star field. (https://lumenary-studio.vercel.app/style/night-sky?stars=6000&lines=0)
- Few stars and many constellations look like a chart. (https://lumenary-studio.vercel.app/style/night-sky?stars=1200&lines=100&haze=15)
- Starlight in the picture’s own colours keeps its mood. (https://lumenary-studio.vercel.app/style/night-sky?tint=picture&twinkle=80)

### Words worth knowing

- **Rejection sampling:** Proposing random points and keeping each with a chance set by a rule.
- **Constellation:** A named pattern of stars, or the region of sky around it.
- **Scintillation:** The twinkling of stars, caused by turbulence in the air.

### See also

- 164 Fireflies
- 156 Poisson Stippling
- 130 Particles

## 168  Underwater  ·  _live_

- **Comes from:** Diving and underwater photography
- **Around:** First underwater photograph 1856
- **Works best on:** Bright, colourful scenes with some red in them

### Why it looks this way

Water changes light in three ways at once. It bends it, so the view sways with the swell. It absorbs it by colour, red first and blue last, so the deeper you go the bluer and dimmer everything gets. And its rippling surface focuses sunlight into bright moving nets called caustics. Add rays and rising bubbles and the picture is under the sea.

### How it works

1. Read each pixel from a position pushed about by slow bent waves.
2. Remove red quickly, green slowly and blue hardly at all, more toward the bottom.
3. Fog the result toward the colour of the water.
4. Add three sets of bent ripples and put light where their sum crosses zero.
5. Draw slanted shafts of sunlight and drifting specks.
6. Simulate bubbles that rise and wobble, more of them under the cursor.

### The mathematics

Three things happen to light in water, and each is one line of arithmetic per pixel. First, the picture sways. Every output pixel reads the source at a position pushed sideways and up and down by two slow sine waves whose phases are bent by other sines, and blends the four nearest source pixels so straight edges bend smoothly. Second, colour is absorbed. Water takes red first and blue last, so each channel is multiplied by a factor that falls with depth, fastest for red, and the result is fogged toward the water’s own colour. Depth grows toward the bottom of the frame.

Third, caustics. Ripples on the surface act as lenses and gather sunlight into bright lines. Three sets of bent ripples are added together, and light is placed wherever the sum passes through zero; a fourth power thins those crossings into the net seen on the floor of a pool. It is stronger near the top and on bright surfaces. The frame is computed at half size and the sines come from a table of 1024 values, which keeps it at video rate. Sun rays are slanted shafts drawn with additive blending, bubbles are small simulated circles that rise and wobble, and the drifting specks are placed by a formula of time.

$$
x'=x+A\sin\!\big(9v+1.3t+1.2\sin(5u+0.7t)\big),\qquad y'=y+0.6A\cos\!\big(8u-1.1t+1.1\sin(6v+0.5t)\big)
$$
_The swell: where pixel (x, y) is read from. A is the swell slider times 2.2% of the width._

$$
C_c\leftarrow C_c\,(1-k_c\,D),\qquad D=d\,(0.4+0.6v),\qquad \mathbf k=(0.92,\ 0.30,\ 0.10)
$$
_Absorption per channel in tropical water: red is lost about nine times faster than blue. d is the depth slider._

$$
n=\max\!\big(0,\ 1-1.15\,\lvert f_1+f_2+f_3\rvert\big),\qquad \text{light}\propto n^{4}
$$
_Caustics: f are three bent sine ripples; the net is where their sum is near zero._

### A short history

William Thompson took the first underwater photograph in 1856 by lowering a camera in a box into Weymouth Bay. Seventy years later, in 1926, Longley and Martin made the first colour photographs under water for National Geographic, firing magnesium flash powder on a raft because so little red light survives below a few metres. Caustics have been rendered by computer since the 1980s and are still a test of a renderer.

### Where it is used

- Travel and diving posts
- Aquarium and swim school graphics
- Dreamlike music visuals
- Animated backgrounds for calm apps

### Try it

- Open sea at full depth leaves almost only blue. (https://lumenary-studio.vercel.app/style/underwater?water=deep&depth=100&rays=20)
- Strong nets of light in shallow water look like a pool. (https://lumenary-studio.vercel.app/style/underwater?depth=20&caustics=100)
- A lake is green, still and full of bubbles. (https://lumenary-studio.vercel.app/style/underwater?water=green&waves=20&bubbles=100)

### Words worth knowing

- **Caustic:** A bright line or patch where a curved surface gathers light.
- **Absorption:** The loss of light as it passes through a material.
- **Displacement map:** A field that says how far, and which way, to move where each pixel is read from.

### See also

- 162 Rain on Glass
- 163 Heat Haze
- 165 Ink in Water

## 169  Flying Cards  ·  _live_

- **Comes from:** Playing cards and motion graphics
- **Around:** Cards from the 9th century, card interfaces from the 2010s
- **Works best on:** Any picture; faces look best with few cards

### Why it looks this way

Cut a picture into cards and it gains a third dimension for free. Each card can tilt, rise and turn over on its own, and because we know what a card is, a simple squeeze reads as a rotation and a shadow reads as height. The picture stays whole in the mind while it comes apart on the table.

### How it works

1. Cut the picture into a grid of cards.
2. Deal them in a shuffled order from below the frame, each easing into place.
3. Tilt and lift every card with sine waves of its own speed and phase.
4. Draw a tilt as a squeeze by the cosine of the angle, and darken a card as it turns away.
5. Put a shadow under each card, further away and fainter the higher it floats.
6. Turn over the cards near the cursor to show their backs.

### The mathematics

The picture is cut into a grid of cards, each showing its own part. On the deal, the cards are given a shuffled order and start one after another over a second and a half. Each flies from below the frame to its place along an ease-out cubic, turning as it goes. After that, nothing is simulated: every card’s pose is a formula of time with its own phase and speed, so the cards never fall into step.

A card is a flat rectangle turned about its vertical and horizontal axes and seen from straight ahead. Seen that way a rotation by an angle simply narrows the card by the cosine of the angle, so each card is drawn with two scale factors, and when the cosine about the vertical axis goes negative the back is drawn. The more a card is turned from the light the darker it gets. Its height above the table is another sine; the shadow is drawn further from the card and fainter as it rises. Near the cursor a flip value eases toward one and adds half a turn to the angle, then eases back more slowly.

$$
k=1-(1-e)^{3},\qquad e=\operatorname{clamp}\!\Big(\frac{t-t_i}{0.75}\Big)
$$
_The deal: card i starts at time t_i and settles over three quarters of a second._

$$
s_x=\cos\theta_y,\qquad \theta_y=0.75\,T\sin(0.8\,\omega_i t+1.7\varphi_i)+\pi\,f_i
$$
_Width of a card as it turns about its vertical axis: T is the tilt slider, f the flip value (0 to 1)._

$$
f_i\leftarrow f_i+(f^{*}-f_i)\,\min(1,\ r\,\Delta t),\qquad r=7\ \text{toward }1,\ 2.2\ \text{toward }0
$$
_The flip eases quickly over when the cursor is near and slowly back._

### A short history

Playing cards are first recorded in China in the ninth century and reached Europe by the 1370s; the French suits of hearts, spades, diamonds and clubs date from about 1480. Patterned backs became usual in the nineteenth century so that marks and stains could not give a card away. On computers, the cascade of bouncing cards at the end of Solitaire in 1990 made card animation a small tradition of its own.

### Where it is used

- Photo collage and gallery intros
- Game night and casino invitations
- Portfolio and product reveals
- Animated social posts

### Try it

- Few large cards with a strong tilt feel like a magician’s spread. (https://lumenary-studio.vercel.app/style/flying-cards?cols=4&tilt=90)
- Many small cards with no gap rebuild the picture as a mosaic. (https://lumenary-studio.vercel.app/style/flying-cards?cols=14&gap=2&border=false)
- A midnight table and a high float make the shadows the subject. (https://lumenary-studio.vercel.app/style/flying-cards?table=night&float=100&shadow=100)

### Words worth knowing

- **Easing:** Starting or ending a movement gradually instead of at a constant speed.
- **Phase:** How far through its cycle a repeating motion is at a given moment.
- **Orthographic projection:** Drawing a 3D object with no perspective, as if seen from very far away.

### See also

- 130 Particles
- 23 Collage Art
- 41 Depth Parallax

## 170  Pixel Dissolve  ·  _live_

- **Comes from:** Film transitions and computer graphics
- **Around:** Dissolves from the 1900s, pixel effects from the 1980s
- **Works best on:** Bold pictures that still read at low resolution

### Why it looks this way

A picture on a screen is already a grid of squares, held in place only by agreement. Let the squares go and the picture becomes dust, and bringing them home restores it exactly. The pleasure is in the moment between, when enough has left to break the image and enough remains to remember it by.

### How it works

1. Reduce the picture to square blocks of one colour each.
2. Give every block an order: mostly its place along the wind, with some disorder.
3. Run a cycle: hold, sweep the blocks away in order, let them drift, sweep them back.
4. Fly each block along the wind by its own distance, with a slow sideways drift.
5. Shrink and fade a block as it travels.
6. Let the cursor blow nearby blocks outward.

### The mathematics

Nothing here is simulated; where each block is depends only on the time, so the animation can be scrubbed, looped and applied to a video without ever losing step. One cycle holds the picture, sweeps it away, lets it drift, sweeps it back and holds again. Each block has an order number between 0 and 1, mostly its position along the wind with some random disorder, and two smoothsteps of the cycle phase, offset by that order, say how far the block has gone and how far it has come back. The smaller of the two is its distance from home, between 0 and 1.

That distance is eased and turned into a flight: a way along the wind, different for every block, plus a sideways drift read from value noise that changes slowly with time. As a block travels it shrinks to under half its size and fades. Blocks at home are not drawn one by one: the picture at one colour per block is drawn in a single operation, and only the blocks that are away are painted out and redrawn where they have got to. The cursor adds to the distance of nearby blocks and pushes them outward.

$$
a=\min\!\Big(S_{0.72o,\ 0.72o+0.28}\Big(\frac{\phi-0.16}{0.3}\Big),\ 1-S_{0.72(1-o),\ 0.72(1-o)+0.28}\Big(\frac{\phi-0.6}{0.3}\Big)\Big)
$$
_How far a block is from home: φ is the phase of the cycle (0 to 1), o the block’s order._

$$
\Delta\mathbf x=\mathbf w\,F\,(0.35+0.65\,\eta)\,e+\mathbf w^{\perp}\,\tfrac12F\,\big(N-\tfrac12\big)\,e,\qquad e=3a^{2}-2a^{3}
$$
_Flight: w is the wind direction, F the scatter distance, η a per-block hash and N value noise._

$$
\text{size}=s\,(1-0.55\,e),\qquad \text{opacity}=1-0.92\,e^{2}
$$
_A block in flight shrinks and fades._

### A short history

The dissolve, one picture fading into another, is among the oldest film transitions and was in use by 1900. Computers made it granular. Early Macintosh software such as HyperCard (1987) offered a “dissolve” that swapped pixels a scatter at a time, and Wolfenstein 3D (1992) faded its screen to red one pseudo-random pixel after another. Films later made the body that blows away as dust a familiar image.

### Where it is used

- Intro and outro animations
- Reveal posts and countdowns
- Game and tech event visuals
- Looping backgrounds

### Try it

- Small pixels falling slowly look like sand. (https://lumenary-studio.vercel.app/style/pixel-dissolve?size=5&wind=fall&speed=25)
- A burst from the middle on white is an explosion in reverse. (https://lumenary-studio.vercel.app/style/pixel-dissolve?wind=burst&ground=white&scatter=90)
- Big blocks that barely travel just shuffle in place. (https://lumenary-studio.vercel.app/style/pixel-dissolve?size=24&scatter=15)

### Words worth knowing

- **Dissolve:** A transition in which one image gives way to another gradually.
- **Closed form:** A formula that gives the answer for any moment directly, with no step-by-step simulation.
- **Phase:** How far through its cycle a repeating motion is.

### See also

- 130 Particles
- 26 Pixel art
- 32 Pixel Sorting

## 171  Dust Snap  ·  _live_

- **Comes from:** Cinema’s picture of things turning to dust
- **Around:** Particle effects in film since the 1980s, an internet staple since 2018
- **Works best on:** Bold pictures, portraits and shapes with a clear edge

### Why it looks this way

A picture that falls apart grain by grain is more unsettling than one that simply fades, because each grain keeps its own colour and its place in the order. The viewer follows a front of loss moving across the picture with a ragged edge, and the dust it leaves carries the picture’s colours away on the wind. The return, played backwards along the same paths, is what makes it feel like a loop of loss and relief.

### How it works

1. Divide the picture into small square grains and give each the moment it will let go: mostly its place along the sweep, with noise and chance added.
2. Run a cycle: hold the picture, snap it, rest on the empty page, then play the snap backwards.
3. Grains that have not gone yet are the picture itself, copied pixel for pixel.
4. A grain that has let go flies along the wind at its own speed, curls a little and shrinks.
5. Fade each grain near the end of its flight, and leave a dark, white or ghostly page where the picture was.

### The mathematics

Like Pixel Dissolve, the effect depends only on the time, so it can be scrubbed, looped and applied to a video. A cycle of 0.9 s holding, a snap of S seconds, 0.7 s resting and a return of 0.75 S gives a progress value p: 0 while the picture is whole, rising evenly to 1 during the snap, 1 while it is gone, and falling evenly back during the return, so the dust flies home along the paths it left by. S is 5.2 seconds at the slowest setting and 1.7 at the fastest. The picture is cut into square grains of side g = 3 px times width/640 at the default size. Grain i has a release time tau_i between 0 and 0.5, from its place along the sweep (left, right, top, bottom, or distance from the middle or the cursor) plus a slow value noise that bends the front and a little hash noise.

A grain is whole while p is at most tau_i. After that its flight parameter is s = clamp((p - tau_i) / 0.5), and it is drawn at its home plus v_i D s^1.25, where v_i is its own velocity, mostly the wind direction scaled by 0.35 to 1 and varied by a hash, with a slight lift, and D is 0.55 W times the drift slider. A swirl term 0.035 W s sin(7 s + phi_i), at right angles to the velocity, makes the paths curl. The grain shrinks to half its size, fades with opacity 1 - smoothstep(0.55, 1, s) and carries the colour of the picture at its home. Whole grains are copied from the picture first, and the flying ones are painted over them.

$$
p=\frac{t-0.9}{S}\ \text{(snap)},\qquad p=1-\frac{t-t_r}{0.75\,S}\ \text{(return)}
$$
_The progress of the snap: S is the snap time (5.2 s down to 1.7 s) and t_r the moment the return starts._

$$
s=\operatorname{clamp}\!\Big(\frac{p-\tau_i}{0.5}\Big),\qquad \mathbf x=\mathbf x_i+\mathbf v_i\,D\,s^{1.25}+0.035\,W\,s\,\sin(7s+\varphi_i)\,\mathbf v_i^{\perp}
$$
_Where a grain is in flight: v_i is its own velocity, D the drift distance, and the last term makes the path curl._

$$
\text{size}=g\,(1-0.5\,s),\qquad \alpha=0.96\,\big(1-\operatorname{smoothstep}(0.55,\,1,\,s)\big)
$$
_A grain shrinks and fades as it goes._

### A short history

Things that turn to dust have a long place in film, from the sand faces of The Mummy (1999) to the drifting ash of Avengers: Infinity War (2018), which made the disappearance a shared image. In computer graphics it is done with particle systems, introduced by William Reeves at Lucasfilm in the early 1980s to make the wall of fire in Star Trek II. Each grain is a particle with its own start time, velocity and life.

### Where it is used

- Intro and outro animations
- Reveal posts and film teasers
- Short loops for social posts
- Title cards and transitions

### Try it

- Wind from the lower left and big grains look like ash in a draught. (https://lumenary-studio.vercel.app/style/dust-snap?wind=215&grain=6)
- Start the snap from the middle and keep the page white for a bright burst. (https://lumenary-studio.vercel.app/style/dust-snap?from=centre&left=paper&spread=80)
- Leave a faint ghost of the picture behind and slow the snap right down. (https://lumenary-studio.vercel.app/style/dust-snap?left=ghost&speed=15)

### Words worth knowing

- **Particle system:** A group of many small objects, each with its own position, velocity and lifetime, used for smoke, fire and dust.
- **Easing:** Starting or ending a movement gradually instead of at a constant speed.
- **Turbulence:** Irregular, swirling variation added to a movement so that it does not look mechanical.

### See also

- 170 Pixel Dissolve
- 130 Particles
- 166 Snowfall

