"""Measure a pierced screen from its photo (C-031).

    .venv/bin/python -I tools/screen_measure.py <image> [--flip] [--crop x0,y0,x1,y1] [--thr-offset D]
        [--width-mm W] [--depth-mm D] [--overlay out.png]

Prints one JSON record. The photo is split into solid (the stone) and open (what shows through) by Otsu's threshold on
its smoothed brightness; whichever class covers more of the photo's border is taken as the background, which also
shows through the openings. The screen is the largest piece of solid with its holes filled; the openings are those
holes. Per sample, `--flip`, `--crop` and `--thr-offset` fix a split that fails by eye; they are recorded with the
sample, and chosen from the mask on the sheet, never from the numbers.

The numbers:
  open_share        the share of the inner field that is open, with the same smooth weight as the junction count,
                    so where the field's edge is drawn doesn't matter (open_share_field: over the openings' hull);
  bar_px            twice the solid's distance transform along its skeleton (median), away from junctions (more
                    than one and a half bars from any), where bars meeting widen the stone;
  opening_px        twice each opening's largest inscribed radius, the median weighted by the openings' areas (the
                    width of the openings that make up the open area). Openings under 6 px across are taken as
                    specks in the stone, not openings;
  bar_over_opening  bar_px / opening_px;
  thickness_over_opening  the catalogue's depth over the opening's width in mm (the photo's scale from the
                    catalogue's width over the screen's width in pixels), where both are given;
  per_junction      openings over junctions (where three or more bars meet), each counted at its centre with a
                    weight that rises smoothly from 0 half a repeat inside the field's edge (the openings' convex
                    hull) to 1 two repeats further in, so neither the frame's own junctions nor where the window's edge falls on the lattice biases
                    the count. Euler's formula on one repeat makes this (average bars at a junction) / 2 - 1.
                    Junctions are read on the skeleton's loops (branches with a free end stripped: in a screen every
                    bar runs between junctions), where three or more branches leave a cluster of branch pixels;
  junction_degree   the average number of branches leaving a junction, read directly (a side reading: it runs
                    low where six or more bars meet); Euler's formula ties it to per_junction;
  repeats_across    the field's shorter side over one repeat (an opening and a bar). Below about eight, the
                    counts above rest on few repeats;
  rotation, mirrors the symmetry of the openings' autocorrelation (normalised by the window's own) in a ring from
                    half a repeat to six repeats: the largest of 6, 4 and 2 whose turn correlates at r >= 0.6, and
                    whether any reflection does. The autocorrelation is the same turned by a half, so it can't tell
                    3 from 6 or 1 from 2;
  star              the order of the largest star: around each opening's centre and each junction in the inner
                    field, discs from a quarter of a repeat to past the largest opening are matched with themselves
                    turned by every angle; the first clear peak (r >= 0.8, after a dip at least 0.3 below it, so a
                    round opening that matches itself at every turn says nothing) at angle a gives n = 360 / a, kept
                    within 5 % of a whole number. A point's order is the largest n two of its discs agree on; the star
                    is the largest order found at two or more points. A star made of several petal-shaped openings
                    round a centre is read at that centre;
  points            the corners of the largest openings (the top tenth, at least three): peaks of the distance from
                    each opening's centre to its edge, by angle, standing out by at least 8 % of the mean (median).
                    Kept beside `star`: it reads one opening, and a petal has two corners whatever star it is in.
"""
import argparse
import json
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi
from scipy.signal import find_peaks
from skimage.filters import gaussian, threshold_otsu
from skimage.measure import find_contours, label
from skimage.morphology import convex_hull_image, disk, remove_small_holes, remove_small_objects, skeletonize

TAU_SYM = 0.6
NB8 = np.array([[1, 1, 1], [1, 0, 1], [1, 1, 1]])


def load(path, crop):
    a = np.asarray(Image.open(path).convert("RGB"), dtype=float) / 255.0
    if crop:
        x0, y0, x1, y1 = crop
        a = a[y0:y1, x0:x1]
    return a, 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]


