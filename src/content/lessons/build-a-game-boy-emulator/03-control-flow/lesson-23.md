---
project: build-a-game-boy-emulator
lesson: 23
title: Relative jumps
overview: Today you implement JR e, a relative jump using a signed 8-bit offset from the following instruction - the compact, backward-capable jump that makes loops possible.
goal: Implement JR e using a signed 8-bit offset measured from the address after the operand, so it can jump both forward and backward.
spec:
  scenario: Jumping forward by a signed offset
  status: failing
  lines:
    - kw: Given
      text: memory at 0x0100 holds 0x18, 0x05
    - kw: When
      text: the CPU executes one step
    - kw: Then
      text: PC is 0x0107
    - kw: And
      text: with the operand 0xFE instead, PC returns to 0x0100 (an offset of -2)
code:
  lang: go
  source: |
    case 0x18: // JR e
        e := int8(c.fetch())          // signed offset
        c.PC = uint16(int(c.PC) + int(e))
        return 12
reading: 'JR e - relative jump with a signed offset from the following instruction.'
checkpoint: The spec now works and relative jumps move both forward and backward. Commit and stop here.
---

`JR e` (opcode `0x18`) jumps **relative** to the current position rather than to
an absolute address. The operand is a **signed** 8-bit offset - read it as a
value from -128 to +127 - added to the address of the *next* instruction. Since
you fetch the opcode and the offset first, `PC` already points at that next
instruction when you add, so the math lands correctly.

The signed part is the crux: an offset of `0x05` jumps forward to `0x0107`, but
`0xFE` is `-2`, which jumps *backward* two bytes - right onto the `JR` itself, an
infinite loop. Backward relative jumps are how every loop on the machine repeats,
and they are compact (two bytes) which is why compilers favor them over absolute
jumps.
