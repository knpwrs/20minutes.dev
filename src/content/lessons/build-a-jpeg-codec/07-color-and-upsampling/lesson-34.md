---
project: build-a-jpeg-codec
lesson: 34
title: YCbCr to RGB
overview: JPEG stores color as luma and two chroma channels; displays want red, green, and blue. Today you convert one YCbCr sample to RGB with the JFIF equations, rounding and clamping.
goal: Convert a YCbCr sample to RGB using the JFIF full-range equations, then round and clamp each channel to 0 to 255.
spec:
  scenario: Converting YCbCr to RGB
  status: failing
  lines:
    - kw: Given
      text: 'the YCbCr sample (128, 128, 128)'
    - kw: When
      text: it is converted to RGB
    - kw: Then
      text: 'the result is (128, 128, 128) - neutral chroma leaves a gray'
    - kw: And
      text: 'the sample (128, 128, 255) converts to (255, 37, 128), with red clamped up to 255, and the sample (0, 128, 0) converts to (0, 91, 0), with red clamped down to 0'
code:
  lang: go
  source: |
    // JFIF full-range YCbCr -> RGB (Cb,Cr are offset by 128):
    //   R = Y + 1.402   * (Cr-128)
    //   G = Y - 0.344136*(Cb-128) - 0.714136*(Cr-128)
    //   B = Y + 1.772   * (Cb-128)
    // round each, then clamp to [0,255].
    func ycbcrToRGB(y, cb, cr int) (r, g, b byte) { }
checkpoint: You can convert a YCbCr sample to clamped RGB. Commit and stop here.
---

JFIF uses **full-range YCbCr**, where luma `Y` is the brightness and `Cb`, `Cr` are blue- and red-difference chroma channels centered on 128. The conversion back to RGB is three fixed linear equations: red leans on `Cr`, blue on `Cb`, and green subtracts a share of both. When chroma is neutral (`Cb = Cr = 128`) the differences vanish and `R = G = B = Y`, so `(128,128,128)` stays a gray `(128,128,128)`.

As with the sample level shift, the results must be **rounded and clamped**. A strong `Cr` pushes red past 255 - `(128,128,255)` computes red `306`, clamped to `255`, giving `(255,37,128)` - and a low luma with low `Cr` drives red below 0, so `(0,128,0)` clamps red to `0` for `(0,91,0)`. Pinning both a clamp-up and a clamp-down case keeps the saturating arithmetic honest. This is the per-pixel color step; combined with chroma upsampling it turns a decoded MCU's three sample planes into the final image.
