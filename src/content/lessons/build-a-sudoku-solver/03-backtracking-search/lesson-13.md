---
project: build-a-sudoku-solver
lesson: 13
title: The most-constrained cell
overview: Backtracking on the first blank is correct but can crawl on hard puzzles. Today you switch to picking the cell with the fewest candidates - the MRV heuristic - which turns a solver that stalls on the hardest puzzles into one that finishes them in a blink.
goal: Choose the empty cell with the fewest candidates and branch there instead of the first blank.
spec:
  scenario: Search branches on the most-constrained cell
  status: failing
  lines:
    - kw: Given
      text: 'the grid parsed from "003020600900305001001806400008102900700000008006708200002609500800203009005010300"'
    - kw: When
      text: 'the most-constrained empty cell is chosen'
    - kw: Then
      text: 'it is cell 41 (only one candidate), not cell 0 (the first blank, which has two)'
    - kw: And
      text: 'the MRV solver solves the hard puzzle "800000000003600000070090200050007000000045700000100030001000068008500010090000400" to "812753649943682175675491283154237896369845721287169534521974368438526917796318452"'
code:
  lang: go
  source: |
    // among blanks, the one with the smallest candidate set (ties: lowest index)
    func MostConstrained(g [81]int) int {
      best, bestN := -1, 10
      for i := 0; i < 81; i++ {
        if g[i] != 0 { continue }
        if n := Candidates(g, i).Size(); n < bestN { best, bestN = i, n }
      }
      return best
    }
    // the solver is unchanged except it branches on MostConstrained, not FirstEmpty
checkpoint: The solver branches on the fewest-candidate cell and handles hard puzzles fast. Commit and stop here.
---

The backtracking search wastes effort when it branches on a cell with many options:
each guess spawns many subtrees, most of them doomed. The classic fix is the
**minimum-remaining-values** heuristic, or MRV: always branch on the empty cell with
the *fewest* candidates. A cell with one candidate is forced (no guessing at all); a
cell with two splits the search only two ways. Choosing the tightest cell keeps the
branching factor as small as the puzzle allows.

The change to the solver is one line - branch on `MostConstrained` instead of
`FirstEmpty`, breaking ties by lowest index to stay deterministic - but its effect is
dramatic. The plain solver could grind for a very long time on a puzzle like the
21-clue "hardest" one; with MRV the same search settles it almost instantly, because
it always attacks the puzzle where it is most pinned down. Same algorithm, same
exact answers, a night-and-day difference in speed.
