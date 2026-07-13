---
project: build-a-type-checker
lesson: 24
title: Inferring a whole program
overview: Chapter four closes by inferring a program that has no annotations anywhere - nested lets, a polymorphic helper used twice, and a rejected ill-typed variant. This is the full inference engine working end to end.
goal: Infer an unannotated multi-binding program, and reject an ill-typed one.
spec:
  scenario: End-to-end inference over a real program
  status: failing
  lines:
    - kw: Given
      text: 'the program let id = \x. x in let const = \x. \y. x in const (id 5) true'
    - kw: When
      text: it is inferred in an empty environment
    - kw: Then
      text: 'its type is Int - const returns its first argument id 5, which is Int, ignoring the second'
    - kw: And
      text: 'the program \x. if x then x else 1 fails with "cannot unify Bool with Int", because the condition forces x to Bool but a branch returns it where an Int is expected'
code:
  lang: go
  source: |
    // build the AST and infer it - no new checker code today:
    //   Let{"id", Lambda{Param: "x", Body: Var{"x"}},   // ParamType nil = unannotated
    //     Let{"const", Lambda{Param: "x", Body: Lambda{Param: "y", Body: Var{"x"}}},
    //       App{App{Var{"const"}, App{Var{"id"}, IntLit{5}}}, BoolLit{true}}}}
    // id generalizes to forall a. a -> a; const to forall a b. a -> b -> a.
checkpoint: The inference engine types a fully unannotated program and rejects an ill-typed one. Commit and stop here.
---

This is the promise of the chapter, delivered. The program
`let id = \x. x in let const = \x. \y. x in const (id 5) true` has no type
annotation anywhere, yet the checker works out that `id` is polymorphic
(`forall a. a -> a`), that `const` is `forall a b. a -> b -> a`, that `id 5` is
`Int`, and that `const` applied to an `Int` and a `Bool` returns the `Int` - so the
whole program has type `Int`. Every mechanism you built carries some of that weight:
fresh variables, unification, substitution threading, generalization at each `let`,
and instantiation at each use.

The rejection matters just as much. `\x. if x then x else 1` looks plausible until
you follow the constraints: using `x` as a condition forces it to `Bool`, but then
the `then` branch returns that same `Bool` where the `else` branch says the result
is `Int`, and the two cannot agree - `cannot unify Bool with Int`. A checker that
accepted it would let a `Bool` flow where an `Int` is needed at runtime. You now have
a complete Hindley-Milner inference engine for the functional core: literals,
variables, `let`, `if`, functions, application, and full let-polymorphism, inferring
the principal type of any program in that fragment. The remaining chapters widen the
language it accepts and sharpen the errors it reports.
