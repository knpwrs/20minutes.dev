---
project: build-a-memory-allocator
lesson: 25
title: Size-class bins
overview: One free list means every allocation scans blocks of every size. Segregated free lists fix that by bucketing free blocks into bins by size class. Today you build the bins and file each freed block into the right one.
goal: Bucket free blocks into size-class bins, filing a freed block into the bin for its size.
spec:
  scenario: Free blocks land in the bin for their size class
  status: failing
  lines:
    - kw: Given
      text: 'size classes mapping block size to a bin: 24 to 0, 32 to 1, 40 to 2, 48 to 3, and 56-or-more to 4'
    - kw: When
      text: 'a fresh 64-byte allocator (one free block of size 64) has Malloc(16) applied'
    - kw: Then
      text: 'classOf reports 0, 1, 2, 3, 4, 4 for sizes 24, 32, 40, 48, 56, 96'
    - kw: And
      text: 'before the Malloc bin 4 holds the size-64 block ([0]); after it, the size-32 remainder is filed in bin 1 ([32]) and bin 4 is empty'
code:
  lang: go
  source: |
    const nbins = 5
    func classOf(size int) int {
      c := (size - minBlock) / 8   // 24->0, 32->1, 40->2, 48->3
      if c >= nbins { c = nbins - 1 } // 56+ share the last bin
      return c
    }
    // replace the single freeHead with bins [nbins]int; insert a freed
    // block into bins[classOf(size)]; unlink from whichever bin holds it
checkpoint: Free blocks are bucketed into size-class bins. Commit and stop here.
---

A single free list forces every search to wade through free blocks of all sizes.
**Segregated free lists** speed this up by keeping several lists, one per **size
class**: small blocks in one bin, larger ones in another. A freed block is filed
into the bin matching its size, so a later request can jump straight to blocks of
roughly the right size instead of scanning everything.

Today is the refactor from one list to an array of bins. Pick a simple class
function - here, block sizes 24, 32, 40, and 48 get their own bins and everything
56 and up shares the last bin - and change insert and unlink to work on
`bins[classOf(size)]` instead of a single head. This changes how free blocks are
organized, so allocation (next lesson) and coalescing (the one after) both have to
learn the new structure. The address-order `Blocks` walk and the boundary tags are
untouched.
