---
project: build-an-expression-evaluator
lesson: 13
title: Evaluating a number
overview: A tree is only useful once you can reduce it to a value. Today you write the evaluator's first case and the one-call convenience that ties tokenizing, parsing, and evaluating together, so the library can compute a whole expression string.
goal: Evaluate a Number node to its float64 value, and add EvalString to run a whole string.
spec:
  scenario: A number expression evaluates to its value
  status: failing
  lines:
    - kw: Given
      text: 'the expression string "42"'
    - kw: When
      text: 'it is evaluated with EvalString'
    - kw: Then
      text: 'the result is 42 and no error is returned'
    - kw: And
      text: 'evaluating "3.14" gives 3.14'
code:
  lang: go
  source: |
    type Env map[string]float64          // variable names to values, empty for now
    func Eval(e Expr, env Env) (float64, error) {
      switch n := e.(type) {
      case *Num:
        return n.Val, nil
      }
      return 0, fmt.Errorf("cannot evaluate")
    }
    func EvalString(in string, env Env) (float64, error) {
      e, err := Parse(in)
      if err != nil { return 0, err }
      return Eval(e, env)
    }
checkpoint: The evaluator reduces a number to its value, and EvalString runs a whole expression string. Commit and stop here.
---

Evaluation is a **tree walk**: a recursive function that turns each node into a
number. Today it handles the one leaf case, a `Num`, by returning its stored value.
`Eval` takes an `Env`, a map from variable names to values, and returns a value and
an error. Both ride along mostly unused right now, the way `Parse`'s error did: the
environment stays empty until the variables chapter, and the error stays `nil` until
the errors chapter, but declaring them now keeps the signature stable for every
caller.

`EvalString` is the library's headline entry point: give it a string, and it
tokenizes, parses, and evaluates in one call, returning the number or the first error
along the way. From here on you can assert on whole expressions end to end, which is
exactly how the rest of this chapter pins each operator's behavior to an exact
result.
