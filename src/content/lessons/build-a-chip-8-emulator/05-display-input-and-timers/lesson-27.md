---
project: build-a-chip-8-emulator
lesson: 27
title: FX0A - wait for a key
overview: Sometimes a program needs to stop and wait for input. FX0A blocks until any key is pressed, then stores which one - and it blocks by simply refusing to advance past itself.
goal: Implement FX0A so it repeats until a key is pressed, then stores the key number in VX.
spec:
  scenario: FX0A parks on itself until a key arrives
  status: failing
  lines:
    - kw: Given
      text: 'no keys are held, about to execute 0xF00A at address 0x200'
    - kw: When
      text: 'Step runs it'
    - kw: Then
      text: 'PC is back to 0x200 (the instruction re-arms itself) and V0 is unchanged - the machine is waiting'
    - kw: And
      text: 'once key 7 is held, running 0xF00A stores 7 into V0 and lets PC advance to 0x202'
code:
  lang: go
  source: |
    // in the 0xF000 arm, sub-switch on the low byte:
    case 0x0A:
      // scan keys 0..F; if one is down, store it in VX and continue.
      // if none is down, undo Fetch's advance so this opcode runs again.
checkpoint: FX0A blocks until a key is pressed and stores the key number in VX. Commit and stop here.
---

**`FX0A`** is a **blocking** input read: execution halts on this instruction until the player presses any key, and the key's number is stored in `VX`. A menu waiting for a selection, or a game paused before it starts, is built on this opcode.

The trick is how a single-step machine "blocks." `FX0A` does not loop internally; instead, each time it runs it checks the keypad, and if no key is down it **undoes the `PC` advance** that `Fetch` performed - leaving `PC` pointing back at the `FX0A` opcode, so the next `Step` fetches it again. The machine spins on this one instruction, cycle after cycle, doing nothing else, until a key finally reads as down; then it stores that key in `VX` and lets `PC` stay advanced so execution moves on. The spec pins both states: with no key held, `PC` returns to the opcode's own address and `VX` is untouched; with a key held, `VX` receives it and `PC` advances.
