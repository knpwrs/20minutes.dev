---
project: build-a-memory-allocator
lesson: 12
title: Splitting a free block
overview: Claiming a whole block for a small request wastes memory. Today Malloc splits an oversized free block, carving off exactly what is needed and leaving the remainder as a smaller free block - unless that remainder would be too small to be a block.
goal: Split a free block on allocation, leaving the leftover as a free block only when it meets the minimum block size.
spec:
  scenario: Malloc splits when the leftover is a usable block
  status: failing
  lines:
    - kw: Given
      text: 'a fresh allocator over 64 bytes'
    - kw: When
      text: 'Malloc(16) is called (needs a 32-byte block)'
    - kw: Then
      text: 'the heap becomes two blocks: (0, 32, allocated) and (32, 32, free)'
    - kw: And
      text: 'on a fresh 64-byte heap Malloc(24) needs a 40-byte block and the leftover is exactly the 24-byte minimum, so it splits into (0, 40, allocated) and (40, 24, free); but Malloc(32) needs 48 and the leftover would be only 16 (below the minimum), so it does not split and takes the whole block (0, 64, allocated)'
code:
  lang: go
  source: |
    // found a free block at off with total Size; need = blockSize(n)
    if size-need >= minBlock {
      a.putBlock(off, need, true)             // allocated part
      a.putBlock(off+need, size-need, false)  // free remainder
    } else {
      a.putBlock(off, size, true)             // take the whole block
    }
    return off + 8
checkpoint: Malloc splits oversized blocks and respects the minimum block size. Commit and stop here.
---

Taking a whole 64-byte block to satisfy a 16-byte request wastes 32 bytes. **Splitting**
fixes that: carve off exactly the block size needed at the front, mark it
allocated, and write a fresh free block in the leftover space. A 16-byte request
needs a 32-byte block, so a 64-byte free block splits into a 32-byte allocated
block and a 32-byte free remainder.

The one subtlety is the **minimum block size**. A block must be at least 24 bytes
(16 overhead plus 8 payload) or it cannot even hold its own tags and a free-list
pointer. So split *only* when the remainder would be a legal block: if the leftover
is exactly 24 it splits, but if it would be 16 you must not - instead give the
caller the whole block (a little internal waste beats an unusable sliver). Pin both
sides of that boundary now; the "exactly the minimum" case is the one that is easy
to get wrong.
