---
project: build-a-sudoku-solver
lesson: 26
title: Rating difficulty
overview: A simple, honest difficulty measure falls right out of what you built - does the puzzle yield to pure deduction, or does it need a guess? Today you rate a puzzle Easy or Hard on exactly that line, closing the chapter.
goal: Rate a puzzle Easy if propagation alone solves it, Hard if it needs search.
spec:
  scenario: Difficulty splits on whether search is needed
  status: failing
  lines:
    - kw: Given
      text: 'a puzzle and its candidate grid'
    - kw: When
      text: 'propagation is run to a fixpoint and you check whether it solved the grid on its own'
    - kw: Then
      text: 'the classic puzzle "003020600900305001001806400008102900700000008006708200002609500800203009005010300" rates Easy (propagation solves it)'
    - kw: And
      text: 'the 21-clue "800000000003600000070090200050007000000045700000100030001000068008500010090000400" rates Hard (propagation stalls and search is required)'
code:
  lang: go
  source: |
    // Easy if pure propagation finishes the grid; Hard if it needs a guess
    func Difficulty(g [81]int) string {
      cg, ok := Propagate(CandidateGrid(g))
      if ok && allSingles(cg) { return "Easy" }
      return "Hard"
    }
checkpoint: You can rate a puzzle Easy or Hard by whether deduction alone solves it. Commit and stop here.
---

The two engines you built - deduction and search - draw a natural, meaningful line
through the space of puzzles. If naked and hidden singles propagate all the way to a
full grid, the puzzle needed **no guessing** at all: call it **Easy**. If
propagation stalls with cells still undecided, so the full solver had to branch and
search, it needed at least one guess: call it **Hard**. It is a coarse rating, but a
true one, measured by your own solver's behaviour rather than a made-up score.

This mirrors how human-oriented graders work - they rank a puzzle by the hardest
technique it forces you to use - only here the "techniques" are the two rules you
implemented. Richer graders add more rules (naked pairs, box-line reduction, and so
on) to spread puzzles across more bands, which is a natural extension. For now, Easy
versus Hard captures the essential split, and it completes the toolkit: solve, count,
generate, and rate. The capstone puts all of it to work at once.
