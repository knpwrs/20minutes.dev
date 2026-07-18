---
project: build-a-vision-model
lesson: 30
title: One SGD step
overview: Every forward and backward function from chapters 3 and 4 already exists. Today you point them at a fresh network and a real sample, and take the first actual training step.
goal: Run one SGD step on sample i=0 from lesson 29 against a freshly initialized network, and confirm the loss on that sample drops.
spec:
  scenario: One SGD step on a freshly initialized network
  status: failing
  lines:
    - kw: Given
      text: 'a network with the same six-stage architecture from lessons 15 through 21 (Conv2D 1 channel to 2 channels, 3x3, valid, correlation, then ReLU, then MaxPool2x2, then Flatten, then a Dense layer to 2 classes, then Softmax)'
    - kw: And
      text: 'freshly initialized: channel 0''s kernel has rows 0.1, 0, -0.1 in all three rows with bias 0; channel 1''s kernel has rows 0,0,0 then 0,0.1,0 then 0,0,0 with bias 0; the dense row for class 0 (vertical edge) is eight 0.1s, the row for class 1 (horizontal edge) is eight -0.1s, and both dense biases are 0'
    - kw: And
      text: 'sample i=0 from lesson 29 - label 0, a vertical edge at column 1'
    - kw: When
      text: 'the network takes one SGD step at lr=0.1 on this one sample - forward, cross-entropy loss, backward, then every parameter updated by param -= lr times grad'
    - kw: Then
      text: 'the probability of class 0 before the update is about 0.51999, and the loss before the update is about 0.65395'
    - kw: And
      text: 'the loss after the step, measured by a fresh forward pass on the same sample, is about 0.49189 - lower, since one step of gradient descent should improve the prediction it just made'
    - kw: And
      text: 'ConvB is now 0, 0.03840085 - channel 0''s bias happened to get no gradient from this particular sample, channel 1''s moved'
code:
  lang: go
  source: |
    // plain SGD: nudge every parameter a small step against its own gradient
    func sgdStep(convB, dConvB []float64, lr float64) {
      for i := range convB {
        convB[i] -= lr * dConvB[i]
      }
      // same shape update for ConvW, DenseW, DenseB - one subtraction per value
    }
checkpoint: You have trained for the first time - one real gradient step that measurably lowered the loss on the sample it saw. Commit and stop for today.
---

Nothing about forward or backward is new here - lessons 15 through 27 already built every piece. What is new is the weights: a network you are about to train needs small starting values and the right number of outputs, so today swaps in a fresh set of pinned weights sized for this project's real task, two classes instead of the illustrative three chapters 3 and 4 used. `SGD` (stochastic gradient descent) is the update itself, and it is almost insultingly simple: for every parameter, subtract the learning rate times that parameter's own gradient. Nothing adaptive, no momentum, just one number nudging another.

Run it once on sample 0 and watch the loss on that exact sample fall from about 0.654 to about 0.492. That is the whole training loop in miniature - repeat this same step enough times, on enough samples, and a network learns. Notice too that channel 0's bias did not move at all this step; that is not a bug, just this particular sample's gradient landing on exactly zero for that one parameter.
