---
project: build-a-type-checker
lesson: 1
title: The base types
overview: A type checker's whole job is to decide whether two types are the same, so before anything else you need types you can represent and compare. Today you build the three base types and the equality check that every later rule leans on.
goal: Represent the Int, Bool, and String types and decide whether two types are equal.
spec:
  scenario: Comparing base types for equality
  status: failing
  lines:
    - kw: Given
      text: the three base types Int, Bool, and String
    - kw: When
      text: two types are compared for equality
    - kw: Then
      text: Int equals Int and String equals String
    - kw: And
      text: Int does not equal Bool, and Int does not equal String
code:
  lang: go
  source: |
    // a Type is one of a small, growing set of shapes.
    // Start with the three ground types as distinct values.
    type Type interface{ typeNode() }
    type TInt struct{}
    type TBool struct{}
    type TString struct{}
    // Equal answers the one question the checker asks constantly.
    func Equal(a, b Type) bool { /* same shape? */ }
checkpoint: You can name the base types and ask whether two of them are equal. Commit and stop here.
---

A type checker is, at heart, a machine that keeps asking one question: **are these
two types the same?** Is the thing in the `then` branch the same type as the thing
in the `else` branch? Is the argument the same type the function expects? Every
rule you write from here reduces to that comparison, so the very first thing to
build is a way to **represent** a type and a way to **compare** two of them.

Start with the three **base types** - `Int`, `Bool`, and `String` - as distinct
values, and a single `Equal` function that reports whether two types have the same
shape. Right now "same shape" just means "same base type", but this is the seam the
whole project widens: soon a type can be a function, a tuple, or an unknown to be
discovered, and `Equal` (and later, unification) will compare those structurally
too. Keep today's version as simple as it looks.
