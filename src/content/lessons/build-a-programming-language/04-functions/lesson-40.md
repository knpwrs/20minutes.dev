---
project: build-a-programming-language
lesson: 40
title: Closures
overview: Because a function remembers where it was defined, it can capture variables from that scope and keep using them after the outer function returns. Today you see closures work - the payoff of every environment decision so far.
goal: Show that an inner function captures and retains a variable from its enclosing function.
spec:
  scenario: A closure captures its enclosing variable
  status: failing
  lines:
    - kw: Given
      text: 'the source let newAdder = fn(x) { fn(y) { x + y } }; let addTwo = newAdder(2); addTwo(3)'
    - kw: When
      text: 'the evaluator evaluates the program'
    - kw: Then
      text: 'the result is 5'
    - kw: And
      text: 'newAdder(10)(3) yields 13, each returned function keeping its own captured x'
code:
  lang: go
  source: |
    // no new code if lessons 37-38 are right:
    //   fn(y){ x + y } captures the environment of the newAdder(2) call,
    //   where x = 2; calling addTwo(3) looks up x in that captured chain.
    // this lesson verifies the capture works end to end.
checkpoint: Inner functions close over their enclosing variables - closures work. Commit.
---

A **closure** is a function that remembers variables from the scope where it was
*defined*, even after that scope has finished. `newAdder(2)` returns the inner
function `fn(y) { x + y }`; that inner function captured the environment of the
`newAdder` call, where `x` is `2`. So `addTwo(3)` looks up `x` through its
captured environment chain and finds `2`, giving `5`.

If your function object captured its defining environment (lesson 37) and calls
extend that environment (lesson 38), **closures already work** - this lesson is
where you confirm it, and it is worth pausing on, because it is the deepest idea
in the language. Each call to `newAdder` makes a fresh environment, so
`newAdder(10)` and `newAdder(2)` produce independent adders. Captured, private,
persistent state from nothing but function scope.
