---
project: build-a-bloom-filter
lesson: 10
title: The optimal number of hashes
overview: Given the array size and item count, there is a best number of hash functions k - few enough that the array does not fill too fast, many enough to make a chance collision unlikely. Today you compute it.
goal: Compute the optimal number of hash functions k for a given m and n.
spec:
  scenario: The optimal hash count for a filter
  status: failing
  lines:
    - kw: Given
      text: 'the rule k = round of (m divided by n, times the natural log of 2)'
    - kw: When
      text: 'OptimalK is computed for m = 9586 bits and n = 1000 items'
    - kw: Then
      text: 'it returns 7 (the unrounded value is about 6.64)'
    - kw: And
      text: 'OptimalK for m = 48 and n = 10 returns 3'
code:
  lang: go
  source: |
    func OptimalK(m, n int) int {
      // k = (m/n) * ln2, rounded to the nearest whole number, at least 1
      k := int(math.Round(float64(m) / float64(n) * math.Ln2))
      if k < 1 { k = 1 }
      return k
    }
checkpoint: You can choose the optimal number of hash functions for a filter. Commit and stop here.
---

The number of hashes `k` is a balancing act. Each item sets `k` bits, so more hashes fill the array faster, which pushes false positives **up**; but more hashes also mean a chance match must coincide on more bits at once, which pushes false positives **down**. Somewhere between those two pressures is a sweet spot, and it falls out cleanly: `k = (m / n) * ln2`, the array's bits-per-item ratio scaled by the natural log of two, rounded to a whole number.

At the optimum something elegant happens - roughly half of all the bits in the array end up set, the point of maximum information per bit. For a thousand items in `9586` bits that gives about `6.64`, which rounds to `7` hash functions. Together with the sizing formula from the last lesson, you can now turn a plain "a thousand items, one percent error" request into concrete filter parameters. Next you will confirm those parameters actually deliver the promised rate.
