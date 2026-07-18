---
project: build-a-vision-model
lesson: 8
title: Box blur
overview: A blur is the same convolution from lessons 6 and 7, just with a kernel that averages instead of differencing. Today you build the simplest one, a box blur, and pin the exact fractional value it gives at a hard edge rather than the round number you might guess.
goal: Build the 3x3 box blur kernel (nine equal weights) and confirm the exact value it produces at the centre of a hard edge.
spec:
  scenario: Box blur across a vertical edge
  status: failing
  lines:
    - kw: Given
      text: 'a 5 by 5 image whose left three columns are all 10 and whose right two columns are all 200'
    - kw: And
      text: 'a 3x3 box blur kernel whose nine entries are all 1/9'
    - kw: When
      text: 'the kernel is convolved across the image with zero-padding to the same size, as in lesson 7'
    - kw: Then
      text: 'the pixel at column 2, row 2 (the centre, on the 10 side of the edge) blurs to exactly 660/9, which is 73.333... - not the rounded 70 that six 10s and three 200s might suggest'
    - kw: And
      text: 'the corner pixel at column 0, row 0 blurs to exactly 40/9, which is 4.444... - the zero-padded neighbours pull it well below even the surrounding 10s'
code:
  lang: go
  source: |
    // each of the nine entries weights its neighbor equally
    func BoxBlurKernel() [3][3]float64 {
      return [3][3]float64{
        {1.0 / 9, 1.0 / 9, 1.0 / 9},
        {1.0 / 9, 1.0 / 9, 1.0 / 9},
        {1.0 / 9, 1.0 / 9, 1.0 / 9},
      }
    }
checkpoint: You have built the first real filter, a blur, and confirmed the exact fractional value the arithmetic gives at a hard edge rather than the value eyeballing it would suggest. Commit and stop for today.
---

Box blur replaces lesson 6's differencing kernel with the simplest possible averaging one: nine equal weights that sum to 1, so the output stays in the same brightness range as the input. Convolve it with the zero-padded, same-size convolution from lesson 7 and every pixel becomes the plain average of its neighbourhood.

Watch the centre pixel of today's edge image closely. Six of its nine neighbours are 10 and three are 200, so `(10*6 + 200*3) / 9` is the value to compute exactly - `660/9`, which is `73.333...`, not a round `70`. Averages of small integer counts rarely land on whole numbers, and a filter that silently rounds or truncates there is already lying to you about what it computed.
