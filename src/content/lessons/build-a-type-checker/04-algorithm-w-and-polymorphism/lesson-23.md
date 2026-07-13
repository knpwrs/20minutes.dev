---
project: build-a-type-checker
lesson: 23
title: Inferring higher-order functions
overview: With the core rules in place, functions that take functions just work. Today you infer the classic higher-order shapes and watch unification thread a variable through a function argument and back out.
goal: Infer functions whose parameters are themselves functions, with no new checker code.
spec:
  scenario: Principal types of higher-order functions
  status: failing
  lines:
    - kw: Given
      text: 'the higher-order functions \f. \x. f x and \f. \x. f (f x)'
    - kw: When
      text: each is inferred in an empty environment
    - kw: Then
      text: 'Show of the type of \f. \x. f x is "(a -> b) -> a -> b"'
    - kw: And
      text: 'Show of the type of \f. \x. f (f x) is "(a -> a) -> a -> a" - applying f to its own result forces its argument and result types to be the same'
code:
  lang: go
  source: |
    // no new rules today - this is the payoff for lessons 18 to 22.
    // \f. \x. f x : apply drives unify(typeof f, typeof x -> fresh),
    //   discovering that f must be a function a -> b and the call yields b.
    // \f. \x. f (f x) : the OUTER call unifies f's result type with f's
    //   argument type, collapsing them to one variable a.
checkpoint: The checker infers higher-order functions and their principal types unaided. Commit and stop here.
---

Nothing new is needed today, which is the sign the engine is right. Apply the rules
you have to `\f. \x. f x`, the function that applies its first argument to its second.
Inferring the call `f x` invents a fresh result variable and unifies `f`'s type with
`(type of x) -> (that result)`, discovering that `f` is a function `a -> b` and the
call produces `b`. The whole thing comes out `(a -> b) -> a -> b`: the **principal
type**, the most general type the term can have, with nothing pinned down beyond what
the code actually requires.

The second example is subtler and shows unification's reach. In `\f. \x. f (f x)`,
`f` is applied to its own result, so the argument type of `f` must equal the result
type of `f` - and unifying those two variables collapses them into one. The inferred
type is `(a -> a) -> a -> a`: `f` must map a type to itself for the double
application to make sense. You did not write a special case for this; it fell out of
unifying a function with an arrow to a fresh variable, twice. That generality - the
same handful of rules delivering the exact most-general type of any term - is what
makes Algorithm W worth building, and it is why real language type systems are built
on it.
