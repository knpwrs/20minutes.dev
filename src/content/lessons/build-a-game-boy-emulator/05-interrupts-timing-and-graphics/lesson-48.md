---
project: build-a-game-boy-emulator
lesson: 48
title: Running a frame
overview: Today you write the main loop that ties every subsystem together, stepping the CPU, PPU, and timer in lockstep off the same shared cycle count for one complete frame. This is the last piece - run it against a real ROM and it produces an actual Game Boy screen.
goal: Build the main loop that steps the CPU, PPU, and timer together for one full frame.
spec:
  scenario: Emulating exactly one frame
  status: failing
  lines:
    - kw: Given
      text: a loaded ROM, with the CPU, PPU, timer, and interrupts all wired together
    - kw: When
      text: the machine runs until LY wraps from 153 back to 0 (one frame, 70224 cycles)
    - kw: Then
      text: the VBlank interrupt was serviced exactly once during the frame (count it with a small counter you bump in the interrupt handler)
    - kw: And
      text: a 160x144 framebuffer is produced and written out as a PGM image
code:
  lang: go
  source: |
    func (gb *GameBoy) RunFrame() [144][160]uint8 {
        for cycles := 0; cycles < 70224; {   // 154 lines * 456 cycles
            gb.cpu.serviceInterrupts()
            n := gb.cpu.Step()       // one instruction
            gb.ppu.Step(n)           // advance display
            gb.timer.Step(n)         // advance timers
            cycles += n
        }
        return gb.ppu.RenderFrame()
    }
    // To prove a VBlank fired exactly once, add a small counter to the CPU and
    // bump it inside serviceInterrupts (lesson 40) whenever it dispatches VBlank;
    // assert it is 1 after a RunFrame.
reading: 'The emulator main loop - driving every subsystem off the CPU cycle count.'
checkpoint: One call now runs a full frame of a real ROM and emits an image. You have built a Game Boy. Commit - the project is complete.
---

This is the lesson everything runs together. The **main loop** is the whole machine
in miniature: service any pending interrupt, step the CPU one instruction, then
advance the PPU and timer by the **exact** cycle count that instruction took, and
repeat until a full frame's worth of cycles (**70,224**) has elapsed. Every
subsystem you built is driven off that one shared clock, which is why cycle
accuracy mattered all along.

Point it at a real ROM, run one frame, and write the framebuffer to a PGM file -
and there is a Game Boy screen, rendered by an emulator you built from a single
8-bit register up through opcodes, the stack, interrupts, and pixels. From here
the road is open: sound, save RAM, more mapper types, cycle-exact PPU timing to
pass the hardware test ROMs. But the machine lives. You built it.
