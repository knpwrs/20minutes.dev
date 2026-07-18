---
project: build-a-vision-model
lesson: 15
title: conv2d forward
overview: A conv layer is the same correlation from lesson 6, just with floating point weights a network could later learn, and valid padding in place of the zero-padded same output most classical filters used. Today you apply it.
goal: Correlate a single learnable 3x3 kernel across the feature map from lesson 14 with valid padding, producing a 4x4 output.
spec:
  scenario: A single-channel conv layer with valid padding
  status: failing
  lines:
    - kw: Given
      text: 'the 6 by 6 feature map from lesson 14, a kernel whose rows are -1 0 1, then -1 0 1, then -1 0 1, and a bias of -1'
    - kw: When
      text: 'the kernel is correlated across the map exactly as in lesson 6, no flip, but with valid padding - the loop only visits positions whose full neighbourhood exists'
    - kw: Then
      text: 'the output is 4 by 4, one row and one column of border lost on every side, unlike the same-size output lesson 6 and lesson 7 produced with zero padding'
    - kw: And
      text: 'row 0 of the output reads -1, 2, 2, -1'
    - kw: And
      text: 'every other row reads the same -1, 2, 2, -1, since the input is a vertical edge with no row-to-row change'
code:
  lang: go
  source: |
    // same multiply-and-sum as lesson 6, no kernel flip, plus a bias term -
    // but no padding, so the loop bounds stop 2 short: a 6x6 map becomes 4x4
    func conv3x3Valid(in [6][6]float64, k [3][3]float64, bias float64) [4][4]float64 {
      var out [4][4]float64
      // out[oy][ox] = bias + sum of k[ky][kx]*in[oy+ky][ox+kx] over ky,kx 0..2
      return out
    }
checkpoint: You have a real conv layer forward pass, built from the same correlation lesson 6 pinned, just on floats with valid padding. Commit and stop for today.
---

A conv layer is not a new operation - it is lesson 6's correlation, unflipped kernel and all, wearing a learnable hat. The kernel entries are no longer fixed integers you chose to detect an edge; they are floating point weights a network will eventually adjust by training. A bias term is new too: one constant added to every output pixel of a channel, on top of the weighted sum.

The other change is padding. Lesson 7 gave you two choices, zero-padded same and valid-only, and most of the classical filters after it (box blur, Gaussian) reached for same so the output stayed a full-size image to look at. A conv layer reaches for the other one: valid, no padding at all, so a 3x3 kernel shrinks the map by one pixel on every side, exactly as lesson 7's valid path did. That is a deliberate choice, not an oversight - a network stacks many conv layers, and shrinking a little at each one is cheaper than inventing pixels at every border to keep the size fixed.
