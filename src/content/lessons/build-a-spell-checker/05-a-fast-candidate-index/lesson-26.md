---
project: build-a-spell-checker
lesson: 26
title: A tree keyed by distance
overview: Generating two-edit candidates is wasteful. A BK-tree fixes that by organizing the dictionary so a query can skip most of it. Today you build the tree's node and insert words as children keyed by their edit distance to the parent.
goal: Build a BK-tree node and insert words whose distances to the root are all different, storing each as a child under that distance.
spec:
  scenario: Attaching children by their distance to the root
  status: failing
  lines:
    - kw: Given
      text: 'an empty tree, into which "book", then "books", then "back" are inserted'
    - kw: When
      text: the tree is examined
    - kw: Then
      text: 'the root is "book", and its children map holds "books" at distance 1 and "back" at distance 2'
    - kw: And
      text: 'each child edge is the edit distance from the root ("book") to that word'
code:
  lang: go
  source: |
    type BKNode struct {
      Word     string
      Children map[int]*BKNode // keyed by distance to THIS node
    }
    // insert: d = Distance(new, node.Word); if no child at edge d,
    // attach new there. (Collisions - an edge already taken - are
    // next lesson; here every distance is distinct.)
    func (n *BKNode) Insert(word string) { /* attach at edge d */ }
checkpoint: A BK-tree node stores children keyed by their distance to it. Commit and stop here.
---

A **BK-tree** turns edit distance into an index. The idea: pick any word as the
root, and file every other word under the **edit distance** from it. `books` is one
edit from `book`, so it becomes the child at edge 1; `back` is two edits away, so it
is the child at edge 2. The edge label is not decoration - it is the exact distance
from parent to child, and next lesson that label is what lets a search prune whole
branches.

Today keep it to the simple case: every word you insert has a *different* distance
to the root, so each just slots into a free edge. The node is a word plus a map from
distance to child node. What happens when two words are the **same** distance from
the root - when an edge is already taken - is the one idea of the next lesson, so
leave that path out for now; the spec here only inserts words at distinct distances.
