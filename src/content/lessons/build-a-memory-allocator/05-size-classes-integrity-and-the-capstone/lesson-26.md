---
project: build-a-memory-allocator
lesson: 26
title: Allocating from bins
overview: With free blocks bucketed by size, Malloc can search the right bin first. Today allocation looks in the smallest class that fits and walks up to larger bins only if it must, splitting the remainder back into its own bin.
goal: Make Malloc search size-class bins from the request's class upward, splitting the remainder into its bin.
spec:
  scenario: Allocation draws from the matching size-class bin
  status: failing
  lines:
    - kw: Given
      text: 'a heap whose free blocks are a size-48 block at offset 24 (bin 3) and a size-24 block at offset 96 (bin 0)'
    - kw: When
      text: 'Malloc(8) (needs a 24-byte block, class 0) then Malloc(32) (needs 48, class 3) are called'
    - kw: Then
      text: 'the first draws from bin 0 and returns payload offset 104; the second draws from bin 3 and returns payload offset 32'
    - kw: And
      text: 'when a class bin is empty the search rises to a larger bin: on a 72-byte heap whose only free block is size 48 (bin 3), Malloc(8) splits that block and returns offset 32, filing the size-24 remainder in bin 0'
code:
  lang: go
  source: |
    need := blockSize(n)
    for c := classOf(need); c < nbins; c++ {   // this class, then larger
      for off := a.bins[c]; off != -1; off = a.next(off) {
        if size, _ := a.blockAt(off); size >= need {
          a.unlinkFrom(c, off)
          // split as before; the free remainder goes to its own bin
          return off + 8, nil
        }
      }
    }
    return -1, errors.New("out of memory")
checkpoint: Malloc allocates from size-class bins. Commit and stop here.
---

Allocation now starts in the bin for the requested size and searches **upward**
through larger bins until it finds a block that fits. Because the first bin it
checks holds blocks already close to the right size, the search is short and the
placement is naturally tight - segregated first-fit behaves much like best-fit
without the full scan. When the exact class is empty, rising to a larger bin still
finds space, and the leftover from a split is filed into whichever bin its new size
belongs to.

This is the placement change the earlier fit-policy lesson was building toward: on a
flat list, first-fit and best-fit were distinct searches; with size-class bins, the
bin structure itself steers requests to a good-sized block. The trade is a handful
of bins to maintain in exchange for allocation that no longer scans the whole heap.
One consequence needs care next: coalescing changes a block's size, so a merged
block must move to a different bin.
