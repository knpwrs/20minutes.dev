---
project: build-an-llm
lesson: 32
title: Causal masking (a position cannot see the future)
overview: 'A position must never attend to one that comes after it - enforced by replacing every future score with literal negative infinity before softmax, so its weight comes out at exactly zero.'
goal: Mask every score at a future position to negative infinity before softmax, so attention never looks ahead.
spec:
  scenario: Hiding future positions from an earlier position's attention
  status: failing
  lines:
    - kw: Given
      text: 'the scaled scores (3x3) from lesson 29, [[0.004338, -0.00795, -0.000575], [0.005213, -0.006075, 0.005175], [-0.003225, 0.00105, -0.0002]], where row i, column j is position i attending to position j'
    - kw: When
      text: 'every entry where column j is greater than row i is replaced with the literal value negative infinity, before softmax runs'
    - kw: Then
      text: 'the masked scores are [[0.004338, -Infinity, -Infinity], [0.005213, -0.006075, -Infinity], [-0.003225, 0.00105, -0.0002]] - row 2 is untouched, since position 2 may see every position up to and including itself'
    - kw: And
      text: 'softmax of masked row 0 is exactly [1.0, 0.0, 0.0]'
    - kw: And
      text: 'softmax of masked row 1 is about [0.502822, 0.497178, 0.0]'
code:
  lang: go
  source: |
    // literal -Inf, set BEFORE softmax runs - never add -Inf to a
    // finite score, since a later masked-minus-masked comparison
    // would then compute -Inf - (-Inf), which is NaN, not -Inf
    func CausalMask(scores *Tensor) *Tensor {
      out := NewTensor(scores.Rows(), scores.Cols())
      // out.Data[i][j] = scores.Data[i][j] if j <= i, else NewValue(math.Inf(-1))
      return out
    }
checkpoint: A position's masked scores now hide every future position with a literal negative infinity, and softmax turns each of those into a probability of exactly zero. Commit and stop for today.
---

A language model predicts what comes next, so a position must never be allowed to peer at positions that have not happened yet - if it could, it would be scoring itself against the very answer it is meant to predict. **Causal masking** enforces this: for row `i`, every column `j` greater than `i` is replaced with negative infinity, before softmax ever runs.

Negative infinity is the deliberate choice here, not some very negative finite number - `exp(-Inf)` is exactly `0`, so a masked position's weight comes out at exactly `0`, never a tiny nonzero leftover. Build the mask by directly assigning that literal value to the masked cells, rather than adding negative infinity to the existing score - since a later step comparing two masked values would then compute `-Inf - (-Inf)`, which is `NaN`, not `-Inf`. Row `0` is the sharpest case: with every other position masked out, its softmax weight lands on itself at exactly `1.0`.
