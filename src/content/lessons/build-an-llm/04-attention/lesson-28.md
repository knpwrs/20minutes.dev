---
project: build-an-llm
lesson: 28
title: Queries, keys, values (three different projections)
overview: 'A query, a key and a value are the same input projected three separate ways, each through its own linear layer and its own weights.'
goal: Project the input tensor through three separate linear layers to get a queries tensor, a keys tensor and a values tensor.
spec:
  scenario: Projecting one input three different ways
  status: failing
  lines:
    - kw: Given
      text: 'the input X (3 rows x 8 columns) from lesson 26, and three linear layers with zero bias, each an 8x4 weight matrix built from the formula (((row*5 + col*11 + seed*13) mod 7) - 3) * 0.1: Wq uses seed 10, Wk uses seed 11, Wv uses seed 12'
    - kw: When
      text: 'X is projected through Wq to get Q, through Wk to get K, and through Wv to get V'
    - kw: Then
      text: 'Q is [[0.035, -0.085, 0.075, -0.045], [0.075, 0.135, -0.12, -0.06], [-0.05, 0.01, -0.07, -0.01]]'
    - kw: And
      text: 'K is [[0.1, 0.015, 0.035, -0.085], [-0.15, 0.12, 0.075, 0.135], [0.075, -0.005, -0.05, 0.01]]'
    - kw: And
      text: 'V is [[-0.045, -0.095, 0.1, 0.015], [-0.06, 0.0, -0.15, 0.12], [-0.01, 0.05, 0.075, -0.005]]'
    - kw: And
      text: 'row 0 of Q, row 0 of K and row 0 of V are three different vectors, even though all three came from the same row 0 of X'
code:
  lang: go
  source: |
    // one Linear (chapter 3) per projection, three different weight
    // tensors, same X in - Head just needs three calls, not new math
    type Head struct {
      Wq, Wk, Wv *Linear
    }
    func ProjectQKV(x *Tensor, h *Head) (q, k, v *Tensor) {
      return h.Wq.Forward(x), h.Wk.Forward(x), h.Wv.Forward(x)
    }
checkpoint: You can turn one input tensor into three genuinely different tensors - queries, keys and values - using nothing but three linear layers. Commit and stop for today.
---

A query, a key and a value are not three different kinds of thing - they are the same input row, projected through three separate weight matrices, exactly the way chapter 3's linear layer already works. `Q = X @ Wq`, `K = X @ Wk`, `V = X @ Wv`, with three different `W`s and no new arithmetic beyond a linear layer you already built.

That three different weight matrices are used, rather than one shared matrix reused three times, is the entire point: if `Wq`, `Wk` and `Wv` were the same matrix, `Q`, `K` and `V` would be identical rows and "attention" would degenerate into nothing. Check today's row 0 of each against the others - they genuinely differ - because that difference is what lets a position ask one question (its query), advertise one thing about itself to others (its key), and carry one payload to pass along (its value).
