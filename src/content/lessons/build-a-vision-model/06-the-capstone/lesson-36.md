---
project: build-a-vision-model
lesson: 36
title: Training it end to end
overview: Lesson 32's 30 steps were a demonstration of the loop's mechanics. Today you run the assembled network for 200 steps - a training run long enough to actually converge.
goal: Train the Net from lesson 35 for 200 full-batch steps at lr=0.1 on the full dataset, and read the loss trajectory at fixed checkpoints.
spec:
  scenario: Training the assembled network for 200 steps
  status: failing
  lines:
    - kw: Given
      text: 'the Net from lesson 35, and the full 8-sample dataset from lesson 29'
    - kw: When
      text: 'the network trains for 200 steps at lr=0.1, using the same full-batch loop from lesson 32 - each step''s own loss measured before that step''s update'
    - kw: Then
      text: 'the loss at step 0 is about 0.69365 - the same average loss lesson 32 measured before its own first update, since both runs start from the identical pinned network and dataset'
    - kw: And
      text: 'the pre-update checkpoints read: step 9 about 0.66318, step 49 about 0.31445, step 99 about 0.12112, step 199 about 0.046532'
    - kw: And
      text: 'the loss after all 200 updates, measured by a separate forward pass once the loop finishes, is about 0.046105 - lower than the step 199 reading, the same before/after distinction lesson 32 pinned'
    - kw: And
      text: 'accuracy on the full dataset after 200 steps is 100 percent'
code:
  lang: go
  source: |
    checkpointSteps := map[int]bool{0: true, 9: true, 49: true, 99: true, 199: true}
    for step := 0; step < 200; step++ {
      grad, loss := net.BatchGradient(images, labels) // this step's pre-update loss
      if checkpointSteps[step] {
        fmt.Printf("step %d: loss = %v\n", step, loss)
      }
      net.SGDStep(grad, lr)
    }
checkpoint: The full network is now genuinely trained - 200 real steps, a loss curve you watched fall by more than an order of magnitude, and perfect accuracy on the data it trained on. Commit and stop for today.
---

Lesson 32 ran 30 steps to show what a training loop does; today runs 200, long enough to see the loss actually settle rather than just start falling. Nothing about the loop itself is new - it is the exact same pre-update-loss-then-update shape - only the network is now the assembled `Net` from lesson 35, and the run is long enough to matter for what comes next.

Watch the shape of the curve rather than any single number: a fast drop across the first fifty steps, from 0.69 down near 0.31, then a long, slowing tail down to 0.046 by step 199. That shape - fast early progress, diminishing returns later - is what gradient descent looks like on almost any problem, not a quirk of this one. The network trained here is the one lesson 37 asks a genuinely new question of.
