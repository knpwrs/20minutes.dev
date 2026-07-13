---
project: build-a-bignum-library
lesson: 12
title: Signed addition
overview: With magnitude add and subtract in hand, signed addition is a dispatch on signs - same signs add, opposite signs subtract the smaller from the larger. The edge is opposite equal values collapsing to canonical zero.
goal: Add two BigInts by dispatching on their signs, keeping zero canonical.
spec:
  scenario: Signed addition dispatches on sign and never produces negative zero
  status: failing
  lines:
    - kw: Given
      text: 'the BigInts 5 and -5'
    - kw: When
      text: 'they are added'
    - kw: Then
      text: 'the result has Sign() 0 and renders as "0" (no negative zero)'
    - kw: And
      text: 'Add(3, -8) is "-5", Add(-4, -6) is "-10", and Add(12345678901234567890, 98765432109876543210) is "111111111011111111100"'
code:
  lang: go
  source: |
    func Add(x, y BigInt) BigInt {
      if x.sign == 0 { return y }
      if y.sign == 0 { return x }
      if x.sign == y.sign { // same sign: add magnitudes, keep sign
        return mk(x.sign, addMag(x.mag, y.mag))
      }
      // opposite signs: subtract smaller magnitude from larger,
      // take the sign of the larger; mk forces sign 0 on empty mag
      ...
    }
checkpoint: BigInts add correctly across signs. Commit and stop here.
---

Every signed sum is one of two shapes. If the signs **match**, the magnitudes add
and the result keeps that shared sign. If the signs **differ**, it is really a
subtraction: take the smaller magnitude from the larger and give the result the sign
of whichever had the larger magnitude. Comparing magnitudes (lesson 8) tells you
which way round to subtract and which sign to keep.

A small constructor - call it `mk(sign, mag)` - is worth writing here: it normalizes
the magnitude and, crucially, forces the sign to `0` whenever the magnitude comes out
empty. That single choke point is what makes `5 + (-5)` land on canonical zero
instead of a negative zero, and every later operation can route its result through it
to stay honest.
