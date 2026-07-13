---
project: build-a-jpeg-codec
lesson: 36
title: Upsampling chroma
overview: Subsampled chroma planes are smaller than the image and must be stretched back to full size. Today you upsample a 4:2:0 chroma plane by replication so every luma pixel has a matching chroma value.
goal: Upsample a chroma plane by the sampling ratio using nearest-neighbor replication.
spec:
  scenario: Upsampling a 4:2:0 chroma plane
  status: failing
  lines:
    - kw: Given
      text: 'a chroma plane at half resolution in each direction (a 2x2 upsampling ratio) whose sample (0,0) is 40 and sample (1,0) is 50'
    - kw: When
      text: the plane is upsampled to full resolution
    - kw: Then
      text: 'each chroma sample fills a 2-by-2 pixel block, so full-resolution pixels (0,0), (1,0), (0,1), and (1,1) are all 40'
    - kw: And
      text: 'full-resolution pixel (2,0) is 50, taken from chroma sample (1,0)'
code:
  lang: go
  source: |
    // nearest-neighbor: full pixel (x,y) reads chroma sample (x/hratio, y/vratio).
    // for 4:2:0 both ratios are 2, so each chroma sample covers a 2x2 area.
    func upsample(chroma []byte, cw, ch, hratio, vratio int) []byte { }
checkpoint: You can upsample a subsampled chroma plane to full size. Commit and stop here.
---

When chroma is subsampled - 4:2:0 stores one Cb and one Cr sample for every 2-by-2 block of luma pixels - the chroma planes come out of the decoder at a fraction of the image size and must be stretched back up before color conversion, so that every full-resolution pixel has a `Y`, a `Cb`, and a `Cr` to combine. The simplest upsampling is **nearest-neighbor replication**: full-resolution pixel `(x,y)` reads chroma sample `(x/hratio, y/vratio)` with integer division, so each chroma sample fans out to cover a `hratio`-by-`vratio` rectangle.

For 4:2:0 both ratios are 2, so chroma sample `(0,0)` fills the four pixels `(0,0),(1,0),(0,1),(1,1)`, and sample `(1,0)` starts at pixel `(2,0)`. Real encoders and higher-end decoders use smoother interpolation, but replication is exact, simple, and matches the block-replicated way the chroma was subsampled in the first place - a fine choice for a teaching codec. With chroma at full size, the three planes finally line up pixel for pixel, which is all the last decoder lesson needs.
