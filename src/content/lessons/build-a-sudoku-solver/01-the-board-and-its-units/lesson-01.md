---
project: build-a-sudoku-solver
lesson: 1
title: Indexing a cell
overview: A Sudoku board is a 9x9 grid, but the whole solver is easier to write over a flat run of 81 cells numbered 0 to 80. Today you build the tiny conversion between a (row, column) pair and that flat index, the coordinate system every later lesson stands on.
goal: Convert between a (row, column) pair and a single 0-to-80 cell index.
spec:
  scenario: Row and column map to a flat index and back
  status: failing
  lines:
    - kw: Given
      text: 'a 9x9 board flattened to cells 0 through 80, row-major'
    - kw: When
      text: 'the index of row 4, column 5 is computed'
    - kw: Then
      text: 'it is 41'
    - kw: And
      text: 'index 41 has row 4 and column 5, index 0 is row 0 column 0, and row 8 column 8 is index 80'
code:
  lang: go
  source: |
    // row-major: walk 9 cells per row, then across the row
    func Index(row, col int) int { return row*9 + col }
    func RowOf(i int) int        { return i / 9 }
    func ColOf(i int) int        { return i % 9 }
checkpoint: You can move between (row, column) and a flat 0-to-80 cell index. Commit and stop here.
---

Every rule in Sudoku is about the same 81 squares, so before anything else we fix
how to name a square. A 9x9 board has natural **(row, column)** coordinates, but a
flat array of 81 cells is far easier to loop over, copy, and compare than a nested
one. The bridge between the two is plain arithmetic: **row-major** order lays row 0
first (cells 0 to 8), then row 1 (cells 9 to 17), and so on, so a cell's index is
`row*9 + col`, and you recover the coordinates with integer division and remainder.

This is deliberately tiny, but it is the coordinate system the entire solver is
written in. Rows, columns, boxes, peers, candidates, and every printed grid all
index into this same 0-to-80 space, so getting the mapping exactly right - and
noticing that column 8 of row 4 is `4*9 + 5 = 41`, not 45 - is where it all starts.
