---
project: build-a-game-boy-emulator
lesson: 25
title: The stack
overview: Today you add the stack pointer SP and implement PUSH BC and POP BC, the push-and-pop mechanism the CPU uses to save values temporarily - and the foundation tomorrow's subroutine calls are built from.
goal: Add the stack pointer SP and implement PUSH BC and POP BC so a register pair survives a round trip through the stack.
spec:
  scenario: Pushing then popping a pair
  status: failing
  lines:
    - kw: Given
      text: SP is 0xFFFE and BC is 0x1234
    - kw: When
      text: PUSH BC (opcode 0xC5) runs
    - kw: Then
      text: SP is 0xFFFC, memory at 0xFFFD holds 0x12 and memory at 0xFFFC holds 0x34
    - kw: And
      text: a following POP DE (opcode 0xD1) sets DE to 0x1234 and SP back to 0xFFFE
    - kw: And
      text: PUSH reports 16 cycles and POP reports 12
code:
  lang: go
  source: |
    case 0xC5: // PUSH BC
        c.SP--
        c.mem.Write(c.SP, c.B) // high byte first
        c.SP--
        c.mem.Write(c.SP, c.C) // then low byte
        return 16
reading: 'The stack pointer (SP) - grows downward; high byte stored at the higher address.'
checkpoint: The spec now works and values survive a push/pop round trip. Commit and stop here.
---

The **stack** is a region of memory the CPU uses to save values temporarily,
managed by the **stack pointer** `SP` - a 16-bit register you add to the CPU
today, alongside the `PC` from lesson 4. It grows **downward**: `PUSH` decrements
`SP` and writes, `POP` reads and increments. A push stores two bytes - high byte
first at the higher address - so a later `POP` reassembles them in the right
order. On boot `SP` is `0xFFFE`, near the top of RAM.

Trace the addresses carefully: from `SP = 0xFFFE`, pushing `BC = 0x1234` writes
`0x12` to `0xFFFD` and `0x34` to `0xFFFC`, leaving `SP` at `0xFFFC`. Popping
reverses it exactly. This little dance is the mechanism behind subroutine calls,
which is precisely what you build tomorrow - `CALL` is just a `PUSH` of the
return address followed by a jump.
