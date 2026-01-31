# PWA Icon Generation Instructions

The app needs icons in multiple sizes. You can use a service like:
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator

## Required Sizes:
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

## Design Recommendations:
1. Use a simple, bold icon that represents "action" or "clarity"
2. Suggested design: Orange arrow (→) on dark blue/slate background
3. Keep it minimal - it needs to be recognizable at small sizes
4. Ensure sufficient contrast for visibility

## Quick Generation with ImageMagick:
If you have a source SVG or PNG (at least 512x512):

```bash
# Install ImageMagick if needed
# brew install imagemagick  # macOS
# sudo apt install imagemagick  # Linux

# Navigate to icons directory
cd frontend/public/icons

# Generate all sizes from a source image
convert source-icon.png -resize 72x72 icon-72x72.png
convert source-icon.png -resize 96x96 icon-96x96.png
convert source-icon.png -resize 128x128 icon-128x128.png
convert source-icon.png -resize 144x144 icon-144x144.png
convert source-icon.png -resize 152x152 icon-152x152.png
convert source-icon.png -resize 192x192 icon-192x192.png
convert source-icon.png -resize 384x384 icon-384x384.png
convert source-icon.png -resize 512x512 icon-512x512.png
```

## Temporary Placeholders:
For development, you can use solid color squares:

```bash
cd frontend/public/icons
convert -size 72x72 xc:#ff6b35 icon-72x72.png
convert -size 96x96 xc:#ff6b35 icon-96x96.png
convert -size 128x128 xc:#ff6b35 icon-128x128.png
convert -size 144x144 xc:#ff6b35 icon-144x144.png
convert -size 152x152 xc:#ff6b35 icon-152x152.png
convert -size 192x192 xc:#ff6b35 icon-192x192.png
convert -size 384x384 xc:#ff6b35 icon-384x384.png
convert -size 512x512 xc:#ff6b35 icon-512x512.png
```

The app will work without icons, but they're required for proper PWA installation.
