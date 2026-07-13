---
project: build-a-memory-allocator
lesson: 16
title: Coalescing forward
overview: Freeing next to a free block should not leave two small blocks where one big one belongs. Today Free merges with the free block that follows it, removing that neighbour from the free list and growing the freed block to cover both.
goal: On free, merge with the following block if it is free, updating the free list.
spec:
  scenario: A freed block absorbs a free successor
  status: failing
  lines:
    - kw: Given
      text: 'a 64-byte heap where Malloc(16) gave (0, 32, allocated) and (32, 32, free)'
    - kw: When
      text: 'Free(8) is called'
    - kw: Then
      text: 'the following block at 32 is free, so they merge into one block (0, 64, free), and the free list is [0]'
    - kw: And
      text: 'when instead both blocks are allocated and only the first is freed, no merge happens: the heap is (0, 32, free), (32, 32, allocated)'
code:
  lang: go
  source: |
    // in Free, after clearing the flag, look at the next block:
    nextOff := off + size
    if nextOff < len(a.buf) {
      if nsize, nalloc := a.blockAt(nextOff); !nalloc {
        a.unlink(nextOff)       // pull the successor out of the free list
        size += nsize           // grow to cover both
        a.putBlock(off, size, false)
      }
    }
    // then insert the (possibly grown) block at the head
checkpoint: Freeing merges with a following free block. Commit and stop here.
---

Without merging, a heap slowly shatters into a litter of small free blocks that no
single request can use even when their total is plenty - **external fragmentation**.
**Coalescing** fights it: when you free a block, check the block immediately after
it, and if that one is also free, fuse them into a single larger free block.

Forward coalescing is the easy direction because the next block is trivial to find -
it starts at the current block's offset plus its size. Pull that successor out of
the free list first (it is about to stop being its own block), add its size to the
freed block, rewrite the merged block's boundary tags, and insert the result. Do
not merge across the end of the arena, and do not merge an *allocated* successor -
pin that non-merge case too. Merging with the block *before* you is the next lesson,
and that is where the footer finally earns its keep.
