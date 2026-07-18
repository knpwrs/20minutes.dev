---
project: build-an-llm
lesson: 27
title: Scoring one query against one key (dot product)
overview: 'Attention needs a single number saying how much one position should care about another - that number is nothing more than a dot product between two vectors.'
goal: Build a dot-product score between a query vector and a key vector.
spec:
  scenario: Scoring a query vector against a key vector
  status: failing
  lines:
    - kw: Given
      text: 'a query vector q=[0.035, -0.085, 0.075, -0.045] and a key vector k=[0.1, 0.015, 0.035, -0.085]'
    - kw: When
      text: 'q is scored against k by multiplying matching entries and summing the results'
    - kw: Then
      text: 'the score is 0.008675'
code:
  lang: go
  source: |
    // sum of entrywise products - the same accumulation matmul already
    // does per cell, just named for what it means here: one score
    func DotScore(q, k []*Value) *Value {
      score := NewValue(0)
      // score = Add(score, Mul(q[i], k[i])) for each i
      return score
    }
checkpoint: You can score any one query vector against any one key vector with a single number. Commit and stop for today. Next lesson gets q and k from somewhere real.
---

Two vectors can be compared with a **dot product**: multiply each pair of matching entries and add up the results. When the vectors point in a similar direction the products tend to reinforce each other and the sum comes out large; when they pull in unrelated directions the sum stays small. That single number is exactly what attention needs at its core - "how much does this query resemble this key" - and it is the entire mechanism behind an attention score.

Today's `q` and `k` are not arbitrary: they are the real query and key vectors lesson 28 will compute for the first position of the sequence built last lesson, so the `0.008675` you get here is a number you will see again, as one entry of a whole grid of scores, once queries and keys stop being handed to you and start coming from projections of `X`.
