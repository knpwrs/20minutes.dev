---
project: build-a-wav-pcm-toolkit
lesson: 23
title: Reversing a signal
overview: Reversing plays audio backwards, and it is the simplest example of an operation that reorders samples rather than reshaping their values. Today you reverse a single channel and a stereo pair.
goal: Reverse the sample order of a signal, per channel for multi-channel audio.
spec:
  scenario: Reversal flips sample order without changing values
  status: failing
  lines:
    - kw: Given
      text: 'the samples [1, 2, 3, 4]'
    - kw: When
      text: 'the signal is reversed'
    - kw: Then
      text: 'the result is [4, 3, 2, 1]'
    - kw: And
      text: 'reversing the stereo channels left [1, 2] and right [3, 4] gives left [2, 1] and right [4, 3] - each channel reversed on its own'
code:
  lang: go
  source: |
    func reverse(samples []int) []int {
      n := len(samples)
      out := make([]int, n)
      for i, s := range samples {
        out[n-1-i] = s        // last position first
      }
      return out
    }
    // stereo: reverse each channel slice independently
checkpoint: You can reverse a signal, per channel. Commit and stop here.
---

**Reversing** a signal plays it backwards in time, and unlike gain or fade it does
not touch a single sample's value - it only changes their **order**. Sample at index
`i` moves to index `N-1-i`, so `[1, 2, 3, 4]` becomes `[4, 3, 2, 1]`. It is the
canonical example of a **time-domain reordering**, the family that also includes
trimming and looping.

For multi-channel audio the important detail is that you reverse **each channel
independently**, keeping left with left and right with right - never interleave the
two. Working on the per-channel form from lesson 12 makes this natural: reverse the
left slice, reverse the right slice, and the stereo image plays backwards without the
channels swapping. Left `[1, 2]` and right `[3, 4]` become left `[2, 1]` and right
`[4, 3]`. A small operation, but it cements the habit of processing channels
separately that the conversions next lesson depend on.
