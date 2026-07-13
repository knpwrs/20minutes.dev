---
project: build-a-memory-allocator
lesson: 20
title: Realloc that shrinks in place
overview: Realloc resizes an existing allocation. The easy case is shrinking - keep the same offset and hand the tail back as free. Today you build that case, splitting off the surrendered bytes when they form a usable block.
goal: Shrink an allocation in place, keeping its offset and freeing the leftover tail.
spec:
  scenario: Shrinking keeps the offset and frees the tail
  status: failing
  lines:
    - kw: Given
      text: 'a 96-byte heap where Malloc(40) returned offset 8, giving (0, 56, allocated) and (56, 40, free)'
    - kw: When
      text: 'Realloc(8, 8) is called (shrinking the payload)'
    - kw: Then
      text: 'it keeps offset 8, shrinks the block to size 24, and the freed tail merges with the trailing free block: the heap is (0, 24, allocated) and (24, 72, free)'
    - kw: And
      text: 'reallocating the original 56-byte block to a payload still needing all 56 bytes leaves it unchanged at offset 8 (the leftover would be below the minimum block size)'
code:
  lang: go
  source: |
    func (a *Allocator) Realloc(payload, n int) (int, error) {
      off := payload - 8
      size, _ := a.blockAt(off)
      need := blockSize(n)
      if need <= size {                 // shrinking (or same)
        if size-need >= minBlock {
          a.putBlock(off, need, true)
          a.freeBlock(off+need, size-need) // reuse Free's coalesce+insert
        }
        return payload, nil
      }
      // growing is the next lessons
    }
checkpoint: Realloc can shrink an allocation in place. Commit and stop here.
---

**Realloc** changes the size of an existing allocation while preserving its
contents. When the new size is **smaller**, the block already has room, so the
allocation keeps its exact offset - nothing moves. The only work is handing back the
tail you no longer need: if the surrendered bytes form at least a minimum-size
block, split them off and free them, letting the normal coalescing fold them into
any following free space.

Pin the minimum-block boundary again, because it governs realloc just as it governs
malloc: shrink far enough and the tail becomes its own free block (here it merges
with the trailing free region into one 72-byte block); shrink only a little and the
leftover would be below the minimum, so you leave the block whole and simply return
the same offset. Growing - which sometimes can stay in place and sometimes cannot -
is the next two lessons.
