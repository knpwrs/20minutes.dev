---
project: build-a-merkle-tree
lesson: 5
title: Hash all the leaves
overview: Building a tree starts at the bottom - hash every piece of data into a leaf hash. Today you turn a list of data into the tree's bottom level.
goal: Hash a list of data items into a list of leaf hashes (level 0 of the tree).
spec:
  scenario: A data list becomes the bottom level of leaf hashes
  status: failing
  lines:
    - kw: Given
      text: 'the data list ["alice", "bob", "carol", "dave"]'
    - kw: When
      text: 'leafHashes hashes each item as a leaf'
    - kw: Then
      text: 'it returns [0x00063049, 0x6bfe63ee, 0x96a8ad3c, 0x68cf0725]'
    - kw: And
      text: 'order is preserved - element 0 is the leaf hash of "alice"'
code:
  lang: go
  source: |
    func leafHashes(data [][]byte) []Hash {
      out := make([]Hash, len(data))
      for i, d := range data {
        out[i] = HashLeaf(d)
      }
      return out
    }
checkpoint: A data list becomes an ordered list of leaf hashes - the tree's base. Commit and stop here.
---

A Merkle tree is built bottom-up, so the base level, **level 0**, is just every data
item run through `HashLeaf`, in order. Each higher level will be about half the size
of the one below, until a single hash - the root - is left. Everything from here is
combining hashes; the raw data is only ever touched once, right here at the leaves.

Order matters and is preserved: leaf 0 is always the hash of the first item. That
ordering is what lets a later proof say "this is leaf number 2" and lets a diff report
"leaf 3 changed" by position. Keep the list exactly as long as the data, one leaf per
item.
