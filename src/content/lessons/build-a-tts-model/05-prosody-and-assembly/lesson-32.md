---
project: build-a-tts-model
lesson: 32
title: 'A full utterance'
overview: 'Every piece built so far - excitation, filtering, duration and concatenation - now assembles into one real word. Today you synthesize "hi" end to end and produce its full buffer.'
goal: 'Synthesize the word "hi" end to end: HH as noise, AY as a diphthong transition, concatenated into one buffer.'
spec:
  scenario: 'Synthesizing the full word hi'
  status: failing
  lines:
    - kw: Given
      text: 'HH excited as noise at amplitude 0.3 for 1600 samples (100 ms), and AY driven by a glottal pulse train at F0 120 Hz and open quotient 0.6 - the same source setting as lesson 25 - through a time-varying /a/-to-/i/ cascade for 4838 samples (302.4 ms), both at a sample rate of 16000 samples per second'
    - kw: When
      text: 'the two segments are synthesized and concatenated'
    - kw: Then
      text: 'the full buffer holds exactly 6438 samples, 0.402375 seconds'
    - kw: And
      text: 'full[0:4] are each exactly 0.3 - HH''s noise burst'
    - kw: And
      text: 'full[1600:1604], the start of AY, begins at exactly 0 and rises through the tiny 1e-8 range as the cascade rings up - matched with a relative tolerance, as in lesson 24'
    - kw: And
      text: 'the RMS over the whole buffer is approximately 0.1495567171'
code:
  lang: go
  source: |
    hh := Excite(hhPhoneme, sr, f0, oq, 0.3, hhSamples, noise)
    ay := TimeVaryingCascade(sr, ayPulses, f1Ramp, bw1Ramp, f2Ramp, bw2Ramp, f3Ramp, bw3Ramp)
    full := Concat(hh, Buffer{SampleRate: sr, Samples: ay})
checkpoint: 'A whole word now comes out of this project as one real, synthesized buffer, from raw text-shaped phonemes to sample values. Commit and stop for today.'
---

Nothing new needs building today - only wiring together everything chapter 3,
chapter 4 and the last four lessons already built. HH is excited as noise,
the way lesson 17 dispatches any unvoiced fricative. AY is a glottal pulse
train run through a time-varying cascade that glides its formants from /a/
toward /i/, exactly lesson 26's technique, sized to the 4838 samples lesson
30 computed. `Concat` from chapter 1 lays the two buffers end to end.

The result is the first genuinely synthesized **word** this project has
produced: a real duration model, a real source-filter chain, and a real
concatenation, rather than an isolated demonstration of any one of them.
Notice that AY's onset starts back down near silence again, on the same
tiny scale lesson 24 flagged, before the cascade rings up into its
steady-state range - the same relative-tolerance caution applies here too.
