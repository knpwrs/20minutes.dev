---
project: build-a-vision-model
lesson: 31
title: Batching
overview: Training on one sample at a time makes every step chase whatever that one sample wants. Today you average several samples into one step instead.
goal: Average the loss and gradient across a 4-sample batch and take one SGD step from that average.
spec:
  scenario: Averaging a batch before stepping
  status: failing
  lines:
    - kw: Given
      text: 'the same pinned network from lesson 30, and a batch of the first four samples from lesson 29 - i=0, 1, 2, 3, with labels 0, 1, 0, 1'
    - kw: When
      text: 'the loss and gradient are computed independently for each of the four samples, both are averaged across the batch, and one SGD step at lr=0.1 is taken using that averaged gradient'
    - kw: Then
      text: 'the averaged loss before the update is about 0.69395'
    - kw: And
      text: 'the averaged loss after the one batched step, measured the same way over all four samples again, is about 0.69058 - lower, but only slightly, since this single step now has to serve four different samples at once instead of the one lesson 30 tailored it to'
code:
  lang: go
  source: |
    // average N loss values (and, elementwise, N gradient tensors) into one
    func average(values []float64) float64 {
      sum := 0.0
      for _, v := range values {
        sum += v
      }
      return sum / float64(len(values))
    }
checkpoint: You can process a batch instead of a single sample, and have seen that a single batched step moves the loss far less than the single-sample step from lesson 30 did. Commit and stop for today.
---

Lesson 30's step was generous: it only had to please one sample, so it could move the parameters straight toward whatever that sample wanted. A real training run needs steps that work for many samples at once, which means averaging. **Batching** runs the forward and backward pass independently for every sample in the batch, then averages both the losses and the gradients - elementwise, every weight's gradient averaged with that same weight's gradient from every other sample - before taking a single step.

Watch how much smaller today's improvement is than lesson 30's. One sample dropped by about 0.16; four samples averaged together drop by about 0.003, because the step is now a compromise between four different, sometimes conflicting, directions. That tension - one step, several samples pulling it different ways - is the whole reason batching is slower per step but far more representative of what the network actually needs to learn.
