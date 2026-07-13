---
project: build-a-garbage-collector
lesson: 4
title: The heap census
overview: To reclaim objects the collector must be able to name every live one. Today you build the census - LiveRefs lists the ids of all objects currently in the heap - the exact set a collection starts from and prunes.
goal: List the ids of every live object in the heap, in ascending order.
spec:
  scenario: The heap can enumerate its live objects
  status: failing
  lines:
    - kw: Given
      text: 'a fresh heap where a = New(0), b = New(0), c = New(0) are allocated (ids 0, 1, 2)'
    - kw: When
      text: 'LiveRefs() is queried'
    - kw: Then
      text: 'it returns [0, 1, 2] and Live() returns 3'
    - kw: And
      text: 'if a fourth object is allocated, LiveRefs() returns [0, 1, 2, 3]'
code:
  lang: go
  source: |
    // walk the slot table and collect the index of every occupied slot
    func (h *Heap) LiveRefs() []Ref {
      var live []Ref
      for i, o := range h.slots {
        if o != nil { live = append(live, i) }
      }
      return live // ascending, because we walk slots in order
    }
checkpoint: The heap can enumerate all of its live objects. Commit and stop here.
---

A collection is fundamentally a partition: of all the objects currently alive, some
are still reachable and must be kept, and the rest are garbage to reclaim. To compute
that partition the collector first needs the full set of live objects to work from -
the **census**. `LiveRefs` walks the slot table and returns the id of every occupied
slot, in ascending order so the result is deterministic and easy to assert.

Keep this dead simple today; it is a helper, not an algorithm. Its value shows up
everywhere later: the garbage set is `LiveRefs` minus the reachable set, the sweep
walks `LiveRefs` deciding what to free, and the fragmentation lesson uses it to show
that survivors sit at scattered slots. A collector that cannot list its objects
cannot collect them.
