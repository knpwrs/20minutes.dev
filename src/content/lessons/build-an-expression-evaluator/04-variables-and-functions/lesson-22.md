---
project: build-an-expression-evaluator
lesson: 22
title: Evaluating built-in functions
overview: A parsed call does nothing until the evaluator knows the functions. Today you evaluate the arguments and dispatch to a small set of built-in functions, giving the calculator real capabilities.
goal: Evaluate a Call node by evaluating its arguments and applying a built-in function.
spec:
  scenario: Built-in functions compute over their arguments
  status: failing
  lines:
    - kw: Given
      text: 'the expression string "sqrt(16)"'
    - kw: When
      text: 'it is evaluated with EvalString'
    - kw: Then
      text: 'the result is 4'
    - kw: And
      text: 'evaluating "max(1, 2, 3)" gives 3, "abs(-5)" gives 5, "min(4, 2, 8)" gives 2, and "pow(2, 10)" gives 1024'
code:
  lang: go
  source: |
    case *Call:
      args := make([]float64, len(n.Args))
      for i, a := range n.Args {
        v, err := Eval(a, env); if err != nil { return 0, err }
        args[i] = v
      }
      switch n.Name {
      case "sqrt": return math.Sqrt(args[0]), nil
      case "abs":  return math.Abs(args[0]), nil
      case "pow":  return math.Pow(args[0], args[1]), nil
      case "max":  m := args[0]; for _, a := range args[1:] { if a > m { m = a } }; return m, nil
      case "min":  m := args[0]; for _, a := range args[1:] { if a < m { m = a } }; return m, nil
      }
      // an unknown name is left to fail for now; the errors chapter reports it
checkpoint: Built-in functions evaluate their arguments and compute a result. Commit and stop here.
---

Evaluating a `Call` is two steps: first evaluate **every argument** to a number, in
order, collecting them into a slice, then **dispatch** on the function name. Because
arguments are evaluated by the same tree walk, they can be any expression at all, so
`sqrt(2 + 14)` works as readily as `sqrt(16)`. The built-in set here is small but
representative: `sqrt` and `abs` take one argument, `pow` takes two, and `max` and
`min` take one or more and fold across them.

These functions are **built in**, not user-defined; there is no syntax in this
language for declaring your own, so the evaluator resolves names against a fixed
table. That keeps the scope focused on parsing and evaluation rather than on binding
and scope rules. An unknown function name, or the wrong number of arguments, currently
slips through or fails awkwardly; the errors chapter is where each of those becomes a
clear, positioned message.
