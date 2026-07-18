---
project: build-a-tts-model
lesson: 25
title: 'A steady vowel'
overview: 'A vowel sound is the glottal source from chapter 3 driven through the formant cascade from lesson 24. Today you wire the two halves of a source-filter synthesizer together for the first time.'
goal: 'Drive the /a/ formant cascade with a glottal pulse train and read its onset, steady state and RMS level.'
spec:
  scenario: 'Synthesizing a steady vowel from source and filter'
  status: failing
  lines:
    - kw: Given
      text: 'the /a/ cascade from lesson 24, driven by a glottal pulse train at F0 100 Hz, open quotient 0.6, amplitude 1.0, for 1600 samples (100 ms) at a sample rate of 16000 samples per second'
    - kw: When
      text: 'the vowel is synthesized'
    - kw: Then
      text: 'y[0] is exactly 0, since the pulse train itself starts at exactly 0'
    - kw: And
      text: 'the RMS over all 1600 samples is approximately 0.0001705077 - a relative tolerance, per lesson 24''s gotcha, since this is still a cascaded output on the same tiny scale'
    - kw: And
      text: 'the steady-state region around sample 800 - for example y[804] at approximately 1.2989e-06 - sits on the same order of magnitude as the RMS, unlike the near-silent onset at sample 0'
code:
  lang: go
  source: |
    // source-filter: excite with the glottal source, then run it through the cascade
    pulses := PulseTrain(sampleRate, 100, 0.6, 1.0, n)
    out := cascade.Process(pulses.Samples)
checkpoint: 'A held vowel now comes out of a real source-filter chain, and you can point to its RMS and its steady state as genuinely synthesized, not just filtered noise. Commit and stop for today.'
---

Chapter 3 built a source - the glottal pulse train - and chapter 4 has now
built a filter - the formant cascade. A **source-filter** synthesizer is
just those two things connected: the pulse train's periodic buzz goes in,
the three resonators reshape its spectrum around /a/'s formants, and what
comes out is, for the first time in this project, a real synthesized vowel
rather than a filter fed an isolated impulse.

The onset and the steady state look different for a reason worth noticing:
`y[0]` is `0` because the pulse train itself starts at `0`, but by sample
800 the cascade has had time to ring up and settle into a repeating pattern
tied to the 100 Hz pitch period - the steady state a listener would actually
hear as "the vowel /a/". Both regions live on the same tiny scale lesson 24
warned about, so the RMS and every sample comparison here still needs a
relative tolerance rather than an absolute one.
