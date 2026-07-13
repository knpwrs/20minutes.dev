---
project: build-a-programming-language
lesson: 34
title: Running a while loop
overview: With conditions, blocks, and assignment in place, the loop finally runs. Today you evaluate a while statement and use it to compute a running sum - the first genuinely iterative program your language executes.
goal: Evaluate a while loop that repeats its body while the condition holds, and run a summation.
spec:
  scenario: Evaluating a while loop
  status: failing
  lines:
    - kw: Given
      text: 'the source let i = 0; let sum = 0; while (i < 5) { sum = sum + i; i = i + 1; } sum'
    - kw: When
      text: 'the evaluator evaluates the program'
    - kw: Then
      text: 'the result is 10, the sum of 0 through 4'
    - kw: And
      text: 'a while whose condition starts false runs its body zero times'
code:
  lang: go
  source: |
    func evalWhile(ws *WhileStatement, env *Environment) Object {
      for isTruthy(Eval(ws.Condition, env)) {
        result := Eval(ws.Body, env)
        // if result is an *Error or *ReturnValue, stop and return it
      }
      return NULL
    }
checkpoint: While loops run to completion, and your language executes its first real iterative program. Commit and stop for today.
---

A `while` re-checks its condition's **truthiness** and re-runs its **body block**
as long as the condition holds - reusing the two mechanisms you already built. The
body's assignments change variables in the environment, so the condition
eventually turns false and the loop ends. A condition that starts false runs the
body zero times.

The summation program ties the whole chapter together: `let` to declare, `<` to
test, `+` to compute, and `=` to advance the counter, all inside a loop that runs
five times to produce `10`. That is a real, non-trivial computation - the first
program your language runs that a calculator could not. Keep watching for `return`
and errors inside the body so they still break out of the loop cleanly.
