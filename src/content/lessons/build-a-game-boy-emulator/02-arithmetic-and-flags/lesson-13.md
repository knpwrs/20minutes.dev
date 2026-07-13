---
project: build-a-game-boy-emulator
lesson: 13
title: Bitwise logic
overview: Today you implement the bitwise instructions AND and XOR, which cover the two different flag conventions used by all three logical operations. XOR A, A in particular is a pattern you will recognize immediately once you start running real game code.
goal: Implement AND and XOR on A, covering the two flag conventions that also apply to OR.
spec:
  scenario: The three logical operations and their flags
  status: failing
  lines:
    - kw: Given
      text: A is 0xF0 and B is 0x0F
    - kw: When
      text: AND A, B (opcode 0xA0) runs
    - kw: Then
      text: A is 0x00 with Z and H set and N and C clear
    - kw: And
      text: from A of 0x5A, XOR A, A (opcode 0xAF) gives A of 0x00 with only Z set
code:
  lang: go
  source: |
    case 0xA0: // AND A, B
        c.A &= c.B
        c.SetFlag(FlagZ, c.A == 0)
        c.SetFlag(FlagN, false)
        c.SetFlag(FlagH, true)   // AND uniquely sets H
        c.SetFlag(FlagC, false)
        return 4
    case 0xAF: // XOR A, A -> 0, only Z set (H cleared here)
        c.A ^= c.A
        // ...Z from result, N=0, H=0, C=0. OR (0xB0) is identical to XOR's flags.
reading: 'The logical instructions AND, OR, XOR and their flag conventions.'
checkpoint: The spec now works and AND (which sets H) and XOR (which clears it) set their flags correctly. OR uses XOR's exact flag rule, so leave it as an easy add later. Commit and stop here.
---

The three **bitwise** operations combine `A` with another register bit by bit:
`AND` keeps bits set in both, `OR` keeps bits set in either, and `XOR` keeps
bits that differ. All three clear `N` and `C` and set `Z` only when the result
is zero. The one quirk to memorize: **AND sets `H`**, while `OR` and `XOR` clear
it - a historical accident of the hardware, not a rule with meaning.

`XOR A, A` (opcode `0xAF`) is worth knowing on its own: a value XORed with
itself is always zero, so this is the idiomatic one-byte way to zero the
accumulator and set the `Z` flag. Real games open with it constantly, so it is a
pattern you will see the moment you run actual code.
