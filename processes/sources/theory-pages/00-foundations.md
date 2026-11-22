# Σ. Foundations

Source: https://lumenary-studio.vercel.app/theory/foundations (captured 2026-11-16 for private study).

The tools every treatment borrows: brightness, edges, interpolation, noise, tone, colour and compositing.

## Pixels, brightness and resampling

A photograph arrives as a grid of pixels, each holding red, green and blue values from 0 to 255. Most treatments need a single number per pixel instead: how bright it is. Our eyes are most sensitive to green and least to blue, so brightness is a weighted sum of the three channels. The weights are the ones defined for HD television (Rec. 709). They are applied to the stored values directly, without first undoing the display gamma. That is not photometrically exact, but it is what the canvas offers and it is plenty for an artistic effect.

Before any work is done the picture is shrunk to the treatment’s working size. Shrinking in one jump skips pixels and produces jagged aliasing, so the picture is halved repeatedly, each step averaging every 2 × 2 block into one pixel. Treatments that need only a coarse grid (dots, characters, blocks) then sample that small image, which means each dot or letter is the average of the patch it stands for, not one stray pixel.

$$
L \;=\; \frac{0.2126\,R \;+\; 0.7152\,G \;+\; 0.0722\,B}{255}
$$
_Brightness L between 0 (black) and 1 (white)._

$$
p'_{x,y} \;=\; \tfrac14\left(p_{2x,2y} + p_{2x+1,2y} + p_{2x,2y+1} + p_{2x+1,2y+1}\right)
$$
_One halving step. Repeated until the target size is reached._

## Smoothing and finding edges

Edges are where brightness changes quickly, so finding them means measuring slope. The Sobel operator estimates the slope in two directions by sliding two small 3 × 3 grids of weights over the brightness map. The length of the resulting slope vector is the edge strength: large on an outline, near zero on a flat wall.

Raw photographs are noisy, and noise looks like edges. So the brightness is blurred first. The blur here is a box blur, the plain average of a window, computed with a running sum so its cost does not depend on the radius, and done separately along rows and then columns. Neon glow, comic book, blueprint and neo-brutalism all use this blur-then-Sobel pipeline and differ only in what they draw where the edge strength is high.

$$
G_x=\begin{bmatrix}-1&0&1\\-2&0&2\\-1&0&1\end{bmatrix}\!*L,\qquad G_y=\begin{bmatrix}-1&-2&-1\\0&0&0\\1&2&1\end{bmatrix}\!*L
$$
_Slope in x and in y. The star is convolution: multiply and add under the grid._

$$
\lvert\nabla L\rvert \;=\; \tfrac14\sqrt{G_x^{2}+G_y^{2}}
$$
_Edge strength, scaled to roughly 0 to 1._

$$
B(x)\;=\;\frac{1}{2r+1}\sum_{i=-r}^{r}L(x+i)
$$
_Box blur of radius r along one axis._

## Interpolation and easing

Whenever a program asks for the value at a position between two pixels, it has to invent one. Bilinear interpolation blends the four surrounding pixels, weighting each by how close the position is to it. Several treatments (liquid morph, wireframe, art deco) use it so that moving a sample point by a fraction of a pixel changes the result smoothly.

Smoothstep is the other recurring curve. It turns a straight ramp from 0 to 1 into an S shape whose slope is zero at both ends, so a transition starts and stops gently. It is used to soften edges into lines and to ease the control grid of the gradient mesh.

$$
f(s,t)=(1-s)(1-t)\,a+s(1-t)\,b+(1-s)\,t\,c+s\,t\,d
$$
_Bilinear blend of four neighbours a, b, c, d with fractional offsets s and t._

$$
S(x)=3u^{2}-2u^{3},\qquad u=\operatorname{clamp}\!\left(\frac{x-a}{b-a},0,1\right)
$$
_Smoothstep from edge a to edge b._

## Seeded randomness and noise

Nothing here uses the browser’s own random numbers, because a result you can’t reproduce is a result you can’t export twice. Instead the treatments use a small seeded generator (mulberry32). Given the same seed it always produces the same sequence, so a still looks identical at preview size and at export size. The “shuffle” buttons simply change the seed.

Where a treatment needs randomness tied to a place (film grain, the clay’s fingerprints, the VHS static) it uses a hash of the pixel coordinates. For smooth, cloud-like variation it blends the hashes at the four nearest lattice points with the smoothstep curve, which is called value noise.

$$
s_{n+1}=\left(s_n+\mathrm{0x6D2B79F5}\right)\bmod 2^{32}
$$
_The state advance of mulberry32. A few xor-shift-multiply steps then scramble s into a number in [0, 1)._

$$
N(x,y)=\operatorname{lerp}\!\Big(\operatorname{lerp}\big(h_{00},h_{10},u\big),\ \operatorname{lerp}\big(h_{01},h_{11},u\big),\ v\Big),\quad u=3x_f^2-2x_f^3,\ v=3y_f^2-2y_f^3
$$
_Value noise from lattice hashes h; x_f and y_f are the fractional parts of the position._

## Tone curves and colour spaces

Contrast controls throughout the app use one curve: pivot around mid-grey and multiply the distance from it by a slope. The slider value c, from −1 to 1, is mapped through a tangent so that zero means “unchanged”, the left end flattens the picture to grey and the right end snaps it toward black and white.

To change how colourful a picture is without changing how bright it is, colours are converted from red-green-blue to hue-saturation-lightness, saturation is scaled, and the result is converted back. Palette treatments (pixel art, Bauhaus) also need to choose the “nearest” colour from a short list, which is done by comparing squared differences between channels.

$$
f=\tan\!\Big(\frac{(c+1)\,\pi}{4}\Big),\qquad L'=\operatorname{clamp}\big((L-\tfrac12)\,f+\tfrac12\big)
$$
_Contrast. At c = 0 the slope f is exactly 1._

$$
C_{\text{out}}=\alpha\,C_{\text{src}}+(1-\alpha)\,C_{\text{dst}}
$$
_The “over” operator the canvas uses whenever something is drawn with partial opacity._

## Compositing, speed and export

Drawing order and blend modes are part of the maths. Neon glow adds light with the “lighter” mode (sums channels), halftone inks combine with “multiply” (like real transparent inks), and kinetic type uses “destination-in” to keep your picture only where the letters are.

Every size in a treatment is stored as a count or a fraction of the picture’s width, never as pixels. That is what makes the exported PNG, rendered at up to three times the preview size, the same picture as the preview, only sharper. Live treatments run at a capped working size (roughly 600 to 900 pixels on the long side) so every frame finishes in a few milliseconds, and still treatments are re-rendered at full size only when you save.

