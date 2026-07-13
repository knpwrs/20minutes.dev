---
project: build-a-game-boy-emulator
lesson: 5
title: The flags register
overview: Today you turn register F into the CPU's status flags, four independent bits that record whether a result was zero, negative, or overflowed. Every arithmetic instruction from here on reports its outcome through these same four flags.
goal: Treat the top four bits of register F as the Z, N, H, and C flags, each settable and clearable independently.
spec:
  scenario: Setting and clearing the zero flag
  status: failing
  lines:
    - kw: Given
      text: register F is 0x00
    - kw: When
      text: the Z flag is set true
    - kw: Then
      text: F is 0x80
    - kw: And
      text: setting the C flag true as well makes F 0x90, while the low nibble stays 0
code:
  lang: go
  source: |
    // bits 3..0 always read 0
    const (
        FlagZ = 0x80 // bit 7 - zero
        FlagN = 0x40 // bit 6 - subtract
        FlagH = 0x20 // bit 5 - half-carry
        FlagC = 0x10 // bit 4 - carry
    )
    func (r *Registers) SetFlag(mask uint8, on bool) {
        if on { r.F |= mask } else { r.F &^= mask }
        r.F &= 0xF0 // keep the low nibble zero
    }
reading: 'The F register - bit 7 Z (zero), bit 6 N (subtract), bit 5 H (half-carry), bit 4 C (carry).'
checkpoint: The spec now works and each flag can be set and cleared independently. Commit and stop here.
---

The `F` register is not a general-purpose byte - it is the CPU's **status
flags**. Only its top four bits mean anything: bit 7 is **Z** (zero), bit 6 is
**N** (subtract), bit 5 is **H** (half-carry), and bit 4 is **C** (carry). The
bottom four bits are always zero and cannot be set.

These four flags are how instructions record what happened - a result was zero,
an addition overflowed - and how later instructions decide whether to branch.
Model them as a mask over `F` now, keeping the low nibble forced to zero, and
every arithmetic lesson that follows just flips the right bit.
