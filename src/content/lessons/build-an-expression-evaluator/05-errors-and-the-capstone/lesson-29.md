---
project: build-an-expression-evaluator
lesson: 29
title: Wrong argument counts
overview: A known function called with the wrong number of arguments would read past its arguments or ignore them. Today you check each built-in's arity and report a clear error when it does not match.
goal: Report a positioned error when a built-in function is called with the wrong number of arguments.
spec:
  scenario: Functions validate how many arguments they receive
  status: failing
  lines:
    - kw: Given
      text: 'the expression string "sqrt(1, 2)"'
    - kw: When
      text: 'it is evaluated with EvalString'
    - kw: Then
      text: 'evaluation fails with: sqrt expects 1 argument, got 2 at position 0'
    - kw: And
      text: 'evaluating "max()" fails with: max expects at least 1 argument, got 0 at position 0'
code:
  lang: go
  source: |
    // check arity before indexing into args
    case "sqrt":
      if len(args) != 1 {
        return 0, fmt.Errorf("sqrt expects 1 argument, got %d at position %d", len(args), n.Pos)
      }
      return math.Sqrt(args[0]), nil
    case "max":
      if len(args) < 1 {
        return 0, fmt.Errorf("max expects at least 1 argument, got %d at position %d", len(args), n.Pos)
      }
      // ... fold as before ...
checkpoint: Built-in functions reject calls with the wrong number of arguments. Commit and stop here.
---

Every built-in has an **arity**, a required number of arguments: `sqrt` and `abs`
take exactly one, `pow` exactly two, and `max` and `min` at least one. Calling one the
wrong way, like `sqrt(1, 2)`, previously ignored the extra argument, and `max()` would
have crashed indexing an empty slice. Guarding each function's argument count before
using the arguments turns both into a clear message that says what the function
expected and what it got, at the call's position.

This is the last error class. The message wording, `expects 1 argument` for a fixed
arity and `expects at least 1 argument` for a variadic one, tells the user precisely
how to fix the call. With parse errors, arithmetic errors, undefined-name errors, and
now arity errors all handled, every way an expression can be malformed produces a
clear, positioned message instead of a crash or a wrong answer. The library is
complete and robust; the capstone puts it all on display.
