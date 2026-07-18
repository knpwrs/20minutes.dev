---
project: build-a-vision-model
lesson: 20
title: A dense layer
overview: A dense layer connects every input to every output, each connection carrying its own weight - the classic fully connected layer. Today you compute one from the flattened vector lesson 19 built.
goal: Compute z = W times x plus b for a pinned 3 by 8 weight matrix against the flattened vector from lesson 19, producing 3 class scores.
spec:
  scenario: A fully connected layer over 3 classes
  status: failing
  lines:
    - kw: Given
      text: 'the 8-element flattened vector from lesson 19, whose values are 2, 2, 2, 2, 0.5, 1.5, 0.5, 1.5'
    - kw: And
      text: 'a 3 by 8 weight matrix, one row of 8 weights per class - row 0 is 1, 0, -1, 0, 0.5, 0, -0.5, 0; row 1 is 0, 1, 0, -1, 0, 0.5, 0, -0.5; and row 2 is 0.1 in all eight positions'
    - kw: And
      text: 'a 3-element bias vector that is 0 for every class'
    - kw: When
      text: 'each class score is computed as the dot product of the flattened vector with that class weight row, plus that class bias'
    - kw: Then
      text: 'the three class scores are 0, 0 and 1.2 - the first two rows cancel to nothing, while row 2 simply sums a tenth of every input'
code:
  lang: go
  source: |
    // one dot product per output row, plus that row bias
    func dense(x []float64, w [][]float64, b []float64) []float64 {
      out := make([]float64, len(w))
      // out[i] = b[i] + sum of w[i][j]*x[j] for all j
      return out
    }
checkpoint: You can compute raw class scores from a flattened feature vector using a fixed set of weights, the last arithmetic step before turning them into probabilities. Commit and stop for today.
---

A **dense layer** (also called fully connected) is the least structured layer in this network: every one of the 8 flattened input values contributes to every output score, each through its own independent weight. Where a conv kernel reused the same 9 weights at every position in the image, a dense layer gives every input-output pair its own number, with no sharing at all.

The computation is the same multiply-and-sum shape as lesson 6's correlation, just without a grid to slide: multiply the input vector against a weight row and add a bias, once per class. With 3 classes and 8 inputs that is 24 weights and 3 biases in total - small only because today's network is small. The output, one raw score per class, is not yet a probability; it can be negative, and the three scores need not add up to anything in particular. Turning that into something you can read as confidence is tomorrow's job.
