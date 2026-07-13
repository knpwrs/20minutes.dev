---
project: build-a-btree-index
lesson: 8
title: Parsing an internal node
overview: Now read an internal node back. Today you parse a page into separator keys and child ids and confirm the round-trip, so descent through the tree can trust the routers it reads.
goal: Parse an internal page back into N keys and N+1 child page ids, exactly reversing serialization.
spec:
  scenario: Bytes become an internal node again
  status: failing
  lines:
    - kw: Given
      text: 'a page produced by serializing an internal node with keys [20, 40] and children [2, 3, 7]'
    - kw: When
      text: the page is parsed back into an internal node
    - kw: Then
      text: 'its keys are [20, 40] and its children are [2, 3, 7]'
    - kw: And
      text: 'the number of children is always exactly one more than the number of keys'
code:
  lang: go
  source: |
    func parseInternal(b []byte) *InternalNode {
      n := int(keyCount(b))
      // keys[i] = getU64(b, 3 + i*8) for i in 0..n
      // children[j] = PageID(getU32(b, 3 + 8*n + j*4)) for j in 0..n
      // there are n+1 children
    }
checkpoint: Internal serialization round-trips exactly, keys and children intact. Commit and stop here.
---

Parsing an internal node reads `N` keys starting at offset 3, then `N + 1` child
ids starting right after them at `3 + 8 * N`. The one thing to get right is the
child count: it is always `keys + 1`, never equal to the key count, and a parser
that reads only `N` children silently drops the rightmost subtree.

With leaf and internal nodes both serializing and parsing exactly, the format is
complete: any page the pager hands back can be turned into the right kind of node
and mutated in memory. The next lesson works out how many keys actually fit in a
page - the fanout - which is what makes a B+Tree shallow enough to be fast, and
which sets the threshold at which a node is full and must split.
