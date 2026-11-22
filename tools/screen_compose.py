"""The proportions of a pierced screen's composition, from its mask (C-034).

    .venv/bin/python -I tools/screen_compose.py pieces/jali --out runs/c034/proportions.json

For each measured sample (samples.tsv, with its reader settings): the plain margin, from the slab's edge to the first
opening, over the slab's width (each side, and their mean without the top); and, where composition.tsv reads the
outline as an arch and the spandrels aren't pierced, the arch's rise (from the springing, the highest row where the
openings' hull is at least 95 % of its widest, to its top) over the field's width.
"""
import csv
import importlib.util
import json
import os
import sys

import numpy as np
from skimage.morphology import convex_hull_image

here = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("screen_measure", os.path.join(here, "screen_measure.py"))
sm = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sm)

piece = sys.argv[1]
out = sys.argv[sys.argv.index("--out") + 1]
comp = {r["id"]: r for r in csv.DictReader(open(os.path.join(piece, "composition.tsv")), delimiter="\t")}
recs = []
for r in csv.DictReader(open(os.path.join(piece, "samples.tsv")), delimiter="\t"):
    if r["role"] != "jali" or r.get("status") != "measured":
        continue
    st = dict(kv.split("=") if "=" in kv else (kv, "1") for kv in r["settings"].split(";") if kv)
    crop = [int(v) for v in st["crop"].split(",")] if "crop" in st else None
    rgb, L = sm.load(r["image"], crop)
    stone, screen, openings = sm.segment(L, "flip" in st, float(st.get("thr", 0)))
    sy, sx = np.nonzero(screen)
    oy, ox = np.nonzero(openings)
    W = sx.max() - sx.min() + 1
    m = {"left": (ox.min() - sx.min()) / W, "right": (sx.max() - ox.max()) / W, "top": (oy.min() - sy.min()) / W, "bottom": (sy.max() - oy.max()) / W}
    rec = {"id": r["id"], "layout": comp[r["id"]]["layout"], "margin": {k: round(float(v), 4) for k, v in m.items()},
           "margin_mean": round(float(np.mean([m["left"], m["right"], m["bottom"]])), 4)}
    c = comp[r["id"]]
    if c["outline"] in ("pointed", "cusped", "rounded") and c["spandrels"] != "pierced":
        hull = convex_hull_image(openings)
        widths = hull.sum(axis=1)
        rows = np.nonzero(widths)[0]
        top, wmax = rows.min(), widths.max()
        spring = rows[np.nonzero(widths[rows] >= 0.95 * wmax)[0].min()]
        rec["rise_over_width"] = round(float((spring - top) / wmax), 4)
    recs.append(rec)
    print(rec)
os.makedirs(os.path.dirname(out), exist_ok=True)
json.dump(recs, open(out, "w"), indent=1)
