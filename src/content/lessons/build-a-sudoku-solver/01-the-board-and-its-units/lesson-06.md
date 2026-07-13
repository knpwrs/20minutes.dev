---
project: build-a-sudoku-solver
lesson: 6
title: Checking validity
overview: Before solving anything, you need to know whether a grid even obeys the rules. Today you write the validity check - no digit repeated in any unit - closing the board chapter with something you can run on a real puzzle.
goal: Report whether a grid has any duplicate digit within a row, column, or box.
spec:
  scenario: Duplicates within a unit are rejected
  status: failing
  lines:
    - kw: Given
      text: 'the grid parsed from the classic puzzle "003020600900305001001806400008102900700000008006708200002609500800203009005010300"'
    - kw: When
      text: 'its validity is checked'
    - kw: Then
      text: 'it is valid (no unit repeats a digit), and an empty grid is valid too'
    - kw: And
      text: 'placing a second 5 in row 0, or a second 5 in the same box, makes the grid invalid'
code:
  lang: go
  source: |
    // for each unit, no non-zero digit may appear twice
    func IsValid(g [81]int) bool {
      for _, u := range Units() {
        seen := map[int]bool{}
        for _, c := range u {
          v := g[c]
          if v == 0 { continue }      // blanks never conflict
          if seen[v] { return false } // repeat inside this unit
          seen[v] = true
        }
      }
      return true
    }
checkpoint: You can tell whether a grid obeys the rules. The board chapter is complete; commit and stop here.
---

**Validity** is the one hard rule of Sudoku expressed directly: within each of the
27 units, no digit may appear more than once. Blanks are skipped - a `0` is not yet
a commitment, so it can never clash. A grid passes only if every unit is
clash-free, which is exactly what looping over the units and watching for a repeated
digit checks. Note that "valid" is weaker than "solvable": an empty grid is
perfectly valid, and so is a partly-filled one that happens to have no solution, as
long as nothing repeats yet.

This is the first genuinely useful thing the library does with the units and the
board together, and it closes the opening chapter. You can now load a puzzle and
confirm it is well-formed before spending any effort trying to solve it - and every
step the solver takes will keep this invariant true.
