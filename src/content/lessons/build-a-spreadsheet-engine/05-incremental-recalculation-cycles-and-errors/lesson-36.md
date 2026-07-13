---
project: build-a-spreadsheet-engine
lesson: 36
title: Editing triggers recalculation
overview: A spreadsheet recalculates on its own when you change a cell - you never call recalc by hand. Today you wire incremental recalculation into the setter so an edit updates its dependents automatically and reports what changed.
goal: Make setting a cell automatically recompute its dependents and return the list of recomputed cells.
spec:
  scenario: Setting a cell recalculates automatically
  status: failing
  lines:
    - kw: Given
      text: 'a recalculated sheet with A1 = 1, B1 = ''=A1+1'', and C1 = ''=B1+1'' (so B1 is 2 and C1 is 3)'
    - kw: When
      text: 'SetNumber("A1", 10) is called with no separate Recalculate'
    - kw: Then
      text: 'it returns the recomputed cells B1 and C1, and Get("B1") is 11 with Get("C1") 12'
    - kw: And
      text: 'setting an isolated cell with no dependents returns an empty list of recomputed cells'
code:
  lang: go
  source: |
    // the public setter now writes the value AND recalculates downstream
    func (s *Sheet) SetNumber(a string, n float64) []Ref {
      ref := parseRef(a)
      s.cells[ref] = Cell{val: Value{Kind: Number, Num: n}}
      return s.recalcFrom(ref) // incremental, returns what changed
    }
checkpoint: Editing a cell now recalculates its dependents automatically. Commit and stop here.
---

The last piece of the core is ergonomics that also happen to be correctness. In a
real spreadsheet you never think about recalculation - you change a number and the
dependent cells update instantly. We get that by folding `recalcFrom` into the
setter: writing a cell stores the new value and immediately recomputes its transitive
dependents in topological order, returning the list of cells that changed. Setting
`A1` to `10` updates `B1` and `C1` with no separate call, and hands back exactly
`[B1, C1]`.

Returning the changed set turns the library into something you can build a UI or a
test on top of: a caller knows precisely which cells to redraw, and a test can
assert that an edit rippled exactly as far as it should - and no further. An edit to
a cell nothing depends on returns an empty list, doing essentially no work. That is
the promise of incremental recalculation kept at the API surface. The engine is now
complete: addressing, parsing, evaluation, a dependency graph, topological
recalculation, incremental updates, cycle detection, and propagating errors. The
capstone puts all of it to work at once.
