---
project: build-a-consistent-hash-ring
lesson: 11
title: A key exactly on a node
overview: What happens when a key lands on the exact same position as a node? The successor rule uses "at or after," so the node owns its own position. Today you pin that boundary down, the edge that decides whether the search is >= or >.
goal: Confirm a key positioned exactly on a node is owned by that node.
spec:
  scenario: A key on a node position is owned by that node
  status: failing
  lines:
    - kw: Given
      text: 'a ring with alpha (28075), beta (58567), gamma (5130), where a node name hashes to its own position'
    - kw: When
      text: 'Get is called with a key equal to a node name, so the key position equals a node position'
    - kw: Then
      text: 'Get("gamma") returns gamma, Get("alpha") returns alpha, and Get("beta") returns beta'
    - kw: And
      text: 'this holds for the lowest, middle, and highest node positions, confirming the search uses "at or after" (>=), not strictly after'
code:
  lang: go
  source: |
    // The successor search predicate is positions[i] >= kp.
    // When kp exactly equals a node position, that same index is
    // returned, so the node owns its own position - no wrap, no skip.
    // Get("beta") must find beta at the top position, not wrap to gamma.
checkpoint: A key exactly on a node position is owned by that node. Commit and stop here.
---

The successor rule says "first node at or after the key," and the **at** matters. When a
key's position lands exactly on a node's position, that node owns it - the search must
not skip to the next node. The cleanest way to land a key precisely on a node is to look
up a node's own name: `Pos("alpha")` is `alpha`'s position by definition, so
`Get("alpha")` had better return `alpha`.

The three cases cover the boundary everywhere it can occur. `gamma` is the **lowest**
node (5130), `alpha` is in the **middle** (28075), and `beta` is the **highest**
(58567). The highest is the sharp one: if your predicate were strictly greater-than
rather than greater-or-equal, a key on `beta`'s position would find nothing at or after
it, wrap around, and wrongly return `gamma`. Getting all three right confirms the
inclusive `>=` boundary is what makes on-node keys behave.
