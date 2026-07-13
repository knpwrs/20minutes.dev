---
project: build-a-game-boy-emulator
lesson: 21
title: The high page
overview: Today you implement LDH (n), A, the compact one-byte-addressed load that reaches the 0xFF00 I/O page where every hardware register - video, sound, joypad - lives, bridging the CPU you have built to the hardware you are about to build.
goal: Implement LDH (n), A and the read-direction LDH A, (n) so the CPU can address the 0xFF00 I/O register page with a single immediate byte.
spec:
  scenario: Writing to a high-page register
  status: failing
  lines:
    - kw: Given
      text: A is 0x91 and memory at 0x0100 holds 0xE0, 0x40
    - kw: When
      text: the CPU executes one step
    - kw: Then
      text: memory at 0xFF40 holds 0x91
    - kw: And
      text: PC is 0x0102 and the step reports 12 cycles
    - kw: And
      text: the read direction LDH A, (n) (opcode 0xF0) with n = 0x40 loads that 0x91 from 0xFF40 back into A
code:
  lang: go
  source: |
    case 0xE0: // LDH (n), A  ->  write A to 0xFF00 + n
        n := c.fetch()
        c.mem.Write(0xFF00+uint16(n), c.A)
        return 12
    case 0xF0: // LDH A, (n) - the read direction
reading: 'The high RAM / I/O page at 0xFF00–0xFFFF, reached with a single-byte offset.'
checkpoint: The spec now works and the CPU can reach the 0xFF00 I/O page with a one-byte address. Commit and stop here.
---

The most important 256 bytes on the machine - the hardware **I/O registers** -
all live in the top page, `0xFF00` to `0xFFFF`. Because a full 16-bit address for
every I/O access would be wasteful, the CPU has a shortcut: `LDH (n), A` (opcode
`0xE0`) takes a single immediate byte `n` and writes to `0xFF00 + n`.

So the byte `0x40` reaches `0xFF40`, which is `LCDC` - the LCD control register
you will program the display through. `LDH A, (n)` (`0xF0`) reads back the same
way. This one-byte addressing is how games poke the screen, sound, and joypad,
so it is the bridge between the CPU you have built and the hardware you are about
to build.
