"""Make a self-contained copy of a page with treatments/treatments.js inlined and applied.

The copy stays a single HTML file (like every page in runs/), so it opens from disk.
Usage:
  python3 -I tools/inline-treatment.py <page.html> <out.html> [--treatment press]
         [--selector 'svg[role=img]'] [--opt key=value ...]
"""
import argparse
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent

ap = argparse.ArgumentParser()
ap.add_argument("page")
ap.add_argument("out")
ap.add_argument("--treatment", default="press")
ap.add_argument("--selector", default="svg[role=img]")
ap.add_argument("--opt", action="append", default=[], help="key=value, e.g. spot=#3f6e96")
a = ap.parse_args()

opts = {"treatment": a.treatment}
for kv in a.opt:
    k, v = kv.split("=", 1)
    try:
        opts[k] = float(v)
    except ValueError:
        opts[k] = v

lib = (ROOT / "treatments" / "treatments.js").read_text(encoding="utf-8")
call = (
    "<script>\n" + lib + "\n</script>\n<script>\n"
    "window.addEventListener('load', function () {\n"
    "  var t0 = performance.now();\n"
    f"  Treatments.treatAll({json.dumps(a.selector)}, {json.dumps(opts)}).then(function () {{\n"
    "    document.documentElement.setAttribute('data-treated-ms', Math.round(performance.now() - t0));\n"
    "  });\n"
    "});\n</script>\n"
)
html = pathlib.Path(a.page).read_text(encoding="utf-8")
i = html.lower().rfind("</body>")
html = html[:i] + call + html[i:] if i >= 0 else html + call
pathlib.Path(a.out).write_text(html, encoding="utf-8")
print(f"wrote {a.out} ({a.treatment} on {a.selector!r})")
