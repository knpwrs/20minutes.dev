---
project: build-an-llm
lesson: 31
title: The weighted sum of values (one attention head)
overview: 'The output for a position is its attention weights used to blend together every position''s value vector - a weighted average, one number per column of V.'
goal: Combine a row of attention weights with the values tensor to produce one output vector.
spec:
  scenario: Blending value vectors by their attention weight
  status: failing
  lines:
    - kw: Given
      text: 'the attention weights for position 2, [0.332523, 0.333947, 0.33353], from lesson 30, and V (3x4) from lesson 28'
    - kw: When
      text: 'each column of the output is the sum, over every row of V, of that row''s value times its matching weight'
    - kw: Then
      text: 'the output row is about [-0.038336, -0.014913, 0.008175, 0.043394]'
code:
  lang: go
  source: |
    // out[k] = sum over j of weights[j] * V[j][k] - a dot product
    // between the weight row and each COLUMN of V, one per output entry
    func WeightedSum(weights []*Value, v *Tensor) []*Value {
      out := make([]*Value, v.Cols())
      // for each column k: accumulate Mul(weights[j], v.Data[j][k]) over j
      return out
    }
checkpoint: You can turn one row of attention weights and the values tensor into a single output vector for that position. Commit and stop for today.
---

Once a position has a weight for every other position, producing its output is a **weighted average**: for each column of `V`, multiply every row's entry by that row's weight and add the results up. A weight of `1` on some position would copy that position's value straight through; today's weights are close to an even three-way split, so the output row sits close to the average of `V`'s three rows, pulled slightly toward whichever row got the largest weight.

This is the payoff every earlier lesson in this chapter has been building toward: a query, scored against every key, turned into weights, now blending the values - the whole mechanism attention is named for, applied to a single position. The next two lessons revisit this same computation for the positions that are not allowed to see the whole row.
