---
project: build-a-type-checker
lesson: 19
title: Application drives inference
overview: A lambda's parameter only gets pinned down by how it is used, and the first place it is used is a function call. Today you teach application to infer through an unknown function type - and to reject self-application.
goal: Infer application by unifying an unknown function type with an arrow to a fresh result variable.
spec:
  scenario: Inferring application, including self-application
  status: failing
  lines:
    - kw: Given
      text: 'applications of unannotated functions'
    - kw: When
      text: each is inferred in an empty environment
    - kw: Then
      text: 'the type of (\x. x) 5 is Int, and the type of (\x. x) true is Bool'
    - kw: And
      text: 'inferring \x. x x fails with "occurs check failed: a occurs in a -> b", because self-application would need an infinite type'
code:
  lang: go
  source: |
    //   case *App: infer ft (the function), then at (the argument).
    //   switch f := apply(s2, ft).(type) {
    //   case TVar:                       // unknown: solve it by unifying with an arrow
    //     tv := fresh()
    //     s3, err := unify(f, TArrow{at, tv})   // may hit the occurs check
    //     return apply(s3, tv), compose(s3, compose(s2, s1)), nil
    //   case TArrow:                     // known arrow: check the argument as before
    //     s3, err := unify(f.From, at)   // keep the lesson-10 mismatch message on failure
    //     return apply(s3, f.To), ... , nil
    //   default: return nil, nil, fmt.Errorf("not a function: %s", f)
    //   }
checkpoint: Application infers through an unknown function type and rejects self-application. Commit and stop here.
---

An unannotated function is a blank until something uses it, and application is the
first user. When the function's type is still an unknown variable, infer the argument,
invent a fresh variable for the result, and demand by **unification** that the
unknown is an arrow **from** the argument type **to** that result. When the function's
type is already a known arrow - as it is for the identity `\x. x`, whose type is
`a -> a` - check the argument against the parameter side and take the result side,
keeping the clear "not a function" and argument-mismatch messages from chapter two.
So `(\x. x) 5` unifies the identity's `a` with `Int` and yields `Int`, while the same
function on `true` yields `Bool`: the placeholder is solved afresh from each use.

The failure case is the famous one. `\x. x x` applies `x` to itself: with `x` typed as
a fresh `a`, the call asks to unify `a` with `a -> b`, and the occurs check from
chapter three fires - no finite type can be a function taking itself, so the checker
reports the infinite type. Application threads substitutions with care: the argument is
inferred under the function's discoveries, and the result variable is resolved through
the final substitution. Skip that threading and a function used at two types in one
expression would come out wrong.
