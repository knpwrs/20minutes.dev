---
project: build-a-tts-model
lesson: 16
title: Noise for fricatives
overview: 'Fricatives like /s/ and /f/ are turbulent air, not a periodic buzz - noise, not a pulse train. Today you add an injectable noise source, so a spec can check a noisy sound without ever asserting a random sample.'
goal: 'Build an injectable NoiseSource interface and a noise burst generator, tested with a constant noise source instead of real randomness.'
spec:
  scenario: Generating noise through an injectable source
  status: failing
  lines:
    - kw: Given
      text: 'a constant noise source fixed at 0.42'
    - kw: When
      text: 'it is sampled at indices 0 through 3'
    - kw: Then
      text: 'every sample is exactly 0.42 - the same fixed value every time, which is what makes this source useful in a spec'
    - kw: Given
      text: 'a 10 millisecond noise burst at amplitude 0.3, sourced from a noise source fixed at 1.0, at a sample rate of 16000 samples per second'
    - kw: When
      text: the burst is generated
    - kw: Then
      text: 'it holds exactly 160 samples - 10 milliseconds at 16000 samples per second'
    - kw: And
      text: 'every sample equals exactly 0.3 - the amplitude times the fixed noise value'
    - kw: And
      text: 'its RMS is exactly 0.3000000000, since a constant signal''s RMS equals its own value'
code:
  lang: go
  source: |
    // an interface so specs can inject a constant instead of real randomness
    type NoiseSource interface {
      Sample(i int) float64
    }
    type ConstantNoise float64
    func (c ConstantNoise) Sample(i int) float64 { return float64(c) }
checkpoint: 'Unvoiced sounds have a noise source, injectable so every burst you generate stays checkable. Commit and stop for today.'
---

Fricatives like /s/ and /f/ are not tonal - they are air forced through a
narrow constriction, and the result is turbulent noise with no periodicity
at all, the opposite of lesson 14's pulse train. A real noise source draws a
fresh random number every sample, which is exactly the problem for a
project built on exact, checkable specs: no spec anywhere in this project
can assert what a random sample equals, because there is no fixed answer to
check it against.

The fix is a seam: `NoiseSource` is an interface with one method, `Sample(i)`,
and the real implementation would return actual randomness - but nothing
here ever calls that implementation in a spec. Instead, every checkable spec
in this project injects `ConstantNoise`, a fixed value repeated forever, and
asserts on what is genuinely checkable instead: the burst's length, its
amplitude scaling, and its RMS. The randomness is real when the program
runs; it just never has to be real when a spec checks it.
