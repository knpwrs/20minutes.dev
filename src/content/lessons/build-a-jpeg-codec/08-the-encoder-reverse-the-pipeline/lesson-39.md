---
project: build-a-jpeg-codec
lesson: 39
title: Downsampling chroma
overview: To subsample chroma the encoder averages each 2-by-2 block into one sample. Today you build that downsampler, the forward counterpart to the decoder's upsampling.
goal: Downsample a full-resolution chroma plane by averaging each 2-by-2 group of samples into one.
spec:
  scenario: Downsampling a chroma plane 4:2:0
  status: failing
  lines:
    - kw: Given
      text: 'a 2-by-2 group of chroma samples 100, 102, 104, 106'
    - kw: When
      text: the group is downsampled to one sample
    - kw: Then
      text: 'the result is 103, the rounded average of the four'
    - kw: And
      text: 'a full plane is reduced to half width and half height, one output sample per 2-by-2 input group'
code:
  lang: go
  source: |
    // 4:2:0: output sample = round((a+b+c+d)/4) over each 2x2 input group.
    // output plane is (w+1)/2 by (h+1)/2; on an odd edge, replicate the last
    // row/column so the 2x2 group is still full.
    func downsample(plane []byte, w, h int) (out []byte, ow, oh int) { }
checkpoint: You can downsample a chroma plane for 4:2:0. Commit and stop here.
---

When the encoder targets 4:2:0, it stores chroma at half resolution in each direction, so it must reduce each **2-by-2 block** of chroma samples to a single value. Averaging is the natural choice: `(100+102+104+106)/4 = 103`. This is the forward counterpart to the decoder's replication upsampling, and although the pair is lossy (the average discards the variation within each 2-by-2 group), the eye tolerates it because chroma detail matters far less than luma detail.

Averaging rather than dropping three of four samples reduces the visible blockiness the coarser chroma would otherwise cause. The output plane is half the width and half the height, rounding up on odd dimensions. Luma is never downsampled - it keeps full resolution - so only the two chroma planes pass through this step. With chroma reduced, both luma and chroma planes are ready to be cut into 8-by-8 blocks and transformed.
