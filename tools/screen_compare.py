"""C-031's comparison: where real jalis sit on each measure, and whether any measure sets them apart from the controls.

    .venv/bin/python -I tools/screen_compare.py runs/c031/measures.json [--out runs/c031/result.json]

The rule written on the card before measuring: a measure is the jali test if the jalis' 10th to 90th percentile
leaves out all but at most one of the controls (the card said at least 4 of 5; three controls failed their masks, so
it is read as at least 3 of 4). Percentiles are numpy's linear ones. The geometric jalis are strands crossing in pairs
if their median openings per junction is within 0.1 of 1.
"""
import json
import sys

import numpy as np

recs = [r for r in json.load(open(sys.argv[1])) if "error" not in r]
jal, ctl = [r for r in recs if r["role"] == "jali"], [r for r in recs if r["role"] == "control"]
geo = [r for r in jal if r["family"] == "geometric"]
MEASURES = ["open_share", "bar_over_opening", "thickness_over_opening", "per_junction", "rotation", "star"]
out = {"n_jali": len(jal), "n_geometric": len(geo), "n_control": len(ctl), "measures": {}}
for m in MEASURES:
    jv = np.array([r[m] for r in jal if r.get(m) is not None], float)
    cv = [(r["id"], r[m]) for r in ctl if r.get(m) is not None]
    lo, hi = np.percentile(jv, [10, 90])
    outside = [(i, v) for i, v in cv if v < lo or v > hi]
    test = len(cv) >= 3 and len(cv) - len(outside) <= 1
    fam = {}
    for f in sorted({r["family"] for r in jal}):
        fv = np.array([r[m] for r in jal if r["family"] == f and r.get(m) is not None], float)
        if len(fv):
            fam[f] = {"n": int(len(fv)), "p10": round(float(np.percentile(fv, 10)), 3), "median": round(float(np.median(fv)), 3),
                      "p90": round(float(np.percentile(fv, 90)), 3), "min": round(float(fv.min()), 3), "max": round(float(fv.max()), 3)}
    out["measures"][m] = {"jali_n": int(len(jv)), "jali_p10": round(float(lo), 3), "jali_median": round(float(np.median(jv)), 3), "jali_p90": round(float(hi), 3),
                          "controls": {i: round(float(v), 3) for i, v in cv}, "controls_outside": [i for i, v in outside],
                          "margin": {i: round(float(min(abs(v - lo), abs(v - hi))), 3) for i, v in cv},
                          "is_jali_test": bool(test), "by_family": fam}
    print(f"{m:24s} jalis p10 {lo:.3f}  median {np.median(jv):.3f}  p90 {hi:.3f}  (n {len(jv)})   controls {', '.join(f'{i} {v:.3f}' for i, v in cv)}"
          f"   outside {len(outside)} of {len(cv)} -> {'JALI TEST' if test else 'no'}")
pj = np.array([r["per_junction"] for r in geo if r.get("per_junction") is not None])
out["strands"] = {"geometric_per_junction_median": round(float(np.median(pj)), 4), "within_0.1_of_1": bool(abs(np.median(pj) - 1) <= 0.1),
                  "values": sorted(round(float(v), 3) for v in pj),
                  "near_0.5": int(((pj > 0.4) & (pj < 0.6)).sum()), "near_0.75": int(((pj >= 0.6) & (pj < 0.9)).sum()),
                  "near_1": int(((pj >= 0.9) & (pj < 1.15)).sum()), "above_1.15": int((pj >= 1.15).sum())}
print("geometric jalis, openings per junction:", out["strands"])
out["symmetry"] = {"jali_rotation": {str(k): int(v) for k, v in zip(*np.unique([r["rotation"] for r in jal], return_counts=True))},
                   "control_rotation": {str(k): int(v) for k, v in zip(*np.unique([r["rotation"] for r in ctl], return_counts=True))},
                   "jali_mirrors": int(sum(r["mirrors"] for r in jal)), "control_mirrors": int(sum(r["mirrors"] for r in ctl)),
                   "jali_star": {str(k): int(v) for k, v in zip(*np.unique([r["star"] for r in jal], return_counts=True))}}
print("symmetry:", out["symmetry"])
if "--out" in sys.argv:
    json.dump(out, open(sys.argv[sys.argv.index("--out") + 1], "w"), indent=1)
