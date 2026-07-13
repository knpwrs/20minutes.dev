---
project: build-a-programming-language
lesson: 41
title: Recursion
overview: A function bound with let can call itself by name, which unlocks recursion. Today you run a recursive Fibonacci - proof the language can express real algorithms.
goal: Evaluate a recursive function that calls itself by name.
spec:
  scenario: Evaluating a recursive function
  status: failing
  lines:
    - kw: Given
      text: 'the source let fib = fn(n) { if (n < 2) { n } else { fib(n - 1) + fib(n - 2) } }; fib(10)'
    - kw: When
      text: 'the evaluator evaluates the program'
    - kw: Then
      text: 'the result is 55'
    - kw: And
      text: 'evaluating the same fib with fib(0) yields 0 and fib(1) yields 1'
code:
  lang: go
  source: |
    // no new evaluator code: fib is bound in the environment with let,
    // so when the body evaluates the name fib it is found and called.
    // this lesson confirms recursion works end to end.
checkpoint: Recursive functions run, and the language can express real algorithms. Commit and stop for today.
---

Recursion needs nothing new: because `let fib = fn(n) { ... }` binds `fib` in the
environment *before* the function is called, the body can look up its own name and
call itself. Each call gets a fresh environment enclosing the one where `fib` is
bound, so the name resolves every time down the recursion.

`fib(10)` computing `55` is the chapter's capstone - it exercises conditionals,
arithmetic, comparison, function calls, and the environment chain all at once,
recursively. Watch the base cases (`fib(0)` is `0`, `fib(1)` is `1`), since a
wrong boundary there throws off every value above it. Your language now runs a
genuine algorithm; the last chapter gives it data structures to run algorithms
*over*.
