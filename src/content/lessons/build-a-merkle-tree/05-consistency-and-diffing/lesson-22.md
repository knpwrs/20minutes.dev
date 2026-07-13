---
project: build-a-merkle-tree
lesson: 22
title: Diff finds all and only the changes
overview: The diff walk finds every changed leaf and only the changed ones, skipping identical subtrees entirely. Today you pin that on multi-change and single-subtree cases.
goal: Show the diff reports all changed leaves and never descends into an unchanged subtree.
spec:
  scenario: Diff reports exactly the changed leaves
  status: failing
  lines:
    - kw: Given
      text: 'two trees over ["alice", "bob", "carol", "dave"] and ["alice", "bib", "trent", "dave"]'
    - kw: When
      text: 'Diff walks them'
    - kw: Then
      text: 'it reports [1, 2] - both changed leaves, in order'
    - kw: And
      text: 'diffing against ["alice", "bob", "carol", "davf"] reports [3], having never descended into the unchanged left subtree'
code:
  lang: go
  source: |
    // two changes span both subtrees -> both are entered -> [1, 2]
    // a change only in leaf 3 leaves the left subtree hash equal,
    // so walk(level-1, left) returns immediately: result [3]
checkpoint: Diff reports exactly the changed leaves and prunes every unchanged subtree. Commit and stop here.
---

The diff has two properties worth pinning together. It is **complete** - it finds
every changed leaf, so two edits in different halves (`bob` to `bib` and `carol` to
`trent`) both surface, giving `[1, 2]` in order. And it is **sound and efficient** - it
reports only leaves that actually changed and never wastes time in a subtree it can
prove is identical. When only leaf 3 changes, the left subtree's hash is unchanged, so
the walk returns from that whole branch at the root's left child without ever touching
leaves 0 or 1.

That pruning is the reason Merkle diffs scale: the cost is proportional to the number
of changes times the tree height, not to the dataset size. A million-leaf tree with
one changed leaf is found in about twenty hash comparisons. This is the same mechanism
that lets distributed databases and file-sync tools reconcile huge replicas by
exchanging a few hashes instead of all the data.
