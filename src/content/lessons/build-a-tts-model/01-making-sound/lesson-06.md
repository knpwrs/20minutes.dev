---
project: build-a-tts-model
lesson: 6
title: A sequence of tones
overview: 'A melody is tones placed one after another, not one oscillator whose pitch changes mid-buffer. Today you concatenate enveloped tones into a sequence, wire up an entry point, and your project writes out.wav for the first time.'
goal: 'Concatenate a sequence of enveloped tones into one buffer and write it to out.wav.'
spec:
  scenario: Concatenating a tone sequence
  status: failing
  lines:
    - kw: Given
      text: 'a sequence of two tones - 440 Hz then 880 Hz - each 10 milliseconds long at a sample rate of 16000 samples per second, each with a 5-sample attack and a 5-sample decay'
    - kw: When
      text: the tones are concatenated into a sequence
    - kw: Then
      text: 'the sequence holds 320 samples - two tones of 160 samples each, since 10 milliseconds at 16000 samples per second is 160 samples'
    - kw: And
      text: 'sample 159, the last sample of the first tone, is 0 - decayed to silence'
    - kw: And
      text: 'sample 160, the first sample of the second tone, is also 0 - its own attack starts from silence too, so the seam between tones has no click'
    - kw: And
      text: 'sample 161, one sample into the second tone, is 0.067748'
    - kw: And
      text: 'sample 162, two samples into the second tone, is 0.25497'
code:
  lang: go
  source: |
    // copy each buffer's samples into the output at the running offset
    pos := 0
    for _, b := range bufs {
      copy(out.Samples[pos:], b.Samples)
      pos += len(b.Samples)
    }
checkpoint: 'Your program runs end to end: it builds a sequence of tones and writes out.wav. Commit and stop for today.'
---

A melody is not one oscillator sliding its frequency around - it is separate
tones, each at its own pitch, placed one after another in time. Building that
is concatenation: generate each tone as its own enveloped buffer, then copy
their samples into one longer buffer, back to back. Nothing about the samples
themselves changes; only where they sit in the final buffer does.

This is also where lesson 4's envelope quietly pays off. Because every tone
ramps down to silence before it ends and the next one ramps up from silence
before it starts, the seam between two tones is silence meeting silence - no
click, even though the frequency jumps instantly from 440 Hz to 880 Hz right
at that sample. Wire up an entry point that builds a short sequence like
today's and writes it with lesson 3's `WavBytes`: from today, running your
program produces `out.wav`, and you can play it.
