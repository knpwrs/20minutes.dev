---
project: build-an-stt-model
lesson: 29
title: A linear scorer over MFCCs
overview: A linear scorer turns a frame's features into one raw score per class, the same shape whether the input is two numbers or a full MFCC vector. Today you build it and pin its starting weights to all zeros.
goal: Build a per-class linear scorer over lesson 28's features, with weights and bias pinned to all zeros, and confirm every class scores identically at that starting point.
spec:
  scenario: Scoring examples with an all-zero linear model
  status: failing
  lines:
    - kw: Given
      text: 'lesson 28''s 5 examples, each holding a 2-feature vector, and a linear scorer for 2 classes (0 = silence, 1 = tone) over those 2 features, with its weight matrix W and bias vector b pinned to all zeros - 2 rows of 2 zeros for W, and 2 zeros for b'
    - kw: When
      text: 'the score score_k(x) = W[k] dot x + b[k] is computed for both classes on every one of the 5 examples'
    - kw: Then
      text: 'every class score, for every example, is exactly 0.0 - the all-zero weights have not yet learned to prefer silence or tone for any input'
code:
  lang: go
  source: |
    // score_k(x) = W[k]·x + b[k], one score per class
    type LinearScorer struct {
      W [][]float64 // [class][feature]
      B []float64   // [class]
    }
    func (m LinearScorer) Scores(x []float64) []float64 {
      // for each class, dot W[class] with x, then add B[class]
      return nil
    }
checkpoint: Every example now produces one score per class, and you can see exactly why an all-zero start produces no preference at all. Commit and stop for today.
---

A linear scorer is the simplest possible classifier: one row of weights per class, dotted with the input features and added to a bias, giving one raw score per class. Nothing here is specific to acoustic modelling - it is the same shape of thing whether the input is two hand-picked numbers or sixty real MFCC coefficients, which is why it slots in over lesson 28's features without any change to the recipe.

Starting every weight and bias at exactly zero looks like doing nothing, but it is a deliberate choice rather than a placeholder for "pick something reasonable". With W and b both zero, every class's score collapses to the same value - zero - for every possible input, so the model starts by expressing no preference between silence and tone whatsoever. That flat starting point is what makes lesson 30's very first cross-entropy value exact rather than approximate, and it is why nothing in this chapter needs randomness anywhere.
