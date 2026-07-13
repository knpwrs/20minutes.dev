---
project: build-a-bloom-filter
lesson: 11
title: False positives, in theory and in fact
overview: A Bloom filter's whole bargain is a bounded false-positive rate, and there is a formula for it. Today you compute that probability and then construct a real false positive - an item you never added that the filter still reports present.
goal: Compute the expected false-positive rate, and exhibit an absent item the filter reports as present.
spec:
  scenario: The predicted rate, and an actual false positive
  status: failing
  lines:
    - kw: Given
      text: 'the false-positive rule p = (1 minus e to the power of (minus k times n over m)) all to the power of k'
    - kw: When
      text: 'FalsePositiveRate is computed for m = 32, n = 5, and k = 3'
    - kw: Then
      text: 'it returns about 0.0524 (to four decimal places)'
    - kw: And
      text: 'for a NewBloom(16, 3) holding "cat", "dog", "the", and "fox", the never-added item "olive" reports Contains true (its bits 12, 2, and 8 are all set by the others)'
code:
  lang: go
  source: |
    func FalsePositiveRate(m, n, k int) float64 {
      exp := math.Exp(-float64(k) * float64(n) / float64(m))
      return math.Pow(1-exp, float64(k))
    }
    // then: add cat,dog,the,fox to a 16-bit,3-hash filter and query "olive"
checkpoint: You can predict the false-positive rate and produce a real one. Commit and stop here.
---

The false-positive rate has a closed form. After inserting `n` items into `m` bits with `k` hashes, the chance a given bit is still clear is about `e^(-kn/m)`, so the chance it is set is `1 - e^(-kn/m)`, and a false positive needs all `k` of a non-member's bits to be set at once - hence `p = (1 - e^(-kn/m))^k`. It tracks the sizing formulas exactly: plug the optimal `m` and `k` back in and you recover the target `p` you asked for.

Theory is one thing; a concrete false positive makes it real. Pack four items into a deliberately cramped `16`-bit, `3`-hash filter and its bits get crowded. The word `"olive"` was never added, yet its three indices - `12`, `2`, and `8` - each happen to have been set by one of the others, so `Contains("olive")` returns true. That is not a bug; it is the filter behaving exactly as designed. A "yes" always means "probably", and this is the "probably" showing its teeth.
