---
project: build-a-garbage-collector
lesson: 11
title: The garbage set
overview: Reachability tells you what to keep; the collector needs the complement - what to reclaim. Today you build Garbage - the live objects the trace did not reach - the exact set every collection frees.
goal: Compute the set of live objects that are not reachable from any root.
spec:
  scenario: Garbage is every live object outside the reachable set
  status: failing
  lines:
    - kw: Given
      text: 'objects r = 0, c = 1 (reachable via r.field0 = c, r rooted) and two unreferenced objects x = 2, y = 3 (allocated, no roots, no references)'
    - kw: When
      text: 'Garbage() is computed'
    - kw: Then
      text: 'it returns [2, 3] - the live objects not in the reachable set - in ascending order'
    - kw: And
      text: 'Reachable covers {0, 1}, so Garbage and Reachable together account for exactly the live objects [0, 1, 2, 3]'
code:
  lang: go
  source: |
    // garbage = live objects minus the reachable set
    func (h *Heap) Garbage() []Ref {
      reach := h.Reachable()
      var g []Ref
      for _, r := range h.LiveRefs() { // ascending
        if !reach[r] { g = append(g, r) }
      }
      return g
    }
checkpoint: You can compute exactly which live objects are garbage. Commit and stop here.
---

Collection is a partition of the live objects into two groups: the **reachable** ones
to keep and the **garbage** to reclaim. You have the reachable set; the garbage is
simply its complement within the census - every live object the trace did not reach.
`Garbage` computes `LiveRefs` minus `Reachable`, in ascending order for a clean
assertion.

This is the decision a mark-sweep collector acts on: keep the reachable, free the
garbage. Notice the two sets are exhaustive and disjoint - together they are exactly
the live objects, with nothing double-counted and nothing missed. An object is
garbage the instant the last path to it from a root disappears, whether that happened
because a root was removed or a reference was overwritten. Next lesson makes the case
that this trace-based definition catches garbage that reference counting never can.
