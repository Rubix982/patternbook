# Lumenary (vendored)

The engine and data of **Lumenary** by **Mursal Furqan Kumbhar**: https://github.com/mursalfk/lumenary
(live site: https://lumenary-studio.vercel.app).

- Copied: 2026-11-16, at commit `0493e555edcba40adadcff4502c573cd0bcbf5d6` ("Add subject-aware section N: Type Behind and Split Treatment (214 treatments)").
- **Trimmed to the engine and its data** (2026-11-16). Every file here is unchanged from that commit; only
  files were removed. Kept: `src/engine/` (the 214 treatments and the code they use), `src/data/sections.js`,
  the theory data (`src/data/theory*.js`, `src/data/theory-extra/`), `src/utils/presets.js` (needed by the
  checker), his Node scripts `scripts/check-theory.mjs` and `scripts/catalogue.mjs`, the subject model,
  `README.md`, `TREATMENTS.md` and `package.json` (it marks the files as ES modules for Node).
- **Removed, because they only serve his website:** the React app (`src/components`, `pages`, `hooks`, `hoc`,
  `styles`, `App.jsx`, `main.jsx`, `env.js`, `source.js`, `thumbs.js`, the other `src/utils` files), the site copy
  (`src/data/about.js`, `copy.js`, `feedback.js`, `maker.js`, `nav.js`), video export (`src/engine/videoExport.js`,
  `mediabunny.js`), the Vite-only `src/engine/styles/index.js`, the build and hosting config, `index.html`,
  `public/` images and sitemap, `instructions.md` and `lumenary_batch.py`. The full project is at the link above.
- `README.md` describes the whole app, including the parts removed here.
- Our integration lives in `../../treatments/lumenary/`. To check the theory data against the treatments:
  `cd vendor/lumenary && node scripts/check-theory.mjs`.
- **Permission:** the author told Saif on 2026-11-16 that the project is "totally open source" and free to use.
  The repository has no LICENSE file yet; if one is added, it replaces this note.
- `public/models/u2netp.onnx` is the U²-Net "p" model by Xuebin Qin et al.
  (https://github.com/xuebinqin/U-2-Net, Apache-2.0), used by the two subject-aware treatments.
- Fonts are npm dependencies (`@fontsource/*`, OFL) and are not included here.

- **Moved (2026-11-22):** `src/data/` now lives at the repository root as `data/` (see `../../data/README.md`), so
  patternbook's theory sits with the rest of the project. File contents are unchanged except `theoryGroups.js`'s import
  path; `scripts/check-theory.mjs` and `scripts/catalogue.mjs` here were repointed to it.

Please credit Mursal Furqan Kumbhar and link the repository wherever this code or its theory is used.
