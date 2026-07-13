---
project: build-a-game-boy-emulator
lesson: 54
title: Booting a real ROM
overview: You now have every piece a startup sequence needs. Today is the finish line - add RETI (the one instruction a real interrupt handler returns with), assemble a boot-and-main-loop program (enable the VBlank interrupt, turn on IME, then HALT and wait), run it through RunFrame, and watch your emulator pace itself to the screen exactly like a cartridge.
goal: Add RETI, then run a boot-style program through RunFrame and confirm it settles into a HALT-and-wait-for-VBlank main loop, serviced once per frame.
spec:
  scenario: A boot loop that waits on VBlank each frame
  status: failing
  lines:
    - kw: Given
      text: a program that enables the VBlank interrupt (IE bit 0), sets IME on, then loops HALT - with a VBlank handler at 0x0040 that increments a counter and returns with RETI (0xD9)
    - kw: When
      text: the emulator runs two frames (RunFrame called twice)
    - kw: Then
      text: the VBlank handler ran exactly once per frame - the counter is 2
    - kw: And
      text: between frames the CPU is parked in HALT, woken only by VBlank - a real game's frame loop
code:
  lang: go
  source: |
    // One new opcode: RETI (0xD9) = RET plus re-enabling IME - how a real handler
    // returns so the NEXT interrupt is still serviced. The rest is assembly: put
    // the boot program in memory (LoadROM, or write the bytes directly), NewGameBoy,
    // then
    // call RunFrame() twice and assert the handler's counter is 2. It exercises
    // HALT (lesson 53), the interrupt path (lessons 39-40), the PPU's VBlank (lesson 41),
    // and the RunFrame loop (lesson 48) all at once - the whole machine in one test.
reading: 'Bringing it together - a boot sequence, a VBlank main loop, and one frame at a time.'
checkpoint: Your emulator boots a real startup sequence and paces itself to VBlank, frame after frame. You built a Game Boy - commit, and see the "Scope & extensions" notes for where to take it next.
---

Every earlier lesson added one capability. Today adds just one - `RETI`, the
interrupt return (`RET` that also switches interrupts back on) - and otherwise
assembles what you built into the shape a real cartridge runs: enable the VBlank
interrupt, switch
on `IME`, and drop into a `HALT` loop; each frame the PPU raises VBlank, the CPU
wakes, services the handler, and parks again. That handshake - HALT, interrupt,
service, HALT - is the heartbeat of nearly every Game Boy program.

Run it through `RunFrame` and the counter climbing once per frame is your proof
that the CPU, memory, interrupts, timer, and PPU all cooperate. This is a genuine,
runnable core - `go run ./cmd/gbemu` renders a frame, and it boots a real ROM into
its main loop. It is not yet a play-any-cartridge emulator: things like `DAA`, the
full sprite pipeline, and cycle-exact timing are deliberately left as the next
climb, mapped out in the project's "Scope & extensions". But the hard part - a
CPU that runs real code and a screen that draws it - is done, and it is yours.