def segment(L, flip=False, thr_offset=0.0, stone_mask=None):
    if stone_mask is not None:  # a model's mask of the stone (C-039), instead of brightness
        solid = remove_small_holes(remove_small_objects(stone_mask.astype(bool), max_size=64), max_size=30)
        lab = label(solid, connectivity=2)
        big = np.argmax(np.bincount(lab.ravel())[1:]) + 1
        stone = lab == big
        screen = ndi.binary_fill_holes(stone)
        return stone, screen, screen & ~stone
    Ls = gaussian(L, 1.0)
    t = threshold_otsu(Ls) + thr_offset
    hi = Ls > t
    border = np.concatenate([hi[0], hi[-1], hi[:, 0], hi[:, -1]]).mean()
    solid = ~hi if border > 0.5 else hi
    if flip:
        solid = ~solid
    solid = remove_small_objects(solid, max_size=64)
    solid = remove_small_holes(solid, max_size=30)
    lab = label(solid, connectivity=2)
    if lab.max() == 0:
        raise SystemExit("no solid found")
    big = np.argmax(np.bincount(lab.ravel())[1:]) + 1
    stone = lab == big
    screen = ndi.binary_fill_holes(stone)
    return stone, screen, screen & ~stone


def loops(skel):
    """The skeleton's loops: strip end points until none are left. Every bar of a screen runs between two junctions
    (or the frame), so a branch with a free end is the medial axis reaching into a notch or a corner, not a bar."""
    sk = skel.copy()
    while True:
        nb = ndi.convolve(sk.astype(np.uint8), NB8, mode="constant")
        ends = sk & (nb <= 1)
        if not ends.any():
            return sk
        sk &= ~ends


def junctions(sk, dist, rad=2):
    """Junctions on the skeleton's loops, with their degrees. Branch pixels are grouped where they touch; a group is
    a junction if three or more branches leave it (read on a ring `rad` pixels out), else a leftover of a stripped
    spur. The degree reads low where six or more bars meet, their branches too close on so small a ring.
    Junctions whose inscribed circles (the stone's distance transform there) overlap are one junction split by the
    skeleton, as an X-crossing often is: merged, with degree the sum less two for each join."""
    nb = ndi.convolve(sk.astype(np.uint8), NB8, mode="constant")
    branch = sk & (nb >= 3)
    bl, nbr = label(branch, connectivity=2, return_num=True)
    if not nbr:
        return np.zeros((0, 2)), np.zeros(0, int)
    region = ndi.grey_dilation(bl, footprint=disk(rad))
    outer = ndi.grey_dilation(region, footprint=np.ones((3, 3), bool))
    ring = sk & (region == 0) & (outer > 0)
    rl, nr = label(ring, connectivity=2, return_num=True)
    deg = np.zeros(nbr + 1, int)
    if nr:
        for o in ndi.maximum(outer, rl, index=np.arange(1, nr + 1)).astype(int):
            deg[o] += 1
    cen = np.array(ndi.center_of_mass(branch, bl, index=np.arange(1, nbr + 1)))
    keep = np.nonzero(deg[1:] >= 3)[0]
    pts, dg = cen[keep], deg[1:][keep]
    rho = dist[np.round(pts[:, 0]).astype(int), np.round(pts[:, 1]).astype(int)]
    parent = list(range(len(pts)))
    def find(i):
        while parent[i] != i:
            parent[i] = parent[parent[i]]
            i = parent[i]
        return i
    from scipy.spatial import cKDTree
    tree = cKDTree(pts)
    for i, j in tree.query_pairs(r=2 * float(rho.max()) if len(rho) else 0):
        if np.hypot(*(pts[i] - pts[j])) <= rho[i] + rho[j]:
            parent[find(i)] = find(j)
    groups = {}
    for i in range(len(pts)):
        groups.setdefault(find(i), []).append(i)
    P = np.array([pts[g].mean(axis=0) for g in groups.values()])
    D = np.array([int(dg[g].sum() - 2 * (len(g) - 1)) for g in groups.values()])
    return P, D


