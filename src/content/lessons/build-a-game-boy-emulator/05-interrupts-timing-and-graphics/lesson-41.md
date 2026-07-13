---
project: build-a-game-boy-emulator
lesson: 41
title: The scanline counter
overview: Today you build the display's line counter, advancing LY one scanline every 456 cycles and firing the VBlank interrupt the moment the visible lines finish. This clock is what paces every frame the emulator will draw.
goal: Make the PPU advance the LY register through 154 lines and request the VBlank interrupt at line 144.
spec:
  scenario: LY advances and enters VBlank
  status: failing
  lines:
    - kw: Given
      text: the PPU LY register (0xFF44) reads 0 and each scanline takes 456 cycles
    - kw: When
      text: the PPU is advanced by 456 cycles
    - kw: Then
      text: LY reads 1
    - kw: And
      text: when LY advances from 143 to 144, IF bit 0 (VBlank) is requested
code:
  lang: go
  source: |
    // Like the Timer, the PPU is a cycle-budget counter - but it needs a Memory
    // reference so it can raise the VBlank request in IF. Read LY via an accessor
    // for now (as with the timer's DIV); it becomes memory-mapped at 0xFF44 when
    // the PPU is wired into Memory in a later lesson.
    type PPU struct {
        mem *Memory
        ly  uint8
        dot int
    }
    func NewPPU(mem *Memory) *PPU { return &PPU{mem: mem} }
    func (p *PPU) LY() uint8      { return p.ly }

    func (p *PPU) Step(cycles int) {
        p.dot += cycles
        for p.dot >= 456 {           // one scanline elapsed
            p.dot -= 456
            p.ly = (p.ly + 1) % 154  // 154 lines total, then wrap to 0
            if p.ly == 144 {         // just entered VBlank
                p.requestVBlank()    // set IF (0xFF0F) bit 0
            }
        }
    }
reading: 'The PPU timing - 456 cycles per line, 154 lines, VBlank at lines 144–153.'
checkpoint: The display's line counter now advances and fires VBlank. Commit and stop here.
---

The display is drawn one horizontal **scanline** at a time, and the `LY` register
at `0xFF44` reports which line the PPU is on. A line takes **456** cycles; after
the 144 visible lines (0–143) come 10 lines of **VBlank** (144–153), the brief
pause when nothing is drawn - then `LY` wraps back to 0. The whole cycle is
70,224 cycles, about 60 frames a second.

The moment `LY` reaches **144**, the PPU raises the **VBlank interrupt** by
setting `IF` bit 0 - the request your lesson-40 dispatcher will turn into a jump to
`0x0040`. VBlank is sacred: it is the only safe window to update video memory, so
games do almost all their drawing work in that handler. You now have the clock
that paces the screen; next you decode what it actually shows.
