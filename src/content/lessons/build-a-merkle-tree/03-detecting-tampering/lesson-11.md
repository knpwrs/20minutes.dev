---
project: build-a-merkle-tree
lesson: 11
title: Verifying data against a root
overview: If you trust a root you can check a whole dataset against it without keeping the old copy - just rebuild and compare. Today you build that check.
goal: Verify a dataset against a known-good root by rebuilding and comparing.
spec:
  scenario: Verify accepts matching data and rejects corrupted data
  status: failing
  lines:
    - kw: Given
      text: 'the trusted root 0xfd610c23 for ["alice", "bob", "carol", "dave"]'
    - kw: When
      text: 'Verify is called with that same data and that root'
    - kw: Then
      text: 'it returns true'
    - kw: And
      text: 'Verify with the corrupted data ["alice", "bob", "trent", "dave"] against root 0xfd610c23 returns false'
code:
  lang: go
  source: |
    func Verify(data [][]byte, root Hash) bool {
      return Build(data).Root() == root
    }
checkpoint: A dataset can be checked against a trusted root, accepting good data and rejecting corrupted data. Commit and stop here.
---

Detecting tampering does not require keeping the original data - just its **root**.
A verifier who was handed a trusted root once can, at any later time, rebuild the
tree from whatever data they now hold and compare. Match means intact; mismatch means
something changed. This is exactly how a downloaded dataset is checked against a
published root, or how a system confirms its own storage has not been corrupted.

`Verify` is a one-liner precisely because all the work already lives in `Build`. The
value is in the pattern: a tiny trusted anchor (32 bits here, 256 in a real system)
guards an arbitrarily large dataset. The next chapter makes this even cheaper - you
will confirm a *single* item belongs without rebuilding, or even seeing, the rest.
