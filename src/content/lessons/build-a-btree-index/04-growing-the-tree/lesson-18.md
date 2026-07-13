---
project: build-a-btree-index
lesson: 18
title: Descending to a leaf
overview: With child routing in hand, a lookup can walk from the root down to the one leaf that could hold a key. Today you write that descent and rewire Get to use it, so the index reads correctly no matter how tall the tree has grown.
goal: Descend from the root through internal nodes to the leaf that would hold a key, following child ids.
spec:
  scenario: Walking the tree to a leaf
  status: failing
  lines:
    - kw: Given
      text: 'a two-level tree: an internal root with separator [20] whose children are leaf A (keys [10]) and leaf B (keys [20, 30])'
    - kw: When
      text: the descent finds the leaf for a target key
    - kw: Then
      text: 'targets 5 and 10 reach leaf A; targets 20, 30, and 40 reach leaf B'
    - kw: And
      text: 'Get now descends before searching, so Get(30) returns leaf B''s value and Get(15) reports not found'
code:
  lang: go
  source: |
    func (t *Tree) findLeaf(key uint64) PageID {
      id := t.root
      for {
        b := t.pager.ReadPage(id)
        if nodeType(b) == nodeLeaf { return id }
        in := parseInternal(b)
        id = in.Children[childIndex(in.Keys, key)]
      }
    }
checkpoint: Get works at any tree height by descending to the right leaf first. Commit and stop here.
---

**Descent** is the spine of every operation: start at the root page, and while the
current page is an internal node, route the key to a child and move there,
repeating until you land on a leaf. Because internal nodes only ever point down and
every path ends at a leaf, this loop always terminates at the single leaf that could
contain the key.

Rewiring `Get` to descend first is what makes it correct for a tree taller than one
node. Until now `Get` read the root leaf directly; now it descends to the right
leaf and searches there, which works whether the tree is one level or ten. This
lesson is tested on a hand-built two-level tree because splits do not build one
until the next lesson - but the descent it defines is exactly what those grown
trees will rely on.
