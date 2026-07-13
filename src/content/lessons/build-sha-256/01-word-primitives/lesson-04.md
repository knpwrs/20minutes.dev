---
project: build-sha-256
lesson: 4
title: The Ch (choose) function
overview: SHA-256's compression step uses two bitwise functions of three words. The first is Ch, "choose" - for each bit position, x picks whether the output bit comes from y or from z. Today you build it and pin its behavior at the extremes.
goal: Combine three words so each bit of x selects between the matching bit of y and z.
spec:
  scenario: Ch chooses y where x is 1 and z where x is 0
  status: failing
  lines:
    - kw: Given
      text: 'three 32-bit words x, y, z'
    - kw: When
      text: 'Ch(x, y, z) is computed as (x AND y) XOR (NOT x AND z)'
    - kw: Then
      text: 'Ch(0xff00ff00, 0xaaaaaaaa, 0x55555555) is 0xaa55aa55'
    - kw: And
      text: 'Ch(0xffffffff, 0xaaaaaaaa, 0x55555555) is 0xaaaaaaaa (all bits pick y) and Ch(0x00000000, 0xaaaaaaaa, 0x55555555) is 0x55555555 (all bits pick z)'
code:
  lang: go
  source: |
    // where x's bit is 1 -> take y's bit; where x's bit is 0 -> take z's bit
    func Ch(x, y, z uint32) uint32 {
      // (x AND y) XOR ((NOT x) AND z)
      // (fill in)
      return 0
    }
checkpoint: You can compute the Ch function. Commit and stop here.
---

**Ch** stands for "choose", and its name is the clearest way to understand it:
read `x` as a bitwise selector. Wherever a bit of `x` is `1`, the output takes the
corresponding bit of `y`; wherever a bit of `x` is `0`, it takes the bit of `z`.
The standard writes this as `(x AND y) XOR (NOT x AND z)` - the first term keeps
`y`'s bits under x's ones, the second keeps `z`'s bits under x's zeros, and the
XOR merges them without overlap.

The extreme cases make it concrete and are the easiest way to be sure you wired it
right: with `x = 0xffffffff` every bit chooses `y`, so the result is exactly `y`;
with `x = 0x00000000` every bit chooses `z`, so the result is exactly `z`. The
mixed case `x = 0xff00ff00` alternates byte by byte between `y = 0xaaaaaaaa` and
`z = 0x55555555`, giving `0xaa55aa55`. This function feeds directly into the round
computation you build later.
