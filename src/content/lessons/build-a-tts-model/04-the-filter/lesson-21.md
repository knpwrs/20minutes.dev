---
project: build-a-tts-model
lesson: 21
title: 'Tuning a resonator'
overview: 'Most filters in this project are not the general biquad but a special two-pole case tuned to a frequency and a bandwidth. Today you pin that tuning formula and its four coefficients.'
goal: 'Tune the biquad from lesson 20 into a resonator at a target frequency and bandwidth, and pin its four coefficients.'
spec:
  scenario: 'Tuning a biquad into a resonator'
  status: failing
  lines:
    - kw: Given
      text: 'a resonator tuned to frequency 1000 Hz and bandwidth 100 Hz at a sample rate of 16000 samples per second, using R = exp(-pi*BW/SR), theta = 2*pi*F/SR, A1 = -2*R*cos(theta), A2 = R^2, B0 = (1-R^2)*sin(theta)'
    - kw: When
      text: 'the coefficients are computed'
    - kw: Then
      text: 'R is 0.9805565561, and the pole magnitude sqrt(A2) equals R exactly, placing a complex conjugate pole pair at that radius - both irrational, matching to about 8 decimal places'
    - kw: And
      text: 'B0 is 0.0147366951, A1 is -1.8118322654, A2 is 0.9614911598'
code:
  lang: go
  source: |
    // Klatt/Holmes resonator - peak-gain normalized. B1=B2=0, so a lone
    // complex-conjugate pole pair sits at the target frequency and bandwidth
    R := math.Exp(-math.Pi * bw / float64(sampleRate))
    theta := 2 * math.Pi * freq / float64(sampleRate)
    a1, a2 := -2*R*math.Cos(theta), R*R
    b0 := (1 - R*R) * math.Sin(theta)
checkpoint: 'A biquad can now be tuned to any frequency and bandwidth, its four coefficients following from just those two numbers. Commit and stop for today.'
---

Lesson 20's biquad is general - four coefficients with no particular meaning.
A **resonator** is that same biquad with `B1 = B2 = 0` and its remaining
coefficients chosen so a complex-conjugate pole pair sits at a target
frequency and bandwidth. Two numbers in, four coefficients out.

Each coefficient has a job. `R` sets how close the pole sits to the edge of the
unit circle, which controls the **bandwidth** - the closer to the edge, the
narrower and more sharply ringing the resonance. `theta` sets the pole's angle,
which is the **frequency**. `A1` and `A2` place the pole pair from those two,
and `B0` scales the output so the resonance peaks at roughly unit gain. Get this
formula right and the rest of the chapter is just choosing frequencies and
bandwidths to point it at - starting tomorrow, with the vowel formants that make
a resonator sound like a mouth, and the one bandwidth where the whole thing
stops being stable.
