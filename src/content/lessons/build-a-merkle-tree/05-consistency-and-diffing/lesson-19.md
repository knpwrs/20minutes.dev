---
project: build-a-merkle-tree
lesson: 19
title: Append-only, the prefix survives
overview: Appending leaves to a Merkle tree never disturbs the earlier ones - the old root reappears as a subtree of the bigger tree. Today you pin that append-only property.
goal: Show that a smaller tree's root reappears as a subtree root of the extended tree.
spec:
  scenario: An append leaves the old prefix subtree unchanged
  status: failing
  lines:
    - kw: Given
      text: 'Build(["alice", "bob"]) with root 0xebb8e925'
    - kw: When
      text: 'two leaves are appended to make Build(["alice", "bob", "carol", "dave"]) and its subtree root over [0, 2) is read'
    - kw: Then
      text: 'that subtree root is 0xebb8e925 - identical to the smaller tree root'
    - kw: And
      text: 'the appended leaves changed the overall root but left the first-two-leaf subtree hash untouched'
code:
  lang: go
  source: |
    old := Build([][]byte{[]byte("alice"), []byte("bob")}).Root() // 0xebb8e925
    big := Build([][]byte{[]byte("alice"), []byte("bob"),
      []byte("carol"), []byte("dave")})
    same := big.SubtreeRoot(0, 2) // 0xebb8e925 == old
checkpoint: An appended tree keeps the earlier leaves' subtree hash unchanged. Commit and stop here.
---

A Merkle tree over an **append-only** log has a lovely property: adding new leaves at
the end never changes the hashes covering the old leaves. The two-leaf tree's root,
`0xebb8e925`, reappears verbatim as the `[0, 2)` subtree of the four-leaf tree, because
those first two leaves - and therefore the node above them - were untouched by the
append. The overall root changed, but the old prefix is still in there, intact.

This is why systems that must prove they never rewrite history, like Certificate
Transparency logs and Git, love Merkle trees: the past is structurally frozen. If any
old leaf *had* been altered, that prefix subtree hash would differ. Next lesson turns
this observation into a **consistency proof** - a way for someone holding only the old
root to confirm a new tree is a genuine append and not a rewrite.
