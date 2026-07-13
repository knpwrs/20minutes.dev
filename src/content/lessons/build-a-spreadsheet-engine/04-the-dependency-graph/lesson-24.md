---
project: build-a-spreadsheet-engine
lesson: 24
title: A formula's precedents
overview: To recalculate in the right order, the engine must know which cells each formula reads - its precedents. Today you walk a formula's tree and collect the exact set of cells it depends on.
goal: Collect the set of cells a formula reads, expanding any ranges to their cells.
spec:
  scenario: A formula reports the cells it reads
  status: failing
  lines:
    - kw: Given
      text: 'a parsed formula'
    - kw: When
      text: 'precedents walks its tree'
    - kw: Then
      text: 'precedents(parse(''=A1+B1*2'')) is the cells A1, B1 and precedents(parse(''=SUM(A1:A3)'')) is A1, A2, A3'
    - kw: And
      text: 'precedents(parse(''=IF(A1>0, B1, C1)'')) is A1, B1, C1, listed in reading order'
code:
  lang: go
  source: |
    // walk the AST; collect CellNode refs, expand RangeNode to its cells
    func precedents(e Expr) []Ref {
      set := map[Ref]bool{}
      var walk func(Expr)
      walk = func(e Expr) {
        switch n := e.(type) {
        case CellNode:  set[n.Ref] = true
        case RangeNode: for _, r := range expand(n.A, n.B) { set[r] = true }
        case BinaryNode: walk(n.L); walk(n.R)
        case CallNode:  for _, a := range n.Args { walk(a) }
        }
      }
      walk(e)
      return sortedReadingOrder(set)
    }
checkpoint: A formula can report the exact set of cells it depends on. Commit and stop here.
---

The whole of recalculation rests on one question: which cells does a formula
**read**? Those cells are its **precedents**. Finding them is a recursive walk of
the AST that collects every `CellNode`'s address and expands every `RangeNode` to
its cells, gathering them into a set so a cell mentioned twice counts once. So
`A1+B1*2` depends on `A1` and `B1`, and `SUM(A1:A3)` depends on all three cells the
range covers.

Return the precedents in a stable **reading order** (row by row, left to right) so
that every result built on top of them - the graph's edges, the recalculation order
- is deterministic and exactly assertable. Precedents are the raw material for the
dependency graph: if `C1`'s precedents include `B1`, then there is an edge saying
"`C1` depends on `B1`", and therefore `B1` must be computed before `C1`. The next
lesson turns these per-formula precedent sets into that graph.
