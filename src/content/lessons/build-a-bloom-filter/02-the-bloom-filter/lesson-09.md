---
project: build-a-bloom-filter
lesson: 9
title: Sizing the bit array
overview: How big should the array be? For a target false-positive rate and an expected item count there is an exact formula for the optimal number of bits. Today you compute it.
goal: Compute the optimal number of bits m for n expected items at a target false-positive rate p.
spec:
  scenario: The optimal bit count for n items at rate p
  status: failing
  lines:
    - kw: Given
      text: 'the sizing rule m = ceil of (minus n times the natural log of p) divided by (the natural log of 2, squared)'
    - kw: When
      text: 'OptimalM is computed for n = 1000 expected items and p = 0.01'
    - kw: Then
      text: 'it returns 9586 (the unrounded value is about 9585.06)'
    - kw: And
      text: 'OptimalM for n = 10 and p = 0.1 returns 48'
code:
  lang: go
  source: |
    func OptimalM(n int, p float64) int {
      // m = -n * ln(p) / (ln2 * ln2), rounded up
      return int(math.Ceil(-float64(n) * math.Log(p) / (math.Ln2 * math.Ln2)))
    }
checkpoint: You can size the bit array for a target false-positive rate. Commit and stop here.
---

A Bloom filter's accuracy is a budget you set in advance. Give it too few bits for the number of items and it fills up, and almost everything looks present; give it plenty and false positives become rare. The relationship is exact: to hold `n` items at a false-positive rate `p`, the optimal array size is `m = -n * ln(p) / (ln2)^2` bits, rounded up to a whole number.

The shape of the formula is worth reading. It grows linearly with `n` - twice the items need twice the bits - and it grows as `p` shrinks, but only logarithmically, so squeezing the error rate from one percent to a tenth of a percent costs another `n / (ln2)^2` bits, not ten times as many. For a thousand items at one percent that works out to about 9.6 kilobits, roughly 1.2 bytes per item regardless of how large the items themselves are. That per-item constant is the headline number that makes Bloom filters worth using.
