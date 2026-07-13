---
project: build-a-chip-8-emulator
lesson: 21
title: 8XY5 and 8XY7 - subtract with borrow
overview: Subtraction reports a borrow, but with an inverted flag - VF is 1 when there is NO borrow. Today you implement 8XY5 (VX minus VY) and 8XY7 (VY minus VX), pinning that inverted flag.
goal: Implement 8XY5 and 8XY7 so they subtract with an 8-bit result and set VF to 1 when there is no borrow.
spec:
  scenario: The subtracts set VF to the NOT-borrow flag
  status: failing
  lines:
    - kw: Given
      text: 'V0 holds 0x05 and V1 holds 0x03, about to execute 0x8015 (V0 = V0 - V1)'
    - kw: When
      text: 'Step runs it'
    - kw: Then
      text: 'V0 becomes 0x02 and VF becomes 1 (no borrow, because V0 >= V1)'
    - kw: And
      text: 'from V0 = 0x03, V1 = 0x05, 0x8015 gives V0 = 0xFE (wrapped) and VF = 0 (a borrow occurred); and 0x8017 (V1 - V0) gives V0 = 0x02 with VF = 1'
code:
  lang: go
  source: |
    case 0x5: // 8XY5: VX = VX - VY
      // subtract in a wide type, keep the low byte in VX, then set VF
      // to 1 when the minuend was >= the subtrahend (no borrow), else 0.
    case 0x7: // 8XY7: VX = VY - VX  (same rule, operands swapped)
checkpoint: 8XY5 and 8XY7 subtract with wraparound and an inverted borrow flag. Commit and stop here.
---

Subtraction mirrors the add, with one twist that trips everyone up: the flag is **inverted**. For **`8XY5`** (`VX = VX - VY`), `VF` is set to `1` when there is **no** borrow - that is, when `VX` is greater than or equal to `VY` - and `0` when the subtraction would go negative and wraps around. So `0x05 - 0x03` stores `0x02` with `VF = 1`, while `0x03 - 0x05` wraps to `0xFE` with `VF = 0`. Think of `VF` here as "the result is valid / did not underflow," which is the opposite polarity of the carry flag.

**`8XY7`** is the same operation with the operands reversed: `VX = VY - VX`, with `VF = 1` when `VY >= VX`. It exists so a program can subtract in either direction without first copying registers around. Both keep only the low byte of the result and, like `8XY4`, write `VF` after the store. Pin all three facets - a clean subtract, one that borrows, and the reversed form - so the inverted flag is verified in both directions.
