---
project: build-an-stt-model
lesson: 2
title: Pre-emphasis
overview: Speech carries more energy at low frequencies than high ones, which buries the higher-frequency detail that later features depend on. Today you apply one first-difference filter that boosts the highs before anything else touches the signal.
goal: Apply pre-emphasis to the signal from lesson 1 - each sample minus 0.97 times the previous one.
spec:
  scenario: Pre-emphasizing the signal
  status: failing
  lines:
    - kw: Given
      text: 'the 256-sample signal from lesson 1, and a pre-emphasis coefficient of 0.97'
    - kw: When
      text: 'pre-emphasis is applied - y[n] = x[n] minus 0.97 times x[n-1], with the sample before the first one treated as 0'
    - kw: Then
      text: 'y[0] is exactly 0, equal to x[0] - there is no previous sample to subtract'
    - kw: And
      text: 'y[63] is still exactly 0 - one silent sample subtracted from another'
    - kw: And
      text: 'y[64] is exactly 0 - both the tone''s first sample and the silence before it are 0'
    - kw: And
      text: 'y[65] is 0.3535533906, unchanged from the raw tone - its previous sample was still 0'
    - kw: And
      text: 'y[66] is 0.1570532111 - the filter''s first real effect, pulling the raw value 0.5 down by more than half'
code:
  lang: go
  source: |
    // y[n] = x[n] - alpha*x[n-1]; track the previous input sample as you go
    func PreEmphasize(x []float64, alpha float64) []float64 {
    	y, prev := make([]float64, len(x)), 0.0
    	for n, xn := range x {
    		y[n], prev = xn-alpha*prev, xn
    	}
    	return y
    }
checkpoint: Pre-emphasis works and its one boundary case - the very first sample - is pinned. Commit and stop for today.
---

**Pre-emphasis** is a first-difference filter: subtract a fraction of the previous
sample from the current one. It is the simplest possible high-pass filter, and it
exists because human speech (and most microphones) roll off high frequencies, so
without correction the low end dominates every measurement you take later. The
standard coefficient is `0.97` - close enough to 1 that most of the low end still
comes through, far enough that the highs get a real boost.

The one edge worth pinning is the very first sample, which has no predecessor.
Treat the "previous sample" before the signal starts as `0`, which makes `y[0]`
simply equal to `x[0]`. It is a small decision, but it is exactly the kind of
boundary that silently produces a different first value in every implementation
that does not write it down.
