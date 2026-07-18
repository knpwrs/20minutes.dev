---
project: build-an-stt-model
lesson: 14
title: MFCCs
overview: Only the first handful of DCT coefficients matter for recognizing speech - the rest are fine spectral detail this project has no use for. Today you keep six and call the result an MFCC vector.
goal: Keep the first 6 of the 8 DCT-II coefficients as the frame's MFCC vector.
spec:
  scenario: Truncating to the MFCC vector
  status: failing
  lines:
    - kw: Given
      text: 'the 8 orthonormal DCT-II coefficients from lesson 13: -22.796797, -1.690082, -8.793345, -0.417827, 6.719195, 0.219649, -3.939954, -0.619814'
    - kw: And
      text: 'a cepstra count of 6'
    - kw: When
      text: 'the MFCC vector keeps only indices 0 through 5 and discards indices 6 and 7'
    - kw: Then
      text: 'the MFCC vector is -22.79679711, -1.69008203, -8.79334467, -0.41782677, 6.71919526, 0.21964936 - the first 6 values from lesson 13, unchanged'
    - kw: And
      text: 'it holds exactly 6 values, down from 8'
    - kw: When
      text: 'the whole front end is run end to end - the test signal from lesson 1, pre-emphasized, framed, windowed, transformed to a power spectrum, passed through the mel filterbank, logged, DCT''d, and truncated - producing one MFCC vector per frame kept by lesson 6''s silence trimming'
    - kw: Then
      text: 'there are exactly 5 MFCC vectors, one per surviving frame, each holding 6 values'
    - kw: And
      text: 'the MFCC vector for frame index 2 - which survives trimming, since the kept range is frames 1 through 5 - equals the pinned vector above, confirming the whole chapter composes into one pipeline'
code:
  lang: go
  source: |
    // slicing only - no new math, just keep the low-order coefficients
    func MFCC(dct []float64, numCepstra int) []float64 {
      if numCepstra > len(dct) {
        numCepstra = len(dct)
      }
      return dct[:numCepstra]
    }
    // the payoff: chain every stage from lesson 1 onward into one MFCC per frame
checkpoint: Every frame that survives silence trimming now reduces to a 6-number MFCC vector - the feature chapter 3 onward matches, aligns, and eventually learns from. Commit and stop for today.
---

The higher-order DCT coefficients capture spectral detail - fine ripples related to pitch and individual harmonics - that varies a lot between speakers and recordings of the very same sound, which makes them noisy rather than useful for recognizing *what* was said. The lower-order coefficients, by contrast, describe the broad shape of the spectral envelope - the formants that actually distinguish one speech sound from another - so keeping only the first few keeps the signal and drops the noise. This project keeps 6 of the 8, which is nothing more than a slice: no new arithmetic, just a decision about where to stop.

These 6 numbers - the **MFCC** vector - are what the rest of this project actually operates on. Every frame chapter 1 kept after silence trimming reduces to one of these, and chapter 3 onward compares, normalizes, and eventually learns from nothing else; the raw samples, the spectrum, and the intermediate mel energies have all done their job and can be forgotten.
