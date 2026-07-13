---
project: build-a-merkle-tree
lesson: 15
title: A forged proof fails
overview: Verification has to reject forgeries - a wrong leaf or a tampered sibling must not recompute the root. Today you pin those failures.
goal: Show that a wrong leaf or an altered sibling makes VerifyProof return false.
spec:
  scenario: VerifyProof rejects a wrong leaf and an altered sibling
  status: failing
  lines:
    - kw: Given
      text: 'the root 0xfd610c23 and the leaf 0 proof [(0x6bfe63ee, right), (0x1cde9a86, right)]'
    - kw: When
      text: 'VerifyProof is called with the wrong leaf "mallory" and that proof'
    - kw: Then
      text: 'it returns false'
    - kw: And
      text: 'using the correct leaf "alice" but with the first sibling altered to 0x6bfe63ef also returns false'
code:
  lang: go
  source: |
    ok1 := VerifyProof(0xfd610c23, []byte("mallory"), proof0) // false
    bad := []ProofStep{{0x6bfe63ef, true}, {0x1cde9a86, true}}
    ok2 := VerifyProof(0xfd610c23, []byte("alice"), bad)      // false
checkpoint: A wrong leaf or a tampered sibling is correctly rejected. Commit and stop here.
---

A proof system that only ever says "yes" is worthless; the value is that it says "no"
to anything false. Swap in a leaf that is not there (`mallory`) and the fold starts
from a different leaf hash, so the recomputed root misses. Keep the right leaf but
nudge a single sibling hash by one bit (`0x6bfe63ee` to `0x6bfe63ef`) and the very
first `HashNode` diverges, cascading to a wrong root.

There is no way to patch up a bad input partway - the hash of the leaf and every
sibling all funnel into one root, so a single wrong ingredient anywhere breaks the
match. That is the tamper-evidence of a Merkle proof: an attacker who wants a forged
proof to verify would need to find a hash collision, which a real cryptographic hash
makes infeasible.
