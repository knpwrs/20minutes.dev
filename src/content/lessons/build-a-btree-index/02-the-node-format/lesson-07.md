---
project: build-a-btree-index
lesson: 7
title: Serializing an internal node
overview: Internal nodes hold no values - they hold separator keys and the page ids of their children. Today you serialize one to exact bytes, pinning the rule that a node with N keys has N+1 children.
goal: Serialize an internal node (N separator keys and N+1 child page ids) into a page with an exact layout.
spec:
  scenario: An internal node becomes bytes
  status: failing
  lines:
    - kw: Given
      text: 'an internal node with keys [20] and children [2, 3]'
    - kw: When
      text: it is serialized into a page
    - kw: Then
      text: 'byte 0 is 0x01 (internal), bytes 1-2 are 0x00 0x01 (count 1), and bytes 3-10 are the key 20 (8-byte big-endian)'
    - kw: And
      text: 'the two child ids follow at offset 11 as 4-byte big-endian integers 2 then 3, and every remaining byte is 0'
code:
  lang: go
  source: |
    type InternalNode struct { Keys []uint64; Children []PageID }
    // layout: [type:1][count:2] then N keys (8 bytes) then N+1 child ids (4 bytes)
    func serializeInternal(n *InternalNode) []byte {
      // setHeader(nodeInternal, len(Keys))
      // keys at offset 3; children at offset 3 + 8*len(Keys)
    }
checkpoint: An internal node can be written to a page as exact bytes. Commit and stop here.
---

An **internal** node is a router, not a store: it holds no values, only
**separator keys** and the page ids of its **children**. The defining invariant is
that a node with `N` keys has `N + 1` children - the keys carve the key space into
`N + 1` ranges, one per child. Key `Keys[i]` separates child `i` (keys below it)
from child `i + 1` (keys at or above it), the B+Tree convention you will rely on
when searching.

The layout keeps all keys together, then all child ids, so both arrays are
contiguous and indexable by offset. Child ids are `uint32` (four bytes), keys are
`uint64` (eight), so the children start at `3 + 8 * N`. Packing the two arrays
separately rather than interleaving them makes the "N keys, N+1 children" shape
obvious in the bytes and keeps each array a clean stride apart.
