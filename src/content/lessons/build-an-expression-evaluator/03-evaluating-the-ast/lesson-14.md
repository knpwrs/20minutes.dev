---
project: build-an-expression-evaluator
lesson: 14
title: Evaluating the four operators
overview: With numbers evaluating, the tree walk extends to branches. Today you evaluate a binary node by evaluating each side and applying the operator, covering the four basic operators, with division producing an exact fraction.
goal: Evaluate a Bin node for + - * and / by recursing into both operands.
spec:
  scenario: Binary arithmetic evaluates through the tree
  status: failing
  lines:
    - kw: Given
      text: 'the expression string "2 + 3 * 4"'
    - kw: When
      text: 'it is evaluated with EvalString'
    - kw: Then
      text: 'the result is 14, because precedence made the tree (2 + (3 * 4))'
    - kw: And
      text: 'evaluating "10 - 3 - 2" gives 5, and "7 / 2" gives 3.5'
code:
  lang: go
  source: |
    case *Bin:
      l, err := Eval(n.Left, env);  if err != nil { return 0, err }
      r, err := Eval(n.Right, env); if err != nil { return 0, err }
      switch n.Op {
      case "+": return l + r, nil
      case "-": return l - r, nil
      case "*": return l * r, nil
      case "/": return l / r, nil    // float division: 7 / 2 is 3.5
      }
checkpoint: The evaluator computes addition, subtraction, multiplication, and division. Commit and stop here.
---

A `Bin` node is a branch, so evaluating it means **recursing** into its left and
right operands to get two numbers, then applying the operator. The recursion is what
makes precedence pay off: because the parser already built `2 + 3 * 4` as
`(2 + (3 * 4))`, the walk naturally computes `3 * 4` first and adds `2`, giving `14`.
The tree's shape carries all the grouping; the evaluator just follows it.

Because every value is a `float64`, division is **exact fractional** division:
`7 / 2` is `3.5`, not `3`. Choosing floating point throughout keeps the evaluator
simple and uniform, at the cost of the usual floating-point rounding on values that
cannot be represented exactly. Dividing by zero yields an infinity here rather than a
useful answer; turning that into a clear error is a task for the errors chapter, so
for now assume the divisor is nonzero.
