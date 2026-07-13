---
project: build-a-btree-index
lesson: 23
title: Deleting from a taller tree
overview: Delete has to descend just like insert does. Today you make Delete walk down to the leaf that holds a key and remove it there, so deletion works in a multi-level tree - rebalancing comes next.
goal: Descend to the correct leaf in a multi-level tree and remove a key, leaving the rest of the tree untouched.
spec:
  scenario: Removing a key deep in the tree
  status: failing
  lines:
    - kw: Given
      text: 'an order-3 tree with internal root [30] over leaves [10, 20] and [30, 40]'
    - kw: When
      text: 'Delete(40) is called'
    - kw: Then
      text: 'it returns true, the right leaf becomes [30], and Get(40) now reports not found'
    - kw: And
      text: 'Get(10), Get(20), and Get(30) still return their values and the root separator [30] is unchanged'
code:
  lang: go
  source: |
    func (t *Tree) delete(id, key uint64) bool {
      b := t.pager.ReadPage(id)
      if nodeType(b) == nodeLeaf {
        // remove from this leaf (lesson 15), write it back
      }
      // internal: recurse into childIndex; rebalancing is the next lessons
    }
checkpoint: Delete reaches and removes a key at any depth. Commit and stop here.
---

Delete mirrors insert's descent: route the key down through the internal nodes to
the one leaf that could hold it, then remove its entry there. In this lesson the
leaf still has plenty of keys after the removal, so nothing more is needed - the
change is local to that leaf and the rest of the tree, separators included, stays
exactly as it was.

That "plenty of keys left" assumption is doing real work, and the next lessons pay
it off. A leaf that drops below the **minimum occupancy** (for order 3, below one
key) has **underflowed** and can no longer stand alone - it must either borrow a
key from a neighbor or merge with one. Today establishes the descent and the plain
removal; the rebalancing that keeps a shrinking tree legal is built on top of it,
one repair at a time.
