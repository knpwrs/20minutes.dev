---
project: build-a-chip-8-emulator
lesson: 16
title: 3XNN and 4XNN - skip on a constant
overview: Conditionals in CHIP-8 are skips - they hop over the next instruction when a test passes. Today you implement 3XNN (skip if VX equals NN) and its opposite 4XNN.
goal: Implement 3XNN and 4XNN so they skip the next instruction on an equality test with NN.
spec:
  scenario: The skips advance PC by an extra two when they fire
  status: failing
  lines:
    - kw: Given
      text: 'V5 holds 0x42, about to execute 0x3542 at 0x200 (skip if V5 == 0x42)'
    - kw: When
      text: 'Step runs it'
    - kw: Then
      text: 'the test passes so PC is 0x204 (skipping the next instruction), not 0x202'
    - kw: And
      text: 'run on its own from a fresh start at 0x200 with V5 = 0x42, 0x4542 (skip if V5 != 0x42) does NOT skip, leaving PC at 0x202'
code:
  lang: go
  source: |
    case 0x3000:
      x := byte(op >> 8 & 0x0F)
      if v.V[x] == byte(op&0x00FF) { v.pc += 2 } // skip = advance one more instruction
      return nil
    case 0x4000:
      x := byte(op >> 8 & 0x0F)
      if v.V[x] != byte(op&0x00FF) { v.pc += 2 }
      return nil
checkpoint: 3XNN and 4XNN skip the next instruction based on an equality test. Commit and stop here.
---

CHIP-8 has no if-statement and no compare-then-branch; instead it has **skip** instructions. A skip either does nothing, or it jumps over the single instruction that follows it - and paired with a jump, that is enough to build any conditional. **`3XNN`** skips when `VX` equals the constant `NN`; **`4XNN`** skips when it does *not*. They are the equality half of the compare family.

The mechanism is precise: `Fetch` already moved `PC` past the skip instruction, so "skip the next instruction" means adding **another** two to `PC`, jumping the two-byte instruction that follows. When the test fails, `PC` is left as fetch set it and the next instruction runs normally. Pin both directions in one lesson - a `3XNN` that fires and a `4XNN` on the same values that does not - so the extra-two arithmetic is verified against both outcomes. These two cover equality against a constant; the next lesson compares two registers.
