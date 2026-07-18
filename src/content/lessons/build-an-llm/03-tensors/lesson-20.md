---
project: build-an-llm
lesson: 20
title: Elementwise ops on tensors
overview: 'Two same-shaped tensors combine one cell at a time - addition and multiplication both need nothing but that shared shape and the Values already sitting in each cell.'
goal: Build elementwise Add and Mul for two same-shaped tensors, computing each output cell with chapter 1's Value operations.
spec:
  scenario: Elementwise addition and multiplication
  status: failing
  lines:
    - kw: Given
      text: 'two 2 by 2 tensors, a=[[1, 2], [3, 4]] and b=[[10, 20], [30, 40]]'
    - kw: When
      text: they are combined elementwise
    - kw: Then
      text: 'a+b is [[11, 22], [33, 44]]'
    - kw: And
      text: 'a*b is [[10, 40], [90, 160]]'
code:
  lang: go
  source: |
    // same shape in, same shape out - each cell is just chapter 1's Add
    // or Mul applied to the two Values sitting at that position
    func ElementwiseAdd(a, b *Tensor) *Tensor {
      out := NewTensor(a.Rows(), a.Cols())
      for i := 0; i < a.Rows(); i++ {
        for j := 0; j < a.Cols(); j++ {
          out.Data[i][j] = Add(a.Data[i][j], b.Data[i][j])
        }
      }
      return out
    }
checkpoint: Two tensors can now be combined elementwise, cell by cell, using the exact same Add and Mul from chapter 1. Commit and stop for today.
---

An **elementwise** operation asks nothing of two tensors beyond matching shape: the value at row `i`, column `j` of the result comes only from the values at row `i`, column `j` of each input, never from any other cell. That restriction is what makes it the simplest tensor operation to build - a nested loop over every position, calling chapter 1's `Add` or `Mul` once per cell, with no new arithmetic to invent.

Multiplication here is worth naming carefully: `a*b` in today's spec multiplies each cell by its matching cell in the other tensor, not the row-by-column dot products of matrix multiplication - that is a different, larger idea coming next lesson. Keep the two straight, because both are called "multiply" and both matter to this project, but they answer very different questions about what one tensor times another means.
