---
project: build-an-stt-model
lesson: 32
title: The training loop
overview: One gradient step barely moves the weights; forty-nine more turn indifference into a real classifier. Today you run the loop and confirm its exact, reproducible loss trajectory.
goal: Run 50 full-batch gradient-descent steps over lesson 28's dataset and confirm the exact loss recorded before steps 1, 10, and 50.
spec:
  scenario: Running the full training loop and checking its loss trajectory
  status: failing
  lines:
    - kw: Given
      text: 'lesson 31''s all-zero-initialized scorer, lesson 28''s 5 examples, a fixed learning rate of 0.1, and 50 repeated full-batch gradient-descent steps with no shuffling and no minibatching - the same deterministic step lesson 31 took, run 50 times in a row'
    - kw: When
      text: the average loss is recorded immediately before each step is taken
    - kw: Then
      text: 'the loss recorded before step 1 is exactly 0.6931471806, matching lesson 31'
    - kw: And
      text: 'the loss recorded before step 10 is approximately 0.2277028962'
    - kw: And
      text: 'the loss recorded before step 50 is approximately 0.1016383279 - lower than step 10''s, but no longer falling nearly as fast, since gradient descent''s steps shrink as the loss surface flattens out near a minimum'
code:
  lang: go
  source: |
    // call GradientStep 50 times in a row; save the loss it returns each
    // time, BEFORE that step's update, into a slice you can read back after
    losses := make([]float64, 50)
    for i := range losses {
      losses[i] = GradientStep(&scorer, dataset, 0.1)
    }
checkpoint: You have a full, exactly reproducible loss curve from the same starting point every time - training is nothing more than lesson 31's one step, repeated. Commit and stop for today.
---

Training is not a different operation from what lesson 31 already built - it is that same one step, taken again and again from wherever the previous step left the weights. Repeating a full-batch step deterministically, with no randomness anywhere in the process, means the exact same starting weights always produce the exact same loss at every step along the way, which is what makes today's numbers pinnable at all.

The shape of the trajectory is worth noticing as much as the individual numbers: the loss falls fast at first, from `ln(2)` down past `0.23` within the first ten steps, then keeps falling but far more slowly over the next forty. That slowdown is not stalling - it is what gradient descent does whenever it is closing in on a good fit, since the gradient itself shrinks as the loss surface flattens out near a minimum. Recording the loss before each step, rather than after, is what lets step 1's number line up exactly with the value lesson 31 already reported.
