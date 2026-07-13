---
project: build-a-btree-index
lesson: 11
title: A tree with one empty leaf
overview: The tree is a pager plus the page id of its root. Today you create one - a brand-new tree whose root is a single empty leaf page - giving the index a real, importable shape that every later lesson thickens.
goal: Create a tree over a pager whose root is a freshly allocated, empty leaf page.
spec:
  scenario: A new tree starts as one empty leaf
  status: failing
  lines:
    - kw: Given
      text: a new in-memory pager
    - kw: When
      text: a new tree is created over it
    - kw: Then
      text: 'the tree records a root page id, and reading that page and parsing it yields a leaf with 0 keys'
    - kw: And
      text: 'the root leaf''s next-leaf link is 0 (it is the only, and rightmost, leaf)'
code:
  lang: go
  source: |
    type Tree struct { pager Pager; root PageID }
    func NewTree(p Pager) *Tree {
      id := p.AllocPage()
      p.WritePage(id, serializeLeaf(&LeafNode{})) // empty leaf
      return &Tree{pager: p, root: id}
    }
checkpoint: You have an importable, empty B+Tree - a pager and a root. Commit and stop here.
---

A B+Tree is two things: a **pager** to hold its pages and the **page id of its
root**. Everything else - search, insert, delete - starts by reading the root page
and follows child ids down from there. A fresh tree has the simplest possible
shape: a single leaf, empty, that is both the root and the only leaf.

Storing the root as a **page id** rather than a pointer is the small decision that
keeps the tree disk-ready. When the root splits later, the tree just records a new
root id; when the tree is reopened from a file, it reads the root id out of the
meta page. The root is never an object you hold onto - it is always a number you
look up through the pager, exactly like every other node.
