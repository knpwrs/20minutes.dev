---
project: build-a-jpeg-codec
lesson: 42
title: The forward 2D DCT
overview: Composing the 1D forward transform along rows then columns gives the full block transform. Today you build the separable 2D forward DCT the encoder runs on every block.
goal: Implement the 8-by-8 forward DCT by applying the 1D forward transform along rows and then columns.
spec:
  scenario: The separable 2D forward DCT
  status: failing
  lines:
    - kw: Given
      text: 'an 8-by-8 block where every sample equals 64'
    - kw: When
      text: the 2D forward DCT is applied
    - kw: Then
      text: 'the DC coefficient (row 0, col 0) is 512.0 (that is 8 times 64) and every AC coefficient is 0.0'
    - kw: And
      text: 'this DC of 512 is exactly what the decoder''s inverse DCT turns back into a flat block of 64, confirming the two transforms are inverses'
code:
  lang: go
  source: |
    // separable: fdct1D along each row, then fdct1D along each column.
    func fdct2D(block [64]float64) (coef [64]float64) { }
checkpoint: You can run a full 8-by-8 forward DCT. Commit and stop here.
---

Like its inverse, the forward 2D DCT is **separable**: run the 1D forward transform on each row, then on each column of the result. A flat block of value 64 puts all its energy in the DC coefficient, `8 * 64 = 512`, with every AC coefficient zero - the two-dimensional version of the flat-to-DC property, and the mirror image of the decoder's DC-only block that decoded to a flat 64.

That symmetry is the whole point: this `512` is exactly the coefficient the decoder's inverse DCT consumed to produce a flat block of 64 back in the inverse-DCT lesson. Forward and inverse are true inverses (up to floating-point rounding), so an encode followed by a decode reconstructs the samples - the loss in JPEG comes not from the transform but from the quantization step that sits between them, which is the next lesson. With the forward transform in hand, every block can be turned into a coefficient grid ready to quantize.
