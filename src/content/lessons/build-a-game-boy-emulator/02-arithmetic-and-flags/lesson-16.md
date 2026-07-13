---
project: build-a-game-boy-emulator
lesson: 16
title: 16-bit addition
overview: Today you extend addition to 16-bit register pairs with ADD HL, BC, where the half-carry and carry bits shift to bit 11 and bit 15. This is the arithmetic the CPU relies on for pointer and offset math throughout the rest of the emulator.
goal: Implement ADD HL, BC with half-carry from bit 11 and carry from bit 15.
spec:
  scenario: Adding a 16-bit pair into HL
  status: failing
  lines:
    - kw: Given
      text: HL is 0x8A23, BC is 0x0605, and the Z flag is set
    - kw: When
      text: ADD HL, BC (opcode 0x09) runs
    - kw: Then
      text: HL is 0x9028 with the H flag set (carry from bit 11)
    - kw: And
      text: the C flag is clear, N is clear, and Z is still set (unaffected)
    - kw: And
      text: at the boundary - HL = 0xFFFF, BC = 0x0001 - the result wraps to 0x0000 with C set (carry out of bit 15) and H set
code:
  lang: go
  source: |
    case 0x09: // ADD HL, BC
        // The same widen-to-see-the-carry idea as 8-bit ADD, scaled up. Compute
        // HL + BC in a wider type. Two flags change meaning here:
        //   H ← carry out of bit 11 (mask both to their low 12 bits - what's the limit?)
        //   C ← carry out of bit 15
        // N is cleared; Z is left untouched. Store the low 16 bits back in HL.
        return 8
reading: '16-bit ADD HL, rr - half-carry moves to bit 11, and Z is left alone.'
checkpoint: The spec now works and 16-bit addition sets H and C from the right bit positions. Commit and stop here.
---

`ADD HL, BC` (opcode `0x09`) adds one register pair into `HL`, the CPU's way of
doing pointer and offset math. The flag rules shift to match the wider operands:
`N` is cleared, `C` is the carry out of **bit 15** (the true 16-bit overflow),
and `H` is now the carry out of **bit 11** - mask both operands with `0x0FFF`
and see if they pass `0x0FFF`.

The other surprise is what it *doesn't* do: `ADD HL, rr` **leaves `Z`
untouched**, unlike every 8-bit add so far. Your test sets `Z` beforehand and
checks it survives. Compute in a 32-bit temporary so the bit-15 overflow is
visible before you truncate back to 16 bits, exactly as you widened to 16 bits
for the 8-bit adds.
