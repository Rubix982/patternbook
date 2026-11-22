"""Can image features tell the generator's jalis from real ones, and is their cue the writer's? (C-043)

    .venv-models/bin/python tools/jali_probe.py --run runs/c043

Crops: eight squares of five repeats at random places (seed 43) inside the openings' hull of each of C-031's 15
geometric jalis and each of C-035's 36 candidate designs, smoothed (0.15 bar widths) and thresholded as C-037 did, 384 px,
solid dark and open light. Features: DINOv2 (facebook/dinov2-base, the CLS token) and SigLIP
(google/siglip-base-patch16-224, its image embedding), both Apache-2.0, on the Mac's GPU. A standardised logistic
regression tells generated from real; accuracy by five-fold cross-validation with every crop of one screen or design in
the same fold. Then the images the writer saw (C-035, C-036 and C-037's pattern rows, from their local pick pages): for
each row, a model trained without that row's real screen and design scores both images, and the row counts for the
truly generated image if it is rated the more generated, and for the writer if the writer's pick is.
"""
import base64
import csv
import io
import json
import os
import random
import re
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi
from skimage.measure import label
from skimage.morphology import convex_hull_image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
import importlib.util  # noqa: E402

spec = importlib.util.spec_from_file_location("screen_measure", os.path.join(ROOT, "tools", "screen_measure.py"))
sm = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sm)


def openings(path, st):
    crop = [int(v) for v in st["crop"].split(",")] if "crop" in st else None
    rgb, L = sm.load(path, crop)
    stone, screen, op = sm.segment(L, "flip" in st, float(st.get("thr", 0)))
    lab, n = label(op, connectivity=1, return_num=True)
    if n:
        mr = ndi.maximum(ndi.distance_transform_edt(op), lab, index=np.arange(1, n + 1))
        op = op & ~np.isin(lab, np.nonzero(2 * mr < 6)[0] + 1)
    return op


def crops(op, repeat, bar, rnd, k=8, side=384):
    hull = convex_hull_image(op)
    half = int(round(2.5 * repeat))
    while half > 10:
        inner = ndi.binary_erosion(hull, iterations=half)
        ys, xs = np.nonzero(inner)
        if len(ys) > 50:
            break
        half -= 4
    sm_ = ndi.gaussian_filter(op.astype(float), max(0.5, 0.15 * bar)) >= 0.5
    out = []
    for _ in range(k):
        j = rnd.randrange(len(ys))
        cy, cx = ys[j], xs[j]
        m = sm_[cy - half:cy + half, cx - half:cx + half]
        rgb = np.where(m[..., None], np.array([236, 230, 220], np.uint8), np.array([43, 38, 34], np.uint8)).astype(np.uint8)
        out.append(Image.fromarray(rgb).resize((side, side), Image.LANCZOS))
    return out


class Features:
    def __init__(self):
        import torch
        from transformers import AutoImageProcessor, AutoModel, SiglipModel
        self.torch = torch
        self.dev = "mps" if torch.backends.mps.is_available() else "cpu"
        self.dp = AutoImageProcessor.from_pretrained("facebook/dinov2-base")
        self.dm = AutoModel.from_pretrained("facebook/dinov2-base").to(self.dev).eval()
        self.sp = AutoImageProcessor.from_pretrained("google/siglip-base-patch16-224")  # images only: no text tokenizer
        self.smod = SiglipModel.from_pretrained("google/siglip-base-patch16-224").to(self.dev).eval()

    def __call__(self, imgs):
        t = self.torch
        with t.no_grad():
            d = self.dm(**self.dp(images=imgs, return_tensors="pt").to(self.dev)).last_hidden_state[:, 0]
            s = self.smod.get_image_features(pixel_values=self.sp(images=imgs, return_tensors="pt")["pixel_values"].to(self.dev))
            s = s.pooler_output if hasattr(s, "pooler_output") else s
        return {"dinov2": d.cpu().numpy(), "siglip": s.cpu().numpy()}


def embed(feat, imgs, batch=16):
    out = {"dinov2": [], "siglip": []}
    for i in range(0, len(imgs), batch):
        f = feat(imgs[i:i + batch])
        for k in out:
            out[k].append(f[k])
    return {k: np.vstack(v) for k, v in out.items()}


def fit(X, y):
    from sklearn.linear_model import LogisticRegression
    from sklearn.pipeline import make_pipeline
    from sklearn.preprocessing import StandardScaler
    return make_pipeline(StandardScaler(), LogisticRegression(C=1.0, max_iter=5000)).fit(X, y)


