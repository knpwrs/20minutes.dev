---
project: build-a-memory-allocator
lesson: 27
title: Coalescing across bins
overview: Merging two free blocks makes a bigger block that belongs in a different bin. Today you make coalescing bin-aware, so a merged block is removed from its old bin and filed under its new, larger size class.
goal: Ensure coalescing removes merged neighbours from their bins and files the result under its new size class.
spec:
  scenario: A merged block moves to the bin for its new size
  status: failing
  lines:
    - kw: Given
      text: 'a 64-byte heap with two allocated size-32 blocks at offsets 0 and 32 (payloads 8 and 40)'
    - kw: When
      text: 'Free(8) then Free(40) are called'
    - kw: Then
      text: 'after Free(8) the size-32 block at 0 is filed in bin 1; after Free(40) it coalesces with it into a size-64 block'
    - kw: And
      text: 'the merged block is filed in bin 4 (bin(4) is [0]) and bin 1 is now empty - the pre-merge block was pulled from its old bin'
code:
  lang: go
  source: |
    // coalescing already unlinks each free neighbour before merging.
    // the only change: unlink from the neighbour's size-class bin, and
    // insert the merged block by its NEW size:
    a.unlinkFrom(classOf(nsize), nextOff) // successor
    a.unlinkFrom(classOf(psize), prev)    // predecessor
    // ... size grows ...
    a.insertInto(classOf(size), off)      // merged block, new class
checkpoint: Coalescing keeps blocks in the correct size-class bins. Commit and stop here.
---

Coalescing and segregation interact in one specific way: when two free blocks
merge, the result is **larger**, so it belongs in a **different bin** than either
piece did. If you forget this, a merged block ends up filed under a size class that
no longer matches its size, and allocation searching by class will never find it - a
subtle leak.

The fix is small but essential: whenever coalescing pulls a neighbour out to merge
it, remove it from *its* bin (the one matching its old size), and insert the merged
block by its *new* size. Two size-32 blocks (bin 1) that merge become a size-64
block (bin 4), and bin 1 must be left empty. This is the kind of invariant that is
easy to break and hard to notice by eye - which is exactly why the next lesson
builds a checker that verifies every free block sits in the bin it should.
