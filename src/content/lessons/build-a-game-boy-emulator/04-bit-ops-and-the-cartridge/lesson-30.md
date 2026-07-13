---
project: build-a-game-boy-emulator
lesson: 30
title: Rotating through carry
overview: Today you implement RL B, a 9-bit rotate that threads the carry flag through the register - the technique that makes multi-byte shifts possible by carrying a bit from one byte into the next.
goal: Implement RL B so it rotates left through the carry flag, feeding the old carry into bit 0 and the old bit 7 into carry.
spec:
  scenario: Feeding the carry in and out
  status: failing
  lines:
    - kw: Given
      text: B is 0x80, the C flag is clear, and the opcode is CB 0x10
    - kw: When
      text: RL B runs
    - kw: Then
      text: B is 0x00, the Z flag is set, and the C flag is set (old bit 7)
    - kw: And
      text: the N and H flags are cleared
    - kw: And
      text: repeating RL B now makes B 0x01 (the carry rotated back in)
code:
  lang: go
  source: |
    case 0x10: // RL B
        // A 9-bit rotate: carry is the 9th bit. The OLD carry shifts into bit 0
        // and the OLD bit 7 shifts out into carry - that's the difference from
        // RLC. Read the old carry (as 0/1) BEFORE you overwrite B. Then set the
        // flags: C ← the bit that fell out, Z ← the result, and clear BOTH N and H.
reading: 'RL and RR - 9-bit rotates that thread through the carry flag.'
checkpoint: The spec now works and RL rotates B left through the carry flag, with N and H cleared. RR mirrors it in the other direction on the same pattern. Commit and stop here.
---

`RL` and `RR` differ from the "circular" rotates in a subtle but important way:
they rotate **through the carry**. Picture a 9-bit ring - the 8 bits of the
register plus the carry flag. `RL B` (CB opcode `0x10`) shifts everything left:
the old carry slides into bit 0, and the old bit 7 becomes the new carry. The bit
that leaves does not wrap directly back; it takes a lap through `C` first.

This is what makes multi-byte shifts possible. To shift a 16-bit value left, you
`RL` the low byte (capturing its top bit in carry) then `RL` the high byte
(pulling that carry in). The example shows the carry making a full trip: it falls
out of bit 7 into `C`, then a second `RL` pulls it back into bit 0. `RR` does the
same thing rightward.
