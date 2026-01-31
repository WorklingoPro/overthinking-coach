#!/bin/bash
# Simple placeholder icon creator (requires ImageMagick)
# For production, use proper designed icons

sizes=(72 96 128 144 152 192 384 512)

for size in "${sizes[@]}"; do
  # Create orange square with arrow
  convert -size ${size}x${size} xc:'#ff6b35' \
    -gravity center \
    -pointsize $((size/2)) \
    -fill white \
    -font "DejaVu-Sans-Bold" \
    -annotate +0+0 "→" \
    icon-${size}x${size}.png
done

echo "Placeholder icons created! Replace with designed icons for production."
