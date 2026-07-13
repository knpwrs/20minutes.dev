---
project: build-a-consistent-hash-ring
lesson: 21
title: Replicas on a virtual-node ring
overview: Virtual nodes and replication meet here. When a node sits at many positions, the clockwise walk will hit the same physical node twice - and the replica set must skip the repeat to find a genuinely different machine. Today you prove the distinct-node rule earns its keep.
goal: Show the replica walk skips repeat virtual nodes of an already-chosen node.
spec:
  scenario: The replica set skips a node it already chose
  status: failing
  lines:
    - kw: Given
      text: 'a ring with alpha, beta, gamma each added with v=2, sorted [gamma, 1-beta, alpha, 1-alpha, 1-gamma, beta]'
    - kw: When
      text: 'Replicas("onion", 2) is computed - onion sits at 27926, whose successor is alpha at 28075, and the next position clockwise is 1-alpha at 39205 (alpha again)'
    - kw: Then
      text: 'Replicas("onion", 2) returns [alpha, gamma] - the walk skips 1-alpha because alpha is already chosen, and takes the next distinct node'
    - kw: And
      text: 'Replicas("onion", 3) returns [alpha, gamma, beta] and Replicas("onion", 1) returns [alpha]'
code:
  lang: go
  source: |
    // No new code if lesson 19 collected DISTINCT physical nodes:
    // walking onion -> alpha (28075), then 1-alpha (39205) which is
    // alpha again and is skipped, then 1-gamma (53800) -> gamma.
    // If your walk did not dedup, this is where it breaks; fix it here.
checkpoint: Replica sets stay distinct even across a node's virtual positions. Commit and stop here.
---

This is where "distinct nodes" stops being a formality. On a two-replica ring, `alpha`
sits at both 28075 and 39205 (`1-alpha`), and those two positions are neighbors in ring
order. `onion` at 27926 finds `alpha` at 28075 as its primary; stepping clockwise the
very next position is `1-alpha` - `alpha` again. A naive walk would report `[alpha,
alpha]` and you would store both "copies" on the same machine, defeating the whole point
of replication. The distinct-node rule skips that repeat and walks on to `1-gamma`,
resolving to `gamma`, for a real second copy.

If you built `Replicas` to collect distinct physical nodes back in lesson 19, this
lesson passes with no new code - it simply exercises the branch that a one-position ring
never reached. If you took a shortcut and appended a node per position, this is where it
shows, and the fix is to track which physical nodes you have already taken and skip them.
Either way, the replica set is now correct on the kind of ring you would actually run:
many virtual positions, distinct physical copies.
