"""A jali photo's albedo (its surface colour with the light taken out) by Marigold's intrinsic model, its stone and
openings split on the albedo, and each stone's colour (C-041).

    .venv-models/bin/python tools/screen_albedo.py --run runs/c041

prs-eth/marigold-iid-lighting-v1-1 (OpenRAIL++, through diffusers, on the Mac's GPU), over tiles of 512 px at its
768 px processing size, overlapping by a quarter, blended with a raised cosine. Writes runs/c041/albedo/<id>.png
(sRGB), runs/c041/stone/<id>.png (the stone, split on the albedo by C-031's reader with the sample's settings) and
runs/c041/colours.json (each screen's median albedo over its stone, in sRGB and CIELAB). The V&A's stay local.
"""
import csv
import importlib.util
import json
import os
import sys

import numpy as np
from PIL import Image
from skimage.color import rgb2lab

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
spec = importlib.util.spec_from_file_location("screen_measure", os.path.join(ROOT, "tools", "screen_measure.py"))
sm = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sm)


def to_srgb(lin):
    lin = np.clip(lin, 0, 1)
    return np.where(lin <= 0.0031308, 12.92 * lin, 1.055 * lin ** (1 / 2.4) - 0.055)


class Albedo:
    def __init__(self):
        import torch
        from diffusers import MarigoldIntrinsicsPipeline
        self.torch = torch
        self.p = MarigoldIntrinsicsPipeline.from_pretrained("prs-eth/marigold-iid-lighting-v1-1", variant="fp16", torch_dtype=torch.float32).to("mps")
        tp = getattr(self.p, "target_properties", None) or {}
        self.names = tp.get("target_names", ["albedo", "shading", "residual"])
        self.space = (tp.get("albedo") or {}).get("prediction_space", "linear")
        print("targets", self.names, "albedo space", self.space, flush=True)

    def tile(self, img):
        with self.torch.no_grad():
            out = self.p(img, num_inference_steps=4, ensemble_size=1, processing_resolution=768, output_type="np")
        a = np.asarray(out.prediction)[self.names.index("albedo")]
        return to_srgb(a) if self.space == "linear" else np.clip(a, 0, 1)


def tiled(model, img, tile=512, overlap=0.25):
    W, H = img.size
    step = int(tile * (1 - overlap))
    xs = sorted(set(list(range(0, max(1, W - tile), step)) + [max(0, W - tile)]))
    ys = sorted(set(list(range(0, max(1, H - tile), step)) + [max(0, H - tile)]))
    acc, wsum = np.zeros((H, W, 3), np.float32), np.zeros((H, W, 1), np.float32)
    w1 = 0.5 - 0.5 * np.cos(2 * np.pi * (np.arange(tile) + 0.5) / tile)
    win = (np.outer(w1, w1) + 1e-3).astype(np.float32)[..., None]
    for y0 in ys:
        for x0 in xs:
            a = model.tile(img.crop((x0, y0, x0 + tile, y0 + tile)))
            if a.shape[:2] != (tile, tile):
                a = np.asarray(Image.fromarray((a * 255).astype(np.uint8)).resize((tile, tile), Image.BILINEAR), np.float32) / 255
            h, w = min(tile, H - y0), min(tile, W - x0)
            acc[y0:y0 + h, x0:x0 + w] += (a * win)[:h, :w]
            wsum[y0:y0 + h, x0:x0 + w] += win[:h, :w]
    return acc / np.maximum(wsum, 1e-6)


def main(run):
    rows = [r for r in csv.DictReader(open(os.path.join(ROOT, "pieces/jali/samples.tsv")), delimiter="\t") if r["role"] == "jali"]
    for d in ("albedo", "stone"):
        os.makedirs(os.path.join(run, d), exist_ok=True)
    m, colours = Albedo(), {}
    for r in rows:
        img = Image.open(os.path.join(ROOT, r["image"])).convert("RGB")
        st = dict(kv.split("=") if "=" in kv else (kv, "1") for kv in r["settings"].split(";") if kv)
        if "crop" in st:
            x0, y0, x1, y1 = [int(v) for v in st["crop"].split(",")]
            img = img.crop((x0, y0, x1, y1))
        alb = tiled(m, img)
        Image.fromarray((alb * 255).astype(np.uint8)).save(os.path.join(run, "albedo", f"{r['id']}.png"))
        L = 0.2126 * alb[..., 0] + 0.7152 * alb[..., 1] + 0.0722 * alb[..., 2]
        try:
            stone, screen, op = sm.segment(L, "flip" in st, float(st.get("thr", 0)))
        except BaseException as e:
            print(r["id"], "split failed:", e, flush=True)
            continue
        Image.fromarray((stone * 255).astype(np.uint8)).save(os.path.join(run, "stone", f"{r['id']}.png"))
        med = np.median(alb[stone], axis=0)
        lab = rgb2lab(med[None, None, :])[0, 0]
        colours[r["id"]] = {"material": r["material"], "srgb": [round(float(v), 4) for v in med], "hex": "#" + "".join(f"{int(round(v * 255)):02x}" for v in med),
                            "lab": [round(float(v), 2) for v in lab]}
        print(r["id"], r["material"] or "-", colours[r["id"]]["hex"], "Lab", colours[r["id"]]["lab"], f"stone {stone.mean():.3f}", flush=True)
    json.dump(colours, open(os.path.join(run, "colours.json"), "w"), indent=1)


if __name__ == "__main__":
    main(sys.argv[sys.argv.index("--run") + 1])
