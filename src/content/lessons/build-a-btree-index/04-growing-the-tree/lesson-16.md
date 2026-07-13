---
project: build-a-btree-index
lesson: 16
title: Splitting a full leaf
overview: When a leaf overflows, it splits in two and hands a separator key up to the parent. Today you write that split as a pure function - dividing the entries, choosing the separator, and re-pointing the next-leaf links - the core move that lets the tree grow.
goal: Split an overflowing leaf into a left and right leaf, returning the separator key and keeping the next-leaf links correct.
spec:
  scenario: A leaf splits at its median
  status: failing
  lines:
    - kw: Given
      text: 'a leaf with keys [10, 20, 30, 40], its next-leaf link 9, splitting with the new right page id 7'
    - kw: When
      text: the leaf is split
    - kw: Then
      text: 'the left leaf keeps keys [10, 20] and its next-leaf link becomes 7; the right leaf takes keys [30, 40] with next-leaf link 9; the separator key is 30'
    - kw: And
      text: 'splitting an odd overflow [10, 20, 30, 40, 50] the same way gives left [10, 20], right [30, 40, 50], separator 30 (the right leaf''s first key, which stays in the right leaf)'
code:
  lang: go
  source: |
    // mid = len/2. left keeps [:mid]; right takes [mid:].
    // leaf split COPIES the separator up: it is right.Keys[0], and it
    // ALSO stays in the right leaf (leaves hold every key).
    func splitLeaf(leaf *LeafNode, rightID PageID) (left, right *LeafNode, sep uint64) {
      // right.Next = leaf.Next; left.Next = rightID
    }
checkpoint: A full leaf splits cleanly and the leaf chain stays intact. Commit and stop here.
---

When a leaf can hold no more keys, it **splits**: the entries divide at the middle,
the left half stays put and the right half moves to a new leaf. The parent needs a
**separator** to tell the two halves apart, and for a leaf split that separator is
simply the right leaf's first key. Crucially it is **copied** up, not moved - a
B+Tree keeps every key down in the leaves, so `30` both becomes the parent's
separator and remains the first key of the right leaf.

The other half of the job is the **next-leaf link**. The new right leaf inherits
the old leaf's forward link, and the old (left) leaf now points at the new right
leaf, so the left-to-right chain still threads through every leaf in order. Get
this wrong and range scans skip keys. The split is pure here - it just computes two
nodes and a separator; the next lessons wire it into insert and hand the separator
to a parent.
