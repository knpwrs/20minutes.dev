---
project: build-a-game-boy-emulator
lesson: 14
title: Compare
overview: Today you implement CP, a subtraction that sets flags without touching the accumulator, so a program can compare two values without losing data. This is the instruction every conditional branch in the next chapter relies on.
goal: Implement CP A, B as a subtraction that sets the flags but discards the numeric result.
spec:
  scenario: Comparing equal values
  status: failing
  lines:
    - kw: Given
      text: A is 0x42 and B is 0x42
    - kw: When
      text: CP A, B (opcode 0xB8) runs
    - kw: Then
      text: the Z flag is set and A is still 0x42
    - kw: And
      text: with B of 0x40 instead, Z is clear and the C flag is clear (A is not below B)
code:
  lang: go
  source: |
    case 0xB8: // CP A, B  - like SUB but A is left unchanged
        r := c.A - c.B
        c.SetFlag(FlagZ, r == 0)
        c.SetFlag(FlagN, true)
        c.SetFlag(FlagH, c.B&0x0F > c.A&0x0F)
        c.SetFlag(FlagC, c.B > c.A)
        return 4
reading: 'CP - compare, the basis of every conditional branch.'
checkpoint: The spec now works and CP sets flags exactly like SUB but leaves A intact. Commit and stop here.
---

**Compare** (`CP A, B`, opcode `0xB8`) does the arithmetic of `SUB` - it
computes `A - B` and sets all four flags exactly as subtraction would - but
throws the numeric result away, leaving `A` untouched. It exists so a program
can ask "how do these two bytes relate?" without clobbering the accumulator.

Read the flags afterward and you know everything: `Z` set means they were
**equal**, `C` set means `A` was **less than** `B`, and both clear means `A` was
**greater**. This is the instruction every `if` and every loop condition
compiles down to, so once you pair it with conditional jumps in the next
chapter, real control flow becomes possible.
