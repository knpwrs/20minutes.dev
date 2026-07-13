---
project: build-a-spell-checker
lesson: 27
title: When edges collide, go deeper
overview: Two words can be the same distance from the root, and a map has only one slot per distance. Today you resolve those collisions the BK-tree way - descend into the existing child and insert there instead.
goal: When a word's distance to a node is already taken by a child, recurse into that child and insert relative to it.
spec:
  scenario: A colliding word descends to become a grandchild
  status: failing
  lines:
    - kw: Given
      text: 'a tree built by inserting "book", "books", "back", then "boo"'
    - kw: When
      text: '"boo" is inserted (it is distance 1 from "book", colliding with "books")'
    - kw: Then
      text: 'the search descends into "books" and attaches "boo" there at distance 2 (the distance from "boo" to "books")'
    - kw: And
      text: 'the root''s children are unchanged - "books" at 1 and "back" at 2 - with "boo" now a child of "books"'
code:
  lang: go
  source: |
    func (n *BKNode) Insert(word string) {
      d := Distance(word, n.Word)
      if child, ok := n.Children[d]; ok {
        child.Insert(word) // edge taken -> recurse into it
        return
      }
      n.Children[d] = &BKNode{Word: word, Children: map[int]*BKNode{}}
    }
checkpoint: Colliding words recurse deeper instead of overwriting. Commit and stop here.
---

An edit-distance edge can only hold one child, but many words share a distance to
the root - `books` and `boo` are both one edit from `book`. When the edge you want
is already occupied, the BK-tree does not overwrite it; it **descends** into the
occupying child and inserts the new word relative to *that* node instead. `boo` is
distance 2 from `books`, so it lands as `books`'s child at edge 2.

This recursion is the whole structure. Every node partitions the words below it by
their distance to it, and collisions simply push a word one level deeper, where it
gets partitioned again. The tree that results has a powerful property: the edge
labels along any path let you bound how far a query can be from anything in a
subtree - which, next lesson, is exactly how a search avoids visiting most of the
dictionary.
