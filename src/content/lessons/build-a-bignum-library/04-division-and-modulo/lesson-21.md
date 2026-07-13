---
project: build-a-bignum-library
lesson: 21
title: The DivMod contract
overview: Before the hard general algorithm, nail the contract every division must honor - a quotient and a remainder with the remainder in range, plus the easy cases and the divide-by-zero error. Today you build the public DivMod skeleton around single-limb division.
goal: Define DivMod returning quotient and remainder with 0 <= remainder < divisor, handling the trivial cases and rejecting a zero divisor.
spec:
  scenario: DivMod pins the quotient-remainder contract and edge cases
  status: failing
  lines:
    - kw: Given
      text: 'the BigInts 17 and 5'
    - kw: When
      text: 'DivMod(17, 5) is evaluated'
    - kw: Then
      text: 'the quotient is 3 and the remainder is 2, with 0 <= remainder < 5'
    - kw: And
      text: 'DivMod(5, 12) is quotient 0 remainder 5 (dividend below divisor), DivMod(12, 12) is quotient 1 remainder 0, and DivMod by 0 returns an error'
code:
  lang: go
  source: |
    func DivMod(x, y BigInt) (q, r BigInt, err error) {
      if y.sign == 0 { return q, r, errors.New("division by zero") }
      c := cmpMag(x.mag, y.mag)
      if c < 0 { return zero(), x, nil }        // dividend < divisor
      if len(y.mag) == 1 {                       // single-limb divisor
        qm, rem := divScalar(x.mag, y.mag[0])
        return mk(1, qm), NewFromInt64(int64(rem)), nil
      }
      // multi-limb divisor: general long division comes next lesson
    }
checkpoint: DivMod honors its contract on the easy cases. Commit and stop here.
---

Division returns two things, and their relationship is the contract the rest of the
library depends on: for a dividend `x` and non-zero divisor `y`, the quotient `q` and
remainder `r` satisfy `x = q*y + r` with `0 <= r < |y|`. Pinning that now, on the
cases you can already handle, means the hard algorithm next lesson only has to slot
into a shape that is already correct.

Three easy cases cover a lot. A **zero divisor** is an error, not a crash - division
by zero has no answer, so return one clearly. When the dividend's magnitude is
**smaller** than the divisor's, the quotient is `0` and the remainder is the whole
dividend. And a **single-limb** divisor routes straight to `divScalar` from last
lesson. What is left - a genuinely multi-limb divisor - is the schoolbook long
division you will build over the next two lessons.
