---
project: build-a-png-codec
lesson: 35
title: The Paeth predictor
overview: Paeth is the smartest and trickiest filter, choosing among three neighbors by a specific rule with an exact tie-break. Today you implement the predictor precisely, because a wrong tie-break corrupts real images.
goal: Implement the Paeth predictor and use it to reconstruct a type-4 filtered byte.
spec:
  scenario: The Paeth predictor and its tie-break
  status: failing
  lines:
    - kw: Given
      text: 'the Paeth predictor of left a, above b, and upper-left c'
    - kw: When
      text: it is evaluated
    - kw: Then
      text: 'paeth(1, 1, 2) is 1 and paeth(10, 20, 5) is 20'
    - kw: And
      text: 'reconstruction is recon[x] = raw[x] + paeth(left, above, upperLeft), with all three neighbors 0 when absent'
code:
  lang: go
  source: |
    func paeth(a, b, c int) int {
      p := a + b - c
      pa, pb, pc := abs(p-a), abs(p-b), abs(p-c)
      // ties resolve to a first, then b, then c - this order is mandatory
      if pa <= pb && pa <= pc { return a }
      if pb <= pc { return b }
      return c
    }
checkpoint: You can compute the Paeth predictor with its exact tie-break. Commit and stop here.
---

**Paeth** (filter type 4) predicts a byte from three neighbors - **left** (a), **above** (b), and **upper-left** (c) - by a rule that picks whichever is closest to the simple estimate `p = a + b - c`. You compute the three distances `pa = |p - a|`, `pb = |p - b|`, `pc = |p - c|` and return the neighbor with the smallest. Reconstruction then adds that prediction back, modulo 256, with absent neighbors counting as 0 exactly as before.

The part everyone gets wrong is the **tie-break**, and it is not a matter of taste - the spec fixes it. When distances tie, prefer **a, then b, then c**, which the comparison order `pa <= pb && pa <= pc`, then `pb <= pc` encodes exactly. `paeth(1,1,2)` gives `p = 0`, so `pa = pb = 1` and `pc = 2`; the tie between a and b resolves to `a = 1`. `paeth(10,20,5)` gives `p = 25`, and `b = 20` is closest, so `20`. Reverse the comparisons and most images still *mostly* decode, which is exactly what makes this bug so nasty - pin both cases now.
