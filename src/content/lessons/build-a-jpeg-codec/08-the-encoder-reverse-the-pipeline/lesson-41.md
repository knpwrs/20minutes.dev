---
project: build-a-jpeg-codec
lesson: 41
title: The forward 1D DCT
overview: The forward DCT turns spatial samples into frequency coefficients. Today you build the 8-point 1D forward transform, the mirror of the inverse you wrote for the decoder.
goal: Implement the 8-point 1D forward DCT and verify it on a flat input and a spatial impulse.
spec:
  scenario: The one-dimensional forward DCT
  status: failing
  lines:
    - kw: Given
      text: 'the 8-point forward DCT of a flat input where every sample is 1'
    - kw: When
      text: the transform is applied
    - kw: Then
      text: 'coefficient 0 is 2.8284 (that is 8 divided by 2 times the square root of 2) and every other coefficient is 0.0, to 4 decimal places'
    - kw: And
      text: 'for a spatial impulse (sample 0 is 8, the rest 0), coefficient 0 is 2.8284 and coefficient 1 is 3.9231, to 4 decimal places'
code:
  lang: go
  source: |
    // F(u) = (1/2) * C(u) * sum over x of f(x) * cos((2x+1)*u*pi/16)
    //   C(0)=1/sqrt(2), C(u)=1 otherwise.
    func fdct1D(f [8]float64) (F [8]float64) { }
checkpoint: You can run an 8-point 1D forward DCT. Commit and stop here.
---

The forward DCT is the analysis transform: `F(u) = (1/2) C(u) sum_x f(x) cos((2x+1) u pi / 16)`, using the same `C(u)` normalization as the inverse. A **flat** input concentrates all its energy in the DC coefficient - `F(0) = 8 * value / (2 sqrt 2)` and every AC coefficient is zero - because a constant signal has no oscillation for the higher cosines to pick up. That is the defining property of the DCT and the reason quantization can be so aggressive: real image blocks are mostly low-frequency, so their energy piles into a few coefficients.

A spatial **impulse** (a single nonzero sample) spreads its energy across all frequencies, giving `F(1) = 3.9231` and so on - the transpose of the impulse response you saw in the inverse DCT, since the forward and inverse transforms are transposes of each other. Pinning the flat-to-DC and impulse cases confirms the normalization matches the decoder's, which is what makes an encode-then-decode round-trip return the original. Next you compose this into the separable 2D forward transform.
