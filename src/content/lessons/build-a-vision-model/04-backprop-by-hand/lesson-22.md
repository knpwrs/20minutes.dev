---
project: build-a-vision-model
lesson: 22
title: Cross-entropy loss
overview: A loss is a single number saying how wrong a prediction was. Today you build cross-entropy, the standard loss for a classifier, and see what it costs to be confidently wrong.
goal: Compute the cross-entropy loss for the probabilities from lesson 21 against the true label 0.
spec:
  scenario: Scoring a prediction against the true label
  status: failing
  lines:
    - kw: Given
      text: 'the three class probabilities from lesson 21 - about 0.18797, 0.18797 and 0.62407 - and a true label of class 0'
    - kw: When
      text: 'the cross-entropy loss is computed as the negative natural log of the probability the model assigned to the true class'
    - kw: Then
      text: 'the loss is about 1.6715 - a heavy penalty, since the model gave the true class only an 18.8 percent chance'
code:
  lang: go
  source: |
    func crossEntropy(p []float64, trueLabel int) float64 {
      return -math.Log(p[trueLabel])
    }
checkpoint: You can score any prediction against its true label with a single number, and have seen how sharply that number rises when the model is confidently wrong. Commit and stop for today.
---

A loss needs to be one number, small when the network did well and large when it did badly, so that later lessons have a single quantity to push down through training. **Cross-entropy** is the standard choice for a classifier: look only at the probability the model assigned to the correct class, and take the negative natural log of it.

That "look only at the true class" part is worth sitting with - the probabilities given to the wrong classes do not appear in the formula directly, only indirectly, through the fact that all the probabilities had to sum to 1. And the shape of negative log matters more than the exact number today: a probability of 1 for the true class gives a loss of 0, a probability near 0 sends the loss toward infinity, and the curve between those two ends is steep - which is exactly why today's 18.8 percent produces a loss as large as 1.6715 rather than something closer to 0.
