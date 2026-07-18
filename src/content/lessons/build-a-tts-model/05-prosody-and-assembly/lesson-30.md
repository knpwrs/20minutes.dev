---
project: build-a-tts-model
lesson: 30
title: 'Concatenating segments'
overview: 'A word''s segments need actual sample counts and onsets before they can be laid end to end into one buffer. Today you convert milliseconds to samples and track where each segment starts.'
goal: 'Convert each segment''s duration to a sample count by rounding, then concatenate them with cumulative onsets.'
spec:
  scenario: 'Converting durations to sample counts and onsets'
  status: failing
  lines:
    - kw: Given
      text: 'the word "hi"''s two segments from lesson 29 - HH at 100.0000 ms, AY at 302.4000 ms - at a sample rate of 16000 samples per second, converting milliseconds to samples by rounding to the nearest sample, half away from zero, never rounding up to guarantee coverage'
    - kw: When
      text: 'each segment is converted and concatenated in order'
    - kw: Then
      text: 'HH starts at onset 0 and holds exactly 1600 samples'
    - kw: And
      text: 'AY starts at onset 1600 and holds exactly 4838 samples - 302.4 ms is 4838.4 samples exactly at this sample rate, and 4838.4 rounds DOWN to 4838, not up to 4839, since 4838.4 is closer to 4838'
    - kw: And
      text: 'the total is exactly 6438 samples, 0.402375 seconds'
code:
  lang: go
  source: |
    // round-half-away-from-zero - never ceiling, even to "guarantee" full coverage
    n := int(math.Round(ms / 1000 * float64(sampleRate)))
    // track a running onset: onset += n for each segment, in order
checkpoint: 'A word''s segments now have real sample counts and onsets, ready to be laid end to end into one buffer. Commit and stop for today.'
---

Lesson 29 resolved every segment's duration in milliseconds, but a buffer of
samples cannot hold milliseconds - each segment needs an integer sample
count, and each needs to know where in the final buffer it starts. Both are
mechanical once the rounding rule is pinned: convert milliseconds to samples
by rounding to the nearest one, then track a running **onset** that
accumulates as each segment's sample count is added.

The rounding rule matters more than it looks. AY's 302.4 ms is exactly 4838.4
samples at 16000 samples per second - not a tidy number - and it is tempting
to round such a value up "to be safe," so no part of the sound gets clipped.
Resist that: round-half-away-from-zero rounds 4838.4 **down** to 4838, since
4838.4 sits closer to 4838 than to 4839, and a synthesizer that quietly
rounds every duration up instead would drift longer than its own timing
model says it should, one segment at a time.
