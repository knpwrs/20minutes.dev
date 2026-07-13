---
project: build-a-type-checker
lesson: 25
title: Arithmetic operators
overview: A language that can only apply functions is thin, so today you add arithmetic. Each operator is a small typing rule that requires Int operands and produces an Int - and, through inference, pins down an unknown to Int.
goal: Type the arithmetic operators, requiring Int operands and yielding an Int result.
spec:
  scenario: Typing plus, minus, and times
  status: failing
  lines:
    - kw: Given
      text: 'binary expressions using the arithmetic operators + - *'
    - kw: When
      text: each is inferred
    - kw: Then
      text: 'the type of 2 + 3 is Int, and Show of the type of \x. x + 1 is "Int -> Int"'
    - kw: And
      text: 'true + 1 fails with "cannot unify Bool with Int", because an operand of + must be an Int'
code:
  lang: go
  source: |
    // one node covers the whole family; the operator string picks the rule.
    type BinOp struct{ Op string; Left, Right Expr }
    //   case *BinOp (Op is "+", "-", or "*"):
    //     lt, s1, err := infer(env, b.Left)
    //     rt, s2, err := infer(applyEnv(s1, env), b.Right)
    //     s3, err := unify(apply(s2, lt), TInt{})   // left must be Int
    //     s4, err := unify(apply(s3, rt), TInt{})   // right must be Int
    //     return TInt{}, composeAll(s4, s3, s2, s1), nil
checkpoint: The arithmetic operators require Int operands and produce an Int. Commit and stop here.
---

Real programs compute, so the language needs operators. Arithmetic is the simplest
family: `+`, `-`, and `*` each take two `Int`s and give back an `Int`. The typing
rule is a pair of unifications - force the left operand to `Int`, force the right to
`Int` - and then the result is always `Int`. A single `BinOp` node carries all
three, with the operator string selecting the rule, because they type identically;
only their runtime meaning differs.

The interesting part is what unification does for you here. Because the operands are
**unified** with `Int` rather than merely checked, an operator can *pin down* an
unknown: in `\x. x + 1`, the parameter `x` starts as a fresh variable, and using it
under `+` unifies that variable with `Int`, so the whole function infers to
`Int -> Int` with no annotation in sight. And an operand that cannot be an `Int`,
like the `true` in `true + 1`, is rejected with the same `cannot unify` error the
rest of the engine speaks. This is the first of several small rules that widen the
language while reusing everything you have already built.
