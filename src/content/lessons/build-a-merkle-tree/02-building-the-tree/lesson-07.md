---
project: build-a-merkle-tree
lesson: 7
title: The odd-node rule
overview: When a level has an odd number of nodes the last one has no partner - our rule is to promote it up to the next level unchanged. Today you handle that odd node.
goal: Extend pairUp so a level with an odd count promotes its lone last node up unchanged.
spec:
  scenario: An odd level promotes its leftover node
  status: failing
  lines:
    - kw: Given
      text: 'the three-node level [0x00063049, 0x6bfe63ee, 0x96a8ad3c]'
    - kw: When
      text: 'pairUp combines the pair and promotes the leftover'
    - kw: Then
      text: 'it returns [0xebb8e925, 0x96a8ad3c] - the first two hash into a parent and 0x96a8ad3c moves up unchanged'
    - kw: And
      text: 'the even level [0x00063049, 0x6bfe63ee, 0x96a8ad3c, 0x68cf0725] still returns [0xebb8e925, 0x1cde9a86]'
code:
  lang: go
  source: |
    func pairUp(level []Hash) []Hash {
      var next []Hash
      i := 0
      for ; i+1 < len(level); i += 2 {
        next = append(next, HashNode(level[i], level[i+1]))
      }
      if i < len(level) {              // one node left with no partner
        next = append(next, level[i])  // promote it unchanged
      }
      return next
    }
checkpoint: An odd level promotes its lone last node up unchanged. Commit and stop here.
---

Real datasets are rarely a power of two, so most levels eventually hit an **odd
count** with one hash left over. You need a rule, and there are two common ones. This
project **promotes** the lone node: it moves up to the next level unchanged, waiting
to be paired higher up. (Bitcoin instead **duplicates** the last node and hashes it
with itself - simpler in one way, but it caused a real-world malleability bug. Pick
one rule and be consistent; we promote.)

The important discipline is that this is the *only* change: the even branch is
untouched, so the four-leaf result from last lesson is exactly the same. A promoted
node carries no extra prefix or wrapper - it is literally the same hash one level up.
That simplicity is what keeps proofs and diffs over odd trees tractable later.
