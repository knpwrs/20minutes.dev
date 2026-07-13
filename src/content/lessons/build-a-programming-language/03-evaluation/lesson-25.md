---
project: build-a-programming-language
lesson: 25
title: Integer arithmetic
overview: Now the evaluator does real math. Today you evaluate infix + - * / on integers, recursively evaluating each side first - and pin down how integer division truncates.
goal: Evaluate the four arithmetic operators on integer operands, respecting precedence from the parser.
spec:
  scenario: Evaluating integer arithmetic
  status: failing
  lines:
    - kw: Given
      text: 'arithmetic expressions over integers'
    - kw: When
      text: 'the evaluator evaluates 2 + 3 * 4, then (2 + 3) * 4, then 7 / 2'
    - kw: Then
      text: 'the results are 14, 20, and 3'
    - kw: And
      text: 'integer division truncates toward zero, so 7 / 2 is 3 and not 3.5'
code:
  lang: go
  source: |
    func evalIntInfix(op string, l, r *Integer) Object {
      switch op {
      case "+": return &Integer{l.Value + r.Value}
      case "-": return &Integer{l.Value - r.Value}
      case "*": return &Integer{l.Value * r.Value}
      case "/": return &Integer{l.Value / r.Value}   // integer division
      }
    }
checkpoint: The evaluator computes integer arithmetic, honoring the parser's precedence. Commit.
---

To evaluate an infix expression, first **recursively evaluate** both sides into
objects, then combine them. When both are integers, `+ - * /` do the obvious
thing. Because the parser already resolved precedence into the tree's shape, the
evaluator does no precedence work at all - `2 + 3 * 4` is `2 + (3 * 4)` in the
tree, so evaluating it bottom-up gives `14` for free.

One boundary matters: this language's numbers are integers, so **division
truncates** - `7 / 2` is `3`, not `3.5`. Name that explicitly, because a learner
porting this to a language with floating-point division could get `3.5` and think
they were right. Floating-point numbers are a deliberate non-goal; keeping numbers
integral keeps every result exactly checkable.
