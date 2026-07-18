---
project: build-an-stt-model
lesson: 31
title: One gradient step
overview: Training is nothing but repeatedly nudging weights against their gradient. Today you hand-derive that gradient for softmax cross-entropy and take the very first step from lesson 29's all-zero start.
goal: Hand-derive the gradient of softmax cross-entropy and take one full-batch gradient-descent step over lesson 28's dataset at learning rate 0.1.
spec:
  scenario: Descending the gradient of softmax cross-entropy by hand
  status: failing
  lines:
    - kw: Given
      text: 'lesson 29''s all-zero-initialized scorer, lesson 28''s 5 examples treated as one full batch, and a fixed learning rate of 0.1'
    - kw: And
      text: 'the gradient of the softmax-cross-entropy loss with respect to each example''s raw score for class k, once you carry the chain rule through by hand, works out to a clean quantity: the predicted probability of class k, minus 1 if k is the true label and minus 0 otherwise - averaged across the whole batch to get the gradient for W and for b'
    - kw: When
      text: 'one full-batch gradient-descent step is taken: each weight and bias moves by lr times its averaged gradient, in the direction that reduces the loss'
    - kw: Then
      text: 'the average loss reported before the step is exactly 0.6931471806, matching lesson 30'
    - kw: And
      text: 'after the step, W is exactly [[-0.091, -0.2765000000000001], [0.091, 0.2765000000000001]], and b is exactly [-0.01, 0.01]'
code:
  lang: go
  source: |
    // derive d(loss)/d(score_k) by hand for softmax+cross-entropy - it works
    // out to something clean once you write out the chain rule for both
    // cases (k == true label, k != true label) and simplify
    func GradientStep(m *LinearScorer, data []Example, lr float64) (avgLossBefore float64) {
      // accumulate per-class, per-feature gradients across the whole batch,
      // divide by the batch size, then descend: W[k] -= lr * gradW[k]
      return 0
    }
checkpoint: You have hand-derived the gradient of softmax cross-entropy, taken one real step with it, and confirmed the exact numbers it produces. Commit and stop for today.
---

Every gradient in this lesson is one you carry out by hand rather than lean on any automatic differentiation - there is exactly one function composed with another, softmax feeding cross-entropy, and the composition happens to simplify beautifully. Write cross-entropy as the negative log of the true class's probability, expand that probability as the softmax of the raw scores, and differentiate with respect to a single raw score: the messy pieces from the log's derivative and softmax's own derivative cancel almost entirely, leaving just the predicted probability for the true class, minus one - and just the predicted probability, unchanged, for every other class. That is the entire gradient with respect to every raw score, for every example; from there it is ordinary calculus to reach the gradient with respect to W and b, since a raw score is only ever a dot product plus a bias.

Averaging that gradient across all 5 examples - a full-batch step, no shuffling or minibatches, so the result is fully deterministic - and subtracting a tenth of it from the current weights is the whole update. Because you already know the exact starting loss from lesson 30, you can sanity-check today's implementation before trusting a single number it produces afterwards: report that value first, and only then take the step.
