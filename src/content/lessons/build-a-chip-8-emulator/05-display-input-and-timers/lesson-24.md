---
project: build-a-chip-8-emulator
lesson: 24
title: DXYN - draw a sprite
overview: 'This is the instruction that makes CHIP-8 visible - it XORs a sprite onto the screen and reports collisions. Today you implement the core of DXYN: draw N rows from memory at (VX, VY) by XOR, setting VF when a lit pixel is erased.'
goal: Implement DXYN so it XOR-draws an N-row sprite at (VX, VY) and sets VF on collision.
spec:
  scenario: A sprite draws by XOR and flags an erase
  status: failing
  lines:
    - kw: Given
      text: 'I points at a byte 0xFF in memory, V0 = 0 (x), V1 = 0 (y), on a blank screen, about to execute 0xD011 (draw 1 row)'
    - kw: When
      text: 'Step runs it'
    - kw: Then
      text: 'the pixels at columns 0 through 7 of row 0 turn on, and VF is 0 (nothing was erased)'
    - kw: And
      text: 'running the same 0xD011 again XORs those eight pixels back off and sets VF to 1 (a collision - lit pixels were erased)'
code:
  lang: go
  source: |
    case 0xD000:
      x, y, n := byte(op>>8&0x0F), byte(op>>4&0x0F), byte(op&0x0F)
      px, py := int(v.V[x]), int(v.V[y])
      v.V[0xF] = 0
      for row := 0; row < int(n); row++ {
        b := v.mem[v.i+uint16(row)]
        for col := 0; col < 8; col++ {
          if b&(0x80>>col) != 0 { /* XOR this pixel; if it was on, set VF=1 */ }
        }
      }
checkpoint: DXYN draws a sprite by XOR and reports a collision in VF. Commit and stop here.
---

**`DXYN`** is the heart of CHIP-8 graphics. It draws an `N`-row sprite whose bytes live in memory starting at `I`, placing its top-left corner at pixel `(VX, VY)`. Each byte is one row of eight pixels, most-significant bit on the left, and drawing is done by **XOR**: a `1` bit flips the pixel it lands on. XOR drawing is what lets a program erase a sprite by simply drawing it a second time in the same place, which is how CHIP-8 animates.

That same XOR is why the machine needs a **collision flag**. Before drawing, `VF` is cleared to `0`; then, if drawing ever turns an already-lit pixel *off* (a `1` sprite bit meeting a `1` screen pixel), `VF` is set to `1`. Games read `VF` right after a draw to detect that a sprite overlapped something - a ball hitting a paddle, a missile hitting an invader. Today assume the sprite sits fully on screen; the test pins both halves of the behaviour by drawing once (pixels on, `VF = 0`) and again (pixels off, `VF = 1`). Wrapping and clipping at the edges come next.
