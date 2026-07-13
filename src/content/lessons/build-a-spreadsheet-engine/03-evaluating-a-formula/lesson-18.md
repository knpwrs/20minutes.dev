---
project: build-a-spreadsheet-engine
lesson: 18
title: A formula cell computes its value
overview: So far formulas are parsed and evaluated in isolation. Today you connect the two so a formula cell stored in the sheet actually produces a value - the first end-to-end path from typed formula to computed result.
goal: Compute a formula cell's value by evaluating its stored AST against the sheet's current values.
spec:
  scenario: A formula cell produces a computed value
  status: failing
  lines:
    - kw: Given
      text: 'a sheet with A1 set to 10, B1 set to 5, and C1 set to the formula ''=A1+B1'''
    - kw: When
      text: 'the sheet computes its formula cells and C1 is read'
    - kw: Then
      text: 'Get("C1") is the Number 15'
    - kw: And
      text: 'after A1 is changed to 20 and the sheet recomputes, Get("C1") is the Number 25'
code:
  lang: go
  source: |
    // SetCell now parses a formula's text into an `ast` field on the cell.
    // computing it = eval that AST against current cell values.
    func (s *Sheet) computeAll() {
      for ref, c := range s.cells {
        if c.isFormula {
          c.val = s.eval(c.ast)
          s.cells[ref] = c
        }
      }
    }
checkpoint: A formula cell now computes a real value from the sheet. Commit and stop here.
---

This lesson ties the room together: a formula cell stored its parsed tree when it
was set, and now the sheet **computes** it by evaluating that tree against the
current values of the other cells and storing the result as the cell's value. Set
`A1` and `B1` to numbers, set `C1` to `=A1+B1`, compute, and `C1` reads back as
`15`. For the first time you can put a formula in the grid and get an answer out.

Today's `computeAll` is deliberately naive: it evaluates every formula cell once,
in whatever order the map hands them out. That is fine when formulas only read
literal cells, as here. But it is not yet correct in general - if `C1` reads `B1`
and `B1` is itself a formula, computing `C1` before `B1` would use a stale value.
Getting the **order** right, so every cell is computed after the cells it depends
on, is the whole subject of Chapter 4. First, the next few lessons give formulas
something worth ordering: real functions.
