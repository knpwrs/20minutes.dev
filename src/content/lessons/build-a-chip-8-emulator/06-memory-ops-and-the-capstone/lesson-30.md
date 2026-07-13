---
project: build-a-chip-8-emulator
lesson: 30
title: FX1E - add to the index
overview: The index register needs to move through memory, and FX1E advances it by a register. Today you implement it, noting that unlike the arithmetic opcodes it leaves VF alone.
goal: Implement FX1E so it adds VX to the index register I without affecting VF.
spec:
  scenario: FX1E advances the index register
  status: failing
  lines:
    - kw: Given
      text: 'I holds 0x300, V0 holds 0x05, and VF holds 1, about to execute 0xF01E'
    - kw: When
      text: 'Step runs it'
    - kw: Then
      text: 'I becomes 0x305 and VF is still 1 - FX1E does not touch the flag'
    - kw: And
      text: 'from I = 0x0FFF, V0 = 0x02, executing 0xF01E gives I = 0x1001 (I is 16-bit, so it does not wrap at the 12-bit address boundary)'
code:
  lang: go
  source: |
    // in the 0xF000 arm:
    case 0x1E:
      v.i += uint16(v.V[x]) // no flag effect on standard CHIP-8
      return nil
checkpoint: FX1E advances the index register by a register value without touching VF. Commit and stop here.
---

**`FX1E`** adds `VX` to the index register `I`. It is the tool for stepping `I` through a table or an array in memory: point `I` at the start with `ANNN`, then bump it along with `FX1E`. Because `I` is 16 bits wide, the sum has plenty of room - adding to an `I` near the top of normal program memory just produces a larger 16-bit value, it does not wrap at the 12-bit address edge.

The one thing to pin is what it does *not* do: **`FX1E` leaves `VF` unchanged**. It sits in the arithmetic-looking `0xF` family and adds two values, so it is tempting to give it a carry flag like `8XY4` - but standard CHIP-8 does not, and a program may keep meaningful data in `VF` across it. The spec deliberately sets `VF = 1` beforehand and checks it survives, the same discipline you applied to `7XNN`.
