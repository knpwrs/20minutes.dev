---
project: build-a-game-boy-emulator
lesson: 12
title: Subtraction
overview: Today you implement subtraction, where carry and half-carry flip meaning to become borrow flags instead of carry flags. Getting the borrow logic right here sets up SBC and every conditional branch that depends on comparing two values.
goal: Implement SUB A, B with borrow-based carry and half-carry flags, and set N.
spec:
  scenario: Subtracting with a borrow
  status: failing
  lines:
    - kw: Given
      text: A is 0x10, B is 0x01, and all flags are clear
    - kw: When
      text: SUB A, B (opcode 0x90) runs
    - kw: Then
      text: A is 0x0F and the N flag is set
    - kw: And
      text: the H flag is set (borrow from bit 4) and the C flag is clear
code:
  lang: go
  source: |
    case 0x90: // SUB A, B
        // Subtraction sets N=1, and for SUB the carry/half-carry become BORROW
        // flags - the opposite direction from ADD. Work out the two conditions:
        //   C ← a borrow happened out of bit 7   (when is A too small?)
        //   H ← a borrow happened out of bit 3   (compare the low nibbles)
        // Compute BOTH flags BEFORE you overwrite A, then set Z from the result.
        return 4
reading: 'SUB and SBC - subtraction, borrow, and why N flips the flag meaning.'
checkpoint: The spec now works and SUB sets N with borrow-based carry and half-carry. Commit and stop here.
---

Subtraction mirrors addition but flips the sense of the flags. `SUB A, B`
(opcode `0x90`) computes `A - B`. The **N** flag is now **set**, marking this as
a subtract. **C** means a **borrow** happened - it is set when `B` is larger
than `A`, so the result wrapped below zero. **H** is the borrow out of the low
nibble, set when `B`'s low nibble exceeds `A`'s.

`0x10 - 0x01` needs to borrow from bit 4 to make the units work, which is why
`H` sets even though the byte result `0x0F` is perfectly ordinary. `SBC`
(subtract with carry) follows the same pattern as `ADC`, folding the incoming
carry into the borrow for multi-byte subtraction.
