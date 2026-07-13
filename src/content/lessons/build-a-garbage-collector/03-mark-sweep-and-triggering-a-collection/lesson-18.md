---
project: build-a-garbage-collector
lesson: 18
title: Reusing reclaimed slots
overview: A collection is only useful if the space it frees can be handed out again. Today you connect the sweep's free list to allocation so New reuses a reclaimed slot instead of only advancing the cursor.
goal: Make New reuse the lowest reclaimed slot before advancing the cursor.
spec:
  scenario: Allocation reuses slots freed by a collection
  status: failing
  lines:
    - kw: Given
      text: 'a heap where a = 0 (rooted), b = 1 (unrooted garbage), c = 2 (rooted) are allocated, then Collect() reclaims [1]'
    - kw: When
      text: 'New(0) is called after the collection'
    - kw: Then
      text: 'it returns 1 - the reclaimed slot is reused - and Live() is back to 3'
    - kw: And
      text: 'with slots 1 and 3 both on the free list, the next two New calls return 1 then 3 (the lowest reclaimed slot first), before the cursor advances again'
code:
  lang: go
  source: |
    func (h *Heap) New(nfields int) (Ref, error) {
      // ... build the fields as before ...
      var r Ref
      if len(h.free) > 0 {
        r = h.popLowestFree() // reuse the smallest reclaimed slot
      } else {
        r = h.next; h.next++  // otherwise take a fresh slot
      }
      h.slots[r] = &object{fields: f}
      return r, nil
    }
checkpoint: Allocation reuses the slots a collection frees. Commit and stop here.
---

Collecting garbage frees slots, but so far `New` only ever advances its cursor - it
never looks back at the holes a sweep punched. Today you close the loop: the sweep
already records each reclaimed slot on a **free list**, so `New` should check that list
first and reuse a slot before advancing the cursor. Now a program can allocate,
collect, and allocate again indefinitely within a fixed heap - which is the entire
promise of automatic memory management.

Reuse the **lowest** reclaimed slot first so allocation stays deterministic and easy
to assert; with slots `1` and `3` free, the next two allocations take `1` then `3`.
The cursor only moves forward once the free list is empty. This is also the mechanism
that makes the next lesson possible: when the cursor reaches the end of the heap, a
collection can refill the free list, and allocation can carry on from there instead of
failing.
