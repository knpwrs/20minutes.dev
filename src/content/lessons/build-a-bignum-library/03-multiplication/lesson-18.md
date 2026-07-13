---
project: build-a-bignum-library
lesson: 18
title: Splitting a magnitude in half
overview: Karatsuba's whole idea is to cut each number into a high and low half. Today you build that split and its inverse - reassembling the halves - which is exactly the recombination step Karatsuba will use.
goal: Split a magnitude at k limbs into low and high halves, and reassemble them back to the original.
spec:
  scenario: A magnitude splits at a limb boundary and reassembles exactly
  status: failing
  lines:
    - kw: Given
      text: 'the magnitude of 12345678901234567890 (limbs (234567890, 345678901, 12)) split at k = 1'
    - kw: When
      text: 'its low and high halves are taken'
    - kw: Then
      text: 'the low half is the magnitude of 234567890 and the high half is the magnitude of 12345678901'
    - kw: And
      text: 'reassembling as high shifted left by 1 limb plus low gives back 12345678901234567890'
code:
  lang: go
  source: |
    // x == hi*Base^k + lo, with lo the bottom k limbs
    func splitAt(a mag, k int) (lo, hi mag) {
      if k >= len(a) { return a, nil }
      return a[:k].normalize(), a[k:].normalize()
    }
    // reassemble: addMag(shlLimbs(hi, k), lo)
checkpoint: A magnitude splits into halves and reassembles exactly. Commit and stop here.
---

Karatsuba rests on writing a number as `x = hi * Base^k + lo`, where `lo` is the
bottom `k` limbs and `hi` is everything above them. In a limb array that split is
trivial - two slices at position `k` - but each half must be **normalized** on its
own, because the high slice of, say, `(234567890, 345678901, 12)` at `k = 1` is
`(345678901, 12)`, the value `12345678901`, and any half could carry its own leading
zero.

The reassembly is the piece that matters most: shift the high half left by `k` limbs
(lesson 17) and add the low half back (lesson 10), and you recover the original
exactly. That `hi shifted by k, plus lo` pattern is precisely how Karatsuba will glue
its three sub-products back together next lesson, so getting the split and its inverse
to round-trip here is the whole setup.
