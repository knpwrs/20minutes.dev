---
project: build-a-game-boy-emulator
lesson: 28
title: Rotating the accumulator
overview: Today you implement RLCA, the accumulator's left-circular rotate that wraps the top bit around to the bottom and into the carry flag - the first of four related rotates the CPU uses for fast multiply and divide by two.
goal: Implement RLCA, which rotates A left and copies the bit that falls off the top into the carry flag.
spec:
  scenario: Rotating the accumulator left
  status: failing
  lines:
    - kw: Given
      text: A is 0x85 and all flags are clear
    - kw: When
      text: RLCA (opcode 0x07) runs
    - kw: Then
      text: A is 0x0B and the C flag is set (old bit 7)
    - kw: And
      text: the Z, N, and H flags are all clear
    - kw: And
      text: even when A is 0x00, RLCA leaves A = 0x00 with Z still clear - the accumulator rotates never set Z
code:
  lang: go
  source: |
    case 0x07: // RLCA
        carry := c.A >> 7
        c.A = c.A<<1 | carry
        c.SetFlag(FlagC, carry == 1)
        c.SetFlag(FlagZ, false) // always cleared for the A-rotates
        c.SetFlag(FlagN, false)
        c.SetFlag(FlagH, false)
        return 4
reading: 'RLCA, RRCA, RLA, RRA - the four accumulator rotates in the main opcode table.'
checkpoint: The spec now works and RLCA rotates A and updates carry. Commit and stop here.
---

**Rotating** shifts the bits of a byte sideways, wrapping the bit that falls off
one end back onto the other. `RLCA` (opcode `0x07`) rotates `A` **left
circular**: every bit moves up one, and the old bit 7 wraps around to bit 0 *and*
lands in the carry flag. `0x85` (`1000 0101`) becomes `0x0B` (`0000 1011`) with
carry set from that leaked top bit.

The four accumulator rotates - `RLCA`, `RRCA`, `RLA`, `RRA` - share a quirk:
they **always clear `Z`**, even when the result is zero. Their CB-prefixed
cousins (starting tomorrow) set `Z` normally, so the two families look identical
but differ in that one flag. Rotations are how the CPU does fast multiply and
divide by two, and how it shuffles bits out for serial data.
