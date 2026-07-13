---
project: build-a-bignum-library
lesson: 28
title: Modular exponentiation
overview: Take a remainder at every step of square-and-multiply and you get modular exponentiation - the operation at the heart of public-key cryptography, and here the crypto-flavored payoff of all the arithmetic you built.
goal: Compute base to the exp modulo m, reducing after every multiply so the numbers stay small.
spec:
  scenario: Modular exponentiation reduces at each step
  status: failing
  lines:
    - kw: Given
      text: 'base 4, exponent 13, and modulus 497'
    - kw: When
      text: 'PowMod(4, 13, 497) is evaluated'
    - kw: Then
      text: 'the result is 445'
    - kw: And
      text: 'PowMod(10, 100, 7) is 4, and PowMod(5, 0, 7) is 1'
code:
  lang: go
  source: |
    func PowMod(base BigInt, exp int, m BigInt) BigInt {
      result := NewFromInt64(1)
      base, _ = Mod(base, m) // reduce first
      for exp > 0 {
        if exp&1 == 1 { result, _ = Mod(Mul(result, base), m) }
        base, _ = Mod(Mul(base, base), m) // square then reduce
        exp >>= 1
      }
      return result
    }
checkpoint: BigInts compute modular powers with bounded intermediates. Commit and stop here.
---

Modular exponentiation is square-and-multiply with a `Mod` after every
multiplication. That one change is what makes it practical: without it, `base^exp`
would balloon to thousands of digits before the final remainder; with it, every
intermediate stays below the modulus, so the numbers never grow. The Euclidean
remainder from the division chapter - always non-negative - is exactly what this
needs.

This is the payoff the whole library was quietly building toward. Raising a number to
a huge power modulo another number is the core primitive of RSA and Diffie-Hellman;
the same `PowMod` you just wrote, given thousand-bit inputs, is what secures real
connections. `4^13 mod 497 == 445` is the textbook check, and `10^100 mod 7 == 4`
shows a googol reduced to a single digit. GCD and the grand capstone are all that
remain.
