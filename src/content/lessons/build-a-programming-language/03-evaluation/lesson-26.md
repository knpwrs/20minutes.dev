---
project: build-a-programming-language
lesson: 26
title: Comparisons and equality
overview: Expressions that compare produce booleans. Today you evaluate the comparison operators on integers and the equality operators - and equality is where the boolean singletons finally earn their keep.
goal: Evaluate comparison operators on integers and equality operators, returning the boolean singletons.
spec:
  scenario: Evaluating comparisons and equality
  status: failing
  lines:
    - kw: Given
      text: 'comparison and equality expressions'
    - kw: When
      text: 'the evaluator evaluates 1 < 2, then 2 == 2, then true == true, then (1 < 2) == true'
    - kw: Then
      text: 'the results are true, true, true, and true'
    - kw: And
      text: 'boolean equality compares object identity, so true == true is true and true != false is true'
code:
  lang: go
  source: |
    // integer operands: compare .Value for < > == !=, return TRUE/FALSE
    // boolean operands: compare the objects themselves for == and !=
    //   (works because TRUE and FALSE are singletons)
    func nativeBool(b bool) *Boolean { if b { return TRUE }; return FALSE }
checkpoint: Comparisons and equality evaluate to the boolean singletons. Commit.
---

Comparison operators take integers and produce **booleans**: `<` and `>` compare
values, and `==`/`!=` test equality. Always return the shared `TRUE`/`FALSE`
singletons, never fresh boolean objects - a small helper that maps a native bool
to the singleton keeps this consistent.

Equality on **booleans** is where the singleton design pays off: because `true`
is always the same object, `true == true` can be decided by comparing the objects
themselves for identity, no value-unwrapping needed. And since a comparison like
`1 < 2` already yields the `TRUE` singleton, `(1 < 2) == true` compares two
identical objects and is `true`. That uniformity is exactly why you made them
singletons back in lesson 22.
