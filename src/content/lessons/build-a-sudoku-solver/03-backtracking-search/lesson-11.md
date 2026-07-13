---
project: build-a-sudoku-solver
lesson: 11
title: Placing a value
overview: Search tries a digit in a cell, and if it leads nowhere it must undo the move cleanly. Today you write placement as a copy that returns a new grid, so trying a value never corrupts the grid you might need to fall back to.
goal: Return a new grid with one cell set to a digit, leaving the original unchanged.
spec:
  scenario: Placing a digit produces a fresh grid
  status: failing
  lines:
    - kw: Given
      text: 'the grid parsed from "003020600900305001001806400008102900700000008006708200002609500800203009005010300", whose cell 0 is blank'
    - kw: When
      text: 'the digit 4 is placed in cell 0'
    - kw: Then
      text: 'the returned grid has cell 0 equal to 4'
    - kw: And
      text: 'the original grid still has cell 0 equal to 0 (placement did not mutate it)'
    - kw: And
      text: 'placing 4 and placing 5 into cell 0 of the same original grid gives two independent grids (one has 4, the other 5), so trying one candidate never disturbs another'
code:
  lang: go
  source: |
    // return a copy with one cell changed; the input is untouched
    func Assign(g [81]int, cell, d int) [81]int {
      g[cell] = d // g is a value copy of the caller's array
      return g
    }
    // in languages where arrays are references, copy first, then set
checkpoint: Placing a value yields a new grid and leaves the original intact. Commit and stop here.
---

Backtracking is trial and error: place a digit, recurse, and if that branch fails,
try the next digit as if the placement never happened. The cleanest way to get that
"as if it never happened" is to make placement **non-destructive** - return a new
grid with the one cell changed, and leave the caller's grid exactly as it was. Then
undoing a move is free: you simply keep using the grid you already had.

In a language where a fixed-size array is copied on assignment this is almost
automatic; in one where arrays are shared references you must copy first and then
set the cell. Either way the guarantee is the same and worth testing directly: after
placing 4 in cell 0, the returned grid shows the 4 while the original still shows a
blank. That immutability is what keeps the recursive search you write next from
tripping over its own tracks.
