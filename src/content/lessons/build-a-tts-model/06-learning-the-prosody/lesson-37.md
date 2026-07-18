---
project: build-a-tts-model
lesson: 37
title: 'Training the duration model'
overview: 'One gradient step barely moves the model - real training repeats it many times. Today you run 50 epochs (300 total steps) over the fixed dataset and watch the loss fall.'
goal: 'Run 50 epochs of SGD (300 total steps, learning rate 0.02, fixed order, no shuffling) and confirm the loss trajectory.'
spec:
  scenario: 'Training the duration model for 50 epochs'
  status: failing
  lines:
    - kw: Given
      text: 'the pinned initial weights [0,0,0], learning rate 0.02, and 50 epochs over lesson 34''s fixed 6-row dataset - one SGD step per row, in the same order every epoch, no shuffling - 300 steps total'
    - kw: When
      text: 'training runs to completion'
    - kw: Then
      text: 'step 0''s loss, before any update, is approximately 23366.6666666667, and step 1''s weights are exactly [4.8, 0, 0], matching lesson 36'
    - kw: And
      text: 'step 60''s weights are approximately [104.5928427502, 51.2789904770, 42.7475053111] with loss approximately 80.0518406130'
    - kw: And
      text: 'step 150''s weights are approximately [111.0297225969, 46.2672083825, 45.2834153241] with loss approximately 27.0548546997'
    - kw: And
      text: 'the final step, 300, reaches weights approximately [113.6404863372, 42.0012199364, 45.5113931113] with loss approximately 17.7615125572 - down from 23366.6666666667 at the start, all matching to within 1e-6'
code:
  lang: go
  source: |
    for e := 0; e < epochs; e++ {
      for _, ex := range Dataset { // fixed order every epoch - no shuffling
        w = SGDStep(w, ex, lr)
      }
    }
checkpoint: 'The duration model is now fully trained on the fixed dataset, its loss trajectory pinned at four checkpoints from start to finish. Commit and stop for today.'
---

Lesson 36 took exactly one step and the loss barely moved. Real training is
that same step repeated many times: one full pass over the dataset is an
**epoch**, and 50 epochs over 6 rows means 300 total SGD steps, each one
using lesson 36's closed-form gradient on a single example. Learning rate
and epoch count are both pinned here rather than left to trial and error - a
smaller rate leaves the model badly undertrained after the same number of
steps, so 0.02 over 50 epochs is the combination this project commits to.

Watching the loss at a few checkpoints along the way, rather than only at
the start and the end, confirms the training loop is actually iterating in
the right order rather than merely landing on a plausible final answer:
step 60 already shows the weights shifting substantially away from zero,
step 150 has mostly converged, and by step 300 the loss has fallen from over
23000 to under 18 - the fixed six-row dataset genuinely fit, not just
touched once.
