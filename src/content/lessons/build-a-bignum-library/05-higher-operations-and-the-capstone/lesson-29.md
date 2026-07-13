---
project: build-a-bignum-library
lesson: 29
title: Greatest common divisor
overview: Euclid's algorithm finds the greatest common divisor with nothing but repeated remainders - a two-line loop that our Mod makes exact at any size. Today you add Gcd.
goal: Compute the greatest common divisor of two BigInts by the Euclidean algorithm.
spec:
  scenario: The Euclidean algorithm reduces a pair to its GCD
  status: failing
  lines:
    - kw: Given
      text: 'the BigInts 1071 and 462'
    - kw: When
      text: 'Gcd(1071, 462) is evaluated'
    - kw: Then
      text: 'the result is 21'
    - kw: And
      text: 'Gcd(1000000000000000000, 12) is 4, and Gcd(5, 0) is 5'
code:
  lang: go
  source: |
    func Gcd(x, y BigInt) BigInt {
      a, b := x.Abs(), y.Abs()
      for b.sign != 0 {
        _, r, _ := DivMod(a, b)
        a, b = b, r // replace the pair with (b, a mod b)
      }
      return a
    }
checkpoint: BigInts compute their GCD, closing the operations chapter. Commit and stop here.
---

Euclid's insight, twenty-three centuries old, is that the greatest common divisor of
`a` and `b` equals the GCD of `b` and `a mod b` - so you keep replacing the pair with
`(b, a mod b)` until the second number hits zero, and the first is your answer. Our
non-negative `Mod` drives it directly; work with the **absolute values** so the result
is a clean non-negative divisor regardless of the inputs' signs.

The terminating case, `Gcd(x, 0) == |x|`, is the loop's natural base: when `b` is
already zero the loop never runs and returns `|a|`. This is a small function, but it
leans on the entire division chapter, and it runs just as happily on
`Gcd(10^18, 12) == 4` as on the small textbook pair. With comparison, the four
arithmetic operations, exponentiation, and GCD all in place, the library is ready for
its capstone.
