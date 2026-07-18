---
project: build-an-llm
lesson: 35
title: Concatenating heads and the output projection
overview: 'Two heads'' outputs are placed side by side into one wider row, then passed through one more linear layer that mixes them back down to the model width.'
goal: Concatenate the two heads' outputs column-wise, then project the result through an output linear layer.
spec:
  scenario: Combining two heads into one multi-head attention output
  status: failing
  lines:
    - kw: Given
      text: 'head 0''s output and head 1''s output (3x4 each) from lesson 34, and an output linear layer, Wo, an 8x8 weight matrix (formula (((row*7 + col*11 + seed*13) mod 5) - 2) * 0.1, seed 40) with zero bias'
    - kw: When
      text: 'the two heads'' outputs are placed side by side into one 3x8 tensor, column 0-3 from head 0 and column 4-7 from head 1, then that tensor is projected through Wo'
    - kw: Then
      text: 'the concatenated tensor''s row 0 is [-0.045, -0.095, 0.1, 0.015, -0.095, 0.1, 0.015, 0.035]'
    - kw: And
      text: 'the final multi-head attention output (3x8) is [[0.005, -0.0595, -0.009, 0.034, 0.0295, 0.005, -0.0595, -0.009], [0.01013, -0.005944, 0.017097, 0.006525, -0.027808, 0.01013, -0.005944, 0.017097], [0.005704, -0.002834, 0.010197, 0.001565, -0.014631, 0.005704, -0.002834, 0.010197]]'
code:
  lang: go
  source: |
    // side by side, not summed - head 0's columns come first, head
    // 1's columns follow, widening back to DModel columns total
    func ConcatCols(tensors ...*Tensor) *Tensor {
      out := NewTensor(tensors[0].Rows(), 0 /* sum of each Cols() */)
      // copy each tensor's columns into out at an increasing offset
      return out
    }
checkpoint: Two heads' outputs are now combined into one attention output, the same width as the original input. Commit and stop for today.
---

Each head from lesson 34 produced a `(3x4)` tensor - narrower than the original `8`-wide input, since `HeadSize` is `DModel` split across `NumHeads`. **Concatenation** widens things back out: place head 0's four columns and head 1's four columns side by side, in order, giving one `(3x8)` tensor that carries both heads' information in the same row.

That concatenated tensor is not yet the layer's output, though - one more linear layer, `Wo`, mixes the two heads' columns together rather than leaving them sitting in separate blocks, and brings the result back to exactly the model's width. This is the same `Linear` you have had since chapter 3, nothing new about the arithmetic, just the last step needed to call this whole thing "multi-head attention."
