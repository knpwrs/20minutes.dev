---
project: build-a-vision-model
lesson: 34
title: Overfitting a tiny set
overview: The best sanity check for a training pipeline is the easiest possible problem. Today you train on just two samples until the loss drops below a fixed target.
goal: Train the pinned network on a 2-sample subset until the pre-update loss drops below 0.01, and record the step it happens on.
spec:
  scenario: Driving loss below a fixed target on two samples
  status: failing
  lines:
    - kw: Given
      text: 'the pinned network from lesson 30, a 2-sample subset - i=0 (label 0) and i=1 (label 1) from lesson 29 - and a target loss of 0.01'
    - kw: When
      text: 'the same full-batch loop from lesson 32 runs on just these two samples, checking the pre-update loss every step and stopping the first step that loss drops below the target'
    - kw: Then
      text: 'training stops at step 641, with a pre-update loss of about 0.0099955 - just under the 0.01 target, nowhere near zero'
    - kw: And
      text: 'accuracy on the two samples is 100 percent at that point'
code:
  lang: go
  source: |
    // stop the first pre-update loss that drops below the target
    for step := 0; step < maxSteps; step++ {
      grad, loss := batchGradient(net, images, labels)
      if loss < target {
        break // this step's own pre-update loss already met the target
      }
      net.sgdStep(grad, lr)
    }
checkpoint: You have driven the whole pipeline - forward, loss, backward, update - down to a genuinely small loss on data simple enough to memorize, and have an honest, non-inflated number for how small "small" actually got. Commit and stop for today.
---

Two samples is the easiest classification problem this network will ever see - one vertical edge, one horizontal edge, nothing to generalize to. If the training loop cannot drive the loss almost anywhere it wants on a problem this small, something upstream is broken. That makes **overfitting a tiny set** the standard sanity check for a training pipeline: not because it's useful on its own, but because failing it means a real bug, not just a hard dataset.

The honest number is 641 steps to cross a loss of 0.01 - not instant, and not free. It also does not keep collapsing toward zero afterward: at this same learning rate the loss keeps inching down only slowly once it's this close, sitting around 0.003 even after 2000 steps rather than vanishing, because plain SGD with a fixed step size makes small, diminishing progress near a minimum rather than homing in on it. Resist the urge to expect "basically zero" - a real training run rarely gets there, and pretending otherwise makes the number in front of you look broken when it is actually just what gradient descent does.
