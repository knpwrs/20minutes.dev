---
project: build-a-type-checker
lesson: 9
title: Application
overview: A function you cannot call is not much use. Today you add application - the rule that checks an argument against what a function expects and yields the function's result type.
goal: Type a function application, checking the argument type against the parameter type.
spec:
  scenario: Applying a function to an argument
  status: failing
  lines:
    - kw: Given
      text: 'function applications over annotated lambdas'
    - kw: When
      text: each is inferred
    - kw: Then
      text: 'the type of (\x:Int. x) 5 is Int'
    - kw: And
      text: 'the type of (\x:Bool. if x then 1 else 2) true is Int'
code:
  lang: go
  source: |
    // Func applied to Arg
    type App struct{ Func, Arg Expr }
    //   case *App:
    //     ft, _ := Infer(env, a.Func) // must be an arrow From -> To
    //     at, _ := Infer(env, a.Arg)
    //     // require Equal(at, ft.From); the type of the whole app is ft.To
checkpoint: Applying a function to a well-typed argument yields the function's result type. Commit and stop here.
---

**Application** is where functions do their work: `f x` runs `f` on `x`. To type
it, infer the function's type and the argument's type, then check that they fit -
the function's type must be an arrow `From -> To`, and the argument's type must be
the arrow's `From`. When they match, the type of the whole application is the
arrow's `To`. So `(\x:Int. x) 5` types the function to `Int -> Int`, checks that
the argument `5` is the expected `Int`, and yields `Int`.

This is the second place `Equal` does the real work - comparing the argument type
against the parameter type - and it is the rule that makes functions composable:
because application returns the result type, you can feed one call straight into
another. Keep today to the happy path where everything lines up; the next lesson
owns the two ways it can go wrong. That split is deliberate, so this lesson stays a
single clean rule.
