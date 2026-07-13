---
project: build-a-bignum-library
lesson: 11
title: Subtracting magnitudes with borrow
overview: Subtraction is addition's mirror - a borrow instead of a carry - and its edge is the opposite too, since the result can shrink and lose its top limbs. Today you subtract the smaller magnitude from the larger.
goal: Subtract a smaller magnitude from a larger one with borrows, normalizing away any leading zero limbs.
spec:
  scenario: Subtraction borrows across limbs and can shrink the limb count
  status: failing
  lines:
    - kw: Given
      text: 'the magnitudes of 1000000000000000000 (limbs (0, 0, 1)) and 1'
    - kw: When
      text: 'the smaller is subtracted from the larger'
    - kw: Then
      text: 'the result is the magnitude of 999999999999999999 with limbs (999999999, 999999999) - the borrow rippled down and the top limb disappeared'
    - kw: And
      text: 'the magnitudes of 1000000000 and 1 give 999999999 (one limb), and 5 minus 5 gives the empty magnitude'
code:
  lang: go
  source: |
    // precondition: a >= b by magnitude
    func subMag(a, b mag) mag {
      var out mag
      var borrow int64
      for i := range a {
        diff := int64(a[i]) - borrow
        if i < len(b) { diff -= int64(b[i]) }
        if diff < 0 { diff += Base; borrow = 1 } else { borrow = 0 }
        out = append(out, uint32(diff))
      }
      return out.normalize()
    }
checkpoint: Magnitudes subtract with borrow and normalize the result. Commit and stop here.
---

Subtraction walks the limbs the same way addition does, but when a limb of `a` is
smaller than the corresponding limb of `b` (plus any incoming borrow) you cannot go
negative in a single limb - so you **borrow** one base's worth from the next limb up,
add `1000000000` to the current difference, and remember to pay it back next
iteration. Because we always subtract the smaller magnitude from the larger (that is
what `cmpMag` was for), the final borrow is guaranteed to be zero.

The mirror-image edge to addition's growing carry is a **shrinking** result.
`1000000000000000000 - 1` borrows all the way down and leaves the top limb as zero,
so after `normalize` the number is two limbs, not three. A subtraction can even
empty the magnitude entirely (`5 - 5`), which normalize turns into canonical zero.
Running the raw result through `normalize` is what keeps that invariant intact.
