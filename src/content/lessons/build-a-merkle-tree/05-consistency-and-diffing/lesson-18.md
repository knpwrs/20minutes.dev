---
project: build-a-merkle-tree
lesson: 18
title: Addressing a subtree
overview: Any aligned range of leaves has its own subtree root - a hash covering just those leaves. Today you read a subtree root out of the tree, the tool consistency proofs and diffing both need.
goal: Read the hash covering an aligned power-of-two range of leaves.
spec:
  scenario: A subtree root covers an aligned range of leaves
  status: failing
  lines:
    - kw: Given
      text: 'the tree Build(["alice", "bob", "carol", "dave"])'
    - kw: When
      text: 'the subtree root over leaves [0, 2) is read'
    - kw: Then
      text: 'it is 0xebb8e925, the HashNode of the first two leaf hashes'
    - kw: And
      text: 'the subtree root over leaves [2, 4) is 0x1cde9a86'
code:
  lang: go
  source: |
    // an aligned range of 2^k leaves starting at lo is one node:
    // it lives at level k, position lo / 2^k.
    func (t *Tree) SubtreeRoot(lo, hi int) Hash {
      width := hi - lo               // must be a power of two
      level := 0
      for w := 1; w < width; w *= 2 { level++ }
      return t.Levels[level][lo/width]
    }
checkpoint: Any aligned power-of-two range of leaves maps to a single subtree root. Commit and stop here.
---

Every internal node you built is the **root of a subtree** - the single hash that
covers a contiguous block of leaves. In the four-leaf tree, level 1 position 0 covers
leaves `[0, 2)` and level 1 position 1 covers `[2, 4)`. Reading one out is just
indexing into `Levels`: an aligned range of `2^k` leaves sits at level `k`, position
`lo / 2^k`.

This little accessor is the shared tool for the rest of the chapter. A **consistency
proof** asks whether the new tree kept an old prefix as a subtree; a **diff** compares
two trees' subtree roots to decide where to descend. Both are just "compare the hash
covering this block of leaves," which is exactly what `SubtreeRoot` returns. Restricting
it to power-of-two aligned ranges keeps the mapping to one clean node.
