---
project: build-a-vision-model
lesson: 23
title: The gradient of softmax and cross-entropy together
overview: Differentiating softmax and cross-entropy separately means multiplying two Jacobians together. Today you derive the gradient of the combined expression instead, where almost everything cancels.
goal: Derive dL/dz, the gradient of the loss with respect to the pre-softmax scores from lesson 20, for the probabilities from lesson 21 and true label 0.
spec:
  scenario: The combined softmax and cross-entropy gradient
  status: failing
  lines:
    - kw: Given
      text: 'the three probabilities from lesson 21 - about 0.18797, 0.18797, 0.62407 - and the true label 0, written as a one-hot vector 1, 0, 0'
    - kw: When
      text: 'the gradient of the cross-entropy loss with respect to the pre-softmax scores z is derived for the combined softmax-then-cross-entropy step'
    - kw: Then
      text: 'the gradient equals the probability vector minus the one-hot true label, entry by entry'
    - kw: And
      text: 'its three entries are about -0.81203, 0.18797 and 0.62407'
code:
  lang: go
  source: |
    // differentiating softmax and cross-entropy separately means chaining two
    // Jacobians together. Instead, write the loss directly as a function of z
    // - -log(softmax(z)[trueLabel]) - and differentiate that single expression
    // with respect to z. Most of it cancels; work out what survives.
    func softmaxCEGrad(p []float64, trueLabel int) []float64 {
      grad := make([]float64, len(p))
      // fill grad from p and trueLabel here
      return grad
    }
checkpoint: You have derived the one gradient every classifier in this project needs first, and confirmed how cleanly softmax and cross-entropy combine. Commit and stop for today.
---

Softmax has its own Jacobian - every output probability depends on every input score, not just the matching one - and cross-entropy has its own derivative through a log. Chaining the two separately means multiplying a full Jacobian matrix by a vector, for a result that is used constantly and needs to be fast.

Do the algebra on the combined expression instead: write the loss directly as a function of the pre-softmax scores z, and differentiate that. The softmax Jacobian and the reciprocal from the log very nearly cancel, and what survives is remarkably small - small enough that it is worth working through the derivation yourself rather than being handed the punch line. Once you have it, notice that it needs nothing from softmax or cross-entropy computed separately; it is a direct function of the probabilities and the true label alone.
