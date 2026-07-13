---
project: build-a-bignum-library
lesson: 27
title: Fast exponentiation
overview: Raising a number to a big power by repeated multiplication is far too slow; square-and-multiply does it in a logarithmic number of steps. Today you add Pow, the engine behind the capstone's 2 to the 1000th.
goal: Raise a BigInt to a non-negative integer power using square-and-multiply.
spec:
  scenario: Exponentiation squares the base and multiplies in set bits of the exponent
  status: failing
  lines:
    - kw: Given
      text: 'the BigInt 2 raised to the power 64'
    - kw: When
      text: 'Pow is evaluated'
    - kw: Then
      text: 'the result is 18446744073709551616'
    - kw: And
      text: 'Pow(3, 40) is 12157665459056928801, and Pow(7, 0) is 1'
code:
  lang: go
  source: |
    func Pow(base BigInt, exp int) BigInt {
      result := NewFromInt64(1)
      for exp > 0 {
        if exp&1 == 1 { result = Mul(result, base) }
        base = Mul(base, base) // square
        exp >>= 1
      }
      return result
    }
checkpoint: BigInts raise to any non-negative power quickly. Commit and stop here.
---

Computing `base^exp` by multiplying `base` in a loop `exp` times is hopeless once
`exp` is large. **Square-and-multiply** replaces it with a logarithmic number of
multiplications by reading the exponent in binary: keep a running `result` of `1`,
and for each bit of the exponent from the bottom, square the base, and whenever the
current bit is set, fold the base into the result. Forty multiplications become
about six.

The base case is `exp == 0`, which returns `1` - including `0^0`, which this project
takes as `1` by convention. This is the same trick modular exponentiation uses next,
and it is what makes the capstone's `2^1000` - a 302-digit number - computable in an
instant rather than a thousand multiplications. Every squaring rides on the Karatsuba
multiply you built, so it stays fast even as the numbers grow enormous.
