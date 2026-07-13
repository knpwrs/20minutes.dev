---
project: build-a-chip-8-emulator
lesson: 28
title: The delay and sound timers
overview: CHIP-8 keeps time with two registers that count down on their own at 60Hz. Today you add the delay and sound timers and the Tick that decrements them toward zero.
goal: Add delay and sound timers that each decrement by one per tick, clamped at zero.
spec:
  scenario: Both timers count down and stop at zero
  status: failing
  lines:
    - kw: Given
      text: 'a VM with the delay timer set to 2 and the sound timer set to 1'
    - kw: When
      text: 'Tick is called once'
    - kw: Then
      text: 'the delay timer is 1 and the sound timer is 0 (each dropped by one)'
    - kw: And
      text: 'after two more Ticks both are 0 and stay 0 - they never underflow below zero'
    - kw: And
      text: 'timers are decoupled from the CPU clock: with the delay timer at 5, running one Step (executing an opcode) leaves it at 5 - only Tick counts them down, not Step'
code:
  lang: go
  source: |
    type VM struct {
      // ... existing fields ...
      delay, sound byte
    }
    func (v *VM) Tick() {
      if v.delay > 0 { v.delay-- }
      if v.sound > 0 { v.sound-- } // clamp at 0; never wrap to 255
    }
checkpoint: The delay and sound timers count down on Tick and clamp at zero. Commit and stop here.
---

CHIP-8 has two **timers**, each a single byte that automatically counts down at **60Hz** (sixty steps per second) independent of how fast instructions run. The **delay timer** is a general-purpose clock a program reads to pace itself; the **sound timer** makes the machine beep for as long as it is non-zero. Both work the same way: set them to a value, and they tick down to zero on their own.

Model the countdown as a `Tick` the host calls sixty times a second, separate from the instruction `Step`. Each `Tick` subtracts one from any timer that is above zero. The one edge to pin is the floor: a timer at zero must **stay at zero**, not wrap around to `255`, so guard the decrement with a "greater than zero" check.

Keeping `Tick` distinct from `Step` is the whole point: the CPU runs many instructions per frame while the timers advance exactly once per frame, so running a `Step` must leave the timers alone. That decoupling is what makes CHIP-8 timing independent of how fast the interpreter executes. The opcodes that read and set these timers come next.
