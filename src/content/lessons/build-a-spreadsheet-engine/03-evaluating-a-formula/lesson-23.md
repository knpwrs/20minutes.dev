---
project: build-a-spreadsheet-engine
lesson: 23
title: The IF function
overview: IF is the function that gives formulas a decision. Today you evaluate IF by testing its condition and returning only the matching branch, completing the starter function set.
goal: Evaluate IF by choosing its second or third argument based on the boolean condition.
spec:
  scenario: IF returns the branch its condition selects
  status: failing
  lines:
    - kw: Given
      text: 'a sheet with A1 set to 5'
    - kw: When
      text: 'IF formulas are evaluated'
    - kw: Then
      text: 'eval(''=IF(A1>0, 1, 0)'') is the Number 1'
    - kw: And
      text: 'after A1 is set to -3, eval(''=IF(A1>0, 1, 0)'') is the Number 0 and eval(''=IF(A1>0, 100, 200)'') is the Number 200'
code:
  lang: go
  source: |
    case "IF":
      cond := s.eval(n.Args[0])
      truthy := cond.Kind == Bool && cond.B
      if truthy {
        return s.eval(n.Args[1]) // then-branch
      }
      return s.eval(n.Args[2])   // else-branch
checkpoint: IF branches on a condition, completing the starter functions. Commit and stop here.
---

`IF` is the first function that does not treat all its arguments the same. It
evaluates the **condition** (its first argument), and based on whether that is
true, returns either the second argument (the then-branch) or the third (the
else-branch). With `A1 = 5`, `IF(A1>0, 1, 0)` sees a true condition and returns `1`;
flip `A1` to `-3` and the same formula returns `0`. The branch value can be anything
- another number, a cell reference, even a nested call.

That completes the starter function library: `SUM`, `MIN`, `MAX`, `COUNT`,
`AVERAGE`, and `IF`. The evaluator can now turn any formula the parser accepts into
a value, reading whatever cells it references. But it still evaluates on demand, in
no particular order, which is only correct when formulas read plain literals. The
moment one formula reads another formula's result, order matters - and getting that
order right, automatically and only recomputing what changed, is the real machinery
of a spreadsheet. That is Chapter 4.
