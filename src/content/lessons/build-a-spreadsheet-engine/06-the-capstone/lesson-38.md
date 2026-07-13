---
project: build-a-spreadsheet-engine
lesson: 38
title: 'Capstone: editing an input'
overview: The defining act of a spreadsheet is changing one number and watching the right cells update. Today you edit an input on the capstone sheet and assert exactly which cells recomputed and their new values.
goal: Edit one input cell and assert both the exact set of recomputed cells and their new values.
spec:
  scenario: An edit ripples to exactly the dependent cells
  status: failing
  lines:
    - kw: Given
      text: 'the recalculated capstone sheet (A1=10, A2=20, A3=30, A4=''=SUM(A1:A3)'', B1=''=A4/3'', B2=''=IF(B1>15, 1, 0)'', B3=''=B1+B2'')'
    - kw: When
      text: 'SetNumber("A1", 40) is called'
    - kw: Then
      text: 'the recomputed cells are exactly A4, B1, B2, B3, in that order'
    - kw: And
      text: 'Get("A4") is 90, Get("B1") is 30, Get("B2") is 1, and Get("B3") is 31, while A2 and A3 are untouched'
code:
  lang: go
  source: |
    changed := s.SetNumber("A1", 40)
    // changed == [A4, B1, B2, B3]
    // A4 = 40+20+30 = 90; B1 = 90/3 = 30;
    // B2 = IF(30>15,1,0) = 1; B3 = 30+1 = 31
checkpoint: Editing an input recomputes exactly the dependent cells. Commit and stop here.
---

Changing `A1` from `10` to `40` shows incremental recalculation at full strength.
The new value flows through the graph: `A4` re-sums to `90`, `B1` becomes `90/3 =
30`, `B2` re-tests the condition (`30 > 15` is still true, so `1`), and `B3` becomes
`30 + 1 = 31`. The setter returns exactly `[A4, B1, B2, B3]` - the transitive
dependents of `A1`, in topological order - and nothing else runs. `A2` and `A3` were
not touched by the edit and are not recomputed.

This is the behavior that made spreadsheets revolutionary: you change one input and
only the affected formulas re-run, in an order that keeps every result consistent.
The returned set is not a convenience - it is proof that the engine did the minimum
correct work. A full recalculation would have produced the same values but touched
every formula; the incremental path reaches the identical answer by recomputing only
what the change could reach. One thing remains to demonstrate: that the engine stays
safe when a sheet is *broken*.
