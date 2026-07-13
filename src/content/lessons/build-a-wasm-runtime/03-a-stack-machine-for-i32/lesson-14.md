---
project: build-a-wasm-runtime
lesson: 14
title: The interpreter loop
overview: 'The engine runs a function body by reading one opcode at a time and acting on it. Today you build that decode-and-execute loop with its three simplest instructions: end, nop, and unreachable.'
goal: Execute a sequence of instruction bytes, stopping at end, ignoring nop, and trapping on unreachable.
spec:
  scenario: Running the smallest instruction sequences
  status: failing
  lines:
    - kw: Given
      text: the interpreter running over a body's instruction bytes
    - kw: When
      text: each body is executed
    - kw: Then
      text: 'an empty body (just 0B, end) finishes with an empty stack, and 01 0B (nop, end) also finishes with an empty stack'
    - kw: And
      text: 'a body containing 00 (unreachable) stops with a trap before reaching end'
code:
  lang: go
  source: |
    // The core loop: fetch an opcode, dispatch, repeat until end. Later lessons
    // add cases; today only three exist.
    for {
      op := body[pc]; pc++
      switch op {
      case 0x0B: return nil          // end: done
      case 0x01:                     // nop: do nothing
      case 0x00: return errUnreachable // unreachable: trap
      default:   return fmt.Errorf("unimplemented opcode 0x%02X at %d", op, pc-1)
      }
    }
checkpoint: You have a decode-and-execute loop you can grow one opcode at a time. Commit and stop here.
---

Here is the heart of the engine: a loop that reads the next **opcode** byte, does what that opcode says, and repeats. This decode-and-execute shape is what every instruction from now on plugs into - each new opcode is a new `case`. Today's three are the frame around all the others. `end` (`0x0B`) marks the end of the instruction sequence and stops the loop. `nop` (`0x01`) does nothing. `unreachable` (`0x00`) is WebAssembly's "this should never run" instruction: reaching it is a **trap**, a clean runtime error that unwinds execution rather than crashing the host.

The other detail to get right now is the **default** case: an opcode you have not implemented yet should report itself clearly - `unimplemented opcode 0xNN at <position>` - not silently misbehave. You will lean on that message constantly as you add opcodes, because a body compiled by a real toolchain will hit instructions you have not written yet, and a precise "here is the byte and where it was" turns a mystery into a one-line fix.
