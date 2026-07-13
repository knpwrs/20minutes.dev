---
project: build-a-jpeg-codec
lesson: 31
title: The 1D inverse DCT
overview: The inverse DCT turns frequency coefficients back into spatial samples, and it factors into a one-dimensional transform applied along a line. Today you build that 8-point 1D inverse DCT.
goal: Implement the 8-point 1D inverse DCT and verify it on a DC-only input and a single-frequency input.
spec:
  scenario: The one-dimensional inverse DCT
  status: failing
  lines:
    - kw: Given
      text: 'the 8-point inverse DCT with F(0)=8 and all other inputs 0'
    - kw: When
      text: the transform is applied
    - kw: Then
      text: 'every one of the 8 outputs equals 2.8284 (that is 8 divided by 2 times the square root of 2), to 4 decimal places'
    - kw: And
      text: 'for the input F(1)=8 with all others 0, output 0 is 3.9231 and output 7 is -3.9231, to 4 decimal places'
code:
  lang: go
  source: |
    // f(x) = (1/2) * sum over u of C(u) * F(u) * cos((2x+1)*u*pi/16)
    //   where C(0) = 1/sqrt(2), C(u)=1 otherwise.
    func idct1D(F [8]float64) (f [8]float64) { }
checkpoint: You can run an 8-point 1D inverse DCT. Commit and stop here.
---

The inverse Discrete Cosine Transform reconstructs 8 spatial samples from 8 frequency coefficients: each output is a weighted sum of cosines, `f(x) = (1/2) * sum_u C(u) F(u) cos((2x+1) u pi / 16)`, where the constant `C(0)` is `1/sqrt(2)` and `C(u)` is 1 for every other `u`. A pure DC input (only `F(0)` nonzero) produces a **flat** line - every output the same value, `F(0)/(2 sqrt 2)` - which is why a block with only a DC coefficient decodes to a solid color. A single higher-frequency input produces a cosine ripple, antisymmetric about the center for the first harmonic, so output 0 and output 7 are equal and opposite.

Doing the transform in 1D is the key to keeping it simple and fast: the full 8-by-8 inverse DCT is **separable**, meaning you can run this 1D transform along every row and then along every column and get the correct 2D result. That factoring is the next lesson. Today, pin the 1D transform against the two cleanest cases - the flat DC response and a single frequency's antisymmetry - so its rounding and normalization are known-correct before you build on it.
