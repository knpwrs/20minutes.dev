---
project: build-a-merkle-tree
lesson: 14
title: Verifying a proof
overview: A proof is only useful if a verifier holding just the root can recompute it from one leaf. Today you build VerifyProof.
goal: Recompute the root from a leaf and its proof, and compare to the trusted root.
spec:
  scenario: VerifyProof folds a leaf up to the root
  status: failing
  lines:
    - kw: Given
      text: 'the trusted root 0xfd610c23 and leaf 0 proof [(0x6bfe63ee, right), (0x1cde9a86, right)]'
    - kw: When
      text: 'VerifyProof folds HashLeaf("alice") up through the steps'
    - kw: Then
      text: 'the recomputed hash equals 0xfd610c23 and it returns true'
    - kw: And
      text: 'VerifyProof of "carol" with proof [(0x68cf0725, right), (0xebb8e925, left)] against the same root also returns true'
code:
  lang: go
  source: |
    func VerifyProof(root Hash, leaf []byte, proof []ProofStep) bool {
      h := HashLeaf(leaf)
      for _, s := range proof {
        if s.SiblingRight {
          h = HashNode(h, s.Sibling) // sibling on the right
        } else {
          h = HashNode(s.Sibling, h) // sibling on the left
        }
      }
      return h == root
    }
checkpoint: A leaf plus its proof recomputes the root and verifies against it. Commit and stop here.
---

Verification is the mirror of generation. Start by hashing the leaf data (with the
`0x00` prefix, exactly as the tree did), then fold in each proof step: if the sibling
was on the right, compute `HashNode(current, sibling)`; if on the left,
`HashNode(sibling, current)`. After the last step you have recomputed a root, and if
it equals the trusted root, the leaf is proven to be in the tree.

This is the moment the whole structure pays off: the verifier never saw the other
leaves, never rebuilt the tree, and used only a handful of hashes, yet is certain
`alice` is leaf 0 under root `0xfd610c23`. The `SiblingRight` flag is load-bearing -
get the order wrong on any step and the recomputed root will not match. Next you will
watch verification correctly *reject* forgeries.
