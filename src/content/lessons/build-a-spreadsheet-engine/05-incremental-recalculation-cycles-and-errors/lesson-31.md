---
project: build-a-spreadsheet-engine
lesson: 31
title: Detecting a cycle
overview: Two cells that reference each other have no valid evaluation order, and a naive engine would loop forever. Today you detect that - Kahn's algorithm leaves cycle cells unplaced, which is exactly the signal a circular reference exists.
goal: Detect a circular reference by finding cells the topological sort could not place.
spec:
  scenario: A circular reference is detected
  status: failing
  lines:
    - kw: Given
      text: 'a sheet with A1 set to ''=B1'' and B1 set to ''=A1'''
    - kw: When
      text: 'the topological sort runs'
    - kw: Then
      text: 'it reports that not all cells could be ordered - a cycle exists - rather than looping'
    - kw: And
      text: 'A1 and B1 are exactly the cells left unplaced (their in-degrees never reach zero)'
code:
  lang: go
  source: |
    // Kahn places a node only when its in-degree hits 0. In a cycle,
    // every node keeps at least one incoming edge forever, so it is
    // never placed. If the order is shorter than the node count, the
    // leftover nodes are the cycle.
    order := s.topoOrder()
    hasCycle := len(order) < s.nodeCount()
    unplaced := nodesNotIn(order)
checkpoint: The engine detects a circular reference instead of hanging. Commit and stop here.
---

A circular reference - `A1` reads `B1` while `B1` reads `A1` - has **no**
topological order, because there is no cell you could safely evaluate first. The
beautiful thing is that Kahn's algorithm detects this for free. It only places a
node when that node's in-degree reaches `0`, and in a cycle every node always has at
least one incoming edge from another cycle member, so none of them ever reaches
zero. The algorithm simply stops early.

So the test for a cycle is: did the topological order end up **shorter** than the
number of nodes? If so, the cells that never got placed are precisely the ones
tangled in a cycle. This is what stops the engine from hanging: rather than chasing
`A1` to `B1` to `A1` forever, recalculation runs Kahn's algorithm once, notices the
short order, and knows those cells are circular. Detecting the cycle is half the
job; the next lesson decides what value those cells should show.
