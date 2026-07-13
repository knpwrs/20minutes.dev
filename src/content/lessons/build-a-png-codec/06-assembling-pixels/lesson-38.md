---
project: build-a-png-codec
lesson: 38
title: Truecolor and truecolor with alpha
overview: The most direct color types store red, green, and blue bytes per pixel, optionally with alpha. Today you assemble those into the image and set up the color-type dispatcher every later lesson extends.
goal: Assemble 8-bit color type 2 (RGB) and color type 6 (RGBA) raw bytes into image pixels.
spec:
  scenario: Assembling truecolor pixels
  status: failing
  lines:
    - kw: Given
      text: 'unfiltered 8-bit bytes 255,0,0, 0,255,0 for a 2-by-1 color type 2 (RGB) image'
    - kw: When
      text: they are assembled into pixels
    - kw: Then
      text: 'pixel (0,0) is 255,0,0,255 and pixel (1,0) is 0,255,0,255 (alpha defaults to fully opaque)'
    - kw: And
      text: 'color type 6 reads four bytes per pixel, so bytes 0,0,255,128 give a pixel 0,0,255,128 with its alpha preserved'
code:
  lang: go
  source: |
    // assemble dispatches on color type; today wire two cases.
    func assemble(raw []byte, hdr IHDR, im *Image) {
      switch hdr.ColorType {
      case 2: /* 3 bytes RGB per pixel, A=255 */
      case 6: /* 4 bytes RGBA per pixel */
      // 0,4,3 added in later lessons
      }
    }
checkpoint: You can assemble truecolor and truecolor-with-alpha images. Commit and stop here.
---

**Truecolor** (color type 2) is the simplest mapping: three bytes per pixel, straight into red, green, and blue, with alpha set to fully opaque (`255`) since the type has no transparency. **Truecolor with alpha** (color type 6) adds a fourth byte per pixel for alpha, which you keep as-is. Because the image buffer is already RGBA, type 6 is nearly a straight copy and type 2 just fills in the opaque alpha. The unfiltered bytes are consumed left to right, pixel by pixel, row by row.

The structural decision to make now, once, is the **dispatcher**: `assemble` switches on the color type, and today you wire the type-2 and type-6 cases. The remaining color types - grayscale, grayscale with alpha, and palette - are each one more `case` in this same switch over the next lessons, so introducing the switch here (rather than a type-6-only function you rewrite later) means every later color type is a pure addition. That is the difference between three clean lessons and one messy refactor.
