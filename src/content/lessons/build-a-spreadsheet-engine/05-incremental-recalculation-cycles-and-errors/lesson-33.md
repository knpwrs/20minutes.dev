---
project: build-a-spreadsheet-engine
lesson: 33
title: The #DIV/0! error
overview: Some formulas are perfectly valid until you run them - dividing by zero is the classic case. Today you make division by zero produce a #DIV/0! error value instead of a bogus number or a crash.
goal: Make division by zero evaluate to a #DIV/0! error value.
spec:
  scenario: Division by zero produces an error value
  status: failing
  lines:
    - kw: Given
      text: 'a sheet with A1 set to the formula ''=1/0'''
    - kw: When
      text: 'Recalculate runs and A1 is read'
    - kw: Then
      text: 'Get("A1") is the Error value ''#DIV/0!'''
    - kw: And
      text: 'a nonzero divisor still works normally, so ''=6/2'' evaluates to the Number 3'
code:
  lang: go
  source: |
    case "/":
      if toNum(r) == 0 {
        return Value{Kind: Err, Code: "#DIV/0!"}
      }
      return Value{Kind: Number, Num: toNum(l) / toNum(r)}
checkpoint: Dividing by zero yields a #DIV/0! error value. Commit and stop here.
---

Not every error is a structural one like a cycle; some come from the arithmetic
itself. **Division by zero** is the archetype: `=1/0` is a well-formed formula that
simply has no numeric answer. Rather than return infinity, a wrong number, or panic,
the evaluator produces an `Err` value carrying the code `#DIV/0!`. A normal divide
with a nonzero divisor is unaffected and still returns a number.

This is the second source of error values, and it is different from `#CIRC!` in an
important way: it is produced deep inside evaluation, at a single operator, not by
the graph structure. That raises a new question the moment you have it: if `A1` is
`#DIV/0!`, what should a cell that reads `A1` show? A number would be a lie. The
answer every spreadsheet gives is that the error **spreads** - a formula built on an
error is itself an error. Making that propagation happen is the next lesson.
