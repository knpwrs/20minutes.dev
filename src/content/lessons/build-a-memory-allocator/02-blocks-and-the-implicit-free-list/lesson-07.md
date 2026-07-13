---
project: build-a-memory-allocator
lesson: 7
title: The block header
overview: To free individual allocations we need a record on every block saying how big it is and whether it is in use. Today you build that record - a single word that packs a size and an allocated flag together.
goal: Pack a block size and an allocated flag into one integer, and unpack them back out.
spec:
  scenario: A header encodes size and the allocated flag
  status: failing
  lines:
    - kw: Given
      text: 'block sizes that are always multiples of 8, so the low 3 bits are free'
    - kw: When
      text: 'a header is packed and then unpacked'
    - kw: Then
      text: 'pack(24, true) is 25 and pack(32, false) is 32'
    - kw: And
      text: 'sizeOf(25) is 24 with allocated(25) true, while sizeOf(41) is 40 with allocated(41) true and allocated(32) false'
code:
  lang: go
  source: |
    // size is a multiple of 8, so bit 0 is always free - use it as the flag
    func pack(size int, alloc bool) uint64 {
      h := uint64(size)
      // set the low bit when allocated; leave it clear when free
      // (fill in)
      return h
    }
    func sizeOf(h uint64) int   { /* mask off the low 3 bits */ }
    func allocated(h uint64) bool { /* test the low bit */ }
checkpoint: You can pack and unpack a block header. Commit and stop here.
---

Once blocks can be freed and reused, every block needs to carry its own **size**
and whether it is currently **allocated**. The classic trick is to store both in a
single machine word placed just before the block's data. Because we keep every
block size a multiple of 8 (that is what alignment bought us), the low 3 bits of a
size are always zero - free real estate. We stash the allocated flag in bit 0.

So a header is `size | 1` when the block is in use and `size | 0` when it is free.
A size-24 allocated block packs to `25`; reading it back, you mask off the low 3
bits to recover `24` and test bit 0 to recover the flag. Keep this a pure pair of
functions today - no memory involved yet. Next lesson these headers get written
into the arena to actually delimit blocks.
