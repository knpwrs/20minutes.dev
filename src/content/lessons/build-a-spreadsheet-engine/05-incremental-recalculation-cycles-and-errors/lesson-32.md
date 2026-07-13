---
project: build-a-spreadsheet-engine
lesson: 32
title: Flagging circular references
overview: A detected cycle needs a value to show. Today you mark every cell caught in a cycle with a #CIRC! error during recalculation, so the sheet reports the problem instead of hanging or showing a stale number.
goal: During recalculation, set every cell left unplaced by the sort to a #CIRC! error value.
spec:
  scenario: Cycle cells recalculate to a circular-reference error
  status: failing
  lines:
    - kw: Given
      text: 'a sheet with A1 set to ''=B1'' and B1 set to ''=A1'''
    - kw: When
      text: 'Recalculate runs'
    - kw: Then
      text: 'Get("A1") and Get("B1") are both the Error value ''#CIRC!'''
    - kw: And
      text: 'a self-reference, A1 set to ''=A1+1'', also recalculates A1 to ''#CIRC!'''
code:
  lang: go
  source: |
    func (s *Sheet) Recalculate() {
      order := s.topoOrder()
      placed := setOf(order)
      for ref, c := range s.cells {
        if c.isFormula && !placed[ref] { // caught in a cycle
          c.val = Value{Kind: Err, Code: "#CIRC!"}; s.cells[ref] = c
        }
      }
      for _, ref := range order { /* evaluate placed formulas as before */ }
    }
checkpoint: Circular references are flagged with #CIRC! instead of hanging. Commit and stop here.
---

Now recalculation gives cycle cells an honest value. After the topological sort,
any formula cell that was **not** placed is part of a cycle, so we set it to an
error value with the code `#CIRC!` - the `Err` kind you reserved in the very first
value type finally being used. The cells that *were* placed evaluate normally in
order, as before. A two-cell cycle (`A1=B1`, `B1=A1`) marks both cells `#CIRC!`,
and a cell that refers to itself (`A1=A1+1`) marks itself the same way.

This is the difference between a toy and a real engine: a spreadsheet must survive a
user typing a circular formula, and the correct response is a clear error, not a
freeze. Because detection is just "which cells did Kahn's algorithm fail to place",
flagging them is cheap and reliable. `#CIRC!` is the first of several error values a
real sheet needs. The rest - division by zero, unknown functions, bad references -
come from evaluation itself, and the next lessons make those into first-class error
values too, then make them **spread**.
