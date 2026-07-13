---
project: build-a-memory-allocator
lesson: 23
title: Calloc that zeroes
overview: Calloc allocates like malloc but hands back zeroed memory. Because freed blocks keep their old bytes, this matters - a reused block can be full of stale data, and calloc must scrub it.
goal: Allocate and zero a block's payload, even when it reuses dirty memory.
spec:
  scenario: Calloc returns zeroed memory over a dirty block
  status: failing
  lines:
    - kw: Given
      text: 'a 64-byte heap where Malloc(16) gave offset 8, the bytes 0xFF were written at offsets 8 and 9, then the block was freed (coalescing the heap back to one free block)'
    - kw: When
      text: 'Calloc(16) is called'
    - kw: Then
      text: 'it returns offset 8 (reusing that space) and the payload is zeroed: the bytes at offsets 8 and 9 are 0x00'
    - kw: And
      text: 'the returned offset behaves exactly like a Malloc result (it can be freed and reused)'
code:
  lang: go
  source: |
    func (a *Allocator) Calloc(n int) (int, error) {
      payload, err := a.Malloc(n)
      if err != nil { return -1, err }
      // scrub the requested bytes - reused memory is dirty
      for i := 0; i < n; i++ { a.buf[payload+i] = 0 }
      return payload, nil
    }
checkpoint: Calloc allocates zeroed memory. Commit and stop here.
---

`Free` does not erase a block's bytes - it only flips the allocated flag - so the
space handed back still holds whatever was written there. That is fine for `Malloc`,
whose callers are expected to initialize what they take, but it means a reused block
is full of **stale data**. **Calloc** exists for callers who need a clean slate: it
allocates exactly like malloc, then zeroes the payload before returning.

The test makes the staleness visible: write `0xFF` into a block, free it so the
space returns to the pool, then `Calloc` the same size and watch those bytes come
back as `0x00`. Real `calloc` also multiplies a count by an element size (and guards
that multiply against overflow); here the single-size version is enough to show the
zeroing guarantee, which is the part that actually matters for correctness.
