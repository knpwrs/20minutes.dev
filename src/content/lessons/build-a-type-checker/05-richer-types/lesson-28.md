---
project: build-a-type-checker
lesson: 28
title: Tuple types
overview: Tuples are the first way to bundle several values into one, and they need a type with several types inside it. Today you add tuple construction and teach unification to compare tuples position by position.
goal: Infer the type of a tuple, and unify tuples component by component.
spec:
  scenario: Constructing and unifying tuples
  status: failing
  lines:
    - kw: Given
      text: 'tuple expressions such as (1, true) and (1, true, "hi")'
    - kw: When
      text: each is inferred
    - kw: Then
      text: 'the type of (1, true) is (Int, Bool), the type of (1, true, "hi") is (Int, Bool, String), and Show of the type of \x. (x, x) is "a -> (a, a)"'
    - kw: And
      text: 'a two-tuple type and a three-tuple type never unify, so unifying (Int, Bool) with (Int, Bool, Int) fails'
code:
  lang: go
  source: |
    type TTuple struct{ Elems []Type }  // String: "(T1, T2, ...)"
    type Tuple  struct{ Elems []Expr }
    //   case *Tuple: infer each element, threading the substitution, collect into a TTuple.
    // unify, new case - both TTuple:
    //   if len(a.Elems) != len(b.Elems) { return nil, fmt.Errorf("cannot unify %s with %s", a, b) }
    //   unify element i against element i, carrying the substitution forward, and compose.
    // A new compound type also needs a case in every type-walker: apply (substitute
    //   into each element), occurs (recurse into each element), and freeVars.
checkpoint: Tuples infer to a tuple type and unify element by element. Commit and stop here.
---

A **tuple** groups a fixed number of values of possibly different types into one
value, and its type mirrors that: `(1, true)` has type `(Int, Bool)`. This is the
first **product type** in the language, and building it is straightforward - infer
each element in turn (threading the substitution so earlier elements' discoveries
reach later ones) and collect the results into a `TTuple`. Because a tuple can hold a
variable-typed element, `\x. (x, x)` infers to `a -> (a, a)`: whatever `x` is, both
components share it.

The rule that makes tuples first-class in the inference engine is **unification**.
Two tuple types unify only when they have the **same length** and each corresponding
pair of elements unifies - so `(a, Int)` unifies with `(Bool, b)` to solve `a` and
`b`, but a two-tuple and a three-tuple can never be made equal and unification fails
outright. Getting the length check in now matters: it is the tuple version of the
arity guard, and it means the projections you add next can rely on a value really
being a pair before they try to pull it apart. One easy thing to overlook: a tuple
is a compound type, so the recursive functions that walk types - `apply`, the occurs
check, and the free-variable scan - each need a tuple case that recurses into every
element, or substitutions and generalization will silently skip variables hidden
inside a tuple.
