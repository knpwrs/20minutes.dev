---
project: build-a-bignum-library
lesson: 19
title: Karatsuba multiplication
overview: Schoolbook multiplication costs four half-size products; Karatsuba does it in three by a clever combination, turning O(n squared) into something much faster. Today you implement it and prove it against schoolbook.
goal: Multiply large magnitudes with Karatsuba - three recursive products recombined - falling back to schoolbook below a threshold.
spec:
  scenario: Karatsuba agrees with schoolbook on large operands
  status: failing
  lines:
    - kw: Given
      text: 'the magnitudes of 1000000000000 and 1000000000000'
    - kw: When
      text: 'they are multiplied with Karatsuba'
    - kw: Then
      text: 'the result renders as "1000000000000000000000000" (ten to the twenty-fourth)'
    - kw: And
      text: 'for the magnitudes of 123456789012345678901234567890 and 987654321098765432109876543210, the Karatsuba product equals the schoolbook product limb for limb'
code:
  lang: go
  source: |
    const kThreshold = 2 // below this many limbs, use schoolbook
    func mulK(a, b mag) mag {
      if len(a) < kThreshold || len(b) < kThreshold { return mulMag(a, b) }
      k := max(len(a), len(b)) / 2
      alo, ahi := splitAt(a, k)
      blo, bhi := splitAt(b, k)
      z0 := mulK(alo, blo)
      z2 := mulK(ahi, bhi)
      // z1 = (alo+ahi)*(blo+bhi) - z0 - z2  (the one saved product)
      // result = z2<<2k + z1<<k + z0, via shlLimbs + addMag
    }
checkpoint: Large magnitudes multiply with Karatsuba, matching schoolbook. Commit and stop here.
---

Split each operand into halves `a = ahi * B^k + alo` and `b = bhi * B^k + blo`. The
full product expands to `ahi*bhi * B^(2k) + (ahi*blo + alo*bhi) * B^k + alo*blo` -
four half-size products. Karatsuba's insight is that the awkward **middle** term
equals `(alo+ahi)*(blo+bhi) - alo*blo - ahi*bhi`, so once you have the corner
products `z0 = alo*blo` and `z2 = ahi*bhi`, one more product of the sums gives the
middle for free. Three recursive multiplications instead of four, applied all the way
down, is the speedup.

Recombine with the tools you already built: `z2` shifted left by `2k` limbs, plus `z1`
shifted by `k`, plus `z0`, using `shlLimbs` and `addMag`. Two things keep it correct -
the middle difference is always non-negative (the sums product is at least `z0 + z2`),
so magnitude subtraction is safe, and a **threshold** sends small inputs to schoolbook
so the recursion bottoms out. Wire `Mul` to call this instead of `mulMag`; because it
agrees with schoolbook at every size, that swap is invisible except in speed.
