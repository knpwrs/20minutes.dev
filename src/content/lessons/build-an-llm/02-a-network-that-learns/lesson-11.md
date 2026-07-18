---
project: build-an-llm
lesson: 11
title: 'A neuron: weight, dot, bias'
overview: 'A neuron multiplies each input by its own weight, adds a bias, and squashes the total through tanh. Today you build that one unit from Values you already have.'
goal: Build a Neuron holding pinned weights and a bias, whose forward pass computes tanh of the weighted sum plus bias.
spec:
  scenario: A single pinned neuron
  status: failing
  lines:
    - kw: Given
      text: 'a neuron with weights 0.5 and -0.3, bias 0.1, using tanh'
    - kw: When
      text: 'it is run forward on the input [2.0, 3.0]'
    - kw: Then
      text: 'the weighted sum plus bias is 0.2 - 0.5 times 2.0, plus -0.3 times 3.0, plus 0.1'
    - kw: And
      text: 'the neuron''s output, tanh of that sum, is about 0.197375'
code:
  lang: go
  source: |
    // each weight and the bias are Values from chapter 1 - the dot product
    // and the add are just Mul and Add, already built
    type Neuron struct {
      W      []*Value
      B      *Value
      NonLin bool
    }
    // Forward: sum := B; for each weight, sum = Add(sum, Mul(w_i, x_i));
    // if NonLin, return Tanh(sum), else return sum as-is
checkpoint: You have a working neuron built entirely from chapter 1's Value, Add, Mul and Tanh - the smallest unit every later network in this project stacks. Commit and stop for today.
---

A **neuron** is the smallest unit a network is built from, and it is nothing more than arithmetic you already have every piece of. Multiply each input by its own weight, add all of those products together with a bias, and you have a single number summarising the whole input. That raw sum is unbounded, though, so the neuron finishes by squashing it through `tanh` - the same `Tanh` you gave a backward closure back in chapter 1 - so its output always lands between -1 and 1.

Every weight and the bias are `Value`s, not plain floats, which is the entire point of building the autograd engine first: the dot product and the addition are just `Mul` and `Add` calls, so the neuron's output arrives already wired into a graph that can be backpropagated through. Nothing about training happens today - pin the weights, run one input through, and confirm the arithmetic. The `NonLin` flag on the type exists because not every neuron in this project will want the squashing curve; today's spec only exercises the case where it does, and a later lesson is what needs the other branch.
