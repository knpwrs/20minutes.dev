---
project: build-an-expression-evaluator
lesson: 18
title: 'A full arithmetic expression'
overview: The numeric core is complete, so today you put every rule to work at once on one nontrivial expression, confirming precedence, associativity, grouping, and the operators all cooperate to a single exact number.
goal: Evaluate a mixed expression that exercises grouping, precedence, and every arithmetic operator together.
spec:
  scenario: Every rule cooperates on one expression
  status: failing
  lines:
    - kw: Given
      text: 'the expression string "2 * (3 + 4) ^ 2 - 10 / 2"'
    - kw: When
      text: 'it is evaluated with EvalString'
    - kw: Then
      text: 'the result is 93, because it groups as ((2 * ((3 + 4) ^ 2)) - (10 / 2))'
    - kw: And
      text: 'evaluating "(2 + 3) * 4" gives 20 and "2 ^ 3 ^ 2" gives 512'
code:
  lang: go
  source: |
    // no new evaluator code today: this is a confirmation that the whole
    // pipeline agrees. Parse the string to check the grouping if you like:
    e, _ := Parse("2 * (3 + 4) ^ 2 - 10 / 2")
    // e.String() == "((2 * ((3 + 4) ^ 2)) - (10 / 2))"
    v, _ := EvalString("2 * (3 + 4) ^ 2 - 10 / 2", nil)  // 93
checkpoint: A full mixed expression evaluates to its exact value through the whole pipeline. Commit and stop here.
---

This lesson adds no new evaluator code, and that is the point: with the tokenizer,
the Pratt parser, and the tree walk all built, a genuinely mixed expression just
works. Trace `2 * (3 + 4) ^ 2 - 10 / 2` by hand and every decision you made shows up:
the parentheses group `3 + 4` first, the power binds tighter than the multiply so
`(3 + 4) ^ 2` is `49`, the multiply and divide sit a tier above the subtract, and the
whole thing reduces to `2 * 49 - 5 = 93`.

Confirming the end-to-end result on one hard expression is worth a lesson because it
proves the layers agree. Parsing decided the shape, `((2 * ((3 + 4) ^ 2)) - (10 / 2))`,
and evaluation only had to follow it. That clean split, a parser that fixes structure
and an evaluator that trusts it, is the foundation the next chapters extend with
variables, functions, and errors.
