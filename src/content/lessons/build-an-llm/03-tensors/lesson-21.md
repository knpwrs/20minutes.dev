---
project: build-an-llm
lesson: 21
title: Matrix multiply
overview: 'Matrix multiply is the one tensor operation every later layer depends on - each output cell is a dot product between a row of one tensor and a column of the other.'
goal: Build matrix multiply for an m by k tensor against a k by n tensor, producing an m by n result.
spec:
  scenario: Multiplying a 2x3 tensor by a 3x2 tensor
  status: failing
  lines:
    - kw: Given
      text: 'a is 2 by 3, [[1, 2, 3], [4, 5, 6]], and b is 3 by 2, [[7, 8], [9, 10], [11, 12]]'
    - kw: When
      text: a is multiplied by b
    - kw: Then
      text: 'the result is 2 by 2: [[58, 64], [139, 154]]'
code:
  lang: go
  source: |
    // out[i][j] is the dot product of a's row i and b's column j -
    // a's column count must match b's row count
    func MatMul(a, b *Tensor) *Tensor {
      out := NewTensor(a.Rows(), b.Cols())
      for i := 0; i < a.Rows(); i++ {
        for j := 0; j < b.Cols(); j++ {
          // accumulate sum of a.Data[i][p] * b.Data[p][j] over p here
        }
      }
      return out
    }
checkpoint: You can multiply two tensors as matrices - the dot-product-per-cell operation that every projection and linear layer from here on is built from. Commit and stop for today.
---

**Matrix multiply** answers a different question from lesson 20's elementwise multiply: instead of pairing up matching cells, each cell of the result is a dot product - the sum of pairwise products - between an entire row of the first tensor and an entire column of the second. That is why the shapes have to agree in a specific way: the first tensor's column count must equal the second tensor's row count, since that shared length is exactly how many terms go into each dot product.

Build it as three nested loops: one over the result's rows, one over its columns, and an inner one accumulating the dot product itself with `Add` and `Mul` - the same two operations you have had since chapter 1, just run `k` times per output cell instead of once. This is the operation every projection in the next chapter and every linear layer in this one leans on, so it is worth tracing today's `58` and `64` by hand against the row and column they came from.
