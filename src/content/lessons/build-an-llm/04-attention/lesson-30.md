---
project: build-an-llm
lesson: 30
title: Softmax the scores into weights
overview: 'A row of scaled scores becomes a row of attention weights the same way any row of numbers becomes a probability distribution - lesson 24''s softmax, applied here to a row of scores instead of a row of logits.'
goal: Apply lesson 24's row softmax to a row of scaled attention scores to get a row of attention weights.
spec:
  scenario: Turning one row of scaled scores into attention weights
  status: failing
  lines:
    - kw: Given
      text: 'the scaled score row for position 2, [-0.003225, 0.00105, -0.0002], from lesson 29'
    - kw: When
      text: softmax is applied to that row
    - kw: Then
      text: 'the weights are about [0.332523, 0.333947, 0.33353]'
    - kw: And
      text: the three weights sum to 1
code:
  lang: go
  source: |
    // no new function needed - this IS lesson 24's SoftmaxRow, called
    // on a row of attention scores instead of a row of MLP logits
    weights := SoftmaxRow(scaledScoreRow)
checkpoint: A row of attention scores now becomes a row of attention weights that sum to 1 - the exact same softmax you built for classification. Commit and stop for today.
---

An attention weight is nothing more than a probability: given a row of scaled scores, softmax turns it into a row of non-negative numbers summing to 1, one weight per position that row is allowed to attend to. This is the identical function lesson 24 built for turning classification logits into probabilities - nothing about softmax itself changes when the row it operates on holds attention scores instead.

Position 2's row is a convenient one to start with, because in a 3-position sequence the last position is allowed to look at every position, itself included, so there is nothing yet to hide from it. That changes for earlier positions, which is exactly what lesson 32 addresses - today's weights are the plain, unrestricted case.
