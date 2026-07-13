---
project: build-a-bignum-library
lesson: 16
title: Signed multiplication
overview: Wrapping magnitude multiplication in signs is a one-line rule - signs multiply - but the zero edge needs care so a negative times zero stays canonical zero. Today you build the public Mul.
goal: Multiply two BigInts, setting the sign from the operands and collapsing any zero product to canonical zero.
spec:
  scenario: Signed multiplication multiplies signs and keeps zero canonical
  status: failing
  lines:
    - kw: Given
      text: 'the BigInts 4294967296 and 4294967296'
    - kw: When
      text: 'they are multiplied'
    - kw: Then
      text: 'the result renders as "18446744073709551616" (two to the sixty-fourth)'
    - kw: And
      text: 'Mul(-4294967296, 4294967296) renders "-18446744073709551616", while Mul(-7, 0) has Sign() 0 and renders "0"'
code:
  lang: go
  source: |
    func Mul(x, y BigInt) BigInt {
      m := mulMag(x.mag, y.mag)
      // product of signs; mk forces sign 0 when the magnitude is empty,
      // so (negative) times zero is canonical zero, not negative zero
      return mk(x.sign*y.sign, m)
    }
checkpoint: BigInts multiply with correct signs and a canonical zero. Commit and stop here.
---

The sign of a product is the product of the signs: positive times positive and
negative times negative are positive, and a mismatch is negative. Multiplying the
two sign fields (`-1`, `0`, `+1`) captures every case in one expression, and it even
handles zero, since anything times sign `0` is `0`.

But relying on that alone is a trap: if one operand is zero its magnitude is empty,
the product magnitude is empty, and you must not let a leftover `-1` sign through.
Routing the result through `mk` - which forces the sign to `0` on an empty magnitude -
keeps `-7 * 0` at canonical zero. With that guard, `4294967296 * 4294967296` gives
you two to the sixty-fourth exactly, a number no 64-bit product could hold, and the
library can now multiply anything.
