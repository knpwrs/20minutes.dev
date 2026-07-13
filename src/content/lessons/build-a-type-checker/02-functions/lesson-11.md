---
project: build-a-type-checker
lesson: 11
title: Checking a program with functions
overview: Chapter two closes by pointing the checker at a program that binds a function, then calls it. Nothing new to build - this is the payoff that proves lambdas, application, let, and the environment all compose.
goal: Type-check a let-bound function applied to an argument, and reject the ill-typed call.
spec:
  scenario: Binding a function with let and calling it
  status: failing
  lines:
    - kw: Given
      text: 'the program let f = \x:Int. x in f 5'
    - kw: When
      text: it is inferred in an empty environment
    - kw: Then
      text: 'its type is Int'
    - kw: And
      text: 'the variant let f = \x:Int. x in f true fails with "argument type mismatch: expected Int, got Bool"'
code:
  lang: go
  source: |
    // build the AST by hand and infer it - no new checker code today:
    //   Let{"f", Lambda{"x", TInt{}, Var{"x"}},
    //     App{Var{"f"}, IntLit{5}}}
    // the let rule binds f to Int -> Int; the app rule then checks the call.
    // the failing variant swaps the argument IntLit{5} for BoolLit{true}.
checkpoint: The checker types a let-bound function and its application, and rejects the bad call. Commit and stop here.
---

This is the same kind of checkpoint as the end of chapter one, one layer richer.
`let f = \x:Int. x in f 5` leans on every rule you have: the lambda rule types `f`
as `Int -> Int`, the let rule binds that arrow into the environment, the variable
rule resolves `f` inside the body, and the application rule checks that `5` matches
the parameter and yields `Int`. No arm of `Infer` changes today; if the earlier
lessons are sound, the whole program types to `Int` on its own.

The ill-typed variant is the other half of the story. Swap the argument to `true`
and the application rule fires the mismatch error from the previous lesson, now from
inside a `let`. You now have a complete checker for the explicitly-typed core of the
language: literals, variables, `let`, `if`, functions, and calls. What it still
cannot do is figure a type out for itself - every lambda has to spell out its
parameter type. Removing that requirement is the whole of the next two chapters, and
it starts with a way to represent a type you do not know yet.
