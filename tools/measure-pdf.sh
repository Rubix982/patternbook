#!/usr/bin/env bash
# Measure a source PDF: embedded fonts, page size, and the most common colours on one page.
# Usage: tools/measure-pdf.sh <file.pdf> [page=1]
# Needs: poppler (pdffonts, pdfinfo, pdftoppm) and ImageMagick (magick).
set -euo pipefail

pdf="$1"
page="${2:-1}"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

echo "== page size"
pdfinfo "$pdf" | grep -E "Pages|Page size"

echo "== fonts (family and weight, subset prefix stripped)"
pdffonts "$pdf" | tail -n +3 | awk '{print $1}' | sed 's/^[A-Z]\{6\}+//' | sort -u

echo "== top colours on page $page (pixel count, hex)"
pdftoppm -f "$page" -l "$page" -r 72 -png "$pdf" "$tmp/p"
magick "$tmp"/p*.png -format %c histogram:info:- | sort -rn | head -8 \
  | grep -oE "^ *[0-9]+|#[0-9A-F]{6}" | paste - -
