---
project: build-a-merkle-tree
lesson: 23
title: 'Capstone: build, prove, tamper, diff'
overview: The finale runs the whole library at once - build a tree, prove a leaf belongs, tamper with the data, show the tamper is caught, and diff the two versions to name the changed leaf.
goal: Run a full build, prove, verify, tamper, and diff workflow and assert every result.
spec:
  scenario: The full workflow proves membership and catches a tamper
  status: failing
  lines:
    - kw: Given
      text: 'v1 = ["alice", "bob", "carol", "dave"] with root 0xfd610c23, and a proof for "bob" (leaf 1) of [(0x00063049, left), (0x1cde9a86, right)]'
    - kw: When
      text: 'leaf 2 is tampered to make v2 = ["alice", "bob", "trent", "dave"] and everything is re-checked'
    - kw: Then
      text: 'VerifyProof of "bob" against the v1 root is true, the v2 root is 0xa10cca2a which differs from v1, and the old proof for "carol" fails against the v2 root'
    - kw: And
      text: 'Diff(v1, v2) reports exactly [2] - the one leaf that changed'
code:
  lang: go
  source: |
    v1 := Build(data("alice", "bob", "carol", "dave"))
    pb := v1.Prove(1)                              // proof for "bob"
    VerifyProof(v1.Root(), []byte("bob"), pb)      // true
    v2 := Build(data("alice", "bob", "trent", "dave"))
    v2.Root()                                       // 0xa10cca2a != v1.Root()
    VerifyProof(v2.Root(), []byte("carol"), v1.Prove(2)) // false: tamper caught
    Diff(v1, v2)                                    // [2]
checkpoint: Your Merkle tree library builds, proves, detects tampering, and diffs versions. The project is complete; commit and stop here.
---

This is the promise the whole project was built to keep: a real **Merkle tree**
library. The script exercises every layer at once. `Build` condenses four items into
the root `0xfd610c23`. `Prove` and `VerifyProof` show that `bob` can be proven a member
from just two sibling hashes, without the rest of the data. Then a tamper - `carol`
becomes `trent` - flips the root to `0xa10cca2a`, and the old inclusion proof for
`carol`, which verified a moment ago, now fails against the new root. Finally `Diff`
pinpoints that leaf 2, and only leaf 2, changed.

From a single deterministic hash you built content-addressed leaves, a tree that
fingerprints a whole dataset, audit proofs that demonstrate membership in `log n`
hashes, a consistency check for append-only logs, and an efficient diff - the same
machinery inside Git, Certificate Transparency, Bitcoin, and peer-to-peer sync, minus
the real cryptographic hash they swap in for FNV-1a. The structure is hash-agnostic, so
that swap is the only change between this and the production article. That is a real
Merkle tree, and it is yours.
