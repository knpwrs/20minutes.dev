---
project: build-a-type-checker
lesson: 8
title: Explicitly-typed lambdas
overview: Now you can build functions. Today you add lambdas that declare their parameter's type, so the checker can type the body with that parameter in scope and hand back the function's arrow type.
goal: Type a lambda whose parameter carries an explicit type annotation.
spec:
  scenario: Inferring the type of an annotated lambda
  status: failing
  lines:
    - kw: Given
      text: 'lambdas that annotate their parameter, written \x:T. body'
    - kw: When
      text: each is inferred
    - kw: Then
      text: 'the identity lambda \x:Int. x has type Int -> Int'
    - kw: And
      text: '\x:Bool. if x then 1 else 2 has type Bool -> Int'
code:
  lang: go
  source: |
    // \Param : ParamType . Body
    type Lambda struct{ Param string; ParamType Type; Body Expr }
    //   case *Lambda:
    //     inner := extend(env, l.Param, l.ParamType) // param is in scope in the body
    //     bt, err := Infer(inner, l.Body)
    //     return TArrow{l.ParamType, bt}, err
checkpoint: An annotated lambda infers to an arrow from its parameter type to its body type. Commit and stop here.
---

A **lambda** `\x:Int. x` is an anonymous function of one argument. For now it
declares its parameter's type outright, which makes typing it a short, sure step:
put the parameter in the environment at its declared type, infer the **body** under
that extended environment, and the function's type is the arrow from the parameter
type to whatever the body turned out to be. The identity function `\x:Int. x` types
to `Int -> Int`; give the body more to do, like `\x:Bool. if x then 1 else 2`, and
the result type follows the body to `Bool -> Int`.

Notice this reuses the exact environment-extension trick from `let` - a lambda body
is just an expression typed with one more name in scope. Requiring the annotation
today keeps the rule completely mechanical: there is nothing to *discover*, only to
check. That is deliberate. Chapter four's whole job is to make this annotation
optional by *inferring* the parameter type instead, but you cannot appreciate that
machinery until you have felt how straightforward the annotated version is.
