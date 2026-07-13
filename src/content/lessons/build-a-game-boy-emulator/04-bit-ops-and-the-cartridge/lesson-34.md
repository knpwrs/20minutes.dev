---
project: build-a-game-boy-emulator
lesson: 34
title: Setting and clearing bits
overview: Today you implement SET and RES, the instructions that turn a single bit on or off without disturbing any other bit or flag. Together with yesterday's BIT, they give you full control over individual bits and complete the CB-prefixed instruction table.
goal: Implement SET 1, B and RES 1, B so they change one bit each and touch no flags.
spec:
  scenario: Setting then clearing one bit
  status: failing
  lines:
    - kw: Given
      text: B is 0x00 and the opcode is CB 0xC8
    - kw: When
      text: SET 1, B runs
    - kw: Then
      text: B is 0x02 and no flags changed
    - kw: And
      text: RES 1, B (CB opcode 0x88) on that result returns B to 0x00
    - kw: And
      text: the mask touches exactly one bit - RES 1, B on 0xFF gives 0xFD, leaving every other bit alone
code:
  lang: go
  source: |
    case 0xC8: // SET 1, B
        c.B |= 1 << 1
    case 0x88: // RES 1, B
        c.B &^= 1 << 1
    // neither touches any flag
reading: 'SET and RES - turn a single bit on or off; no flags affected.'
checkpoint: SET and RES now flip individual bits without disturbing flags. Commit and stop here.
---

`SET b, r` turns a single bit **on**; `RES b, r` (reset) turns it **off**. Both
leave every other bit - and every flag - alone. `SET 1, B` OR-s in `1 << 1`;
`RES 1, B` AND-s out the same mask. Together with yesterday's `BIT`, they give you
full read/modify/write control over any individual bit in any register.

These complete the CB table and, with it, the entire instruction set your CPU
needs. Games use `SET`/`RES` to toggle hardware feature bits - turning the LCD or
a sound channel on and off - without disturbing the neighboring bits in the same
register. Now that the processor is complete, the rest of the project turns
outward: the cartridge, then the hardware the CPU talks to.
