---
project: build-a-chip-8-emulator
lesson: 22
title: 8XY6 and 8XYE - the shifts
overview: The shift opcodes are CHIP-8's most notorious quirk - which register they shift depends on the interpreter. Today you implement 8XY6 (right) and 8XYE (left), shifting VX in place and capturing the bit that falls out in VF.
goal: Implement 8XY6 and 8XYE to shift VX by one bit, setting VF to the shifted-out bit.
spec:
  scenario: Shifts move VX and record the lost bit
  status: failing
  lines:
    - kw: Given
      text: 'V0 holds 0x05 (binary 00000101), about to execute 0x8006 (shift V0 right)'
    - kw: When
      text: 'Step runs it'
    - kw: Then
      text: 'V0 becomes 0x02 (0x05 >> 1) and VF becomes 1 (the bit shifted out of the bottom)'
    - kw: And
      text: 'from V0 = 0x81 (binary 10000001), 0x800E (shift left) gives V0 = 0x02 (the low byte of 0x102) and VF = 1 (the top bit shifted out)'
code:
  lang: go
  source: |
    case 0x6: // 8XY6: shift VX right
      // capture the bit about to leave (the low bit), shift VX, then
      // set VF to that captured bit. This project shifts VX in place.
    case 0xE: // 8XYE: shift VX left; the captured bit is the high bit
checkpoint: 8XY6 and 8XYE shift VX by one bit and set VF to the bit shifted out. Commit and stop here.
---

The shifts are where CHIP-8 interpreters famously disagree. **`8XY6`** shifts right by one bit and **`8XYE`** shifts left by one, but there are two conventions: the original interpreter shifted `VY` and stored the result in `VX`, while later ones (CHIP-48 and SUPER-CHIP) shifted **`VX` in place** and ignored `VY` entirely. This project pins the **in-place** convention - `VX = VX >> 1` or `VX = VX << 1` - because it is what most modern ROMs and test suites assume. State the choice in your code so the intent is unmistakable.

The flag is the bit that **falls off the end**: for a right shift, `VF` is the old bit 0 (the bit shifted out the bottom); for a left shift, `VF` is the old bit 7. Capture that bit *before* you shift, because the shift destroys it, and write `VF` after storing the result (the same after-the-store rule as the other flag ops, so an `X == F` destination ends holding the shifted-out bit). A left shift keeps only the low byte, so `0x81 << 1` is `0x02`, not `0x102`.
