---
project: build-a-merkle-tree
lesson: 13
title: Generating a full proof
overview: A full inclusion proof is the ordered list of siblings from a leaf all the way up to the root. Today you generate one by walking the tree upward.
goal: Generate the full ordered list of sibling steps from a leaf to the root.
spec:
  scenario: Prove walks a leaf up to the root collecting siblings
  status: failing
  lines:
    - kw: Given
      text: 'the tree Build(["alice", "bob", "carol", "dave"])'
    - kw: When
      text: 'Prove is called for leaf index 0'
    - kw: Then
      text: 'it returns two steps - sibling 0x6bfe63ee on the right, then sibling 0x1cde9a86 on the right'
    - kw: And
      text: 'Prove for leaf index 2 returns sibling 0x68cf0725 on the right, then sibling 0xebb8e925 on the left'
code:
  lang: go
  source: |
    func (t *Tree) Prove(index int) []ProofStep {
      var proof []ProofStep
      idx := index
      for level := 0; level < len(t.Levels)-1; level++ {
        row := t.Levels[level]
        if idx%2 == 0 && idx+1 < len(row) {
          proof = append(proof, ProofStep{row[idx+1], true})
        } else if idx%2 == 1 {
          proof = append(proof, ProofStep{row[idx-1], false})
        } // else: promoted, no step this level
        idx /= 2
      }
      return proof
    }
checkpoint: Prove returns the ordered sibling path from any leaf to the root. Commit and stop here.
---

Generating a proof is a walk from a leaf to the root. At each level you record the
current node's sibling and its side, then move up to the parent by halving the index
(node `idx` has parent `idx/2`). Repeat until you reach the level just below the root.
For leaf 0 in a four-leaf tree that is two steps: its leaf sibling on the right, then
the whole right subtree's hash on the right.

The proof is small - about `log2(n)` hashes for `n` leaves - which is the entire
appeal. To prove one transaction is in a block of thousands, you ship a handful of
hashes, not the block. An out-of-range index has no path, so return an empty proof
rather than reaching past the tree. (The promoted-node case, where a level contributes
no step, gets its own lesson shortly.)
