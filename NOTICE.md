# Notice

patternbook builds on other people's work. This says what came from where, and where it is now.

## Lumenary

**Lumenary** by **Mursal Furqan Kumbhar**: https://github.com/mursalfk/lumenary
(live site: https://lumenary-studio.vercel.app).

- Copied: 2026-11-16, at commit `0493e555edcba40adadcff4502c573cd0bcbf5d6` ("Add subject-aware section N: Type Behind and Split Treatment (214 treatments)").
- **Kept**, every file's content unchanged from that commit except where noted, in the places patternbook uses them
  (since 2026-11-22):
  - his engine, `src/engine/` (the 214 treatments and the code they use): the base of `engine/`, the treatments in
    `engine/styles/`;
  - his theory data, `src/data/sections.js`, `src/data/theory*.js` and `src/data/theory-extra/`:
    `processes/sources/data/` (`theoryGroups.js`'s import path changed);
  - `src/utils/presets.js` (needed by the checker): `engine/presets.js`;
  - his Node script `scripts/check-theory.mjs`: `engine/check/theory.mjs` (its paths changed);
  - the subject model, `public/models/u2netp.onnx`: `engine/models/`;
  - from his `README.md`, the two sections on the engine and on adding a treatment, adapted, in `engine/README.md`
    ("How a style is written").
- **Not kept**, kept at first and removed on 2026-11-22 because patternbook doesn't use them: the rest of his
  `README.md` (it describes his website), `TREATMENTS.md` and `scripts/catalogue.mjs` (`engine/CATALOG.md` and
  `engine/catalog.mjs` list every style), and `package.json`. All are in his repository at the commit above.
- **Removed at copying, because they only serve his website:** the React app (`src/components`, `pages`, `hooks`, `hoc`,
  `styles`, `App.jsx`, `main.jsx`, `env.js`, `source.js`, `thumbs.js`, the other `src/utils` files), the site copy
  (`src/data/about.js`, `copy.js`, `feedback.js`, `maker.js`, `nav.js`), video export (`src/engine/videoExport.js`,
  `mediabunny.js`), the Vite-only `src/engine/styles/index.js`, the build and hosting config, `index.html`,
  `public/` images and sitemap, `instructions.md` and `lumenary_batch.py`. The full project is at the link above.
- **Permission:** the author told Saif on 2026-11-16 that the project is "totally open source" and free to use.
  The repository has no LICENSE file yet; if one is added, it replaces this note.
- `engine/models/u2netp.onnx` is the U²-Net "p" model by Xuebin Qin et al.
  (https://github.com/xuebinqin/U-2-Net, Apache-2.0), used by the two subject-aware treatments.
- Fonts are npm dependencies (`@fontsource/*`, OFL) and are not included here.

Please credit Mursal Furqan Kumbhar and link the repository wherever this code or its theory is used.
