---
project: build-a-wav-pcm-toolkit
lesson: 12
title: De-interleaving channels
overview: Stereo samples are stored interleaved - left, right, left, right - but to work on one channel at a time you need them split apart. Today you de-interleave a flat sample stream into per-channel slices.
goal: Split an interleaved sample stream into one slice per channel.
spec:
  scenario: Interleaved samples split into per-channel slices
  status: failing
  lines:
    - kw: Given
      text: 'the interleaved samples [100, 200, 300, 400] with numChannels 2'
    - kw: When
      text: 'they are de-interleaved'
    - kw: Then
      text: 'channel 0 (left) is [100, 300] and channel 1 (right) is [200, 400]'
    - kw: And
      text: 'the same samples with numChannels 1 give a single channel [100, 200, 300, 400]'
code:
  lang: go
  source: |
    // sample i belongs to channel (i mod numChannels), frame (i div numChannels)
    func deinterleave(samples []int, channels int) [][]int {
      out := make([][]int, channels)
      for i, s := range samples {
        ch := i % channels
        out[ch] = append(out[ch], s)
      }
      return out
    }
checkpoint: You can de-interleave a sample stream into channels. Commit and stop here.
---

In a multi-channel WAV the samples are **interleaved**: one sample per channel for
the first instant (a **frame**), then one per channel for the next instant, and so
on. Stereo is `L R L R L R...`. That layout is right for streaming to hardware, but
wrong for processing - to fade the left channel or average two channels you want
each channel as its own contiguous slice.

**De-interleaving** walks the flat stream and routes sample index `i` to channel
`i mod numChannels`. So `[100, 200, 300, 400]` at 2 channels becomes left
`[100, 300]` and right `[200, 400]`. With one channel it is a no-op - a single
slice equal to the input. This per-channel form is what the sample-math chapter
operates on, and interleaving (the reverse) is how you will lay samples back down
before writing. Together with decoding, this is the second half of turning raw
bytes into usable audio.
