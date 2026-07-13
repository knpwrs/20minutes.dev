---
project: build-a-game-boy-emulator
lesson: 15
title: Increment and decrement
overview: Today you implement INC and DEC, the increment and decrement instructions that update most flags but deliberately leave carry untouched. That one exception matters because it lets a program count a loop while an earlier carry survives across it.
goal: Implement INC B and DEC B so they update Z, N, and H but leave the carry flag untouched.
spec:
  scenario: Increment and decrement across nibble and byte boundaries
  status: failing
  lines:
    - kw: Given
      text: B is 0x0F and the C flag is set
    - kw: When
      text: INC B (opcode 0x04) runs
    - kw: Then
      text: B is 0x10 with the H flag set and N clear
    - kw: And
      text: the C flag is still set - INC never touches carry
    - kw: And
      text: from B = 0x10, DEC B (opcode 0x05) gives B = 0x0F with H set, N set, and C still unchanged
    - kw: And
      text: the result wraps in a single byte - from B = 0xFF, INC B gives B = 0x00 with Z set; from B = 0x00, DEC B gives B = 0xFF
code:
  lang: go
  source: |
    case 0x04: // INC B
        c.SetFlag(FlagH, c.B&0x0F == 0x0F) // low nibble about to roll over
        c.B++
        c.SetFlag(FlagZ, c.B == 0)
        c.SetFlag(FlagN, false)
        return 4 // note: C is deliberately left untouched
reading: 'INC and DEC - the one arithmetic family that preserves the carry flag.'
checkpoint: The spec now works and INC/DEC update Z, N, and H while preserving C. Commit and stop here.
---

`INC` and `DEC` add or subtract one from a single register. They update `Z`, set
`N` appropriately (`0` for `INC`, `1` for `DEC`), and compute `H` from the low
nibble - but they have one crucial peculiarity: **they do not touch the carry
flag**. That is deliberate, so a program can count a loop with `INC` while a
running `C` from earlier arithmetic survives untouched across the loop body.

Because carry is off-limits, you cannot reuse your `ADD` path here - you must
set only `Z`, `N`, and `H` and leave `C` exactly as you found it. `0x0F`
incrementing to `0x10` trips the half-carry (the low nibble rolled over), a
handy edge to test. Getting this preservation right now prevents a whole class
of subtle bugs when real games interleave counting with arithmetic.
