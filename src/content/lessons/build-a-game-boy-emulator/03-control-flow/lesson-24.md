---
project: build-a-game-boy-emulator
lesson: 24
title: Conditional branches
overview: Today you implement JR NZ, e, the first conditional branch, which only jumps when the Z flag is clear and costs a different number of cycles depending on whether the branch is taken - the mechanism behind every if and loop test.
goal: Implement JR NZ, e so it jumps only when the Z flag is clear, and make sure it reports the correct cycle count whether the branch is taken or not.
spec:
  scenario: A branch taken and not taken
  status: failing
  lines:
    - kw: Given
      text: memory at 0x0100 holds 0x20, 0x05 and the Z flag is clear
    - kw: When
      text: the CPU executes one step
    - kw: Then
      text: PC is 0x0107 and the step reports 12 cycles (branch taken)
    - kw: And
      text: with Z set instead, PC is 0x0102 and the step reports 8 cycles (not taken)
code:
  lang: go
  source: |
    case 0x20: // JR NZ, e
        e := int8(c.fetch())
        if c.F&FlagZ == 0 {
            c.PC = uint16(int(c.PC) + int(e))
            return 12
        }
        return 8
reading: 'Conditional jumps (NZ, Z, NC, C) and their taken/not-taken cycle counts.'
checkpoint: The spec now works and conditional branches cost the right cycles whether taken or not. Commit and stop here.
---

Real decisions come from **conditional** branches. `JR NZ, e` (opcode `0x20`)
jumps only when the `Z` flag is **clear** ("not zero"); otherwise it reads past
the offset and falls through. The four conditions - `NZ`, `Z`, `NC`, `C` - pair
with the flags a `CP` or `DEC` just set, which is how `if` and loop tests
execute.

There is a timing wrinkle unique to conditional instructions: they cost **more
cycles when the branch is taken** (12) than when it is not (8), because taking
the branch does extra work. You must fetch the operand in *both* cases so `PC`
advances correctly on a fall-through. Return the right cycle count for each path
- the graphics timing you build later depends on these being exact.
