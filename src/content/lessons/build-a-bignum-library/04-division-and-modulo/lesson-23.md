---
project: build-a-bignum-library
lesson: 23
title: The long-division loop
overview: With one quotient limb in hand, full division is a loop - bring limbs down from the top, produce a quotient limb against the running remainder, repeat. Today you assemble general long division and finish DivMod.
goal: Divide any magnitude by a multi-limb divisor, building the quotient limb by limb and leaving the true remainder.
spec:
  scenario: The loop produces a multi-limb quotient and a final remainder
  status: failing
  lines:
    - kw: Given
      text: 'the BigInts 1000000007000000000000000005 and 1000000007'
    - kw: When
      text: 'DivMod runs the full long-division loop'
    - kw: Then
      text: 'the quotient renders as "1000000000000000000" and the remainder renders as "5"'
    - kw: And
      text: 'DivMod(1000000000000000000, 1000000007) gives quotient "999999993" and remainder "49"'
code:
  lang: go
  source: |
    func divMag(a, b mag) (q, r mag) {
      q = make(mag, len(a))
      var rem mag // running remainder, starts empty
      for i := len(a) - 1; i >= 0; i-- {
        rem = bringDown(rem, a[i]) // rem = rem*Base + a[i]
        var ql uint32
        ql, rem = oneQuotientLimb(rem, b) // reuse last lesson's step
        q[i] = ql
      }
      return q.normalize(), rem
    }
checkpoint: DivMod divides by any divisor, quotient and remainder exact. Commit and stop here.
---

Full long division is the single-limb loop scaled up. Keep a running **remainder**
that starts empty. Walking the dividend's limbs from the top, "bring down" the next
limb - shift the remainder up one limb and add the new limb - then ask how many times
the divisor fits into that remainder. That count is one quotient limb, produced by
the estimate-and-correct step from last lesson, and what is left becomes the
remainder carried into the next iteration.

Because each brought-down remainder is below the divisor times the base, every
quotient limb fits in a single limb, and the loop lays them down from most
significant to least. When it finishes, the leftover remainder is the true remainder,
already in `[0, divisor)`. Wire this into `DivMod`'s multi-limb branch and division is
complete for magnitudes; the only thing left is teaching it about signs.
