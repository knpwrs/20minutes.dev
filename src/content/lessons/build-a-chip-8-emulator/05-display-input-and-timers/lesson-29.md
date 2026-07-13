---
project: build-a-chip-8-emulator
lesson: 29
title: FX07, FX15, FX18 - timer access
overview: Three opcodes connect programs to the timers - one reads the delay timer, two set the timers from a register. Today you wire all three.
goal: Implement FX07 (read delay), FX15 (set delay), and FX18 (set sound).
spec:
  scenario: Programs read and set the timers
  status: failing
  lines:
    - kw: Given
      text: 'V0 holds 0x09'
    - kw: When
      text: '0xF015 runs (set delay = V0), then 0xF107 runs (V1 = delay)'
    - kw: Then
      text: 'the delay timer holds 0x09 and V1 becomes 0x09'
    - kw: And
      text: '0xF018 sets the sound timer to V0 (0x09), leaving the delay timer unchanged'
code:
  lang: go
  source: |
    // in the 0xF000 arm, sub-switch on the low byte:
    case 0x07: v.V[x] = v.delay // read the delay timer into VX
    case 0x15: v.delay = v.V[x] // set the delay timer from VX
    case 0x18: v.sound = v.V[x] // set the sound timer from VX
checkpoint: FX07, FX15, and FX18 read and set the delay and sound timers. Commit and stop here.
---

The timers count down on their own, but a program needs to load and read them, and three `FX` opcodes do exactly that. **`FX15`** sets the delay timer from `VX`; **`FX18`** sets the sound timer from `VX`; **`FX07`** copies the current delay timer back into `VX`. There is no opcode to read the sound timer - a program only ever writes it and lets it beep down - which is why the read side has just one instruction.

Together with the countdown from the last lesson, these give the classic timing loop: a program writes a value with `FX15`, then spins reading it with `FX07` until it hits zero, producing a fixed delay regardless of CPU speed. All three sit in the `0xF` family, told apart by their low byte, alongside the memory opcodes you build in the final chapter. The spec pins a round trip - set the delay to `0x09`, read it straight back - so both directions are verified against the same value.
