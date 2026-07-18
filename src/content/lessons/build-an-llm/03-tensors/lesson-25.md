---
project: build-an-llm
lesson: 25
title: Cross-entropy loss
overview: 'Cross-entropy scores a predicted probability distribution against the one correct class, using nothing more than the log built back in lesson 9, negated.'
goal: Build a cross-entropy function that returns the negative log of the predicted probability at the target class index.
spec:
  scenario: Cross-entropy against a uniform and a skewed distribution
  status: failing
  lines:
    - kw: Given
      text: 'the probabilities [0.25, 0.25, 0.25, 0.25] and target class 0'
    - kw: When
      text: cross-entropy loss is computed
    - kw: Then
      text: 'the loss is about 1.386294 - the natural log of 4'
    - kw: When
      text: 'instead the probabilities are [0.1, 0.2, 0.3, 0.4] and target class 3'
    - kw: Then
      text: 'the loss is about 0.916291 - the negative natural log of 0.4'
code:
  lang: go
  source: |
    // Neg is a one-line multiply by -1; Log carries its backward rule
    // from lesson 9
    func Neg(a *Value) *Value {
      return Mul(a, NewValue(-1))
    }

    // pick the probability at the target index, then negate its log
    func CrossEntropyRow(probs []*Value, target int) *Value {
      return Neg(Log(probs[target]))
    }
checkpoint: You can score a predicted distribution against a target class with a single differentiable number - the loss the language model itself will train against. Commit and stop for today.
---

**Cross-entropy** answers a narrower question than mean squared error: not "how far is every prediction from every target," but "how much probability did the model put on the one class that was actually correct." Read that probability straight out of `probs` at the target's index, take its natural log, and negate the result - a correct, confident prediction (a probability near 1) gives a loss near 0, while a confident wrong prediction gives a loss that grows without bound as the probability shrinks toward 0.

Today's first case is worth internalising as a reference point: a uniform guess over 4 classes - no information at all - costs exactly `ln(4)`, about `1.386294`, regardless of which class turns out to be correct. That number is what an untrained model's loss should hover near before it has learned anything, and it is `Log` from lesson 9 that makes this whole function a two-line composition rather than a new backward rule.
