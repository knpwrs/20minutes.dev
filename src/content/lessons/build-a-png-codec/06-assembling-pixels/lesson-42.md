---
project: build-a-png-codec
lesson: 42
title: Sixteen-bit samples
overview: The deepest PNG images store each channel as a big-endian 16-bit value. Today you handle bit depth 16, the final entry in the color-and-depth matrix, completing every combination the decoder assembles.
goal: Assemble bit-depth 16 samples by reading big-endian 16-bit channels and reducing them to 8-bit RGBA.
spec:
  scenario: Reducing 16-bit samples to 8-bit
  status: failing
  lines:
    - kw: Given
      text: 'a color type 0 (grayscale) image at bit depth 16 with the sample bytes 0x12, 0x34 for one pixel'
    - kw: When
      text: the pixel is assembled
    - kw: Then
      text: 'the 16-bit sample is 0x1234 and the pixel is 0x12,0x12,0x12,255 - the high byte of the sample in each channel'
    - kw: And
      text: 'every channel is two bytes read most-significant byte first, reduced to 8 bits by taking the high byte'
code:
  lang: go
  source: |
    // at depth 16, a sample is (raw[i]<<8 | raw[i+1]); reduce to 8-bit via >>8.
    // apply per channel for the color type's channel count, then Set as usual.
    func sample16(hi, lo byte) int { return int(hi)<<8 | int(lo) }
checkpoint: The decoder now assembles every color type at every bit depth. Commit and stop here.
---

**Bit depth 16** stores each channel as two bytes, **big-endian**, so a grayscale sample `0x12, 0x34` is the value `0x1234`. Since this codec works in 8-bit RGBA, you **reduce** each 16-bit sample to 8 bits by taking its high byte (`>> 8`), which preserves the visible tone while fitting the common image model. This depth applies to grayscale, grayscale-with-alpha, truecolor, and truecolor-with-alpha - every non-palette type - with the channel count deciding how many 16-bit values each pixel holds.

With this, the **color-and-depth matrix is complete**: bit depths 1 through 16 across grayscale, truecolor, palette, and the two alpha types all assemble into RGBA pixels. The decoder can now take the unfiltered bytes for any standard non-interlaced PNG and produce a finished image. Everything from the eight-byte signature to real pixels is in place - the capstone will run it end to end. Next you turn the whole machine around and learn to *write* PNGs.
