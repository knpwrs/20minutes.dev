---
project: build-a-merkle-tree
lesson: 16
title: Proofs and the odd-node rule
overview: In an odd tree a promoted leaf skips the level where it had no partner, so its proof is shorter. Today you handle proofs under the odd-node rule.
goal: Generate and verify a proof for a promoted leaf in an odd-sized tree.
spec:
  scenario: A promoted leaf has a shorter proof that still verifies
  status: failing
  lines:
    - kw: Given
      text: 'the tree Build(["alice", "bob", "carol"]) with root 0xb019c95a'
    - kw: When
      text: 'Prove is called for leaf index 2 ("carol"), which was promoted'
    - kw: Then
      text: 'the proof is a single step - sibling 0xebb8e925 on the left'
    - kw: And
      text: 'VerifyProof of "carol" with that one-step proof against root 0xb019c95a returns true'
code:
  lang: go
  source: |
    // three leaves: level 0 = [La, Lb, Lc], level 1 = [HashNode(La,Lb), Lc]
    // leaf 2 (Lc) has no sibling at level 0 -> promoted, no step recorded.
    // at level 1 it pairs (on the right) with HashNode(La,Lb)=0xebb8e925 on the left.
    proof := tree.Prove(2) // [{0xebb8e925, false}]
checkpoint: A promoted leaf produces a shorter proof that still recomputes the root. Commit and stop here.
---

The `Prove` walk you already wrote handles this correctly, but it is worth seeing why.
In the three-leaf tree, `carol` at index 2 is the odd node at level 0: it has no
sibling, so it is **promoted** to level 1 with no proof step recorded. Up at level 1
it finally has a partner - the `HashNode(alice, bob)` subtree on its left - which
becomes its single proof step. So its proof is one hash, not two.

Verification does not care that the proof is shorter. It hashes `carol`, sees one step
with the sibling on the left, computes `HashNode(0xebb8e925, HashLeaf("carol"))`, and
lands exactly on the root `0xb019c95a`. The promote rule stays invisible to the
verifier because a promoted node contributes nothing at its lonely level - the path
just has one fewer rung. Odd trees prove membership just as cleanly as even ones.
