---
project: build-a-spreadsheet-engine
lesson: 12
title: Comparison operators
overview: Formulas compare values too, and comparisons bind more loosely than arithmetic so the sides are computed first. Today you add the comparison operators at the lowest precedence level, which IF will later depend on.
goal: Parse the comparison operators at a precedence below arithmetic.
spec:
  scenario: Comparisons parse below arithmetic
  status: failing
  lines:
    - kw: Given
      text: 'a formula that compares two arithmetic expressions'
    - kw: When
      text: 'it is parsed'
    - kw: Then
      text: 'parse(''=1>0'').String() is ''(1 > 0)'' and parse(''=3<=4'').String() is ''(3 <= 4)'''
    - kw: And
      text: 'parse(''=1+2>3'').String() is ''((1 + 2) > 3)'', showing the addition binds tighter than the comparison'
code:
  lang: go
  source: |
    // comparisons get the LOWEST binding power so arithmetic groups first
    func bp(k TokKind) int {
      switch k {
      case TStar, TSlash: return 30
      case TPlus, TMinus: return 20
      case TGt, TLt, TGe, TLe, TEq, TNe: return 10
      }
      return 0
    }
checkpoint: Comparisons parse at the lowest precedence, below arithmetic. Commit and stop here.
---

Spreadsheet formulas do not just compute numbers, they ask questions: is `A1`
greater than zero? The six comparison operators - `>`, `<`, `>=`, `<=`, `=`
(equal), and `<>` (not equal) - slot straight into the precedence machinery you
already have. The only decision is where they sit, and the answer is **below**
arithmetic: they get the lowest binding power.

That ordering is what makes `1+2>3` mean "is the sum greater than three" rather than
"is `1` plus the comparison". With comparison at power 10 and `+` at 20, the parser
folds the addition into a subtree first, then makes it the left side of the
comparison - printing `((1 + 2) > 3)`. Comparisons produce a yes/no result, which is
why we built the `Bool` value kind back in Chapter 1; the evaluator will turn these
nodes into booleans later, and `IF` will branch on them.
