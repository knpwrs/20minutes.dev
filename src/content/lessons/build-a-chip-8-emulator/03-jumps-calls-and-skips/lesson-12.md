---
project: build-a-chip-8-emulator
lesson: 12
title: 1NNN and BNNN - jumps
overview: A program is more than a straight line, and jumps are how it bends. Today you implement the unconditional jump 1NNN and its computed cousin BNNN, which jumps to an address plus V0.
goal: Implement 1NNN (jump to NNN) and BNNN (jump to NNN plus V0).
spec:
  scenario: Both jumps redirect the program counter
  status: failing
  lines:
    - kw: Given
      text: 'a VM about to execute 0x1300'
    - kw: When
      text: 'Step runs it'
    - kw: Then
      text: 'PC becomes 0x300 (not 0x302 - a jump replaces PC, it does not add to it)'
    - kw: And
      text: 'with V0 = 0x02, executing 0xB300 sets PC to 0x302 (0x300 + V0)'
    - kw: And
      text: 'a jump to its own address - 0x120C fetched from 0x20C - leaves PC at 0x20C, the idle loop every ROM ends on'
code:
  lang: go
  source: |
    case 0x1000:
      v.pc = op & 0x0FFF // nnn; overwrite PC, do not add the usual 2
      return nil
    case 0xB000:
      v.pc = (op & 0x0FFF) + uint16(v.V[0])
      return nil
checkpoint: 1NNN jumps to a fixed address and BNNN jumps to an address offset by V0. Commit and stop here.
---

**`1NNN`** is the plainest control-flow instruction: "jump to address `NNN`." It sets `PC` directly to `NNN`. The subtlety is that `Fetch` already advanced `PC` by two, and a jump **overwrites** that - it does not add to it. So a program can loop forever by jumping to its own address, which is exactly how CHIP-8 ROMs idle once their work is done. That self-jump is the standard "halt" pattern you will see at the end of the capstone ROM.

**`BNNN`** is the same idea with an offset: "jump to `NNN + V0`." It gives a program a computed jump - a jump table, effectively - by choosing the offset in `V0` first. (This is one of CHIP-8's ambiguous opcodes: some later interpreters read it as `BXNN` and offset by `VX` instead. This project pins the original `BNNN + V0` behaviour, which is what classic ROMs expect.) Both jumps overwrite `PC` outright, so neither adds the usual two.
