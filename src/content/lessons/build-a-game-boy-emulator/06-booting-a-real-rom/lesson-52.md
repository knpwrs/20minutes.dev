---
project: build-a-game-boy-emulator
lesson: 52
title: Immediate arithmetic
overview: Lessons 9–13 taught arithmetic against another register. Real code just as often computes against a constant - ADD A, $10, and above all CP A, n to compare a value and branch. Today you add the immediate-operand forms, reusing the exact flag logic you already wrote; the only new thing is where the operand comes from.
goal: Add the immediate forms of the ALU ops you already built (ADD/ADC/SUB/AND/XOR/CP A,n) by feeding a fetched byte into the same flag logic.
spec:
  scenario: Arithmetic and comparison against an immediate byte
  status: failing
  lines:
    - kw: Given
      text: A is 0x3C and memory at 0x0100 holds 0xC6, 0x04 (ADD A, 0x04)
    - kw: When
      text: one step runs
    - kw: Then
      text: A is 0x40 with the half-carry flag set, N and C clear, and 8 cycles reported
    - kw: And
      text: CP A, n (opcode 0xFE) with A = 0x40 and n = 0x40 sets Z and N, clears C, and leaves A unchanged
code:
  lang: go
  source: |
    // Do the immediate forms of the ops you ALREADY built on lessons 9-13:
    //   ADD A,n=0xC6, ADC=0xCE, SUB=0xD6, AND=0xE6, XOR=0xEE, CP=0xFE.
    // Each fetches one immediate byte, then runs that op's exact flag logic - so
    // factor the logic into a helper the register and immediate cases share; the
    // only difference is the operand comes from fetch(), not a register.
    // (SBC A,n=0xDE and OR A,n=0xF6 have no register form yet - leave them for the
    //  lesson their register versions land.)
reading: 'The ALU-immediate block (ADD/SUB/AND/XOR/CP A,n) - the register-form arithmetic with a fetched operand.'
checkpoint: Arithmetic against a constant works - especially CP A, n, which boot code leans on to compare and branch. Commit and stop here.
---

On lessons 9–13 you built `ADD`, `ADC`, `SUB`, `AND`, `XOR`, and `CP` against
register `B`. Their immediate forms - `ADD A, n`, `CP A, n`, and the rest of that
set - do the identical arithmetic, just with the operand fetched as the byte after
the opcode instead of read from a register. The flag rules are exactly the ones
you already derived; nothing new to reason out. (`SBC A, n` and `OR A, n` have no
register form yet, so they wait for the lesson those land - don't invent their flag
logic here.)

The payoff opcode is `CP A, n`: a boot sequence compares a value against a
constant and branches on the result constantly (checking a status bit, waiting
for a scanline). If your earlier ALU code is a shared helper, adding these is
routing a fetched byte into it - so if it is still copy-pasted per opcode, this
is a good moment to factor it out.
