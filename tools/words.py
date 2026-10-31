"""Count visible words on a page, outside <script>, <style> and <svg>.

A rough measure of how text-heavy a page is (C-002: 414 vs 1,649).
Usage: python3 -I tools/words.py page.html [more.html ...]
"""
import html
import re
import sys

for path in sys.argv[1:]:
    with open(path, encoding="utf-8") as f:
        s = f.read()
    s = re.sub(r"(?is)<(script|style|svg)[^>]*>.*?</\1>", " ", s)
    text = html.unescape(re.sub(r"<[^>]+>", " ", s))
    print(f"{len(re.findall(r'[A-Za-z]{2,}', text)):>6}  {path}")
