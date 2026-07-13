---
project: build-a-chip-8-emulator
lesson: 32
title: FX33 - binary-coded decimal
overview: To display a number as digits, a program first splits it into its decimal places, and FX33 does exactly that - writing the hundreds, tens, and ones of VX into three memory bytes. Today you implement it.
goal: Implement FX33 so it stores the three decimal digits of VX at memory locations I, I+1, and I+2.
spec:
  scenario: FX33 splits a byte into decimal digits
  status: failing
  lines:
    - kw: Given
      text: 'V0 holds 254, I holds 0x300, about to execute 0xF033'
    - kw: When
      text: 'Step runs it'
    - kw: Then
      text: 'memory at 0x300 is 2 (hundreds), 0x301 is 5 (tens), and 0x302 is 4 (ones)'
    - kw: And
      text: 'with V0 = 7, FX33 writes 0, 0, 7 to those three bytes'
code:
  lang: go
  source: |
    // in the 0xF000 arm:
    case 0x33:
      // write the hundreds digit at I, the tens digit at I+1, and the
      // ones digit at I+2. I itself is not changed.
      return nil
checkpoint: FX33 writes the three decimal digits of a register into memory. Commit and stop here.
---

**`FX33`** performs a **binary-coded decimal** conversion: it takes the value in `VX` (0 to 255) and writes its three decimal digits into memory as separate bytes - the hundreds digit at `I`, the tens at `I+1`, and the ones at `I+2`. For `254` that is `2`, `5`, `4`. This is how a program turns a raw number into something drawable: `FX33` to split it, then `FX29` plus `DXYN` on each digit byte to show it.

The values are the whole point, so pin them at a number with all three places filled (`254`) and one that is mostly zeros (`7` becomes `0`, `0`, `7`, not a single `7`) - the leading zeros must be written, because the drawing code reads a fixed three bytes. `I` itself is left unchanged; the digits are placed relative to it but the register does not move. Working out how to peel off each decimal place from a byte is the small puzzle of the lesson.
