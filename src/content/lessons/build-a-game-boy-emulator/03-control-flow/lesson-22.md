---
project: build-a-game-boy-emulator
lesson: 22
title: Absolute jumps
overview: Today you implement JP nn, the unconditional absolute jump that lets a program's execution move somewhere other than straight ahead - the first step toward real branching and loops.
goal: Implement JP nn so it reads a 16-bit absolute address and loads it into PC.
spec:
  scenario: Jumping to an absolute address
  status: failing
  lines:
    - kw: Given
      text: memory at 0x0100 holds 0xC3, 0x00, 0x20
    - kw: When
      text: the CPU executes one step
    - kw: Then
      text: PC is 0x2000
    - kw: And
      text: the step reports 16 cycles
code:
  lang: go
  source: |
    case 0xC3: // JP nn
        lo := c.fetch()
        hi := c.fetch()
        c.PC = uint16(hi)<<8 | uint16(lo)
        return 16
reading: 'JP nn - the unconditional absolute jump.'
checkpoint: The spec now works and the CPU can jump to any address. Commit and stop here.
---

A program is not just a straight line - it needs to move execution around. `JP
nn` (opcode `0xC3`) is the simplest way: it reads a 16-bit **absolute address**
(little-endian, as always) and loads it straight into `PC`, so the next fetch
happens there. The two operand bytes `0x00, 0x20` become the target `0x2000`.

The subtle part is that `PC` is *not* advanced past the instruction the usual
way - the whole point is to replace it. Because you fetched the two operand bytes
first, then overwrote `PC`, the arithmetic just works out. This is the
unconditional jump; the next two lessons add relative and conditional forms that
turn jumping into real branching and looping.
