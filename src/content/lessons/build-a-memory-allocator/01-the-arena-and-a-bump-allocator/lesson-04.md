---
project: build-a-memory-allocator
lesson: 4
title: Alignment
overview: Real hardware wants data aligned to word boundaries, so allocators round every allocation up to a fixed alignment. Today you make each offset a multiple of 8, which also rounds odd-sized requests up to the next slot.
goal: Round every allocation so returned offsets are multiples of the alignment (8).
spec:
  scenario: Odd requests round up to the alignment
  status: failing
  lines:
    - kw: Given
      text: 'a fresh arena of 64 bytes and an alignment of 8'
    - kw: When
      text: 'Alloc(1), then Alloc(1), then Alloc(9), then Alloc(1) are called in order'
    - kw: Then
      text: 'they return offsets 0, 8, 16, and 32'
    - kw: And
      text: 'Used reports 40 (each request consumed a whole multiple of 8)'
code:
  lang: go
  source: |
    // round a size up to the next multiple of align (a power of two)
    func alignUp(n, align int) int { return (n + align - 1) &^ (align - 1) }
    // in Alloc, reserve the rounded amount so the cursor stays aligned
    need := alignUp(n, 8)
    // check need against remaining space, then bump by need
checkpoint: Allocations are rounded up so every offset is 8-byte aligned. Commit and stop here.
---

Processors read and write memory fastest when values sit on **aligned**
addresses - a multiple of 8 for a 64-bit word - and some operations require it
outright. So allocators never hand back a raw, unaligned offset; they round each
request up to a fixed **alignment** and reserve that rounded amount. With an
alignment of 8, a 1-byte request still consumes 8 bytes, and the next allocation
lands cleanly on the following multiple of 8.

The rounding trick is `(n + align - 1) &^ (align - 1)`, which clears the low bits
once you have pushed `n` up to or past the next boundary. Watch the edges: a
9-byte request rounds up to 16 (it spans two 8-byte slots), so after `Alloc(1)`,
`Alloc(1)`, `Alloc(9)` the cursor sits at 32 and the next allocation starts there.
This 8-byte alignment carries through the whole project - every block size stays a
multiple of 8, which later lets us stash a flag bit in a size's spare low bits.
