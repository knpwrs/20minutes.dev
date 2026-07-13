---
project: build-a-game-boy-emulator
lesson: 33
title: Testing a bit
overview: Today you implement the BIT instruction, which tests a single bit of a register and reports it through the Z flag without modifying anything. It's how game code checks status bits and button states before branching.
goal: Implement BIT 0, B so it sets the Z flag to the complement of the tested bit.
spec:
  scenario: Testing a clear bit and a set bit
  status: failing
  lines:
    - kw: Given
      text: B is 0xFE (bit 0 clear) and the opcode is CB 0x40
    - kw: When
      text: BIT 0, B runs
    - kw: Then
      text: the Z flag is set, the H flag is set, and N is clear
    - kw: And
      text: testing bit 1 of the same B (CB 0x48) leaves Z clear, and C is never changed
code:
  lang: go
  source: |
    case 0x40: // BIT 0, B
        set := c.B & (1 << 0)
        c.SetFlag(FlagZ, set == 0) // Z = NOT bit
        c.SetFlag(FlagN, false)
        c.SetFlag(FlagH, true)
        // C is left exactly as it was
reading: 'BIT b, r - test a single bit and reflect it (inverted) in the Z flag.'
checkpoint: BIT now reports the tested bit through Z without altering it. Commit and stop here.
---

`BIT b, r` (CB opcodes `0x40` and up) **tests** a single bit without changing the
register at all. It sets `Z` to the **complement** of the bit: if the bit is `0`,
`Z` is set; if the bit is `1`, `Z` is clear. That inversion trips people up, so
read it as "Z means the bit was zero." It also forces `H` set and `N` clear, and
crucially **leaves `C` untouched**.

This is how a program asks "is this flag bit on?" - test the bit, then branch
with `JR Z` or `JR NZ`. Games check button states, tile attributes, and status
bits this way constantly. The bit number is encoded in the opcode (`0x40` is bit
0 of `B`, `0x48` is bit 1, stepping by 8) - implement a couple of `B` cases today,
and once you spot that pattern the remaining `BIT` opcodes fall out as an easy
extension later.
