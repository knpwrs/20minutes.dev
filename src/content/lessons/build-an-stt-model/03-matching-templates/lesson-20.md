---
project: build-an-stt-model
lesson: 20
title: Delta features
overview: A static MFCC vector says what a frame sounds like, but not whether the sound is rising, falling, or steady. Today you add that motion as a second feature set - one first difference per coefficient, per frame.
goal: Compute delta features for the pipeline's 7 frames using the pinned symmetric-difference rule with clamped edges, and confirm three of them.
spec:
  scenario: Computing first-order delta features with clamped edges
  status: failing
  lines:
    - kw: Given
      text: 'the first 3 MFCC coefficients of 5 of the pipeline''s 7 frames: frame 0 is [-65.12694134, -0.00000000, 0.00000000], frame 1 is [-13.42418845, -2.61733097, -5.71419468], frame 2 is [-22.79679711, -1.69008203, -8.79334467], frame 5 is [-13.29668336, -2.59930943, -5.85583724], and frame 6 (the last of the 7) is [-28.97245704, -1.53457535, -0.14161229]'
    - kw: And
      text: 'the delta rule: for an interior frame t, delta[t] = (mfcc[t+1] - mfcc[t-1]) / 2; at the very first frame, delta[0] = mfcc[1] - mfcc[0]; at the very last frame, delta[last] = mfcc[last] - mfcc[last-1]'
    - kw: When
      text: 'deltas are computed for frame 0 (the first-frame edge rule), frame 1 (an interior frame, using frames 0 and 2), and frame 6 (the last-frame edge rule)'
    - kw: Then
      text: 'frame 0''s delta is [51.70275289, -2.61733097, -5.71419468]'
    - kw: And
      text: 'frame 1''s delta is [21.16507211, -0.84504101, -4.39667234]'
    - kw: And
      text: 'frame 6''s delta is [-15.67577367, 1.06473408, 5.71422495]'
code:
  lang: go
  source: |
    // interior frames: (mfcc[t+1]-mfcc[t-1])/2; first and last frames use
    // only their one available neighbor, with no division by 2
    func Deltas(mfccs [][]float64) [][]float64 {
      out := make([][]float64, len(mfccs))
      // handle t==0 and t==len(mfccs)-1 as their own cases before the general rule
      return out
    }
checkpoint: Every frame now carries both what it sounds like and how it is changing - the richer feature set real speech recognizers train on. Commit and stop for today.
---

Two frames can hold nearly the same MFCC vector while meaning very different things: one might be the peak of a steady vowel, the other a fleeting moment on the way up to it. The static coefficients alone cannot tell those apart, because they only ever describe a single instant. A **delta feature** fixes that by measuring the coefficient's own rate of change - the difference between the frame just after and the frame just before, halved to keep the scale comparable to a single-frame step.

The two ends of the utterance have no "before" or "after" on one side, so they fall back to a plain difference against the one neighbor they do have, with no halving to compensate for a missing second one. Watch frame 0's delta in particular: because the recording starts silent and frame 1 already carries the first rise of the tone, that boundary produces the single largest delta of the whole utterance - exactly the kind of onset a real recognizer needs delta features to notice.
