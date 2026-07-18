---
project: build-an-llm
lesson: 23
title: A linear layer
overview: 'Matrix multiply plus a broadcast bias is exactly a linear layer - the one building block every layer in the rest of this project wraps around.'
goal: Build a Linear layer that combines lesson 21's matrix multiply with lesson 22's bias broadcast, from pinned weights and a bias.
spec:
  scenario: Running an input through a pinned linear layer
  status: failing
  lines:
    - kw: Given
      text: 'a linear layer with weights W=[[0.5, -0.3], [0.2, 0.4]] and bias [0.1, -0.1], and an input x=[[1.0, 2.0], [-1.0, 0.5]]'
    - kw: When
      text: x is passed through the linear layer
    - kw: Then
      text: 'the output is [[1.0, 0.4], [-0.3, 0.4]]'
code:
  lang: go
  source: |
    // a linear layer IS matmul followed by a broadcast bias add - no new
    // arithmetic, just the two previous lessons composed
    type Linear struct {
      W *Tensor
      B []*Value
    }
    func (l *Linear) Forward(x *Tensor) *Tensor {
      return AddBiasRow(MatMul(x, l.W), l.B)
    }
checkpoint: You have a reusable Linear layer built from nothing but lesson 21's MatMul and lesson 22's AddBiasRow. Commit and stop for today.
---

A **linear layer** is the tensor-shaped version of lesson 11's neuron: instead of one weight per input feeding one neuron, a whole matrix of weights projects every input row into a new row of outputs, and a bias row is added across all of them at once. There is no new arithmetic in it at all - `Linear.Forward` is exactly `MatMul` followed by `AddBiasRow`, the two operations built over the last two lessons, composed in that order.

That composition is worth appreciating on its own: two small, independently-tested operations combine into something genuinely useful with zero new code beyond wiring them together. Every projection in the next chapter - queries, keys, values, the output projection, the feed-forward network - is this same `Linear` type with different pinned weights, so getting comfortable with today's shapes now pays off repeatedly later.
