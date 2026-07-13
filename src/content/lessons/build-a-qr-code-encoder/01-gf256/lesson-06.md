---
project: build-a-qr-code-encoder
lesson: 6
title: Fast multiplication with the tables
overview: 'Multiplying powers means adding exponents, so with a log and antilog table in hand multiplication becomes one addition and two lookups. Today you write the fast multiply and confirm it agrees with the slow one from lesson 3 - the payoff that closes the field chapter.'
goal: 'Multiply via log and antilog tables, matching the slow multiply and handling zero.'
spec:
  scenario: 'Table multiplication matches the honest multiply'
  status: failing
  lines:
    - kw: Given
      text: 'the log and antilog tables, and the rule that a*b = exp[(log[a] + log[b]) mod 255] when neither is zero'
    - kw: When
      text: 'gmul(2, 128) and gmul(76, 43) are computed with the tables'
    - kw: Then
      text: 'gmul(2, 128) is 29 - log[2]=1 plus log[128]=7 is 8, and exp[8]=29, matching the reduce case'
    - kw: And
      text: 'gmul(76, 43) is 251 (equal to the slow multiply), and gmul(0, 43) and gmul(76, 0) are both 0 by the zero special case'
code:
  lang: go
  source: |
    // a*b = exp[log a + log b]. Add exponents mod 255. Either
    // operand being 0 short-circuits to 0 (0 has no logarithm).
    func gmulFast(a, b byte) byte {
      if a == 0 || b == 0 {
        return 0
      }
      return exp[(int(logt[a])+int(logt[b]))%255]
    }
checkpoint: 'Multiplication is now a lookup, and it agrees with the slow version. The field is done - commit and stop here.'
---

Here is the reward for building both tables. Multiplying two powers of the same base means **adding their exponents**: `2^m` times `2^n` is `2^(m+n)`. So to multiply `a` by `b`, take `log[a]` and `log[b]`, add them, and look the sum back up in `exp`. Because the powers cycle with period `255`, you reduce the exponent sum modulo `255` (or index a doubled 512-entry table and skip the modulo). One addition, two lookups, done - no per-bit loop.

The only trap is `0`: it has no logarithm, so a zero operand must short-circuit to `0` before you touch the log table. Check `gmul(2, 128)`: `log[2]=1`, `log[128]=7`, sum `8`, and `exp[8]=29` - the very reduce case you traced by hand in lesson 2, now falling out of a lookup. Confirm the fast multiply equals your slow `gmul` on the same inputs and you can retire the slow one from the hot path. This little routine is the workhorse of the entire Reed-Solomon chapter that starts next.
