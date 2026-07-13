---
project: build-a-chip-8-emulator
lesson: 20
title: 8XY4 - add with carry
overview: This is the add that reports its overflow. 8XY4 stores the low byte of VX plus VY and sets VF to the carry - and it must write VF last, even when the destination register is VF itself.
goal: Implement 8XY4 so it adds VY to VX, keeps the low byte, and sets VF to the carry after the store.
spec:
  scenario: 8XY4 adds and reports the carry
  status: failing
  lines:
    - kw: Given
      text: 'V0 holds 0xFF and V1 holds 0x01, about to execute 0x8014'
    - kw: When
      text: 'Step runs it'
    - kw: Then
      text: 'V0 becomes 0x00 (the low byte of 0x100) and VF becomes 1 (the carry)'
    - kw: And
      text: 'with V0 = 0x10, V1 = 0x0F, 0x8014 gives V0 = 0x1F and VF = 0; and 0x8F14 with VF = 0x05, V1 = 0x03 ends with VF = 0 (the carry), NOT 0x08'
code:
  lang: go
  source: |
    case 0x4: // 8XY4: add VY to VX with carry
      // two things to get right: VX keeps only the low byte of the sum,
      // and VF becomes the carry (1 when the true sum overflowed a byte,
      // else 0). Work out how to detect that overflow. Write VF LAST,
      // after the result, so an X of F ends holding the carry, not the sum.
checkpoint: 8XY4 adds with an 8-bit result and a carry flag written after the store. Commit and stop here.
---

**`8XY4`** adds `VY` into `VX` and, unlike the flag-free `7XNN`, it **reports overflow**. Registers are 8-bit, so if the true sum exceeds `0xFF` the result keeps only the low byte and `VF` is set to `1`; otherwise `VF` is `0`. So `0xFF + 0x01` gives a stored `0x00` with `VF = 1`. Compute the sum somewhere wide enough to see the ninth bit before you truncate.

The subtle, must-pin rule is **ordering**: `VF` is written *after* the result, even when the destination register `X` is `F` itself. In `8F14`, the instruction first computes `VF + V1` and would store it in `VF`, but then immediately overwrites `VF` with the carry - so the sum is thrown away and `VF` holds `0` or `1`. Getting this backwards (writing the flag first, then the sum) is a real and common bug, which is why the spec includes the `X == F` case and demands `VF` end as the carry, not the arithmetic result.
