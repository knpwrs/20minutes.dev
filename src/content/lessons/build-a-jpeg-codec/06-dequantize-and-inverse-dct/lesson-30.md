---
project: build-a-jpeg-codec
lesson: 30
title: Dequantize and un-zig-zag
overview: The decoded coefficients are still quantized and still in zig-zag order. Today you multiply them by their quantization table and scatter them into an 8-by-8 grid, undoing both at once.
goal: Multiply each zig-zag coefficient by its quantization value and place the result into an 8-by-8 grid in natural order.
spec:
  scenario: Dequantizing and reordering a block
  status: failing
  lines:
    - kw: Given
      text: 'a zig-zag coefficient block whose entry 0 is 3 and entry 1 is 3, and a zig-zag quant table whose entry 0 is 16 and entry 1 is 11'
    - kw: When
      text: the block is dequantized and un-zig-zagged
    - kw: Then
      text: 'natural grid index 0 (row 0, col 0) is 48, the product 3 times 16'
    - kw: And
      text: 'natural grid index 1 (row 0, col 1) is 33, the product 3 times 11, since zig-zag position 1 maps to natural index 1'
code:
  lang: go
  source: |
    // both arrays are in zig-zag order; multiply elementwise, then scatter:
    //   grid[ZigZag[k]] = coef[k] * quant[k]
    func dequantize(coef [64]int, quant QuantTable) (grid [64]int) { }
checkpoint: You can dequantize a block into a natural-order grid. Commit and stop here.
---

The entropy decoder handed you coefficients that are both **quantized** (divided down by the encoder) and in **zig-zag** order. Undoing quantization is a plain elementwise multiply: coefficient `k` times quant-table entry `k`, both indexed in the same zig-zag sequence. The result is the reconstructed frequency coefficient - approximately, since quantization threw away the remainder, which is exactly where JPEG's loss lives.

Because the quantization table is stored in zig-zag order too, you multiply in zig-zag space and then use the same `ZigZag` map from the tables chapter to scatter each product into its **natural** grid position. So zig-zag entry 0 (the DC, `3 * 16 = 48`) lands at grid index 0, and zig-zag entry 1 (`3 * 11 = 33`) lands at grid index 1. Doing both steps in one pass keeps the code tight and leaves you with a natural-order 8-by-8 grid of frequency coefficients - exactly what the inverse DCT expects as input.
