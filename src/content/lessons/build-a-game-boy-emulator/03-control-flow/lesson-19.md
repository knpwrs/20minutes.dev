---
project: build-a-game-boy-emulator
lesson: 19
title: Memory through HL
overview: Today you give the CPU its first way to touch memory, implementing LD (HL), A and LD A, (HL), which read and write a byte through the pointer register HL - the technique every future data-moving instruction builds on.
goal: Implement LD (HL), A and LD A, (HL) so the CPU can read and write memory through HL as a pointer.
spec:
  scenario: Storing the accumulator through HL
  status: failing
  lines:
    - kw: Given
      text: HL is 0xC000 and A is 0x42
    - kw: When
      text: LD (HL), A (opcode 0x77) runs
    - kw: Then
      text: memory at 0xC000 holds 0x42
    - kw: And
      text: the step reports 8 cycles (a memory access costs an extra 4)
    - kw: And
      text: the read direction LD A, (HL) (opcode 0x7E) loads that 0x42 back into A, also in 8 cycles
code:
  lang: go
  source: |
    case 0x77: // LD (HL), A
        c.mem.Write(c.HL(), c.A)
        return 8
    case 0x7E: // LD A, (HL)
        c.A = c.mem.Read(c.HL())
        return 8
reading: 'Register-indirect addressing - (HL) means "the byte HL points at."'
checkpoint: The spec now works and the CPU can read and write memory through the HL pointer. Commit and stop here.
---

Until now instructions have only touched registers. `LD (HL), A` (opcode
`0x77`) is the first that reaches into **memory**: the parentheses mean
"indirect," so `(HL)` is the byte at the address held in `HL`. This is
**register-indirect addressing**, and `HL` is the CPU's dedicated pointer for
it.

Notice the cost: touching memory adds 4 cycles, so these run in 8 rather than 4.
The reverse direction, `LD A, (HL)` (opcode `0x7E`), reads the pointed-at byte
back into `A`. Together they let a program stream data through memory one byte at
a time - the foundation for copying tiles into video RAM, which is exactly what
you will be doing by the end of the project.
