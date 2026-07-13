---
project: build-a-game-boy-emulator
lesson: 3
title: Main memory
overview: Today you build the 64 KB address space the CPU sees as its entire world, from cartridge and RAM to hardware registers. Every future instruction that reads or writes memory ultimately calls the two methods you build here.
goal: Build a 64 KB address space that can be read from and written to at any address.
spec:
  scenario: Reading back a written byte
  status: failing
  lines:
    - kw: Given
      text: a fresh 64 KB memory, all zero
    - kw: When
      text: 0x42 is written to address 0xC000
    - kw: Then
      text: reading address 0xC000 returns 0x42
    - kw: And
      text: reading the untouched address 0xC001 returns 0x00
    - kw: And
      text: the boundary addresses round-trip too - 0x01 written to 0x0000 and 0xFF written to 0xFFFF read back unchanged
code:
  lang: go
  source: |
    // 0x0000..0xFFFF - one byte per address
    type Memory struct{ data [0x10000]uint8 }
    func (m *Memory) Read(addr uint16) uint8  { return m.data[addr] }
    func (m *Memory) Write(addr uint16, v uint8) { m.data[addr] = v }
reading: 'The Game Boy memory map - a 16-bit address space from 0x0000 to 0xFFFF.'
checkpoint: The spec now works and you have a flat 64 KB address space to read and write. Commit and stop here.
---

The CPU sees the whole machine - cartridge, work RAM, video RAM, and hardware
registers - as one flat **address space** of 65,536 bytes, from `0x0000` to
`0xFFFF`. Today it is just a plain array; later lessons will give special regions
special behavior, but every one of them still answers a **read** or a **write**
at some address.

Address `0xC000` is the start of **work RAM**, the CPU's general scratch memory,
which is why it is a safe place to prove the round trip. Keep the interface tiny
- one read, one write - because every instruction that touches memory will go
through exactly these two doors.
