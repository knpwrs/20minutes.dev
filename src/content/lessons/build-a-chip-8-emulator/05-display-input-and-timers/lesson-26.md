---
project: build-a-chip-8-emulator
lesson: 26
title: The keypad - EX9E and EXA1
overview: CHIP-8 reads a 16-key hex keypad, and two opcodes branch on whether a key is held. Today you add the keypad state and implement EX9E (skip if pressed) and EXA1 (skip if not pressed).
goal: Add 16-key keypad state and implement EX9E and EXA1 to skip based on a key's state.
spec:
  scenario: The key-skip opcodes read the keypad
  status: failing
  lines:
    - kw: Given
      text: 'V0 holds 0x05 and key 5 is currently held down, about to execute 0xE09E at 0x200 (skip if key in V0 is pressed)'
    - kw: When
      text: 'Step runs it'
    - kw: Then
      text: 'the key is down so PC becomes 0x204 (the next instruction is skipped)'
    - kw: And
      text: 'with key 5 still down, 0xE0A1 (skip if NOT pressed) does not skip (PC = 0x202); and with key 5 released, EX9E does not skip while EXA1 does'
code:
  lang: go
  source: |
    type VM struct {
      // ... existing fields ...
      keys [16]bool // true while a hex key is held
    }
    case 0xE000:
      x := byte(op >> 8 & 0x0F)
      switch op & 0x00FF {
      case 0x9E: if v.keys[v.V[x]] { v.pc += 2 }
      case 0xA1: if !v.keys[v.V[x]] { v.pc += 2 }
      }
      return nil
checkpoint: The keypad state exists and EX9E and EXA1 skip based on a key's state. Commit and stop here.
---

CHIP-8's input is a **16-key hexadecimal keypad**, keys `0` through `F`, each either held or released. Model it as sixteen booleans that the outside world sets and the machine reads. Two opcodes branch on it, and both take the key number from a register: **`EX9E`** skips the next instruction when the key numbered `VX` is currently pressed, and **`EXA1`** skips when it is *not* pressed. They are the input equivalent of the `3XNN` / `4XNN` skip pair.

The skip mechanic is the same one you built for the compare family: a fired skip adds an extra two to `PC`. Note that both share the `0xE` high nibble and are told apart by their low byte (`9E` versus `A1`), so they nest in a sub-switch just like the `8XY_` family. Games poll these constantly - "is the fire key down? if so, skip the jump that would idle" - so getting both polarities right, tested with the key held and released, is what makes a playable ROM respond.
