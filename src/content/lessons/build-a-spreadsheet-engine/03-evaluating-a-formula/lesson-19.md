---
project: build-a-spreadsheet-engine
lesson: 19
title: The SUM function
overview: Functions are where a spreadsheet earns its keep, and SUM over a range is the first. Today you evaluate a function call by dispatching on its name and folding the numbers in its range arguments.
goal: Evaluate a SUM call by expanding its range arguments and adding up the numeric values.
spec:
  scenario: SUM folds a range into a total
  status: failing
  lines:
    - kw: Given
      text: 'a sheet with A1, A2, A3 set to 1, 2, 3'
    - kw: When
      text: 'the formula ''=SUM(A1:A3)'' is evaluated'
    - kw: Then
      text: 'the result is the Number 6'
    - kw: And
      text: 'a bare ''=SUM(2, 3, 4)'' over scalar arguments is the Number 9, since SUM accepts both ranges and single values'
code:
  lang: go
  source: |
    func (s *Sheet) evalCall(n CallNode) Value {
      switch n.Name { // the function dispatch table grows over the next lessons
      case "SUM":
        sum := 0.0
        for _, v := range s.numArgs(n.Args) { sum += v }
        return Value{Kind: Number, Num: sum}
      }
      return Value{Kind: Empty}
    }
    // numArgs: for each arg, expand ranges to cells; keep only Number values
checkpoint: SUM totals a range or a list of values. Commit and stop here.
---

A `CallNode` is evaluated by **dispatching on its name**: a switch that routes
`SUM` to the summing code, and (in later lessons) `MIN`, `MAX`, `IF`, and the rest
to theirs. Set up that switch now, because it is the shape every function shares -
adding a function later is just adding a case. `SUM` itself gathers the numeric
values of its arguments and adds them.

The reusable piece is a helper that turns a function's arguments into a flat list of
numbers. For a scalar argument it evaluates the expression; for a **range** argument
it expands the range to its cells (using last chapter's `expand`) and reads each
one. Along the way it keeps only the `Number` values and skips blanks and text -
that is why `SUM` over a range that includes an empty or text cell still adds only
the numbers. Building this argument-gathering helper once means the rest of the
range functions - `MIN`, `MAX`, `COUNT`, `AVERAGE` - are almost free, which is
exactly the next two lessons.
