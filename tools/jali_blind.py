"""C-035's blind pick: real jalis against generated designs, both as masks, on one local page (no labels).

    .venv/bin/python -I tools/jali_blind.py make --run runs/c035      # writes runs/c035/blind/pick.html and key.json
    .venv/bin/python -I tools/jali_blind.py score --run runs/c035 CODE  # CODE: the letters the page shows at the end

Real: the 12 of C-031's 15 geometric jalis picked by seed 32. Generated: runs/c035/inside.json's first 12. Each image is
split by C-031's reader (its settings per sample); a square of five repeats (an opening and a bar, from the reader) is
cut round the centre of the openings' hull, smaller if five repeats don't fit inside it; scaled to 360 px; blurred
(sigma 1.5 px) and thresholded at half; drawn solid dark, open light. Pairs and sides are shuffled with seed 35.
The page and the key stay in runs/c035/blind/ (git-ignored): the real crops come from photos the V&A licenses for
non-commercial use only.
"""
import base64
import csv
import importlib.util
import io
import json
import os
import random
import sys

import numpy as np
from PIL import Image, ImageFilter
from skimage.morphology import convex_hull_image

here = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("screen_measure", os.path.join(here, "screen_measure.py"))
sm = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sm)
from scipy import ndimage as ndi  # noqa: E402
from skimage.measure import label  # noqa: E402

SIDE = 360


def openings_of(path, st):
    crop = [int(v) for v in st["crop"].split(",")] if "crop" in st else None
    rgb, L = sm.load(path, crop)
    stone, screen, op = sm.segment(L, "flip" in st, float(st.get("thr", 0)))
    lab, n = label(op, connectivity=1, return_num=True)
    if n:
        mr = ndi.maximum(ndi.distance_transform_edt(op), lab, index=np.arange(1, n + 1))
        op = op & ~np.isin(lab, np.nonzero(2 * mr < 6)[0] + 1)
    return op


def crop_mask(op, repeat):
    hull = convex_hull_image(op)
    cy, cx = [int(round(v)) for v in ndi.center_of_mass(hull)]
    half = int(round(2.5 * repeat))
    while half > 10:
        y0, y1, x0, x1 = cy - half, cy + half, cx - half, cx + half
        if y0 >= 0 and x0 >= 0 and y1 <= hull.shape[0] and x1 <= hull.shape[1] and hull[y0:y1, x0:x1].all():
            break
        half -= 2
    m = op[cy - half:cy + half, cx - half:cx + half].astype(np.uint8) * 255
    im = Image.fromarray(m).resize((SIDE, SIDE), Image.BILINEAR).filter(ImageFilter.GaussianBlur(1.5))
    a = np.asarray(im) >= 128
    rgb = np.where(a[..., None], np.array([236, 230, 220], np.uint8), np.array([43, 38, 34], np.uint8))
    out = Image.fromarray(rgb.astype(np.uint8))
    return out, round(half * 2 / repeat, 2)


def b64(im):
    buf = io.BytesIO()
    im.save(buf, "PNG")
    return base64.b64encode(buf.getvalue()).decode()


def make(run):
    samples = {r["id"]: r for r in csv.DictReader(open("pieces/jali/samples.tsv"), delimiter="\t")}
    c031 = {r["id"]: r for r in json.load(open("runs/c031/measures.json"))}
    geo = sorted(i for i, r in c031.items() if r["role"] == "jali" and r["family"] == "geometric")
    real = random.Random(32).sample(geo, 12)
    gen = json.load(open(os.path.join(run, "inside.json")))["first12"]
    gm = {r["id"]: r for r in json.load(open(os.path.join(run, "measure", "measures.json")))}
    imgs = {}
    for i in real:
        st = dict(kv.split("=") if "=" in kv else (kv, "1") for kv in samples[i]["settings"].split(";") if kv)
        imgs[i] = crop_mask(openings_of(samples[i]["image"], st), c031[i]["opening_px"] + c031[i]["bar_px"])
    for i in gen:
        imgs[i] = crop_mask(openings_of(os.path.join(run, "designs", f"{i}.png"), {}), gm[i]["opening_px"] + gm[i]["bar_px"])
    rnd = random.Random(35)
    g, r = gen[:], real[:]
    rnd.shuffle(g)
    rnd.shuffle(r)
    pairs = []
    for a, b in zip(g, r):
        left_is_gen = rnd.random() < 0.5
        pairs.append({"left": a if left_is_gen else b, "right": b if left_is_gen else a, "generated": "L" if left_is_gen else "R"})
    os.makedirs(os.path.join(run, "blind"), exist_ok=True)
    json.dump({"pairs": pairs, "repeats_shown": {k: v[1] for k, v in imgs.items()}}, open(os.path.join(run, "blind", "key.json"), "w"), indent=1)
    rows = "\n".join(
        f'<div class="pair" data-i="{k}"><div class="n">{k + 1}</div>'
        f'<button data-side="L"><img alt="" src="data:image/png;base64,{b64(imgs[p["left"]][0])}"></button>'
        f'<button data-side="R"><img alt="" src="data:image/png;base64,{b64(imgs[p["right"]][0])}"></button></div>'
        for k, p in enumerate(pairs))
    html = PAGE.replace("{{ROWS}}", rows)
    open(os.path.join(run, "blind", "pick.html"), "w").write(html)
    print(f"{len(pairs)} pairs -> {os.path.join(run, 'blind', 'pick.html')}")


