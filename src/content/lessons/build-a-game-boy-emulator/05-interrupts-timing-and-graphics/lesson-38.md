---
project: build-a-game-boy-emulator
lesson: 38
title: The divider and timer
overview: Today you build the DIV register, the simplest hardware clock, which ticks once every 256 CPU cycles by accumulating the cycle counts your CPU already returns. This cycle-budget pattern is the foundation for the full timer and, later, the display.
goal: Make the DIV register count up once every 256 CPU cycles.
spec:
  scenario: DIV ticks on a cycle budget
  status: failing
  lines:
    - kw: Given
      text: the DIV register (0xFF04) reads 0x00
    - kw: When
      text: the timer is advanced by 256 cycles
    - kw: Then
      text: reading DIV returns 0x01
    - kw: And
      text: advancing 255 more cycles leaves DIV at 0x01 (it only ticks each full 256)
    - kw: And
      text: DIV is a single byte, so after 256 full ticks (65536 cycles from 0) it wraps from 0xFF back to 0x00
code:
  lang: go
  source: |
    func (t *Timer) Step(cycles int) {
        t.divCounter += cycles
        for t.divCounter >= 256 {
            t.divCounter -= 256
            t.div++ // wraps at 0xFF naturally
        }
    }
reading: 'The DIV, TIMA, TMA, and TAC timer registers and their tick rates.'
checkpoint: DIV now increments on a fixed cycle budget. Timer stays a standalone type today - a later lesson wires it into memory and the step loop. Commit and stop here.
---

Hardware keeps time by counting CPU cycles, and the simplest clock is the
**divider** register `DIV` at `0xFF04`, which increments once every **256**
cycles and wraps around at `0xFF`. To drive it, feed the timer the cycle count
each instruction returned - the value your `Step` has been handing back since lesson
6 - and let it accumulate until it crosses a threshold.

The full timer adds `TIMA` (a counter that ticks at a rate chosen by `TAC` and
raises an interrupt when it overflows to `TMA`), but they all share this
cycle-budget pattern. Getting the accumulator right - ticking only on each
*complete* 256-cycle span, not smearing partial progress - is the idea that makes
every time-based feature, from the timer to the display, stay in sync with the
CPU.
