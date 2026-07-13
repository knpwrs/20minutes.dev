---
project: build-a-sudoku-solver
lesson: 12
title: The backtracking solver
overview: With cells, candidates, and placement in hand, you can write a correct solver. Today you assemble them into recursive backtracking search - the walking skeleton that already solves real puzzles.
goal: Solve a puzzle by trying each candidate in the first blank and recursing, backtracking on failure.
spec:
  scenario: Backtracking search solves a puzzle
  status: failing
  lines:
    - kw: Given
      text: 'the grid parsed from "003020600900305001001806400008102900700000008006708200002609500800203009005010300"'
    - kw: When
      text: 'the backtracking solver runs'
    - kw: Then
      text: 'it succeeds and the solution is "483921657967345821251876493548132976729564138136798245372689514814253769695417382"'
    - kw: And
      text: 'an already-solved grid returns itself unchanged, and the unsolvable grid ".123456789" followed by 71 dots fails (no solution)'
code:
  lang: go
  source: |
    // pick the first blank; try its candidates in order; recurse; backtrack
    func SolveBasic(g [81]int) ([81]int, bool) {
      cell := FirstEmpty(g)
      if cell == -1 { return g, true } // no blanks: solved
      for _, d := range Candidates(g, cell).Members() { // ascending
        if sol, ok := SolveBasic(Assign(g, cell, d)); ok { return sol, true }
      }
      return g, false // every candidate failed: dead end
    }
checkpoint: You have a correct solver. Commit and stop here.
---

This is the payoff of the chapter: a **complete, correct** Sudoku solver in a few
lines. Find the first blank; if there is none the grid is solved. Otherwise try each
of that cell's candidates in ascending order, place it, and recurse. If a branch
comes back successful you are done; if every candidate fails you return failure and
let the caller try its next digit. That unwinding is the **backtrack** - the search
abandons a doomed branch and retreats to the last open choice.

Trying candidates in a fixed order keeps the result deterministic, so a puzzle has
one exact solution string you can pin. Two edges prove the recursion's base cases:
a grid with no blanks is returned unchanged (already solved), and a grid where some
blank has no candidates at all - like a cell boxed in by the digits 1 through 9 -
dead-ends immediately with no solution. This solver is correct on every valid
puzzle; it is only *slow* on the hard ones, which is exactly what the next lesson
fixes.
