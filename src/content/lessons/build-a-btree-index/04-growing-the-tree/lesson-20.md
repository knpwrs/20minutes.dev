---
project: build-a-btree-index
lesson: 20
title: The first split grows a root
overview: When the single root leaf fills up, splitting it needs somewhere to put the separator - so the tree grows a new internal root above it. Today you wire the leaf split into Put and create that new root, taking the tree from one level to two.
goal: Split a full root leaf on insert and create a new internal root holding the separator, raising the tree's height to two.
spec:
  scenario: A full root leaf splits into a new root
  status: failing
  lines:
    - kw: Given
      text: 'an order-3 tree whose root leaf holds keys [10, 20, 30] (full)'
    - kw: When
      text: 'Put(40, 400) is called'
    - kw: Then
      text: 'the root becomes an internal node with separator [30] and two leaf children: [10, 20] and [30, 40]'
    - kw: And
      text: 'Get returns the right value for all of 10, 20, 30, 40, and the left leaf''s next-leaf link points at the right leaf'
code:
  lang: go
  source: |
    const maxKeys = 3 // small teaching order; real fanout is 255
    func (t *Tree) Put(key, val uint64) {
      // insert into root leaf; if it now exceeds maxKeys:
      //   rightID := t.pager.AllocPage()
      //   left,right,sep := splitLeaf(leaf, rightID)
      //   write left to t.root, right to rightID
      //   newRoot := &InternalNode{Keys:[sep], Children:[t.root, rightID]}
      //   t.root = alloc+write(newRoot)
    }
checkpoint: The tree grows its first internal root - height one becomes height two. Commit and stop here.
---

A leaf split produces a separator that has to live *somewhere*, and when the leaf
that split was the whole tree there is no parent to hold it. The answer is to grow
the tree **upward**: allocate a fresh internal node whose single separator is that
key and whose two children are the old leaf (now the left half) and the new right
leaf, then point the tree's root at it. The tree just got one level taller.

This "grow at the root" move is the only way a B+Tree ever increases its height,
and it is why **all leaves always stay at the same depth** - the tree never
lengthens one branch, it lifts the whole root. Today handles the first, simplest
case, where the thing that splits is the root itself. The next lesson pushes inserts
down into a taller tree, where a leaf deep below splits and its separator has to
climb back up to an existing parent.
