---
project: build-an-expression-evaluator
lesson: 16
title: Evaluating modulo
overview: The modulo operator gives the remainder of a division, and on float64 values it uses a floating-point remainder. Today you add the last arithmetic operator, completing the numeric core.
goal: Evaluate the % operator as a floating-point remainder.
spec:
  scenario: Modulo evaluates to a remainder
  status: failing
  lines:
    - kw: Given
      text: 'the expression string "7 % 3"'
    - kw: When
      text: 'it is evaluated with EvalString'
    - kw: Then
      text: 'the result is 1'
    - kw: And
      text: 'evaluating "7.5 % 2" gives 1.5, a floating-point remainder'
code:
  lang: go
  source: |
    // integer % does not work on float64; use the math library's remainder
    case "%": return math.Mod(l, r), nil
checkpoint: The evaluator computes a floating-point modulo, completing the arithmetic operators. Commit and stop here.
---

Modulo returns the **remainder** after division. Because every value is a `float64`,
you cannot use an integer remainder operator; instead you use the math library's
floating-point remainder, which is defined for non-integers too. `7 % 3` is `1`, the
familiar integer result, and `7.5 % 2` is `1.5`, showing that the operator is not
restricted to whole numbers.

With modulo in place, all five binary operators evaluate, plus you have the tree walk
that ties them together. As with division, a modulo by zero has no meaningful answer
and produces a not-a-number value for now; the errors chapter will turn that into a
clear message. One prefix operator, unary minus, is still left to evaluate, and it is
next.
