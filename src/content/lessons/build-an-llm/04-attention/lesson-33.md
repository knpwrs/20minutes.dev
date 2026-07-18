---
project: build-an-llm
lesson: 33
title: Assembling a full self-attention head
overview: 'Every piece of a causal self-attention head already exists - project, score, scale, mask, softmax, weighted sum - today they run back to back over every position at once.'
goal: Compose lessons 28 through 32 into a single head that runs end to end over the whole 3-position input.
spec:
  scenario: Running one full causal self-attention head over all three positions
  status: failing
  lines:
    - kw: Given
      text: 'X (3x8) from lesson 26, and the Wq, Wk, Wv weights from lesson 28'
    - kw: When
      text: 'X is projected to Q, K and V, scored, scaled, causally masked, turned into weights by softmax, then combined with V'
    - kw: Then
      text: 'the head''s output (3x4) is [[-0.045, -0.095, 0.1, 0.015], [-0.052458, -0.047768, -0.024295, 0.067204], [-0.038336, -0.014913, 0.008175, 0.043394]]'
    - kw: And
      text: 'row 0 of the output exactly equals row 0 of V, since position 0''s only unmasked weight is 1.0 on itself'
    - kw: And
      text: 'row 2 of the output matches lesson 31''s result exactly, since position 2''s weights were never touched by masking'
code:
  lang: go
  source: |
    // no new arithmetic - every step below is an earlier lesson, run
    // once per row instead of on a single row
    func (h *Head) Forward(x *Tensor) *Tensor {
      q, k, v := ProjectQKV(x, h)
      scores := ScaleScores(RawScores(q, k), HeadSize)
      weights := SoftmaxTensor(CausalMask(scores))
      return WeightedSum(weights, v)
    }
checkpoint: You have one complete, causally masked self-attention head running over a whole sequence. Commit and stop for today.
---

Nothing in a self-attention head is new at this point - lessons 28 to 32 already built projection, scoring, scaling, masking and the weighted sum, each proven on one row or one pair at a time. Today's only job is wiring: run the whole grid of scores through masking and softmax, then combine every row's weights with `V`, and the same pipeline that worked one row at a time now produces a full `(3x4)` output tensor, one row per position.

The two checks worth lingering on are the ones that tie this lesson back to the ones before it: position `0`'s output is not approximately `V`'s first row, it is *exactly* it, because masking left it only one place to put its attention; and position `2`'s output is bit-for-bit what lesson 31 already computed, because masking never touched its row at all. Both are a direct consequence of the mask, not a coincidence of the numbers.
