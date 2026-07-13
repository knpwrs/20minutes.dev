---
project: build-a-game-boy-emulator
lesson: 2
title: Register pairs
overview: Today you teach the CPU to treat its register pairs - BC, DE, HL, and AF - as single 16-bit values instead of two separate bytes. Every address the CPU touches is 16 bits wide, so these combined views are how you will point at memory for the rest of the project.
goal: Let each register pair (BC, DE, HL, AF) be read and written as a single 16-bit value.
spec:
  scenario: Each register pair combines and splits its two bytes
  status: failing
  lines:
    - kw: Given
      text: B is 0x12 and C is 0x34
    - kw: When
      text: the pair BC is read
    - kw: Then
      text: BC is 0x1234
    - kw: And
      text: for each pair BC, DE, HL, AF - setting it to 0xABCD makes the high register 0xAB and the low 0xCD
code:
  lang: go
  source: |
    // high register is the top byte, low register the bottom byte
    func (r *Registers) BC() uint16 {
        return uint16(r.B)<<8 | uint16(r.C)
    }
    func (r *Registers) SetBC(v uint16) {
        r.B = uint8(v >> 8)
        r.C = uint8(v)
    }
    // DE, HL, and AF follow the identical pattern - a table-driven test covers all four
reading: 'Register pairs - how B/C, D/E, H/L, and A/F combine into 16-bit values.'
checkpoint: The spec now works and BC, DE, HL, and AF can be read and written as 16-bit values. Commit and stop here.
---

Addresses on the Game Boy are 16 bits wide, but the registers are only 8. The
CPU bridges the gap by **pairing** registers: `B` and `C` together form `BC`,
and likewise `DE`, `HL`, and `AF`. The first register of each pair holds the
**high** byte, the second the **low** byte - so `B=0x12`, `C=0x34` reads as
`0x1234`.

`HL` is the workhorse pair used to point at memory, which you will lean on
constantly once instructions start reading and writing RAM. Build the four
combined views now - read and write both directions - and the rest of the CPU
gets a clean 16-bit handle whenever it needs an address.
