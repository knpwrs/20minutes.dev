---
project: build-a-tts-model
lesson: 24
title: 'Cascading formants'
overview: 'A vowel has three formants, not one, and a Klatt-style synthesizer chains their resonators in series rather than mixing them side by side. Today you build that cascade and meet its very small output scale.'
goal: 'Chain three formant resonators in series so each stage''s output feeds the next stage''s input.'
spec:
  scenario: 'Cascading three formant resonators in series'
  status: failing
  lines:
    - kw: Given
      text: 'the vowel /a/''s three formant resonators from lesson 23 (F1=730/50, F2=1090/70, F3=2440/170 Hz), chained so stage 1 feeds stage 2 feeds stage 3, at a sample rate of 16000 samples per second'
    - kw: When
      text: 'the cascade is driven with a single impulse for 10 samples'
    - kw: Then
      text: 'the output is approximately 3.2694e-06, 1.57145e-05, 4.15088e-05, 7.85662e-05, 0.000117743, 0.000146702, 0.0001557537, 0.000141651, 0.000107208, 5.79646e-05 - each peak-normalized resonator''s small gain multiplying the next, so the whole cascade''s output sits in the 1e-4-to-1e-6 range'
    - kw: And
      text: 'matching these values needs a RELATIVE tolerance - compare each output to its own magnitude, not to a fixed absolute epsilon. A relative tolerance of a few parts in a hundred thousand (about 2e-5) is the honest target here, wide enough to absorb the rounding in the reference values above; an absolute tolerance like 1e-6 would be meaningless against a signal this small'
code:
  lang: go
  source: |
    // a cascade: each stage's OUTPUT becomes the next stage's INPUT
    y := x
    for _, stage := range stages {
      y = stage.Step(y)
    }
checkpoint: 'Three formants now combine into one filter, and you have seen - and correctly tolerance-checked - just how small a cascaded impulse response gets. Commit and stop for today.'
---

A vowel is shaped by three resonances at once, and the classic Klatt
"cascade branch" chains them in series: the source signal passes through the
F1 resonator, and whatever comes out of that feeds straight into the F2
resonator, and its output feeds F3. No new arithmetic is needed - only
composition of the `Step` you already built in lesson 20, called once per
stage.

Watch the scale of the output, though: each resonator in isolation was
peak-normalized to roughly unit gain, but chaining three of them multiplies
three small per-sample gains together, and the result sits in the `1e-4` to
`1e-6` range rather than anywhere near `1.0`. An absolute check against a
signal that size is nearly useless - a tolerance of `1e-6` swallows the whole
signal - so from here on, compare cascaded outputs with a **relative**
tolerance, or against the signal's own peak or RMS, never an absolute one.
