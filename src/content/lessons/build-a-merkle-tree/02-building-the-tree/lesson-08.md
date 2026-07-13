---
project: build-a-merkle-tree
lesson: 8
title: Build to the root
overview: Repeatedly applying pairUp until one hash remains gives the Merkle root - one fingerprint for the whole dataset. Today you build the full tree and read its root.
goal: Build a tree by pairing up levels until a single root hash remains.
spec:
  scenario: Pairing up repeatedly yields a single root
  status: failing
  lines:
    - kw: Given
      text: 'the data ["alice", "bob", "carol", "dave"]'
    - kw: When
      text: 'Build creates the tree and its root is read'
    - kw: Then
      text: 'the root is 0xfd610c23'
    - kw: And
      text: 'Build of the three-item list ["alice", "bob", "carol"] has root 0xb019c95a'
code:
  lang: go
  source: |
    type Tree struct{ Levels [][]Hash } // Levels[0] = leaves, last = [root]
    func Build(data [][]byte) *Tree {
      levels := [][]Hash{leafHashes(data)}
      for len(levels[len(levels)-1]) > 1 {
        levels = append(levels, pairUp(levels[len(levels)-1]))
      }
      return &Tree{Levels: levels}
    }
    func (t *Tree) Root() Hash { return t.Levels[len(t.Levels)-1][0] }
checkpoint: A dataset builds all the way up to a single root hash. Commit and stop here.
---

The build loop is now obvious: start with the leaf level and keep calling `pairUp`
until only one hash is left. That last hash is the **Merkle root**, a single value
that depends on every leaf. Four leaves take two rounds (four to two to one); an odd
tree may promote a node partway up, but it still converges to one root.

Keep **all** the levels around, not just the root. The intermediate hashes are the
subtree roots you will need to generate inclusion proofs, verify consistency, and
diff two trees efficiently. Storing `Levels` as a slice of slices - leaves at the
bottom, the single root on top - gives every later chapter direct access to any node
by its level and position.
