"""C-031's read-back: measure the synthetic screens (engine/check/screens.mjs) and compare with what was drawn.

    node engine/check/screens.mjs --out runs/c031/synthetic
    .venv/bin/python -I tools/screen_readback.py runs/c031/synthetic [--out runs/c031/readback.json]

Numbers must come back within 5 %; rotation, mirrors, points and the star exactly.
"""
import importlib.util
import json
import os
import sys

here = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("screen_measure", os.path.join(here, "screen_measure.py"))
sm = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sm)

d = sys.argv[1]
known = json.load(open(os.path.join(d, "known.json")))
out, ok_all = {}, True
for name, k in known.items():
    r = sm.measure(os.path.join(d, f"{name}.png"), overlay=os.path.join(d, f"{name}-overlay.jpg"))
    pairs = {"open_share": (r["open_share"], k["openShareField"])}
    if k.get("bar"):
        pairs["bar_px"] = (r["bar_px"], k["bar"])
    if k.get("perJunction"):
        pairs["per_junction"] = (r["per_junction"], k["perJunction"])
    if k.get("opening"):
        pairs["opening_px"] = (r["opening_px"], k["opening"])
    checks = {m: abs(a - b) <= 0.05 * abs(b) for m, (a, b) in pairs.items()}
    checks |= {"rotation": r["rotation"] == k["rotation"], "mirrors": r["mirrors"] == k["mirrors"], "star": r["star"] == k["star"]}
    if k.get("points"):
        checks["points"] = r["points"] == k["points"]
    ok_all &= all(checks.values())
    out[name] = {"read": {m: a for m, (a, b) in pairs.items()} | {"rotation": r["rotation"], "mirrors": r["mirrors"], "points": r["points"], "star": r["star"], "star_counts": r["star_counts"], "junction_degree": r.get("junction_degree")},
                 "drawn": {m: round(b, 4) for m, (a, b) in pairs.items()} | {"rotation": k["rotation"], "mirrors": k["mirrors"], "points": k["points"], "star": k["star"]},
                 "checks": checks}
    print(f"{name:12s}", "  ".join(f"{m} {out[name]['read'][m]} ({out[name]['drawn'][m]}) {'ok' if v else 'NO'}" for m, v in checks.items()))
if "--out" in sys.argv:
    json.dump(out | {"pass": ok_all}, open(sys.argv[sys.argv.index("--out") + 1], "w"), indent=1)
sys.exit(0 if ok_all else 1)
