---
project: build-a-chip-8-emulator
lesson: 11
title: ANNN - set the index register
overview: Drawing and memory access need a pointer into RAM, and CHIP-8 has exactly one - the 16-bit index register I. Today you add I to the machine and implement ANNN, which loads an address into it.
goal: Add the index register I and implement ANNN so it sets I to the address NNN.
spec:
  scenario: ANNN loads an address into I
  status: failing
  lines:
    - kw: Given
      text: 'a VM about to execute 0xA22A'
    - kw: When
      text: 'Step runs it'
    - kw: Then
      text: 'the index register I holds 0x22A and PC has advanced by 2'
    - kw: And
      text: 'a fresh VM starts with I equal to 0x000'
code:
  lang: go
  source: |
    type VM struct {
      // ... mem, V, pc, display ...
      i uint16 // the index register: a pointer into memory
    }
    case 0xA000:
      v.i = op & 0x0FFF // nnn
      return nil
checkpoint: The VM has an index register and ANNN loads a 12-bit address into it. Commit and stop here.
---

Registers `V0` through `VF` are only one byte wide, so they can not hold a memory address (which needs 12 bits). CHIP-8 solves this with a single dedicated **index register**, named **`I`**, that is 16 bits wide and exists to point at memory. Sprite drawing reads its bytes starting at `I`; the font, BCD, and store/load opcodes all use `I` as their address. It is the machine's one and only pointer.

**`ANNN`** is how a program loads `I`: "set `I` to the address `NNN`." That is the entire instruction - take the low 12 bits of the opcode and store them in `I`. Add the `I` field to the VM now (initialised to `0`), because a whole family of later opcodes will read and write it. Nothing draws yet, but with a register file, an index register, and the ability to set both, the machine can now be aimed at any byte in memory.
