---
project: build-a-memory-allocator
lesson: 10
title: Walking the implicit free list
overview: With every block carrying its size, you can walk the whole heap block by block - no separate list needed. This traversal, the implicit free list, is how the allocator finds space and how you inspect the layout.
goal: Walk the heap from start to end, yielding each block's offset, size, and allocated flag.
spec:
  scenario: Blocks walks the heap in address order
  status: failing
  lines:
    - kw: Given
      text: 'a fresh allocator over 64 bytes'
    - kw: When
      text: 'Blocks is called'
    - kw: Then
      text: 'it returns exactly one block: offset 0, size 64, free'
    - kw: And
      text: 'after manually laying down blocks of size 24 (allocated) at 0 and size 40 (free) at 24, Blocks returns those two in order: (0, 24, allocated) then (24, 40, free)'
code:
  lang: go
  source: |
    type Block struct { Off, Size int; Alloc bool }
    func (a *Allocator) Blocks() []Block {
      var bs []Block
      for off := 0; off < len(a.buf); {
        size, alloc := a.blockAt(off)
        bs = append(bs, Block{off, size, alloc})
        off += size // the header's size is exactly the stride to the next block
      }
      return bs
    }
checkpoint: You can walk the heap block by block. Commit and stop here.
---

Because each block records its own size, you can find the next block by simply
adding that size to the current offset. Starting at 0 and stepping by each block's
size until you reach the end of the arena visits **every** block, allocated and
free alike, in address order. This traversal is called the **implicit free list**:
there is no separate linked structure yet - the sizes themselves thread the heap
together.

`Blocks` is your window into the layout, and you will use it in almost every test
from here on to assert the exact arrangement of the heap. Today it just confirms a
fresh allocator is one free block, and that a hand-placed two-block layout walks in
order. Later the allocator will grow a genuine linked list of *only* the free
blocks for speed, but this address-order walk stays as the way to see and check the
whole heap.
