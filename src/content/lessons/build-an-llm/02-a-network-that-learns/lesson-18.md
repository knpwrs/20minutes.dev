---
project: build-an-llm
lesson: 18
title: The training loop
overview: 'Forward, zero, backward, step, repeated over a fixed dataset, is the entire training loop - and with every weight and example pinned, the loss at any given step is an exact number.'
goal: Write a training loop running full-batch gradient descent over three fixed examples for 20 steps, and confirm the loss at the start of steps 0 and 19.
spec:
  scenario: Twenty steps of full-batch training
  status: failing
  lines:
    - kw: Given
      text: 'the MLP from lesson 13, three fixed examples consumed in this order every step - x=[2.0, 3.0] target 1.0, x=[1.0, -1.0] target -1.0, x=[-2.0, 0.5] target 0.5 - and learning rate 0.05'
    - kw: When
      text: 'each step forwards all three examples, averages their mean squared errors into one loss, zeroes every parameter''s gradient, backpropagates that loss, then takes one gradient descent step - repeated for 20 steps'
    - kw: Then
      text: 'the loss measured at the start of step 0, before any update has been applied, is about 1.714968'
    - kw: And
      text: 'the loss measured at the start of step 19, after 19 prior updates, is about 0.322482'
code:
  lang: go
  source: |
    // one training step, given that step's already-averaged loss: clear
    // old gradients, backpropagate, then move every parameter - wrap
    // this in a loop over nSteps, rebuilding `total` fresh each time
    func TrainStep(params []*Value, total *Value, lr float64) {
      ZeroGrad(params)
      total.Backward()
      SGDStep(params, lr)
    }
checkpoint: You have a complete, deterministic training loop - the loss drops from about 1.714968 to about 0.322482 over 20 pinned steps. Commit and stop for today.
---

Every piece the training loop needs already exists: lesson 13's forward pass, lesson 14's MSE, lesson 15's parameter list, lesson 16's gradient step, and lesson 17's fix for the bug that would otherwise corrupt every step after the first. The loop itself is just those pieces run in the right order, repeatedly - forward every example, combine their losses into one number, clear old gradients, backpropagate the new loss, then step.

Because every weight, every example and the learning rate are pinned literals with no randomness anywhere, the loss at any given step is not a rough trend but an exact, reproducible number - today's spec is careful to say *which* step: "the loss at step N" means the loss measured before that step's update is applied, so step 0 is the untrained network's loss and step 19 is the loss after 19 prior updates have already happened. Watch that number fall from about 1.71 down to about 0.32 over the 20 steps, and you have watched a real, tiny network learn.
