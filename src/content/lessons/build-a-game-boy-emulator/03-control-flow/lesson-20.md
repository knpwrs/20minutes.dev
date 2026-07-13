---
project: build-a-game-boy-emulator
lesson: 20
title: Post-increment addressing
overview: Today you implement LD (HL+), A and its decrementing sibling LD (HL-), A, which store a byte through HL and then automatically advance the pointer - the single-instruction building block behind every memory-filling loop you will write later.
goal: Implement LD (HL+), A and LD (HL-), A, which store through HL and then increment or decrement HL in the same instruction.
spec:
  scenario: Storing and advancing in one instruction
  status: failing
  lines:
    - kw: Given
      text: HL is 0xC000 and A is 0x42
    - kw: When
      text: LD (HL+), A (opcode 0x22) runs
    - kw: Then
      text: memory at 0xC000 holds 0x42
    - kw: And
      text: HL is now 0xC001
    - kw: And
      text: the decrement form LD (HL-), A (opcode 0x32) instead leaves HL at 0xBFFF after the store
code:
  lang: go
  source: |
    case 0x22: // LD (HL+), A
        c.mem.Write(c.HL(), c.A)
        c.SetHL(c.HL() + 1)
        return 8
    case 0x32: // LD (HL-), A - same, but decrement
reading: 'The HL+ and HL- load variants - store, then auto-advance the pointer.'
checkpoint: The spec now works and the auto-increment and auto-decrement loads work. Commit and stop here.
---

Copying a block of memory means "write a byte, move the pointer, repeat," and
the Game Boy folds the first two steps into one instruction. `LD (HL+), A`
(opcode `0x22`) stores `A` at the address in `HL` and then **increments `HL`** so
it points at the next slot. `LD (HL-), A` (`0x32`) does the same but decrements.

These auto-updating forms are everywhere in real code because the most common
loop on the machine is "fill a region of memory." Clearing video RAM at startup
or copying a sprite table both lean on `(HL+)`. It is a small convenience, but it
turns a two-instruction inner loop into a one-instruction one - and once you add
conditional jumps, you will write exactly that loop.
