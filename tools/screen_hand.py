"""Measure what the carving got slightly wrong in a pierced screen, from its photo (C-033).

    .venv/bin/python -I tools/screen_hand.py calibrate runs/c033/calibration --out runs/c033/calibration.json
    .venv/bin/python -I tools/screen_hand.py samples pieces/jali --out runs/c033/real.json

The screen is split into stone and openings as tools/screen_measure.py does (its settings per sample apply). Then:
  bar_cv       bar width's spread: the coefficient of variation of twice the stone's distance transform along the
               skeleton's loops, away from junctions (more than one and a half bars) and from the frame;
  jitter       how far a junction sits from where one lattice step from another junction puts it, after a linear trend
               in position is removed (the photo's perspective), root mean square, in lattice steps. The lattice is the
               two shortest independent peaks of the openings' autocorrelation; a junction counts if one lies within a
               quarter step of the target;
  drift        the same over three steps, less what jitter explains: sqrt(max(0, d3^2 - d1^2)), in lattice steps;
  corner       the main openings' sharp corners: found where the edge turns by more than 1.2 rad over a bar's length;
               each one's radius 2h / turn over h = 3 px either side; the median, over the bar's width;
  rough        the main openings' edges away from corners: root mean square distance from the edge smoothed over a
               third of a bar, over the bar's width;
  open_cv      the main openings' areas (within 0.6 to 1.6 of the area-weighted median), after a linear trend in
               position, as a coefficient of variation: a check on all of the above together.
"""
import csv
import importlib.util
import json
import os
import sys

import numpy as np
from scipy import ndimage as ndi
from scipy.spatial import cKDTree
from skimage.measure import find_contours, label
from skimage.morphology import convex_hull_image, skeletonize

here = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("screen_measure", os.path.join(here, "screen_measure.py"))
sm = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sm)


