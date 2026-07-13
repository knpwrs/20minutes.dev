---
project: build-a-game-boy-emulator
lesson: 26
title: Call and return
overview: Today you implement CALL nn and RET, turning a jump plus the stack into full subroutine calls - the mechanism behind every function call, nested arbitrarily deep.
goal: Implement CALL nn and RET so a subroutine can be entered and returned from correctly.
spec:
  scenario: Calling a subroutine and returning
  status: failing
  lines:
    - kw: Given
      text: PC is 0x0100, SP is 0xFFFE, and memory at 0x0100 holds 0xCD, 0x00, 0x20
    - kw: When
      text: CALL nn executes one step
    - kw: Then
      text: PC is 0x2000 and the stack holds the return address 0x0103
    - kw: And
      text: a RET (opcode 0xC9) executed next sets PC back to 0x0103 and SP to 0xFFFE
code:
  lang: go
  source: |
    case 0xCD: // CALL nn
        lo := c.fetch(); hi := c.fetch()
        ret := c.PC                 // address after the operand
        // Push the 16-bit return address, high byte first - the same stack move
        // as lesson 25's PUSH. Pull that out into a small push16 helper (and a
        // matching pop16 for RET) so both opcodes can share it.
        c.push16(ret)
        c.PC = uint16(hi)<<8 | uint16(lo)
        return 24
reading: 'CALL and RET - subroutines built from a jump plus the stack.'
checkpoint: The spec now works and subroutine call and return work end to end. Commit and stop here.
---

A **subroutine** is a reusable block of code you can jump into and return from,
and it is built entirely from the stack you already have - this is a good moment
to factor lesson 25's push/pop into small `push16`/`pop16` helpers that both these
opcodes reuse. `CALL nn` (opcode
`0xCD`) **pushes the return address** - the address of the instruction right
after the call - onto the stack, then jumps to the target. Because you fetch both
operand bytes first, `PC` already holds the correct return address `0x0103` when
you push it.

`RET` (opcode `0xC9`) is the mirror image: it **pops** that address off the stack
back into `PC`, resuming exactly where the call left off. This push-jump/pop-jump
pair is the entire mechanism behind function calls, and it nests naturally - a
subroutine can call another, and the stack keeps every return address in order.
