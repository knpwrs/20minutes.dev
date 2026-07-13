---
project: build-a-merkle-tree
lesson: 2
title: Hashing a leaf
overview: Data is never hashed raw in a Merkle tree - a leaf is hashed with a one-byte prefix that marks it as a leaf. Today you add that leaf prefix and hash your first leaf.
goal: Hash a piece of data as a leaf by prefixing it with the leaf marker 0x00.
spec:
  scenario: A leaf hash uses the 0x00 prefix
  status: failing
  lines:
    - kw: Given
      text: 'HashLeaf prepends the leaf-marker byte 0x00 to the data, then runs hashBytes on the result'
    - kw: When
      text: 'HashLeaf is called on the bytes of "alice"'
    - kw: Then
      text: 'it returns 0x00063049'
    - kw: And
      text: 'HashLeaf of "bob" returns 0x6bfe63ee'
code:
  lang: go
  source: |
    const leafPrefix = 0x00
    func HashLeaf(data []byte) Hash {
      buf := append([]byte{leafPrefix}, data...)
      return hashBytes(buf)
    }
checkpoint: Data is hashed into leaf hashes carrying the 0x00 marker. Commit and stop here.
---

Every value in a Merkle tree is either a **leaf** (a piece of your actual data) or
an **internal node** (a hash of two child hashes). If you hashed both the same way,
an attacker could later present an internal node as though it were a leaf, or the
reverse. The defense is **domain separation** - give each kind its own one-byte
prefix before hashing. Leaves get `0x00`; internal nodes, in a couple of lessons,
will get `0x01`.

So `HashLeaf` does not hash the data directly. It prepends the `0x00` marker and
hashes that. The extra byte is invisible to the caller but means a leaf hash lives
in a different "namespace" than a node hash. Today you only need the leaf side; pin
those two exact values and the rest of the tree grows from them.
