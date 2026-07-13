---
project: build-a-chip-8-emulator
lesson: 3
title: Loading a ROM at 0x200
overview: A CHIP-8 program is a file of raw opcode bytes, and it always loads at address 0x200. Today you copy a ROM's bytes into memory at that address, the first step of actually running one.
goal: Copy a program's bytes into memory starting at address 0x200.
spec:
  scenario: A ROM lands at 0x200 and nowhere else
  status: failing
  lines:
    - kw: Given
      text: 'a new VM and the three-byte ROM [0x12, 0x34, 0x56]'
    - kw: When
      text: 'the ROM is loaded'
    - kw: Then
      text: 'memory at 0x200 is 0x12, 0x201 is 0x34, and 0x202 is 0x56'
    - kw: And
      text: 'memory at 0x1FF (just before the load address) is still 0x00'
code:
  lang: go
  source: |
    const ProgramStart = 0x200
    func (v *VM) Load(rom []byte) {
      // programs live in the upper part of memory, starting at 0x200
      copy(v.mem[ProgramStart:], rom)
    }
checkpoint: The VM loads a ROM into memory at 0x200. Commit and stop here.
---

The first 512 bytes of memory (`0x000` to `0x1FF`) were reserved for the original interpreter itself, so by tradition a CHIP-8 program is loaded at address **`0x200`** and every program assumes it starts there. Loading a ROM is therefore nothing more than copying its bytes into memory beginning at `0x200`; the bytes are already machine code, so no translation is needed.

Pin the boundary: the byte just below the load address, `0x1FF`, must stay untouched - that low region is where the built-in font will live in a couple of lessons, and clobbering it would corrupt the machine. Copying into the slice from `0x200` onward leaves everything below it exactly as it was.
