"""Does an open image-to-3D model rebuild a jali from one photo? (C-042)

    .venv-models/bin/python tools/screen_3d.py --run runs/c042

TripoSR (stabilityai/TripoSR, MIT; its official code in .vendor-models/TripoSR, git-ignored), marching cubes at 256 by
scikit-image (in place of torchmcubes, which needs compiling). Each image is cut out by its stone mask (outside the stone,
openings included, set to grey, as TripoSR's own background removal would), its object fitted to 85 % of the frame.
On each mesh: the thin axis (least spread of its vertices); the silhouette seen along it, rasterised; its openings (inside
the silhouette's outline, not covered) against the image's (inside the stone's outline, not stone), both stretched to
their boxes, intersection over union, best of the eight flips and turns; thickness (1st to 99th percentile along the
thin axis) over the shorter side in the plane.
"""
import json
import os
import sys
import types

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, ".vendor-models", "TripoSR"))


def _mc(vol, thresh):  # torchmcubes.marching_cubes, by scikit-image: vertices in (dim2, dim1, dim0) order, as TripoSR expects
    import torch
    from skimage.measure import marching_cubes
    v, f, _, _ = marching_cubes(vol.detach().cpu().numpy(), level=thresh)
    return torch.from_numpy(v[:, ::-1].copy()).float(), torch.from_numpy(f.astype(np.int64))


sys.modules["torchmcubes"] = types.SimpleNamespace(marching_cubes=_mc)


def _not_used(*a, **k):
    raise RuntimeError("rembg isn't installed here: the stone masks do the cutting out")


sys.modules["rembg"] = types.SimpleNamespace(new_session=_not_used, remove=_not_used)  # imported by TripoSR's utils, never called


def cutout(rgb, stone):
    """RGB on grey wherever the mask isn't stone, the stone's box fitted to 85 % of a square (TripoSR's own preprocessing)."""
    ys, xs = np.nonzero(stone)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    a = np.where(stone[..., None], rgb, 0.5)[y0:y1, x0:x1]
    h, w = a.shape[:2]
    side = int(max(h, w) / 0.85)
    canvas = np.full((side, side, 3), 0.5, np.float32)
    oy, ox = (side - h) // 2, (side - w) // 2
    canvas[oy:oy + h, ox:ox + w] = a
    return Image.fromarray((canvas * 255).astype(np.uint8)).resize((512, 512), Image.LANCZOS)


def silhouette(mesh, grid=384):
    V, F = np.asarray(mesh.vertices), np.asarray(mesh.faces)
    c = V - V.mean(0)
    w, vec = np.linalg.eigh(np.cov(c.T))
    thin, e2, e1 = vec[:, 0], vec[:, 1], vec[:, 2]
    t, u, v = c @ thin, c @ e1, c @ e2
    lo, hi = np.percentile(t, [1, 99])
    ext_u, ext_v = np.ptp(np.percentile(u, [1, 99])), np.ptp(np.percentile(v, [1, 99]))
    uu = (u - u.min()) / (np.ptp(u) or 1) * (grid - 1)
    vv = (v - v.min()) / (np.ptp(v) or 1) * (grid - 1)
    im = Image.new("L", (grid, grid), 0)
    d = ImageDraw.Draw(im)
    for a, b, cc in F:
        d.polygon([(uu[a], vv[a]), (uu[b], vv[b]), (uu[cc], vv[cc])], fill=255)
    return np.asarray(im) > 0, {"thickness_over_short_side": round(float((hi - lo) / min(ext_u, ext_v)), 4), "vertices": int(len(V)), "faces": int(len(F))}


