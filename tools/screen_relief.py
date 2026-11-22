"""Read a jali bar's section from one photo with open depth and normal models (C-038).

    .venv-models/bin/python tools/screen_relief.py control --run runs/c038     # three rendered reliefs, known sections
    .venv-models/bin/python tools/screen_relief.py met --run runs/c038         # the Met's public-domain jali photos

Models (run here, on the Mac's GPU): Depth Anything V2 Small (depth-anything/Depth-Anything-V2-Small-hf, Apache-2.0) and
Marigold normals v1-1 (prs-eth/marigold-normals-v1-1, OpenRAIL++). Bars are found by C-031's reader on the image's mask;
a square of about five repeats round the field's centre is cut and enlarged so a bar is about 40 px wide (the models
work in patches of 14 px or more); each model reads that crop. Across every bar, at right angles to it, away from
junctions, the reading is sampled from one edge to the other (21 points over 1.2 half-widths each side of the centre
line): depth normalised to 0..1 per bar, and the normal's tilt along the line across the bar. The median profile is
classed as flat, rounded or bevelled by which known section's profile it is nearest to (least squares, after the same
normalising).
"""
import json
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi
from skimage.measure import label
from skimage.morphology import convex_hull_image, skeletonize

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))
import importlib.util  # noqa: E402

spec = importlib.util.spec_from_file_location("screen_measure", os.path.join(ROOT, "tools", "screen_measure.py"))
sm = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sm)

SECTIONS = ("flat", "rounded", "bevelled")
T = np.linspace(-1.2, 1.2, 21)  # across a bar, in half-widths from its centre line


def height_of(t, kind):
    """A bar's height across its width (t in half-widths, |t| <= 1 inside the bar), 0 outside."""
    a = np.abs(t)
    h = np.zeros_like(t)
    inside = a <= 1
    if kind == "flat":
        h[inside] = 1.0
    elif kind == "rounded":
        h[inside] = np.sqrt(np.maximum(0, 1 - a[inside] ** 2))
    else:  # bevelled: 45-degree chamfers on the outer 40 % of each half, flat between
        h[inside] = np.minimum(1.0, (1 - a[inside]) / 0.4)
    return h


def known_profiles():
    out = {}
    for k in SECTIONS:
        h = height_of(T, k)
        tilt = -np.gradient(h, T)  # the surface's slope across the bar, as a normal's sideways part would show it
        out[k] = {"depth": (h - h.min()) / (h.max() - h.min()), "tilt": tilt / (np.abs(tilt).max() or 1)}
    return out


def render_relief(stone, bar, kind, seed=1):
    """Stone lit from the upper left, each bar raised in the given section; openings in shadow. Returns RGB and height."""
    sd = ndi.distance_transform_edt(stone)
    R = bar / 2
    t = 1 - np.minimum(sd, R) / R  # 0 on the centre line (where sd = R), 1 at the edge
    h = np.where(stone, height_of(t, kind) * R, 0.0)
    gy, gx = np.gradient(h)
    n = np.dstack([-gx, -gy, np.ones_like(h)])
    n /= np.linalg.norm(n, axis=2, keepdims=True)
    L = np.array([-0.55, -0.6, 0.58]); L /= np.linalg.norm(L)
    lam = np.clip((n * L).sum(2), 0, 1)
    rng = np.random.default_rng(seed)
    grain = 1 + 0.04 * rng.standard_normal(h.shape)
    base = np.array([196, 150, 112]) / 255
    rgb = np.where(stone[..., None], base * (0.28 + 0.8 * lam)[..., None] * grain[..., None], 0.05)
    return (np.clip(rgb, 0, 1) * 255).astype(np.uint8), h


def bars_and_crop(stone, open_mask, bar, opening, target_bar=40, max_side=1024):
    """The crop's box and enlargement, and sample lines across bars inside it (in crop pixels after enlarging)."""
    hull = convex_hull_image(open_mask)
    cy, cx = [int(round(v)) for v in ndi.center_of_mass(hull)]
    f = float(np.clip(target_bar / bar, 1, 4))
    half = int(min(2.5 * (opening + bar), max_side / f / 2))
    y0, y1, x0, x1 = max(0, cy - half), min(stone.shape[0], cy + half), max(0, cx - half), min(stone.shape[1], cx + half)
    st = stone[y0:y1, x0:x1]
    sk = sm.loops(skeletonize(st))
    ds = ndi.distance_transform_edt(st)
    jc, _ = sm.junctions(sk, ds)
    nj = np.zeros_like(sk)
    for (y, x) in np.round(jc).astype(int):
        nj[y, x] = True
    away = sk & ~(ndi.distance_transform_edt(~nj) <= 1.5 * bar) if len(jc) else sk
    ys, xs = np.nonzero(away)
    lines = []
    for y, x in zip(ys[::3], xs[::3]):
        win = away[max(0, y - 4):y + 5, max(0, x - 4):x + 5]
        py, px = np.nonzero(win)
        if len(py) < 4:
            continue
        c = np.cov(np.vstack([px, py]))
        w, v = np.linalg.eigh(c)
        d = v[:, 1]  # along the bar
        perp = np.array([-d[1], d[0]])
        r = ds[y, x]
        lines.append((x, y, perp[0], perp[1], r))
    return (y0, y1, x0, x1), f, lines


def sample(field, lines, f):
    """field: a 2D map on the enlarged crop. Each line: centre (x, y) and perpendicular in crop pixels, half-width r."""
    prof = []
    for x, y, px, py, r in lines:
        xs = (x + 0.5) * f - 0.5 + T * r * f * px
        ys = (y + 0.5) * f - 0.5 + T * r * f * py
        prof.append(ndi.map_coordinates(field, [ys, xs], order=1, mode="nearest"))
    return np.array(prof)


