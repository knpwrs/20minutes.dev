---
project: build-an-stt-model
lesson: 22
title: Emission scores
overview: A state needs to say how well an observed frame fits it. Today you build that scoring function directly as a log-score rather than a probability, since every later lesson adds these scores across many frames instead of multiplying them.
goal: Implement the emission log-score logScore(s, x) = -(x - mean_s)^2 and confirm it for two frames of lesson 21's 3 states.
spec:
  scenario: Scoring how well a frame fits each state
  status: failing
  lines:
    - kw: Given
      text: 'lesson 21''s 3 states, with means 0.0, 1.5, and 3.0, and the toy observation sequence (one scalar feature per frame) [0.0, 0.1, 3.0, 3.2, 2.9, 0.2, 0.0]'
    - kw: And
      text: 'the emission log-score formula logScore(s, x) = -(x - mean_s) squared - a log-domain quantity from the moment it is defined, never a plain probability, so that later lessons can add scores across frames rather than multiply probabilities that would eventually underflow to exactly 0'
    - kw: When
      text: 'the log-score of every state is computed for frame 0 (x = 0.0) and frame 2 (x = 3.0)'
    - kw: Then
      text: 'at frame 0, the log-scores are 0.0 for state 0, -2.25 for state 1, and -9.0 for state 2 - state 0 fits best, since its mean is an exact match'
    - kw: And
      text: 'at frame 2, the log-scores are -9.0 for state 0, -2.25 for state 1, and -0.0 for state 2 - now state 2 fits best'
    - kw: And
      text: 'every log-score is 0 or negative, because it is the negative of a square - a perfect match scores exactly 0, and the score only grows more negative as the mismatch grows'
code:
  lang: go
  source: |
    // negative squared distance to the state's mean - already a log-domain score
    func (h HMM) EmissionLogScore(state int, x float64) float64 {
      d := x - h.Means[state]
      return -(d * d)
    }
checkpoint: Every state can now score how well any single frame fits it, and every one of those scores is already in the log domain the rest of this chapter depends on. Commit and stop for today.
---

A state's emission score answers a narrower question than the model as a whole: ignoring how you got here, how well does this one frame's feature match what this state expects to see? A Gaussian centered on the state's mean is the natural way to express "close is good, far is bad," and today's formula is exactly that Gaussian's log, with the constants that do not affect which state wins stripped away - what is left is simply the negative of the squared distance to the mean.

The reason it is written as a log-score rather than a plain probability is not cosmetic. Chapter 4's whole approach is to accumulate a score across every frame of an utterance, and multiplying probabilities together, frame after frame, drives the running product toward zero far faster than seems reasonable - lesson 24 shows exactly how fast, with a real number. Working in the log domain from this very first formula turns that multiplication into addition, which never has that problem, so every later lesson in this chapter only ever adds scores together.
