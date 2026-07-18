---
project: build-a-vision-model
lesson: 32
title: The training loop
overview: A single batched step barely moved the loss. Today you repeat it, over the full 8-sample dataset, and watch the loss actually fall.
goal: Train the pinned network for 30 full-batch steps at lr=0.1, and read the loss both during and after the loop.
spec:
  scenario: Repeating batched steps in a loop
  status: failing
  lines:
    - kw: Given
      text: 'the pinned network from lesson 30, and the full 8-sample dataset from lesson 29 as one batch'
    - kw: When
      text: 'the network trains for 30 steps at lr=0.1 - each step averages the batch loss and gradient as in lesson 31, using the loss measured BEFORE that step''s own update, then applies one SGD update'
    - kw: Then
      text: 'the loss at step 0, measured before any update happens, is about 0.69365'
    - kw: And
      text: 'the loss reported during step 29 - the pre-update forward pass belonging to that final step - is about 0.51742'
    - kw: And
      text: 'the loss AFTER all 30 updates have been applied, measured by one more forward pass run once the loop finishes, is about 0.50612 - distinctly lower than the step-29 reading, because it reflects one more update than any step''s own reported loss ever includes'
    - kw: And
      text: 'training again from the same pinned initial weights reproduces the identical 0.50612 loss after 30 updates, bit for bit - there is no randomness anywhere in this pipeline'
code:
  lang: go
  source: |
    // each step's own loss is measured BEFORE that step's update is applied
    lossAtStep := make([]float64, steps)
    for step := 0; step < steps; step++ {
      grad, loss := batchGradient(net, images, labels)
      lossAtStep[step] = loss
      net.sgdStep(grad, lr)
    }
    // after the loop finishes, a separate forward pass gives "loss after N steps"
checkpoint: You have a real training loop, and can now tell "the loss this step reported" apart from "the loss after training finished" - a distinction that matters every time you read a training log. Commit and stop for today.
---

A training loop is nothing more than lesson 31's one batched step, repeated. Run it 30 times over the same 8 samples and the loss falls from about 0.694 to about 0.506 - a real, measurable improvement, unlike the barely-there drop a single batched step produced.

Read today's numbers carefully, because there is a trap hiding in plain sight. "The loss at step 29" is measured by the forward pass that step ran *before* it changed any parameter - it belongs to the network as it stood after step 28's update, not after step 29's. "The loss after 30 steps" is a separate forward pass, run once the whole loop has finished, and it is lower still because it reflects one more update than step 29's own number ever saw. Every training log you will ever read makes this same distinction, usually without saying so - get comfortable telling them apart now. The determinism check is worth noting too: rerun the exact same loop from the exact same starting weights and you get the exact same final loss, because nothing in this pipeline rolls a die.
