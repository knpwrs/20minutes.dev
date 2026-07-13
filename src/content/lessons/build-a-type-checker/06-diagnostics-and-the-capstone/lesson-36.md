---
project: build-a-type-checker
lesson: 36
title: 'Capstone: infer a program, report an error'
overview: The finale points the finished checker at a real program with no annotations, watches it derive the principal type on its own, and then reports the located error in a broken one. This is the whole project working end to end.
goal: Infer the principal type of an unannotated program, and report the located error in an ill-typed one.
spec:
  scenario: Principal type inference and located error reporting
  status: failing
  lines:
    - kw: Given
      text: 'a polymorphic program and an ill-typed program built as ASTs'
    - kw: When
      text: each is reported
    - kw: Then
      text: 'the report of let compose = \f. \g. \x. f (g x) in compose is "(a -> b) -> (c -> a) -> c -> b"'
    - kw: And
      text: 'the report of let x = 5 in (if x then 1 else 2), with the if carried at line 1, column 18, is "cannot unify Int with Bool at line 1, col 18"'
code:
  lang: go
  source: |
    // no new checker code - the capstone assembles the ASTs and calls Report:
    //   compose := Let{"compose",   // Lambda ParamType nil = unannotated
    //     Lambda{Param: "f", Body: Lambda{Param: "g", Body: Lambda{Param: "x",
    //       Body: App{Var{"f"}, App{Var{"g"}, Var{"x"}}}}}},
    //     Var{"compose"}}
    //   bad := Let{"x", IntLit{5},
    //     At{1, 18, If{Var{"x"}, IntLit{1}, IntLit{2}}}}
    // Report(Env{}, compose) == "(a -> b) -> (c -> a) -> c -> b"
checkpoint: The checker infers a program's principal type and reports the located error in another. The project is complete - commit and stop here.
---

This is what the whole project was for. Hand the checker `compose`, the function that
chains two functions - `\f. \g. \x. f (g x)` - with **no annotations anywhere**, and
it works out the most general type any implementation could have:
`(a -> b) -> (c -> a) -> c -> b`. Every mechanism you built carries part of that
answer. Fresh variables stand in for the unknown types of `f`, `g`, and `x`.
Application unifies each call against an arrow to a fresh result. Substitutions thread
the discoveries through. Generalization at the `let` makes `compose` polymorphic. And
`Show` renames the tangle of internal variables to the clean `a`, `b`, `c` a reader
expects. Nobody told the checker any of these types; it derived the **principal type**
from the structure of the code alone.

The second half is the other side of the promise. `let x = 5 in if x then 1 else 2`
binds `x` to `Int` and then uses it as a condition, and the checker refuses -
`cannot unify Int with Bool at line 1, col 18` - naming both the conflict and the
exact spot. From three ground types and an equality check, you have built a real
Hindley-Milner type checker: it infers the principal type of an unannotated program
across functions, `let`-polymorphism, recursion, tuples, lists, and records, and it
reports the first type error with a source location. It takes a pre-built AST rather
than parsing source, and it stops at the first error rather than collecting them all -
honest limits for a teaching-grade checker - but the core it implements is exactly the
one at the heart of ML, Haskell, and every language that infers your types for you.
That is a real type checker, and it is yours.
