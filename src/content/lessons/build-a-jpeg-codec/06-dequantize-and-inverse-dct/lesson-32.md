---
project: build-a-jpeg-codec
lesson: 32
title: The 2D inverse DCT
overview: The full block transform is the 1D inverse DCT applied along rows then columns. Today you compose them into the separable 2D inverse DCT that turns a coefficient grid into spatial samples.
goal: Implement the 8-by-8 inverse DCT by applying the 1D transform to every row and then every column.
spec:
  scenario: The separable 2D inverse DCT
  status: failing
  lines:
    - kw: Given
      text: 'an 8-by-8 coefficient grid with only the DC coefficient nonzero, equal to 512'
    - kw: When
      text: the 2D inverse DCT is applied
    - kw: Then
      text: 'every one of the 64 spatial samples equals 64.0 (that is 512 divided by 8), a flat block'
    - kw: And
      text: 'for a grid with only the first vertical-frequency coefficient (row 1, col 0) nonzero, each row of the output is constant across its 8 columns, and row 0 is the negation of row 7'
code:
  lang: go
  source: |
    // separable: run idct1D on each of the 8 rows, then on each of the 8
    // resulting columns. The DC-only case gives a flat block of DC/8.
    func idct2D(grid [64]float64) (out [64]float64) { }
checkpoint: You can run a full 8-by-8 inverse DCT. Commit and stop here.
---

The two-dimensional inverse DCT looks daunting as a double sum, but it is **separable**: transforming every row with the 1D inverse DCT and then transforming every column of that intermediate result gives exactly the 2D answer. This is the standard way real decoders do it, and it reuses the `idct1D` you just verified. A DC-only grid collapses cleanly - two passes each scale by `1/(2 sqrt 2)`, so a DC of 512 spreads to `512/8 = 64.0` in every sample, a perfectly flat block.

The second case pins the transform's structure without a fragile fractional value: a single **vertical**-frequency coefficient (row 1, column 0) varies only from top to bottom, so each row comes out constant across its columns, and the first harmonic's antisymmetry makes row 0 the negation of row 7. Between the flat DC response and this directional ripple, you have confirmed both passes are wired in the right order. The samples this produces are centered around zero; the next lesson shifts and clamps them into real pixel values.
