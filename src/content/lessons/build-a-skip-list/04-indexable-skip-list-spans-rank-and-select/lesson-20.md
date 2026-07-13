---
project: build-a-skip-list
lesson: 20
title: Maintaining spans on insert
overview: Recomputing every span after each insert would throw away the skip list's speed. Today you maintain spans incrementally during insert, using a rank array that records how far the descent had traveled at each level.
goal: Update spans inside insert so a freshly built list has correct spans with no rebuild.
spec:
  scenario: Insert keeps every span correct as it splices
  status: failing
  lines:
    - kw: Given
      text: 'a list built from seed 1 by inserting 3, 7, 1, 9, 5, 2, 8, 4, with spans maintained during each insert (no recompute called)'
    - kw: When
      text: 'the spans are inspected'
    - kw: Then
      text: "node 1's level-2 pointer has span 3 and node 2's level-1 pointer has span 2 - exactly what a full recompute would give"
    - kw: And
      text: 'every level-0 pointer has span 1, and the spans from the head down to any node sum to its position'
code:
  lang: go
  source: |
    // Alongside update[], keep rank[i] = how many level-0 steps the descent
    // had covered when it dropped to level i. Then when splicing the new node:
    //   newNode.span[i]   = update[i].span[i] - (rank[0] - rank[i])
    //   update[i].span[i] = (rank[0] - rank[i]) + 1
    // For levels above the new node's height, the pointer now skips one more:
    //   update[i].span[i]++
    // When raising the list level, the head's new pointers start with span = length.
checkpoint: Insert maintains spans incrementally, no rebuild needed. Commit and stop here.
---

The trick to updating spans without recomputing is to track, during the descent, how
far you have already traveled. Keep a `rank` array beside `update`: `rank[i]` is the
number of level-0 steps covered by the time the descent dropped onto level `i`. Since
`rank[0]` is the new node's level-0 position and `rank[i]` is where the level-`i`
predecessor sits, the difference `rank[0] - rank[i]` tells you how many level-0 steps
lie between that predecessor and the new node.

With that number, splicing sets two spans at each level of the new tower. The new
pointer inherits what its predecessor used to cover, minus the part now on the
predecessor's side: `newNode.span[i] = update[i].span[i] - (rank[0] - rank[i])`. And
the predecessor's pointer, now landing on the new node, gets `(rank[0] - rank[i]) +
1`. Levels **above** the new tower gain one skipped node, so their span just
increments. It is fiddly the first time, but it is the same accounting every indexed
skip list (including Redis) uses, and it keeps insert at expected O(log n) with spans
always exact. A duplicate update still changes nothing, spans included.
