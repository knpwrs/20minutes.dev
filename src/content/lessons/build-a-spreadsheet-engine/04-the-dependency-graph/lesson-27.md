---
project: build-a-spreadsheet-engine
lesson: 27
title: A diamond of dependencies
overview: A chain has only one order, so it hides the interesting cases. Today you sort a diamond - one cell feeding two, which feed a fourth - to confirm the algorithm handles branching and merging correctly.
goal: Confirm the topological order of a diamond-shaped dependency graph, with the tie-break making it exact.
spec:
  scenario: A diamond sorts into a deterministic order
  status: failing
  lines:
    - kw: Given
      text: 'a sheet where A1 is 10, B1 is ''=A1+1'', C1 is ''=A1+2'', and D1 is ''=B1+C1'''
    - kw: When
      text: 'a topological order is computed'
    - kw: Then
      text: 'the order is A1, B1, C1, D1 - A1 first, D1 last, and B1 before C1 by the reading-order tie-break'
    - kw: And
      text: 'every one of the edges A1 to B1, A1 to C1, B1 to D1, and C1 to D1 is respected (both B1 and C1 precede D1)'
code:
  lang: go
  source: |
    // A1 -> B1, A1 -> C1, B1 -> D1, C1 -> D1
    // Kahn: A1 ready first. Removing A1 makes B1 and C1 ready (both
    // in-degree 0 now); reading order picks B1 then C1. D1 waits until
    // BOTH B1 and C1 are placed (its in-degree reaches 0 only then).
checkpoint: The algorithm handles branching and merging dependencies. Commit and stop here.
---

The diamond is the shape that proves the algorithm. `A1` feeds both `B1` and `C1`,
and both of those feed `D1`. When `A1` is removed, `B1` and `C1` become ready at the
same moment - this is the tie the reading-order rule resolves, placing `B1` before
`C1`. Crucially, `D1` has in-degree `2` and does **not** become ready until both
`B1` and `C1` have been placed, so it always comes last. The order is `A1, B1, C1,
D1`.

This is the guarantee recalculation needs: a cell with several precedents is not
evaluated until **all** of them are done, and a cell feeding several dependents is
evaluated once, before any of them. The merge point (`D1`) and the fork point (`A1`)
are exactly where a naive "evaluate in the order cells were entered" approach would
use a stale value. The topological order makes both correct by construction. With
the order proven on a branching graph, the next lesson finally uses it to recompute
the whole sheet.
