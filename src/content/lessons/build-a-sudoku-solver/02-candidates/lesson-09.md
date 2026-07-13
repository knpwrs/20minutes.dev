---
project: build-a-sudoku-solver
lesson: 9
title: The candidate grid
overview: Computing candidates one cell at a time is fine for the solver, but propagation needs them all at once - a candidate set for every cell. Today you build that candidate grid and use it to spot the puzzle's already-forced cells.
goal: Build a candidate set for all 81 cells, and identify the cells already forced to one digit.
spec:
  scenario: The whole board's candidates in one structure
  status: failing
  lines:
    - kw: Given
      text: 'the grid parsed from "003020600900305001001806400008102900700000008006708200002609500800203009005010300"'
    - kw: When
      text: 'the candidate grid (a candidate set for every cell) is built'
    - kw: Then
      text: 'cell 0 holds {4 5}, the given cell 2 holds {3}, and cell 41 holds {4}'
    - kw: And
      text: 'counting the cells whose candidate set has size 1 gives 35 (the 32 givens plus 3 already-forced blanks)'
code:
  lang: go
  source: |
    // candidates for every cell, indexed the same 0..80 way
    func CandidateGrid(g [81]int) [81]Set {
      var cg [81]Set
      for i := 0; i < 81; i++ { cg[i] = Candidates(g, i) }
      return cg
    }
    // a cell with Size()==1 is decided (given or forced)
checkpoint: The whole board's candidates live in one structure, and you can spot forced cells. Commit and stop here.
---

The **candidate grid** is just the per-cell candidate function applied to all 81
cells at once: an array of candidate sets, indexed the same way as the board. It is
the state that constraint propagation will churn on - as digits get placed, sets in
this grid shrink, and the goal is to drive every set down to a single digit.

Building it also reveals the puzzle's free wins. A cell whose set already has size 1
is **decided**: either a given clue, or a blank so hemmed in by peers that only one
digit fits. In the classic puzzle that is 35 cells - the 32 clues plus 3 blanks
(such as cell 41) that were forced from the start. Those forced blanks are the seeds
the naked-single rule will grow from in the propagation chapter.
