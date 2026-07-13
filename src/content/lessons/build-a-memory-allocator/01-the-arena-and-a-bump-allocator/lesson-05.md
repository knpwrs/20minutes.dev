---
project: build-a-memory-allocator
lesson: 5
title: Reading and writing bytes
overview: An allocation is useless if you cannot store data in it. Today you add byte-level read and write to the arena, so a returned offset becomes a real place to keep values - and reads of untouched memory come back zero.
goal: Store and retrieve bytes at any offset in the arena, with untouched bytes reading as zero.
spec:
  scenario: Bytes written at an offset can be read back
  status: failing
  lines:
    - kw: Given
      text: 'an arena from which Alloc(4) returned offset 0'
    - kw: When
      text: 'Set(0, 0x41) and Set(1, 0x42) are called'
    - kw: Then
      text: 'Get(0) is 0x41 and Get(1) is 0x42'
    - kw: And
      text: 'Get(2) is 0x00 (an untouched byte reads as zero)'
code:
  lang: go
  source: |
    func (a *Arena) Set(off int, b byte) { a.buf[off] = b }
    func (a *Arena) Get(off int) byte     { return a.buf[off] }
    // the backing slice starts zeroed, so unwritten bytes read as 0
checkpoint: The arena can store and retrieve bytes at any offset. Commit and stop here.
---

An offset is only useful if you can actually keep data there. The arena is a byte
slice, so reading and writing is just indexing into it: `Set(off, b)` stores a
byte and `Get(off)` returns it. Because the backing buffer is created zeroed, any
byte you have not written yet reads back as `0x00` - a property the allocator will
lean on later when it needs to hand out clean, zeroed memory.

This is the last piece that makes the arena a real store: you can allocate a
region and then fill it. From the next chapter on, the allocator itself writes
small bookkeeping records - block headers - into these same bytes, so the read and
write you build today are what the whole block layout is stored in.
