---
project: build-a-memory-allocator
lesson: 11
title: First-fit malloc
overview: Now the allocator hands out memory. Malloc walks the blocks, takes the first free one big enough, marks it allocated, and returns its payload offset - and refuses when nothing fits.
goal: Allocate by finding the first free block large enough, marking it used, and returning its payload offset.
spec:
  scenario: Malloc takes the first block that fits, or fails
  status: failing
  lines:
    - kw: Given
      text: 'a fresh allocator over 64 bytes (one free block)'
    - kw: When
      text: 'Malloc(16) is called'
    - kw: Then
      text: 'it marks the whole block allocated and returns payload offset 8 (block start 0 plus the 8-byte header)'
    - kw: And
      text: 'a following Malloc(1) returns an out-of-memory error (no free block remains), and Malloc(100) on a fresh 64-byte heap also errors (request larger than the heap)'
code:
  lang: go
  source: |
    const overhead = 16 // header + footer
    const minBlock = 24 // overhead + at least 8 payload bytes
    func blockSize(payload int) int {
      s := alignUp(payload, 8) + overhead
      if s < minBlock { s = minBlock }
      return s
    }
    // walk blocks; first free one with Size >= blockSize(n): mark it
    // allocated (whole block for now) and return off+8. Else error.
checkpoint: The allocator hands out memory with first-fit search. Commit and stop here.
---

**Malloc** is the heart of the allocator. Given a request for `n` payload bytes, it
computes the block size needed - the payload rounded up to 8, plus the 16-byte
boundary-tag overhead, never smaller than the 24-byte minimum block - then walks
the implicit list looking for the **first free block** big enough. That is the
**first-fit** policy: take the first one that works, do not keep searching for a
better match. It marks that block allocated and returns the **payload offset**,
which is the block start plus the 8-byte header.

For now Malloc claims the *whole* block it finds, even if it is much bigger than
needed - so the first `Malloc` on a fresh heap takes the entire arena, and the next
request has nowhere to go and must error. Pin both no-space cases: filling the heap
then asking for one more byte fails, and a single request larger than the whole
heap fails immediately. Carving the leftover off a too-big block, so one allocation
does not swallow the heap, is the very next lesson.
