---
project: build-a-spreadsheet-engine
lesson: 39
title: 'Capstone: cycles and errors, safely'
overview: The finale proves the engine is safe when a sheet is broken - a circular reference is flagged rather than hung, and an error spreads to everything downstream. This is the last guarantee a real spreadsheet must give.
goal: Recalculate a sheet with both a division error and a circular reference, asserting exact error values and that it never hangs.
spec:
  scenario: A broken sheet fails safely and exactly
  status: failing
  lines:
    - kw: Given
      text: 'a sheet with A1 = 5, B1 = ''=A1/0'', C1 = ''=B1+1'', and a two-cell cycle D1 = ''=E1'' with E1 = ''=D1'''
    - kw: When
      text: 'Recalculate runs to completion (it must not hang)'
    - kw: Then
      text: 'Get("B1") and Get("C1") are both ''#DIV/0!'' - the division error propagates one cell downstream'
    - kw: And
      text: 'Get("D1") and Get("E1") are both ''#CIRC!'', while Get("A1") is still the Number 5'
code:
  lang: go
  source: |
    s.SetNumber("A1", 5)
    s.SetCell("B1", "=A1/0")   // #DIV/0!
    s.SetCell("C1", "=B1+1")   // #DIV/0! (propagated)
    s.SetCell("D1", "=E1"); s.SetCell("E1", "=D1") // cycle -> #CIRC!
    s.Recalculate()            // returns; never loops
checkpoint: The engine handles cycles and errors safely - the project is complete. Commit and stop here.
---

The final sheet is deliberately broken in two ways, and the engine handles both
without flinching. The division `A1/0` produces `#DIV/0!`, and because errors
propagate, the cell that reads it (`C1`) becomes `#DIV/0!` too. The pair `D1` and
`E1` reference each other, forming a cycle with no valid order; Kahn's algorithm
leaves them unplaced and recalculation flags both `#CIRC!`. Throughout, the healthy
cell `A1` keeps its value, and - the crucial part - `Recalculate` **returns**. It
never chases the cycle in an infinite loop.

That is the whole promise kept. From A1 addressing you built a formula language, an
evaluator, and a starter function library; then the real machinery of a spreadsheet -
a dependency graph, a topological recalculation order, incremental updates that
touch only what changed, and error handling that detects cycles and spreads failures
honestly. It is a genuinely working calculation engine, the same design that sits
underneath VisiCalc, Lotus 1-2-3, and Excel - the exact core those products extend
with a grid, a file format, and hundreds more functions. That core is yours.
