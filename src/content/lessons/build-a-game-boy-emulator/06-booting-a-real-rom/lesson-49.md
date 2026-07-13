---
project: build-a-game-boy-emulator
lesson: 49
title: Loading any register
overview: Back on lesson 7 you taught the CPU LD B, n - load an immediate into B. Real programs seed constants into every register, so today you generalize that to the whole LD r, n family by decoding which register the opcode names. It is the single biggest gap between your core and a ROM that actually boots.
goal: Generalize LD r, n to every register by decoding the register field from the opcode.
spec:
  scenario: Loading immediates into different registers
  status: failing
  lines:
    - kw: Given
      text: memory at 0x0100 holds 0x0E, 0x42, 0x3E, 0x99 (LD C,0x42 then LD A,0x99)
    - kw: When
      text: the CPU runs two steps
    - kw: Then
      text: C is 0x42 and A is 0x99
    - kw: And
      text: PC is 0x0104 and each step reported 8 cycles
    - kw: And
      text: the (HL) form LD (HL), n (opcode 0x36) writes its immediate to memory at HL and costs 12 cycles
code:
  lang: go
  source: |
    // The target register is encoded in bits 3-5 of the opcode:
    //   LD B,n = 0x06, C,n = 0x0E, D,n = 0x16 ... A,n = 0x3E  (stepping by 8)
    // Decode that 3-bit index, fetch the immediate, and store it into the named
    // register. Index 6 is (HL) - a write to memory at HL. A small
    // setReg(index, value) helper keeps this and the register families to come tidy.
reading: 'The LD r, n block - one immediate-load opcode per register, the register in bits 3-5.'
checkpoint: Any register can load an immediate now, not just B - real init code that seeds several registers runs. Commit and stop here.
---

Lesson 7 taught a single immediate load, `LD B, n`. But a boot sequence sets up the
stack pointer, the LCD control byte, palettes, and scroll positions - it loads
constants into **every** register, not just `B`. Hard-coding one opcode per
register would be eight near-identical cases.

Instead, notice the pattern: the eight `LD r, n` opcodes are `0x06`, `0x0E`,
`0x16` … `0x3E`, stepping by 8 because the destination register lives in **bits
3–5** of the opcode byte. Decode that field once - ideally into a small
`setReg(index, value)` helper - and you have all eight at a stroke. That same
register-index trick powers the `INC r` and arithmetic families you generalize
next.
