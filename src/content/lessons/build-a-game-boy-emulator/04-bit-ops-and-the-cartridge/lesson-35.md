---
project: build-a-game-boy-emulator
lesson: 35
title: The memory map
overview: Today you split the flat memory array into proper address regions - ROM, VRAM, work RAM, echo RAM, OAM, I/O, and high RAM - so reads and writes dispatch to the right backing store. This region-aware routing is what lets video RAM and I/O registers behave differently from plain memory later on.
goal: Route memory reads and writes by address region so echo RAM correctly mirrors work RAM.
spec:
  scenario: Echo RAM mirrors work RAM
  status: failing
  lines:
    - kw: Given
      text: the memory routes by region
    - kw: When
      text: 0x55 is written to work RAM at 0xC000
    - kw: Then
      text: reading echo RAM at 0xE000 also returns 0x55
    - kw: And
      text: a write to 0xE001 is visible when reading 0xC001
code:
  lang: go
  source: |
    // Keep the flat backing array - just translate the address first. Echo RAM
    // (0xE000-0xFDFF) mirrors work RAM, so fold it down before indexing:
    func (m *Memory) resolve(addr uint16) uint16 {
        if addr >= 0xE000 && addr < 0xFE00 {
            return addr - 0x2000 // echo RAM -> work RAM
        }
        return addr
    }
    // Read/Write then index m.data[m.resolve(addr)]; every region keeps working.
reading: 'The Game Boy memory map - ROM, VRAM, WRAM, echo, OAM, I/O, and HRAM regions.'
checkpoint: Reads and writes now dispatch to the right region. Commit and stop here.
---

The flat array from lesson 3 got you this far, but the real address space is
**divided into regions**, each with its own behavior: cartridge ROM at
`0x0000`–`0x7FFF`, video RAM at `0x8000`, work RAM at `0xC000`, sprite memory
(OAM) at `0xFE00`, I/O registers at `0xFF00`, and high RAM at `0xFF80`. Reads and
writes should **dispatch by address** to the right backing store. (Keep the ROM
region plain and writable for now - it stays a normal store until bank switching
on lesson 37 turns writes there into control signals. A single flat backing array
with an address-translation `switch` is a fine minimal implementation.)

The quirky one to prove today is **echo RAM**: addresses `0xE000`–`0xFDFF`
transparently mirror work RAM at `0xC000`, a hardware accident that games
occasionally rely on. Routing it correctly forces your read/write functions into
a region `switch`, which is exactly the structure you need so that, next, video
RAM and I/O registers can behave differently from plain memory.
