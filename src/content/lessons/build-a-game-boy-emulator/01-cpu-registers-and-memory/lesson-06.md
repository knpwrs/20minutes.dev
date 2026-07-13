---
project: build-a-game-boy-emulator
lesson: 6
title: NOP and the step loop
overview: Today you wire together fetch, decode, and execute into a single step loop, starting with the simplest possible instruction, NOP. This loop is the CPU's heartbeat, and every other opcode you add for the rest of the project is just another case inside it.
goal: Decode and execute opcode 0x00 (NOP) so one CPU step advances PC and reports the cycles it took.
spec:
  scenario: Executing a single NOP
  status: failing
  lines:
    - kw: Given
      text: PC is 0x0100 and memory at 0x0100 holds 0x00
    - kw: When
      text: the CPU executes one step
    - kw: Then
      text: PC is 0x0101
    - kw: And
      text: the step reports 4 cycles taken
code:
  lang: go
  source: |
    // fetch the opcode, decode it, run it, return cycles spent
    func (c *CPU) Step() int {
        op := c.fetch()
        switch op {
        case 0x00: // NOP
            return 4
        }
        return 0
    }
reading: 'Opcode 0x00 is NOP - do nothing for 4 cycles. Machine cycles vs. clock cycles.'
checkpoint: The spec now works and the CPU has a working fetch–decode–execute step. Commit and stop here.
---

Now the pieces connect. A **step** is one full instruction: fetch the opcode
byte at `PC`, decode it to decide what to do, execute it, and report how many
clock **cycles** it consumed. Timing matters because later the graphics and
timer hardware advance in lockstep with the CPU's cycle count.

Start with the simplest possible instruction: **NOP**, opcode `0x00`, which does
nothing and costs 4 cycles. It looks trivial, but it forces the whole machinery
- fetch, a decode `switch`, a cycle return - into place. Every other opcode you
add is just another `case` in this same loop.
