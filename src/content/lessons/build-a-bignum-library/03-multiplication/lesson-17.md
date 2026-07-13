---
project: build-a-bignum-library
lesson: 17
title: Shifting left by whole limbs
overview: Karatsuba needs to multiply a magnitude by a power of the base, which in a limb array is just prepending zero limbs. Today you build that limb shift - cheap, exact, and reused later for bit shifts.
goal: Shift a magnitude left by k limbs by prepending k zero limbs, equal to multiplying by the base to the k.
spec:
  scenario: A limb shift prepends zero limbs and preserves canonical zero
  status: failing
  lines:
    - kw: Given
      text: 'the magnitude of 5'
    - kw: When
      text: 'it is shifted left by 2 limbs'
    - kw: Then
      text: 'the result is the magnitude of 5000000000000000000 with limbs (0, 0, 5)'
    - kw: And
      text: 'shifting the empty magnitude by any amount stays empty, and shifting any magnitude by 0 limbs is unchanged'
code:
  lang: go
  source: |
    // multiply by Base^k: k zero limbs below the existing ones
    func shlLimbs(a mag, k int) mag {
      if len(a) == 0 || k == 0 { return a }
      out := make(mag, k+len(a))
      copy(out[k:], a) // low k limbs stay zero
      return out
    }
checkpoint: A magnitude shifts left by whole limbs. Commit and stop here.
---

Multiplying by the base raised to a power is the cheapest multiplication there is:
in a little-endian limb array, multiplying by `1000000000^k` just slides every limb
up by `k` positions and fills the bottom `k` limbs with zero. No arithmetic, no
carries - only a copy into an offset. So `5` shifted left by two limbs becomes
`5 * 10^18`, the limbs `(0, 0, 5)`.

Two edges keep it honest. Shifting the **empty** magnitude must stay empty - zero
times any power of the base is still zero, and you must not manufacture zero limbs
that `normalize` would then have to strip. And a shift of `0` limbs is the identity.
This little operation is what lets Karatsuba reassemble its pieces next, and it
returns in the higher-ops chapter as the backbone of general bit shifting.
