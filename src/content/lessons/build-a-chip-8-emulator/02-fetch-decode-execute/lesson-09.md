---
project: build-a-chip-8-emulator
lesson: 9
title: 6XNN - set a register
overview: The most common instruction in any CHIP-8 program just loads a constant into a register. Today you implement 6XNN, which sets VX to the byte NN, your first opcode that reads its operands.
goal: Implement 6XNN so it sets register VX to the immediate value NN.
spec:
  scenario: 6XNN loads a constant into a register
  status: failing
  lines:
    - kw: Given
      text: 'a VM about to execute 0x6A2F'
    - kw: When
      text: 'Step runs it'
    - kw: Then
      text: 'register VA (register 10) holds 0x2F and PC has advanced to the next instruction'
    - kw: And
      text: 'running 0x60FF next sets V0 to 0xFF, leaving VA unchanged at 0x2F'
code:
  lang: go
  source: |
    // inside Step's switch:
    case 0x6000:
      x := byte(op >> 8 & 0x0F)
      nn := byte(op & 0x00FF)
      v.V[x] = nn
      return nil
checkpoint: 6XNN loads an immediate byte into any register. Commit and stop here.
---

With the cycle loop in place, adding an instruction is now a matter of one `switch` arm. **`6XNN`** is the natural first choice: "set register `VX` to `NN`." It is how a program gets constants into registers before it can do anything with them, and it is the single most common opcode you will see in real ROMs. The high nibble is `6`, `x` picks the register, and `nn` is the byte to store.

There are no flags and no edge cases here - it simply overwrites `VX` with `NN`. That makes it the clean template for the family of register instructions that follows. Because it reads both the `x` and `nn` fields you decoded last lesson, it is also the first place the fetch, decode, and dispatch pieces all work together to produce a visible change in machine state.
