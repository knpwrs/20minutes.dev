---
project: build-a-merkle-tree
lesson: 9
title: The smallest trees
overview: The smallest trees are the ones to pin down carefully - a single leaf, two leaves, and no leaves at all. Today you nail those base cases.
goal: Define the root of a one-leaf, a two-leaf, and an empty tree.
spec:
  scenario: One-leaf, two-leaf, and empty trees have defined roots
  status: failing
  lines:
    - kw: Given
      text: 'the one-item tree Build(["alice"])'
    - kw: When
      text: 'its root is read'
    - kw: Then
      text: 'the root equals HashLeaf("alice"), which is 0x00063049 - a single leaf is its own root'
    - kw: And
      text: 'Build(["alice", "bob"]) has root 0xebb8e925, and Build of the empty list has root 0x00000000'
code:
  lang: go
  source: |
    // Build(["alice"]) -> Levels == [[0x00063049]], Root == 0x00063049
    // Build(["alice","bob"]) -> Root == HashNode(0x00063049, 0x6bfe63ee)
    // Build([]) -> no leaves; Root reports 0x00000000 rather than panicking
    func (t *Tree) Root() Hash {
      top := t.Levels[len(t.Levels)-1]
      if len(top) == 0 { return 0 }
      return top[0]
    }
checkpoint: One-leaf, two-leaf, and empty trees all have a defined, tested root. Commit and stop here.
---

Base cases are where off-by-one bugs hide, so pin them now. A **single leaf** is
already a complete tree: with nothing to pair it against, the build loop never runs
and the leaf hash *is* the root - no internal-node prefix involved. **Two leaves**
is the smallest real tree, one `HashNode` over the pair. And the **empty** dataset
has no leaves at all; rather than crash, define its root as the zero hash
`0x00000000` so callers get a sane value.

These edges keep the rest of the project honest. A one-leaf root that equals the
leaf hash confirms promotion and the build loop agree; a defined empty root means
later code that builds a tree from user input will not panic on nothing. Small trees,
carefully specified, are worth a whole lesson.
