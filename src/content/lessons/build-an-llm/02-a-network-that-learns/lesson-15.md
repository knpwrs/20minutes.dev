---
project: build-an-llm
lesson: 15
title: Collecting the parameters
overview: 'A gradient descent step needs to know exactly which Values are learnable - every weight and bias in the network, gathered into one flat, stable list.'
goal: Build a Parameters method that walks a neuron, layer and MLP and returns every weight and bias Value it owns.
spec:
  scenario: Collecting every learnable value in an MLP
  status: failing
  lines:
    - kw: Given
      text: 'the MLP from lesson 13 - two hidden neurons, each with 2 weights and a bias, and one output neuron with 2 weights and a bias'
    - kw: When
      text: its parameters are collected
    - kw: Then
      text: 'the list holds exactly 9 values - 3 per neuron, across 3 neurons'
code:
  lang: go
  source: |
    // each level just concatenates the level below it
    func (n *Neuron) Parameters() []*Value {
      return append(append([]*Value{}, n.W...), n.B)
    }
    func (l *Layer) Parameters() []*Value {
      var params []*Value
      for _, n := range l.Neurons {
        params = append(params, n.Parameters()...)
      }
      return params
    }
    // MLP.Parameters follows the same pattern, over its Layers
checkpoint: You can pull every weight and bias out of a network you built from any number of layers, as one flat list. Commit and stop for today.
---

Everything built so far - a neuron, a layer, an MLP - knows how to compute a forward pass, but nothing yet knows how to answer "which numbers in this network are allowed to change." That list matters the moment training starts: a gradient descent step needs to update every weight and every bias, and it needs them as one flat collection it can loop over, not scattered across nested structs.

The pattern is the same at every level: a neuron's parameters are its own weights plus its bias, a layer's parameters are the concatenation of its neurons' parameters, and an MLP's parameters are the concatenation of its layers' parameters. Each level only has to know about the level directly below it - a `Layer` never needs to know that a `Neuron` has weights and a bias, only that it has `Parameters()`. Today's count, 9, is worth checking by hand: three neurons, three values each.
