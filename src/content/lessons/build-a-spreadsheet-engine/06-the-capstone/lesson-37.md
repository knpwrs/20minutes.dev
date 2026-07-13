---
project: build-a-spreadsheet-engine
lesson: 37
title: 'Capstone: a real sheet'
overview: Time to use the whole engine. Today you build a real sheet with literals, a range sum, a division, and a conditional, recalculate it, and assert every computed value - proving parsing, evaluation, functions, and ordered recalculation all agree.
goal: Build a sheet mixing literals, SUM over a range, a division, and an IF, recalculate, and assert every value.
spec:
  scenario: A realistic sheet recalculates end to end
  status: failing
  lines:
    - kw: Given
      text: 'a sheet with A1 = 10, A2 = 20, A3 = 30, A4 = ''=SUM(A1:A3)'', B1 = ''=A4/3'', B2 = ''=IF(B1>15, 1, 0)'', and B3 = ''=B1+B2'''
    - kw: When
      text: 'Recalculate runs'
    - kw: Then
      text: 'Get("A4") is 60 and Get("B1") is 20'
    - kw: And
      text: 'Get("B2") is 1 (since 20 > 15) and Get("B3") is 21'
code:
  lang: go
  source: |
    s := NewSheet()
    s.SetNumber("A1", 10); s.SetNumber("A2", 20); s.SetNumber("A3", 30)
    s.SetCell("A4", "=SUM(A1:A3)")
    s.SetCell("B1", "=A4/3")
    s.SetCell("B2", "=IF(B1>15, 1, 0)")
    s.SetCell("B3", "=B1+B2")
    s.Recalculate()
    // A4=60, B1=20, B2=1, B3=21
checkpoint: A realistic sheet recalculates correctly end to end. Commit and stop here.
---

This is the engine doing everything at once. The sheet has literal inputs
(`A1..A3`), a range aggregate (`A4` sums them to `60`), a division that feeds off
that total (`B1` is `60/3 = 20`), a conditional that tests the result (`B2` is `IF
B1>15`, which is `1`), and a formula that combines two computed cells (`B3` is `20 +
1 = 21`). Every one of those values is only correct if the recalculation order is
right: `A4` before `B1`, `B1` before both `B2` and `B3`, and `B2` before `B3`.

That the numbers come out exactly `60, 20, 1, 21` is the whole project proving
itself. The parser turned each formula into a tree, `precedents` found the
dependencies, the graph and Kahn's algorithm produced the order, and the evaluator
walked each tree reading fresh values. Nothing here is special-cased for this sheet -
it is the same `Recalculate` any sheet uses. The next lesson does the thing a
spreadsheet is really for: change an input and watch exactly the right cells update.
