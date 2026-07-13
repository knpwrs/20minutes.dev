---
project: build-a-png-codec
lesson: 39
title: Grayscale and grayscale with alpha
overview: Grayscale images store one intensity per pixel, replicated across red, green, and blue. Today you add those two color types to the dispatcher, a small but distinct mapping from bytes to RGBA.
goal: Assemble 8-bit color type 0 (grayscale) and color type 4 (grayscale with alpha) into image pixels.
spec:
  scenario: Assembling grayscale pixels
  status: failing
  lines:
    - kw: Given
      text: 'an unfiltered 8-bit byte 128 for a color type 0 (grayscale) pixel'
    - kw: When
      text: it is assembled
    - kw: Then
      text: 'the pixel is 128,128,128,255 - the gray value copied to red, green, and blue, fully opaque'
    - kw: And
      text: 'color type 4 reads two bytes per pixel, so bytes 128,64 give a pixel 128,128,128,64 (gray plus its alpha)'
code:
  lang: go
  source: |
    // add to the assemble switch:
    //   case 0: gray := raw[i]; Set(x,y, gray,gray,gray, 255)
    //   case 4: gray, alpha := raw[i], raw[i+1]; Set(x,y, gray,gray,gray, alpha)
checkpoint: You can assemble grayscale and grayscale-with-alpha images. Commit and stop here.
---

**Grayscale** (color type 0) stores a single intensity per pixel. To land in an RGBA buffer, that one value is **copied into all three color channels** - a gray of `128` becomes `128,128,128` - with alpha fully opaque. **Grayscale with alpha** (color type 4) adds a second byte per pixel for alpha, so `128,64` becomes `128,128,128,64`. The replication is what makes gray render as a neutral tone rather than a single-channel tint.

These are two more `case` arms in the `assemble` switch you set up last lesson, and they slot in without touching the truecolor cases - exactly the payoff of introducing the dispatcher early. Note the differing **stride** per color type: type 0 advances one byte per pixel, type 4 advances two, type 2 three, type 6 four. The unfilter step already handed you correctly grouped bytes; here you only decide how each group maps onto red, green, blue, and alpha. One color type remains, palette, and it needs a lookup table.
