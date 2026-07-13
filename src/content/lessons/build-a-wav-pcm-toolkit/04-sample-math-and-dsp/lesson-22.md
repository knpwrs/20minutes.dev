---
project: build-a-wav-pcm-toolkit
lesson: 22
title: Linear fades
overview: A fade ramps the level up from silence or down to it over a span of samples - the gentle start and end that avoids a click. Today you build a linear fade in and fade out from one ramp idea.
goal: Apply a linear fade-in and fade-out by scaling samples along a ramp.
spec:
  scenario: A linear ramp fades samples in and out
  status: failing
  lines:
    - kw: Given
      text: 'the constant samples [1000, 1000, 1000, 1000]'
    - kw: When
      text: 'a linear fade-in over all 4 samples is applied, with factor n/N for sample n of N'
    - kw: Then
      text: 'the result is [0, 250, 500, 750]'
    - kw: And
      text: 'a linear fade-out (factor (N-n)/N) on the same input gives [1000, 750, 500, 250]'
code:
  lang: go
  source: |
    // fade-in: sample n scaled by n/N ; fade-out: by (N-n)/N
    func fadeIn(samples []int) []int {
      n := len(samples)
      out := make([]int, n)
      for i, s := range samples {
        out[i] = int(math.Round(float64(s) * float64(i) / float64(n)))
      }
      return out
    }
checkpoint: You can fade a signal in and out. Commit and stop here.
---

A **fade** is gain that changes over time. A fade-in multiplies the first samples by
a factor that climbs from `0` up to `1`, so the sound emerges from silence; a
fade-out does the reverse, sliding to `0` so it disappears cleanly. Both are the cure
for the **click** you get when audio starts or stops at a non-zero sample - an abrupt
edge the ear hears as a pop.

The simplest shape is **linear**: over a span of `N` samples, sample `n` gets factor
`n/N` for a fade-in. So a constant `1000` over 4 samples becomes `[0, 250, 500,
750]` - a straight ramp. The fade-out is the same idea with factor `(N-n)/N`, giving
`[1000, 750, 500, 250]`. This is really a per-sample **envelope**: a multiplier that
varies across the signal, which is exactly the mechanism the ADSR envelope in the
synthesis chapter generalizes. Round each scaled sample to the nearest integer, and
since factors here never exceed `1` you cannot clip.
