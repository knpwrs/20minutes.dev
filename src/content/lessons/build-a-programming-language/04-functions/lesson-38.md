---
project: build-a-programming-language
lesson: 38
title: Calling functions
overview: Now functions run. Today you evaluate a call - make a fresh environment, bind each argument to its parameter, evaluate the body in that environment, and return the result.
goal: Evaluate a function call by binding arguments to parameters in a new enclosed environment and running the body.
spec:
  scenario: Applying a function to arguments
  status: failing
  lines:
    - kw: Given
      text: 'the source let add = fn(a, b) { a + b }; add(2, 3)'
    - kw: When
      text: 'the evaluator evaluates the program'
    - kw: Then
      text: 'the result is 5'
    - kw: And
      text: 'evaluating let double = fn(x) { x * 2 }; double(double(3)) yields 12, so arguments are evaluated before the call'
code:
  lang: go
  source: |
    // an environment can enclose an outer one for name lookup
    func NewEnclosedEnvironment(outer *Environment) *Environment { ... }
    // apply: env := NewEnclosedEnvironment(fn.Env)
    //        bind each evaluated arg to fn.Parameters[i], then Eval(fn.Body, env)
    // Get falls back to the outer environment when a name is not local
checkpoint: Function calls run their body with arguments bound, returning the body's value. Commit.
---

Calling a function has four steps: evaluate the argument expressions to values,
make a **new environment** for this call, bind each parameter name to its argument
value there, and evaluate the body in that environment. The result of the body is
the call's value, so `add(2, 3)` gives `5`.

The new environment must **enclose** the function's captured environment: name
lookup checks the local (call) scope first, then falls back outward. Extend
`Environment.Get` to consult an outer environment when a name is not found
locally. This nesting is what gives functions **local scope** - a parameter `x`
shadows an outer `x` for the duration of the call - and it is the exact mechanism
closures will exploit. Arguments being evaluated first is why `double(double(3))`
is `12`: the inner call runs before the outer one.
