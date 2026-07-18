---
project: build-an-llm
lesson: 22
title: Adding a bias with broadcasting
overview: 'A bias is one row, but activations come in many - broadcasting that single row across every row of a tensor is the one new idea a linear layer still needs.'
goal: Build a function that adds a single bias row to every row of a tensor, without constructing a same-shaped bias tensor first.
spec:
  scenario: Broadcasting a bias row across a tensor
  status: failing
  lines:
    - kw: Given
      text: 'a is 2 by 2, [[1, 2], [3, 4]], and a bias row [0.5, -1.0]'
    - kw: When
      text: the bias is broadcast-added to every row of a
    - kw: Then
      text: 'the result is [[1.5, 1.0], [3.5, 3.0]]'
code:
  lang: go
  source: |
    // bias has one entry per column, reused on every row - no bias
    // tensor is ever built, just an extra index into the same slice
    func AddBiasRow(a *Tensor, bias []*Value) *Tensor {
      out := NewTensor(a.Rows(), a.Cols())
      for i := 0; i < a.Rows(); i++ {
        for j := 0; j < a.Cols(); j++ {
          out.Data[i][j] = Add(a.Data[i][j], bias[j])
        }
      }
      return out
    }
checkpoint: A single bias row can now be added across every row of a tensor of any height - the last piece a linear layer needs. Commit and stop for today.
---

A bias in a real network is one value per output feature - a single row - but the tensor it needs to be added to usually has many rows, one per example or one per position in a sequence. **Broadcasting** is the answer to that mismatch: reuse the same bias row on every row of the tensor, rather than requiring the caller to first stretch it out into a same-shaped tensor of its own.

Notice what stays constant in the loop: the row index `i` walks down the tensor as usual, but the bias is always read at column `j` alone, with no row index of its own - the same `bias[j]` value lands in every row's column `j`. That is the entire idea, and it is exactly what lesson 23's linear layer needs the moment matrix multiply produces more than one output row.
