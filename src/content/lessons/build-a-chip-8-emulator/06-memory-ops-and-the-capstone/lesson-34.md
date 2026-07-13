---
project: build-a-chip-8-emulator
lesson: 34
title: 'Capstone: run a real ROM'
overview: Everything you built comes together to run an actual program. Today you load a small embedded ROM, run its fetch-decode-execute loop to completion, and assert the exact pixels it draws.
goal: Load and run an embedded ROM that draws a font digit, then assert the exact framebuffer.
spec:
  scenario: A real ROM runs and draws a known shape
  status: failing
  lines:
    - kw: Given
      text: 'the 14-byte ROM [0x00,0xE0, 0x60,0x07, 0xF0,0x29, 0x61,0x00, 0x62,0x00, 0xD1,0x25, 0x12,0x0C] loaded at 0x200 (clear; V0=7; I=font(7); V1=0; V2=0; draw 5-row sprite; jump to self)'
    - kw: When
      text: 'the machine Steps until PC settles at the self-jump 0x20C (about 10 cycles)'
    - kw: Then
      text: 'the digit-7 font sprite is drawn at the top-left: row 0 has columns 0,1,2,3 on; row 1 column 3; row 2 column 2; rows 3 and 4 column 1'
    - kw: And
      text: 'VF is 0 (the sprite drew onto a blank screen with no collision) and pixel (0,1) is off'
code:
  lang: go
  source: |
    vm := NewVM()
    vm.Load([]byte{0x00,0xE0, 0x60,0x07, 0xF0,0x29, 0x61,0x00,
                   0x62,0x00, 0xD1,0x25, 0x12,0x0C})
    for i := 0; i < 10; i++ { _ = vm.Step() }
    // now assert the lit pixels of the digit 7 and VF == 0
checkpoint: Your emulator runs a real ROM end to end and draws the exact expected pixels. The project is complete; commit and stop here.
---

This is the moment every lesson was building toward: a program the machine runs on its own. The embedded ROM is real CHIP-8 code - it clears the screen, loads `7` into a register, uses `FX29` to point `I` at the digit-7 font sprite, sets the draw coordinates to the top-left corner, draws the five-row sprite with `DXYN`, and then jumps to itself to idle. Every one of those opcodes is one you implemented, and here they finally run as a sequence, not a single test.

Running it is just calling `Step` in a loop until the program reaches its self-jump and settles - the same fetch-decode-execute cycle, now driving an actual ROM. The framebuffer that results is not eyeballed; it is asserted pixel by pixel, because the whole machine is deterministic. The lit pixels spell out the digit `7`: a top bar across columns 0 through 3, then a diagonal stepping left down the rows. From a blank buffer and a fetch loop, you have built a working CHIP-8 interpreter - load a public-domain ROM into this same machine and it runs. That is a real emulator, and it is yours.
