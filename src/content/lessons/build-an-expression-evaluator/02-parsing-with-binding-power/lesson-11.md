---
project: build-an-expression-evaluator
lesson: 11
title: Unary minus
overview: A minus sign can negate a value, not just subtract one, and the parser must tell the two apart. Today you add unary minus as a prefix form with its own binding power, higher than multiplication.
goal: Parse a leading minus as a prefix negation node with binding power above the arithmetic tiers.
spec:
  scenario: A leading minus negates the value that follows it
  status: failing
  lines:
    - kw: Given
      text: 'the input "-5"'
    - kw: When
      text: 'it is parsed and rendered with String'
    - kw: Then
      text: 'the rendering is "(-5)"'
    - kw: And
      text: 'parsing "-2 * 3" renders as "((-2) * 3)", so the minus binds tighter than the multiply'
code:
  lang: go
  source: |
    type Un struct { Op string; Operand Expr; Pos int }
    func (u *Un) String() string { return "(" + u.Op + u.Operand.String() + ")" }
    const prefixBP = 30            // above * / % (20), below ^ (comes next lesson)
    // in nud, when the token is Operator "-":
    if t.Kind == Operator && t.Text == "-" {
      operand, err := p.parseExpr(prefixBP)
      if err != nil { return nil, err }
      return &Un{"-", operand, t.Pos}, nil
    }
checkpoint: A leading minus parses as a unary negation that binds tighter than the arithmetic operators. Commit and stop here.
---

The same `-` that means subtraction in `5 - 2` means negation in `-5`, and the
parser distinguishes them by **position**: an infix operator has a value on its left,
while a prefix operator does not. So `nud`, the no-left-operand handler, gains a case
for `-`: it parses one operand and wraps it in a `Un` negation node. The operand is
parsed with a binding power of its own, `30`, which sits **above** the `20` of the
multiplicative tier. That is why `-2 * 3` groups as `((-2) * 3)`: the negation grabs
just the `2`, and the `*` then operates on the result.

A prefix operator uses a single binding power (for the thing on its right) because it
has nothing on its left to compete for. Choosing `30`, higher than ordinary
arithmetic, matches the intuition that `-2` is a single negative value. Where unary
minus sits relative to the **power** operator is a genuinely tricky question, and you
settle it deliberately in the next lesson.
