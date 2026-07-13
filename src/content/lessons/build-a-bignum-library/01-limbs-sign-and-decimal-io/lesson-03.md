---
project: build-a-bignum-library
lesson: 3
title: Sign and canonical zero
overview: A magnitude only carries size, not direction. Today you wrap it in the public BigInt type - a magnitude plus a sign - and make zero canonical so a negative zero can never exist.
goal: Define BigInt as a signed magnitude and report its sign, with zero always sign 0.
spec:
  scenario: BigInt pairs a magnitude with a sign and forbids negative zero
  status: failing
  lines:
    - kw: Given
      text: 'the BigInt built from the machine integer -5'
    - kw: When
      text: 'its sign is queried'
    - kw: Then
      text: 'Sign() is -1 and IsZero() is false'
    - kw: And
      text: 'the BigInt built from 0 has Sign() 0, IsZero() true, and an empty magnitude (no negative zero), while the BigInt from 7 has Sign() 1'
code:
  lang: go
  source: |
    type BigInt struct {
      sign int // -1, 0, or +1; 0 only for zero
      mag  mag // normalized magnitude, empty when zero
    }
    func NewFromInt64(n int64) BigInt {
      // set sign from n, build mag from the absolute value,
      // and force sign 0 when the magnitude is empty
    }
    func (x BigInt) Sign() int { return x.sign }
checkpoint: BigInt is a signed magnitude with a canonical zero. Commit and stop here.
---

A magnitude tells you how big a number is but not whether it is positive or
negative. The public type, **BigInt**, adds that: a **sign** alongside the
magnitude. We use `-1`, `0`, and `+1` for the sign, and we hold one firm rule -
the sign is `0` **if and only if** the magnitude is empty. That is what makes zero
**canonical**: there is exactly one zero, and it is never negative.

`NewFromInt64` is where this rule first bites. Take the absolute value into a
magnitude, set the sign from the input, but if the magnitude comes out empty force
the sign back to `0`. Getting this invariant right once, here, means every later
operation can simply preserve it: whenever an operation produces an empty
magnitude, it sets the sign to `0`, and negative zero never appears.
