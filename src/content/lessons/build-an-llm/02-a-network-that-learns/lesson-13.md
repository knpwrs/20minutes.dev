---
project: build-an-llm
lesson: 13
title: An MLP of layers
overview: 'Stacking layers so one layer''s output feeds straight into the next is what turns a single layer into a network with room to combine features.'
goal: Build an MLP that stacks layers, threading each layer's output into the next, ending in a linear output neuron with no squashing curve.
spec:
  scenario: A two-layer MLP
  status: failing
  lines:
    - kw: Given
      text: 'an MLP whose hidden layer is the two neurons from lesson 12, feeding a single output neuron with weights 0.3 and -0.6 and bias 0.05, without tanh'
    - kw: When
      text: 'it is run forward on the input [2.0, 3.0]'
    - kw: Then
      text: 'the output is a single value, about -0.253408'
code:
  lang: go
  source: |
    // an MLP is a stack of layers - each layer's output becomes the next
    // layer's input, in order
    type MLP struct {
      Layers []*Layer
    }
    func (m *MLP) Forward(x []*Value) []*Value {
      out := x
      for _, l := range m.Layers {
        out = l.Forward(out)
      }
      return out
    }
checkpoint: You can stack layers so output threads straight through, and you have a full MLP running end to end on pinned weights. Commit and stop for today.
---

An **MLP** - a multi-layer perceptron - is just layers stacked one after another, where the previous layer's output list becomes the next layer's input list. The threading is the entire new idea: `Forward` starts with the network's real input, hands it to the first layer, takes what comes back, hands that to the second layer, and so on until every layer has run once.

Today's network also puts lesson 11's `NonLin` flag to use for the first time: the hidden layer's two neurons squash their sums through `tanh` as before, but the single output neuron is built with `NonLin` false, so it returns its weighted sum plus bias directly. That is deliberate - a network whose final output is a real-valued prediction, not a bounded activation, generally wants its last neuron left linear. Watch the two hidden outputs from lesson 12 feed straight into that one output neuron's weighted sum, and the whole forward pass of a real (if tiny) network is now something you have built and run by hand.
