"""A jali photo's stone from open segmentation models, where brightness can't split it (C-039).

    .venv-models/bin/python tools/screen_masks.py --run runs/c039
    .venv-models/bin/python tools/screen_masks.py --run runs/c040 --tiled     # C-040: over 512 px tiles, enlarged twice

BiRefNet (onnx-community/BiRefNet-ONNX, MIT; run by onnxruntime, so no code from the model's repository runs here) and
SAM 2.1 (facebook/sam2.1-hiera-large, Apache-2.0; through transformers, prompted with one box round the whole photo, the
best-scored of its three masks kept). Each gives the screen's stone (white in runs/c039/masks/<model>/<id>.png); the
openings are the stone's holes, read by tools/screen_measure.py as for C-031. The V&A's masks stay local (git-ignored).
"""
import csv
import json
import os
import sys

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class BiRefNet:
    def __init__(self):
        import onnxruntime as ort
        from huggingface_hub import hf_hub_download
        path = hf_hub_download("onnx-community/BiRefNet-ONNX", "onnx/model_fp16.onnx")
        self.s = ort.InferenceSession(path, providers=["CPUExecutionProvider"])
        self.inp = self.s.get_inputs()[0]
        print("BiRefNet input", self.inp.name, self.inp.shape, self.inp.type, "outputs", [(o.name, o.shape) for o in self.s.get_outputs()], flush=True)

    def prob(self, img):
        """The model's probability of stone on a 1024 px square (the image is resized to it)."""
        a = np.asarray(img.resize((1024, 1024), Image.BILINEAR), np.float32) / 255
        a = ((a - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]).transpose(2, 0, 1)[None]
        a = a.astype(np.float16 if "float16" in self.inp.type else np.float32)
        out = np.asarray(self.s.run(None, {self.inp.name: a})[-1], np.float32)[0, 0]
        return out if (out.min() >= 0 and out.max() <= 1) else 1 / (1 + np.exp(-out))

    def stone(self, img):
        a = np.asarray(img.resize((1024, 1024), Image.BILINEAR), np.float32) / 255
        a = ((a - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]).transpose(2, 0, 1)[None]
        a = a.astype(np.float16 if "float16" in self.inp.type else np.float32)
        out = np.asarray(self.s.run(None, {self.inp.name: a})[-1], np.float32)[0, 0]
        p = out if (out.min() >= 0 and out.max() <= 1) else 1 / (1 + np.exp(-out))
        return np.asarray(Image.fromarray((p * 255).astype(np.uint8)).resize(img.size, Image.BILINEAR)) >= 128


class SAM21:
    def __init__(self):
        import torch
        from transformers import Sam2Model, Sam2Processor
        self.torch = torch
        self.dev = "mps" if torch.backends.mps.is_available() else "cpu"
        self.p = Sam2Processor.from_pretrained("facebook/sam2.1-hiera-large")
        self.m = Sam2Model.from_pretrained("facebook/sam2.1-hiera-large").to(self.dev)

    def stone(self, img):
        W, H = img.size
        box = [[[0.01 * W, 0.01 * H, 0.99 * W, 0.99 * H]]]
        inputs = self.p(images=img, input_boxes=box, return_tensors="pt").to(self.dev)
        with self.torch.no_grad():
            out = self.m(**inputs, multimask_output=True)
        masks = self.p.post_process_masks(out.pred_masks.cpu(), inputs["original_sizes"])[0]
        scores = out.iou_scores.cpu().reshape(-1)
        m = masks.reshape(-1, masks.shape[-2], masks.shape[-1])[int(scores.argmax())]
        return np.asarray(m, bool)


def tiled(model, img, tile=512, scale=2, overlap=0.25):
    """The model's stone over tiles of `tile` px, each enlarged `scale` times for the model, blended by a raised cosine."""
    W, H = img.size
    step = int(tile * (1 - overlap))
    xs = list(range(0, max(1, W - tile), step)) + [max(0, W - tile)]
    ys = list(range(0, max(1, H - tile), step)) + [max(0, H - tile)]
    acc, wsum = np.zeros((H, W), np.float32), np.zeros((H, W), np.float32)
    win1 = 0.5 - 0.5 * np.cos(2 * np.pi * (np.arange(tile) + 0.5) / tile)
    win = np.outer(win1, win1).astype(np.float32) + 1e-3
    for y0 in sorted(set(ys)):
        for x0 in sorted(set(xs)):
            t = img.crop((x0, y0, x0 + tile, y0 + tile))
            p = model.prob(t.resize((tile * scale, tile * scale), Image.LANCZOS))
            p = np.asarray(Image.fromarray((p * 255).astype(np.uint8)).resize((tile, tile), Image.BILINEAR), np.float32) / 255
            h, w = min(tile, H - y0), min(tile, W - x0)
            acc[y0:y0 + h, x0:x0 + w] += (p * win)[:h, :w]
            wsum[y0:y0 + h, x0:x0 + w] += win[:h, :w]
    return acc / np.maximum(wsum, 1e-6) >= 0.5


def main(run):
    rows = [r for r in csv.DictReader(open(os.path.join(ROOT, "pieces/jali/samples.tsv")), delimiter="\t") if r["role"] == "jali"]
    if "--tiled" in sys.argv:  # C-040: BiRefNet over 512 px tiles enlarged twice
        b = BiRefNet()
        os.makedirs(os.path.join(run, "masks", "birefnet-tiled"), exist_ok=True)
        for r in rows:
            img = Image.open(os.path.join(ROOT, r["image"])).convert("RGB")
            st = dict(kv.split("=") for kv in r["settings"].split(";") if "=" in kv)
            if "crop" in st:
                x0, y0, x1, y1 = [int(v) for v in st["crop"].split(",")]
                img = img.crop((x0, y0, x1, y1))
            m = tiled(b, img)
            Image.fromarray((m * 255).astype(np.uint8)).save(os.path.join(run, "masks", "birefnet-tiled", f"{r['id']}.png"))
            print("birefnet-tiled", r["id"], f"stone {m.mean():.3f}", flush=True)
        return
    models = {"birefnet": BiRefNet(), "sam21": SAM21()}
    for name, mdl in models.items():
        os.makedirs(os.path.join(run, "masks", name), exist_ok=True)
        for r in rows:
            img = Image.open(os.path.join(ROOT, r["image"])).convert("RGB")
            st = dict(kv.split("=") if "=" in kv else (kv, "1") for kv in r["settings"].split(";") if kv and "=" in kv or kv == "flip")
            if "crop" in st:
                x0, y0, x1, y1 = [int(v) for v in st["crop"].split(",")]
                img = img.crop((x0, y0, x1, y1))
            m = mdl.stone(img)
            Image.fromarray((m * 255).astype(np.uint8)).save(os.path.join(run, "masks", name, f"{r['id']}.png"))
            print(name, r["id"], f"stone {m.mean():.3f}", flush=True)


if __name__ == "__main__":
    main(sys.argv[sys.argv.index("--run") + 1])
