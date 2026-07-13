---
project: build-a-wav-pcm-toolkit
lesson: 19
title: Gain with clipping
overview: The first real audio transform is gain - making a signal louder or quieter by scaling every sample. The catch is that too much gain pushes samples past the format's range, so today you also learn to clip.
goal: Scale samples by a gain factor, clamping the result to the 16-bit range.
spec:
  scenario: Gain scales samples and clamps at the range edges
  status: failing
  lines:
    - kw: Given
      text: 'the 16-bit samples [100, 20000, -20000, 200]'
    - kw: When
      text: 'a gain of 2.0 is applied with clamping to [-32768, 32767]'
    - kw: Then
      text: 'the result is [200, 32767, -32768, 400]'
    - kw: And
      text: '20000*2.0 clips to 32767 and -20000*2.0 clips to -32768, rather than overflowing'
code:
  lang: go
  source: |
    func clampInt16(v int) int {
      if v > 32767 { return 32767 }
      if v < -32768 { return -32768 }
      return v
    }
    func gain(samples []int, factor float64) []int {
      // for each s: clampInt16(round(float64(s) * factor))
    }
checkpoint: You can apply gain with clipping. Commit and stop here.
---

**Gain** is the simplest useful effect: multiply every sample by a constant factor.
A factor above `1.0` amplifies, below `1.0` attenuates, and `0.0` mutes. But samples
live in a fixed range - `-32768` to `32767` for 16-bit - and scaling can push a value
past the edge. A raw multiply that overflows the integer type **wraps**, turning a
loud peak into a burst of noise of the opposite sign. That is the classic digital
distortion you must prevent.

The fix is **clipping** (clamping): after scaling, force any value above the maximum
down to `32767` and any value below the minimum up to `-32768`. So `20000 * 2.0` is
`40000`, which clamps to `32767`, and `-20000 * 2.0` clamps to `-32768`. Round the
scaled value to the nearest integer first, then clamp. This `clampInt16` helper is
the workhorse of the whole DSP chapter - every operation that can exceed the range
ends by calling it, so silence-to-full-scale audio never overflows into garbage.
