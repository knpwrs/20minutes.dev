---
project: build-a-chip-8-emulator
lesson: 15
title: 00EE - return
overview: A return undoes a call - it pops the saved address and resumes there. Today you implement 00EE and prove a full call-and-return round trip lands exactly where it should.
goal: Implement 00EE so it pops the stack into PC, and confirm a call then return round-trips.
spec:
  scenario: Return pops the stack back into PC
  status: failing
  lines:
    - kw: Given
      text: 'a VM that executes 0x2400 at 0x200 (call), then at 0x400 executes 0x00EE (return)'
    - kw: When
      text: 'both instructions have run'
    - kw: Then
      text: 'PC is back at 0x202 (the instruction after the original call) and the stack is empty again'
    - kw: And
      text: 'the stack pointer has returned to 0'
code:
  lang: go
  source: |
    // in the 0x0000 arm, alongside 00E0:
    if op == 0x00EE {
      v.pc = v.pop()
      return nil
    }
checkpoint: 00EE returns from a subroutine and a call-return round trip lands on the next instruction. Commit and stop here.
---

**`00EE`** returns from a subroutine, and it is the mirror image of `2NNN`: pop the top address off the stack and set `PC` to it. Because the call pushed the address of the instruction *after* the call, the return lands exactly there, and execution continues as if the subroutine had been a single step. It shares the `0x0` high nibble with `00E0`, so it lives in the same switch arm, matched on the full opcode.

This lesson is where the stack, call, and return finally close the loop, so the spec tests the **round trip**: call into `0x400`, immediately return, and confirm `PC` is `0x202` with an empty stack. That round trip is the real proof - if either the push address or the pop is off by two, the program counter drifts and a real ROM full of nested subroutine calls would slowly wander into garbage. With this, the machine has full subroutine control flow.
