---
project: build-an-expression-evaluator
lesson: 10
title: Parentheses as grouping
overview: Parentheses let a writer override precedence and force a grouping the binding powers would not give. Today you handle them as a prefix form that parses a fresh subexpression and expects a closing parenthesis.
goal: Parse a parenthesized subexpression as a prefix form that resets the binding-power floor.
spec:
  scenario: Parentheses override precedence
  status: failing
  lines:
    - kw: Given
      text: 'the input "(2 + 3) * 4"'
    - kw: When
      text: 'it is parsed and rendered with String'
    - kw: Then
      text: 'the rendering is "((2 + 3) * 4)"'
    - kw: And
      text: 'the parentheses add no node of their own; they only change the grouping'
code:
  lang: go
  source: |
    // in nud, alongside the Number case:
    if t.Kind == LParen {
      inner, err := p.parseExpr(0)     // fresh floor: parse a whole subexpression
      if err != nil { return nil, err }
      p.next()                          // consume the ")"  (matching it comes later)
      return inner, nil
    }
checkpoint: Parentheses group a subexpression and override precedence. Commit and stop here.
---

A parenthesis is a **prefix** form: when `nud` sees a `(`, it parses a complete
subexpression starting from a fresh floor of `0`, then consumes the matching `)`.
Resetting the floor to `0` is what makes the parentheses powerful: inside them, no
outer operator's binding power reaches in, so `(2 + 3)` groups as a unit even though
the `*` outside would otherwise pull the `3` away. The result is that `(2 + 3) * 4`
renders as `((2 + 3) * 4)` and will evaluate to `20`.

The parentheses themselves produce **no node**. They are pure grouping: the tree for
`(2 + 3)` is just the `Bin` for `2 + 3`, indistinguishable from what you would build
if precedence had grouped it that way on its own. For now assume the `)` is really
there and simply consume it; noticing when it is **missing**, and reporting that
clearly, is a job for the errors chapter.
