---
project: build-a-skip-list
lesson: 13
title: Deleting a node from every level
overview: Deletion is insertion in reverse - find the predecessor at each level, then unlink the target from every level its tower reaches. Today you build the core of delete, splicing a node out cleanly wherever it appears.
goal: Remove a key by unlinking its node from each level of its tower using the update array.
spec:
  scenario: Delete unlinks a node from every level it appears on
  status: failing
  lines:
    - kw: Given
      text: 'the list from seed 1 holding 1, 2, 3, 4, 5, 7, 8, 9 (node 5 has height 3)'
    - kw: When
      text: 'Delete(5) is called'
    - kw: Then
      text: 'the ordered keys become 1, 2, 3, 4, 7, 8, 9, Len is 7, and Search(5) returns found false'
    - kw: And
      text: 'level 2 now links 1 then 4 (5 is gone from it), and level 1 links 1, 2, 4 - 5 is unlinked from all three of its levels'
code:
  lang: go
  source: |
    // Same descent to build update[]. Then, if the successor is the target,
    // for each level whose predecessor points AT the target, point past it.
    x = x.forward[0]
    if x != nil && x.key == key {
      for i := 0; i < s.level; i++ {
        if update[i].forward[i] == x { update[i].forward[i] = x.forward[i] }
      }
      s.length--
    }
checkpoint: The list can remove a node from every level of its tower. Commit and stop here.
---

Deletion reuses the exact descent that insertion does. You walk down the levels
building the `update` array of predecessors, then look at the node just ahead on
level 0. If it is the key you want gone, you unlink it: for **every** level, if the
predecessor there points straight at the target, redirect that pointer to skip over
it to whatever the target pointed at. A height-3 node like 5 is spliced out of all
three of its levels in one pass, and shorter towers ahead of it are untouched.

The guard `update[i].forward[i] == x` matters: a predecessor only needs rewiring on
the levels where it actually points at the target. On higher levels above the
target's tower, `update[i]` points somewhere else entirely and must be left alone.
Deleting 5 drops it from levels 0, 1, and 2, leaving 1 and 4 as the remaining tall
towers. One thing this does not yet handle is the list level dropping when the top
lane empties out - that is the next lesson.
