---
project: build-a-sudoku-solver
lesson: 19
title: Propagate to a fixpoint
overview: The two rules and the contradiction check are strongest together, applied over and over until nothing more can be deduced. Today you combine them into a single propagate step - the deduction engine the full solver will call at every node.
goal: Alternate naked and hidden singles until neither changes the grid, reporting any contradiction.
spec:
  scenario: Combined propagation reaches a fixpoint
  status: failing
  lines:
    - kw: Given
      text: 'candidate grids for an easy, a medium, and a hard puzzle'
    - kw: When
      text: 'naked-single and hidden-single propagation are alternated until the grid stops changing'
    - kw: Then
      text: 'the medium puzzle "000000907000420180000705026100904000050000040000507009920108000034059000507000000" is fully solved to "462831957795426183381795426173984265659312748248567319926178534834259671517643892"'
    - kw: And
      text: 'the hard puzzle "800000000003600000070090200050007000000045700000100030001000068008500010090000400" propagates without contradiction but leaves 60 cells still undecided (deduction alone is not enough)'
code:
  lang: go
  source: |
    // loop both rules until a full round makes no change, or a contradiction appears
    func Propagate(cg [81]Set) ([81]Set, bool) {
      for {
        before := cg
        cg = PropagateNaked(cg)
        cg = PropagateHidden(cg)
        if HasContradiction(cg) { return cg, false }
        if cg == before { return cg, true }
      }
    }
checkpoint: Naked and hidden singles run together to a fixpoint with contradiction detection. Commit and stop here.
---

Naked singles feed hidden singles and vice versa: assigning a hidden single
eliminates from peers, which may expose a naked single, whose assignment may reveal
another hidden single. So the strongest deduction step **alternates** both rules and
repeats until a full round changes nothing - the combined **fixpoint** - bailing out
early if a cell ever empties. This one function is the puzzle's entire logical
closure: everything derivable without guessing.

It also draws the honest line between deduction and search. The medium puzzle, which
stalled under naked singles alone, now solves completely - hidden singles were the
missing rule. But the 21-clue hard puzzle propagates to a consistent state with 60
cells still holding multiple candidates: no contradiction, yet no progress either.
Pure logic has run out, and the only way forward is to guess and check - which is
exactly where propagation and backtracking finally join, in the next lesson.
