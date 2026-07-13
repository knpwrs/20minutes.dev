---
project: build-a-garbage-collector
lesson: 20
title: Out of memory
overview: A collection can only free garbage - when every object is live, there is nothing to reclaim. Today you handle that honestly - New returns a clear out-of-memory error instead of panicking - so the collector fails gracefully.
goal: When a triggered collection frees nothing and the heap is still full, return an out-of-memory error.
spec:
  scenario: A full heap of all-live objects reports out of memory
  status: failing
  lines:
    - kw: Given
      text: 'a heap of capacity 2 where a = 0 and b = 1 are both allocated and both rooted, so a collection would reclaim nothing'
    - kw: When
      text: 'New(0) is called'
    - kw: Then
      text: 'New runs a collection, frees nothing, and returns the nil reference (-1) together with a non-nil out-of-memory error - it never panics'
    - kw: And
      text: 'Live() is still 2 and both a and b are untouched'
code:
  lang: go
  source: |
    var ErrOutOfMemory = errors.New("gc: out of memory")

    func (h *Heap) New(nfields int) (Ref, error) {
      if len(h.free) == 0 && h.next >= h.Capacity() {
        h.Collect()
        if len(h.free) == 0 && h.next >= h.Capacity() {
          return Nil, ErrOutOfMemory // collection freed nothing; give up cleanly
        }
      }
      // ... allocate from the free list or the cursor ...
    }
checkpoint: Allocation fails gracefully when memory is truly exhausted. The mark-sweep chapter is complete; commit and stop here.
---

A garbage collector is not magic: it can only reclaim **garbage**. When every object
in a full heap is still reachable, a collection frees nothing, and the allocation
genuinely cannot be satisfied. The honest response is to say so - return a clear
**out-of-memory** error and the nil reference, and leave the heap exactly as it was.
Crucially, do **not** panic or corrupt anything; a caller should be able to check the
error and react.

The check is simple: after the triggered collection, if there is still no free slot,
give up with `ErrOutOfMemory`. This is the boundary case that makes the allocation
path trustworthy - a program can allocate in a loop and know that a failure is
reported, not a crash. That completes the mark-sweep collector: it allocates, reuses
freed slots, collects automatically when full, and fails cleanly when memory is truly
exhausted. The next chapter builds a second, very different collector that not only
reclaims garbage but eliminates the fragmentation this one leaves behind.
