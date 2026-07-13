---
project: build-a-merkle-tree
lesson: 21
title: Diffing two trees
overview: Comparing two roots tells you something changed; comparing subtree hashes tells you where. Today you diff two trees by walking down only where hashes differ.
goal: Find which leaf changed by walking the two trees down where subtree hashes differ.
spec:
  scenario: Diff locates a single changed leaf
  status: failing
  lines:
    - kw: Given
      text: 'two trees over ["alice", "bob", "carol", "dave"] and ["alice", "bob", "trent", "dave"]'
    - kw: When
      text: 'Diff walks both trees from the root'
    - kw: Then
      text: 'it reports the changed leaf indices [2]'
    - kw: And
      text: 'Diff of a tree against an identical tree reports an empty list - equal roots need no walk'
code:
  lang: go
  source: |
    func Diff(a, b *Tree) []int {
      var out []int
      var walk func(level, idx int)
      walk = func(level, idx int) {
        if a.Levels[level][idx] == b.Levels[level][idx] { return } // subtree equal, prune
        if level == 0 { out = append(out, idx); return }
        walk(level-1, 2*idx)
        walk(level-1, 2*idx+1)
      }
      walk(len(a.Levels)-1, 0)
      return out
    }
checkpoint: Diff walks down where subtree hashes differ and reports the changed leaf. Commit and stop here.
---

If two trees have the same root, they hold identical data - no need to look further.
If the roots differ, the change is somewhere below, and the subtree hashes tell you
where: descend into a child only when its hash differs between the two trees. Any
subtree whose hash matches is provably identical and gets skipped whole. Follow the
mismatches down to level 0 and you arrive at exactly the leaves that changed.

This is the **git/rsync trick** for syncing data cheaply. Rather than compare every
item, you compare `O(log n)` hashes per changed leaf and prune entire unchanged
branches at the top. Here, changing `carol` to `trent` makes the root differ, then the
right subtree differ, then leaf 2 differ - and the walk reports `[2]`. Two identical
trees short-circuit at the root and report nothing.
