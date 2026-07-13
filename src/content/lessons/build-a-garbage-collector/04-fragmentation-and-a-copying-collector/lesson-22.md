---
project: build-a-garbage-collector
lesson: 22
title: The semispace heap
overview: A copying collector splits the heap into two halves and uses only one at a time. Today you build that semispace heap with bump allocation, the layout that makes compaction possible.
goal: Build a two-space heap that bump-allocates objects into the active half.
spec:
  scenario: A semispace heap bump-allocates into one half
  status: failing
  lines:
    - kw: Given
      text: 'a copying heap created with NewCopyingHeap(4) - two semispaces of 4 slots each, one active'
    - kw: When
      text: 'New(0) is called twice'
    - kw: Then
      text: 'the calls return ids 0 and 1, Live() is 2, and Free() (unused slots in the active space) is 2'
    - kw: And
      text: 'allocation is a pure bump - the next New would return 2 - and only the active half is ever used until a collection'
code:
  lang: go
  source: |
    type CopyingHeap struct {
      cap        int        // slots per semispace
      from, to   []*object  // active space, reserve space
      next       int        // bump cursor into the active space
      roots      map[Ref]bool
    }
    func NewCopyingHeap(cap int) *CopyingHeap {
      return &CopyingHeap{cap: cap, from: make([]*object, cap),
        to: make([]*object, cap), roots: map[Ref]bool{}}
    }
    func (h *CopyingHeap) New(nfields int) (Ref, error) {
      f := make([]Ref, nfields)
      for i := range f { f[i] = Nil }
      r := h.next; h.from[r] = &object{fields: f}; h.next++; return r, nil
    }
    func (h *CopyingHeap) Free() int { return h.cap - h.next }
checkpoint: You have a semispace heap that bump-allocates into one half. Commit and stop here.
---

A **copying collector** divides the heap into two equal halves, called **semispaces**:
**from-space** (the active half, where objects live and allocation happens) and
**to-space** (the reserve half, empty and waiting). Only one half is ever in use at a
time, which is the price of admission - you trade half your memory for the ability to
compact. In return, allocation becomes trivially fast: a **bump** of a cursor through
from-space, exactly like the very first bump allocator, with no free list to consult.

Build the two spaces and allocate by bumping. A `Ref` is again an index, but now an
index into the **active** space. Reuse the same object model - fields that hold Refs,
and a **root set** with the same `AddRoot` and `Roots` methods as the mark-sweep heap
(you will need them once collection starts) - so the graph you build looks identical to
the mark-sweep heap's; only the collection strategy differs. `Free` reports the unused
slots in the active half.
Bumping fills from-space quickly and never reuses a slot; the whole point of the next
lessons is what happens when it fills - the live objects get **copied**, compacted, into
the empty to-space.
