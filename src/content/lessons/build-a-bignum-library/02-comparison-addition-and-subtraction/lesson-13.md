---
project: build-a-bignum-library
lesson: 13
title: Signed subtraction and negation
overview: Subtraction needs no new machinery - a minus b is just a plus the negation of b. Today you add negation and Sub, closing the arithmetic chapter with the sign-flip edge.
goal: Negate a BigInt and implement Sub as add-the-negation, including a difference that flips sign.
spec:
  scenario: Subtraction is addition of a negation, and can flip the sign
  status: failing
  lines:
    - kw: Given
      text: 'the BigInts 3 and 8'
    - kw: When
      text: 'Sub(3, 8) is evaluated'
    - kw: Then
      text: 'it renders as "-5"'
    - kw: And
      text: 'Sub(8, 3) is "5", Sub(0, 7) is "-7", and Sub(5, 5) has Sign() 0 rendering as "0"'
code:
  lang: go
  source: |
    func (x BigInt) Neg() BigInt {
      return BigInt{sign: -x.sign, mag: x.mag} // sign 0 stays 0
    }
    func Sub(x, y BigInt) BigInt {
      return Add(x, y.Neg())
    }
checkpoint: BigInts subtract across signs, closing the add/subtract chapter. Commit and stop here.
---

Once you have signed addition, subtraction is almost free: `x - y` is `x + (-y)`.
**Negation** just flips the sign field, with the one guard that flipping the sign of
zero must leave it at `0` - since zero's magnitude is empty, `-x.sign` gives `0`
naturally, so canonical zero is preserved for free.

The edge worth pinning is the **sign flip**: `3 - 8` reuses signed addition, which
subtracts the smaller magnitude from the larger and keeps the larger's sign, so the
answer is `-5`. And `5 - 5` routes through the same constructor that forces empty
magnitudes to sign `0`, so it is canonical zero, not negative zero. With comparison,
addition, and subtraction all agreeing on that invariant, the additive core of the
library is done.
