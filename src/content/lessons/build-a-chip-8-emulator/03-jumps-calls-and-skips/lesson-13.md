---
project: build-a-chip-8-emulator
lesson: 13
title: The call stack
overview: Subroutines need somewhere to remember where to return to, and that is the call stack. Today you add the stack and stack pointer to the machine with push and pop, before any opcode uses them.
goal: Add a call stack of 16-bit addresses with push and pop.
spec:
  scenario: The stack remembers addresses in last-in-first-out order
  status: failing
  lines:
    - kw: Given
      text: 'a new VM with an empty stack'
    - kw: When
      text: '0x204 is pushed, then 0x2F0 is pushed, then one value is popped'
    - kw: Then
      text: 'the pop returns 0x2F0 (the most recent push) and the stack pointer shows one entry remaining'
    - kw: And
      text: 'pushing three addresses 0x202, 0x2A0, 0x2F4 in turn makes the stack pointer read 3, and popping returns them in reverse order 0x2F4, 0x2A0, 0x202 (the stack is 16 deep, so subroutines nest at most 16 levels)'
code:
  lang: go
  source: |
    type VM struct {
      // ... existing fields ...
      stack [16]uint16
      sp    byte // number of entries in use; also the index of the next slot
    }
    func (v *VM) push(addr uint16) { v.stack[v.sp] = addr; v.sp++ }
    func (v *VM) pop() uint16 { v.sp--; return v.stack[v.sp] }
checkpoint: The VM has a last-in-first-out call stack with push and pop. Commit and stop here.
---

A subroutine call has to remember where it came from so it can go back, and CHIP-8 keeps those return addresses on a small **call stack** - classically sixteen entries deep, which caps how deeply subroutines can nest. It is a **last-in-first-out** structure: the most recent call returns first. A **stack pointer** (`sp`) tracks how many addresses are stored; pushing writes at the pointer and bumps it up, popping steps it down and reads the slot.

Building the stack as its own lesson, before any opcode touches it, follows the machine's grain: `2NNN` (call) will push and `00EE` (return) will pop, and both are trivial once push and pop already work. Keep the two operations symmetric - a value pushed then popped comes straight back, and two pushes come back in reverse order - and the call and return opcodes in the next two lessons are almost nothing but a push and a pop.
