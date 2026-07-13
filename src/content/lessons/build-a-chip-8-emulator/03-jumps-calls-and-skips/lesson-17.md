---
project: build-a-chip-8-emulator
lesson: 17
title: 5XY0 and 9XY0 - skip on a register
overview: The other half of the compare family tests two registers against each other. Today you implement 5XY0 (skip if VX equals VY) and 9XY0 (skip if they differ).
goal: Implement 5XY0 and 9XY0 so they skip based on comparing VX and VY.
spec:
  scenario: Register-to-register skips
  status: failing
  lines:
    - kw: Given
      text: 'V1 holds 0x07 and V2 holds 0x07, about to execute 0x5120 at 0x200 (skip if V1 == V2)'
    - kw: When
      text: 'Step runs it'
    - kw: Then
      text: 'the registers are equal so PC becomes 0x204, skipping the next instruction'
    - kw: And
      text: 'with those same values, executing 0x9120 (skip if V1 != V2) does NOT skip, leaving PC at 0x202'
    - kw: And
      text: 'on differing values V1 = 0x07, V2 = 0x08 the outcomes invert: 0x5120 does NOT skip (PC = 0x202) while 0x9120 DOES skip (PC = 0x204)'
code:
  lang: go
  source: |
    case 0x5000:
      x, y := byte(op>>8&0x0F), byte(op>>4&0x0F)
      if v.V[x] == v.V[y] { v.pc += 2 }
      return nil
    case 0x9000:
      x, y := byte(op>>8&0x0F), byte(op>>4&0x0F)
      if v.V[x] != v.V[y] { v.pc += 2 }
      return nil
checkpoint: 5XY0 and 9XY0 compare two registers and skip accordingly. Commit and stop here.
---

**`5XY0`** and **`9XY0`** complete the compare family by testing two registers against each other instead of against a constant: `5XY0` skips when `VX` equals `VY`, `9XY0` skips when they differ. The skip mechanic is identical to the last lesson - a fired skip adds an extra two to `PC` - so the only new idea is reading a second register operand, `y`, from the third nibble.

The low nibble is fixed at `0` in both (hence `5XY0`, not `5XYn`); that `0` is part of the opcode's identity, distinguishing these from the arithmetic `8XY_` family you are about to build, which reuses the same `x`/`y` layout with a meaningful low nibble. With these four skip instructions plus the jumps and subroutine calls, the machine now has the complete control-flow vocabulary a real program needs: loop, branch, and call.
