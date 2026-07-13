---
project: build-a-bloom-filter
lesson: 21
title: The rank of a hash
overview: The remaining hash bits carry the signal HyperLogLog counts, namely how many leading zeros they start with. A long run of leading zeros is rare, so seeing one hints that many distinct items passed by. Today you compute that rank.
goal: Compute the rank of a hash as the number of leading zeros in the bits below the register bits, plus one.
spec:
  scenario: The rank counts leading zeros of the remaining bits
  status: failing
  lines:
    - kw: Given
      text: 'p = 4, so the rank of a hash is the number of leading zero bits among its low 60 bits (the bits below the top 4), plus one'
    - kw: When
      text: 'the rank for "cat" is computed (its remaining bits begin 0, 1, ...)'
    - kw: Then
      text: 'it is 2'
    - kw: And
      text: 'the rank for "dog" is 1, and a hash whose low 60 bits are all zero (such as 0xF000000000000000) has the maximum rank 61'
code:
  lang: go
  source: |
    func (h *HLL) rank(x uint64) int {
      w := x << h.p // drop the top p register bits; keep 64-p meaningful bits
      // count leading zeros within those 64-p bits, then add 1
      // an all-zero remainder gives rank (64 - p) + 1
    }
checkpoint: You can compute the leading-zero rank of any hash. Commit and stop here.
---

Once an item has chosen its register with the top `p` bits, HyperLogLog looks at the **remaining** bits and asks: how many zeros does this run start with before the first one? A random bit string starts with a `1` half the time, with `01` a quarter of the time, with `001` an eighth, and so on. So a rank of `r` (that is, `r - 1` leading zeros then a one) appears with probability `2^(-r)`, and observing a **large** rank is evidence that many distinct values have been hashed - because you had to see a lot of them to stumble onto such a rare pattern.

The rank is that leading-zero count **plus one**, so the smallest possible rank is `1` (the very first bit is a one) and, with `p = 4`, the largest is `61` (all `60` remaining bits are zero). This is the raw observation each register will remember. On its own one rank is a noisy signal; the power comes from keeping the largest rank per register and averaging across many registers, which the next lessons do.
