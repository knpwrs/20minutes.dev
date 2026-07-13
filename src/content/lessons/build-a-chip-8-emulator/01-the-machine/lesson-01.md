---
project: build-a-chip-8-emulator
lesson: 1
title: The 4KB memory
overview: A CHIP-8 machine is mostly one thing - a small block of memory that holds both the program and its data. Today you build that memory and give it a way to read and write a single byte, the foundation every later lesson carves into.
goal: Create a virtual machine with 4096 bytes of memory and read and write one byte of it.
spec:
  scenario: Memory stores and returns a byte
  status: failing
  lines:
    - kw: Given
      text: 'a new VM created with NewVM()'
    - kw: When
      text: 'the byte 0xAB is written to address 0x300 with SetByte and then read back with GetByte'
    - kw: Then
      text: 'the read returns 0xAB'
    - kw: And
      text: 'an untouched address such as 0x301 still reads 0x00, and the total memory size is 4096 bytes'
code:
  lang: go
  source: |
    type VM struct {
      mem [4096]byte // all of CHIP-8's memory, addresses 0x000..0xFFF
    }
    func NewVM() *VM { return &VM{} }
    // named SetByte/GetByte (not Write/ReadByte) to avoid clashing with
    // the io.ByteWriter/io.ByteReader signatures go vet checks for
    func (v *VM) SetByte(addr uint16, b byte) { v.mem[addr] = b }
    func (v *VM) GetByte(addr uint16) byte { return v.mem[addr] }
checkpoint: You have a VM with 4KB of zeroed memory that stores and returns bytes. Commit and stop here.
---

Every CHIP-8 program, and everything it works on, lives inside a single **4096-byte** memory (`0x000` to `0xFFF`). There is no separate disk, no heap, no registers-versus-RAM distinction to worry about yet: just one flat array of bytes that the machine reads instructions from and scribbles data into. Building it first means every later piece - the program counter, sprites, the stack - has somewhere to live.

Keep the interface tiny: write a byte at an address, read a byte back. Addresses are 12-bit values (0 through 4095), so a 16-bit unsigned integer holds one comfortably. Starting fully zeroed matters - a fresh machine is blank, and later lessons will rely on unwritten memory reading as `0x00`.
