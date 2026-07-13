---
project: build-a-chip-8-emulator
lesson: 10
title: 7XNN - add a constant
overview: 7XNN adds a byte to a register - and it is your first taste of 8-bit arithmetic, which wraps around at 256 and, crucially, never touches the flag register. Today you pin that wrapping behaviour exactly.
goal: Implement 7XNN so it adds NN to VX modulo 256 without affecting VF.
spec:
  scenario: 7XNN adds and wraps without setting a flag
  status: failing
  lines:
    - kw: Given
      text: 'V0 holds 0xFF and VF holds 1, about to execute 0x7001 (add 1 to V0)'
    - kw: When
      text: 'Step runs it'
    - kw: Then
      text: 'V0 wraps to 0x00 (255 + 1 modulo 256) and VF is still 1 - the add does NOT set a carry flag'
    - kw: And
      text: 'from V0 = 0x10, executing 0x7005 gives V0 = 0x15'
code:
  lang: go
  source: |
    case 0x7000:
      x := byte(op >> 8 & 0x0F)
      nn := byte(op & 0x00FF)
      // byte arithmetic wraps at 256 on its own; think about which
      // register this must NOT modify
      v.V[x] += nn
      return nil
checkpoint: 7XNN adds a constant with 8-bit wraparound and leaves VF alone. Commit and stop here.
---

**`7XNN`** adds the immediate byte `NN` to register `VX`. It looks as simple as `6XNN`, but it carries the project's first real subtlety: registers are **8-bit**, so the sum is taken **modulo 256**. Adding `1` to `0xFF` does not give `0x100` - there is nowhere to put the ninth bit, so it wraps to `0x00`. In a language with fixed-width byte types this happens for free; in one without, you must mask with `& 0xFF` yourself. Pinning the wrap at the boundary, not just a mid-range add, is what keeps this spec honest in any language.

The trap is the flag register. Unlike the `8XY4` add you will meet later, **`7XNN` does not report a carry** - it leaves `VF` completely alone. A program can hold a meaningful value in `VF` across a `7XNN`, and clobbering it would be a real bug. So the test deliberately arranges an overflow (`0xFF + 1`) *and* a non-zero `VF`, and checks that the result wrapped while `VF` stayed put.
