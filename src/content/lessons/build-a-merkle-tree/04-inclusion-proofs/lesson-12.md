---
project: build-a-merkle-tree
lesson: 12
title: A proof step
overview: An inclusion proof is a path of sibling hashes from a leaf up to the root. Today you take the first step - recording a leaf's sibling and which side it is on.
goal: Record the sibling hash and its side for a leaf at the bottom level.
spec:
  scenario: A proof step is a sibling hash plus its side
  status: failing
  lines:
    - kw: Given
      text: 'the tree Build(["alice", "bob", "carol", "dave"])'
    - kw: When
      text: 'the bottom-level sibling of leaf 0 ("alice") is recorded as a proof step'
    - kw: Then
      text: 'the step holds sibling hash 0x6bfe63ee marked as being on the right'
    - kw: And
      text: 'the sibling of leaf 1 ("bob") is 0x00063049 marked as being on the left'
code:
  lang: go
  source: |
    type ProofStep struct {
      Sibling      Hash
      SiblingRight bool // true if the sibling sits to our right
    }
    // at level 0: even index -> sibling is index+1 on the right;
    //             odd index  -> sibling is index-1 on the left.
checkpoint: A single proof step records a sibling hash and which side it is on. Commit and stop here.
---

An **inclusion proof** (also called an audit proof) convinces someone who has only
the root that a particular leaf is really in the tree. It works by handing them just
enough hashes to recompute the root themselves, walking up from the leaf. The unit of
that path is one **proof step**: the sibling hash at each level, plus which side the
sibling is on.

The side is not optional bookkeeping. `HashNode(l, r)` differs from `HashNode(r, l)`,
so to recompute a parent the verifier must know whether to hash `HashNode(me, sibling)`
or `HashNode(sibling, me)`. At the bottom level a leaf at an even index pairs with the
leaf on its right; an odd index pairs with the one on its left. Today you just capture
one step; next lesson you walk the whole path.
