---
project: build-a-chip-8-emulator
lesson: 7
title: Decoding by nibbles
overview: Every opcode packs its operands into its sixteen bits, and decoding means slicing those bits into named fields. Today you write the pure function that splits an opcode into the x, y, n, nn, and nnn fields every instruction reads.
goal: Decode a 16-bit opcode into its standard fields x, y, n, nn (kk), and nnn.
spec:
  scenario: The opcode splits into its standard fields
  status: failing
  lines:
    - kw: Given
      text: 'the opcode 0xD123'
    - kw: When
      text: 'it is decoded'
    - kw: Then
      text: 'the high nibble is 0xD, x is 0x1, y is 0x2, n is 0x3, nn is 0x23, and nnn is 0x123'
    - kw: And
      text: 'decoding 0xABCD gives x 0xB, y 0xC, n 0xD, nn 0xCD, and nnn 0xBCD'
code:
  lang: go
  source: |
    // opcode bits, high to low: [ high | x | y | n ]  (four nibbles)
    func decode(op uint16) (x, y, n byte, nn byte, nnn uint16) {
      x = byte(op >> 8 & 0x0F)
      y = byte(op >> 4 & 0x0F)
      n = byte(op & 0x0F)
      nn = byte(op & 0x00FF)
      nnn = op & 0x0FFF
      return
    }
checkpoint: An opcode decodes into its x, y, n, nn, and nnn fields. Commit and stop here.
---

CHIP-8's instruction encoding is wonderfully regular. Read an opcode as four **nibbles** (4-bit groups) and the operands always live in the same places. The top nibble usually selects the instruction; the remaining nibbles are the arguments, and different instructions read them at different widths. The five standard fields cover every case: `x` (second nibble) and `y` (third nibble) name registers, `n` (last nibble) is a 4-bit value, `nn` (last byte, also written `kk`) is an 8-bit value, and `nnn` (last three nibbles) is a 12-bit address.

Decoding is pure bit-shifting and masking with no state, which makes it a perfect standalone function to test in isolation. Take `0xD123`: it is the draw instruction, `x` is `1`, `y` is `2`, and `n` is `3` (draw a 3-row sprite). The same sixteen bits, read as `nnn`, give the address `0x123`. Getting these masks exactly right now means every opcode you implement from here just names the field it wants.
