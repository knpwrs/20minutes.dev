---
project: build-a-sudoku-solver
lesson: 14
title: A complete, valid solution
overview: A solver's answer is only trustworthy if it is both full and legal. Today you add the completeness check and use it with validity to confirm a solved grid really is a solution, closing the search chapter.
goal: Report whether a grid is completely filled, and confirm a solved grid is both complete and valid.
spec:
  scenario: A solution is complete and valid
  status: failing
  lines:
    - kw: Given
      text: 'the grid parsed from "003020600900305001001806400008102900700000008006708200002609500800203009005010300"'
    - kw: When
      text: 'the solver runs and its result is checked'
    - kw: Then
      text: 'the result is complete (no blanks) and valid (no unit repeats a digit)'
    - kw: And
      text: 'the original puzzle is not complete, and the empty grid solved is also both complete and valid'
code:
  lang: go
  source: |
    // complete = every cell filled; a solution must be complete AND valid
    func IsComplete(g [81]int) bool {
      for i := 0; i < 81; i++ { if g[i] == 0 { return false } }
      return true
    }
    // a true solution: IsComplete(sol) && IsValid(sol)
checkpoint: You can confirm a solved grid is a genuine solution. The search chapter is complete; commit and stop here.
---

A grid is a real **solution** only when it is both **complete** - no blanks left -
and **valid** - no unit repeats a digit. You already have validity; completeness is
its easy partner, a scan for any remaining `0`. Together they are the definition of
"solved", and checking them on the solver's output is how you trust the answer
rather than assuming the search got it right.

This pairing is also a quiet contract for everything ahead. The solver will only
ever return a complete, valid grid or an honest failure; the uniqueness counter will
lean on the same notion of a finished grid; and the generator will use validity and
completeness to know when a puzzle has exactly one way to be filled. With a correct,
fast, self-checking solver in hand, the next chapter makes it dramatically smarter -
solving much of a puzzle by pure deduction before it ever needs to guess.
