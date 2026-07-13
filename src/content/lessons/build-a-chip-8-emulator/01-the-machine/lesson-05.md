---
project: build-a-chip-8-emulator
lesson: 5
title: The built-in hex font
overview: CHIP-8 ships a built-in font - a 5-byte sprite for each hex digit 0-F - loaded low in memory so programs can draw numbers. Today you load those 80 bytes at 0x50 and read a digit's sprite back.
goal: Load the 16 hex-digit font sprites into memory at 0x50 and read one back.
spec:
  scenario: The font for a digit sits at its known address
  status: failing
  lines:
    - kw: Given
      text: 'a new VM with the font loaded at address 0x50'
    - kw: When
      text: "the five bytes for the digit 0 (starting at 0x50) are read"
    - kw: Then
      text: 'they are 0xF0, 0x90, 0x90, 0x90, 0xF0 (an outlined 0 shape)'
    - kw: And
      text: 'the five bytes for the digit F start at 0x50 + 15*5 = 0x9B and are 0xF0, 0x80, 0xF0, 0x80, 0x80'
code:
  lang: go
  source: |
    const FontStart = 0x50
    // each digit is 5 bytes tall; high nibble of each byte draws the row
    var font = []byte{
      0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
      0x20, 0x60, 0x20, 0x20, 0x70, // 1
      // ... 2..E ...
      0xF0, 0x80, 0xF0, 0x80, 0x80, // F
    }
    // in NewVM: copy(v.mem[FontStart:], font)
checkpoint: The 16 hex-digit font sprites live in low memory and read back correctly. Commit and stop here.
---

Programs often need to show a number, so CHIP-8 bakes a **font** into the machine: one small sprite per hexadecimal digit, `0` through `F`. Each digit is **5 bytes** tall, and only the high nibble of each byte is used - the bits draw the digit as a 4-wide, 5-tall shape. Look at digit `0`: `0xF0` is `1111` (a solid top bar), then three `0x90` rows of `1001` (the two sides), then `0xF0` again (the bottom bar), outlining a zero.

By convention the font loads into the reserved low memory, and the common choice is address **`0x50`** (80). The sixteen digits pack in back to back, so digit `d` starts at `0x50 + d*5`. Load all 80 bytes when the VM is created. Much later the `FX29` opcode will do exactly this arithmetic to point the index register at a digit's sprite, and `DXYN` will draw it - but today just prove the bytes are in the right place.