def pick_rows():
    """The images the writer saw, with which was generated and what the writer picked, from the local pick pages."""
    rows = []
    def imgs(path):
        return [Image.open(io.BytesIO(base64.b64decode(m))).convert("RGB") for m in re.findall(r'base64,([A-Za-z0-9+/=]+)"', open(path).read())]
    k35, r35, i35 = json.load(open("runs/c035/blind/key.json"))["pairs"], json.load(open("runs/c035/result.json"))["pairs"], imgs("runs/c035/blind/pick.html")
    for n, (p, r) in enumerate(zip(k35, r35)):
        g = p["left"] if p["generated"] == "L" else p["right"]
        real = p["right"] if p["generated"] == "L" else p["left"]
        rows.append({"card": "C-035", "row": n + 1, "left": i35[2 * n], "right": i35[2 * n + 1], "generated": p["generated"], "picked": r["picked"], "real_id": real, "design": g})
    k36, r36, i36 = json.load(open("runs/c036/blind/key.json"))["rows"], json.load(open("runs/c036/result.json"))["rows"], imgs("runs/c036/blind/pick.html")
    for n, (p, r) in enumerate(zip(k36, r36)):
        rows.append({"card": "C-036", "row": n + 1, "left": i36[2 * n], "right": i36[2 * n + 1], "generated": p["generated"], "picked": r["picked"], "real_id": p["real_id"], "design": p["generated_id"].replace("-b", "")})
    k37, r37, i37 = json.load(open("runs/c037/blind/key.json"))["rows"], json.load(open("runs/c037/result.json"))["rows"], imgs("runs/c037/blind/pick.html")
    for n, (p, r) in enumerate(zip(k37, r37)):
        if p["block"] != "pattern":
            continue
        rows.append({"card": "C-037", "row": n + 1, "left": i37[2 * n], "right": i37[2 * n + 1], "generated": p["generated"], "picked": r["picked"], "real_id": p["real_id"], "design": p["generated_id"]})
    return rows


def main(run):
    from sklearn.model_selection import GroupKFold
    os.makedirs(run, exist_ok=True)
    rnd = random.Random(43)
    samples = {r["id"]: r for r in csv.DictReader(open("pieces/jali/samples.tsv"), delimiter="\t")}
    c031 = {r["id"]: r for r in json.load(open("runs/c031/measures.json"))}
    geo = sorted(i for i, r in c031.items() if r["role"] == "jali" and r["family"] == "geometric")
    m35 = {r["id"]: r for r in json.load(open("runs/c035/measure/measures.json"))}
    imgs, y, groups = [], [], []
    for i in geo:
        st = dict(kv.split("=") if "=" in kv else (kv, "1") for kv in samples[i]["settings"].split(";") if kv)
        for c in crops(openings(samples[i]["image"], st), c031[i]["opening_px"] + c031[i]["bar_px"], c031[i]["bar_px"], rnd):
            imgs.append(c); y.append(0); groups.append(i)
    for i in sorted(m35):
        r = m35[i]
        if "error" in r:
            continue
        for c in crops(openings(f"runs/c035/designs/{i}.png", {}), r["opening_px"] + r["bar_px"], r["bar_px"], rnd):
            imgs.append(c); y.append(1); groups.append(i)
    y, groups = np.array(y), np.array(groups)
    print(f"{(y == 0).sum()} real crops from {len(geo)} screens, {(y == 1).sum()} generated from {len(set(groups[y == 1]))} designs", flush=True)
    feat = Features()
    X = embed(feat, imgs)
    out = {"crops": {"real": int((y == 0).sum()), "generated": int((y == 1).sum())}, "cv": {}, "rows": []}
    for k, Xk in X.items():
        acc = []
        for tr, te in GroupKFold(n_splits=5).split(Xk, y, groups):
            acc.append(float((fit(Xk[tr], y[tr]).predict(Xk[te]) == y[te]).mean()))
        out["cv"][k] = {"accuracy": round(float(np.mean(acc)), 4), "folds": [round(a, 3) for a in acc]}
        print(k, "grouped five-fold accuracy", out["cv"][k], flush=True)
    rows = pick_rows()
    R = embed(feat, [r["left"] for r in rows] + [r["right"] for r in rows])
    n = len(rows)
    for k in X:
        hits_truth, hits_writer = 0, 0
        for j, r in enumerate(rows):
            keep = (groups != r["real_id"]) & (groups != r["design"])
            mdl = fit(X[k][keep], y[keep])
            pl, pr = mdl.predict_proba(R[k][[j, n + j]])[:, 1]
            more = "L" if pl > pr else "R"
            hits_truth += more == r["generated"]
            hits_writer += more == r["picked"]
            out["rows"].append({"model": k, "card": r["card"], "row": r["row"], "p_left": round(float(pl), 3), "p_right": round(float(pr), 3), "rated_more_generated": more, "generated": r["generated"], "writer_picked": r["picked"]})
        out[k] = {"rows": n, "rates_generated_higher": hits_truth, "agrees_with_writer": hits_writer}
        print(k, f"on the writer's {n} rows: rates the truly generated image higher in {hits_truth}, agrees with the writer's pick in {hits_writer}", flush=True)
    writer_right = sum(r["picked"] == r["generated"] for r in rows)
    out["writer_right"] = writer_right
    print("the writer on the same rows:", writer_right, "of", n, flush=True)
    json.dump(out, open(os.path.join(run, "result.json"), "w"), indent=1)


if __name__ == "__main__":
    main(sys.argv[sys.argv.index("--run") + 1])
