---
project: build-a-game-boy-emulator
lesson: 18
title: 16-bit immediate loads
overview: Today you implement LD BC, nn, the instruction that loads a 16-bit constant from the two bytes following the opcode, establishing the little-endian byte order the CPU uses everywhere a 16-bit value crosses memory.
goal: Implement LD BC, nn so it reads the two immediate bytes following the opcode in little-endian order and loads them into BC.
spec:
  scenario: Loading a 16-bit constant
  status: failing
  lines:
    - kw: Given
      text: memory at 0x0100 holds 0x01, 0x34, 0x12
    - kw: When
      text: the CPU executes one step
    - kw: Then
      text: BC is 0x1234
    - kw: And
      text: PC is 0x0103 and the step reports 12 cycles
code:
  lang: go
  source: |
    case 0x01: // LD BC, nn
        lo := c.fetch()
        hi := c.fetch()
        c.SetBC(uint16(hi)<<8 | uint16(lo))
        return 12
reading: 'Little-endian - the low byte of a 16-bit value comes first in memory.'
checkpoint: The spec now works and 16-bit immediate loads decode little-endian correctly. Commit and stop here.
---

`LD BC, nn` (opcode `0x01`) loads a 16-bit constant into a register pair, and it
introduces the single most important convention on the machine: the Game Boy is
**little-endian**. The **low** byte comes first in memory, the **high** byte
second. So the bytes `0x34, 0x12` following the opcode assemble into `0x1234`,
not `0x3412`.

Fetch the low byte, fetch the high byte, then shift the high one into place -
the same ordering every 16-bit immediate uses. This matters far beyond today:
jump targets, absolute addresses, and stored pointers all follow the low-then
-high rule, so getting the byte order reflexive now saves you from a maddening
class of "everything is byte-swapped" bugs later.
