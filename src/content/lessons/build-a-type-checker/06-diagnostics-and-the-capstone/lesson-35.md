---
project: build-a-type-checker
lesson: 35
title: Every error, located
overview: A checker is judged by its errors, so today you confirm all three kinds report cleanly through one location. Unbound variables, type mismatches, and infinite types each come back with a clear message and a source position.
goal: Report each of the three error kinds with its message and source position.
spec:
  scenario: The three located error kinds
  status: failing
  lines:
    - kw: Given
      text: 'three ill-typed programs, each carried at a source position'
    - kw: When
      text: each is reported
    - kw: Then
      text: 'the report of the variable y at line 1, column 1 is "unbound variable: y at line 1, col 1", and the report of if 1 then 2 else 3 at line 2, column 3 is "cannot unify Int with Bool at line 2, col 3"'
    - kw: And
      text: 'the report of \x. x x at line 3, column 5 is "occurs check failed: a occurs in a -> b at line 3, col 5"'
code:
  lang: go
  source: |
    // no new checker code - this confirms the taxonomy flows through Report + At:
    //   Report(env, At{1, 1, Var{"y"}})
    //   Report(env, At{2, 3, If{IntLit{1}, IntLit{2}, IntLit{3}}})
    //   Report(env, At{3, 5, Lambda{Param: "x", Body: App{Var{"x"}, Var{"x"}}}})
    // each returns "<message> at line L, col C".
checkpoint: All three error kinds report with a clear message and a source position. Commit and stop here.
---

A type checker earns trust through its errors, and this one has exactly three kinds,
each built earlier in the project. An **unbound variable** is a name used out of
scope, from the very first environment lesson. A **type mismatch** is unification
refusing to make two types equal - a non-`Bool` condition, an argument of the wrong
type, disagreeing branches - and it accounts for nearly every error a real program
hits. An **infinite type** is the occurs check firing on a self-referential term like
`\x. x x`. Today confirms all three travel through `Report` and pick up a source
position from their enclosing `At`, so the programmer always gets *what* went wrong
and *where*.

There is one honest limitation worth naming, because it shapes how the capstone
behaves: this checker reports the **first** error it meets and stops. The moment a
unification fails, inference returns that error and unwinds - it does not recover and
keep going to collect every mistake in the program at once, the way a production
compiler does with error recovery. That is a deliberate scope line for a
teaching-grade checker, and a natural thing to note in the caveats and to try as an
extension. With the diagnostics complete, everything is in place for the capstone:
one program inferred to its principal type, one reported at its error.
