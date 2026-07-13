---
project: build-a-memory-allocator
lesson: 9
title: The heap as one big free block
overview: Before it hands anything out, the allocator initializes its arena as a single free block spanning the whole heap. Today NewAllocator lays down that first block, the raw material every allocation is carved from.
goal: Initialize the arena as one free block covering the entire heap.
spec:
  scenario: A fresh allocator is one free block
  status: failing
  lines:
    - kw: Given
      text: 'a new allocator over a 64-byte arena'
    - kw: When
      text: 'the block at offset 0 is read'
    - kw: Then
      text: 'it decodes to size 64, allocated false (one free block spanning the whole heap)'
    - kw: And
      text: 'a new allocator over 72 bytes reads as one free block of size 72 at offset 0'
code:
  lang: go
  source: |
    func NewAllocator(size int) *Allocator {
      a := &Allocator{buf: make([]byte, size)}
      // the whole arena begins as a single free block
      a.putBlock(0, size, false)
      return a
    }
    // helper to read a block's (size, alloc) from its header at off
    func (a *Allocator) blockAt(off int) (int, bool) { /* decode header */ }
checkpoint: A fresh allocator is a single free block spanning the heap. Commit and stop here.
---

An allocator does not start empty - it starts with **all** of its memory in one
giant free block. Allocating is then a matter of carving pieces off that block
(and later, off the free blocks that carving produces). So `NewAllocator` writes a
single free boundary-tagged block covering offsets `[0, size)`: a header at 0 and a
footer at `size - 8`, both encoding the full size with the allocated flag clear.

Reading the block at offset 0 back gives the whole heap as one free region. This
is the initial state every later operation transforms: `Malloc` will find this
block and split a piece off it, `Free` will hand pieces back, and coalescing will
eventually merge everything back into one block just like this. Keep a note of the
heap's start (0) and end (`size`) - walking between them is the next lesson.
