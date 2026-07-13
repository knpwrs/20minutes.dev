---
project: build-a-bignum-library
lesson: 32
title: 'Capstone: exact giants'
overview: The finale computes numbers no fixed-width integer could ever hold - 100 factorial and 2 to the 1000th power - to the exact final digit, plus a modular power, proving every layer of the library agrees.
goal: Compute 100 factorial, 2 to the 1000th, and a modular power, and assert their exact values.
spec:
  scenario: The library computes large exact results to the last digit
  status: failing
  lines:
    - kw: Given
      text: 'a library that multiplies 1 through 100, raises 2 to the 1000th power, and computes 4 to the 13th modulo 497'
    - kw: When
      text: 'the three results are rendered'
    - kw: Then
      text: '100 factorial is "93326215443944152681699238856266700490715968264381621468592963895217599993229915608941463976156518286253697920827223758251185210916864000000000000000000000000"'
    - kw: And
      text: '2 to the 1000th is "10715086071862673209484250490600018105614048117055336074437503883703510511249361224931983788156958581275946729175531468251871452856923140435984577574698574803934567774824230985421074605062371141877954182153046474983581941267398767559165543946077062914571196477686542167660429831652624386837205668069376" and PowMod(4, 13, 497) is 445'
code:
  lang: go
  source: |
    f := NewFromInt64(1)
    for i := int64(2); i <= 100; i++ { f = Mul(f, NewFromInt64(i)) }
    // f.String() is 100!  (158 digits)
    p := Pow(NewFromInt64(2), 1000)     // 2^1000 (302 digits)
    r := PowMod(NewFromInt64(4), 13, NewFromInt64(497)) // 445
checkpoint: The library computes exact giants and a modular power. The project is complete; commit and stop here.
---

This is the promise the project was built to keep. `100!` is a product of a hundred
factors that overflows a 64-bit integer after `20!`, yet multiplying `1` through `100`
with your `Mul` gives all 158 digits exactly, trailing zeros and all. `2^1000` -
computed by square-and-multiply on Karatsuba, a 302-digit number - lands to the final
digit. And `PowMod(4, 13, 497) == 445` shows the crypto primitive holding. Every one
of these is checkable precisely because the whole library was built to be exact.

Look back at what carries these results: a magnitude of base-`10^9` limbs, canonical
zero and no negative zero, carry and borrow, schoolbook and Karatsuba multiplication,
long division with quotient estimation, and square-and-multiply on top. No language
built-in did any of the arithmetic - you wrote all of it on a limb array of
fixed-width integers. That is a real arbitrary-precision integer library, the same
core that GMP and every language's big-integer type extend with more algorithms and
tuning, and it is yours.
