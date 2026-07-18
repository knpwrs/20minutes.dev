---
project: build-an-llm
lesson: 29
title: Scaled dot-product scores (divide by root head size)
overview: 'Lesson 27''s single score, run between every query and every key, gives a whole grid of scores - and that grid needs shrinking before it is usable, by dividing every entry by the square root of the head size.'
goal: Build the full grid of query-key scores, then scale every entry by dividing by the square root of the head size.
spec:
  scenario: Scoring every query against every key, then scaling
  status: failing
  lines:
    - kw: Given
      text: 'Q and K (3x4 each) from lesson 28, and a head size of 4, whose square root is exactly 2'
    - kw: When
      text: 'the raw score at row i, column j is the dot product of Q row i and K row j, for every i and j, and every raw score is then divided by 2'
    - kw: Then
      text: 'the raw scores (3x3) are [[0.008675, -0.0159, -0.00115], [0.010425, -0.01215, 0.01035], [-0.00645, 0.0021, -0.0004]]'
    - kw: And
      text: 'the scaled scores (3x3) are [[0.004338, -0.00795, -0.000575], [0.005213, -0.006075, 0.005175], [-0.003225, 0.00105, -0.0002]]'
code:
  lang: go
  source: |
    // RawScores[i][j] is lesson 27's DotScore(Q row i, K row j) - a
    // grid of scores, not one. ScaleScores just divides every cell.
    func RawScores(q, k *Tensor) *Tensor {
      out := NewTensor(q.Rows(), k.Rows())
      // out.Data[i][j] = DotScore(q.Data[i], k.Data[j])
      return out
    }
checkpoint: You have a full grid of scaled attention scores between every pair of positions. Commit and stop for today.
---

Lesson 27 scored one query against one key. Attention needs every position's query scored against every position's key, so the result is a whole `(positions x positions)` grid: row `i`, column `j` holds how much position `i`'s query matches position `j`'s key, using the exact same dot product as before, just run once per pair instead of once.

That grid then gets scaled down by dividing every entry by the square root of the head size - here, exactly `2`, since the head size is `4`. Without this, scores computed from wider vectors tend to grow large in magnitude purely because there are more terms in the dot product, which pushes the softmax you are about to apply toward a near-one-hot distribution regardless of how genuinely similar the vectors are. Dividing by `sqrt(headSize)` keeps the scores in a sane range before they ever reach softmax - notice every scaled score above is exactly half its raw counterpart.
