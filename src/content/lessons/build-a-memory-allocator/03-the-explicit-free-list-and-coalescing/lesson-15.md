---
project: build-a-memory-allocator
lesson: 15
title: Malloc over the free list
overview: Now Malloc searches the free list instead of walking every block. Because freed blocks are pushed at the head, the most recently freed block is found first - so allocation reuses memory in last-in, first-out order.
goal: Make Malloc search the free list head-first, reusing the most recently freed block that fits.
spec:
  scenario: Allocation follows free-list order, not address order
  status: failing
  lines:
    - kw: Given
      text: 'a 96-byte heap carved into four 24-byte blocks at 0, 24, 48, 72, where 0, 24, 48 are allocated and 72 is free'
    - kw: When
      text: 'Free(8) is called (freeing block 0), then Free(56) (freeing block 48), then Malloc(8)'
    - kw: Then
      text: 'the free list before the Malloc is [48, 0, 72] (most recently freed first), and Malloc returns payload offset 56 - the block at 48, taken from the head'
    - kw: And
      text: 'it does not return offset 8 (the lowest-address free block), proving the search follows the free list, not address order'
code:
  lang: go
  source: |
    // walk the free list from freeHead, first block whose Size fits:
    for off := a.freeHead; off != -1; off = a.next(off) {
      size, _ := a.blockAt(off)
      if size >= need {
        a.unlink(off)   // remove from the free list
        // split or take whole, mark allocated, return off+8
      }
    }
checkpoint: Malloc searches only free blocks, reusing them in LIFO order. Commit and stop here.
---

With the free list in place, `Malloc` no longer walks allocated blocks: it starts
at `freeHead` and follows `next` pointers, taking the **first** free block that
fits. Because `Free` pushes onto the head, the block found first is the one freed
most recently - so the allocator reuses memory in **last-in, first-out** order.

That order is observable, and pinning it is today's point. Free the block at offset
0, then the block at offset 48; the list head is now 48. A request that fits in a
24-byte block takes block 48 (payload offset 56), *not* block 0 (payload offset 8),
even though block 0 sits at a lower address. First-fit over the free list is not the
same as first-fit over addresses - the free list's order decides. (Coalescing,
which would merge adjacent frees, is still to come, so both 48 and 72 sit in the
list here.)
