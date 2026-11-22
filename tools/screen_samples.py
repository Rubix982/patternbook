"""Measure every sample of a piece and lay each one's mask over its photo on a sheet (C-031).

    .venv/bin/python -I tools/screen_samples.py pieces/jali --run runs/c031

Reads <piece>/samples.tsv (rows whose `status` is measured; its `settings` column: flip; crop=x0,y0,x1,y1; thr=offset), writes <piece>/measures.tsv,
<run>/measures.json, <run>/overlays/<id>.png and <run>/sheet-<n>.jpg (photo and mask side by side, eight to a sheet).
"""
import csv
import importlib.util
import json
import os
import sys

from PIL import Image, ImageDraw

here = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("screen_measure", os.path.join(here, "screen_measure.py"))
sm = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sm)

piece, run = sys.argv[1], sys.argv[sys.argv.index("--run") + 1]
os.makedirs(os.path.join(run, "overlays"), exist_ok=True)
rows = [r for r in csv.DictReader(open(os.path.join(piece, "samples.tsv")), delimiter="\t") if r.get("status", "measured") == "measured"]
recs = []
for r in rows:
    st = dict(kv.split("=") if "=" in kv else (kv, "1") for kv in r["settings"].split(";") if kv)
    crop = [int(v) for v in st["crop"].split(",")] if "crop" in st else None
    ov = os.path.join(run, "overlays", f"{r['id']}.jpg")
    try:
        m = sm.measure(r["image"], flip="flip" in st, crop=crop, thr_offset=float(st.get("thr", 0)),
                       width_mm=float(r["width_mm"]) if r["width_mm"] else None, depth_mm=float(r["depth_mm"]) if r["depth_mm"] else None, overlay=ov)
    except SystemExit as e:
        m = {"error": str(e)}
    except Exception as e:
        m = {"error": repr(e)[:200]}
    m |= {"id": r["id"], "role": r["role"], "family": r["family"], "frame": r["frame"], "material": r["material"]}
    recs.append(m)
    print(r["id"], {k: m.get(k) for k in ["open_share", "bar_over_opening", "per_junction", "rotation", "mirrors", "star", "points", "thickness_over_opening", "repeats_across", "error"]}, flush=True)
json.dump(recs, open(os.path.join(run, "measures.json"), "w"), indent=1)
cols = ["id", "role", "family", "frame", "material", "open_share", "bar_px", "opening_px", "bar_over_opening", "thickness_over_opening",
        "per_junction", "rotation", "mirrors", "star", "points", "junction_degree", "repeats_across", "opening_mm", "bar_mm", "openings", "error"]
with open(os.path.join(piece, "measures.tsv"), "w") as f:
    f.write("\t".join(cols) + "\n")
    for m in recs:
        f.write("\t".join("" if m.get(c) is None else str(m.get(c)) for c in cols) + "\n")
# sheets: photo | mask, eight samples to a sheet
for s in range(0, len(rows), 8):
    part = rows[s:s + 8]
    sheet = Image.new("RGB", (4 * 2 * 300, 2 * 340), "white")
    d = ImageDraw.Draw(sheet)
    for k, r in enumerate(part):
        x, y = (k % 4) * 600, (k // 4) * 340
        for j, p in enumerate([r["image"], os.path.join(run, "overlays", f"{r['id']}.jpg")]):
            if os.path.exists(p):
                im = Image.open(p).convert("RGB")
                im.thumbnail((296, 300))
                sheet.paste(im, (x + j * 300 + 2, y + 2))
        m = next(q for q in recs if q["id"] == r["id"])
        label = f"{s + k}: {r['id']} ({r['role']})" + (f"  ERR" if "error" in m else f"  open {m['open_share']:.2f} r{m['rotation']}{'m' if m['mirrors'] else ''} star {m['star']} pj {m['per_junction']}")
        d.text((x + 4, y + 312), label, fill="black")
    sheet.save(os.path.join(run, f"sheet-{s // 8 + 1}.jpg"), quality=85)
