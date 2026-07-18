---
project: build-an-stt-model
lesson: 13
title: The DCT
overview: The 8 log-mel energies are correlated with their neighbours; the discrete cosine transform decorrelates them into cepstral coefficients, and its exact normalization changes every value that follows. Today you pin it precisely.
goal: Implement DCT-II with orthonormal normalization and confirm all 8 output coefficients against pinned values.
spec:
  scenario: Decorrelating the log-mel energies
  status: failing
  lines:
    - kw: Given
      text: 'the 8 log-mel energies from lesson 12'
    - kw: And
      text: 'DCT-II, orthonormally normalized (the same convention as scipy.fftpack.dct with type=2, norm=ortho): X_0 = (1/sqrt(N)) times the sum of all x[n]; and for k > 0, X_k = sqrt(2/N) times the sum of x[n] times cosine(pi/N times (n+0.5) times k), with N=8'
    - kw: When
      text: 'the DCT-II is applied to the 8 log-mel energies'
    - kw: Then
      text: 'X_0 through X_7 are -22.796797, -1.690082, -8.793345, -0.417827, 6.719195, 0.219649, -3.939954, -0.619814'
code:
  lang: go
  source: |
    // scale sqrt(1/N) only for k=0, sqrt(2/N) for every other k - never uniform
    func dctCoef(x []float64, k int) float64 {
      n, s := len(x), 0.0
      for i, v := range x {
        s += v * math.Cos(math.Pi/float64(n)*(float64(i)+0.5)*float64(k))
      }
      if k == 0 {
        return s * math.Sqrt(1/float64(n))
      }
      return s * math.Sqrt(2/float64(n))
    }
checkpoint: The 8 log-mel energies are now 8 decorrelated cepstral coefficients, using the one normalization this project (and scipy) actually uses. Commit and stop for today.
---

The 8 log-mel energies still overlap - neighbouring filters saw overlapping triangles, so their energies rise and fall together. The **discrete cosine transform** fits a set of cosine waves of increasing frequency against that curve and reports how much of each is present, which spreads the information across coefficients that barely correlate with each other: the first few capture the coarse shape of the spectral envelope, the later ones the fine ripples. Keeping only the coarse ones, next lesson, is what actually compresses the representation.

The normalization is the single riskiest number in this entire project, because four different, all-common conventions produce four different, all-plausible-looking answers for the exact same input: the textbook unnormalized sum gives a leading coefficient of `-64.48`, doubling that (scipy's raw `fftpack` output before normalizing) gives `-128.96`, scaling everything uniformly by `2/N` gives `-16.12`, and the pinned orthonormal convention above - scaling `k=0` by `sqrt(1/N)` and every other `k` by `sqrt(2/N)` - gives `-22.80`. All four are "the DCT" in some library's documentation somewhere. This project uses the last one, exactly as written above, because it is the one every later lesson's numbers assume.