def acf_symmetry(open_mask, window, ring):
    ys, xs = np.nonzero(window)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    f, w = open_mask[y0:y1, x0:x1].astype(float), window[y0:y1, x0:x1].astype(float)
    g = (f - f[w > 0].mean()) * w
    h, wd = g.shape
    N = int(2 ** np.ceil(np.log2(2 * max(h, wd))))
    G, Wf = np.fft.fft2(g, (N, N)), np.fft.fft2(w, (N, N))
    num = np.fft.fftshift(np.real(np.fft.ifft2(G * np.conj(G))))
    den = np.fft.fftshift(np.real(np.fft.ifft2(Wf * np.conj(Wf))))
    acf = np.where(den > 0.3 * den.max(), num / np.maximum(den, 1e-9), 0.0)
    c = N // 2
    r0, r1 = ring
    R = int(np.ceil(r1)) + 2
    yy, xx = np.mgrid[-R:R + 1, -R:R + 1].astype(float)
    rr = np.hypot(yy, xx)
    m = (rr >= r0) & (rr <= r1) & (den[c - R:c + R + 1, c - R:c + R + 1] > 0.3 * den.max())
    base = acf[c - R:c + R + 1, c - R:c + R + 1]

    def sample(ty, tx):
        return ndi.map_coordinates(acf, [ty + c, tx + c], order=1, mode="constant")

    def corr(b):
        a, b = base[m], b[m]
        a, b = a - a.mean(), b - b.mean()
        return float((a * b).sum() / np.sqrt((a * a).sum() * (b * b).sum() + 1e-12))

    rot = {}
    for n in (6, 4, 3, 2):
        t = 2 * np.pi / n
        rot[n] = corr(sample(yy * np.cos(t) + xx * np.sin(t), -yy * np.sin(t) + xx * np.cos(t)))
    mir = []
    for deg in np.arange(0, 180, 1.0):
        t = np.deg2rad(deg)
        ux, uy = np.cos(t), np.sin(t)  # reflect across the line through the origin along (ux, uy)
        d = xx * ux + yy * uy
        mir.append(corr(sample(2 * d * uy - yy, 2 * d * ux - xx)))
    order = next((n for n in (6, 4, 2) if rot[n] >= TAU_SYM), 1)
    k = int(np.argmax(mir))
    return order, bool(mir[k] >= TAU_SYM), {"turn_r": {str(n): round(v, 3) for n, v in rot.items()}, "mirror_r": round(mir[k], 3), "mirror_axis_deg": k}


def corners(op_mask):
    ys, xs = np.nonzero(op_mask)
    cy, cx = ys.mean(), xs.mean()
    pad = np.pad(op_mask, 1)
    cs = find_contours(pad.astype(float), 0.5)
    pts = np.vstack(cs) - 1
    ang = np.mod(np.degrees(np.arctan2(pts[:, 0] - cy, pts[:, 1] - cx)), 360)
    r = np.hypot(pts[:, 0] - cy, pts[:, 1] - cx)
    bins = np.full(360, np.nan)
    for b in range(360):
        sel = (ang >= b) & (ang < b + 1)
        if sel.any():
            bins[b] = r[sel].max()
    ok = ~np.isnan(bins)
    if ok.sum() < 30:
        return 0
    bins = np.interp(np.arange(360), np.arange(360)[ok], bins[ok], period=360)
    k = np.ones(5) / 5
    s = np.convolve(np.tile(bins, 3), k, mode="same")[360:720]
    p, _ = find_peaks(np.tile(s, 3), prominence=0.08 * s.mean(), distance=8)
    return int(((p >= 360) & (p < 720)).sum())


