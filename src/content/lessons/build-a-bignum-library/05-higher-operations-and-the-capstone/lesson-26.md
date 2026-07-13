---
project: build-a-bignum-library
lesson: 26
title: Shifting right by bits
overview: The mirror of a left shift, a right shift by k bits divides by two to the k and drops the remainder. Its edge is shifting a number out of existence entirely. Today you add Shr.
goal: Shift a BigInt right by k bits, equal to floor division by two to the k, collapsing to zero when all bits are gone.
spec:
  scenario: A right bit shift divides by a power of two and can reach zero
  status: failing
  lines:
    - kw: Given
      text: 'the BigInt 48'
    - kw: When
      text: 'it is shifted right by 4 bits'
    - kw: Then
      text: 'the result is 3'
    - kw: And
      text: 'shifting 18446744073709551616 right by 64 bits gives 1, and shifting 5 right by 3 bits gives 0 (all bits shifted out)'
code:
  lang: go
  source: |
    // right shift by one bit is halving the magnitude, discarding the remainder
    func (x BigInt) Shr(k int) BigInt {
      m := x.mag
      for i := 0; i < k && len(m) > 0; i++ {
        m, _ = divScalar(m, 2) // drop the bit that falls off
      }
      return mk(x.sign, m)
    }
checkpoint: BigInts shift right by any number of bits. Commit and stop here.
---

A right shift by `k` bits is floor division by `2^k`: halve the magnitude `k` times,
throwing away the remainder bit each time. Halving is a single scalar division by
`2`, so the whole shift is just that in a loop. The `48 >> 4 == 3` case is a clean
round trip with the left shift, and `2^64 >> 64 == 1` shows it undoing a shift far
beyond machine-word range.

The edge that matters here is **shifting everything out**: `5 >> 3` divides `5` down
past `1` to `0`, and once the magnitude is empty the result is canonical zero. The
loop guard that stops when the magnitude is already empty keeps that from doing
needless work, and `mk` makes sure the vanished number carries sign `0`, not a stale
sign on an empty magnitude.
