---
project: build-a-game-boy-emulator
lesson: 29
title: The CB prefix
overview: Today you decode the 0xCB prefix byte, which opens a whole second 256-entry opcode table for bit operations, and implement RLC B as the first instruction in it - unlocking rotates, shifts, swaps, and bit tests for the rest of the chapter.
goal: Decode the 0xCB prefix and implement RLC B, using the normal zero-flag rule that CB-prefixed rotates follow.
spec:
  scenario: A prefixed rotate that sets Z
  status: failing
  lines:
    - kw: Given
      text: memory at 0x0100 holds 0xCB, 0x00 and B is 0x85
    - kw: When
      text: the CPU executes one step
    - kw: Then
      text: B is 0x0B and the C flag is set
    - kw: And
      text: the step reports 8 cycles and PC is 0x0102
code:
  lang: go
  source: |
    case 0xCB: // prefix - the real opcode is the next byte
        return c.stepCB(c.fetch())
    // in stepCB:
    case 0x00: // RLC B
        carry := c.B >> 7
        c.B = c.B<<1 | carry
        c.SetFlag(FlagZ, c.B == 0) // CB rotates set Z normally
        // ...N=0, H=0, C=carry
reading: 'The 0xCB prefix - a whole second 256-entry opcode table for bit operations.'
checkpoint: The spec now works and the CB prefix dispatches to a second opcode table. Commit and stop here.
---

The main opcode table only has room for 256 instructions, so the Game Boy hides
a **second** table behind the prefix byte `0xCB`. When the CPU fetches `0xCB`, it
fetches *another* byte and decodes that in the CB table - 256 more instructions,
all bit manipulation. Model it as a second `switch` reached from the `0xCB`
case.

`RLC B` (CB opcode `0x00`) rotates like yesterday's `RLCA`, but on any register
and with one difference: the CB rotates **set `Z` normally** when the result is
zero. Everything prefixed costs at least 8 cycles because of the extra fetch.
Getting the prefix dispatch right unlocks rotates, shifts, swaps, and the
bit-test instructions - the whole toolkit for working on individual bits.
