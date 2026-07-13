---
project: build-a-type-checker
lesson: 10
title: When application goes wrong
overview: Last lesson handled the happy path; today you catch the two ways a call can fail. A function checker earns its keep by rejecting a non-function call and an argument of the wrong type, each with a clear message.
goal: Reject applying a non-function and applying a function to a wrongly-typed argument.
spec:
  scenario: The two failure cases of application
  status: failing
  lines:
    - kw: Given
      text: 'the applications 5 3 (the literal 5 applied to 3) and (\x:Int. x) true'
    - kw: When
      text: each is inferred
    - kw: Then
      text: '5 3 fails with the error "not a function: Int"'
    - kw: And
      text: '(\x:Int. x) true fails with the error "argument type mismatch: expected Int, got Bool"'
code:
  lang: go
  source: |
    //   case *App:
    //     ft, err := Infer(env, a.Func)  // ... propagate err
    //     arrow, ok := ft.(TArrow)       // must be a function
    //     if !ok { return nil, fmt.Errorf("not a function: %s", ft) }
    //     at, err := Infer(env, a.Arg)   // ... propagate err
    //     if !Equal(at, arrow.From) {
    //       return nil, fmt.Errorf("argument type mismatch: expected %s, got %s", arrow.From, at)
    //     }
    //     return arrow.To, nil
checkpoint: Application rejects a non-function and a mistyped argument with clear errors. Commit and stop here.
---

Yesterday's application rule assumed everything lined up. A real checker has to say
**no** clearly, and application can fail in exactly two ways. The first is applying
something that is not a function at all: in `5 3`, the thing in function position
has type `Int`, and an `Int` cannot be called, so the checker reports `not a
function: Int`. The second is calling a function with the wrong argument:
`(\x:Int. x)` expects an `Int`, and `true` is a `Bool`, so the checker reports
`argument type mismatch: expected Int, got Bool`.

These two messages are worth pinning down now, because they are the shape every good
type error takes: name **what** was wrong and **which types** were involved. The
argument-mismatch message in particular - "expected this, got that" - is the exact
phrasing the inference engine will reuse once `Equal` gives way to unification, and
the located diagnostics in the final chapter dress up with a source position. Get
the two guards and their wording right, and the rest of the checker just fires them
from deeper inside bigger programs.
