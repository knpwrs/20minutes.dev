---
project: build-a-bignum-library
lesson: 10
title: Adding magnitudes with carry
overview: The first real arithmetic - schoolbook addition, limb by limb, propagating a carry in base 1000000000. The edge that matters is a carry that ripples off the top and grows the number by a limb.
goal: Add two magnitudes limb by limb, carrying in base 1000000000, including a carry that adds a new top limb.
spec:
  scenario: Addition carries across limbs and can grow the limb count
  status: failing
  lines:
    - kw: Given
      text: 'the magnitudes of 999999999999999999 and 1'
    - kw: When
      text: 'they are added'
    - kw: Then
      text: 'the result is the magnitude of 1000000000000000000 with limbs (0, 0, 1) - the carry rippled through both limbs and grew a new one'
    - kw: And
      text: 'the magnitudes of 123456789 and 987654321 add to 1111111110 with limbs (111111110, 1)'
code:
  lang: go
  source: |
    func addMag(a, b mag) mag {
      if len(a) < len(b) { a, b = b, a }
      var out mag
      var carry uint64
      for i := range a {
        sum := uint64(a[i]) + carry
        if i < len(b) { sum += uint64(b[i]) }
        out = append(out, uint32(sum%Base))
        carry = sum / Base
      }
      if carry > 0 { out = append(out, uint32(carry)) }
      return out
    }
checkpoint: Magnitudes add with a carry that can grow the result. Commit and stop here.
---

Adding in a large base is exactly the grade-school algorithm you already know, just
with nine-digit "digits". Line the two magnitudes up from limb 0, add each pair
together with the incoming **carry**, and split the result: the low part (modulo the
base) is this limb, and anything above the base is the carry into the next limb.
Because a single limb plus a limb plus a carry can reach almost `2 * 10^9`, a
64-bit accumulator holds the sum with room to spare.

The edge to pin is what happens when the carry runs off the end. `999999999999999999
+ 1` turns every limb to zero in turn and leaves a final carry of `1`, which becomes
a brand-new most-significant limb: the result is one limb longer than either input.
Forget that trailing `if carry > 0` and you silently drop the top of the number.
