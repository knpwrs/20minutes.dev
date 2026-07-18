---
project: build-an-llm
lesson: 19
title: 'A tensor: rows, cols, Values inside'
overview: 'A tensor here is nothing new - it is a 2D grid of the very same Value from chapter 1, with a row count and a column count wrapped around it.'
goal: Define a Tensor type as a 2D grid of Values, and build one from literal rows whose shape and cells can be read back.
spec:
  scenario: Building a tensor from literal rows
  status: failing
  lines:
    - kw: Given
      text: 'a tensor built from the rows [1, 2, 3] and [4, 5, 6]'
    - kw: When
      text: its shape and a cell are read
    - kw: Then
      text: 'it has 2 rows and 3 columns'
    - kw: And
      text: 'the value at row 1, column 2 is 6'
code:
  lang: go
  source: |
    // one Value per cell - no second engine, just chapter 1's Value in a grid
    type Tensor struct {
      Data [][]*Value
    }
    func (t *Tensor) Rows() int { return len(t.Data) }
    func (t *Tensor) Cols() int { return len(t.Data[0]) }
checkpoint: You have the tensor type every remaining lesson in this project operates on - a grid of the same Value chapter 1 built. Commit and stop for today.
---

A **tensor**, in this project, is not a new kind of number - it is a rectangular grid of the exact `Value` type chapter 1 built, one per cell. Nothing about `Data`, `Grad`, `children`, `op` or the backward closure changes; a tensor is bookkeeping wrapped around the same scalars, tracking how many rows and columns are arranged and giving you a way to address any one of them by position.

That choice - no second engine, no library, just a grid of the same `Value` - is what keeps every later chapter's arithmetic exact and differentiable for free. Row `1`, column `2` of today's tensor is `6`, the same `Value` you would get by hand-adding `Add` and `Mul` calls one at a time; a tensor operation from here on is simply a loop that runs chapter 1's arithmetic once per cell, or once per row, instead of once.
