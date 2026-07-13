---
project: build-a-game-boy-emulator
lesson: 7
title: Loading an immediate
overview: Today you implement LD B, n, the first instruction that reads its own data out of the instruction stream. The pattern you build here - fetch an immediate byte into a register - covers an entire family of load instructions with the same shape.
goal: Implement LD B, n so it reads the immediate byte after the opcode into register B.
spec:
  scenario: Loading an immediate into B
  status: failing
  lines:
    - kw: Given
      text: PC is 0x0100 and memory holds 0x06, 0x42 at 0x0100 and 0x0101
    - kw: When
      text: the CPU executes one step
    - kw: Then
      text: B is 0x42
    - kw: And
      text: PC is 0x0102 and the step reports 8 cycles
code:
  lang: go
  source: |
    case 0x06: // LD B, n
        c.B = c.fetch() // the immediate byte right after the opcode
        return 8
reading: 'Immediate operands - the byte(s) following an opcode in the instruction stream.'
checkpoint: The spec now works and the CPU can load a constant into a register. Commit and stop here.
---

Many instructions carry their data inline: the opcode is followed by one or more
**immediate** bytes that live in the instruction stream itself. `LD B, n`
(opcode `0x06`) is the simplest - it copies the byte right after the opcode into
register `B`. Because it reads two bytes total, `PC` ends up two past where it
started, and the instruction costs 8 cycles instead of 4.

The trick is that your `fetch` from lesson 4 already does the right thing twice:
once for the opcode, once for the immediate. There is an `LD r, n` for every
register (`0x0E` for `C`, `0x16` for `D`, and so on) following the exact same
shape, so implementing one hands you the pattern for all of them.
