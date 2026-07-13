---
project: build-a-spreadsheet-engine
lesson: 34
title: Errors propagate
overview: An error in one cell should taint every cell that reads it, all the way down the chain. Today you make errors propagate so a single #DIV/0! spreads to its dependents instead of being silently swallowed.
goal: Make a formula that reads an errored value evaluate to that same error.
spec:
  scenario: An error spreads to dependent cells
  status: failing
  lines:
    - kw: Given
      text: 'a sheet with A1 = ''=1/0'', B1 = ''=A1+1'', and C1 = ''=B1*2'''
    - kw: When
      text: 'Recalculate runs'
    - kw: Then
      text: 'Get("A1"), Get("B1"), and Get("C1") are all the Error ''#DIV/0!'''
    - kw: And
      text: 'the error reaches C1 through B1 - a cell two steps downstream of the original error is still errored'
code:
  lang: go
  source: |
    // when evaluating a binary node, if either side is an error,
    // return that error instead of doing arithmetic.
    func applyBin(op string, l, r Value) Value {
      if l.Kind == Err { return l }
      if r.Kind == Err { return r }
      // ... normal arithmetic / comparison
    }
checkpoint: Errors now propagate to every cell downstream. Commit and stop here.
---

An error value has to be **infectious**. If `A1` is `#DIV/0!` and `B1` is `=A1+1`,
then `B1` has no honest number to show - so it becomes `#DIV/0!` too. The rule is
simple and lives at the operators: before doing any arithmetic or comparison, check
whether either operand is an `Err` value, and if so, return that error unchanged.
Because evaluation is recursive and cells are computed in topological order, the
error rides the dependency chain: `A1` errors, `B1` reads it and errors, `C1` reads
`B1` and errors - two steps from the source.

Propagation is what makes errors trustworthy. Without it, a formula downstream of a
broken cell might quietly coerce the error to zero and report a plausible-looking
wrong answer, which is far worse than a visible `#DIV/0!`. Preserving the **original**
error code as it spreads (rather than inventing a new one) also means the cell that
finally shows the error still points back at what went wrong. Aggregate functions
follow the same rule - a `SUM` over a range containing an error is that error. The
last kinds of error to add are the ones about bad names and bad references.
