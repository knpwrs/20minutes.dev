---
project: build-a-sudoku-solver
lesson: 15
title: Assign by elimination
overview: Norvig's key move is to treat assigning a digit as an act of elimination - fixing a cell also strikes that digit from its peers' candidates. Today you write that operation on the candidate grid, the atom all propagation is built from.
goal: Assign a digit to a cell in the candidate grid and remove it from every peer's candidates.
spec:
  scenario: Assigning a digit strikes it from the peers
  status: failing
  lines:
    - kw: Given
      text: 'the candidate grid of an empty board, where every cell holds the full set {1..9}'
    - kw: When
      text: 'the digit 5 is assigned to cell 0'
    - kw: Then
      text: 'cell 0 holds exactly {5}, and its peers cell 1 and cell 9 no longer contain 5'
    - kw: And
      text: 'a non-peer such as cell 80 still contains 5'
code:
  lang: go
  source: |
    // fix the cell to {d}, and eliminate d from all 20 peers
    // named AssignCG so it does not clash with the grid Assign from lesson 11
    func AssignCG(cg [81]Set, cell, d int) [81]Set {
      cg[cell] = SetOf(d)
      for _, p := range Peers(cell) { cg[p] = cg[p].Remove(d) }
      return cg
    }
    // work on a copy so search can try an assignment and discard it
checkpoint: Assigning a digit updates the cell and eliminates it from its peers. Commit and stop here.
---

Norvig's insight is that placing a digit and enforcing the rules are the same
action. To **assign** digit `d` to a cell, you set that cell's candidates to just
`{d}` and, crucially, **eliminate** `d` from all 20 of its peers - because none of
them may repeat it. Working on the candidate grid rather than the plain board means
this single step both records the choice and propagates its immediate consequence.

That is the whole atom of constraint propagation. On its own it just does one cell's
bookkeeping, but stacked and cascaded it will solve large parts of a puzzle without
any guessing. Keep it non-destructive - operate on a copy - so the search can assign
a digit into a trial grid, follow it, and throw the trial away if it fails, exactly
as the backtracking solver does with plain placement.
