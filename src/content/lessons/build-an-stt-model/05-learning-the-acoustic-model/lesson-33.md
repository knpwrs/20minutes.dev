---
project: build-an-stt-model
lesson: 33
title: Scoring frames with the trained model
overview: Training only matters if the result actually separates silence from tone. Today you score lesson 28's dataset with the trained weights and confirm every prediction now lands correctly.
goal: Score every one of lesson 28's 5 examples with lesson 32's final trained weights and confirm every prediction now matches its true label.
spec:
  scenario: Confirming the trained scorer separates silence from tone
  status: failing
  lines:
    - kw: Given
      text: 'lesson 32''s scorer after all 50 training steps, and lesson 28''s same 5 examples'
    - kw: When
      text: 'each example''s features are scored, turned into probabilities by softmax, and predicted as whichever class has the higher probability'
    - kw: Then
      text: 'frame 0 (silence, features [0.0, 0.0]) predicts class 0, with a probability of approximately 0.781630 of silence'
    - kw: And
      text: 'frame 2 (tone, features [3.0, 9.0]) predicts class 1, with a probability of approximately 0.997393 of tone'
    - kw: And
      text: 'frame 6 shares frame 0''s exact features [0.0, 0.0], so it produces the exact same prediction and the exact same probabilities'
    - kw: And
      text: 'all 5 examples now predict their true label, for an accuracy of 5 out of 5 - up from the all-zero scorer''s 50-50 guess on every example'
code:
  lang: go
  source: |
    // predict whichever class softmax gives the higher probability to
    probs := Softmax(scorer.Scores(example.X))
    pred := 0
    if probs[1] > probs[0] {
      pred = 1
    }
checkpoint: Training turned an indifferent scorer into one that separates silence from tone perfectly on its own dataset - chapter 6 now has real per-frame class probabilities to decode into text. Commit and stop for today.
---

Everything from lesson 29 onward was building toward this one check: does the trained scorer actually do the job it was trained for? Running lesson 28's 5 examples back through lesson 32's final weights turns each one's features into a pair of probabilities, and this time the two classes are anything but tied.

Every example now predicts its own true label, which is worth confirming precisely rather than taking on faith - a model that gets every training example right is not automatically a good model in general, but it is the minimum a working implementation of this pipeline must achieve on the data it just saw fifty times. Frame 0 and frame 6 sharing identical input features and therefore identical output probabilities is a useful sanity check too: the scorer has no notion of "frame number" at all, only the features you hand it, so two identical inputs anywhere in the dataset must always produce identical predictions.
