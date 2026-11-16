#!/usr/bin/env bash
# Put two pages in random order for a blind pick, write the key, open both.
# Usage: tools/blind.sh <run-dir> <page-x.html> <page-y.html>
# Writes <run-dir>/blind/page-1.html, page-2.html and <run-dir>/.blind-key.
# Don't open the key, or compare file sizes, until the judge has answered.
set -euo pipefail

dir="$1"; x="$2"; y="$3"
mkdir -p "$dir/blind"
if [ $((RANDOM % 2)) -eq 0 ]; then first="$x"; second="$y"; else first="$y"; second="$x"; fi
cp "$first" "$dir/blind/page-1.html"
cp "$second" "$dir/blind/page-2.html"
printf 'page-1=%s\npage-2=%s\n' "$first" "$second" > "$dir/.blind-key"
# The copies sit one folder deeper than the originals, so relative script, image and stylesheet
# paths are made absolute (to the original's folder). In-page links like href="#x" are left alone.
for pair in "1:$first" "2:$second"; do
  n="${pair%%:*}"; orig="${pair#*:}"
  base="file://$(cd "$(dirname "$orig")" && pwd)/"
  python3 -I -c '
import sys, re
p, b = sys.argv[1], sys.argv[2]
s = open(p, encoding="utf-8").read()
skip = r"(?!#|[a-zA-Z][a-zA-Z0-9+.-]*:|/)"
s = re.sub(r"(\bsrc=[\"\x27])" + skip, lambda m: m.group(1) + b, s)
s = re.sub(r"(<link\b[^>]*\bhref=[\"\x27])" + skip, lambda m: m.group(1) + b, s)
open(p, "w", encoding="utf-8").write(s)' "$dir/blind/page-$n.html" "$base"
done
# Open them one at a time: some browsers drop the second file when both arrive in one call.
open "$dir/blind/page-1.html" 2>/dev/null || true
sleep 1
open "$dir/blind/page-2.html" 2>/dev/null || true
abs="$(cd "$dir/blind" && pwd)"
echo "Blind pages ready:"
echo "  file://$abs/page-1.html"
echo "  file://$abs/page-2.html"
