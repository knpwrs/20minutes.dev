---
project: build-a-memory-allocator
lesson: 17
title: Coalescing backward and both sides
overview: The footer you have been writing all along finally pays off. Today Free reads the previous block's footer to merge backward too, so a block freed between two free neighbours fuses all three into one.
goal: On free, merge with the preceding block using its footer, and handle the case where both neighbours are free.
spec:
  scenario: A freed block merges with free neighbours on either side
  status: failing
  lines:
    - kw: Given
      text: 'a 64-byte heap with blocks (0, 32, free) and (32, 32, allocated), freeing the second block (payload 40)'
    - kw: When
      text: 'Free(40) is called'
    - kw: Then
      text: 'the previous block (read via its footer at offset 24) is free, so they merge into (0, 64, free)'
    - kw: And
      text: 'in a 72-byte heap of three 24-byte blocks where the outer two are already free, freeing the middle block merges all three into (0, 72, free)'
code:
  lang: go
  source: |
    // before inserting, look at the previous block via its footer:
    if off > 0 {
      pfoot := u64(a.buf, off-8)        // previous block's footer
      if !allocated(pfoot) {
        psize := sizeOf(pfoot)
        prev := off - psize
        a.unlink(prev)
        off, size = prev, size+psize    // extend backward
        a.putBlock(off, size, false)
      }
    }
    // combine with the forward-merge from last lesson to handle both sides
checkpoint: Freeing merges with free blocks on both sides. Commit and stop here.
---

Merging backward means finding where the **previous** block starts - and that is
exactly what the footer is for. The word in the 8 bytes just before your block is
the previous block's footer, carrying its size and flag. If that block is free,
subtract its size from your offset to find its start, pull it out of the free list,
and extend your block backward over it. Constant time, no searching - the whole
reason every block carries a footer.

Do the forward merge and the backward merge together and you handle **both**
neighbours at once: a block freed between two free blocks swallows the successor,
then the predecessor, collapsing three blocks into one. With this, the allocator
maintains a clean invariant - no two free blocks are ever adjacent - which keeps
fragmentation in check and is one of the things the heap checker will later verify.
