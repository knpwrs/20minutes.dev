---
project: build-a-btree-index
lesson: 22
title: Cascading splits and a taller root
overview: When a leaf split fills its parent, the parent splits too, and the split can cascade all the way to a new root. Today you complete insert so overflow at any level propagates upward, keeping every leaf at equal depth.
goal: When splicing a separator overflows an internal node, split it and propagate upward, growing a new root if the old root splits.
spec:
  scenario: A split cascades to a new root
  status: failing
  lines:
    - kw: Given
      text: 'an order-3 tree with internal root [20, 40, 60] (full) whose second child is the full leaf [20, 25, 30]'
    - kw: When
      text: 'Put(28, 280) is called, splitting that leaf and overflowing the root'
    - kw: Then
      text: 'the root splits: its median is promoted into a brand-new root, so the tree is now three levels tall with a single-key root'
    - kw: And
      text: 'Get returns the right value for every key inserted, and all leaves are at the same depth (2)'
code:
  lang: go
  source: |
    // in insert(): after splicing the child's separator, if this internal
    // node now exceeds maxKeys, splitInternal it and return (promote,
    // newRightID, true) to the caller above.
    // in Put(): if the ROOT returned a split, build a new internal root
    // with [promote] and children [oldRoot, newRight] (same as lesson 20).
    func (t *Tree) Put(key, val uint64) { /* handle a root-level split */ }
checkpoint: Splits cascade to any depth and the tree grows a new root when needed. Commit and stop here.
---

The last piece of insert is symmetry: an internal node that overflows after
absorbing a child's separator splits **exactly like a leaf does** in spirit - it
calls `splitInternal`, keeps its left half, and sends its median up to *its* parent
as a new separator. If that parent overflows too, the same thing happens one level
higher, and so on. The split **cascades** as far up as it needs to.

When the cascade reaches the **root** and the root splits, there is no parent - so,
just like lesson 20, the tree grows a new root above it and gets one level taller.
This is the complete growth story: leaves split, separators climb, and the tree
only ever grows from the top, which is precisely why **every leaf stays at the same
depth**. The tree is now a real, arbitrarily tall B+Tree that keeps itself
balanced through any sequence of inserts.