def local_order(open_mask, centres, r_lo, r_hi, tau=0.8, gap=0.3, rings=40):
    """For each centre, the order of its star: for discs round it of growing radius, the match between the disc and
    itself turned by every angle (an angular autocorrelation, area-weighted). The first clear peak (r >= tau, after
    a dip at least `gap` below it, so a round opening that matches itself at every turn says nothing) at angle a
    gives n = 360 / a, kept if within 5 % of a whole number from 2 to 24. A centre's order is the largest n that two
    of its discs agree on."""
    K = 1440
    th = np.linspace(0, 2 * np.pi, K, endpoint=False)
    radii = np.linspace(r_lo, r_hi, rings)
    H, W = open_mask.shape
    f = open_mask.astype(float)
    win = K // 96
    out = []
    for cy, cx in centres:
        ok = radii[(cy - radii >= 0) & (cx - radii >= 0) & (cy + radii < H - 1) & (cx + radii < W - 1)]
        if len(ok) < 4:
            continue
        P = ndi.map_coordinates(f, [cy + ok[:, None] * np.sin(th)[None, :], cx + ok[:, None] * np.cos(th)[None, :]], order=1)
        ac = np.fft.irfft(np.abs(np.fft.rfft(P, axis=1)) ** 2, n=K, axis=1)
        Nc = np.cumsum(np.full(len(ok), K) * ok)
        mean = np.cumsum((P * ok[:, None]).sum(1)) / Nc
        var = np.cumsum((P * P * ok[:, None]).sum(1)) / Nc - mean ** 2
        C = (np.cumsum(ac * ok[:, None], axis=0) / Nc[:, None] - (mean ** 2)[:, None]) / np.maximum(var, 1e-9)[:, None]
        votes = {}
        for j in range(len(ok)):
            if var[j] <= 0.02:
                continue
            c = C[j, : K // 2 + 1]
            for s_ in range(K // 48, K // 2 + 1):
                if c[s_] < tau or c[s_] < c[max(0, s_ - win):s_ + win + 1].max():
                    continue
                if c[1:s_].min() > c[s_] - gap:
                    continue
                n = K / s_
                if abs(n - round(n)) <= 0.05 * n and 2 <= round(n) <= 24:
                    votes[round(n)] = votes.get(round(n), 0) + 1
                break
        held = [n for n, v in votes.items() if v >= 2]
        out.append(max(held) if held else 1)
    return out


def load_stone(mask_path, shape):
    m = np.asarray(Image.open(mask_path).convert("L")) >= 128
    assert m.shape == shape, f"{mask_path}: {m.shape} against the photo's {shape}"
    return m


def measure(path, flip=False, crop=None, thr_offset=0.0, width_mm=None, depth_mm=None, overlay=None, mask=None):
    rgb, L = load(path, crop)
    stone, screen, openings = segment(L, flip, thr_offset, load_stone(mask, L.shape) if mask else None)
    # specks: openings under 6 px across (below the smallest opening the read-back tested) are stone texture
    lab, n = label(openings, connectivity=1, return_num=True)
    if n:
        mr = ndi.maximum(ndi.distance_transform_edt(openings), lab, index=np.arange(1, n + 1))
        speck = np.isin(lab, np.nonzero(2 * mr < 6)[0] + 1)
        openings, stone = openings & ~speck, stone | speck
    lab, n = label(openings, connectivity=1, return_num=True)
    if n < 4:
        raise SystemExit(f"{path}: only {n} openings")
    hull = convex_hull_image(openings)
    sk_all = skeletonize(stone)
    dist_s = ndi.distance_transform_edt(stone)
    inner0 = ndi.binary_erosion(hull, iterations=3)
    bar0 = float(2 * np.median(dist_s[sk_all & inner0]))
    sk = loops(sk_all)
    jc, jdeg = junctions(sk, dist_s)
    near_j = np.zeros_like(sk)
    for (y, x) in np.round(jc).astype(int):
        near_j[y, x] = True
    near_j = ndi.distance_transform_edt(~near_j) <= 1.5 * bar0
    away = sk & inner0 & ~near_j
    bar = float(2 * np.median(dist_s[away])) if away.sum() > 50 else bar0
    field = hull
    open_share_field = float(openings[field].sum() / field.sum())
    dist_o = ndi.distance_transform_edt(openings)
    maxr = ndi.maximum(dist_o, lab, index=np.arange(1, n + 1))
    areas = ndi.sum(np.ones_like(lab), lab, index=np.arange(1, n + 1))
    order_ = np.argsort(maxr)
    cum = np.cumsum(areas[order_]) / areas.sum()
    opening = float(2 * maxr[order_][np.searchsorted(cum, 0.5)])  # area-weighted median
    repeat = opening + bar
    dist_f = ndi.distance_transform_edt(field)
    t = np.clip((dist_f - 0.5 * repeat) / (2 * repeat), 0, 1)
    wgt = t * t * (3 - 2 * t)  # smoothstep
    inner = dist_f >= 1.5 * repeat
    open_share = float((wgt * openings).sum() / wgt.sum()) if wgt.sum() > 0 else open_share_field
    j_in = [tuple(np.round(p).astype(int)) for p in jc if wgt[int(round(p[0])), int(round(p[1]))] > 0]
    wj = float(sum(wgt[int(round(p[0])), int(round(p[1]))] for p in jc))
    oc = np.array(ndi.center_of_mass(openings, lab, index=np.arange(1, n + 1)))
    wo = float(sum(wgt[int(round(p[0])), int(round(p[1]))] for p in oc))
    o_in = round(wo, 1)
    per_junction = float(wo / wj) if wj > 0 else None
    # symmetry
    order, mirrors, symd = acf_symmetry(openings, inner if inner.sum() > 20 * repeat ** 2 else field, (repeat / 2, 6 * repeat))
    # the largest star: local turning order round opening centres and junctions in the inner field
    cand = [tuple(p) for p in oc if inner[int(round(p[0])), int(round(p[1]))]] + [tuple(p) for p in jc if inner[int(round(p[0])), int(round(p[1]))]]
    orders = local_order(openings, cand, 0.25 * repeat, max(2.5 * repeat, 1.5 * float(maxr.max())))
    vals, cnt = np.unique(orders, return_counts=True) if orders else (np.array([1]), np.array([1]))
    star = int(max([v for v, c in zip(vals, cnt) if c >= 2] or [1]))
    # corners of the largest openings
    k = max(3, n // 10)
    big = np.argsort(areas)[::-1][:k] + 1
    pts = [corners(lab == b) for b in big]
    rec = {
        "image": path, "size_px": [int(L.shape[1]), int(L.shape[0])], "openings": int(n),
        "open_share": round(open_share, 4), "bar_px": round(bar, 2), "opening_px": round(opening, 2),
        "bar_over_opening": round(bar / opening, 4),
        "per_junction": None if per_junction is None else round(per_junction, 4), "openings_weighted": o_in, "junctions_weighted": round(wj, 1),
        "junction_degree": round(float(np.average(jdeg, weights=[wgt[int(round(p[0])), int(round(p[1]))] for p in jc])) if wj > 0 else 0.0, 3),
        "per_junction_from_degree": round(float(np.average(jdeg, weights=[wgt[int(round(p[0])), int(round(p[1]))] for p in jc])) / 2 - 1, 4) if wj > 0 else None,
        "open_share_field": round(open_share_field, 4),
        "repeats_across": round(float(min(np.ptp(np.nonzero(field)[0]), np.ptp(np.nonzero(field)[1])) / repeat), 1),
        "rotation": order, "mirrors": mirrors, **symd, "star": star, "star_counts": {int(v): int(c) for v, c in zip(vals, cnt)},
        "points": int(np.median(pts)), "points_each": pts,
    }
    if width_mm:
        sx = np.nonzero(screen.any(axis=0))[0]
        mm_px = width_mm / (sx.max() - sx.min() + 1)
        rec["mm_per_px"] = round(float(mm_px), 4)
        rec["opening_mm"] = round(opening * mm_px, 2)
        rec["bar_mm"] = round(bar * mm_px, 2)
        if depth_mm:
            rec["thickness_over_opening"] = round(depth_mm / (opening * mm_px), 4)
    if overlay:
        o = rgb * 0.55
        o[openings] = o[openings] * 0.4 + np.array([0.1, 0.75, 0.85]) * 0.6
        edge = inner ^ ndi.binary_erosion(inner, iterations=2)
        o[edge] = [1, 1, 1]
        fedge = field ^ ndi.binary_erosion(field, iterations=2)
        o[fedge] = [1, 0.85, 0.2]
        for (y, x) in j_in:
            o[max(0, y - 3):y + 4, max(0, x - 3):x + 4] = [0.95, 0.1, 0.1]
        im = Image.fromarray((np.clip(o, 0, 1) * 255).astype(np.uint8))
        im.thumbnail((700, 700))
        im.save(overlay, quality=85)
    return rec


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("image")
    ap.add_argument("--flip", action="store_true")
    ap.add_argument("--crop", type=lambda s: [int(v) for v in s.split(",")])
    ap.add_argument("--thr-offset", type=float, default=0.0)
    ap.add_argument("--width-mm", type=float)
    ap.add_argument("--depth-mm", type=float)
    ap.add_argument("--overlay")
    a = ap.parse_args()
    print(json.dumps(measure(a.image, a.flip, a.crop, a.thr_offset, a.width_mm, a.depth_mm, a.overlay)))
