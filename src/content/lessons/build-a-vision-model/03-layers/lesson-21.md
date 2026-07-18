---
project: build-a-vision-model
lesson: 21
title: Softmax over class scores
overview: Class scores can be any real number and do not sum to anything in particular. Today you turn the three scores from lesson 20 into a genuine probability distribution with softmax.
goal: Apply softmax to the three class scores 0, 0 and 1.2 from lesson 20.
spec:
  scenario: Turning raw scores into probabilities
  status: failing
  lines:
    - kw: Given
      text: 'the three class scores from lesson 20 - 0, 0 and 1.2'
    - kw: When
      text: 'softmax is applied - exponentiate every score, then divide each exponential by the sum of all three'
    - kw: Then
      text: 'the first two probabilities are equal, each about 0.18797'
    - kw: And
      text: 'the third probability is about 0.62407, the largest of the three, matching the highest input score'
    - kw: And
      text: 'the three probabilities sum to exactly 1'
code:
  lang: go
  source: |
    // exponentiate every score, then normalize by their sum
    func softmax(z []float64) []float64 {
      out := make([]float64, len(z))
      // subtract max(z) from every entry first - keeps exp() from overflowing
      // out[i] = exp(z[i]) / sum of exp(z[j]) for all j
      return out
    }
checkpoint: You can turn any set of raw class scores into a probability distribution that sums to 1 and preserves their ordering. Commit and stop for today.
---

The three numbers lesson 20 produced answer "how much does the network favour each class", but they are not comparable to each other in any absolute sense - a score of 1.2 does not mean "60% confident" or anything else you could quote a percentage for. **Softmax** fixes that: exponentiate every score, so nothing is negative any more, then divide each one by the total, so the results sum to exactly 1. What comes out is a genuine probability distribution over the classes.

Softmax also preserves order and exaggerates gaps: the highest score becomes the highest probability, and because exponentials grow fast, a modest lead like 1.2 over 0 turns into better than 3 to 1 odds rather than a narrow edge. Watch the two equal scores in today's spec too - equal inputs to softmax always give equal outputs, which is a useful sanity check whenever a network genuinely cannot yet tell two classes apart.
