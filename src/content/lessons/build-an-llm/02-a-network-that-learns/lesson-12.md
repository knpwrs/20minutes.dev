---
project: build-an-llm
lesson: 12
title: A layer of neurons
overview: 'Several neurons fed the same input, each producing its own output, is a layer - the next size up from a single neuron, and no new arithmetic.'
goal: Build a Layer holding multiple neurons and have its forward pass return one output per neuron, all fed the same input.
spec:
  scenario: A layer of two neurons
  status: failing
  lines:
    - kw: Given
      text: 'a layer of two neurons: the first with weights 0.5 and -0.3 and bias 0.1, the second with weights -0.2 and 0.4 and bias -0.1, both using tanh'
    - kw: When
      text: 'the layer is run forward on the input [2.0, 3.0]'
    - kw: Then
      text: 'the output holds two values, one per neuron: about 0.197375 and about 0.604368'
code:
  lang: go
  source: |
    // a layer is just a slice of neurons, all fed the same x
    type Layer struct {
      Neurons []*Neuron
    }
    func (l *Layer) Forward(x []*Value) []*Value {
      out := make([]*Value, len(l.Neurons))
      for i, n := range l.Neurons {
        out[i] = n.Forward(x)
      }
      return out
    }
checkpoint: You can run several neurons side by side on the same input and collect one output per neuron - the shape every hidden layer in this project takes. Commit and stop for today.
---

Nothing about a single neuron limits it to being the only one looking at a given input. A **layer** is simply several neurons, each independently doing lesson 11's dot-product-plus-bias-plus-tanh on the exact same input vector, and each producing its own output. There is no new arithmetic here, no new backward rule, no new idea about gradients - just a loop over neurons that already know how to forward themselves.

What today's spec is really pinning down is the shape: a layer's output is a list with one entry per neuron, not a single number. That list is what lesson 13 threads into the next layer, and the two neurons in today's spec - built from different weights and biases - are proof that a layer's neurons need not agree with each other at all; each one learns its own view of the same input.
