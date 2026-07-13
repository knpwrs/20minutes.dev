---
project: build-a-game-boy-emulator
lesson: 53
title: HALT
overview: A real main loop doesn't busy-spin - it runs HALT to sleep until the next interrupt (usually VBlank) and lets the hardware wake it. Many ROMs execute HALT every single frame, so without it a real program never idles the way it expects. Today you add that park-until-interrupt behavior.
goal: Implement HALT (0x76) - pause execution until an interrupt is pending, then resume.
spec:
  scenario: Halting until an interrupt wakes the CPU
  status: failing
  lines:
    - kw: Given
      text: IME is on, IE bit 0 (VBlank) is enabled, IF is clear, and the next opcode is HALT (0x76)
    - kw: When
      text: the CPU executes HALT and then steps again
    - kw: Then
      text: the CPU is halted - that next step does not fetch or execute an instruction (PC does not advance)
    - kw: And
      text: once IF bit 0 is requested, the CPU un-halts and resumes executing on the following step
code:
  lang: go
  source: |
    // HALT (0x76) stops executing until an interrupt is PENDING - a bit set in
    // BOTH IE and IF. Add a `halted bool`; executing HALT sets it. While halted,
    // Step should burn a few cycles and NOT fetch/execute. Clear `halted` the
    // moment (IE & IF) != 0, so the CPU wakes and (if IME is on) serviceInterrupts
    // dispatches. Watch lesson 48's RunFrame order: it calls serviceInterrupts BEFORE
    // Step, so clear `halted` there too (when a bit is pending) - otherwise the CPU
    // wakes a whole frame late.
reading: 'HALT - the low-power wait real main loops use to sync to VBlank.'
checkpoint: HALT now parks the CPU until an interrupt wakes it - the idle every real frame loop relies on. Commit and stop here.
---

Up to now your CPU never rests: `RunFrame` keeps stepping instructions for the
whole frame. Real programs don't work that way. A typical main loop does its work,
then executes **`HALT`** to stop the CPU until the next interrupt fires - almost
always VBlank, 60 times a second. It is how a game paces itself to the screen
without burning battery on a spin loop.

Model it with a `halted` flag: `HALT` sets it, and while it is set `Step` does
nothing but let cycles pass. The wake condition is a **pending** interrupt - a bit
set in both `IE` and `IF` - at which point you clear the flag and, if `IME` is on,
let `serviceInterrupts` dispatch. Get this right and a real ROM's frame loop
finally behaves as its author intended instead of racing ahead.
