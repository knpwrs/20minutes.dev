---
project: build-a-merkle-tree
lesson: 20
title: A consistency proof
overview: A consistency proof lets someone holding an old root confirm the new tree only appended - it did not rewrite history. Today you build that check for a power-of-two old size.
goal: Verify that an old root is consistent with a new tree by checking the new tree kept it as a prefix subtree.
spec:
  scenario: Consistency holds for an append and fails for a rewrite
  status: failing
  lines:
    - kw: Given
      text: 'the old root 0xebb8e925 (the tree over the first 2 leaves) and the new data ["alice", "bob", "carol", "dave"]'
    - kw: When
      text: 'VerifyConsistency checks the new tree subtree root over [0, 2) against the old root'
    - kw: Then
      text: 'it matches, so it returns true - the new tree is an append-only extension'
    - kw: And
      text: 'VerifyConsistency of the same old root against ["alice", "bib", "carol", "dave"], where an old leaf was altered, returns false'
code:
  lang: go
  source: |
    // old size m must be a power of two here; the old root covers leaves [0, m).
    func VerifyConsistency(oldRoot Hash, newData [][]byte, m int) bool {
      return Build(newData).SubtreeRoot(0, m) == oldRoot
    }
checkpoint: A consistency check confirms an append and rejects a rewrite of old leaves. Commit and stop here.
---

A **consistency proof** answers a sharper question than "did anything change?" It asks
"was the change *only* an append?" Someone who trusts the old root wants assurance that
the new, larger tree still contains the old one as a prefix - that no old entry was
quietly edited or deleted. For an old size `m` that is a power of two, the old root is
exactly the new tree's subtree over `[0, m)`, so the check is one `SubtreeRoot`
comparison.

When the new data is a true append (`alice, bob` then `+ carol, dave`), the `[0, 2)`
subtree still hashes to `0xebb8e925` and consistency holds. But swap `bob` for `bib`
and that prefix subtree hash changes, so the check returns false - the log rewrote
history and is caught. Real consistency proofs (RFC 6962) generalize this to any old
size by shipping a handful of subtree hashes instead of the whole new tree; this
power-of-two version is the honest core of the idea.
