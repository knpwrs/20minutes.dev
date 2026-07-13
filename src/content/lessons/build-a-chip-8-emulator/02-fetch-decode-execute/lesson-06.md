---
project: build-a-chip-8-emulator
lesson: 6
title: Fetching an opcode
overview: The processor's heartbeat is fetch - read the next two-byte instruction and step past it. Today you add the program counter and a fetch that reads a big-endian opcode and advances the PC.
goal: Add a program counter starting at 0x200 and fetch a two-byte big-endian opcode, advancing the PC by 2.
spec:
  scenario: Fetch reads two bytes big-endian and advances
  status: failing
  lines:
    - kw: Given
      text: 'a VM whose memory holds 0x12 at 0x200 and 0x34 at 0x201, with PC at its initial value'
    - kw: When
      text: 'Fetch is called once'
    - kw: Then
      text: 'it returns the opcode 0x1234 (high byte first) and PC is now 0x202'
    - kw: And
      text: 'the PC started at 0x200 on a fresh VM'
code:
  lang: go
  source: |
    // PC is a 16-bit register; NewVM initialises it to ProgramStart (0x200)
    func (v *VM) Fetch() uint16 {
      hi := uint16(v.mem[v.pc])
      lo := uint16(v.mem[v.pc+1])
      v.pc += 2
      return hi<<8 | lo // big-endian: first byte is the high byte
    }
checkpoint: The VM fetches a big-endian opcode and advances the program counter. Commit and stop here.
---

An instruction cycle begins by reading the next instruction, and in CHIP-8 every instruction is exactly **two bytes**. A **program counter** (`PC`) holds the address of the next opcode; a fresh machine sets it to `0x200`, where programs load. Fetching reads the byte at `PC` and the byte at `PC+1`, combines them into a 16-bit opcode, and moves `PC` forward by two so the next fetch reads the following instruction.

The order matters: CHIP-8 is **big-endian**, so the byte at the lower address is the *high* byte of the opcode. Two bytes `0x12` then `0x34` form the opcode `0x1234`, not `0x3412`. Advancing `PC` by two here, in fetch, is deliberate - a jump or skip instruction will later adjust `PC` on top of this, and getting the default advance right now keeps that arithmetic honest.
