---
project: build-an-llm
lesson: 6
title: The product rule
overview: 'Multiplication routes gradient differently from addition - each input needs the OTHER input''s value. Today Mul gets its backward closure.'
goal: Give Mul a backward closure so Backward works through multiplication as well as addition.
spec:
  scenario: Backpropagating through a product
  status: failing
  lines:
    - kw: Given
      text: 'a=2.0, b=-3.0, and e built by multiplying a and b'
    - kw: When
      text: 'Backward is called on e'
    - kw: Then
      text: 'e.Grad is 1.0'
    - kw: And
      text: 'a.Grad is -3.0'
    - kw: And
      text: 'b.Grad is 2.0'
code:
  lang: go
  source: |
    // give Mul a backward closure: differentiate a*b with respect to a
    // (holding b fixed), and with respect to b (holding a fixed) - each
    // partial derivative comes out in terms of the OTHER value's Data
    func Mul(a, b *Value) *Value {
      out := &Value{Data: a.Data * b.Data, children: []*Value{a, b}, op: "*"}
      out.backward = func() {
        // route out.Grad to a.Grad and to b.Grad here
      }
      return out
    }
checkpoint: Backward now works through both addition and multiplication - two different local rules, one traversal. Commit and stop for today.
---

Addition's local rule was the same for both inputs: a nudge in either one passes straight through unchanged. Multiplication does not work that way. If `e = a * b`, nudging `a` by a little changes `e` by that nudge scaled by whatever `b` currently is - and nudging `b` scales by whatever `a` currently is. The two inputs need each other's data to know their own local gradient, which is the first time this engine's backward pass has needed to look at more than the upstream gradient alone.

Work out the two partial derivatives yourself before you write any code - what does `e` change by per unit of `a`, holding `b` fixed, and what does it change by per unit of `b`, holding `a` fixed? Today's spec gives you both answers already: `a.Grad` comes out equal to `b`'s data, and `b.Grad` comes out equal to `a`'s data. Confirm your own derivation lands there before moving on, because the same reasoning - hold everything else fixed, differentiate with respect to one input - is what every remaining backward rule in this chapter asks of you.
