---
project: build-a-game-boy-emulator
lesson: 9
title: Adding registers
overview: Today you implement ADD A, B, the first arithmetic instruction, and start computing the flags that describe what an operation actually did. Every arithmetic opcode for the rest of this chapter builds on the same wide-addition trick you use here to catch the carry.
goal: Implement ADD A, B so it adds two registers and sets the Z, N, and C flags from the result.
spec:
  scenario: Adding B into A with a carry out
  status: failing
  lines:
    - kw: Given
      text: A is 0xF0, B is 0x20, and all flags are clear
    - kw: When
      text: ADD A, B (opcode 0x80) runs
    - kw: Then
      text: A is 0x10 and the C flag is set
    - kw: And
      text: the N flag is clear and the Z flag is clear
code:
  lang: go
  source: |
    case 0x80: // ADD A, B
        // The carry out of bit 7 is invisible if you add in 8 bits. Compute the
        // sum in a WIDER type so it survives, then derive the flags from it:
        //   C  ← the wide sum exceeded 0xFF
        //   A  ← the low byte of the sum
        //   Z  ← the result is zero;   N ← cleared (this is an addition)
        return 4
reading: 'The 8-bit ADD instructions and how they affect the flags.'
checkpoint: The spec now works and ADD sets the zero, subtract, and carry flags. Commit and stop here.
---

Arithmetic is where the flags finally earn their keep. `ADD A, B` (opcode
`0x80`) adds register `B` into the accumulator `A`, keeping only the low 8 bits
of the result. Three flags describe what happened: **Z** is set when the result
byte is zero, **N** is cleared because this was an addition (not a subtraction),
and **C** is set when the true sum exceeded `0xFF` and wrapped around.

The clean trick is to add in a wider type - 16 bits - so the overflow is
visible before you truncate back to a byte. `0xF0 + 0x20` is `0x110`; that
carry off the top sets `C`, and the byte left behind is `0x10`. One flag,
the half-carry, is subtler and gets its own lesson next.
