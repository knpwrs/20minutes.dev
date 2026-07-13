---
project: build-a-garbage-collector
lesson: 29
title: A remembered set for generations
overview: Most objects die young, so real collectors often collect only the young generation. That shortcut needs to know which old objects point at young ones. Today you build the remembered set the write barrier feeds, the key to generational collection.
goal: Have the write barrier record old-to-young references into a remembered set.
spec:
  scenario: The barrier remembers old objects that reference young ones
  status: failing
  lines:
    - kw: Given
      text: 'a heap with an old object o = 0 and young objects y1 = 1, y2 = 2 (new objects are young by default; o has been promoted to old)'
    - kw: When
      text: 'Write(o, 0, y1) stores a young object into the old object, then Write(y2, 0, y1) stores young into young'
    - kw: Then
      text: 'the remembered set is exactly [0] - only the old-to-young write is recorded, and the young-to-young write adds nothing'
    - kw: And
      text: 'storing the nil reference, or storing into a field where the value is also old, records nothing'
code:
  lang: go
  source: |
    // young = 0 (default), old = 1; Promote makes an object old
    func (h *Heap) Write(obj Ref, i int, val Ref) {
      h.slots[obj].fields[i] = val
      // ... the marking barrier from last lesson ...
      if val != Nil && h.gen[obj] == old && h.gen[val] == young {
        h.remembered[obj] = true // an old object now points into the young gen
      }
    }
    func (h *Heap) Remembered() []Ref { /* keys of h.remembered, sorted */ }
checkpoint: The write barrier records old-to-young references. Commit and stop here.
---

Real programs allocate huge numbers of short-lived objects - iterators, temporaries,
intermediate results - and only a few survive long. **Generational** collection exploits
this: keep a **young** generation and an **old** generation, and collect the young one
often and cheaply while touching the old one rarely. A young collection traces only
young objects, which is fast - but it has a gap. An **old** object may hold a reference
to a young one, and since the trace never scans old objects, it would miss that young
object and wrongly reclaim it.

The **remembered set** closes the gap. Every old-to-young reference is recorded, and a
young collection treats the remembered old objects as extra roots. The write barrier you
built last lesson is the natural place to maintain it - the same hook that watches field
writes records the edge whenever an old object is made to point at a young one. This
lesson builds that recording; a full minor collection (trace roots plus the remembered
set over just the young generation, then promote survivors) is a natural extension left
for the caveats. It is the honest sketch of how production collectors turn this
bookkeeping into speed.
