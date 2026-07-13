---
project: build-a-game-boy-emulator
lesson: 8
title: Register-to-register loads
overview: Today you implement register-to-register loads and run your first real program, a short sequence of opcodes that carries a value from one register into another. It is a small proof that your fetch-decode-execute loop, registers, and memory all work together as one machine.
goal: Implement LD A, B and run a short program of loads end to end.
spec:
  scenario: Running three loads in a row
  status: failing
  lines:
    - kw: Given
      text: memory at 0x0100 holds 0x06, 0x99, 0x78 (LD B,0x99 then LD A,B)
    - kw: When
      text: the CPU runs two steps
    - kw: Then
      text: B is 0x99 and A is 0x99
    - kw: And
      text: PC is 0x0103
code:
  lang: go
  source: |
    case 0x78: // LD A, B
        c.A = c.B
        return 4
    // every opcode in 0x40..0x7F is one LD r, r' - same shape, different pair.
    // Implement just LD A, B today; the rest of the block follows identically.
reading: 'The LD r, r'' block - opcodes 0x40 to 0x7F copy one register to another.'
checkpoint: The spec now works and a small program of loads runs to completion. Commit and stop, and take a moment - you have a working CPU core. Chapter one is done.
---

The largest single block of the opcode table, `0x40` through `0x7F`, is nothing
but **register-to-register copies**: `LD A, B`, `LD C, H`, `LD E, A`, and so on.
Each just moves one register's byte into another and costs 4 cycles. `LD A, B`
(opcode `0x78`) is a representative example.

This is also your first real **program**: load a constant into `B`, then copy
`B` into `A`, and watch two steps of your loop carry the value through. That end
-to-end run - a sequence of opcodes producing a predictable final state - is
exactly what an emulator does, just at a smaller scale than a whole game. You now
have registers, memory, flags, and a working fetch–decode–execute core.
