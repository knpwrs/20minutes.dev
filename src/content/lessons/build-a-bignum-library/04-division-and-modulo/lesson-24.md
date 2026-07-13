---
project: build-a-bignum-library
lesson: 24
title: Signed division and modulo
overview: The magnitude divide is done; now the signs. We choose the convention where the remainder is always non-negative, so modulo behaves the way number theory expects. Today you finish DivMod and add Div and Mod.
goal: Extend DivMod to signed operands with a remainder always in [0, divisor), and add Div and Mod.
spec:
  scenario: Signed division keeps the remainder non-negative
  status: failing
  lines:
    - kw: Given
      text: 'the BigInts -17 and 5'
    - kw: When
      text: 'DivMod(-17, 5) is evaluated'
    - kw: Then
      text: 'the quotient is -4 and the remainder is 3 (the remainder stays in [0, 5))'
    - kw: And
      text: 'DivMod(17, 5) is quotient 3 remainder 2, Mod(-17, 5) is 3, and Div(17, 5) is 3'
code:
  lang: go
  source: |
    // magnitude divide gives 0 <= rm < |y|; adjust for signs so 0 <= r < |y|
    // when the dividend is negative and rm != 0:
    //   r = |y| - rm  and the quotient rounds one further toward negative infinity
    func Div(x, y BigInt) (BigInt, error) { q, _, err := DivMod(x, y); return q, err }
    func Mod(x, y BigInt) (BigInt, error) { _, r, err := DivMod(x, y); return r, err }
checkpoint: BigInts divide and take remainders with a non-negative result. Commit and stop here.
---

There is more than one sane convention for signed division; we pick the
**Euclidean** one, where the remainder is always non-negative (`0 <= r < |y|`),
because that is what makes modular arithmetic - GCD, modular exponentiation, the
crypto-flavored payoff coming up - behave correctly. Start from the magnitude divide,
which gives a quotient `qm` and remainder `rm` with `0 <= rm < |y|`.

If the dividend is non-negative, the remainder is just `rm` and the quotient takes
the sign of the divisor. If the dividend is **negative** and `rm` is non-zero, you
have overshot: the true remainder is `|y| - rm` (back in range and non-negative), and
the quotient rounds one step further away from zero. So `-17` divided by `5` is `-4`
remainder `3`, not `-3` remainder `-2` - check it: `-4 * 5 + 3 = -17`. `Div` and `Mod`
are then just the two projections of `DivMod`, completing the division chapter.
