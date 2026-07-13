---
project: build-a-jpeg-codec
lesson: 40
title: Extracting and level-shifting a block
overview: The encoder cuts each plane into 8-by-8 blocks and recenters them on zero for the forward DCT. Today you extract one block from a plane and subtract 128 from every sample.
goal: Extract an 8-by-8 block from a sample plane at a block position and level-shift it by subtracting 128 from each sample.
spec:
  scenario: Extracting and recentering a block
  status: failing
  lines:
    - kw: Given
      text: 'a 16-wide sample plane and a request for the 8-by-8 block at block column 0, block row 0, where plane pixel (0,0) is 200 and pixel (7,0) is 0'
    - kw: When
      text: the block is extracted and level-shifted
    - kw: Then
      text: 'the block has 64 signed values, entry 0 is 72 (200 minus 128) and entry 7 is -128 (0 minus 128)'
    - kw: And
      text: 'a block at block column 1 reads plane pixels starting at x 8, and a mid-gray sample of 128 becomes 0'
code:
  lang: go
  source: |
    // read plane pixel (bx*8+col, by*8+row) into block[row*8+col],
    // subtracting 128 to recenter the 0..255 range onto -128..127.
    //   block[row*8+col] = int(plane[(by*8+row)*planeW + bx*8+col]) - 128
    func extractBlock(plane []byte, planeW, bx, by int) (block [64]int) { }
checkpoint: You can extract and recenter an 8-by-8 block for the forward DCT. Commit and stop here.
---

The forward pipeline is per-block, so the encoder must first cut each component plane into 8-by-8 **blocks**. Extracting the block at block-column `bx`, block-row `by` is the mirror of the decoder's `placeBlock`: read plane pixel `(bx*8+col, by*8+row)` into `block[row*8+col]`. This is the same offset indexing, run in the gathering direction instead of the scattering one.

While gathering, the encoder also **level-shifts** each sample by subtracting **128**, moving the `0..255` pixel range down to the signed `-128..127` the forward DCT expects - the exact inverse of the `+128` the decoder adds at the end. So a bright `200` becomes `72`, a mid-gray `128` becomes `0`, and a black `0` becomes `-128`. Doing extraction and recentering in one pass leaves you with a signed block ready to transform, which is the next lesson.