class Models:
    def __init__(self):
        import torch
        from diffusers import MarigoldNormalsPipeline
        from transformers import pipeline
        self.torch = torch
        dev = "mps" if torch.backends.mps.is_available() else "cpu"
        self.depth = pipeline("depth-estimation", model="depth-anything/Depth-Anything-V2-Small-hf", device=dev)
        self.normals = MarigoldNormalsPipeline.from_pretrained("prs-eth/marigold-normals-v1-1", variant="fp16", torch_dtype=torch.float32).to(dev)

    def read(self, img):
        d = self.depth(img)["predicted_depth"]
        d = np.asarray(self.torch.nn.functional.interpolate(d[None] if d.dim() == 3 else d[None, None], size=(img.height, img.width), mode="bilinear")[0, 0].cpu())
        with self.torch.no_grad():
            out = self.normals(img, num_inference_steps=4, ensemble_size=1, processing_resolution=768, output_type="np")
        n = np.asarray(out.prediction)[0]  # (H, W, 3)
        if n.shape[:2] != (img.height, img.width):
            n = np.dstack([np.asarray(Image.fromarray(n[..., k].astype(np.float32)).resize((img.width, img.height), Image.BILINEAR)) for k in range(3)])
        return d, n


def profiles(depth, normals, lines, f):
    """Median normalised depth profile and median tilt profile across the bars. The normal's x is taken as pointing right
    and its y as pointing up (Marigold's camera frame); the tilt is its component along each line across the bar."""
    D = sample(depth, lines, f)
    D = (D - D.min(1, keepdims=True)) / np.maximum(1e-6, D.max(1, keepdims=True) - D.min(1, keepdims=True))
    nx, ny = sample(normals[..., 0], lines, f), sample(-normals[..., 1], lines, f)
    perp = np.array([[l[2], l[3]] for l in lines])
    tilt = nx * perp[:, :1] + ny * perp[:, 1:]
    tilt = tilt / np.maximum(1e-6, np.abs(tilt).max(1, keepdims=True))
    return np.median(D, 0), np.median(tilt, 0)


def classify(p, kind, known):
    errs = {k: float(np.mean((p - known[k][kind]) ** 2)) for k in SECTIONS}
    if kind == "tilt":  # the sign of the sideways axis isn't known before the control: try both
        errs = {k: min(errs[k], float(np.mean((-p - known[k][kind]) ** 2))) for k in SECTIONS}
    return min(errs, key=errs.get), errs


def run(images, run_dir, tag):
    known = known_profiles()
    m = Models()
    out = []
    for name, rgb, stone, open_mask, bar, opening, truth in images:
        (y0, y1, x0, x1), f, lines = bars_and_crop(stone, open_mask, bar, opening)
        crop = Image.fromarray(rgb[y0:y1, x0:x1]).resize((int((x1 - x0) * f), int((y1 - y0) * f)), Image.LANCZOS)
        crop.save(os.path.join(run_dir, f"{tag}-{name}-crop.png"))
        d, n = m.read(crop)
        np.save(os.path.join(run_dir, f"{tag}-{name}-depth.npy"), d.astype(np.float32))
        Image.fromarray(((n * 0.5 + 0.5) * 255).clip(0, 255).astype(np.uint8)).save(os.path.join(run_dir, f"{tag}-{name}-normals.png"))
        dp, tp = profiles(d, n, lines, f)
        cd, ed = classify(dp, "depth", known)
        ct, et = classify(tp, "tilt", known)
        rec = {"name": name, "truth": truth, "bars_sampled": len(lines), "enlarged": round(f, 2), "depth_profile": np.round(dp, 3).tolist(),
               "tilt_profile": np.round(tp, 3).tolist(), "depth_class": cd, "depth_errors": ed, "tilt_class": ct, "tilt_errors": et}
        out.append(rec)
        print(name, "truth", truth, "| depth reads", cd, {k: round(v, 3) for k, v in ed.items()}, "| normals read", ct, {k: round(v, 3) for k, v in et.items()}, flush=True)
    json.dump(out, open(os.path.join(run_dir, f"{tag}.json"), "w"), indent=1)


if __name__ == "__main__":
    cmd, run_dir = sys.argv[1], sys.argv[sys.argv.index("--run") + 1]
    os.makedirs(run_dir, exist_ok=True)
    if cmd == "control":
        rgb0, L = sm.load(os.path.join(run_dir, "control-design.png"), None)
        stone, screen, op = sm.segment(L)
        meta = json.load(open(os.path.join(run_dir, "control-design.json")))
        imgs = []
        for k in SECTIONS:
            rgb, h = render_relief(stone, meta["bar"], k)
            Image.fromarray(rgb).save(os.path.join(run_dir, f"control-{k}.png"))
            imgs.append((k, rgb, stone, op, meta["bar"], meta["opening"], k))
        run(imgs, run_dir, "control")
    else:
        c031 = {r["id"]: r for r in json.load(open(os.path.join(ROOT, "runs/c031/measures.json")))}
        imgs = []
        for i in ("met-453343", "met-453344", "met-453241", "met-453261"):
            rgb, L = sm.load(os.path.join(ROOT, f"pieces/jali/images/{i}.jpg"), None)
            if i == "met-453261":  # left out of C-031 (its mask failed); read only where C-031's reader can split it
                continue
            stone, screen, op = sm.segment(L)
            imgs.append((i, (rgb * 255).astype(np.uint8), stone, op, c031[i]["bar_px"], c031[i]["opening_px"], None))
        run(imgs, run_dir, "met")
