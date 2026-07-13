---
project: build-a-merkle-tree
lesson: 3
title: Content addressing
overview: The whole point of hashing data is that identical content always yields an identical hash, and any difference yields a different one. Today you pin that property, the foundation of content addressing.
goal: Show that equal data hashes equal and unequal data hashes unequal.
spec:
  scenario: Same content hashes the same, different content differs
  status: failing
  lines:
    - kw: Given
      text: 'two separate calls to HashLeaf on the bytes of "alice"'
    - kw: When
      text: 'their results are compared'
    - kw: Then
      text: 'both are 0x00063049 and they are equal'
    - kw: And
      text: 'HashLeaf of "Alice" is 0xa83c0ae9, which differs - one changed byte changes the hash'
code:
  lang: go
  source: |
    a := HashLeaf([]byte("alice"))
    b := HashLeaf([]byte("alice"))
    c := HashLeaf([]byte("Alice"))
    // a == b (same content), a != c (one byte differs)
checkpoint: Identical content hashes identically, and any change is visible. Commit and stop here.
---

This is the property that makes hashes useful for integrity - **content addressing**.
A hash names data by its content, not by where it lives, so the same content always
gets the same name and different content gets a different one. Git works exactly this
way: every file, tree, and commit is stored under the hash of its content, so two
identical files collapse to one object and the smallest edit produces a brand-new
hash that ripples all the way up to a new commit id.

Today's lesson has no new machinery - it pins the behavior everything else relies on.
Because a single flipped byte (`alice` to `Alice`) lands on a completely different
hash, a Merkle root built from these leaves will act as a fingerprint for the whole
dataset: if any leaf differs, some hash along the way differs, and the root differs
too.
