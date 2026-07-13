---
project: build-a-sudoku-solver
lesson: 8
title: Candidates for a cell
overview: A blank cell can hold any digit its peers have not already used. Today you compute that candidate set for a single cell, the primitive both the solver and propagation are built from.
goal: Compute the digits a cell could legally hold, given its peers' values.
spec:
  scenario: A cell's candidates are the digits its peers leave open
  status: failing
  lines:
    - kw: Given
      text: 'the grid parsed from "003020600900305001001806400008102900700000008006708200002609500800203009005010300"'
    - kw: When
      text: 'the candidates of the blank cells are computed'
    - kw: Then
      text: 'cell 0 has candidates {4 5}, cell 1 has {4 5 7 8}, and cell 41 has just {4}'
    - kw: And
      text: 'a filled cell reports a single candidate equal to its own value (cell 2, a given 3, has {3})'
code:
  lang: go
  source: |
    // blank: Full minus every digit a peer already uses; filled: just its value
    func Candidates(g [81]int, cell int) Set {
      if g[cell] != 0 { return singleton(g[cell]) }
      s := Full
      for _, p := range Peers(cell) {
        if g[p] != 0 { s = s.Remove(g[p]) }
      }
      return s
    }
checkpoint: Each cell reports the digits it could legally hold. Commit and stop here.
---

The most basic deduction in Sudoku is: a blank cell can hold any digit that none of
its 20 peers already uses. Starting from the full set of 1 through 9 and removing
each peer's value leaves exactly the **candidates** for that cell. This one function
is the engine of everything that follows - the solver will try a cell's candidates,
and propagation will watch these sets shrink.

Treat a filled cell as a cell whose candidate set is just its own value; that makes
the whole grid uniform - every cell has a candidate set, of size 1 if it is already
decided. Notice the edge the classic puzzle hands you: cell 41's peers already use
eight distinct digits, so only `{4}` remains. A blank with a single candidate is a
**forced** cell, and spotting those is the first thing the solver will exploit.
