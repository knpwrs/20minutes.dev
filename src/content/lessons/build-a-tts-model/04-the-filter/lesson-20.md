---
project: build-a-tts-model
lesson: 20
title: The biquad
overview: 'A biquad is the general two-pole filter every resonator in this chapter specializes. Today you implement its difference equation and pin the sign convention that decides which way feedback bends the pole.'
goal: 'Implement the general biquad difference equation with feedback subtracted, and verify its impulse response against pinned values.'
spec:
  scenario: 'Computing a biquad''s impulse response'
  status: failing
  lines:
    - kw: Given
      text: 'a biquad with b0=1, b1=2, b2=3, a1=0.5, a2=0.25, and all delay-line state initially zero'
    - kw: When
      text: 'it is stepped with an impulse - 1.0 followed by zeros'
    - kw: Then
      text: 'y[0] is exactly 1.0 - the first output is just b0 times the impulse'
    - kw: And
      text: 'y[1] is exactly 1.5, y[2] is exactly 2.0, and y[3] is exactly -1.375 - each computed as b0*x[n] + b1*x[n-1] + b2*x[n-2], minus a1 times y[n-1], minus a2 times y[n-2] - both feedback terms SUBTRACTED, never added'
    - kw: And
      text: 'the pole magnitude, sqrt(a2), is exactly 0.5 - a fact this lesson only observes, since nothing here yet controls stability on purpose'
code:
  lang: go
  source: |
    // Direct Form I - feedback terms SUBTRACTED, not added
    y := bq.B0*x + bq.B1*bq.x1 + bq.B2*bq.x2 - bq.A1*bq.y1 - bq.A2*bq.y2
    // then shift the delay lines: x2,x1 = x1,x ; y2,y1 = y1,y
checkpoint: 'The general biquad recursion works and its sign convention is pinned explicitly, so every specialized filter the rest of this chapter builds inherits the right feedback sign. Commit and stop for today.'
---

A **biquad** is the workhorse of digital filtering: two poles, two zeros, one
short recursion that can be tuned into almost anything from a resonance to a
gentle roll-off. Every filter chapter 4 builds - a formant, a whole cascade
of formants - is this same recursion with particular coefficients, so it is
worth building the general shape once, correctly, before specializing it.

The one detail that must be pinned in prose, not left to guesswork, is the
**sign** of the feedback terms. This project subtracts them - `y[n] = b0*x[n]
+ b1*x[n-1] + b2*x[n-2] - a1*y[n-1] - a2*y[n-2]` - matching the RBJ Audio EQ
Cookbook and `scipy.signal.lfilter`. A paper that instead writes the
recursion with feedback **added** describes the same filter only if it also
flips the sign of `a1` and `a2` - copy coefficients across that boundary
without flipping the sign and the pole ends up in the wrong place. State the
convention once here and every later lesson can just trust it.
