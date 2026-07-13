---
project: build-a-sudoku-solver
lesson: 17
title: Hidden singles
overview: Sometimes a cell has several candidates but is the only place in its unit a given digit can go. Today you add the hidden-single rule, which sees these placements naked singles miss and unblocks puzzles that would otherwise stall.
goal: In each unit, assign any digit that has exactly one possible cell.
spec:
  scenario: A digit with one home in a unit is placed there
  status: failing
  lines:
    - kw: Given
      text: 'the candidate grid of "000000907000420180000705026100904000050000040000507009920108000034059000507000000" after naked-single propagation has stalled with cells still undecided'
    - kw: When
      text: 'each unit is scanned for a digit that appears as a candidate in only one of its cells'
    - kw: Then
      text: 'in row 4 (cells 36 to 44) the digit 9 is a candidate only in cell 38, so 9 is assigned there'
    - kw: And
      text: 'assigning the digit to that single cell shrinks it to {9}, even though it held other candidates before'
code:
  lang: go
  source: |
    // for every unit and digit, if exactly one cell can hold it, assign it there
    func PropagateHidden(cg [81]Set) [81]Set {
      for _, u := range Units() {
        for d := 1; d <= 9; d++ {
          spots := cellsWithCandidate(u, d, cg)
          if len(spots) == 1 { cg = AssignCG(cg, spots[0], d) }
        }
      }
      return cg
    }
checkpoint: Hidden-single detection places digits naked singles cannot. Commit and stop here.
---

A **hidden single** is the mirror of a naked single. A naked single looks at a cell
and finds it has one candidate; a hidden single looks at a **unit** and finds a
digit with one possible home. Cell 38 might still list several candidates, but if it
is the only cell in its row that can take a `9`, then `9` must go there - every other
cell in that row is already ruled out for it. Assigning `9` collapses cell 38 to
`{9}` and, through elimination, feeds the naked-single cascade again.

This rule matters because many puzzles that naked singles alone cannot finish are
still solvable by pure logic once hidden singles join in. The medium puzzle here
stalls under naked singles with dozens of cells undecided, then breaks open the
moment you spot that `9` has a single home in row 4. Two simple rules, applied
together, dissolve a large fraction of real puzzles - the next lesson makes them fail
loudly when a puzzle has no solution, then runs them together to a fixpoint.
