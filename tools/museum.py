"""Search open museum collections for a piece's samples, through their public APIs.

    .venv/bin/python -I tools/museum.py search --out <candidates.json> --met "jali" "pierced screen" --vam "jali"
    .venv/bin/python -I tools/museum.py fetch <candidates.json> <ids...> --dir pieces/<piece>

`search` writes one record per object: source, id, title, type, date, place, material, size in mm (width, height,
depth where listed), licence, image URL and the object's page. `fetch` downloads the chosen objects' images, at most
1600 px on the long side (`--max` for more, `--again` to replace): public-domain images into <dir>/images/, others into <dir>/images-local/ (git-ignored).

Only the museums' documented APIs are used, with a plain client name. Nothing is fetched that the API does not offer.
Licence notes are not legal advice.
"""
import argparse
import io
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request

UA = "patternbook-research/0.1 (open-source style library)"


def get(url, binary=False):
    url = urllib.parse.quote(url, safe=":/?&=!,%")  # some image paths have spaces
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=40) as r:
        data = r.read()
    time.sleep(0.3)
    return data if binary else json.loads(data)


# ---- the Met (images of public-domain objects are CC0) ----
def met_search(q):
    url = "https://collectionapi.metmuseum.org/public/collection/v1.1/search?" + urllib.parse.urlencode({"q": q, "hasImages": "true", "limit": 80})
    return get(url).get("objectIDs") or []


def met_object(oid):
    r = get(f"https://collectionapi.metmuseum.org/public/collection/v1/objects/{oid}")
    size = {}
    for m in r.get("measurements") or []:
        if m.get("elementName") in ("Overall", "Overall (Screen)", "Screen", "Panel"):
            for k, v in (m.get("elementMeasurements") or {}).items():
                if k in ("Width", "Height", "Depth") and isinstance(v, (int, float)):
                    size.setdefault(k.lower(), round(v * 10, 1))  # cm -> mm
    return {
        "source": "met", "id": f"met-{oid}", "title": r.get("title"), "type": r.get("objectName") or r.get("classification"),
        "date": r.get("objectDate"), "place": ", ".join(x for x in [r.get("city"), r.get("state"), r.get("region"), r.get("country"), r.get("culture")] if x),
        "material": r.get("medium"), "size_mm": size, "dimensions_text": r.get("dimensions"),
        "licence": "public domain (Met Open Access, CC0)" if r.get("isPublicDomain") else "not public domain",
        "public": bool(r.get("isPublicDomain")), "image": r.get("primaryImage") or r.get("primaryImageSmall"),
        "page": r.get("objectURL"),
    }


# ---- the V&A (images free for non-commercial use under the V&A's terms; kept local) ----
def vam_search(q):
    out, page = [], 1
    while True:
        url = "https://api.vam.ac.uk/v2/objects/search?" + urllib.parse.urlencode({"q": q, "images_exist": 1, "page_size": 100, "page": page})
        d = get(url)
        out += [r["systemNumber"] for r in d.get("records", [])]
        if page >= d["info"].get("pages", 1):
            return out
        page += 1


def vam_object(sid):
    r = get(f"https://api.vam.ac.uk/v2/museumobject/{sid}")["record"]
    size = {}
    for dmn in r.get("dimensions") or []:
        k, v, u = (dmn.get("dimension") or "").lower(), dmn.get("value"), (dmn.get("unit") or "").lower()
        try:
            v = float(v)
        except (TypeError, ValueError):
            continue
        if k in ("width", "height", "depth") and not dmn.get("part"):
            size.setdefault(k, v * {"mm": 1, "cm": 10, "m": 1000}.get(u, 1))
    img = (r.get("images") or [None])[0]
    title = (r.get("titles") or [{}])[0].get("title") if r.get("titles") else ""
    places = ", ".join(p.get("place", {}).get("text", "") for p in r.get("placesOfOrigin") or [])
    dates = "; ".join(d.get("date", {}).get("text", "") for d in r.get("productionDates") or [])
    mats = r.get("materialsAndTechniques") or ", ".join(m.get("text", "") for m in r.get("materials") or [])
    return {
        "source": "vam", "id": f"vam-{sid}", "title": title or r.get("objectType"), "type": r.get("objectType"),
        "date": dates, "place": places, "material": mats, "size_mm": size,
        "licence": "V&A images: non-commercial use under the V&A's terms (kept local)", "public": False,
        "image": f"https://framemark.vam.ac.uk/collections/{img}/full/!1600,1600/0/default.jpg" if img else None,
        "page": f"https://collections.vam.ac.uk/item/{sid}/",
    }


def search(args):
    recs, seen = [], set()
    for q in args.met or []:
        for oid in met_search(q):
            if ("met", oid) in seen:
                continue
            seen.add(("met", oid))
            try:
                recs.append(met_object(oid) | {"query": q})
            except Exception as e:  # an object the API can't return
                print("met", oid, e, file=sys.stderr)
    for q in args.vam or []:
        for sid in vam_search(q):
            if ("vam", sid) in seen:
                continue
            seen.add(("vam", sid))
            try:
                recs.append(vam_object(sid) | {"query": q})
            except Exception as e:
                print("vam", sid, e, file=sys.stderr)
    os.makedirs(os.path.dirname(args.out) or ".", exist_ok=True)
    json.dump(recs, open(args.out, "w"), indent=1, ensure_ascii=False)
    print(f"{len(recs)} records -> {args.out}")


def fetch(args):
    from PIL import Image
    recs = {r["id"]: r for r in json.load(open(args.candidates))}
    for i in args.ids:
        r = recs[i]
        sub = "images" if r["public"] else "images-local"
        os.makedirs(os.path.join(args.dir, sub), exist_ok=True)
        path = os.path.join(args.dir, sub, f"{i}.jpg")
        if os.path.exists(path) and not args.again:
            continue
        url = r["image"].replace("!1600,1600", f"!{args.max},{args.max}")
        im = Image.open(io.BytesIO(get(url, binary=True))).convert("RGB")
        im.thumbnail((args.max, args.max))
        im.save(path, quality=90)
        print(i, im.size, "->", path)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    sp = ap.add_subparsers(dest="cmd", required=True)
    s = sp.add_parser("search"); s.add_argument("--out", required=True); s.add_argument("--met", nargs="*"); s.add_argument("--vam", nargs="*")
    f = sp.add_parser("fetch"); f.add_argument("candidates"); f.add_argument("ids", nargs="+"); f.add_argument("--dir", required=True)
    f.add_argument("--max", type=int, default=1600); f.add_argument("--again", action="store_true")
    a = ap.parse_args()
    search(a) if a.cmd == "search" else fetch(a)