def autocorr(open_mask, window):
    ys, xs = np.nonzero(window)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    f, w = open_mask[y0:y1, x0:x1].astype(float), window[y0:y1, x0:x1].astype(float)
    g = (f - f[w > 0].mean()) * w
    N = int(2 ** np.ceil(np.log2(2 * max(g.shape))))
    G, Wf = np.fft.fft2(g, (N, N)), np.fft.fft2(w, (N, N))
    num = np.fft.fftshift(np.real(np.fft.ifft2(G * np.conj(G))))
    den = np.fft.fftshift(np.real(np.fft.ifft2(Wf * np.conj(Wf))))
    acf = np.where(den > 0.3 * den.max(), num / np.maximum(den, 1e-9), 0.0)
    return acf / acf[N // 2, N // 2], N // 2


def lattice(open_mask, window, repeat):
    acf, c = autocorr(open_mask, window)
    R = int(4 * repeat) + 2
    sub = acf[c - R:c + R + 1, c - R:c + R + 1]
    k = max(3, int(repeat / 3) | 1)
    mx = ndi.maximum_filter(sub, size=k)
    yy, xx = np.mgrid[-R:R + 1, -R:R + 1]
    rr = np.hypot(yy, xx)
    pk = np.argwhere((sub == mx) & (rr > 0.6 * repeat) & (rr <= 4 * repeat) & (sub > 0.15))
    if len(pk) < 2:
        return None
    # the lattice's own peaks are the strongest; nearer, weaker peaks are near-periods (C-033's calibration found
    # them at 0.2 to 0.5 on designs whose lattice peaks are 0.97 to 1)
    top = max(sub[i, j] for i, j in pk)
    pk = np.array([(i, j) for i, j in pk if sub[i, j] >= 0.7 * top])
    vs = sorted(((float(xx[i, j]), float(yy[i, j])) for i, j in pk), key=lambda v: np.hypot(*v))
    v1 = np.array(vs[0])
    for v in vs[1:]:
        v = np.array(v)
        if abs(v1[0] * v[1] - v1[1] * v[0]) / (np.linalg.norm(v1) * np.linalg.norm(v)) > 0.5:
            return v1, v
    return None


def step_error(P, vecs, k, tol, inside):
    # a step counts only if it lands inside the field where junctions were read: a target beyond it finds the nearest
    # junction of another kind (C-033's calibration read drift 0.074 on an exact design before this)
    tree, res = cKDTree(P), []
    for v in vecs:
        T = P + k * v
        d, idx = tree.query(T)
        ok = (d < tol) & np.array([inside(x, y) for x, y in T])
        if ok.sum() < 8:
            continue
        D, X = P[idx[ok]] - T[ok], P[ok]
        A = np.c_[np.ones(len(X)), X]
        coef, *_ = np.linalg.lstsq(A, D, rcond=None)
        res.append(D - A @ coef)
    if not res:
        return None, 0
    R = np.vstack(res)
    return float(np.sqrt((R ** 2).sum(1).mean())), len(R)


def contour_of(mask):
    cs = find_contours(np.pad(mask, 1).astype(float), 0.5)
    c = max(cs, key=len)[:, ::-1] - 1  # (x, y)
    seg = np.hypot(*np.diff(np.vstack([c, c[:1]]), axis=0).T)
    s = np.r_[0, np.cumsum(seg)]
    n = int(s[-1])
    if n < 12:
        return None
    t = np.linspace(0, s[-1], n, endpoint=False)
    cc = np.vstack([c, c[:1]])
    p = np.c_[np.interp(t, s, cc[:, 0]), np.interp(t, s, cc[:, 1])]
    area = 0.5 * np.sum(p[:, 0] * np.roll(p[:, 1], -1) - np.roll(p[:, 0], -1) * p[:, 1])
    return p if area > 0 else p[::-1]


def turning(p, h):
    a = np.arctan2(*(np.roll(p, -h, 0) - p).T[::-1])
    b = np.arctan2(*(p - np.roll(p, h, 0)).T[::-1])
    t = (a - b + np.pi) % (2 * np.pi) - np.pi
    return t * (np.sign(np.sum(t)) or 1.0)  # positive where the edge turns the way the contour runs (convex)


def corners_and_rough(p, bar):
    # corners found at the scale of half a bar (where a rounded corner still turns through its whole angle), kept if
    # sharper than about 110 degrees inside (turning more than 1.2 rad); each one's radius read at a fine scale, h = 3
    # px: 2h over the turn there, which is the radius once the rounding is wider than h
    n, H, h = len(p), max(3, int(round(bar / 2))), 3
    TH, th = turning(p, H), turning(p, h)
    radii, near = [], np.zeros(n, bool)
    for i in range(n):
        win = (i + np.arange(-H, H + 1)) % n
        if TH[i] > 1.2 and TH[i] >= TH[win].max():
            radii.append(2 * h / max(th[win].max(), 1e-3))
            near[(i + np.arange(-2 * H, 2 * H + 1)) % n] = True
    sig = max(1.0, bar / 3)
    xs = ndi.gaussian_filter1d(p[:, 0], sig, mode="wrap")
    ys = ndi.gaussian_filter1d(p[:, 1], sig, mode="wrap")
    d = np.hypot(p[:, 0] - xs, p[:, 1] - ys)[~near]
    return radii, (d ** 2).tolist()


def hand(path, flip=False, crop=None, thr=0.0):
    rgb, L = sm.load(path, crop)
    stone, screen, openings = sm.segment(L, flip, thr)
    lab, n = label(openings, connectivity=1, return_num=True)
    if n:
        mr = ndi.maximum(ndi.distance_transform_edt(openings), lab, index=np.arange(1, n + 1))
        speck = np.isin(lab, np.nonzero(2 * mr < 6)[0] + 1)
        openings, stone = openings & ~speck, stone | speck
    lab, n = label(openings, connectivity=1, return_num=True)
    hull = convex_hull_image(openings)
    dist_s = ndi.distance_transform_edt(stone)
    sk_all = skeletonize(stone)
    inner0 = ndi.binary_erosion(hull, iterations=3)
    bar0 = float(2 * np.median(dist_s[sk_all & inner0]))
    sk = sm.loops(sk_all)
    jc, _ = sm.junctions(sk, dist_s)
    near_j = np.zeros_like(sk)
    for (y, x) in np.round(jc).astype(int):
        near_j[y, x] = True
    near_j = ndi.distance_transform_edt(~near_j) <= 1.5 * bar0
    dist_f = ndi.distance_transform_edt(hull)
    idx = np.arange(1, n + 1)
    maxr = ndi.maximum(ndi.distance_transform_edt(openings), lab, index=idx)
    areas = ndi.sum(np.ones_like(lab), lab, index=idx)
    o = np.argsort(maxr)
    cum = np.cumsum(areas[o]) / areas.sum()
    opening = float(2 * maxr[o][np.searchsorted(cum, 0.5)])
    away = sk & inner0 & ~near_j & (dist_f > 0.5 * (opening + bar0))
    t = 2 * dist_s[away]
    if t.size < 50:  # nothing left away from junctions: the whole skeleton inside the field
        t = 2 * dist_s[sk_all & inner0]
    bar = float(np.median(t))
    repeat = opening + bar
    rec = {"image": path, "bar_px": round(bar, 2), "opening_px": round(opening, 2), "bar_cv": round(float(t.std() / t.mean()), 4)}
    # jitter and drift from the lattice
    inner = dist_f >= 1.0 * repeat
    P = np.array([(p[1], p[0]) for p in jc if inner[int(round(p[0])), int(round(p[1]))]])  # (x, y)
    lat = lattice(openings, inner if inner.sum() > 20 * repeat ** 2 else hull, repeat)
    if lat is not None and len(P) > 20:
        v1, v2 = lat
        step = float(np.linalg.norm(v1))
        vecs = [v1, v2, v1 + v2, v1 - v2]
        H_, W_ = inner.shape
        deep = dist_f >= 1.0 * repeat + 0.35 * step
        ins = lambda x, y: 0 <= int(y) < H_ and 0 <= int(x) < W_ and bool(deep[int(y), int(x)])
        e1, n1 = step_error(P, vecs, 1, 0.25 * step, ins)
        e3, n3 = step_error(P, vecs, 3, 0.35 * step, ins)
        rec |= {"lattice_step_px": round(step, 2), "jitter": None if e1 is None else round(e1 / step, 5), "jitter_pairs": n1,
                "drift": None if (e1 is None or e3 is None) else round(float(np.sqrt(max(0.0, e3 ** 2 - e1 ** 2))) / step, 5), "drift_pairs": n3}
    else:
        rec |= {"jitter": None, "drift": None}
    # main openings: corners, roughness, size spread
    awm = float(areas[o][np.searchsorted(cum, 0.5)])
    cen = np.array(ndi.center_of_mass(openings, lab, index=idx))
    main = [i for i in range(n) if 0.6 * awm <= areas[i] <= 1.6 * awm and dist_f[int(cen[i][0]), int(cen[i][1])] > 0.5 * repeat]
    radii, rough = [], []
    for i in main[:80]:
        sl = ndi.find_objects((lab == i + 1).astype(int))[0]
        p = contour_of(lab[sl] == i + 1)
        if p is None:
            continue
        r, d2 = corners_and_rough(p, bar)
        radii += r
        rough += d2
    rec["corner"] = round(float(np.median(radii)) / bar, 4) if radii else None
    rec["rough"] = round(float(np.sqrt(np.mean(rough))) / bar, 4) if rough else None
    if len(main) >= 8:
        A = np.c_[np.ones(len(main)), cen[main]]
        y = areas[main]
        coef, *_ = np.linalg.lstsq(A, y, rcond=None)
        rec["open_cv"] = round(float((y - A @ coef).std() / y.mean()), 4)
    else:
        rec["open_cv"] = None
    rec["main_openings"] = len(main)
    rec["corners"] = len(radii)
    return rec


def between_bars(path, flip=False, crop=None, thr=0.0):
    """How much bars differ from one another (C-036): the skeleton's loops away from junctions (more than one and a half
    bars) and from the field's edge (two bars), cut into bars; each bar's median width (twice the distance transform);
    their spread after a linear trend in position, over their mean. And, for comparison, how much one bar varies along
    itself (the median of each bar's own spread)."""
    rgb, L = sm.load(path, crop)
    stone, screen, op = sm.segment(L, flip, thr)
    lab, n = label(op, connectivity=1, return_num=True)
    if n:
        mr = ndi.maximum(ndi.distance_transform_edt(op), lab, index=np.arange(1, n + 1))
        sp = np.isin(lab, np.nonzero(2 * mr < 6)[0] + 1)
        op, stone = op & ~sp, stone | sp
    hull = convex_hull_image(op)
    ds = ndi.distance_transform_edt(stone)
    ska = skeletonize(stone)
    inner0 = ndi.binary_erosion(hull, iterations=3)
    bar0 = float(2 * np.median(ds[ska & inner0]))
    sk = sm.loops(ska)
    jc, _ = sm.junctions(sk, ds)
    nj = np.zeros_like(sk)
    for (y, x) in np.round(jc).astype(int):
        nj[y, x] = True
    nj = ndi.distance_transform_edt(~nj) <= 1.5 * bar0
    away = sk & ~nj & (ndi.distance_transform_edt(hull) > 2 * bar0)
    seg, ns = label(away, connectivity=2, return_num=True)
    W, C, X = [], [], []
    for i in range(1, ns + 1):
        m = seg == i
        if m.sum() < 6:
            continue
        t = 2 * ds[m]
        W.append(np.median(t)); C.append(t.std() / t.mean())
        yy, xx = np.nonzero(m); X.append((xx.mean(), yy.mean()))
    if len(W) < 10:
        return {"bars": len(W), "between": None, "within": None}
    W, X = np.array(W), np.array(X)
    A = np.c_[np.ones(len(W)), X]
    coef, *_ = np.linalg.lstsq(A, W, rcond=None)
    return {"bars": len(W), "between": round(float((W - A @ coef).std() / W.mean()), 4), "within": round(float(np.median(C)), 4)}


if __name__ == "__main__":
    cmd, src = sys.argv[1], sys.argv[2]
    out = sys.argv[sys.argv.index("--out") + 1] if "--out" in sys.argv else None
    recs = []
    if cmd == "bars":  # src: a specs.json beside its images, or a piece folder with samples.tsv
        if src.endswith(".json"):
            for sp in json.load(open(src)):
                r = between_bars(os.path.join(os.path.dirname(src), f"{sp['id']}.png")) | sp
                recs.append(r); print(sp["id"], {k: r[k] for k in ("bars", "between", "within")}, flush=True)
        else:
            for r0 in csv.DictReader(open(os.path.join(src, "samples.tsv")), delimiter="\t"):
                if r0.get("status", "measured") != "measured" or r0["role"] != "jali":
                    continue
                st = dict(kv.split("=") if "=" in kv else (kv, "1") for kv in r0["settings"].split(";") if kv)
                crop = [int(v) for v in st["crop"].split(",")] if "crop" in st else None
                r = between_bars(r0["image"], "flip" in st, crop, float(st.get("thr", 0))) | {"id": r0["id"]}
                recs.append(r); print(r0["id"], {k: r[k] for k in ("bars", "between", "within")}, flush=True)
    elif cmd == "calibrate":
        for s in json.load(open(os.path.join(src, "specs.json"))):
            r = hand(os.path.join(src, f"{s['id']}.png")) | s
            recs.append(r)
            print(s["id"], {k: r.get(k) for k in ["bar_cv", "jitter", "drift", "corner", "rough", "open_cv"]}, flush=True)
    else:
        for r in csv.DictReader(open(os.path.join(src, "samples.tsv")), delimiter="\t"):
            if r.get("status", "measured") != "measured" or r["role"] != "jali":
                continue
            st = dict(kv.split("=") if "=" in kv else (kv, "1") for kv in r["settings"].split(";") if kv)
            crop = [int(v) for v in st["crop"].split(",")] if "crop" in st else None
            h = hand(r["image"], "flip" in st, crop, float(st.get("thr", 0))) | {"id": r["id"], "family": r["family"]}
            recs.append(h)
            print(r["id"], {k: h.get(k) for k in ["bar_cv", "jitter", "drift", "corner", "rough", "open_cv"]}, flush=True)
    if out:
        os.makedirs(os.path.dirname(out), exist_ok=True)
        json.dump(recs, open(out, "w"), indent=1)
