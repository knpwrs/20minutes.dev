---
project: build-an-stt-model
lesson: 8
title: The power spectrum
overview: The DFT gives you a real and an imaginary number per bin, and half the bins are redundant. Today you collapse each pair into one energy value and keep only the bins that carry new information.
goal: Compute the power spectrum of the pipeline's real frame 2 and keep only the bins a real signal actually needs.
spec:
  scenario: Powering the pipeline's real frame
  status: failing
  lines:
    - kw: Given
      text: 'frame 2 - pre-emphasized (lesson 2) and Hamming-windowed (lesson 4), exactly as chapter 1 built it - transformed with lesson 7''s DFT formula, giving Re=-2.510032, Im=1.288246 at bin 7; Re=5.819914, Im=-2.677470 at bin 8; and Re=-2.624376, Im=1.038619 at bin 9'
    - kw: And
      text: 'the power spectrum formula P[k] = (Re[k]^2 + Im[k]^2) / N, with N=64 the frame length'
    - kw: When
      text: 'the power spectrum is computed for bins 0 through 32 (N/2) only - the one half a real-valued signal''s DFT actually needs, since bin (64-k) always mirrors bin k'
    - kw: Then
      text: 'P[7] is approximately 0.124373, P[8] is approximately 0.641254, and P[9] is approximately 0.124470 - the tone''s energy spread across three neighbouring bins instead of landing on one'
    - kw: And
      text: 'the power spectrum holds exactly 33 values, one for each bin from 0 to 32'
code:
  lang: go
  source: |
    // P[k] = (Re[k]^2 + Im[k]^2) / N, only for k = 0..N/2 inclusive
    func PowerSpectrum(x []complex128, n int) []float64 {
      half := n/2 + 1
      p := make([]float64, half)
      for k := 0; k < half; k++ {
        p[k] = (real(x[k])*real(x[k]) + imag(x[k])*imag(x[k])) / float64(n)
      }
      return p
    }
checkpoint: Every frame now reduces to a fixed-size energy spectrum, and you know why half of its bins would just repeat the other half. Commit and stop for today.
---

Squaring and adding the real and imaginary parts throws away phase and keeps only strength - which is all speech recognition needs from here on, since nothing later cares exactly where in its cycle the tone happened to start. Dividing by `N` normalizes that strength by the frame length, so a longer frame does not automatically read as louder. The result is the **power spectrum**: one non-negative number per frequency bin.

Half of those bins are redundant. A real-valued input (every sample here is a plain float, never a complex number) produces a DFT with Hermitian symmetry - bin `N-k` is always the mirror of bin `k` - so bins 33 through 63 tell you nothing bins 0 through 32 did not already say, and every later lesson in this chapter only ever looks at the first 33. Notice, too, that today's frame is back to being the pipeline's real one - pre-emphasized and Hamming-windowed - so the tone's energy is not the clean single spike from lesson 7 but a bump spread across three bins, which is the honest, permanent shape of this project's spectrum from here on.
