---
project: build-a-memory-allocator
lesson: 21
title: Realloc that grows in place
overview: Growing an allocation is cheap when the block right after it is free - just absorb it. Today Realloc extends into a following free block when there is room, keeping the same offset and the same data.
goal: Grow an allocation in place by absorbing the following free block when it is large enough.
spec:
  scenario: Growing absorbs a free successor
  status: failing
  lines:
    - kw: Given
      text: 'a 96-byte heap where Malloc(8) returned offset 8, giving (0, 24, allocated) and (24, 72, free), with the byte 0x7E stored at offset 8'
    - kw: When
      text: 'Realloc(8, 24) is called (needs a 40-byte block)'
    - kw: Then
      text: 'the following block is free and big enough, so it grows in place: same offset 8, block now size 40, heap (0, 40, allocated) and (40, 56, free)'
    - kw: And
      text: 'the data is preserved - the byte at offset 8 is still 0x7E'
code:
  lang: go
  source: |
    // growing: look at the next block
    nextOff := off + size
    if nextOff < len(a.buf) {
      if nsize, nalloc := a.blockAt(nextOff); !nalloc && size+nsize >= need {
        a.unlink(nextOff)
        size += nsize            // absorb the successor
        if size-need >= minBlock {
          a.putBlock(off, need, true)
          a.freeBlock(off+need, size-need)
        } else {
          a.putBlock(off, size, true)
        }
        return payload, nil
      }
    }
checkpoint: Realloc can grow an allocation in place when the next block is free. Commit and stop here.
---

When a request grows, the happy path is that the block immediately **after** it is
free and large enough to cover the shortfall. Then realloc can stay put: absorb the
free successor (pull it from the free list, add its size), and the enlarged block
holds the bigger payload at the same offset - no copying, the data never moves. If
the combined block is bigger than needed, split the excess back off as before.

This is the win that makes a growing loop (append, append, append) cheap when the
allocation sits next to free space: each growth just eats a little more of the
neighbour. It only works when the neighbour is free and big enough, though. When it
is not - an allocated block sits right after, or the free block is too small - the
allocation genuinely has to move somewhere it fits. That relocate-and-copy fallback
is the next lesson.
