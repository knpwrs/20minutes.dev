---
project: build-a-chip-8-emulator
lesson: 19
title: 8XY1/8XY2/8XY3 - the logical ops
overview: 'OR, AND, and XOR combine two registers bit by bit - and on original CHIP-8 they all share one surprising quirk: they reset VF to zero. Today you implement all three and pin that quirk.'
goal: Implement 8XY1 (OR), 8XY2 (AND), and 8XY3 (XOR), each resetting VF to 0.
spec:
  scenario: The logical ops combine bits and reset the flag
  status: failing
  lines:
    - kw: Given
      text: 'V0 holds 0xF0, V1 holds 0x0F, and VF holds 1'
    - kw: When
      text: '0x8011 (V0 OR V1) runs'
    - kw: Then
      text: 'V0 becomes 0xFF and VF is reset to 0 (the vF-reset quirk, even though nothing overflowed)'
    - kw: And
      text: 'from that same start, 0x8012 (AND) gives V0 = 0x00 and 0x8013 (XOR) gives V0 = 0xFF, and each also leaves VF = 0'
code:
  lang: go
  source: |
    // inside the 8XY_ low-nibble switch:
    case 0x1: v.V[x] |= v.V[y] // OR
    case 0x2: v.V[x] &= v.V[y] // AND
    case 0x3: v.V[x] ^= v.V[y] // XOR
    // then, for all three, VF is reset - decide where that line goes
checkpoint: OR, AND, and XOR combine registers bitwise and all reset VF to 0. Commit and stop here.
---

The three logical instructions are bit-for-bit combinations of `VX` and `VY`: **`8XY1`** is OR, **`8XY2`** is AND, **`8XY3`** is XOR, each storing the result back in `VX`. The bitwise operation itself is unremarkable - `0xF0` OR `0x0F` is `0xFF`, AND is `0x00`, XOR is `0xFF`.

The catch is a genuine quirk of the original interpreter: **all three reset `VF` to `0`**. It is not a carry or a meaningful flag, just an artifact of how the 1970s hardware reused a register during the operation, and some later interpreters dropped it - but real ROMs of the era depend on it, so this project pins it. That is why the spec starts with `VF = 1` and checks every one of OR, AND, and XOR drives it back to `0`. Name that reset in your code explicitly rather than assuming these ops leave `VF` untouched; forgetting it is the classic stale-flag bug.
