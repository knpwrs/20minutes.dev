---
project: build-an-stt-model
lesson: 30
title: Softmax and cross-entropy
overview: Turning raw scores into a probability distribution needs softmax; measuring how wrong that distribution is against the truth needs cross-entropy. Today you build both and confirm the exact loss an all-zero start must produce.
goal: Implement softmax and cross-entropy, and confirm that at lesson 29's all-zero scores, every example's loss is exactly ln(2).
spec:
  scenario: Confirming the exact loss at an indifferent starting point
  status: failing
  lines:
    - kw: Given
      text: 'lesson 29''s all-zero scores for both classes, on every one of the 5 examples'
    - kw: When
      text: 'softmax turns each example''s two scores into a probability distribution, and cross-entropy scores that distribution against the example''s true label as the negative log of the true label''s probability'
    - kw: Then
      text: 'every example''s softmax output is exactly [0.5, 0.5] - two equal scores always split probability evenly, however many classes there are'
    - kw: And
      text: 'every example''s cross-entropy loss is exactly 0.6931471806, which is ln(2) - the loss any binary classifier must report at this exact starting point, regardless of the data'
code:
  lang: go
  source: |
    // softmax: exponentiate every score, subtract nothing yet - normalize by
    // the sum so the outputs sum to 1
    func Softmax(scores []float64) []float64 { return nil }
    // cross-entropy: the negative log of the probability the model assigned
    // to the example's true label
    func CrossEntropy(probs []float64, trueLabel int) float64 { return 0 }
checkpoint: You can turn any set of scores into a probability distribution and measure how wrong it is against the truth, and you have confirmed the exact number this chapter's training starts from. Commit and stop for today.
---

**Softmax** takes a handful of raw scores and turns them into a probability distribution: exponentiate each one, then divide by the sum, so the results are all positive and add up to exactly 1. **Cross-entropy** then measures how well that distribution matches reality, by taking the negative log of whatever probability the model assigned to the correct answer - a confident, correct guess costs almost nothing, and a confident, wrong guess costs a great deal.

Lesson 29's all-zero scores make today's very first numbers exact rather than approximate, which is exactly why zero was chosen as the starting point. Two identical scores always split probability evenly regardless of how many classes there are, so softmax gives `[0.5, 0.5]` on every example without exception. Cross-entropy against a correct label that was assigned probability `0.5` is `-log(0.5)`, which is `ln(2)` - a single fixed number, true for any binary classifier at this exact starting point, before it has seen a single labelled example do anything to change its mind.
