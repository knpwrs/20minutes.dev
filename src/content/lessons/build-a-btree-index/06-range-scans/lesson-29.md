---
project: build-a-btree-index
lesson: 29
title: An ordered cursor
overview: Sometimes you want to walk the whole index in order, not just a slice. Today you build a cursor that starts at the smallest key and steps through every entry ascending, the general iterator a range scan is a special case of.
goal: Provide a cursor that visits every key/value in the tree in ascending order, from the leftmost leaf onward.
spec:
  scenario: Iterating the whole index in order
  status: failing
  lines:
    - kw: Given
      text: 'a tree holding keys 50, 20, 40, 10, 30 (inserted in that order)'
    - kw: When
      text: a cursor iterates from the start to the end
    - kw: Then
      text: 'it yields keys 10, 20, 30, 40, 50 in ascending order'
    - kw: And
      text: 'after the last entry the cursor reports done, and a cursor over an empty tree yields nothing and is immediately done'
code:
  lang: go
  source: |
    // leftmost leaf: descend always into child 0 until a leaf.
    type Cursor struct { t *Tree; leafID PageID; idx int }
    func (t *Tree) First() *Cursor { /* descend to child 0 repeatedly */ }
    func (c *Cursor) Next() (key, val uint64, ok bool) {
      // yield leaf entry idx; advance; at leaf end, hop to leaf.Next
    }
checkpoint: You can iterate the entire index in sorted order. Commit and stop here.
---

A **cursor** generalizes the range scan: instead of a bounded slice, it is a
position you can advance one entry at a time. It starts at the **leftmost leaf** -
reached by always descending into child 0 - and each `Next` yields the current
entry then steps forward, hopping to the next leaf via the chain when it runs off
the end of one. Because the leaves are already sorted and linked, the cursor emits
the entire index in ascending key order.

This is the iterator shape most databases expose for "give me everything, in order"
and for feeding a sort-free ordered read. The two ends matter: a cursor over an
empty tree is **done immediately**, and a cursor that has passed the last leaf
reports **done** rather than running off into freed pages. With Get, Scan, and a
cursor, the read side of the index is complete; one more lesson turns a whole sorted
batch into a tree at once.