def score(run, code):
    key = json.load(open(os.path.join(run, "blind", "key.json")))
    code = code.strip().upper()
    assert len(code) == len(key["pairs"]) and set(code) <= {"L", "R"}, "the code is one L or R per pair"
    hits = [c == p["generated"] for c, p in zip(code, key["pairs"])]
    res = {"code": code, "correct": int(sum(hits)), "of": len(hits),
           "pairs": [{"pair": k + 1, **p, "picked": c, "correct": h} for k, (c, p, h) in enumerate(zip(code, key["pairs"], hits))]}
    json.dump(res, open(os.path.join(run, "result.json"), "w"), indent=1)
    print(f"picked the generated one in {res['correct']} of {res['of']}")


PAGE = """<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Jali blind pick</title><style>
:root{--bg:#f6f3ee;--ink:#231f1b;--mute:#6b645c;--line:#d8d1c7;--pick:#b5532c}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.5 system-ui,sans-serif}
main{max-width:820px;margin:0 auto;padding:24px 16px 80px}
h1{font-size:22px;margin:0 0 8px}p{margin:0 0 12px;color:var(--mute)}
.pair{display:grid;grid-template-columns:28px 1fr 1fr;gap:12px;align-items:center;margin:18px 0}
.n{color:var(--mute);font-variant-numeric:tabular-nums}
button{padding:0;border:3px solid transparent;background:none;cursor:pointer;border-radius:4px}
button img{display:block;width:100%;height:auto;border-radius:2px}
button.on{border-color:var(--pick)}
#done{margin-top:24px;padding:16px;border:1px solid var(--line);border-radius:6px;display:none}
#code{font:600 20px/1.4 ui-monospace,monospace;letter-spacing:2px}
textarea{width:100%;min-height:80px;margin-top:8px;font:inherit}
.count{position:sticky;top:0;background:var(--bg);padding:8px 0;border-bottom:1px solid var(--line)}
</style></head><body><main>
<h1>Which one was generated?</h1>
<p>Each row is one real jali and one generated design, both reduced to the same black-and-white pattern. Click the one you
think was generated. Go by first impression; there is no time limit. When all twelve are picked, a code appears: send it
back, with a line on what gave them away, if anything did.</p>
<div class="count"><span id="n">0</span> of 12 picked</div>
{{ROWS}}
<div id="done"><div>Your code:</div><div id="code"></div>
<label>What gave the generated ones away, if anything:<textarea id="notes"></textarea></label></div>
</main><script>
const picks={};
document.querySelectorAll('.pair').forEach(row=>{
  row.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
    row.querySelectorAll('button').forEach(x=>x.classList.remove('on'));b.classList.add('on');
    picks[row.dataset.i]=b.dataset.side;const n=Object.keys(picks).length;document.getElementById('n').textContent=n;
    if(n===12){document.getElementById('code').textContent=[...Array(12).keys()].map(i=>picks[i]).join('');document.getElementById('done').style.display='block';}
  }));
});
</script></body></html>"""

if __name__ == "__main__":
    cmd = sys.argv[1]
    run = sys.argv[sys.argv.index("--run") + 1]
    if cmd == "make":
        make(run)
    else:
        score(run, sys.argv[-1])
