---
project: build-a-sudoku-solver
lesson: 18
title: Detecting a contradiction
overview: Elimination can strip a cell of every candidate - which means the current grid cannot be completed. Today you make propagation report that contradiction, the signal the search will use to abandon a bad guess.
goal: Report a contradiction when any cell is left with zero candidates.
spec:
  scenario: A cell with no candidates is a dead end
  status: failing
  lines:
    - kw: Given
      text: 'the grid ".123456789" followed by 71 dots, where row 0 holds 1 through 8 across cells 1 to 8 and cell 9 holds 9, so cell 0 has no possible digit'
    - kw: When
      text: 'the candidate grid is built and checked for a contradiction'
    - kw: Then
      text: 'cell 0 has zero candidates, so the grid has a contradiction (no solution)'
    - kw: And
      text: 'the contradiction survives a naked-single pass, while a normal solvable grid has no contradiction'
code:
  lang: go
  source: |
    // any empty candidate set means this grid cannot be completed
    func HasContradiction(cg [81]Set) bool {
      for i := 0; i < 81; i++ { if cg[i].Size() == 0 { return true } }
      return false
    }
    // the fixpoint step in the next lesson will bail out the moment this is true
checkpoint: Propagation reports a contradiction when a cell runs out of candidates. Commit and stop here.
---

Propagation removes candidates, and sometimes it removes the last one: a cell ends
up able to hold **no digit at all**. That empty set is a **contradiction** - proof
that the grid, as currently filled, can never be completed. Detecting it is a scan
for any zero-size candidate set, and the important part is having it as a primitive
the fixpoint step can consult: the moment a cell empties, deduction must stop and
report that this grid has no solution.

This is the third leg of propagation, and it is what makes propagation safe to use
inside search. When the solver guesses a digit and propagates, a contradiction is
the clean, early signal that the guess was wrong - so it can backtrack immediately
instead of blundering deeper. The crafted grid here pins the edge exactly: eight
digits fill row 0 and the ninth sits just below cell 0, leaving that cell with an
empty candidate set and propagation with no choice but to declare no solution.
