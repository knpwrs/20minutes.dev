---
project: build-a-png-codec
lesson: 41
title: Sub-byte bit depths
overview: Grayscale and palette images can pack multiple pixels into one byte at bit depths 1, 2, and 4. Today you unpack those samples, reading the most significant bits of each byte first.
goal: Unpack a scanline of bit-depth 1, 2, or 4 samples into one integer sample per pixel.
spec:
  scenario: Unpacking packed samples
  status: failing
  lines:
    - kw: Given
      text: 'a bit depth of 2, the scanline byte 0x1B, and an image 4 pixels wide'
    - kw: When
      text: the byte is unpacked into samples
    - kw: Then
      text: 'the four samples are 0, 1, 2, 3 (the 2-bit groups of 00 01 10 11, most significant first)'
    - kw: And
      text: 'samples are read most-significant-bits-first within each byte, and each new scanline starts on a fresh byte boundary'
code:
  lang: go
  source: |
    // for depth d, each byte holds 8/d samples, taken from the high bits down.
    // sample k = (b >> (8 - d*(k+1))) & ((1<<d)-1)
    // stop at `width` samples per row; the next row starts a new byte.
    func unpackSamples(row []byte, depth, width int) []int { }
checkpoint: You can unpack sub-byte samples from a scanline. Commit and stop here.
---

At bit depths **1, 2, and 4**, several samples share a byte, and the packing order is the opposite of the DEFLATE bitstream: samples are taken **most-significant-bits-first**. So at depth 2 the byte `0x1B` (`00 01 10 11`) yields the four samples `0, 1, 2, 3` in that order. At depth 1 a byte holds 8 pixels, at depth 2 it holds 4, at depth 4 it holds 2. These depths apply to grayscale and palette images - the sample is either a gray level or a palette index.

Two rules keep it exact. Within a byte, extract from the top down using the shift in the hint. And each **scanline realigns** to a byte boundary: if a row does not fill its last byte, the leftover bits are padding and the next row starts fresh, so you unpack exactly `width` samples per row and discard the remainder. Once unpacked, a grayscale sample is scaled to a full byte (at depth 1, `1` means white) and a palette sample indexes PLTE exactly as before. This is the last piece of the color-and-depth matrix before 16-bit.
