---
project: build-a-bignum-library
lesson: 14
title: Multiplying by a single limb
overview: Long multiplication is built from one primitive - multiplying a whole magnitude by a single limb. Today you write that, carrying in 64-bit arithmetic, and pin the multiply-by-zero collapse.
goal: Multiply a magnitude by one limb, propagating a 64-bit carry, with times-zero giving the empty magnitude.
spec:
  scenario: Scalar multiplication carries a wide product across limbs
  status: failing
  lines:
    - kw: Given
      text: 'the magnitude of 123456789 and the single limb 987654321'
    - kw: When
      text: 'the magnitude is multiplied by the limb'
    - kw: Then
      text: 'the result is the magnitude of 121932631112635269 with limbs (112635269, 121932631)'
    - kw: And
      text: 'any magnitude multiplied by the limb 0 is the empty magnitude'
code:
  lang: go
  source: |
    func mulScalar(a mag, s uint32) mag {
      if s == 0 { return nil }
      var out mag
      var carry uint64
      for i := range a {
        p := uint64(a[i])*uint64(s) + carry // fits in 64 bits
        out = append(out, uint32(p%Base))
        carry = p / Base
      }
      for carry > 0 { out = append(out, uint32(carry%Base)); carry /= Base }
      return out.normalize()
    }
checkpoint: A magnitude multiplies by a single limb. Commit and stop here.
---

The building block of all multiplication is multiplying one long number by one
short one. For each limb of the magnitude, multiply it by the scalar and add the
running **carry**. The key sizing fact is why base `1000000000` was chosen: a limb
times a limb is below `10^18`, and adding a carry below `10^18` keeps the product
under `2 * 10^18`, comfortably inside a 64-bit unsigned integer. Split that product
into a limb (modulo the base) and the carry (the rest), just like addition.

Two details close it out. The final carry can be more than one limb's worth, so
drain it with a loop rather than a single append. And multiplying by `0` yields the
empty magnitude - canonical zero - which the early return makes explicit and keeps
the times-zero case from ever producing a stray zero limb.
