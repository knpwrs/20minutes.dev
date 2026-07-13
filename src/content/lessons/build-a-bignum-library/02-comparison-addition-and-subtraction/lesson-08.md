---
project: build-a-bignum-library
lesson: 8
title: Comparing magnitudes
overview: Before we can add signed numbers we need to know which of two magnitudes is bigger - subtraction always takes the smaller from the larger. Today you compare two limb arrays.
goal: Compare two magnitudes and return -1, 0, or 1 by length then by limbs from the top.
spec:
  scenario: Magnitude comparison uses length first, then the highest differing limb
  status: failing
  lines:
    - kw: Given
      text: 'the magnitudes of 1000000000 (two limbs) and 999999999 (one limb)'
    - kw: When
      text: 'they are compared by magnitude'
    - kw: Then
      text: 'the first is greater, returning 1, because it has more limbs'
    - kw: And
      text: 'the magnitude of 5000000000 compared with 4999999999 (both two limbs) returns 1 by the top limb, and two equal magnitudes return 0'
code:
  lang: go
  source: |
    func cmpMag(a, b mag) int {
      if len(a) != len(b) {
        if len(a) < len(b) { return -1 }
        return 1
      }
      for i := len(a) - 1; i >= 0; i-- { // top limb first
        // compare a[i] and b[i]; return -1 or 1 on the first difference
      }
      return 0
    }
checkpoint: You can order two magnitudes. Commit and stop here.
---

Because magnitudes are **normalized** - no leading zero limbs - the one with more
limbs is unconditionally larger. That makes comparison a two-step affair: first
compare the number of limbs, and only when they match do you look at the limbs
themselves. When lengths are equal you scan from the **most significant** limb down
and the first difference decides it; if you never find one, the magnitudes are
equal.

This little function is load-bearing. Signed subtraction needs to subtract the
smaller magnitude from the larger and then pick the right sign, and division will
lean on it too. Returning the familiar `-1 / 0 / 1` three-way result keeps it easy
to reuse everywhere an ordering is needed.
