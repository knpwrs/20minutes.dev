---
project: build-an-stt-model
lesson: 10
title: A triangular mel filter
overview: A mel filter is one triangle in frequency space - zero, rising to one, falling back to zero. Today you build that single shape from its three edge bins, the shape tomorrow's filterbank repeats eight times.
goal: Build one triangular mel filter from its three given edge bins over a 64-point spectrum.
spec:
  scenario: Building one triangular filter
  status: failing
  lines:
    - kw: Given
      text: 'one filter''s three edge bins, over the 33 unique bins (0 through 32) of a 64-point power spectrum: left bin 7, center bin 10, right bin 14'
    - kw: When
      text: 'the filter''s weight at bin k is computed as 0 outside [7, 14); (k-7)/(10-7) for k from 7 up to (not including) 10; and (14-k)/(14-10) for k from 10 up to (not including) 14'
    - kw: Then
      text: 'bin 7 is 0, bin 8 is approximately 0.3333, and bin 9 is approximately 0.6667 - the rising edge'
    - kw: And
      text: 'bin 10, the center, is exactly 1.0'
    - kw: And
      text: 'bin 11 is 0.75, bin 12 is 0.5, and bin 13 is 0.25 - the falling edge, reaching 0 again at bin 14'
    - kw: And
      text: 'every bin below 7, and bin 14 and above, is exactly 0'
code:
  lang: go
  source: |
    // rising ramp on [left,center), falling ramp on [center,right), 0 elsewhere
    func TriangleFilter(left, center, right, numBins int) []float64 {
      f := make([]float64, numBins)
      for k := left; k < center; k++ {
        f[k] = float64(k-left) / float64(center-left)
      }
      for k := center; k < right; k++ {
        f[k] = float64(right-k) / float64(right-center)
      }
      return f
    }
checkpoint: You can build the one shape every mel filter uses, from nothing but its three edge bins. Commit and stop for today.
---

A **mel filter** is a triangle laid over the power spectrum: silent below its left edge, rising in a straight line to `1.0` at its center, falling back to silent at its right edge. Multiplying it against the power spectrum and summing gives one number - how much energy sits in that filter's band - which is the whole point of building it. The shape only needs three numbers: where it starts, where it peaks, and where it ends, all expressed as bin indices rather than frequencies.

Today's three edges - `7`, `10`, `14` - are not evenly spaced in bins (`3` bins wide on the rising side, `4` on the falling side), because they were not chosen in bin space at all: they come from points spaced evenly in *mel*, which lesson 11 will compute for a full bank of eight filters spanning the whole spectrum. For today, treat them as given and focus on the ramp itself - the same rising-then-falling arithmetic every one of those eight filters will reuse.
