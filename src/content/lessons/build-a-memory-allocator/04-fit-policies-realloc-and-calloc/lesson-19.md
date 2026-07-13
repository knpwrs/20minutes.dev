---
project: build-a-memory-allocator
lesson: 19
title: First-fit versus best-fit
overview: First-fit takes the first block that works; best-fit hunts for the tightest one. Today you add best-fit as a selectable policy and pin a case where the two pick genuinely different blocks.
goal: Add a best-fit search that picks the smallest adequate free block, and show it choosing differently from first-fit.
spec:
  scenario: The two fit policies pick different blocks
  status: failing
  lines:
    - kw: Given
      text: 'a 112-byte heap after Malloc(24), Malloc(8), Malloc(8), then Free of the first (offset 8) - leaving free blocks (0, 40) and (88, 24) with free list [0, 88]'
    - kw: When
      text: 'Malloc(8) is requested (it needs a 24-byte block) under each policy'
    - kw: Then
      text: 'first-fit takes the head block (size 40) and returns payload offset 8'
    - kw: And
      text: 'best-fit scans the whole list and takes the exact-fit size-24 block, returning payload offset 96 - a different block for the same request'
code:
  lang: go
  source: |
    // first-fit: return the first block that fits (today's search).
    // best-fit: scan the whole free list, keep the smallest Size >= need.
    best, bestSize := -1, math.MaxInt
    for off := a.freeHead; off != -1; off = a.next(off) {
      if size, _ := a.blockAt(off); size >= need && size < bestSize {
        best, bestSize = off, size
      }
    }
checkpoint: The allocator supports both first-fit and best-fit placement. Commit and stop here.
---

Which free block should a request take when several fit? **First-fit** takes the
first adequate block it encounters - fast, but it can chew up a big block for a
small request. **Best-fit** scans the whole free list and takes the **smallest**
block that still fits, leaving larger blocks intact for larger requests, at the
cost of a full scan. Neither wins outright; they trade speed for fragmentation
differently, which is exactly why real allocators pick a policy deliberately.

The difference is real, not cosmetic. With a free list holding a 40-byte block at
the head and a 24-byte block later, a request that needs only 24 bytes goes to the
40-byte block under first-fit (it is first) but to the 24-byte block under best-fit
(it is the tightest). Same request, different block, different resulting layout.
Keep first-fit as the default for the rest of the project; best-fit is the
alternative you can now reach for.
