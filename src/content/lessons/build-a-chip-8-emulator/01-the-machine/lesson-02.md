---
project: build-a-chip-8-emulator
lesson: 2
title: The V registers
overview: CHIP-8 does its arithmetic in sixteen fast 8-bit registers named V0 through VF. Today you add that register file to the VM and read and write it, the scratchpad every opcode from here on will use.
goal: Add sixteen 8-bit general registers V0-VF to the VM with read and write access.
spec:
  scenario: The register file holds sixteen independent bytes
  status: failing
  lines:
    - kw: Given
      text: 'a new VM'
    - kw: When
      text: '0x2A is written to register 0 (V0) and 0xFF to register 15 (VF)'
    - kw: Then
      text: 'reading V0 returns 0x2A and reading VF returns 0xFF'
    - kw: And
      text: 'all fourteen other registers still read 0x00, and there are exactly sixteen registers'
code:
  lang: go
  source: |
    type VM struct {
      mem [4096]byte
      V   [16]byte // general registers V0..VF; VF doubles as a flag register
    }
    func (v *VM) SetV(x byte, val byte) { v.V[x] = val }
    func (v *VM) GetV(x byte) byte { return v.V[x] }
checkpoint: The VM has sixteen general registers that store and return bytes. Commit and stop here.
---

A CHIP-8 program can not compute directly in memory - it moves values into **registers** first. There are sixteen of them, each one byte wide, named `V0` through `VF` (that is hexadecimal, so `VF` is register 15). Almost every opcode names a register by its single hex digit, which is why there are exactly sixteen.

One of them is special by convention: **`VF` is the flag register**. Later opcodes use it to report a carry, a borrow, or a sprite collision, so a program is not supposed to keep important data there. You do not need any of that flag behaviour today - just build the plain array of sixteen bytes and confirm each one stores and returns a value on its own. The flag semantics arrive when the arithmetic does.
