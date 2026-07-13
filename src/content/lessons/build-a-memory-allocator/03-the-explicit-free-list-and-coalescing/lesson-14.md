---
project: build-a-memory-allocator
lesson: 14
title: An explicit free list
overview: Walking every block to find a free one is slow. Today you thread a linked list through only the free blocks, storing each block's next-free offset inside its own payload, and maintain that list as blocks are allocated and freed.
goal: Keep a linked list of free blocks, inserting a freed block at the head and unlinking a block when it is allocated.
spec:
  scenario: The free list tracks exactly the free blocks
  status: failing
  lines:
    - kw: Given
      text: 'a fresh allocator over 96 bytes'
    - kw: When
      text: 'Malloc(8) is called twice'
    - kw: Then
      text: 'the free list is [48] - only the trailing remainder block is free'
    - kw: And
      text: 'after Free(8) the free list is [0, 48] (the freed block is inserted at the head), and Blocks is (0, 24, free), (24, 24, allocated), (48, 48, free)'
code:
  lang: go
  source: |
    // a free block stores the offset of the next free block in its
    // payload (the 8 bytes right after the header). freeHead is the
    // first free block, or -1 when the list is empty.
    func (a *Allocator) setNext(off, next int) { putU64(a.buf, off+8, uint64(next+1)) } // +1 so -1 encodes as 0
    func (a *Allocator) next(off int) int      { return int(u64(a.buf, off+8)) - 1 }
    // Free: clear the flag, then push at the head.
    // Malloc: when you take a block, unlink it; insert any split remainder.
checkpoint: The allocator maintains a linked list of free blocks. Commit and stop here.
---

Walking the whole implicit list to find a free block scans allocated blocks too,
which is wasteful when most of the heap is in use. An **explicit free list** links
the free blocks directly: each free block stores the offset of the **next** free
block, and a `freeHead` points at the first. Since a free block's payload is unused
by definition, the pointer lives right there, in the 8 bytes after the header -
which is exactly why the minimum block size reserves 8 payload bytes.

Maintaining the list is the work today. When `Free` releases a block it pushes it
onto the **head** of the list. When `Malloc` claims a block it must **unlink** it,
and when it splits a block the free remainder gets inserted. Keep the address-order
`Blocks` walk for inspection, but the free list is now the real bookkeeping. This
lesson keeps `Malloc` finding blocks by the old walk; next lesson it searches the
list itself. No coalescing yet, so two adjacent frees can both sit in the list.
