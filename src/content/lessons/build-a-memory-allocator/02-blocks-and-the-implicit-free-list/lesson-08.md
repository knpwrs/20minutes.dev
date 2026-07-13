---
project: build-a-memory-allocator
lesson: 8
title: Boundary tags
overview: A block records its size at both ends - a header at the front and an identical footer at the back. Today you write these boundary tags into the arena so a block is delimited from both directions, which pays off later when merging free neighbours.
goal: Write a block's header and matching footer into the arena, and read both back.
spec:
  scenario: A block is tagged at both ends
  status: failing
  lines:
    - kw: Given
      text: 'a new allocator over a 64-byte arena'
    - kw: When
      text: 'putBlock(0, 32, true) writes a block of size 32 at offset 0'
    - kw: Then
      text: 'the header at offset 0 decodes to size 32, allocated true'
    - kw: And
      text: 'the footer at offset 24 (block end minus 8) decodes to size 32, allocated true, identical to the header'
code:
  lang: go
  source: |
    type Allocator struct { buf []byte }
    func NewAllocator(size int) *Allocator { return &Allocator{buf: make([]byte, size)} }
    // header at off; footer in the block's last 8 bytes
    func (a *Allocator) putBlock(off, size int, alloc bool) {
      h := pack(size, alloc)
      putU64(a.buf, off, h)              // header
      putU64(a.buf, off+size-8, h)       // footer mirrors it
    }
    // putU64/u64 read and write an 8-byte little-endian word in buf
checkpoint: Blocks carry a header and a matching footer in the arena. Commit and stop here.
---

A header at the front of a block tells you its size, which lets you step *forward*
to the next block. But freeing well also means merging with the free block *before*
you, and for that you need to find where the previous block starts - stepping
backward. The standard solution is a **boundary tag**: write the same size-and-flag
word as a **footer** in the block's last 8 bytes, mirroring the header.

Today the header and footer are just two identical words a fixed distance apart:
for a block of size 32 at offset 0, the header sits at 0 and the footer at
`0 + 32 - 8 = 24`. Every block from here on carries both, so the overhead per block
is 16 bytes (8 header + 8 footer). Writing the footer now, before anything reads
it, keeps the layout uniform; the payoff - reading a previous block's footer to
coalesce backward in constant time - arrives in a couple of lessons.
