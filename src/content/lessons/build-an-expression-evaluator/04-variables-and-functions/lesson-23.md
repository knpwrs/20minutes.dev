---
project: build-an-expression-evaluator
lesson: 23
title: 'Variables and functions together'
overview: Variables and functions were built separately, so today you combine them in one expression, confirming that named inputs, nested calls, and arithmetic all compose through the same tree walk.
goal: Evaluate an expression that mixes variables, a nested function call, and arithmetic against an environment.
spec:
  scenario: Variables and function calls compose in one expression
  status: failing
  lines:
    - kw: Given
      text: 'the environment binding x to 9, a to 3, and b to 4'
    - kw: When
      text: 'the expression "sqrt(x) + max(a, b) * 2" is evaluated with EvalString against that environment'
    - kw: Then
      text: 'the result is 11, because sqrt(9) is 3 and max(3, 4) * 2 is 8'
    - kw: And
      text: 'evaluating "sqrt(16) + abs(-5)" with no variables gives 9'
code:
  lang: go
  source: |
    // no new code today: variables, calls, and arithmetic already share Eval
    env := Env{"x": 9, "a": 3, "b": 4}
    v, _ := EvalString("sqrt(x) + max(a, b) * 2", env)  // 3 + 4*2 = 11
checkpoint: Variables, function calls, and arithmetic compose in a single expression. Commit and stop here.
---

This lesson needs no new code, because every feature already flows through the one
`Eval` walk. In `sqrt(x) + max(a, b) * 2`, the tree walk resolves `x` to `9` from the
environment, calls `sqrt` on it to get `3`, resolves `a` and `b` and folds `max` to
`4`, multiplies by `2`, and adds. Precedence still applies across the whole thing: the
`* 2` binds to the `max(...)` before the `+` does, so the result is `3 + 8 = 11`.

Seeing named inputs and nested calls compose cleanly is the payoff of keeping the
evaluator a single recursive function over a uniform tree. The library is now
genuinely useful: it can compute real formulas with variables and functions. What it
still lacks is grace under bad input, and giving every failure a clear, positioned
message is the whole of the final chapter.
