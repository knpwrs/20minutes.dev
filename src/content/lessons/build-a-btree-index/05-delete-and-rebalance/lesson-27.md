---
project: build-a-btree-index
lesson: 27
title: Shrinking the tree
overview: When a merge empties the root, the tree gets shorter. Today you collapse a root that has lost its last separator into its single remaining child, the mirror image of growing a new root - and the only way a B+Tree loses height.
goal: When the root is an internal node left with no keys and a single child, make that child the new root, reducing the tree's height.
spec:
  scenario: The root collapses into its child
  status: failing
  lines:
    - kw: Given
      text: 'an order-3 tree, root [20] over leaves A = [10] and B = [20]'
    - kw: When
      text: 'Delete(10) underflows A, A and B merge into [20], and the root loses its last separator'
    - kw: Then
      text: 'the root collapses: the merged leaf becomes the new root, the tree is one level tall again, and Get(20) returns its value while Get(10) reports not found'
    - kw: And
      text: 'deleting the final key leaves a valid empty root leaf (0 keys), and a later Put still works on it'
code:
  lang: go
  source: |
    // after handling the root's children, if the root is internal and has
    //   0 keys (so exactly 1 child), set t.root = that child's id and free
    //   the old root page. the tree just lost a level.
    // a root LEAF is never collapsed - an empty root leaf is a valid tree.
checkpoint: The tree shrinks when its root empties - Put, Get, and Delete all keep the tree balanced. Commit and stop here.
---

Deletes only ever shorten a B+Tree at the **root**, exactly as inserts only ever
lengthen it there. When a merge removes the root's last separator, the root is an
internal node with a single child and no way left to route - so it is discarded and
that lone child becomes the new root. The whole tree drops a level, and because it
happens at the very top, **every leaf stays at the same depth**, just one shallower.

The root gets one exemption the rest of the tree does not: a **root leaf** is
allowed to fall all the way to empty without collapsing, because an empty tree is a
perfectly valid tree - it is just where you started. With this, delete is complete:
borrow when you can, merge when you cannot, cascade the repair upward, and collapse
the root when it empties. The tree stays balanced and every leaf equidistant from
the root through any mix of inserts and deletes.