def boxed(mask, size=256):
    ys, xs = np.nonzero(mask)
    m = mask[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    return np.asarray(Image.fromarray((m * 255).astype(np.uint8)).resize((size, size), Image.NEAREST)) > 0


def compare(sil, stone):
    """Openings of the mesh's silhouette against the image's, both boxed; the best of eight flips and turns."""
    so, io = boxed(sil), boxed(stone)
    s_open = ndi.binary_fill_holes(so) & ~so
    outline = ndi.binary_fill_holes(io)
    i_open = outline & ~io
    best = (0.0, 0)
    for k in range(8):
        t = np.rot90(s_open, k % 4)
        t = t.T if k >= 4 else t
        a, b = t & outline, i_open
        iou = float((a & b).sum() / max(1, (a | b).sum()))
        best = max(best, (iou, k))
    return {"openings_iou": round(best[0], 4), "orientation": best[1], "mesh_open_share": round(float(s_open.sum() / max(1, ndi.binary_fill_holes(so).sum())), 4),
            "image_open_share": round(float(i_open.sum() / max(1, outline.sum())), 4)}


def load_tsr():
    """TripoSR, its checkpoint's vision-encoder keys renamed from transformers 4.35's ViT to transformers 5's (the rest
    unchanged), loaded strictly: nothing may be left missing or unused but the pooler, which the encoder no longer has."""
    import re
    import torch
    from huggingface_hub import hf_hub_download
    from omegaconf import OmegaConf
    from tsr.system import TSR
    cfg = OmegaConf.load(hf_hub_download("stabilityai/TripoSR", "config.yaml"))
    OmegaConf.resolve(cfg)
    model = TSR(cfg)
    ck = torch.load(hf_hub_download("stabilityai/TripoSR", "model.ckpt"), map_location="cpu")  # weights only (torch's default)
    ren = [(r"encoder\.layer\.(\d+)\.attention\.attention\.query", r"layers.\1.attention.q_proj"),
           (r"encoder\.layer\.(\d+)\.attention\.attention\.key", r"layers.\1.attention.k_proj"),
           (r"encoder\.layer\.(\d+)\.attention\.attention\.value", r"layers.\1.attention.v_proj"),
           (r"encoder\.layer\.(\d+)\.attention\.output\.dense", r"layers.\1.attention.o_proj"),
           (r"encoder\.layer\.(\d+)\.intermediate\.dense", r"layers.\1.mlp.fc1"),
           (r"encoder\.layer\.(\d+)\.output\.dense", r"layers.\1.mlp.fc2"),
           (r"encoder\.layer\.(\d+)\.layernorm_", r"layers.\1.layernorm_")]
    want, new = model.state_dict(), {}
    for k, v in ck.items():
        for a, b in ren:
            k = re.sub(a, b, k)
        if k.startswith("image_tokenizer.model.pooler") and k not in want:
            continue
        new[k] = v
    missing, unused = sorted(set(want) - set(new)), sorted(set(new) - set(want))
    assert not missing and not unused, f"missing {missing[:5]}, unused {unused[:5]}"
    model.load_state_dict(new, strict=True)
    print("TripoSR loaded:", len(new), "tensors, the vision encoder's keys renamed", flush=True)
    return model


def main(run):
    import torch
    from tsr.system import TSR
    sys.path.insert(0, os.path.join(ROOT, "tools"))
    import importlib.util
    spec = importlib.util.spec_from_file_location("screen_relief", os.path.join(ROOT, "tools", "screen_relief.py"))
    sr = importlib.util.module_from_spec(spec); spec.loader.exec_module(sr)
    sm = sr.sm
    dev = "mps" if torch.backends.mps.is_available() else "cpu"
    model = load_tsr()
    model.renderer.set_chunk_size(8192)
    try:
        model.to(dev)
    except Exception:
        dev = "cpu"; model.to(dev)
    os.makedirs(run, exist_ok=True)
    items = []
    # the control: a generated design drawn as front-lit relief (rounded bars), its stone known
    rgb0, L0 = sm.load(os.path.join(ROOT, "runs/c038/control-design.png"), None)
    st0, _, op0 = sm.segment(L0)
    meta = json.load(open(os.path.join(ROOT, "runs/c038/control-design.json")))
    rgb_c, _ = sr.render_relief(st0, meta["bar"], "rounded")
    items.append(("control", rgb_c.astype(np.float32) / 255, st0, None))
    cat = {"met-453343": 90 / 1314.5, "met-453241": 69.9 / 673.1, "met-453344": None}
    for i in ("met-453343", "met-453344", "met-453241"):
        rgb, L = sm.load(os.path.join(ROOT, f"pieces/jali/images/{i}.jpg"), None)
        stone = sm.load_stone(os.path.join(ROOT, f"runs/c040/masks/birefnet-tiled/{i}.png"), L.shape)
        stone, _, _ = sm.segment(L, stone_mask=stone)
        items.append((i, rgb, stone, cat[i]))
    out = []
    for name, rgb, stone, ratio in items:
        img = cutout(rgb, stone)
        img.save(os.path.join(run, f"{name}-input.png"))
        with torch.no_grad():
            codes = model([img], device=dev)
            mesh = model.extract_mesh(codes, True, resolution=256)[0]
        mesh.export(os.path.join(run, f"{name}.glb"))
        sil, geo = silhouette(mesh)
        Image.fromarray((sil * 255).astype(np.uint8)).save(os.path.join(run, f"{name}-silhouette.png"))
        rec = {"name": name, **geo, **compare(sil, stone), "catalogue_depth_over_width": None if ratio is None else round(ratio, 4)}
        if ratio:
            rec["depth_factor"] = round(rec["thickness_over_short_side"] / ratio, 2)
        out.append(rec)
        print(rec, flush=True)
    json.dump(out, open(os.path.join(run, "result.json"), "w"), indent=1)


if __name__ == "__main__":
    main(sys.argv[sys.argv.index("--run") + 1])
