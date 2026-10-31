"""Profile a page's visual defaults: colours, fonts, radii, shadows, gradients.

Reads the CSS in <style> blocks and style="" attributes, plus SVG fill/stroke,
resolves CSS custom properties from their first definition, and reports:
  bg, text       body background (and its tone) and text colour
  accents        saturated mid-lightness colours by frequency, with hue bucket
  fonts          heading (h1) and body font stacks
  radius         distinct border-radius values
  shadows, gradients   counts
Built for C-005 (what an unguided agent defaults to).

Usage: python3 -I tools/css-profile.py page.html [more.html ...]
"""
import colorsys
import re
import sys
from collections import Counter

HEX = re.compile(r"#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b")
RGB = re.compile(r"rgba?\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)")


def norm_hex(h):
    h = h.lower()
    if len(h) == 4:
        h = "#" + "".join(c * 2 for c in h[1:])
    return h


def colours_in(text):
    out = [norm_hex(m) for m in HEX.findall(text)]
    out += ["#%02x%02x%02x" % tuple(int(x) for x in m) for m in RGB.findall(text)]
    return out


def hls(hexv):
    r, g, b = (int(hexv[i:i + 2], 16) / 255 for i in (1, 3, 5))
    return colorsys.rgb_to_hls(r, g, b)


def is_accent(hexv):
    """Saturated, mid-lightness: a colour doing work, not a tinted neutral."""
    h, l, s = hls(hexv)
    return s >= 0.25 and 0.15 <= l <= 0.85


def tone(hexv):
    """Describe a background: dark, white, or the hue of a tinted light."""
    if hexv == "?":
        return "?"
    h, l, s = hls(hexv)
    if l < 0.25:
        return "dark"
    if s < 0.08 or l > 0.985:
        return "white/grey"
    return "tinted " + hue_name(hexv)


def hue_name(hexv):
    h = hls(hexv)[0] * 360
    for limit, name in [(15, "red"), (45, "orange"), (65, "yellow"), (170, "green"),
                        (200, "teal"), (250, "blue"), (290, "purple"), (345, "pink"),
                        (361, "red")]:
        if h < limit:
            return name


def resolve_vars(css):
    defs = {}
    for name, val in re.findall(r"(--[\w-]+)\s*:\s*([^;}]+)", css):
        defs.setdefault(name, val.strip())
    for _ in range(5):
        css = re.sub(r"var\(\s*(--[\w-]+)\s*(?:,[^)]*)?\)",
                     lambda m: defs.get(m.group(1), m.group(0)), css)
    return css


def rule_body(css, selector):
    """Concatenate the declarations of every rule whose selector list names `selector`."""
    out = []
    for sel, body in re.findall(r"([^{}]+)\{([^{}]*)\}", css):
        if selector in [x.strip() for x in sel.split(",")]:
            out.append(body)
    return ";".join(out)


def prop(body, name):
    m = re.search(r"(?:^|;|\s)" + name + r"\s*:\s*([^;]+)", body)
    return m.group(1).strip() if m else ""


def font_stack(body):
    fam = prop(body, "font-family")
    if fam:
        return fam
    short = prop(body, "font")
    m = re.search(r"\d(?:px|rem|em|%)(?:/[\d.]+\w*)?\s+(.+)$", short)
    return m.group(1) if m else ""


def profile(path):
    html = open(path, encoding="utf-8").read()
    css = "\n".join(re.findall(r"(?is)<style[^>]*>(.*?)</style>", html))
    # Drop dark-mode overrides so the first (light) definition wins.
    css = re.sub(r"(?is)@media[^{]*prefers-color-scheme:\s*dark[^{]*\{(?:[^{}]*\{[^}]*\})*[^}]*\}", "", css)
    inline = " ".join(re.findall(r'style="([^"]*)"', html))
    svg_paint = " ".join(re.findall(r'(?:fill|stroke|stop-color)="([^"]*)"', html))
    css_r = resolve_vars(css)
    inline_r = resolve_vars(css + "\n" + inline)[len(css) + 1:]

    body = rule_body(css_r, "body") + ";" + rule_body(css_r, "html")
    bg = colours_in(prop(body, "background-color") or prop(body, "background"))
    fg = colours_in(prop(body, "color"))
    h1 = rule_body(css_r, "h1")
    used = colours_in(re.sub(r"--[\w-]+\s*:[^;}]+", "", css_r)) + colours_in(inline_r) + colours_in(svg_paint)
    accents = Counter(c for c in used if is_accent(c))

    return {
        "bg": bg[0] if bg else "?",
        "bg_tone": tone(bg[0]) if bg else "?",
        "text": fg[0] if fg else "?",
        "accents": [(c, n, hue_name(c)) for c, n in accents.most_common(4)],
        "heading_font": font_stack(h1) or "(inherits)",
        "body_font": font_stack(body) or "?",
        "radius": sorted(set(re.findall(r"border-radius\s*:\s*([^;}]+)", css_r + inline_r)))[:6],
        "shadows": len(re.findall(r"box-shadow\s*:(?!\s*none)", css_r + inline_r)),
        "gradients": len(re.findall(r"gradient\(", css_r + inline_r + html)),
    }


for p in sys.argv[1:]:
    r = profile(p)
    print(f"== {p}")
    print(f"   bg {r['bg']} ({r['bg_tone']})   text {r['text']}")
    print("   accents " + ", ".join(f"{c} x{n} ({h})" for c, n, h in r["accents"]))
    print(f"   heading font: {r['heading_font']}")
    print(f"   body font:    {r['body_font']}")
    print(f"   radius {r['radius']}   shadows {r['shadows']}   gradients {r['gradients']}")
