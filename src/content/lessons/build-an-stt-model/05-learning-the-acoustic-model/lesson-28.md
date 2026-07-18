---
project: build-an-stt-model
lesson: 28
title: A frame-labelled dataset
overview: Chapter 4 pinned each state's mean feature by hand. Today you build the labelled dataset a real model would learn those means from, reusing chapter 4's toy tone sequence.
goal: Build a 5-example frame-labelled dataset from lesson 22's toy observation sequence, each example holding a 2-feature vector and a silence/tone label.
spec:
  scenario: Building a frame-labelled dataset from the toy observation sequence
  status: failing
  lines:
    - kw: Given
      text: 'lesson 22''s 7-frame toy observation sequence [0.0, 0.1, 3.0, 3.2, 2.9, 0.2, 0.0], with frames 0 and 6 labelled silence (label 0) and frames 2, 3, and 4 labelled tone (label 1) - frames 1 and 5 are left out of the dataset entirely, since they sit on the rising and falling edges and do not cleanly belong to either class'
    - kw: And
      text: 'each kept frame''s single scalar value x0 is widened into a 2-feature vector [x0, x0 squared] - lesson 29''s scorer needs more than one number to weigh'
    - kw: When
      text: the dataset is built
    - kw: Then
      text: 'it holds exactly 5 examples, one per kept frame: frame 0 gives features [0.0, 0.0] with label 0, frame 2 gives [3.0, 9.0] with label 1, frame 3 gives [3.2, 10.24] with label 1, frame 4 gives [2.9, 8.41] with label 1, and frame 6 gives [0.0, 0.0] with label 0'
code:
  lang: go
  source: |
    // each kept frame becomes one Example: expand x0 into [x0, x0*x0]
    type Example struct {
      X     []float64
      Label int // 0 = silence, 1 = tone
      Frame int
    }
checkpoint: You have the literal, labelled dataset chapter 5 trains against - five examples with two-feature inputs and a silence/tone label each. Commit and stop for today.
---

Chapters 1 through 4 all assumed something chapter 5 finally earns: that a silence-like state's mean feature really is `0.0` and a tone-like state's really is `3.0`. Those numbers were pinned outright so the trellis and Viterbi lessons had something concrete to score against; today you build the dataset a real model would learn them from instead.

A full system would label real MFCC frames from chapter 2's pipeline, but chapter 4's toy tone sequence already gives you numbers you trust completely, so today's dataset reuses it rather than introducing a second signal to keep straight. Frames 0 and 6, at the quiet ends, are labelled silence; frames 2 through 4, at the peak, are labelled tone. Frames 1 and 5, sitting on the rising and falling edges, are deliberately left out - a frame mid-transition does not cleanly belong to either class. Each kept frame's single scalar value is also widened into two features, the value itself and its square, so lesson 29's scorer has more than one number to weigh; a single feature could only ever draw a threshold.
