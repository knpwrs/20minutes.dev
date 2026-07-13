---
project: build-a-jpeg-codec
lesson: 38
title: RGB to YCbCr
overview: The encoder begins where the decoder ended - converting RGB pixels into the luma and chroma space JPEG compresses. Today you build the forward color transform.
goal: Convert an RGB pixel to YCbCr using the forward JFIF equations, rounding and clamping each channel.
spec:
  scenario: Converting RGB to YCbCr
  status: failing
  lines:
    - kw: Given
      text: 'the RGB pixel (128, 128, 128)'
    - kw: When
      text: it is converted to YCbCr
    - kw: Then
      text: 'the result is (128, 128, 128) - a neutral gray has neutral chroma'
    - kw: And
      text: 'the pure-red pixel (255, 0, 0) converts to (76, 85, 255)'
code:
  lang: go
  source: |
    // forward JFIF RGB -> YCbCr:
    //   Y  =        0.299   *R + 0.587   *G + 0.114   *B
    //   Cb = 128 - 0.168736 *R - 0.331264 *G + 0.5     *B
    //   Cr = 128 + 0.5      *R - 0.418688 *G - 0.081312 *B
    // round each, clamp to [0,255].
    func rgbToYCbCr(r, g, b int) (y, cb, cr byte) { }
checkpoint: You can convert an RGB pixel to YCbCr. Commit and stop here.
---

The encoder runs the decoder's pipeline in reverse, and the first stage is the mirror of the last decoder stage: **RGB to YCbCr**. Luma `Y` is a weighted average of the three channels dominated by green, matching human brightness perception; `Cb` and `Cr` are the blue- and red-difference chroma channels, centered on 128. A neutral gray maps to `(128,128,128)` - no color information - which is exactly why the chroma channels of a grayscale-ish region are cheap to compress.

These coefficients are the standard JFIF constants and are the precise inverse of the decoder's `ycbcrToRGB`, so the two round-trip cleanly (up to rounding). Pure red `(255,0,0)` becomes `(76,85,255)`: modest luma, low blue-difference, maximal red-difference. Splitting the image into these three planes is what lets the encoder later throw away chroma resolution and quantize chroma harder than luma without the eye much noticing.
