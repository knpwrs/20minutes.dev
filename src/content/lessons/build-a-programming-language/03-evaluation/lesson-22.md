---
project: build-a-programming-language
lesson: 22
title: Booleans and null
overview: Alongside integers the language has boolean values and a null. Today you add those objects - and since there are only ever two booleans and one null, you make them shared singletons.
goal: Evaluate boolean literals into shared true and false singleton objects, and define a single null.
spec:
  scenario: Evaluating boolean literals
  status: failing
  lines:
    - kw: Given
      text: 'the source true'
    - kw: When
      text: 'the evaluator evaluates the program'
    - kw: Then
      text: 'the result is the boolean object whose value is true and whose Inspect is true'
    - kw: And
      text: 'evaluating true twice returns the very same object both times'
code:
  lang: go
  source: |
    type Boolean struct { Value bool }
    type Null struct {}
    var (
      TRUE  = &Boolean{Value: true}
      FALSE = &Boolean{Value: false}
      NULL  = &Null{}
    )
    // a Boolean literal node -> return TRUE or FALSE (never a fresh object)
checkpoint: Boolean literals evaluate to shared singletons, and null exists. Commit.
---

Integers are unbounded, so each one is its own object. But there are only ever
**two** booleans and **one** null, so allocating a fresh object for each is
wasteful and, more importantly, makes comparison awkward. Instead, create them
once as package-level **singletons** - `TRUE`, `FALSE`, `NULL` - and always
return those same instances.

This pays off immediately in the next lessons: because `true` is always the exact
same object, you can later test boolean equality by comparing object *identity*
rather than unwrapping values. Evaluating `true` twice returning the identical
object is the observable proof the singletons are shared, not copied.
