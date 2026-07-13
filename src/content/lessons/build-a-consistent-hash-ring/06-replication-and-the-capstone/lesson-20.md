---
project: build-a-consistent-hash-ring
lesson: 20
title: Replica set edges
overview: A replica set has two boundaries worth pinning. Asking for one copy is just ordinary ownership, and asking for more copies than there are nodes can only give you every node. Today you nail both ends so Replicas never loops forever or invents a node.
goal: Handle R=1 and R at or above the node count correctly.
spec:
  scenario: Replica counts at the boundaries behave sanely
  status: failing
  lines:
    - kw: Given
      text: 'a ring with alpha (28075), beta (58567), gamma (5130), delta (31777)'
    - kw: When
      text: 'Replicas is called for apple with counts 1, 4, and 5'
    - kw: Then
      text: 'Replicas("apple", 1) returns [alpha] - identical to Get - and Replicas("apple", 4) returns all four nodes [alpha, delta, beta, gamma]'
    - kw: And
      text: 'Replicas("apple", 5) also returns exactly those four nodes - asking for more copies than nodes returns every node once, never a duplicate or a hang'
code:
  lang: go
  source: |
    // The distinct-collection loop already caps itself: stop when you
    // have `count` nodes OR you have visited every position once.
    // R=1 collects just the primary; R>=len(nodes) collects them all.
    // Guard the walk so a full lap ends it even if count is huge.
checkpoint: Replica sets are correct at R=1 and beyond the node count. Commit and stop here.
---

The replica walk has two edges. At `R=1` it collects just the first node clockwise, which
is exactly what `Get` returns - replication with one copy is plain ownership, and the two
functions must agree. That is a good invariant to assert: `Replicas(key, 1)` is always
`[Get(key)]`.

The other edge is asking for more copies than the ring can provide. There are only four
distinct nodes, so `R=4` returns all of them and `R=5` can only return those same four -
you cannot store a fifth distinct copy where no fifth node exists. The danger here is a
loop that keeps walking looking for a distinct node it will never find, circling the ring
forever. The fix is the lap guard: stop when you have collected `count` nodes **or** when
you have stepped past every position once. With both edges pinned, `Replicas` is safe for
any count, and the next lesson finally exercises the distinct-node logic on a ring where
it actually bites.
