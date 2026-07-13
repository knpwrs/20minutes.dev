---
project: build-a-type-checker
lesson: 7
title: Function types
overview: Functions are values, so they need types too - and a function type is the first type with structure inside it. Today you add the arrow type and teach equality and printing to look inside it.
goal: Represent function types as arrows and compare and print them structurally.
spec:
  scenario: Building, comparing, and printing arrow types
  status: failing
  lines:
    - kw: Given
      text: 'the function types Int -> Bool and (Int -> Bool) -> Bool'
    - kw: When
      text: they are compared and printed
    - kw: Then
      text: 'Int -> Bool equals Int -> Bool but not Int -> Int'
    - kw: And
      text: 'printing Int -> (Bool -> Bool) gives "Int -> Bool -> Bool" and printing (Int -> Bool) -> Bool keeps the parentheses: "(Int -> Bool) -> Bool"'
code:
  lang: go
  source: |
    // an arrow type carries two types: what it takes and what it returns.
    type TArrow struct{ From, To Type }
    // Equal must now recurse into both sides.
    // String prints right-associatively: the arrow groups to the RIGHT,
    // so only a From that is itself an arrow needs parentheses.
    func (t TArrow) String() string { /* "From -> To", paren From if arrow */ }
checkpoint: You can build, compare, and print function types. Commit and stop here.
---

A function has a type just like a number does, and it is the first type with other
types **inside** it: a function from `Int` to `Bool` has type `Int -> Bool`. This
is the **arrow type**, and adding it means `Equal` can no longer just compare tags -
two arrows are equal only when their argument types match *and* their result types
match, which is a recursive comparison. That recursion is the seed of unification a
few chapters from now.

Printing arrows introduces one convention worth fixing early: the arrow
**associates to the right**, so `Int -> Bool -> Bool` always means
`Int -> (Bool -> Bool)`, the type of a function that takes an `Int` and returns
*another* function. Because of that, only a *left* side that is itself an arrow
needs parentheses to stay unambiguous - `(Int -> Bool) -> Bool` is a genuinely
different type, a function that takes a function. Getting this printing right now
pays off at the end, when every inferred type is shown back to the user.
