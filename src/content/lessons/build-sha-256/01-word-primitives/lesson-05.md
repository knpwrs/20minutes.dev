---
project: build-sha-256
lesson: 5
title: The Maj (majority) function
overview: The second three-word function is Maj, "majority" - each output bit is whichever value (0 or 1) appears in at least two of the three inputs at that position. Today you build it and pin the majority rule.
goal: Combine three words so each output bit is the majority of the three input bits.
spec:
  scenario: Maj takes the majority bit of x, y, z at each position
  status: failing
  lines:
    - kw: Given
      text: 'three 32-bit words x, y, z'
    - kw: When
      text: 'Maj(x, y, z) is computed as (x AND y) XOR (x AND z) XOR (y AND z)'
    - kw: Then
      text: 'Maj(0xff00ff00, 0xaaaaaaaa, 0x55555555) is 0xff00ff00'
    - kw: And
      text: 'Maj(0xffffffff, 0xffffffff, 0x00000000) is 0xffffffff and Maj(0xffffffff, 0x00000000, 0xffffffff) is 0xffffffff (any two ones win)'
code:
  lang: go
  source: |
    // each output bit = the value found in at least two of the three inputs
    func Maj(x, y, z uint32) uint32 {
      // (x AND y) XOR (x AND z) XOR (y AND z)
      // (fill in)
      return 0
    }
checkpoint: You can compute the Maj function. Commit and stop here.
---

**Maj** is the bitwise **majority** vote of three words: at each of the 32
positions it outputs a `1` if at least two of the three input bits are `1`, and a
`0` otherwise. The standard's formula `(x AND y) XOR (x AND z) XOR (y AND z)`
computes exactly this - each AND term is `1` only where a particular *pair* agrees
on `1`. When exactly two inputs are `1`, precisely one pair matches, so one term
fires; when all three are `1`, all three pairs fire and the XOR of three ones is
still `1`. Either way a real majority survives.

Check the clear cases: where two inputs are all-ones and the third all-zeros, the
two ones are always the majority, so the result is all-ones no matter which input
is the odd one out - that is why both `Maj(0xffffffff, 0xffffffff, 0x00000000)`
and `Maj(0xffffffff, 0x00000000, 0xffffffff)` come out `0xffffffff`. The mixed
input `Maj(0xff00ff00, 0xaaaaaaaa, 0x55555555)` returns `0xff00ff00`: where `x` is
all ones the tie between `y` and `z` is broken toward `x`, and where `x` is all
zeros `y` and `z` still disagree so the majority stays `0`.
