---
project: build-a-type-checker
lesson: 30
title: List types
overview: Lists are the first collection whose size is not fixed, and their type says one thing, that every element is the same type. Today you add list literals, the empty list, and cons, and enforce that shared element type.
goal: Infer the type of a list, requiring all elements to share one element type.
spec:
  scenario: Building homogeneous lists
  status: failing
  lines:
    - kw: Given
      text: 'list expressions such as [1, 2, 3], the empty list [], and 0 :: [1, 2]'
    - kw: When
      text: each is inferred
    - kw: Then
      text: 'the type of [1, 2, 3] is [Int], Show of the type of [] is "[a]", and the type of 0 :: [1, 2] is [Int]'
    - kw: And
      text: 'inferring [1, true] fails with "cannot unify Int with Bool", because every element of a list must share one type'
code:
  lang: go
  source: |
    type TList struct{ Elem Type }   // String: "[" + Elem + "]"
    type ListLit struct{ Elems []Expr }
    type Cons    struct{ Head, Tail Expr }
    //   case *ListLit: [] gives TList{fresh()}; otherwise infer element 0, then
    //     unify each later element's type against it, and return TList{elem}.
    //   case *Cons: unify the tail's type with TList{ typeof head }, result that list.
checkpoint: A list infers to a list type with one shared element type, or is rejected. Commit and stop here.
---

A **list** holds any number of values, but a type checker insists they all have the
**same** type: `[1, 2, 3]` is a list of `Int`, written `[Int]`, and there is no type
for a list mixing an `Int` and a `Bool`. Enforcing that is a chain of unifications -
infer the first element's type, then unify every later element against it - so
`[1, true]` fails the moment `true` refuses to unify with `Int`. The empty list is
the interesting edge: with no elements to fix the type, it is `[a]` for a fresh `a`,
a list of *some* type to be determined by how it is used.

The `cons` operator `::` prepends an element to a list, and its rule is one
unification: the head has some type, and the tail must be a list of that same type,
so `0 :: [1, 2]` unifies `[Int]` against `[Int]` and yields `[Int]`. This is where
the fresh-variable empty list earns its keep - `0 :: []` unifies the empty list's
`[a]` with `[Int]`, solving `a` to `Int`. A list is a genuinely recursive structure,
and getting its one homogeneity rule right here means the operations you add next can
assume every list they see is uniform.
