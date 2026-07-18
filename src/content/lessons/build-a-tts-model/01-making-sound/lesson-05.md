---
project: build-a-tts-model
lesson: 5
title: Adding waves together
overview: 'Real sound is rarely one frequency at a time - a chord, or a voice with its overtones, is several tones summed. Today you mix buffers together and scale down so summing them cannot clip.'
goal: 'Mix any number of buffers into one by summing corresponding samples and scaling to avoid overflow.'
spec:
  scenario: Mixing two buffers
  status: failing
  lines:
    - kw: Given
      text: 'two 4-sample buffers at the same sample rate - one holding 1.0 in every sample, the other holding 0.5 in every sample'
    - kw: When
      text: the two buffers are mixed
    - kw: Then
      text: 'every sample of the result is 0.75 - the two samples sum to 1.5, then that sum is scaled by 1 divided by 2, the number of buffers being mixed'
code:
  lang: go
  source: |
    // sum matching samples, then scale down so N full-scale inputs can't clip
    scale := 1.0 / float64(len(bufs))
    for _, b := range bufs {
      for i := range out.Samples {
        out.Samples[i] += b.Samples[i] * scale
      }
    }
checkpoint: 'You can play several tones at once as a single buffer. Commit and stop for today.'
---

A chord is not a new kind of sound - it is several sine waves added together,
sample by sample, at the same points in time. Mixing two buffers is exactly
that: pair up the samples at each index and sum them. The only wrinkle is
scale. Two buffers each already sitting at `1.0` sum to `2.0`, which is well
outside the `-1..1` range a sample is supposed to live in, so a plain sum
silently overflows the moment more than one voice is at full volume.

The fix is the same shape as the envelope from lesson 4: multiply by a gain,
chosen so the worst case cannot clip. Scale the sum by `1 / N` for `N` buffers,
and the worst case - every buffer at full scale, `1.0`, at the same sample -
sums to exactly `N`, and `N` scaled by `1/N` lands exactly back at `1.0`, the
top of the range rather than past it. Today's two unequal inputs, `1.0` and
`0.5`, show the same arithmetic on a case where the answer is not the ceiling
itself.
