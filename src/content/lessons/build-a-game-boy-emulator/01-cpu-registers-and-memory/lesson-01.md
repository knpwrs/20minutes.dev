---
project: build-a-game-boy-emulator
lesson: 1
title: The register file
overview: Today you build the CPU's register file, the eight one-byte slots that hold every value the processor works with. Every instruction you write for the rest of the project reads from and writes to these registers, so getting the container right first makes everything after it trivial.
goal: Build a register file that stores and returns a single byte in any of the CPU's eight registers.
spec:
  scenario: Storing a byte in register A
  status: failing
  lines:
    - kw: Given
      text: a fresh CPU with registers A, B, C, D, E, F, H, and L
    - kw: When
      text: A is set to 0x12
    - kw: Then
      text: reading A returns 0x12
    - kw: And
      text: reading B still returns 0x00
code:
  lang: go
  source: |
    // eight 8-bit registers, all starting at zero
    type Registers struct {
        A, B, C, D, E, F, H, L uint8
    }
    r := &Registers{}
    r.A = 0x12
reading: 'The DMG CPU has eight 8-bit registers. Any "Game Boy CPU manual" register summary covers them.'
checkpoint: The spec now works and your CPU can hold a byte in any of its eight registers. Commit and stop here.
---

The heart of the Game Boy is the Sharp **LR35902**, an 8-bit CPU. Everything it
does flows through eight one-byte **registers** named `A`, `B`, `C`, `D`, `E`,
`F`, `H`, and `L`. `A` is the **accumulator** - most arithmetic lands there -
and `F` holds status **flags** we will meet on lesson 5. The rest are general
scratch space.

A register is just a byte of storage: you write a value in and read the same
value back. Start here because every instruction you write for the rest of the
project will move data into and out of these eight slots. Getting the container
right first makes all of that trivial.
