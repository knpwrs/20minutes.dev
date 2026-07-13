---
project: build-a-chip-8-emulator
lesson: 18
title: 8XY0 - copy a register
overview: The 8XY_ family is CHIP-8's arithmetic unit, and every member shares a layout selected by the last nibble. Today you open the family with 8XY0, which copies VY into VX, and wire up the sub-dispatch the rest of the ALU will hang off.
goal: Dispatch the 8XY_ family by its low nibble and implement 8XY0 (set VX to VY).
spec:
  scenario: 8XY0 copies one register into another
  status: failing
  lines:
    - kw: Given
      text: 'V1 holds 0xAB and V2 holds 0x00, VF holds 0, about to execute 0x8120 (set V1 = V2)'
    - kw: When
      text: 'Step runs it'
    - kw: Then
      text: 'V1 becomes 0x00 (a copy of V2) and V2 is unchanged'
    - kw: And
      text: 'VF is still 0 - a plain copy touches no flag'
code:
  lang: go
  source: |
    case 0x8000:
      x, y := byte(op>>8&0x0F), byte(op>>4&0x0F)
      switch op & 0x000F { // the low nibble picks the ALU operation
      case 0x0:
        v.V[x] = v.V[y]
        return nil
      }
      // an unmatched 8XY_ low nibble falls through to the
      // "unimplemented opcode" error, like every other unknown opcode
checkpoint: The 8XY_ family dispatches on its low nibble and 8XY0 copies VY into VX. Commit and stop here.
---

The opcodes beginning with `8` are CHIP-8's **arithmetic and logic unit**. They all read two registers, `VX` and `VY`, and the **low nibble** (`n`) selects which operation - `0` is copy, `1` through `3` are the logical ops, `4` and `5` and `7` are add and subtract, `6` and `E` are shifts. So the `0x8` arm of your main switch is really a second, nested switch on `n`. Setting that structure up now, on the simplest member, means each following lesson adds exactly one `case`.

**`8XY0`** is that simplest member: "set `VX` to `VY`," a plain register-to-register copy. It has no flag effect at all, which is worth pinning explicitly - the test holds `VF` at `0` across the copy and checks it stays there. That matters because the very next opcodes in this family *do* write `VF`, and it is easy to reach for a shared helper that touches the flag when it should not. Copy is the one that must leave `VF` completely alone.
