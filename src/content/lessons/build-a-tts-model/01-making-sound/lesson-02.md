---
project: build-a-tts-model
lesson: 2
title: A sine wave at a pitch
overview: 'The simplest sound worth generating is a single pure tone: a sine wave. Today you build the formula and pin down its exact phase, since a different convention would disagree with every value that follows.'
goal: 'Generate a sine wave buffer at a given frequency and amplitude, and confirm exact sample values at four points in its cycle.'
spec:
  scenario: Generating a sine tone
  status: failing
  lines:
    - kw: Given
      text: 'a sine wave at 1000 Hz, amplitude 1.0, at a sample rate of 16000 samples per second'
    - kw: When
      text: 'the wave is generated using x[n] equals amp times the sine of 2 times pi times freq times n, all divided by SampleRate'
    - kw: Then
      text: 'x[0] is 0.0000000000 exactly - not the amplitude, which a cosine convention would give'
    - kw: And
      text: 'x[4] is 1.0000000000 - a quarter of the way through the 16-sample period, at the peak'
    - kw: And
      text: 'x[8] is 0.0000000000 - halfway through the period, crossing back through zero'
    - kw: And
      text: 'x[12] is -1.0000000000 - three quarters through the period, at the trough'
code:
  lang: go
  source: |
    // phase convention: x[n] = amp * sin(2*pi*freq*n / SampleRate)
    w := 2 * math.Pi * freq / float64(sampleRate)
    for i := range buf.Samples {
      buf.Samples[i] = amp * math.Sin(w*float64(i))
    }
checkpoint: 'You can generate a sine wave at any frequency, and you have pinned exactly where its first sample sits. Commit and stop for today.'
---

A sine wave is the purest tone there is: one frequency, nothing else. Generate
`n` samples of `amp * sin(2*pi*freq*n/SampleRate)` and you have it - but that
formula hides a choice you have to make on purpose. A **cosine** convention
(`amp * cos(...)`) is equally valid mathematically and shows up in plenty of
textbooks, and it starts every tone at full amplitude instead of at zero. Pick
sine and `x[0]` is always `0`; pick cosine and `x[0]` is always `amp`. Every
sample after the first depends on which one you chose, so state it once, here,
and every later lesson can rely on it without re-deriving it.

At 1000 Hz and a sample rate of 16000, one full cycle takes exactly 16
samples, which is why today's spec checks the quarter, half and three-quarter
points as well as the start: they are the four places a sine wave's value is
exact rather than an arbitrary decimal, and together they pin the whole shape
of the cycle, not just its beginning.
