---
project: build-a-wav-pcm-toolkit
lesson: 15
title: Interleaving channels
overview: Before samples can be written they must go back into the interleaved layout the format stores - the reverse of lesson 12. Today you weave per-channel slices back into one stream.
goal: Interleave per-channel sample slices into a single frame-ordered stream.
spec:
  scenario: Per-channel slices interleave into one stream
  status: failing
  lines:
    - kw: Given
      text: 'channel 0 [100, 300] and channel 1 [200, 400]'
    - kw: When
      text: 'they are interleaved'
    - kw: Then
      text: 'the stream is [100, 200, 300, 400]'
    - kw: And
      text: 'a single channel [100, 200, 300, 400] interleaves to itself unchanged'
code:
  lang: go
  source: |
    // emit frame by frame: for each index, one sample from every channel in order
    func interleave(channels [][]int) []int {
      var out []int
      n := len(channels[0])          // frames per channel
      for i := 0; i < n; i++ {
        for ch := range channels {
          out = append(out, channels[ch][i])
        }
      }
      return out
    }
checkpoint: You can interleave channels back into one stream. Commit and stop here.
---

De-interleaving split a stream into channels; **interleaving** puts them back. You
walk frame by frame - index 0 of every channel, then index 1 of every channel, and
so on - emitting one sample per channel per frame in channel order. Left `[100,
300]` and right `[200, 400]` weave back to `L R L R` = `[100, 200, 300, 400]`,
exactly the stream lesson 12 started from.

This is the precise inverse of de-interleaving, so the two together must round-trip:
`interleave(deinterleave(s, n))` returns `s`. A single channel interleaves to
itself, since there is nothing to weave. From here the path to a file is short - turn
the interleaved samples into bytes with the encoder, then wrap those bytes in the
`fmt ` and `data` chunks and the RIFF header, which is the next two lessons.
