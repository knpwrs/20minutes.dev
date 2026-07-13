---
project: build-a-bignum-library
lesson: 2
title: Normalizing a magnitude
overview: Arithmetic leaves stray zero limbs at the top of a result, and a zero can be written many ways. Today you define the one canonical form - no leading zero limbs - so every magnitude has exactly one representation.
goal: Strip high-order zero limbs so equal magnitudes always have identical limb arrays.
spec:
  scenario: Normalization removes high zero limbs and gives zero a canonical form
  status: failing
  lines:
    - kw: Given
      text: 'a magnitude with limbs (5, 0, 0) from least significant to most'
    - kw: When
      text: 'it is normalized'
    - kw: Then
      text: 'it has 1 limb whose value is 5'
    - kw: And
      text: 'a magnitude with limbs (0, 0) normalizes to the empty magnitude with 0 limbs (canonical zero)'
code:
  lang: go
  source: |
    // drop trailing (most-significant) zero limbs
    func (m mag) normalize() mag {
      i := len(m)
      for i > 0 && m[i-1] == 0 { i-- }
      return m[:i]
    }
    // zero is the empty slice: NumLimbs 0
checkpoint: Every magnitude has one canonical limb array, and zero is the empty one. Commit and stop here.
---

An addition or a subtraction can leave a zero in the top limb - `1000000000 minus
999999999` is just `1`, but the machinery might hand you the limbs `(1, 0)`. If we
let that stand, two equal numbers could have different limb arrays and comparison
would break. **Normalizing** fixes this: walk down from the most significant limb
and drop every zero until you hit a non-zero one (or run out).

The important special case is **zero itself**, which we represent as the **empty**
magnitude - zero limbs. That gives zero exactly one form and, once we add a sign
next lesson, is what stops a "negative zero" from ever existing. From here on,
treat "normalized" as an invariant: every magnitude a public operation returns has
no leading zero limbs.
