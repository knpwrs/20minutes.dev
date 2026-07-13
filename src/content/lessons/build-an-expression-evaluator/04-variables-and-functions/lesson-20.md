---
project: build-an-expression-evaluator
lesson: 20
title: Looking up a variable
overview: A variable reference is worthless until it can be resolved to a value. Today you evaluate a Var node by looking its name up in the environment, so expressions can finally use named inputs.
goal: Evaluate a Var node by looking its name up in the environment.
spec:
  scenario: A variable evaluates to its bound value
  status: failing
  lines:
    - kw: Given
      text: 'the environment binding x to 3'
    - kw: When
      text: 'the expression "x * 2" is evaluated with EvalString against that environment'
    - kw: Then
      text: 'the result is 6'
    - kw: And
      text: 'a name not in the environment is left to fail for now (the errors chapter reports it precisely)'
code:
  lang: go
  source: |
    case *Var:
      v, ok := env[n.Name]
      if !ok {
        // temporary: a clear, positioned message comes in the errors chapter
        return 0, fmt.Errorf("undefined variable: %s", n.Name)
      }
      return v, nil
    // caller: EvalString("x * 2", Env{"x": 3}) is 6
checkpoint: Variables resolve against the environment, so "x * 2" with x = 3 is 6. Commit and stop here.
---

The `Env` map that `Eval` has carried since the numeric core finally earns its keep.
Evaluating a `Var` node is a **lookup**: find the name in the environment and return
its value. With `x` bound to `3`, the expression `x * 2` evaluates to `6`, because the
lookup happens as the tree walk reaches the `Var` leaf, and the multiply then operates
on the resolved number like any other value.

A name that is **not** in the environment has no value to return. For now, return a
plain error so the evaluator stays honest and never invents a zero; the errors chapter
will upgrade that into a positioned message pointing at the exact name. Passing the
environment as an argument, rather than storing it globally, keeps evaluation
reentrant and lets each call supply its own bindings, which is exactly what the
capstone's batch of expressions will rely on.
