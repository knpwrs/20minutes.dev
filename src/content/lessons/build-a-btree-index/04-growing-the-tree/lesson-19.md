---
project: build-a-btree-index
lesson: 19
title: Splitting an internal node
overview: Internal nodes fill up too, and they split differently from leaves - the median key moves up and is removed, rather than being copied. Today you write that split as a pure function, pinning the even and odd cases.
goal: Split an overflowing internal node, promoting its median key upward and dividing keys and children between the two halves.
spec:
  scenario: An internal node promotes its median
  status: failing
  lines:
    - kw: Given
      text: 'an internal node with keys [10, 20, 30, 40] and children [c0, c1, c2, c3, c4]'
    - kw: When
      text: it is split
    - kw: Then
      text: 'the median key 30 is promoted upward (and removed from both halves); the left node is keys [10, 20] with children [c0, c1, c2]; the right node is keys [40] with children [c3, c4]'
    - kw: And
      text: 'splitting an odd node keys [10, 20, 30] with children [c0, c1, c2, c3] promotes 20, leaving left keys [10] children [c0, c1] and right keys [30] children [c2, c3]'
code:
  lang: go
  source: |
    // mid = len(keys)/2. promote = keys[mid] and is NOT kept in either half.
    // left  keys[:mid],   children[:mid+1]
    // right keys[mid+1:], children[mid+1:]
    func splitInternal(n *InternalNode) (left *InternalNode, promote uint64, right *InternalNode) {
    }
checkpoint: A full internal node splits, sending its median up to the parent. Commit and stop here.
---

An internal split differs from a leaf split in one decisive way: the median key is
**promoted and removed**, not copied. A leaf must keep every key because leaves hold
the data; an internal node's keys are only signposts, so the median can leave to
become the parent's new separator, and the children on either side of it go with
the half they belong to. That is why the child arrays divide at `mid + 1`: the
promoted key's two neighboring subtrees end up split across the two halves.

The counting has to be exact. A node with `k` keys has `k + 1` children; after
promoting `keys[mid]`, the left keeps `mid` keys and `mid + 1` children, the right
takes the rest, and the promoted key accounts for the one key that vanished from the
totals. Pinning both an even and an odd node keeps that arithmetic honest - off by
one on the child split and a whole subtree goes missing.
