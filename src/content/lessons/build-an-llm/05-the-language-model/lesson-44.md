---
project: build-an-llm
lesson: 44
title: Temperature sampling
overview: Dividing every logit by a temperature before softmax reshapes the whole distribution - low temperature sharpens it toward greedy, high temperature flattens it toward uniform - without touching the trained weights at all.
goal: Scale the trained model's logits by a temperature before softmax, and see how that changes both the resulting probabilities and a fixed sampling draw.
spec:
  scenario: The same logits reshaped by two different temperatures
  status: failing
  lines:
    - kw: Given
      text: 'the logits from lesson 43 for context "abc", about [-3.001700, 1.357427, -2.204565, 3.390018]'
    - kw: And
      text: 'dividing every logit by a temperature T before applying softmax (lesson 24) gives the temperature-scaled probabilities'
    - kw: When
      text: T is 1.0
    - kw: Then
      text: 'the probabilities are about [0.001474, 0.115274, 0.003272, 0.879980] - identical to lesson 43, since dividing by 1 changes nothing'
    - kw: When
      text: instead T is 2.0
    - kw: Then
      text: 'the probabilities are about [0.027962, 0.247249, 0.041654, 0.683135] - flatter than at T=1.0, with more mass moved onto the weaker classes'
    - kw: And
      text: 'given a fixed draw r=0.2, walking each distribution in index order and picking the first index whose running cumulative sum exceeds r gives index 3 at T=1.0 but index 1 at T=2.0 - the same r, a different pick, because temperature reshaped the distribution underneath it'
code:
  lang: go
  source: |
    // scale every logit by 1/T, THEN run the same three softmax steps as
    // lesson 24 (shift by the max, exponentiate, divide by the sum) - just
    // on plain float64 instead of *Value, since generation needs no gradient
    func TemperatureProbs(logits []float64, t float64) []float64 {
      scaled := make([]float64, len(logits))
      for i, l := range logits {
        scaled[i] = l / t
      }
      return SoftmaxFloats(scaled)
    }
checkpoint: Temperature now lets you reshape the model's confidence without retraining it, and you have a fully deterministic way to test any sampling draw against a given r instead of relying on randomness. Commit and stop for today.
---

**Temperature** is a single scalar dividing every logit before softmax runs. Dividing by a number below 1 stretches the logits apart, pushing softmax toward an even more lopsided distribution than greedy already sees; dividing by a number above 1 pulls them together, flattening the distribution toward uniform and giving the weaker classes a real share of the probability mass.

Sampling itself needs a way to turn a probability vector into a single choice, and this project sidesteps random number generators entirely: given the probabilities and a value `r`, walk the indices in order keeping a running sum, and return the first index where that sum exceeds `r`. Because `r` is given rather than drawn, the same `r` against two different distributions is a clean, language-neutral way to see temperature change an outcome - `r=0.2` lands on index 3 when the distribution is sharp and index 1 once T=2.0 has flattened it.
