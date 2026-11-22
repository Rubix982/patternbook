_Note (2026-11-22): kept as C-014's agents read it. The bundle it names is now `engine/engine.js`, which sets
`window.PatternbookEngine` (the same functions are `PatternbookEngine.studio`), and the catalogue is
`engine/CATALOG.md`._

# Using the Lumenary image engine in a page

Lumenary (by Mursal Furqan Kumbhar) is a library of 214 image treatments: print processes,
painting and drawing, film and lenses, crafts from many cultures, generative and animated ones.
Each takes a picture and redraws it in that look. The full menu, with every treatment's dials,
is in `/Users/saifulislam/code/style/treatments/lumenary/CATALOG.md`.

## Load it

Your page is saved in `runs/c014/`. Load the engine with this exact relative path:

```html
<script src="../../treatments/lumenary/lumenary.js"></script>
```

It defines `window.Lumenary`. It runs in the browser from a file on disk; no server, no network.

## You have to give it a picture

A treatment needs a source picture, and the page may not use external images. So draw the source
yourself on a `<canvas>` (shapes, gradients, light and shadow, a simple scene), or render an
inline SVG into a canvas, then treat it. Treatments respond to light and dark, edges and colour,
so a source with clear forms and some tonal range works much better than flat shapes.
`Lumenary.sample(w, h)` returns a ready-made still life (three solids on a table) if you need one.

## API

```js
const src = document.createElement('canvas');   // draw your scene on it first
// still treatments: returns a new canvas with the result (at the treatment's own working size)
const out = Lumenary.render('linocut', src, { lines: 80, ink: 'indigo' });
someElement.appendChild(out);                  // size it with CSS: width: 100%; height: auto

// live treatments: animate into a canvas you provide; returns { stop, setParams }
Lumenary.animate('fireflies', src, { }, targetCanvas);

Lumenary.list();          // every treatment: { id, name, blurb, kind: 'still'|'live', section, params }
Lumenary.defaults('linocut');   // its default dials
```

Dials you don't pass keep their defaults. Use only ids and dial values listed in `CATALOG.md`.
Each still render takes roughly 50–300 ms, so keep to a handful of pictures and render them after
the page has loaded.

Please keep a small credit somewhere on the page: "Pictures made with Lumenary by Mursal Furqan Kumbhar."
