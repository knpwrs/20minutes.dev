---
project: build-a-btree-index
lesson: 21
title: Bubbling a split to the parent
overview: In a taller tree, insert descends to a leaf, and if that leaf splits the separator has to climb back up to its parent. Today you make insert recursive so a leaf split is absorbed by a parent that still has room.
goal: Insert into the correct leaf of a multi-level tree, and when it splits, add the separator to its parent.
spec:
  scenario: A parent absorbs a child's split
  status: failing
  lines:
    - kw: Given
      text: 'an order-3 tree with internal root [30] over leaves [10, 20] and [30, 40]'
    - kw: When
      text: 'Put(35, 350) is called (no split), then Put(50, 500) (splits the right leaf)'
    - kw: Then
      text: 'after Put(35) the right leaf is [30, 35, 40] and the root is unchanged; after Put(50) the right leaf splits and the root gains a separator, becoming [30, 40] with three leaf children'
    - kw: And
      text: 'Get returns the right value for every one of 10, 20, 30, 35, 40, 50'
code:
  lang: go
  source: |
    // insert returns (sep, newRightID, didSplit) to the caller above.
    func (t *Tree) insert(id, key, val uint64) (uint64, PageID, bool) {
      // leaf: insert; if overflow, split and return its separator up
      // internal: recurse into childIndex; if the child split, splice
      //   the returned separator+child into this node's Keys/Children
      //   (this node has room today, so it does not split yet)
    }
checkpoint: A leaf split deep in the tree is absorbed by its parent. Commit and stop here.
---

Insert becomes **recursive**: descend into the child that should hold the key, and
let that call report back whether it split. If a child leaf splits, it returns its
separator and the id of its new right half, and the parent **splices** them in -
inserting the separator among its keys and the new child among its children, at the
position the routing already picked. The key stays sorted, the child sits just to
the right of its separator.

Today the parent always has room, so it absorbs the new separator without splitting
itself - one idea at a time. That keeps the focus on the plumbing: how a split
result travels up one level and gets stitched into the parent. What happens when the
parent is *also* full - so the split cascades further up, and eventually grows a new
root - is the next lesson, and it reuses the internal split you already wrote.
