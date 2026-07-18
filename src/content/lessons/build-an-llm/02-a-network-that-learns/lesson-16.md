---
project: build-an-llm
lesson: 16
title: One gradient descent step
overview: 'Once a loss and its gradients exist, nudging every parameter a small step opposite its own gradient is what "learning" actually is - today you take that one step.'
goal: Backpropagate the loss on the lesson 13 MLP for one example, then apply one step of gradient descent to every parameter from lesson 15.
spec:
  scenario: A single SGD step on a pinned MLP
  status: failing
  lines:
    - kw: Given
      text: 'the MLP from lesson 13, run forward on x=[2.0, 3.0], scored by mean squared error against target 1.0, with learning rate 0.1'
    - kw: When
      text: 'the loss is backpropagated, and every parameter from lesson 15 has learning rate times its own gradient subtracted from its data'
    - kw: Then
      text: 'the loss before the step is about 1.571032'
    - kw: And
      text: 'the output neuron''s first weight starts at 0.3 with gradient about -0.494784, so after the step it is about 0.349478'
code:
  lang: go
  source: |
    // one step of plain gradient descent, no momentum: move each
    // parameter directly opposite its own current gradient, scaled by lr
    func SGDStep(params []*Value, lr float64) {
      for _, p := range params {
        p.Data -= lr * p.Grad
      }
    }
checkpoint: You have taken one real gradient descent step on a real network - loss computed, gradients backpropagated, every parameter nudged. Commit and stop for today.
---

Everything from chapter 1 through lesson 15 has been building toward this one action. Run the MLP forward, score its output against a target with lesson 14's MSE, then call `Backward` on that loss the same way you have since chapter 1 - except now the graph reaches all the way back through every weight and bias lesson 15 collects, because each of them is a `Value` that fed into the forward pass.

**Gradient descent** asks a simple question of each parameter: does increasing this value increase or decrease the loss, and by how much per unit? That answer is sitting in `.Grad` the moment `Backward` finishes, and moving the parameter a small step in the opposite direction - `Data -= lr * Grad` - should make the loss a little smaller next time. Today's spec pins one weight's exact before, gradient, and after so you can check your own step lands on the same number; do the same arithmetic for the other eight parameters if you want to convince yourself the loss really would drop.
