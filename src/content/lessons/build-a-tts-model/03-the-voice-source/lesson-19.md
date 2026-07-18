---
project: build-a-tts-model
lesson: 19
title: Declination
overview: 'Even without any pitch accents at all, a speaker''s F0 drifts gently downward across an utterance - a phenomenon called declination. Today you add that straight-line decline underneath the contour.'
goal: 'Build a straight-line declination contour, F0 falling at a fixed rate per second from a starting value.'
spec:
  scenario: Applying straight-line declination
  status: failing
  lines:
    - kw: Given
      text: 'a starting F0 of 140 Hz declining at 20 Hz per second, at a sample rate of 16000 samples per second'
    - kw: When
      text: the contour is generated for 8001 samples
    - kw: Then
      text: 'F0[0] is exactly 140 - the starting pitch, at time 0'
    - kw: And
      text: 'F0[1600] is exactly 138 - 0.1 seconds elapsed, and 20 Hz per second decline over 0.1 seconds is 2 Hz'
    - kw: And
      text: 'F0[8000] is exactly 130 - 0.5 seconds elapsed, a 10 Hz decline from the start'
code:
  lang: go
  source: |
    // a straight line: F0 falls linearly with elapsed time, not with sample index directly
    t := float64(i) / float64(sampleRate)
    out[i] = f0Start - declineHzPerSec*t
checkpoint: 'A whole utterance now drifts downward on its own, ready to have pitch accents layered on top in chapter 5. Commit and stop for today.'
---

Lesson 18's contour rises and falls around pitch accents, but even a
sentence with no accents at all still tends to end lower than it started -
speakers gradually run out of breath and let pitch subside as an utterance
goes on. This gentle downward drift is **declination**, and it is worth its
own function precisely because it is not an effect of any particular
syllable - it happens underneath everything else.

The model is deliberately the simplest one that captures it: a straight
line, falling at a fixed number of Hz per second of elapsed time, computed
from the sample index and the sample rate rather than from the index alone.
Chapter 5 later combines this decline with lesson 18's pitch-accent contour
into one sentence-level intonation; today's function only needs to produce
the line by itself.
