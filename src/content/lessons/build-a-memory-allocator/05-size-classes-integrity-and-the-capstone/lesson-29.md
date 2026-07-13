---
project: build-a-memory-allocator
lesson: 29
title: Catching a double free
overview: Freeing the same block twice is a classic bug that corrupts a real allocator. Ours should refuse it. Today Free checks that the block it is asked to release is actually allocated, and reports an error otherwise.
goal: Reject a free of an already-free block with an error, leaving the heap intact.
spec:
  scenario: A second free of the same block is rejected
  status: failing
  lines:
    - kw: Given
      text: 'a 64-byte heap where Malloc(16) returned offset 8 and Free(8) has already released it (heap is one free block, 0:64:F)'
    - kw: When
      text: 'Free(8) is called a second time'
    - kw: Then
      text: 'it returns an error and does not change the heap (Dump is still 0:64:F)'
    - kw: And
      text: 'Check still reports nil - the heap was not corrupted by the rejected double free'
code:
  lang: go
  source: |
    func (a *Allocator) Free(payload int) error {
      off := payload - 8
      size, alloc := a.blockAt(off)
      if !alloc {
        return fmt.Errorf("double free at %d", payload)
      }
      // ... clear flag, coalesce, insert ...
    }
checkpoint: The allocator rejects double frees without corrupting the heap. Commit and stop here.
---

A **double free** - releasing a block that is already free - is one of the most
damaging bugs in real programs: it typically inserts the same block into the free
list twice, so a later allocation hands the same memory to two owners. Because our
allocator records an allocated flag on every block, it can catch this cheaply: if
the block at the given offset is already free, refuse.

Return an error and change nothing. The heap stays exactly as it was, and the
checker still passes - the whole point is that a misuse is rejected *without*
corrupting anything. This is the first of two guards that turn silent corruption
into a clean error; the next handles offsets that were never valid allocations at
all.
