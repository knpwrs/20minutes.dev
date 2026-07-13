---
project: build-a-merkle-tree
lesson: 6
title: One level up
overview: One level of the tree becomes the next by pairing adjacent hashes and hashing each pair into a parent. Today you build one level up, for an even number of nodes.
goal: Turn a level with an even number of hashes into the next level by pairing and hashing adjacent hashes.
spec:
  scenario: An even level pairs up into the next level
  status: failing
  lines:
    - kw: Given
      text: 'the level [0x00063049, 0x6bfe63ee, 0x96a8ad3c, 0x68cf0725]'
    - kw: When
      text: 'pairUp combines each adjacent pair with HashNode'
    - kw: Then
      text: 'it returns [0xebb8e925, 0x1cde9a86]'
    - kw: And
      text: 'element 0 is HashNode of the first two hashes and element 1 is HashNode of the last two'
code:
  lang: go
  source: |
    func pairUp(level []Hash) []Hash {
      var next []Hash
      for i := 0; i+1 < len(level); i += 2 {
        next = append(next, HashNode(level[i], level[i+1]))
      }
      return next
    }
checkpoint: An even level collapses into the next level up by pairing and hashing. Commit and stop here.
---

Going up one level is a single idea repeated: take the level's hashes two at a time,
left then right, and hash each pair into a parent with `HashNode`. Four hashes become
two; two would become one. The parents keep their left-to-right order, so the tree
stays aligned with the data underneath.

Today assumes an **even** count so every hash has a partner - the four-leaf case
lands on exactly two parents. What happens when a level has an odd number of nodes,
and the last one is left without a partner, is the very next lesson. For now, pin the
clean even case; it is the heart of the build loop.
