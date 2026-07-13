---
project: build-a-sudoku-solver
lesson: 16
title: Naked singles
overview: When elimination leaves a cell with just one candidate, that digit is forced - and assigning it can force its neighbours in turn. Today you cascade this naked-single rule to a fixpoint, and watch it solve an easy puzzle with no guessing at all.
goal: Repeatedly assign any cell that has exactly one candidate until nothing changes.
spec:
  scenario: Naked singles cascade to a solution
  status: failing
  lines:
    - kw: Given
      text: 'the candidate grid of "003020600900305001001806400008102900700000008006708200002609500800203009005010300", which starts with 35 single-candidate cells'
    - kw: When
      text: 'every single-candidate cell is assigned (eliminating from peers), repeated until no cell changes'
    - kw: Then
      text: 'all 81 cells become single-candidate and reading them off gives "483921657967345821251876493548132976729564138136798245372689514814253769695417382"'
    - kw: And
      text: 'the process is a fixpoint: running it again changes nothing'
code:
  lang: go
  source: |
    // keep assigning forced cells until a full pass makes no change
    func PropagateNaked(cg [81]Set) [81]Set {
      for {
        changed := false
        for i := 0; i < 81; i++ {
          if cg[i].Size() == 1 && /* i still has d among its peers */ true {
            // AssignCG cg[i].Sole() at i if it hasn't been propagated yet
          }
        }
        if !changed { return cg }
      }
    }
checkpoint: Naked-single propagation cascades to a fixpoint and solves an easy puzzle. Commit and stop here.
---

A **naked single** is the most basic deduction: if a cell has exactly one candidate,
that digit must go there. But assigning it eliminates that digit from its peers,
which can shrink one of them to a single candidate too - so the rule **cascades**.
You apply it in passes, assigning every forced cell and eliminating from peers, and
repeat until a whole pass changes nothing. That stable state is a **fixpoint**: more
looping cannot help.

For a large class of gentle puzzles this alone is enough - the classic 32-clue
puzzle collapses entirely to its solution under naked singles, never once needing a
guess. That will not always happen (harder puzzles stall with cells still holding
several candidates), which is what the next rules and the search are for. But it is
a striking first taste of how far pure propagation gets you, and it costs nothing but
elimination applied relentlessly.
