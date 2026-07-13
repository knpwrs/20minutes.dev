---
project: build-a-merkle-tree
lesson: 10
title: A changed leaf flips the root
overview: The reason a Merkle root is useful is that changing any leaf, even by one byte, changes the root. Today you prove that tamper-evidence.
goal: Show that altering a single leaf changes the root.
spec:
  scenario: Any leaf change produces a different root
  status: failing
  lines:
    - kw: Given
      text: 'Build(["alice", "bob", "carol", "dave"]) with root 0xfd610c23'
    - kw: When
      text: 'the last leaf "dave" is changed by one byte to "davf" and the tree is rebuilt'
    - kw: Then
      text: 'the new root is 0x5dec2b22, which differs from 0xfd610c23'
    - kw: And
      text: 'changing "carol" to "trent" instead gives root 0xa10cca2a, also different from the original'
code:
  lang: go
  source: |
    orig := Build([][]byte{[]byte("alice"), []byte("bob"),
      []byte("carol"), []byte("dave")}).Root()
    oneByte := Build([][]byte{[]byte("alice"), []byte("bob"),
      []byte("carol"), []byte("davf")}).Root()
    // orig != oneByte  (0xfd610c23 vs 0x5dec2b22)
checkpoint: Any change to any leaf produces a different root. Commit and stop here.
---

Here is the payoff of everything so far. Because a leaf hash changes completely when
its data changes, and because that hash feeds into a parent, which feeds into the
root, **any** alteration to **any** leaf changes the root. A one-byte edit deep in
the data - `dave` to `davf` - lands on a totally different root than the original.
This is why one small root can stand in for a whole dataset.

The change does not have to be large to be caught; that is the point of pinning the
one-byte case at the boundary. Nothing about the root hints at *what* changed or
*where* - it only shouts "something differs". Finding out precisely which item moved
is what proofs and diffs, later in the project, are for. For now, the root is a
tamper alarm.
