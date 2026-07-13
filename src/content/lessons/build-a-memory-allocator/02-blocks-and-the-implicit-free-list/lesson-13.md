---
project: build-a-memory-allocator
lesson: 13
title: Freeing a block
overview: Freeing is the whole reason for block headers. Today Free clears a block's allocated flag so the space can be handed out again - and a later Malloc reuses it. Adjacent free blocks are not merged yet; that is the next chapter.
goal: Free an allocated block by clearing its flag, and confirm the space is reused by a later allocation.
spec:
  scenario: A freed block becomes available again
  status: failing
  lines:
    - kw: Given
      text: 'a 64-byte heap where Malloc(16) returned payload offset 8, giving blocks (0, 32, allocated) and (32, 32, free)'
    - kw: When
      text: 'Free(8) is called'
    - kw: Then
      text: 'the heap is (0, 32, free) and (32, 32, free) - both free, but not yet merged'
    - kw: And
      text: 'a following Malloc(16) reuses the block at 0 and returns payload offset 8 again'
code:
  lang: go
  source: |
    func (a *Allocator) Free(payload int) error {
      off := payload - 8            // step back over the header
      size, _ := a.blockAt(off)
      a.putBlock(off, size, false)  // clear the allocated flag
      return nil
    }
    // no merging of neighbours yet - two adjacent free blocks stay separate
checkpoint: Blocks can be freed and their space reused. Commit and stop here.
---

To **free** a block, take the payload offset the caller was given, step back 8
bytes to the header, and rewrite the block's boundary tags with the allocated flag
cleared. That is it - the block's bytes are untouched, but the allocator now
considers the space available, and the next `Malloc` that walks the list can find
and reuse it.

Notice today's heap ends with two *adjacent* free blocks that stay separate: freeing
the first block next to an already-free second block does not combine them. That is
a real limitation - a later request bigger than either piece but smaller than their
sum would fail even though the space exists. Merging neighbouring free blocks
(**coalescing**) is what the next chapter is about; first we give the allocator a
proper linked list of free blocks to make all of this fast.
