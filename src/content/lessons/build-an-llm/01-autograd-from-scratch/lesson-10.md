---
project: build-an-llm
lesson: 10
title: Powers and division
overview: 'Raising a value to a constant power needs one more backward rule - and division turns out to need none at all, once you have that rule and Mul.'
goal: Give Pow a backward closure for raising a value to a constant power, then build Div from Pow and Mul with no new backward rule.
spec:
  scenario: Backpropagating through a power and a quotient
  status: failing
  lines:
    - kw: Given
      text: 'a=2.0, and y built by raising a to the power 3'
    - kw: When
      text: 'Backward is called on y'
    - kw: Then
      text: 'y.Data is 8.0'
    - kw: And
      text: 'a.Grad is 12.0'
    - kw: When
      text: 'instead a=6.0 and b=2.0, y is built by dividing a by b, then Backward is called on y'
    - kw: Then
      text: 'y.Data is 3.0'
    - kw: And
      text: 'a.Grad is 0.5'
    - kw: And
      text: 'b.Grad is -1.5'
code:
  lang: go
  source: |
    // Pow(a, k) gets its own backward closure - the power rule, evaluated
    // at this a (k is a plain float, not a Value). Work out the closed
    // form yourself, the same way you did for Mul and Tanh.
    //
    // Div needs no new rule at all: a/b is just a times b raised to the
    // power -1, so it composes entirely from Pow and Mul you already have.
    func Div(a, b *Value) *Value {
      return Mul(a, Pow(b, -1))
    }
checkpoint: Ten operations now share one engine, and division proved that a new operation does not always need a new backward rule - sometimes it falls out of the ones you already built. Commit and stop for today.
---

`Pow(a, k)` raises a value to a fixed power `k`, where `k` is a plain number fixed at construction time, not another `Value` with its own gradient. That restriction is what keeps its derivative simple - the power rule you already know from calculus applies directly, evaluated at `a`'s current data. Work it out and give `Pow` a backward closure the same way you gave one to `Tanh`.

Division is the payoff. Rather than writing a fourth backward rule from scratch, notice that `a / b` is the same number as `a * b^-1` - a multiplication of `a` by `b` raised to the power `-1`. Build `Div` out of `Mul` and `Pow` exactly that way, and it needs no backward closure of its own at all: gradient already knows how to flow through a multiplication, and it already knows how to flow through a power, so it flows through their combination correctly the moment both pieces exist. That is the last new idea this chapter needs - every operation the rest of the project uses is now built from the same five rules.
