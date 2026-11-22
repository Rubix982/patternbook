# service

patternbook's engine as an MCP server. A client (an agent such as Claude) finds crafts and what is known about them,
draws a scene for a request as SVG or brings a picture, and gets back finished images at the sizes a page needs: one
style at a time, several very different ones at once, or one craft printed through another (card C-030).

It runs every style in the engine (223: Lumenary's 214 and patternbook's nine crafts) in headless Chromium, which also
reads the scenes and pictures (SVG, PNG, JPEG, WebP, GIF) and writes WebP or PNG.

## Set up

```
cd service && npm install            # the MCP SDK and Playwright
npx playwright install chromium      # only if Playwright has no Chromium yet
```

Hook it up to Claude Code, either with a project file (`.mcp.json` in the project that will use it):

```json
{ "mcpServers": { "patternbook": { "type": "stdio", "command": "node",
  "args": ["${HOME}/code/style/service/mcp.mjs"], "env": { "PATTERNBOOK_OUT": "<folder for outputs>" } } } }
```

or with one command: `claude mcp add patternbook -- node <path to>/service/mcp.mjs`. Outputs go to
`PATTERNBOOK_OUT`, or `./patternbook-out/`, unless a call gives a path.

## Tools

| Tool | What it does |
|---|---|
| `find_styles` | search the styles by meaning (what they look like, the craft, its history), or list a section |
| `describe_style` | a style's dials and what is written about its craft |
| `search_knowledge` | search the atlas, the process pages and the style models: what a craft is, where it comes from, its colours and motifs |
| `render` | a source (`{ svg }`, `{ image_path }` or `{ handle }`) through one style at a size; saves it, returns a preview and a handle. Style `source` shows the source itself |
| `explore` | the same source through several very different styles at once (from many sections, the most different of a larger trial), as a contact sheet with a handle each; `sections`, `exclude`, `seed`, and `min_likeness` (0.3 keeps the scene recognisable) narrow it |
| `chain` | one craft printed through another, in turn |
| `save` | an earlier result to a file, at another size if asked |

Sizes: `cover` 1100 x 770 (a post's cover), `square` 1080 x 1080, `portrait` 1080 x 1350, `story` 1080 x 1920,
`card` 1200 x 630, `banner` 1500 x 500, or `width` and `height`. The same call gives the same bytes every time;
`seed` gives a different hand or a different set.

## Drawing scenes that survive a craft

A craft keeps strong tones and large shapes and loses small ones: in C-030's trial a small walking figure and the
walls at a road's edge vanished in most crafts, while the road, the hills and a star's glow came through every time.
Draw the subject large, with a clear light and dark; give the scene a `viewBox`. Sections K, L, M and P hold the world,
Sindhi, South Asian and patternbook's own crafts.

## Check

`node service/check.mjs --out runs/c030/check.json` starts the server as a client would and judges it from its answers:
the MCP contract, how different an explore's candidates are, whether they carry the scene, sizes, determinism, speed.
