---
project: build-an-expression-evaluator
lesson: 17
title: Evaluating unary minus
overview: The negation node negates the value it wraps, and evaluating it confirms the precedence choice you made for -2^2. Today you handle the one prefix node and see the convention produce its number.
goal: Evaluate a Un negation node by negating its operand.
spec:
  scenario: Unary minus negates its operand
  status: failing
  lines:
    - kw: Given
      text: 'the expression string "-5"'
    - kw: When
      text: 'it is evaluated with EvalString'
    - kw: Then
      text: 'the result is -5'
    - kw: And
      text: 'evaluating "-2 ^ 2" gives -4 (the power binds first), and "-(2 + 3)" gives -5'
code:
  lang: go
  source: |
    case *Un:
      v, err := Eval(n.Operand, env)
      if err != nil { return 0, err }
      return -v, nil                 // the only prefix operator is negation
checkpoint: The evaluator negates values, and -2 ^ 2 evaluates to -4 as chosen. Commit and stop here.
---

A `Un` node evaluates by evaluating its single operand and negating the result. Like
the binary case, the evaluator does nothing clever: it trusts the tree. The
interesting result is `-2 ^ 2`, which evaluates to `-4`. That is the convention you
chose back when you set the binding powers, where the power binds tighter than the
leading minus, so the tree is `-(2 ^ 2)`. The evaluator squares `2` to `4` and then
negates it. A different convention would have given `4`, and the difference lives
entirely in the parse tree, not here.

`-(2 + 3)` giving `-5` shows the same thing with grouping: the parentheses forced the
addition into the operand, and negation applied to the whole sum. With this, every
arithmetic expression the parser can build now evaluates to a number. The next lesson
puts the whole numeric core through its paces at once.
