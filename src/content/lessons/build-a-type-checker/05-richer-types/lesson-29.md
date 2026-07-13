---
project: build-a-type-checker
lesson: 29
title: Projecting from tuples
overview: A pair you cannot take apart is not much use, so today you add the projections fst and snd. They are the first rules that unify a value against a shape to pull a piece out - and they are naturally polymorphic.
goal: Infer fst and snd by unifying the operand against a pair type and returning a component.
spec:
  scenario: Inferring the projections of a pair
  status: failing
  lines:
    - kw: Given
      text: 'the projections fst and snd applied to pairs'
    - kw: When
      text: each is inferred
    - kw: Then
      text: 'the type of fst (1, true) is Int, and the type of snd (1, true) is Bool'
    - kw: And
      text: 'Show of the type of \p. fst p is "(a, b) -> a" - fst works on any pair and returns its first component'
code:
  lang: go
  source: |
    type Fst struct{ Arg Expr }   // and Snd
    //   case *Fst:
    //     et, s1, err := infer(env, f.Arg)
    //     a, b := fresh(), fresh()
    //     s2, err := unify(apply(s1, et), TTuple{[]Type{a, b}}) // the arg must be a pair
    //     if err != nil { return nil, nil, err }
    //     return apply(s2, a), compose(s2, s1), nil             // snd returns b
checkpoint: fst and snd take a pair apart, and infer a polymorphic type. Commit and stop here.
---

Building a pair is only half of it; you also need to take one apart. `fst` and `snd`
project out the first and second components, and typing them shows off unification
from a new angle. You do not require the operand to already *be* a known pair type -
instead you invent two fresh variables `a` and `b`, **unify** the operand's type with
the pair type `(a, b)`, and return the component you want. If the operand really is a
`(Int, Bool)`, unification solves `a` to `Int`, and `fst` yields `Int`; if it is not
a pair at all, unification fails and the projection is rejected.

Because the shape you unify against is built from fresh variables, the projections
come out **polymorphic** for free: `\p. fst p` infers to `(a, b) -> a`, a function
that accepts *any* pair and returns whatever its first component happens to be. This
"unify against a shape with holes, then read a hole back" pattern is the same move
you will use for lists and records, and it is a small taste of how real type systems
handle data constructors and pattern matching - every destructor is a unification
against the shape its constructor built.
