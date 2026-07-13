---
project: build-a-spreadsheet-engine
lesson: 28
title: Full recalculation
overview: Now the payoff - recompute the whole sheet in topological order so every formula reads fresh precedent values. Today Recalculate replaces the naive pass and stores each computed value as it goes.
goal: Recalculate all formula cells in topological order, storing each value so later cells read the fresh result.
spec:
  scenario: The sheet recalculates in dependency order
  status: failing
  lines:
    - kw: Given
      text: 'a sheet with A1, A2, A3 set to 1, 2, 3, A4 set to ''=SUM(A1:A3)'', B1 set to ''=A4*2'', and C1 set to ''=B1+A1'''
    - kw: When
      text: 'Recalculate runs'
    - kw: Then
      text: 'Get("A4") is the Number 6, Get("B1") is the Number 12, and Get("C1") is the Number 13'
    - kw: And
      text: 'the formula cells are evaluated in the topological order A4, B1, C1, each reading values its precedents already produced'
code:
  lang: go
  source: |
    func (s *Sheet) Recalculate() {
      order := s.topoOrder() // includes literals; skip them when evaluating
      for _, ref := range order {
        c := s.cells[ref]
        if c.isFormula {
          c.val = s.eval(c.ast) // precedents already stored fresh values
          s.cells[ref] = c
        }
      }
    }
checkpoint: The whole sheet recalculates correctly in dependency order. Commit and stop here.
---

This is what the chapter was building toward. `Recalculate` computes the
topological order, then walks it, evaluating each **formula** cell and storing its
result before moving on. Because the order guarantees every precedent is evaluated
first, each formula reads values that are already fresh - `A4` sums the inputs,
`B1` reads the finished `A4`, and `C1` reads the finished `B1`. The chained result
`6, 12, 13` is only reachable if the order is right; evaluate `C1` before `B1` and
you would get a stale `A4`.

This replaces the naive `computeAll` from Chapter 3, which evaluated formulas in map
order and only happened to work when they read plain literals. Storing each value as
it is computed is also what makes reading a cell cheap afterward: `Get` returns the
stored value without re-evaluating. A full recalculation is correct but does redo
**every** formula, even ones nothing changed near. The next chapter makes editing a
single cell recompute only what actually depends on it - and handles the cycles and
errors a real sheet has to survive.
