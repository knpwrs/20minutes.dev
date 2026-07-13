---
project: build-a-sudoku-solver
lesson: 10
title: Finding an empty cell
overview: A backtracking solver works by picking an unfilled cell and trying digits in it. Today you write the routine that finds the next blank - and reports when there are none, which is how the solver will know it is done.
goal: Return the index of the first blank cell, or a sentinel when the grid is full.
spec:
  scenario: The first blank cell, or none
  status: failing
  lines:
    - kw: Given
      text: 'the grid parsed from "003020600900305001001806400008102900700000008006708200002609500800203009005010300"'
    - kw: When
      text: 'the first empty cell is requested'
    - kw: Then
      text: 'it is cell 0'
    - kw: And
      text: 'a grid with no blanks returns -1, and a grid whose first blank is at cell 5 returns 5'
code:
  lang: go
  source: |
    // lowest-indexed blank, or -1 if the grid is completely filled
    func FirstEmpty(g [81]int) int {
      for i := 0; i < 81; i++ {
        if g[i] == 0 { return i }
      }
      return -1
    }
checkpoint: You can find the next blank, and detect a full grid. Commit and stop here.
---

Backtracking search fills a puzzle one blank at a time, so its first question each
step is "which cell do I work on next?" The simplest honest answer is the
**lowest-indexed blank** - scan cells 0 to 80 and return the first `0`. Fixing a
single, deterministic choice of cell is what makes the whole solver reproducible:
given the same grid it always explores in the same order, so every solution you
assert against is exact.

The sentinel matters as much as the cell. When the scan finds no blank at all, the
grid is completely filled, and returning `-1` is how the recursion will recognise
that it has reached a solution and should stop. A tiny routine, but it is both the
"pick a cell" and the "am I done?" half of the search you write next.
