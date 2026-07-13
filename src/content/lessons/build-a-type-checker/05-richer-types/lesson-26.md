---
project: build-a-type-checker
lesson: 26
title: Comparison operators
overview: Comparisons are the bridge from numbers to conditions - they take Ints but return a Bool. Today you add them, which finally lets you write an if whose condition is computed rather than a literal.
goal: Type the comparison operators, requiring Int operands and yielding a Bool result.
spec:
  scenario: Typing less-than and equals
  status: failing
  lines:
    - kw: Given
      text: 'binary expressions using the comparison operators < and =='
    - kw: When
      text: each is inferred
    - kw: Then
      text: 'the type of 2 < 3 is Bool, and Show of the type of \x. x < 1 is "Int -> Bool"'
    - kw: And
      text: 'Show of the type of \x. \y. if x < y then x else y is "Int -> Int -> Int" - the comparison forces both parameters to Int and the branches return an Int'
code:
  lang: go
  source: |
    //   case *BinOp (Op is "<" or "=="):
    //     lt, s1, err := infer(env, b.Left)
    //     rt, s2, err := infer(applyEnv(s1, env), b.Right)
    //     s3, err := unify(apply(s2, lt), TInt{})   // operands are Int
    //     s4, err := unify(apply(s3, rt), TInt{})
    //     return TBool{}, composeAll(s4, s3, s2, s1), nil  // but the RESULT is Bool
checkpoint: The comparison operators take Int operands and produce a Bool. Commit and stop here.
---

Comparison operators look like arithmetic - two `Int` operands - but they differ in
the one place that matters for typing: the **result** is a `Bool`, not an `Int`.
`2 < 3` is `Bool`, `x == y` is `Bool`. The rule is the same two operand
unifications as arithmetic, with a `Bool` handed back instead of an `Int`. Keeping
the result type honest is exactly the kind of distinction a type checker exists to
enforce: you cannot add the outcome of a comparison to a number.

This small addition unlocks something bigger. Until now every `if` you wrote had a
literal `true` or a bare variable as its condition, because nothing else produced a
`Bool` from data. With comparisons you can finally write a **computed** condition,
and inference threads it all together: in `\x. \y. if x < y then x else y`, the
comparison forces both `x` and `y` to `Int`, the `if` sees a genuine `Bool`
condition, and the branches return an `Int`, so the function is `Int -> Int -> Int`.
Every piece - operators, conditionals, inference - is now cooperating, and the next
lesson adds the recursion that turns this into a real little programming language.
