---
project: build-a-game-boy-emulator
lesson: 31
title: Right shifts
overview: Today you implement SRL and SRA, the two right shifts that differ only in what fills bit 7 - SRL always inserts 0, SRA preserves the sign bit - the distinction that lets the CPU divide signed numbers correctly.
goal: Implement SRL and SRA, the logical and arithmetic right shifts.
spec:
  scenario: Logical versus arithmetic right shift
  status: failing
  lines:
    - kw: Given
      text: B is 0x81 (bit 7 and bit 0 set)
    - kw: When
      text: SRL B (CB opcode 0x38) runs
    - kw: Then
      text: B is 0x40 with C set - a 0 shifts into bit 7
    - kw: And
      text: SRA B (CB opcode 0x28) on 0x81 instead gives 0xC0 with C set - bit 7 is preserved
    - kw: And
      text: both shifts clear N and H, and set Z only when the result is 0
code:
  lang: go
  source: |
    case 0x38: // SRL B - logical right shift
    case 0x28: // SRA B - arithmetic right shift
        // Both shift B right one bit and put the OLD bit 0 into C. The only
        // difference is what fills the vacated top bit: SRL shifts in a 0; SRA
        // keeps the old bit 7 (sign-preserving). For BOTH, set Z from the result
        // and clear N and H. (SLA, CB 0x20, is the left mirror - a later add.)
reading: 'SRL vs. SRA - logical vs. arithmetic right shift and sign preservation.'
checkpoint: The spec now works and both right shifts behave correctly - SRL clears bit 7, SRA preserves it. SLA is the left mirror (a 0 fills bit 0). Commit and stop here.
---

Shifts move bits but, unlike rotates, do not wrap - a bit falls off one end into
carry and a fixed value fills in behind it. The two **right** shifts differ only
in what they feed into bit 7: `SRL` (**logical**) always inserts `0`, while `SRA`
(**arithmetic**) **preserves the old bit 7**, keeping a number's sign intact when
it is treated as signed. That one distinction is the whole idea today.

On `0x81`, `SRL` gives `0x40` (top bit cleared) but `SRA` gives `0xC0` (top bit
copied down) - both push the old bit 0 into carry, and both set `Z` when the
result is zero. The third shift, `SLA` (CB `0x20`), is just the left-shift
mirror: it feeds a `0` into bit 0 and pushes the old bit 7 into carry, exactly
like `RL` without the carry-in - add it in the same shape once the right shifts
work. Shifts are the CPU's multiply and divide by powers of two, and `SRA`
is how it divides signed numbers correctly.
