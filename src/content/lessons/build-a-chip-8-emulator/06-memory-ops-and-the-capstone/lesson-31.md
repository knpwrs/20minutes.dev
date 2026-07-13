---
project: build-a-chip-8-emulator
lesson: 31
title: FX29 - point at a font digit
overview: To draw a number, a program points the index register at that digit's built-in font sprite. Today you implement FX29, which computes the font address from a register.
goal: Implement FX29 so it sets I to the address of the font sprite for the digit in VX.
spec:
  scenario: FX29 aims the index register at a font sprite
  status: failing
  lines:
    - kw: Given
      text: 'the font is loaded at 0x50, V0 holds 0x02, about to execute 0xF029'
    - kw: When
      text: 'Step runs it'
    - kw: Then
      text: 'I becomes 0x5A (0x50 + 2*5, the start of the digit-2 sprite) and the byte at I is 0xF0 (the first row of the 2 sprite)'
    - kw: And
      text: 'with V0 = 0x00, FX29 sets I to 0x50 (the digit-0 sprite)'
code:
  lang: go
  source: |
    const FontStart = 0x50
    // in the 0xF000 arm:
    case 0x29:
      // each font digit is 5 bytes; point I at the sprite for the
      // low nibble of VX
      v.i = FontStart + uint16(v.V[x])*5
      return nil
checkpoint: FX29 points I at the built-in font sprite for a digit. Commit and stop here.
---

**`FX29`** connects the register file to the font you loaded back in lesson 5. It takes the digit in `VX` and sets `I` to the memory address of that digit's 5-byte font sprite, so a following `DXYN` can draw it. The calculation is exactly the layout you pinned when loading the font: the digits sit back to back at `0x50`, five bytes each, so the sprite for digit `d` begins at `0x50 + d*5`. Digit `2` is at `0x5A`, digit `0` at `0x50`.

This is the standard way a CHIP-8 program shows a score or a counter: put the digit's value in a register, `FX29` to aim `I`, then `DXYN` with a height of `5` to stamp it on screen. The spec checks not just the computed address but that the byte living there is the expected first row of the sprite (`0xF0`), which confirms the font really was loaded where this opcode assumes. The capstone will use exactly this pairing to draw a digit.
