---
project: build-a-bignum-library
lesson: 1
title: The limb array
overview: Every big number we build lives in one place - a little-endian array of limbs, each limb a digit in base 1000000000. Today you build that magnitude from an ordinary machine integer and read its limbs back out.
goal: Represent a non-negative magnitude as base-1000000000 limbs and report how many limbs it holds.
spec:
  scenario: A magnitude is a little-endian array of base-1000000000 limbs
  status: failing
  lines:
    - kw: Given
      text: 'a magnitude built from the integer 1000000005'
    - kw: When
      text: 'its limbs are inspected'
    - kw: Then
      text: 'it has 2 limbs, limb 0 (least significant) is 5, and limb 1 is 1'
    - kw: And
      text: 'a magnitude built from 42 has 1 limb whose value is 42'
code:
  lang: go
  source: |
    const Base = 1000000000 // 10^9: each limb holds nine decimal digits
    type mag []uint32       // little-endian: index 0 is least significant
    func magFromUint(n uint64) mag {
      var m mag
      for n > 0 { m = append(m, uint32(n%Base)); n /= Base }
      return m
    }
    // NumLimbs is len(m); Limb(i) is m[i]
checkpoint: You can build a magnitude from an integer and read its limbs. Commit and stop here.
---

A big integer is just a number written in a very large base. We pick base
**1000000000** - ten to the ninth - because a group of exactly nine decimal
digits is then a single **limb**, which will make reading and writing decimal
trivial in a couple of lessons. A magnitude is a slice of these limbs stored
**little-endian**: limb 0 is the least significant, so `1000000005` becomes limb 0
= `5` and limb 1 = `1` (that is `1 * 1000000000 + 5`).

Storing limbs in `uint32` is deliberate: each limb is below `1000000000 < 2^32`, so
it fits, and when we multiply two limbs later the product stays below `10^18`,
which fits in a 64-bit intermediate. Everything the library does is built on this
one representation, so start by getting a magnitude into and out of it.
