---
project: build-a-bignum-library
lesson: 22
title: Finding one quotient limb
overview: The heart of long division is finding a single quotient limb - the largest multiplier of the divisor that does not overshoot the dividend. Today you find it by binary search, which is exact for any divisor.
goal: Find a single quotient limb for a dividend with a one-limb quotient - the largest q with divisor times q not exceeding the dividend.
spec:
  scenario: One quotient limb is the largest multiplier that does not overshoot
  status: failing
  lines:
    - kw: Given
      text: 'the magnitude of 1000000000000000000 and the two-limb divisor 1000000007'
    - kw: When
      text: 'the single quotient limb and its remainder are computed'
    - kw: Then
      text: 'the quotient limb is 999999993 and the remainder is the magnitude of 49'
    - kw: And
      text: 'the divisor times the quotient limb never exceeds the dividend, and the remainder is less than the divisor'
code:
  lang: go
  source: |
    // largest q in [0, Base) with b*q <= a; remainder is a - b*q
    func oneQuotientLimb(a, b mag) (q uint32, rem mag) {
      lo, hi := uint32(0), uint32(Base-1)
      for lo < hi {
        mid := (lo + hi + 1) / 2
        if cmpMag(mulScalar(b, mid), a) <= 0 { lo = mid } else { hi = mid - 1 }
      }
      return lo, subMag(a, mulScalar(b, lo))
    }
checkpoint: You can produce one correct quotient limb for any divisor. Commit and stop here.
---

You cannot read a quotient limb straight off the way single-limb division lets you.
The classical method is to **estimate** it from the divisor's top limb and correct,
but that estimate is only reliably close after a normalization step (scaling the
divisor so its top limb is large); skip the normalization and a small top limb can
send the estimate wildly high, needing a runaway number of corrections. So we take
the simpler, always-correct route: **search** for the digit directly. The quotient
limb is the largest `q` in `[0, Base)` for which `divisor * q` does not exceed the
dividend, and that "largest value satisfying a monotonic test" is exactly what
**binary search** finds - in about thirty steps regardless of the divisor's shape.

Today isolates that single step on a dividend whose quotient fits in one limb -
`1000000000000000000` over `1000000007` is `999999993` remainder `49`. Each search
step multiplies the divisor by a candidate (`mulScalar`) and compares (`cmpMag`);
once the largest non-overshooting `q` is found, the remainder is `dividend - divisor
* q`, guaranteed to be less than the divisor. Next lesson runs this one quotient limb
at a time in a loop to divide numbers of any size.
