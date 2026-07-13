---
project: build-a-garbage-collector
lesson: 28
title: The write barrier
overview: If the program mutates the graph while marking, it can hide a live object from the collector. Today you build a write barrier that catches that mutation and preserves the tri-color invariant.
goal: Intercept a field write during marking and re-grey a white object stored into a black one.
spec:
  scenario: A write barrier preserves the tri-color invariant under mutation
  status: failing
  lines:
    - kw: Given
      text: 'a heap mid-collection (marking in progress) with p = 0 colored Black (already scanned) and w = 1 colored White (a fresh object the mark phase has not reached)'
    - kw: When
      text: 'Write(p, 0, w) stores w into a field of the black object p'
    - kw: Then
      text: 'the barrier re-greys w (Color(1) becomes Gray) so no black object points at a white one, and NoBlackToWhite() is true'
    - kw: And
      text: 'when marking is not in progress, Write(p, 0, w) is a plain store that leaves w White'
code:
  lang: go
  source: |
    // instrumented field write: a plain store, plus a guard while marking
    func (h *Heap) Write(obj Ref, i int, val Ref) {
      h.slots[obj].fields[i] = val
      if h.marking && val != Nil &&
        h.Color(obj) == Black && h.Color(val) == White {
        h.SetColor(val, Gray) // re-grey so the collector will still scan it
      }
    }
checkpoint: A write barrier keeps the invariant intact when the graph is mutated mid-mark. Commit and stop here.
---

Everything so far assumed the graph holds still while the collector runs -
**stop-the-world**. But a collector that wants to run *concurrently* with the program,
or *incrementally* in small steps, faces a hazard: the program can store a reference
into an object the collector has already finished with. Suppose `p` is **black**
(scanned, done) and the program writes a reference to a **white** object `w` into `p`.
Now a black object points at a white one - the tri-color invariant is broken, and the
sweep would wrongly reclaim `w` even though it is now reachable.

A **write barrier** is a small hook on every field write that prevents this. The
Dijkstra-style barrier here re-**greys** the white object as it is stored, putting it
back on the collector's radar so it will be scanned and kept. It only fires while
marking is active and only for the dangerous black-points-to-white case, so its cost is
near zero the rest of the time. This is the single mechanism that makes incremental and
generational collection possible - and the next lesson uses exactly this hook to track
references between generations.
