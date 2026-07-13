---
project: build-a-game-boy-emulator
lesson: 4
title: The program counter
overview: Today you add the program counter, the register that always points at the next instruction byte to execute. Fetching and advancing PC is the first half of the CPU's heartbeat, and every instruction you add from here on starts by fetching its own opcode this way.
goal: Add a program counter that fetches the next byte from memory and advances.
spec:
  scenario: Fetching one instruction byte
  status: failing
  lines:
    - kw: Given
      text: PC is 0x0100 and memory holds 0xAB at 0x0100 and 0xCD at 0x0101
    - kw: When
      text: one byte is fetched
    - kw: Then
      text: the fetched byte is 0xAB and PC is now 0x0101
    - kw: And
      text: a second fetch returns 0xCD, leaving PC at 0x0102
code:
  lang: go
  source: |
    // the CPU bundles the lesson 1–2 registers with PC and a memory reference
    type CPU struct {
        Registers         // A..L and flags F, embedded from lesson 1
        PC  uint16
        mem *Memory
    }
    // read the byte PC points at, then step PC forward
    func (c *CPU) fetch() uint8 {
        b := c.mem.Read(c.PC)
        c.PC++
        return b
    }
reading: 'The program counter (PC) - where the CPU starts execution (0x0100 after boot).'
checkpoint: The spec now works and the CPU can fetch a byte and advance PC. Commit and stop here.
---

The CPU needs to know which instruction to run next. That job belongs to the
**program counter** (`PC`), a 16-bit register that holds the address of the next
byte to read. To **fetch** is to read the byte at `PC` and then increment `PC`
so it points just past what you took.

This is also where the machine comes together: the `CPU` **owns** the register
file you built on lessons 1–2 (embed it, so `c.A` and `c.F` just work) alongside
`PC` and a reference to memory. Real cartridges begin executing at `0x0100`, so
that is a natural starting value. Fetch is the first half of the CPU's heartbeat
- *fetch, then decode, then execute* - and every instruction you write from here
on begins by fetching its own opcode this way.
