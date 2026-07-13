---
project: build-a-game-boy-emulator
lesson: 36
title: Loading a cartridge
overview: Today you load a real cartridge ROM into memory and parse its header, pulling out the game title and cartridge-type byte. This is how an emulator learns which game it's running and what hardware - like a memory-bank controller - it needs to emulate.
goal: Load a ROM image into the low address space and read its header fields.
spec:
  scenario: Reading the cartridge header
  status: failing
  lines:
    - kw: Given
      text: a 32 KB ROM whose bytes at 0x0134 spell "TETRIS" and whose byte at 0x0147 is 0x00
    - kw: When
      text: the ROM is loaded into memory
    - kw: Then
      text: reading address 0x0134 returns the ASCII 'T' (0x54)
    - kw: And
      text: the cartridge-type byte read from 0x0147 is 0x00 (ROM only)
code:
  lang: go
  source: |
    // Keep the WHOLE cartridge in a rom field (banks past the first live there,
    // ready for tomorrow's bank switching), and copy the low, directly-runnable
    // region into the flat backing array from prior lessons.
    func (m *Memory) LoadROM(rom []byte) {
        m.rom = rom                 // add a `rom []byte` field to Memory
        copy(m.data[0x0000:], rom)  // 0x0000..0x7FFF is executable straight away
    }
    title := m.rom[0x0134:0x0143]   // up to 16 ASCII bytes
    cartType := m.rom[0x0147]
reading: 'The cartridge header - title at 0x0134, cartridge type at 0x0147, ROM size at 0x0148.'
checkpoint: A ROM image now loads and its header parses correctly. Commit and stop here.
---

A game lives in a **cartridge ROM**, and loading it is simply copying its bytes
into the `0x0000`–`0x7FFF` region so the CPU can fetch from them. Every cartridge
begins with a fixed **header** in that space: the game **title** as ASCII at
`0x0134`, a **cartridge-type** byte at `0x0147` that says which memory-bank
controller (if any) it uses, and the ROM size at `0x0148`.

Type `0x00` means "ROM only" - a plain 32 KB game like Tetris with no banking,
which fits entirely in the address space at once. Reading the header is how a
real emulator decides what hardware to emulate for this specific game. Prove you
can load an image and pull `'T'` out of the title, and you are ready for the one
feature bigger games need: bank switching.
