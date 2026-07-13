---
project: build-a-spreadsheet-engine
lesson: 20
title: MIN and MAX
overview: With the argument-gathering helper in place, more aggregate functions are almost free. Today you add MIN and MAX - two facets of the same reduce-over-a-range idea, differing only in the comparison.
goal: Add MIN and MAX as reductions over the numeric values of their arguments.
spec:
  scenario: MIN and MAX reduce a range
  status: failing
  lines:
    - kw: Given
      text: 'a sheet with A1, A2, A3 set to 1, 2, 3'
    - kw: When
      text: 'MIN and MAX are evaluated over the range'
    - kw: Then
      text: 'eval(''=MIN(A1:A3)'') is the Number 1 and eval(''=MAX(A1:A3)'') is the Number 3'
    - kw: And
      text: 'after A2 is raised to 10, eval(''=MAX(A1:A3)'') is the Number 10 while eval(''=MIN(A1:A3)'') stays 1'
code:
  lang: go
  source: |
    case "MIN", "MAX":
      xs := s.numArgs(n.Args)
      if len(xs) == 0 { return Value{Kind: Number, Num: 0} }
      m := xs[0]
      for _, x := range xs {
        if n.Name == "MIN" && x < m { m = x }
        if n.Name == "MAX" && x > m { m = x }
      }
      return Value{Kind: Number, Num: m}
checkpoint: MIN and MAX reduce a range to its smallest and largest value. Commit and stop here.
---

`MIN` and `MAX` are the same shape as `SUM`: gather the numeric values with the
helper, then **reduce** them - but instead of adding, you keep the running smallest
or largest. They are genuinely two facets of one idea, so they share a case,
differing only in the comparison (`<` versus `>`). Over `1, 2, 3` that gives `1` and
`3`; raise a cell and `MAX` tracks it to `10`.

The one edge worth deciding is what an **empty** set of numbers reduces to - a range
of all-blank cells. Real spreadsheets return `0` for `MIN`/`MAX` of nothing, so we
seed the result at `0` when no numbers are found rather than erroring. Keeping the
same argument helper across every aggregate is what makes these functions small: the
work of expanding ranges and filtering to numbers was done once in the last lesson,
and each new function is just a different fold over the result.
