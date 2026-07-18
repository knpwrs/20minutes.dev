---
project: build-an-llm
lesson: 42
title: Training the model
overview: Averaging cross-entropy over all 13 examples gives one loss number for the whole training text. Repeatedly computing that loss, backpropagating, and stepping every parameter with SGD is chapter 2's training loop, unchanged.
goal: Train the model for 30 full-batch gradient descent steps over the fixed training text and watch the mean loss drop.
spec:
  scenario: Loss before and after 30 training steps
  status: failing
  lines:
    - kw: Given
      text: 'the model from lesson 39, the 13 training examples from lesson 41, full-batch gradient descent over all 13 examples every step, learning rate 0.1'
    - kw: And
      text: 'loss at step N means the mean cross-entropy loss evaluated at the START of step N, after N prior updates - step 0 is the untrained model'
    - kw: When
      text: '30 full-batch steps run, each computing the mean loss over all 13 examples, backpropagating, zeroing gradients (lesson 17), and applying one SGD update (lesson 16) to every parameter (lesson 15)'
    - kw: Then
      text: 'the loss at step 0 is about 1.357327'
    - kw: And
      text: 'the loss at step 29 is about 0.283191'
code:
  lang: go
  source: |
    // full-batch: mean CE loss over every example, then one SGD step - the
    // exact shape of lesson 18's training loop, just with this model's loss
    for step := 0; step < 30; step++ {
      loss := MeanLoss(model, examples) // lesson 41, averaged over all 13
      ZeroGrad(model.Parameters())      // lesson 17
      loss.Backward()
      // then subtract lr*Grad from every parameter (lesson 16)
    }
checkpoint: The model has now trained end to end on real data - autograd, the transformer block, cross-entropy, and SGD all firing together - and the loss has dropped by more than a factor of 4. Commit and stop for today.
---

Nothing about the training loop itself is new: it is lesson 18's loop, verbatim in shape, with today's model and today's averaged cross-entropy standing in for the toy MLP and its mean squared error. That is worth sitting with for a moment rather than rushing past - the whole point of building one autograd engine all the way through was so that a transformer trains with the exact same three lines as a two-neuron network.

`1.357327` sits close to lesson 41's single-example loss and to `ln(4)`, which is what you would expect from a model that has barely moved off its untrained starting point. By step 29 the mean loss has fallen to `0.283191` - the model is now assigning real probability mass to the correct next character across all 13 examples, not just guessing near-uniformly.
