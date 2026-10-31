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
open "$dir/blind/page-1.html" "$dir/blind/page-2.html" 2>/dev/null || true
echo "Blind pages ready in $dir/blind/"
