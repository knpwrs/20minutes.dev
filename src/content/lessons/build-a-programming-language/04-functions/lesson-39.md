---
project: build-a-programming-language
lesson: 39
title: Returning from functions
overview: A return inside a function should end just that function and hand its value to the caller - not halt the whole program. Today you unwrap the return value at the call boundary to make that so.
goal: Unwrap a return value at the function boundary so an early return ends the function, not the program.
spec:
  scenario: Return inside a function body
  status: failing
  lines:
    - kw: Given
      text: 'the source let f = fn(x) { return x; x + 1; }; f(5)'
    - kw: When
      text: 'the evaluator evaluates the program'
    - kw: Then
      text: 'the result is 5, and the statement after the return never runs'
    - kw: And
      text: 'the source let early = fn() { if (true) { return 1; } return 2; }; early() yields 1'
    - kw: And
      text: 'unwrapping happens at every call boundary, so let f = fn() { let g = fn() { return 1; }; g(); return 2; }; f() yields 2 - the inner return ends only g'
code:
  lang: go
  source: |
    // after Eval(fn.Body, env) returns:
    if rv, ok := result.(*ReturnValue); ok {
      return rv.Value          // unwrap: the function yields the plain value
    }
    return result
checkpoint: Return ends the current function and yields its value to the caller. Commit.
---

Back in the evaluation chapter you made `return` wrap its value so it bubbles up
through blocks. Now that functions exist, that wrapper needs to be **unwrapped at
the function boundary**: after evaluating a function body, if the result is a
`ReturnValue`, return the plain value inside it to the caller. The wrapping is
what lets a `return` deep inside `if` blocks stop the body; the unwrapping is what
keeps it from stopping the *program*.

So `return x; x + 1;` inside `f` yields `5` and skips the `x + 1`, and a `return`
from inside a nested `if` still exits just that function. This boundary is why the
value stays wrapped as it rises through blocks but becomes ordinary once it
crosses out of a call - two behaviors from one mechanism.
