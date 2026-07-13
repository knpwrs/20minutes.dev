---
project: build-a-spreadsheet-engine
lesson: 29
title: Transitive dependents
overview: Recalculating everything on each edit is wasteful. The first step to doing less is knowing exactly which cells a change can affect - its transitive dependents. Today you compute that set by walking the graph forward.
goal: Find every cell that transitively depends on a given cell, directly or indirectly.
spec:
  scenario: A cell reports everything downstream of it
  status: failing
  lines:
    - kw: Given
      text: 'a sheet with A1 set to 1, B1 set to ''=A1+1'', C1 set to ''=B1+1'', and D1 set to the literal 100'
    - kw: When
      text: 'the transitive dependents of A1 are computed'
    - kw: Then
      text: 'they are B1 and C1, in reading order'
    - kw: And
      text: 'D1, which reads nothing from that chain, is not among them'
code:
  lang: go
  source: |
    // follow dependent edges forward from `start`, collecting all reached.
    func (s *Sheet) dependentsOf(start Ref) []Ref {
      seen := map[Ref]bool{}
      var visit func(Ref)
      g := s.buildGraph()
      visit = func(r Ref) {
        for _, d := range g.dependents[r] {
          if !seen[d] { seen[d] = true; visit(d) }
        }
      }
      visit(start)
      return sortedReadingOrder(seen)
    }
checkpoint: A cell can report every cell downstream of it. Commit and stop here.
---

When a cell changes, the only cells whose values can possibly change are the ones
that **read** it - directly or through a chain. Those are its **transitive
dependents**, and you find them by following the graph's dependent edges *forward*
from the changed cell, collecting everything you reach. From `A1` the walk reaches
`B1` (which reads `A1`) and then `C1` (which reads `B1`); it never reaches `D1`,
because nothing in the chain feeds it.

This forward reachability is the mirror of precedents, which looked *backward* at
what a formula reads. Precedents answer "what do I need before I can compute?";
transitive dependents answer "who do I invalidate when I change?". That second
question is the key to **incremental** recalculation: instead of recomputing the
whole sheet, recompute only this set. The next lesson does exactly that - and
orders the set topologically so the downstream cells still evaluate in the right
sequence.
