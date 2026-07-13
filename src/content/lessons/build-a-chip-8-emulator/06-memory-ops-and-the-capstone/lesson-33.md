---
project: build-a-chip-8-emulator
lesson: 33
title: FX55 and FX65 - store and load registers
overview: The last opcodes move a block of registers to and from memory, and they carry a quirk - the index register moves too. Today you implement FX55 (store) and FX65 (load), pinning the I-increment behaviour.
goal: Implement FX55 and FX65 to store and load V0 through VX, incrementing I to I+X+1 afterward.
spec:
  scenario: Bulk store and load, with I advancing
  status: failing
  lines:
    - kw: Given
      text: 'V0 = 0xAA, V1 = 0xBB, V2 = 0xCC, I = 0x300, about to execute 0xF255 (store V0 through V2)'
    - kw: When
      text: 'Step runs it'
    - kw: Then
      text: 'memory at 0x300, 0x301, 0x302 is 0xAA, 0xBB, 0xCC and I has advanced to 0x303 (I + X + 1)'
    - kw: And
      text: 'with those bytes in memory, I reset to 0x300, and V0-V2 cleared, executing 0xF265 (load) restores V0 = 0xAA, V1 = 0xBB, V2 = 0xCC and again leaves I = 0x303'
code:
  lang: go
  source: |
    case 0x55: // store V0..VX to memory[I..]
      for r := byte(0); r <= x; r++ { v.mem[v.i+uint16(r)] = v.V[r] }
      v.i += uint16(x) + 1 // this project pins the original increment
    case 0x65: // load memory[I..] into V0..VX
      for r := byte(0); r <= x; r++ { v.V[r] = v.mem[v.i+uint16(r)] }
      v.i += uint16(x) + 1
checkpoint: FX55 and FX65 move a block of registers to and from memory and advance I. Commit and stop here.
---

The final two opcodes move registers in bulk. **`FX55`** stores registers `V0` through `VX` (inclusive) into memory starting at `I`; **`FX65`** loads them back the same way. Note the range is `0` to `X` inclusive, so `FX255` touches `V0`, `V1`, and `V2` - three registers. This is how a program saves and restores its state, or reads a table of values in one instruction.

The pinned detail is another famous quirk: on the original interpreter, both opcodes **increment `I`** as they go, so afterward `I` equals `I + X + 1` (one past the last byte touched). Later interpreters left `I` unchanged, and this is one of the settings a quirks-aware emulator exposes - but this project commits to the **original increment**, which is what Cowgod's reference and the era's ROMs describe. Store and load form a round trip, so the spec writes three registers out, reads them back into cleared registers, and checks the values *and* that `I` landed on `0x303` both times. With these, every standard CHIP-8 opcode is implemented.
