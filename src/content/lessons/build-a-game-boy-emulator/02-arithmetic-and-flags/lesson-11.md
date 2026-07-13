---
project: build-a-game-boy-emulator
lesson: 11
title: Add with carry
overview: Today you implement ADC, addition that folds in the incoming carry flag so multi-byte numbers can be added one byte at a time. This is the building block that lets 16-bit and larger arithmetic chain correctly across register boundaries.
goal: Implement ADC A, B so the incoming carry flag folds into both the sum and the half-carry check.
spec:
  scenario: Adding with the carry flag already set
  status: failing
  lines:
    - kw: Given
      text: A is 0x0E, B is 0x01, and the C flag is set
    - kw: When
      text: ADC A, B (opcode 0x88) runs
    - kw: Then
      text: A is 0x10
    - kw: And
      text: the H flag is set and the C flag is clear
code:
  lang: go
  source: |
    case 0x88: // ADC A, B
        // ADC is ADD plus the *incoming* carry flag (0 or 1). Read that carry-in
        // first, then reuse your lesson-9/10 ADD logic - but the carry-in has to feed
        // BOTH the full sum AND the half-carry (low-nibble) check. Work out where
        // the +1 belongs in each; the flags are set exactly like ADD.
reading: 'ADC - add with carry, the building block for multi-byte addition.'
checkpoint: The spec now works and ADC folds the carry flag into both the result and the half-carry. Commit and stop here.
---

`ADC A, B` (**add with carry**, opcode `0x88`) is `ADD` plus one: it adds `B`
*and* the current `C` flag into `A`. This is how the CPU adds numbers wider than
8 bits - you add the low bytes with `ADD`, then each higher byte with `ADC`, and
the carry chains through them just like adding columns by hand.

The subtlety is that the incoming carry participates in the half-carry too:
`0x0E + 0x01 + 1` is `0x10`, and the low nibbles `0xE + 0x1 + 1` reach `0x10`,
so `H` is set even though neither operand alone would trip it. Because the total
is exactly `0x10`, there is no carry off the top, so the outgoing `C` is clear.
