---
project: build-a-game-boy-emulator
lesson: 10
title: The half-carry flag
overview: Today you extend addition to track the half-carry flag, the one flag that depends on the low nibble instead of the whole byte. It is subtle and easy to get wrong, but every addition and subtraction from here on needs it to be correct.
goal: Extend ADD to set the half-carry flag H when the low nibble overflows.
spec:
  scenario: A carry out of bit 3
  status: failing
  lines:
    - kw: Given
      text: A is 0x0F, B is 0x01, and all flags are clear
    - kw: When
      text: ADD A, B runs
    - kw: Then
      text: A is 0x10 and the H flag is set
    - kw: And
      text: adding 0x01 to A of 0xFF instead gives A of 0x00 with Z, H, and C all set
code:
  lang: go
  source: |
    // Set H inside the ADD case. Half-carry = a carry out of bit 3.
    // Strategy: mask BOTH operands to their low nibble, add those, and check
    // whether that sum overflows 4 bits. Write the boolean and the SetFlag call
    // yourself (what do you compare against?).
    c.SetFlag(FlagH, /* ... */)
reading: 'The half-carry flag (H) - carry from bit 3 to bit 4, used by decimal-adjust.'
checkpoint: The spec now works and ADD reports the half-carry correctly. Commit and stop here.
---

The **half-carry** flag (`H`) records whether a carry rippled out of the low
nibble - that is, out of bit 3 into bit 4. It exists for one reason: the
decimal-adjust instruction (`DAA`) uses it to fix up binary-coded-decimal
arithmetic. You will not implement `DAA` today, but you must compute `H`
correctly now so it is right when you need it.

The test is local to the bottom four bits: mask both operands with `0x0F`, add
them, and see if the total passes `0x0F`. `0x0F + 0x01` overflows the nibble
even though the byte result `0x10` looks tame - that is exactly the case `H`
catches. Fold this into the `ADD` you wrote yesterday and every addition now
reports all four flags.
