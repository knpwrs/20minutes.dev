---
project: build-a-chip-8-emulator
lesson: 8
title: The cycle loop and 00E0
overview: Now the machine comes alive - Step fetches, decodes, and dispatches on the top nibble, refusing anything it does not know. Today you wire that loop and give it its first real instruction, 00E0, which clears the screen.
goal: Implement a Step that fetches, decodes, and executes 00E0 (clear), returning an error on an unknown opcode.
spec:
  scenario: Step runs 00E0 and rejects the unknown
  status: failing
  lines:
    - kw: Given
      text: 'a VM with some pixels lit and the opcode 0x00E0 loaded at 0x200'
    - kw: When
      text: 'Step is called once'
    - kw: Then
      text: 'the display is fully cleared, PC has advanced to 0x202, and no error is returned'
    - kw: And
      text: 'a Step on the unknown opcode 0xF0FF returns an error mentioning the opcode 0xF0FF and the address it was at'
code:
  lang: go
  source: |
    func (v *VM) Step() error {
      op := v.Fetch()
      switch op & 0xF000 {
      case 0x0000:
        if op == 0x00E0 { v.ClearDisplay(); return nil }
      // ... other high nibbles land here as you add opcodes ...
      }
      return fmt.Errorf("unimplemented opcode 0x%04X at 0x%03X", op, v.pc-2)
    }
checkpoint: Step drives one fetch-decode-execute cycle, runs 00E0, and errors cleanly on the unknown. Commit and stop here.
---

This is the engine every instruction plugs into. **`Step`** performs one full cycle: fetch the opcode (which advances `PC`), then decide what to do by switching on the **high nibble** (`op & 0xF000`). Most instruction families are chosen by that top nibble alone; a few, like the `0x0` family, need the whole opcode to disambiguate. Today only one instruction exists - `00E0`, "clear the display" - so the switch has a single real arm.

The other half of a good dispatcher is what it does with an opcode it does not recognise: it must **fail loudly**, not silently do nothing and march on. Returning an error that names the exact opcode and the address it came from turns a missing instruction into a clear report instead of a mysterious hang. That `unimplemented opcode 0xXXXX at 0xNNN` message is the safety net the whole emulator leans on as you fill the switch in one arm at a time.
