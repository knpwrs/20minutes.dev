---
project: build-a-type-checker
lesson: 34
title: The report
overview: The checker's real product is an answer a person can read - a type, or an error. Today you wrap inference in a single report function that returns the inferred type as text on success, or the located error message on failure.
goal: Build a report function that returns the inferred type printed, or the located error message.
spec:
  scenario: Reporting a result as human-readable text
  status: failing
  lines:
    - kw: Given
      text: 'the report function that runs the checker and formats its outcome'
    - kw: When
      text: it is called on programs
    - kw: Then
      text: 'the report of \x. x is "a -> a", and the report of let n = 5 in n + 1 is "Int"'
    - kw: And
      text: 'the report of 1 + true carried at line 1, column 5 is "cannot unify Bool with Int at line 1, col 5"'
code:
  lang: go
  source: |
    // one entry point that turns a program into a line of text.
    func Report(env Env, e Expr) string {
      t, err := Infer(env, e)
      if err != nil { return err.Error() } // already located, if wrapped in At
      return Show(t)                        // the principal type, variables as a, b, c
    }
checkpoint: A single report call yields the inferred type or the located error as text. Commit and stop here.
---

Everything the checker computes has been reachable only through `Infer` returning a
`Type` or an `error`. The finished product needs one honest **entry point** that a
person - or a demo program - can call and read: give it a program, get back either
the type it inferred or the error explaining why it has none. `Report` is that
function. On success it runs the type through `Show`, so a polymorphic result reads
back as `a -> a` with tidy variable names; on failure it returns the error's message,
which already carries a source position when the program was built with `At`.

This is a small function but an important seam. It is the difference between a
library of internal pieces and a tool with a clear surface: `Report` is what the
capstone calls, and what the finalize step will wrap in a runnable demo that infers a
built-in program and prints its type or its located error. Keeping the two outcomes -
a printed type and a located message - behind one call means the rest of the world
never has to know how inference is plumbed inside. The next lesson checks that all
three kinds of error flow through this report cleanly.
