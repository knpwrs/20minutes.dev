---
project: build-an-llm
lesson: 36
title: A feed-forward network
overview: 'Every position gets pushed through its own small two-layer network - a linear layer, a tanh, then another linear layer - independently of every other position.'
goal: Build a feed-forward network of Linear, Tanh, Linear and run it over the input tensor.
spec:
  scenario: Running the input through a two-layer feed-forward network
  status: failing
  lines:
    - kw: Given
      text: 'X (3x8) from lesson 26, a first linear layer (8x8 weights, formula (((row*7 + col*11 + seed*13) mod 5) - 2) * 0.05, seed 50, zero bias), and a second linear layer (8x8 weights, same formula, seed 51, zero bias)'
    - kw: When
      text: 'X is passed through the first linear layer, then tanh is applied to every entry, then the result is passed through the second linear layer'
    - kw: Then
      text: 'the hidden tensor (3x8, after tanh) has row 0 [0.054945, 0.014999, -0.024995, 0.01, -0.054945, 0.054945, 0.014999, -0.024995]'
    - kw: And
      text: 'the final output (3x8) has row 0 [0.006242, 0.00599, -0.019235, -0.00449, 0.011494, 0.006242, 0.00599, -0.019235]'
    - kw: And
      text: 'row 1 of the final output is [-0.028446, -0.009724, 0.035172, -0.002245, 0.005244, -0.028446, -0.009724, 0.035172]'
    - kw: And
      text: 'row 2 of the final output is [0.00774, 0.017728, -0.01473, -0.00474, -0.005998, 0.00774, 0.017728, -0.01473]'
code:
  lang: go
  source: |
    // Linear -> Tanh -> Linear, applied to every row independently -
    // no row ever reads another row's entries, unlike attention
    type FFN struct {
      L1, L2 *Linear
    }
    func (f *FFN) Forward(x *Tensor) *Tensor {
      return f.L2.Forward(TanhTensor(f.L1.Forward(x)))
    }
checkpoint: You have a feed-forward network that transforms every position's vector independently. Commit and stop for today.
---

Attention lets positions share information with each other; a **feed-forward network** does the opposite - it processes every row on its own, with no row ever reading another row's entries. The shape is a small two-layer network: a linear layer widens or reshapes the vector, `tanh` bends it nonlinearly, and a second linear layer brings it back to the model's width. Nothing here is new arithmetic - `Linear` is chapter 3's, `Tanh` is chapter 1's - only the composition is new.

Where attention mixes information *across* positions, the feed-forward network gives each position room to transform the information it already has. A transformer block, coming up in lesson 38, alternates the two: attention to mix across positions, then a feed-forward network to process each position on its own.
