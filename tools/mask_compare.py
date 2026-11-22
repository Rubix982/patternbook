"""C-039's and C-040's checks for a model's stone masks against C-031's brightness masks.

    .venv/bin/python -I tools/mask_compare.py --masks runs/c040/masks/birefnet-tiled --run runs/c040

agreement.json: for each of C-031's 17 measured jalis, the intersection over union of the two masks' openings inside the
brightness openings' convex hull; sheet (local, it holds V&A photos): the photo, brightness's openings and the model's,
for the two left-out screens and three fine ones; met-bars.json: the Met screens' between-bar spread on the model's
masks (tools/screen_hand.py).
"""
import csv
import importlib.util
import json
import os
import sys

import numpy as np
from PIL import Image
from skimage.morphology import convex_hull_image

here = os.path.dirname(os.path.abspath(__file__))
def load(name, file):
    spec = importlib.util.spec_from_file_location(name, os.path.join(here, file)); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m
sm, sh = load("screen_measure", "screen_measure.py"), load("screen_hand", "screen_hand.py")

masks, run = sys.argv[sys.argv.index("--masks") + 1], sys.argv[sys.argv.index("--run") + 1]
rows = [r for r in csv.DictReader(open("pieces/jali/samples.tsv"), delimiter="\t") if r["role"] == "jali"]
res, sheet_rows = {}, []
for r in rows:
    st = dict(kv.split("=") if "=" in kv else (kv, "1") for kv in r["settings"].split(";") if kv)
    crop = [int(v) for v in st["crop"].split(",")] if "crop" in st else None
    rgb, L = sm.load(r["image"], crop)
    _, _, om = sm.segment(L, stone_mask=sm.load_stone(os.path.join(masks, f"{r['id']}.png"), L.shape))
    rec = {"status": r["status"]}
    ob = None
    if r["status"] == "measured":
        _, _, ob = sm.segment(L, "flip" in st, float(st.get("thr", 0)))
        hull = convex_hull_image(ob)
        a, b = ob & hull, om & hull
        rec["iou"] = round(float((a & b).sum() / max(1, (a | b).sum())), 4)
    res[r["id"]] = rec
    if r["id"] in ("met-453261", "vam-O472032", "met-453344", "met-453343", "vam-O470734"):
        H, W = L.shape; cy, cx, h = H // 2, W // 2, min(H, W) // 5
        box = (slice(cy - h, cy + h), slice(cx - h, cx + h))
        def ov(m):
            o = (rgb * 0.6).copy()
            if m is not None:
                o[m] = o[m] * 0.3 + np.array([0.1, 0.75, 0.85]) * 0.7
            return Image.fromarray((o[box] * 255).astype(np.uint8)).resize((300, 300))
        if ob is None:
            try:
                _, _, ob = sm.segment(L, "flip" in st, float(st.get("thr", 0)))
            except Exception:
                ob = None
        sheet_rows.append([Image.fromarray((rgb[box] * 255).astype(np.uint8)).resize((300, 300)), ov(ob), ov(om)])
ious = [v["iou"] for v in res.values() if "iou" in v]
summary = {"iou": ious, "at_085": sum(x >= 0.85 for x in ious), "of": len(ious)}
print("IoU with C-031's openings:", [round(x, 2) for x in ious], "| at 0.85 or more:", summary["at_085"], "of", summary["of"])
json.dump({"summary": summary, "per_screen": res}, open(os.path.join(run, "agreement.json"), "w"), indent=1)
os.makedirs(os.path.join(run, "blind"), exist_ok=True)
s = Image.new("RGB", (3 * 304, len(sheet_rows) * 304), "white")
for k, row in enumerate(sheet_rows):
    for j, t in enumerate(row):
        s.paste(t, (j * 304, k * 304))
s.save(os.path.join(run, "blind", "sheet.jpg"), quality=86)
# screen_hand reads through its own copy of screen_measure (sh.sm): the model's mask has to be put there (C-040's
# first reading put it on this file's copy and read brightness's bars again)
orig, bars = sh.sm.segment, {}
for i in ("met-453343", "met-453344"):
    path = f"pieces/jali/images/{i}.jpg"
    _, L = sh.sm.load(path, None)
    m = sh.sm.load_stone(os.path.join(masks, f"{i}.png"), L.shape)
    sh.sm.segment = lambda L_, flip=False, thr=0.0, _m=m: orig(L_, stone_mask=_m)
    bars[i] = sh.between_bars(path)
    sh.sm.segment = orig
    print(i, "bars on the model's mask:", bars[i])
json.dump(bars, open(os.path.join(run, "met-bars.json"), "w"), indent=1)
