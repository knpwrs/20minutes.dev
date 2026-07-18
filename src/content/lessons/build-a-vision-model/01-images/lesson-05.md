---
project: build-a-vision-model
lesson: 5
title: A test pattern
overview: You need something to look at, and downloading a sample image is a dependency you do not want. Today you generate one from a formula - and your project produces its first real output.
goal: Generate a test image from a formula and write it to a PGM you can open.
spec:
  scenario: Generating a test pattern
  status: failing
  lines:
    - kw: Given
      text: 'a test pattern 16 pixels wide and 16 pixels high'
    - kw: And
      text: 'each pixel starts as the ramp value: column times 17 plus row times 29, taken modulo 256'
    - kw: And
      text: 'the image is divided into 4 by 4 blocks, and in every other block - those where the block column plus the block row is even - the ramp value is inverted to 255 minus itself'
    - kw: When
      text: the pattern is generated
    - kw: Then
      text: 'the pixel at column 0, row 0 is 255 - its ramp value is 0, and it sits in an inverted block'
    - kw: And
      text: 'the pixel at column 5, row 0 is 85 - its ramp value is 85, and it sits in a block that is not inverted'
code:
  lang: go
  source: |
    ramp := (x*17 + y*29) % 256
    // invert the ramp inside every other 4x4 block; (x/4 + y/4) tells you which
checkpoint: Your program runs, writes out.pgm, and you can open it and see a checkered ramp. Commit and stop for today.
---

Every project in this chapter has been building toward something you can
actually look at. A **generated** test pattern beats a downloaded photograph for
three reasons: it needs no assets, it is identical on every machine, and you can
compute by hand what any given pixel should be - which makes it a debugging
instrument rather than just a picture.

The two ingredients are chosen deliberately. The **ramp** varies smoothly across
the image, which is what a blur should barely touch and a gradient filter should
report a constant slope for. The **inverted blocks** slam the value from one
extreme to the other at every block boundary, which is a hard edge - exactly
what an edge detector should light up on. So this one small image exercises both
ends of every filter you are about to write. Wire up an entry point that
generates it and writes `out.pgm`; from today, the project runs.
