---
project: build-a-vision-model
lesson: 24
title: Dense backward
overview: A dense layer computes a weighted sum plus a bias for each output. Today you derive its backward pass - the gradient with respect to the weights, the bias, and the input, all from the same upstream gradient.
goal: Derive dW, db and dx for the dense layer from lesson 20, given the upstream gradient from lesson 23.
spec:
  scenario: Backward pass through a fully connected layer
  status: failing
  lines:
    - kw: Given
      text: 'the gradient dL/dz from lesson 23 - about -0.81203, 0.18797, 0.62407 - the flattened input from lesson 19 - 2, 2, 2, 2, 0.5, 1.5, 0.5, 1.5 - and the same 3 by 8 weights from lesson 20'
    - kw: When
      text: 'dense backward is derived - the gradient with respect to every weight, every bias, and every input value'
    - kw: Then
      text: 'db equals dz exactly - about -0.81203, 0.18797, 0.62407'
    - kw: And
      text: 'dW row 0 (class 0) reads about -1.62407 in each of its first four entries, then about -0.40602, -1.21805, -0.40602, -1.21805'
    - kw: And
      text: 'dx entry 0 is about -0.74963 - the input gradient sums each class contribution back through the weight it was multiplied by'
code:
  lang: go
  source: |
    // z[i] = sum_j w[i][j]*x[j] + b[i] for each output i - apply the chain
    // rule to that sum three times: once holding w[i][j] as the variable,
    // once holding b[i], once holding x[j], summed over every i that used it
    func denseBackward(dz, x []float64, w [][]float64) (dW [][]float64, db, dx []float64) {
      // fill dW, db, dx from dz, x, and w here
      return
    }
checkpoint: You can now derive every gradient a dense layer needs from a single upstream vector, and have the exact numbers to check against. Commit and stop for today.
---

A dense layer is a weighted sum plus a bias, computed once per output - and backward through it means asking three separate chain-rule questions of that same sum: how does the loss change if a weight moves, if a bias moves, or if an input value moves. Each answer only needs the upstream gradient from lesson 23 and the values already sitting in the forward pass.

The bias answer is the simplest: nudging a bias changes its output by exactly that much, so its gradient is just the upstream gradient, unchanged. Weights and inputs both take more work, because each one appears inside a sum over several terms - work out, for each, exactly which upstream gradient entries it contributed to and how, before writing any code. Today's numbers give you three separate answers to check the derivation against, not just one.
