---
project: build-a-memory-allocator
lesson: 6
title: Reset - freeing everything at once
overview: A bump allocator cannot free one allocation, but it can free them all at once by rewinding the cursor. Today you add Reset, closing out the bump allocator with the one kind of freeing it supports.
goal: Rewind the cursor to zero so the whole arena is reusable, and confirm the next allocation starts over.
spec:
  scenario: Reset reclaims the whole arena
  status: failing
  lines:
    - kw: Given
      text: 'an arena of 16 bytes where Alloc(8) returned offset 0 and a byte was stored there'
    - kw: When
      text: 'Reset is called'
    - kw: Then
      text: 'Used reports 0'
    - kw: And
      text: 'the next Alloc(8) again returns offset 0'
code:
  lang: go
  source: |
    // the only "free" a bump allocator offers: rewind everything
    func (a *Arena) Reset() { a.cursor = 0 }
    // note: Reset does not need to erase the bytes; the next
    // allocation simply overwrites them
checkpoint: The bump allocator can reclaim all of its memory at once with Reset. Commit and stop here.
---

The bump allocator's great weakness is also its charm: it cannot free a single
allocation, because there is no record of where one ended and the next began - just
the one cursor. What it *can* do is free **everything at once**, by moving the
cursor back to 0. After that the whole arena is available again and the next
allocation restarts from offset 0.

This "free all or nothing" model is exactly why real programs need more: you want
to release one object while keeping its neighbours. Reclaiming individual
allocations is impossible without per-block bookkeeping, and building that
bookkeeping - a header on every block that records its size and whether it is in
use - is the entire next chapter. The bump allocator stays as the honest warm-up:
tiny, fast, and useful whenever you truly can throw everything away together.
