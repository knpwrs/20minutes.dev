---
project: build-an-llm
lesson: 14
title: Mean squared error
overview: 'A network''s output needs a single number saying how wrong it is against a target - mean squared error is that number, built entirely from ops you already have.'
goal: Build an MSE function that averages the squared difference between each prediction and its matching target.
spec:
  scenario: Mean squared error over two predictions
  status: failing
  lines:
    - kw: Given
      text: 'predictions 0.9 and -0.2, with targets 1.0 and 0.0'
    - kw: When
      text: mean squared error is computed over them
    - kw: Then
      text: 'the result is 0.025 - the average of 0.1 squared and 0.2 squared'
code:
  lang: go
  source: |
    // Sub is a one-line composition of Add and a multiply by -1;
    // Pow and Div already carry their backward rules from chapter 1
    func Sub(a, b *Value) *Value {
      return Add(a, Mul(b, NewValue(-1)))
    }

    // sum each (prediction - target) squared, then divide by the count
    func MSE(preds []*Value, targets []float64) *Value {
      sum := NewValue(0)
      for i, p := range preds {
        diff := Sub(p, NewValue(targets[i]))
        sum = Add(sum, Pow(diff, 2))
      }
      return Div(sum, NewValue(float64(len(preds))))
    }
checkpoint: You can score any set of predictions against their targets with a single differentiable number. Commit and stop for today.
---

A network's forward pass produces numbers, but "how good are these numbers" needs an answer a computer can act on - a single scalar, smaller when the predictions are closer to the targets. **Mean squared error** is the simplest useful answer: subtract each target from its prediction, square the difference so a miss in either direction counts the same way, then average across every prediction.

`Pow` and `Div` come straight from chapter 1, and `Sub` is a one-line composition of `Add` and a multiply by -1 that you write today - so every step of that recipe is an operation the engine already has a backward rule for. That is what makes MSE, despite being the newest idea today, essentially free: the moment you build it out of existing `Value` operations, `Backward` already knows how to route a gradient through it and back into every prediction that produced it. The next few lessons put exactly that to use.
