---
project: build-an-llm
lesson: 8
title: The chain rule through tanh
overview: 'Tanh squashes a number through a curve rather than combining two values - its backward rule needs the chain rule instead of the product or sum rule.'
goal: Give Tanh a backward closure so gradient flows through it the same way it already flows through Add and Mul.
spec:
  scenario: Backpropagating through tanh
  status: failing
  lines:
    - kw: Given
      text: 'x=0.5, and y built by applying tanh to x'
    - kw: When
      text: 'Backward is called on y'
    - kw: Then
      text: 'y.Data is about 0.462117'
    - kw: And
      text: 'x.Grad is about 0.786448'
code:
  lang: go
  source: |
    // give Tanh a backward closure. The chain rule multiplies the
    // upstream gradient by tanh's OWN local derivative at this x - and
    // that derivative has a clean closed form written in terms of t,
    // the output you already computed below, not in terms of x itself
    func Tanh(a *Value) *Value {
      t := math.Tanh(a.Data)
      out := &Value{Data: t, children: []*Value{a}, op: "tanh"}
      out.backward = func() {
        // route out.Grad to a.Grad using tanh's own derivative here
      }
      return out
    }
checkpoint: A gradient now flows through a curved, single-input function, not just through sums and products of two values. Commit and stop for today.
---

Every backward rule so far has combined two separate values. `tanh` is different: it takes one input and squashes it through an S-shaped curve, and its local gradient is not "how much does one input matter relative to another" but "how steep is the curve, right here, at this particular input." That steepness is what the **chain rule** multiplies the upstream gradient by - the same idea as the sum and product rules, just applied to a curve instead of an arithmetic operation.

The useful shortcut is that `tanh`'s steepness at any point can be written entirely in terms of the value `tanh` already produced there, without recomputing anything from `x`. You have that value sitting in `t` the moment you compute the forward pass, so the backward closure needs no extra work to look it up. Work out that closed form for yourself - it is one of the cleanest derivatives in calculus, and it is exactly why `tanh` was the activation function early neural networks reached for.
