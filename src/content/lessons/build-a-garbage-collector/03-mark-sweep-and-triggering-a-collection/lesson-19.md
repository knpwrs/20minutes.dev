---
project: build-a-garbage-collector
lesson: 19
title: Allocation triggers a collection
overview: Automatic memory management means the program never asks for a collection - allocation does. Today you make New collect and retry when the heap is full, so garbage is reclaimed exactly when space runs out.
goal: When New finds no free slot, run a collection and retry the allocation.
spec:
  scenario: A full heap collects garbage and the allocation then succeeds
  status: failing
  lines:
    - kw: Given
      text: 'a heap of capacity 2 where a = 0 (unrooted garbage) and b = 1 are allocated and only b is a root, so the cursor is at 2 with an empty free list - the heap is full'
    - kw: When
      text: 'New(0) is called'
    - kw: Then
      text: 'New triggers a collection that reclaims a (slot 0), then retries and returns 0 - the allocation succeeds without growing the heap'
    - kw: And
      text: 'the object now at slot 0 is a fresh object with Live() == 2, and it is not a root until AddRoot is called'
code:
  lang: go
  source: |
    func (h *Heap) New(nfields int) (Ref, error) {
      if len(h.free) == 0 && h.next >= h.Capacity() {
        h.Collect() // heap is full: reclaim garbage and refill the free list
      }
      // ... then allocate from the free list or the cursor as before ...
    }
checkpoint: Allocation collects garbage automatically when the heap is full. Commit and stop here.
---

Up to now a collection only happened when you called `Collect` by hand. Real
collectors do not work that way - the program just keeps allocating, and the collector
runs **when it has to**, precisely when a request finds no room. Today you move the
trigger into `New`: if there is no free slot (the free list is empty and the cursor
has reached the end), run a collection first, then allocate normally. Any garbage
becomes free space, and the request that would have failed now succeeds.

This is the moment the whole machine becomes automatic. The program allocates the
garbage object `a`, drops it, keeps `b` rooted, and later asks for one more object; the
heap is full, so `New` collects, `a`'s slot comes back, and the new object lands there.
Notice the reclaimed object is gone for good - the slot now holds a brand-new object,
not the old `a`. But collection can only help if there is genuinely garbage to reclaim.
The next lesson faces the case where there is not.
