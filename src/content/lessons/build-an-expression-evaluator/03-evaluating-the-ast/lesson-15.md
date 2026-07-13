---
project: build-an-expression-evaluator
lesson: 15
title: Evaluating power
overview: The power operator was the trickiest to parse, and now it is the payoff to evaluate. Today you compute exponentiation and watch the right-associative grouping you built produce the right number.
goal: Evaluate the ^ operator as exponentiation.
spec:
  scenario: Power evaluates with right-associative grouping
  status: failing
  lines:
    - kw: Given
      text: 'the expression string "2 ^ 10"'
    - kw: When
      text: 'it is evaluated with EvalString'
    - kw: Then
      text: 'the result is 1024'
    - kw: And
      text: 'evaluating "2 ^ 3 ^ 2" gives 512, because it grouped as 2 ^ (3 ^ 2) = 2 ^ 9'
code:
  lang: go
  source: |
    // in the Bin operator switch, add a power case using the host math library
    case "^": return math.Pow(l, r), nil
checkpoint: The evaluator computes exponentiation, and right associativity gives 2 ^ 3 ^ 2 = 512. Commit and stop here.
---

Exponentiation is one more case in the operator switch, computed with the host
language's power function. The single-line change is small, but the value it produces
is the proof that the right-associative parsing from the earlier chapter was correct.
`2 ^ 3 ^ 2` evaluates to `512`, because the tree grouped it as `2 ^ (3 ^ 2)`, which is
`2 ^ 9`. Had it grouped the other way, you would get `(2 ^ 3) ^ 2 = 64` instead.

This is the satisfying part of separating parsing from evaluation: the evaluator does
nothing clever about associativity or precedence at all. It blindly walks whatever
tree it is handed. All the difficult decisions were made once, in the binding powers,
and every operator you evaluate simply inherits them.
