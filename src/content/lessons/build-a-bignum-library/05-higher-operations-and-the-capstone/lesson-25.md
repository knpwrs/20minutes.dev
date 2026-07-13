---
project: build-a-bignum-library
lesson: 25
title: Shifting left by bits
overview: A left shift by k bits is multiplication by two to the k. With no raw machine bits to lean on, we get it by doubling - and it works at any size. Today you add Shl.
goal: Shift a BigInt left by k bits, equal to multiplying by two to the k, preserving the sign.
spec:
  scenario: A left bit shift multiplies by a power of two
  status: failing
  lines:
    - kw: Given
      text: 'the BigInt 3'
    - kw: When
      text: 'it is shifted left by 4 bits'
    - kw: Then
      text: 'the result is 48'
    - kw: And
      text: 'shifting 1 left by 64 bits gives 18446744073709551616, and shifting -3 left by 4 bits gives -48'
code:
  lang: go
  source: |
    // left shift by one bit is a doubling of the magnitude
    func (x BigInt) Shl(k int) BigInt {
      m := x.mag
      for i := 0; i < k; i++ { m = mulScalar(m, 2) }
      return mk(x.sign, m)
    }
    // (multiplying once by a precomputed 2^k works too)
checkpoint: BigInts shift left by any number of bits. Commit and stop here.
---

Because our number lives in base `1000000000`, there are no machine bits to nudge
directly - but that is fine, because a **left shift by k bits is exactly
multiplication by `2^k`**, and we can multiply. The simplest route is to double the
magnitude `k` times; each doubling is a single scalar multiply by `2`. The sign
just rides along, routed through `mk` so a shifted zero stays canonical zero.

This is the honest consequence of the base-`10^9` representation: shifts are
arithmetic, not bit-twiddling, yet the observable behavior - `3 << 4 == 48`,
`1 << 64 == 2^64` - is identical to a fixed-width shift, and it keeps working long
past the point where a machine word overflows. The right shift, dividing by a power
of two, is the natural next step.
