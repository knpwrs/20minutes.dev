---
project: build-a-skip-list
lesson: 21
title: Maintaining spans on delete
overview: Delete has to fix spans too - when a node is unlinked, the pointer that now jumps over its old position must absorb the node's own spans. Today you keep spans correct through deletion so rank and select stay trustworthy.
goal: Update spans inside delete so removing a node leaves every span correct.
spec:
  scenario: Delete merges the removed node's spans into its predecessors
  status: failing
  lines:
    - kw: Given
      text: 'the list from seed 1 holding 1, 2, 3, 4, 5, 7, 8, 9 with spans maintained (node 4 is height 3, node 5 is height 3)'
    - kw: When
      text: 'Delete(5) is called'
    - kw: Then
      text: "node 4's level-2 pointer now spans 3 (it took over the reach 5 used to cover to the end) and its level-1 pointer spans 3 as well"
    - kw: And
      text: 'every level-0 pointer still spans 1 and the head-to-node position sums still hold - matching a full recompute'
code:
  lang: go
  source: |
    // For each level where the predecessor pointed AT the removed node x,
    // the pointer now reaches past it, absorbing x's span there (minus the
    // one level-0 node that vanished):
    //   update[i].span[i] += x.span[i] - 1
    // On levels above x's tower, one fewer node lies ahead:
    //   update[i].span[i]--
    // Then trim empty top lanes as before.
checkpoint: Delete maintains spans incrementally. Commit and stop here.
---

Deletion is the mirror of insertion for spans. When you unlink a node, the
predecessor pointer that used to land on it now jumps to whatever the node pointed at,
so it must **absorb** the span the node contributed on that level - but the node
itself no longer counts as a step, so you subtract one: `update[i].span[i] +=
x.span[i] - 1`. On the levels **above** the removed tower, the predecessor's pointer
was already jumping over the node, and now there is simply one fewer node in that
jump, so its span decrements.

Deleting height-3 node 5 shows both cases: on levels 0, 1, and 2, node 4's pointers
each swallow 5's remaining reach; there are no levels above 5's tower here, so no
decrement is needed. The result is that node 4's level-2 pointer, which used to skip
just to 5, now spans all the way to the end of that lane. With spans maintained
through both insert and delete, the position invariant holds after every mutation -
and that is the foundation the last two query lessons stand on: rank and select.
