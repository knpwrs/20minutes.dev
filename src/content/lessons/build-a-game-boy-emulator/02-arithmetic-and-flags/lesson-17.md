---
project: build-a-game-boy-emulator
lesson: 17
title: 16-bit increment
overview: Today you implement 16-bit INC/DEC - stepping a whole register pair up or down which, unlike their 8-bit cousins, touch no flags at all. It rounds out the arithmetic core and gives you the pointer-stepping the memory chapter will lean on.
goal: Implement INC BC and DEC BC, which step a register pair up or down without touching any flags.
spec:
  scenario: Incrementing and decrementing a pair, with no flags touched
  status: failing
  lines:
    - kw: Given
      text: BC is 0x00FF and all flags are clear
    - kw: When
      text: INC BC (opcode 0x03) runs
    - kw: Then
      text: BC is 0x0100
    - kw: And
      text: every flag is still clear - 16-bit INC affects no flags
    - kw: And
      text: from BC = 0x0100, DEC BC (opcode 0x0B) gives BC = 0x00FF with every flag still clear
    - kw: And
      text: it wraps in 16 bits - from BC = 0xFFFF, INC BC gives BC = 0x0000; from BC = 0x0000, DEC BC gives BC = 0xFFFF (flags still clear)
code:
  lang: go
  source: |
    case 0x03: // INC BC - no flags touched at all
        c.SetBC(c.BC() + 1)
        return 8
    case 0x0B: // DEC BC - likewise leaves every flag alone
        c.SetBC(c.BC() - 1)
        return 8
reading: '16-bit INC/DEC rr - unlike the 8-bit versions, these set no flags.'
checkpoint: The spec now works and 16-bit INC/DEC step a pair without disturbing any flag. That rounds out your arithmetic core - chapter two is done. Commit and stop.
---

`INC BC` (opcode `0x03`) adds one to a whole register pair, carrying naturally
from the low byte into the high byte - `0x00FF` becomes `0x0100`. Unlike its
8-bit cousin from lesson 15, the **16-bit `INC`/`DEC` affect no flags whatsoever**,
because the pair is usually a pointer being walked and the program does not want
its status bits disturbed for that.

With this you have a complete arithmetic core: 8- and 16-bit add and subtract,
carries, logic, compare, and counting. If you want a victory lap, hand-assemble a
short straight-line program - a few adds and increments - and check the final
registers against what you worked out on paper; that's an optional stretch, not
required today. Real loops need the conditional jumps of the next chapter, but the
math underneath them is done.
