---
project: build-a-skip-list
lesson: 14
title: Lowering the list level
overview: When the tallest towers are deleted, the list's top express lanes go empty and searches waste steps dropping through them. Today you make delete lower the list level whenever its top lanes are left with nothing on them.
goal: After a delete, drop the list level while its highest lanes are empty.
spec:
  scenario: Emptying the top lanes lowers the list level
  status: failing
  lines:
    - kw: Given
      text: 'the list from seed 1 at level 3, whose only height-3 nodes are 1, 4, and 5'
    - kw: When
      text: 'Delete(1) then Delete(4) then Delete(5) are called in turn'
    - kw: Then
      text: 'after deleting 1 and after deleting 4 the level is still 3 (a height-3 node remains), but after deleting 5 the level drops to 2'
    - kw: And
      text: 'the remaining keys 2, 3, 7, 8, 9 are intact and searchable, with 2 now the tallest tower at height 2'
code:
  lang: go
  source: |
    // After unlinking, trim empty top lanes: while the list is above level 1
    // and the highest in-use lane has no node, drop one level.
    for s.level > 1 && s.head.forward[s.level-1] == nil {
      s.level--
    }
checkpoint: Delete lowers the list level when the top lanes empty. Commit and stop here.
---

The list `level` is meant to be the height of the tallest tower currently present,
because that is the lane a search should start on. Deletion can violate that: remove
the last height-3 node and level 2 (the index just below `level`) still claims to be
in use, so every search needlessly starts a lane too high and drops through an empty
express lane before doing any real work. The fix is a small trim after unlinking:
while the list is taller than level 1 and the head's pointer on the current top lane
is empty, lower `level` by one.

Because the head sentinel is the entry to every lane, `head.forward[s.level-1] == nil`
is exactly the test for "the top lane has no nodes." Deleting 1 and 4 leaves 5 still
holding level 2 (index 2), so the level stays 3; deleting 5 empties that lane and the
trim drops the list to level 2, where node 2 is now the tallest. The head sentinel
itself keeps its full `MaxLevel` height throughout - only the list's notion of its
current top moves. Delete is now complete and self-correcting.
