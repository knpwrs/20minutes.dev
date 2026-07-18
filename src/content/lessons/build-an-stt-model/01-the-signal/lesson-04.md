---
project: build-an-stt-model
lesson: 4
title: The Hamming window
overview: A frame is a hard rectangular slice of the signal, and that sharp edge is not really silence - it will smear energy across the spectrum once chapter 2 transforms it. Today you taper each frame's edges toward zero before that can happen.
goal: Build the symmetric 64-sample Hamming window and multiply it into each frame.
spec:
  scenario: Windowing a 64-sample frame
  status: failing
  lines:
    - kw: Given
      text: 'a symmetric Hamming window of length 64: w[n] = 0.54 minus 0.46 times the cosine of 2 times pi times n, divided by 63 (that is, N minus 1)'
    - kw: When
      text: the window is built
    - kw: Then
      text: 'w[0] is 0.08'
    - kw: And
      text: 'w[63] is 0.08 too - the symmetric window repeats its first value at the last sample'
    - kw: And
      text: 'w[31] is approximately 0.9994281838 - the near-flat peak in the middle of the frame'
    - kw: When
      text: frame 2 from lesson 3 (the pure-tone frame) is multiplied by this window, sample by sample
    - kw: Then
      text: 'the windowed frame''s first sample is 0 and its second sample is approximately 0.0290924389 - shrunk from the raw 0.3535533906 by the window''s small edge weight'
code:
  lang: go
  source: |
    // symmetric Hamming: denominator is (N-1), so w[0] and w[N-1] come out identical
    func Hamming(n int) []float64 {
    	w := make([]float64, n)
    	for i := range w {
    		w[i] = 0.54 - 0.46*math.Cos(2*math.Pi*float64(i)/float64(n-1))
    	}
    	return w
    }
checkpoint: Every frame is now tapered at its edges instead of cut off sharply. Commit and stop for today.
---

A rectangular frame boundary is a discontinuity the signal never actually had -
the samples just outside the frame do not simply vanish, but a hard cut behaves as
if they did. A **window** fixes this by scaling each sample down toward zero near
the edges and leaving the middle almost untouched, so the frame fades in and out
instead of stopping abruptly. The **Hamming window** is the classic choice for
speech: `w[n] = 0.54 - 0.46*cos(2*pi*n/(N-1))`.

That denominator matters more than it looks like it should. Using `N-1`, as pinned
above, makes the window **symmetric** - its first and last samples are identical
(`w[0] = w[63] = 0.08`). Swap the denominator to `N` instead (the "periodic"
variant, used for spectral analysis of continuous streams) and `w[63]` comes out
to `0.0822` - close, but not the same window. A third variant, "exact Hamming"
with coefficients `0.53836`/`0.46164` instead of `0.54`/`0.46`, gives `w[0] =
0.07672`. All three are called "the Hamming window" somewhere in the literature;
only the symmetric `0.54`/`0.46` form is the one this project uses from here on.
