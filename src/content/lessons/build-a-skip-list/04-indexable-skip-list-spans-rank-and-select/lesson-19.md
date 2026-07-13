---
project: build-a-skip-list
lesson: 19
title: The span on each forward pointer
overview: To find a key's position or the k-th element quickly, each forward pointer needs to know how far it jumps. Today you add a span to every pointer - the number of level-0 steps it skips - and compute them by walking the finished list.
goal: Give each forward pointer a span and fill them all in by numbering the nodes along level 0.
spec:
  scenario: Each pointer's span counts the level-0 steps it covers
  status: failing
  lines:
    - kw: Given
      text: 'the list from seed 1 holding 1, 2, 3, 4, 5, 7, 8, 9, with spans computed'
    - kw: When
      text: "the spans are inspected"
    - kw: Then
      text: "every level-0 pointer has span 1, the head's level-2 pointer (to node 1) has span 1, and node 1's level-2 pointer has span 3 - it skips over 2 and 3 to land on 4"
    - kw: And
      text: "node 2's level-1 pointer (to node 4) has span 2, and node 4's level-2 pointer (to node 5) has span 1"
code:
  lang: go
  source: |
    // Add span[] alongside forward[] on each node. Number nodes by level-0
    // position: head = 0, first node = 1, ... Then a pointer's span is the
    // difference in positions between its target and its owner.
    //   span[i] = position(forward[i]) - position(self)
    // A pointer that runs off the end skips the rest: length - position(self).
    type node struct {
      key, val int
      forward  []*node
      span     []int
    }
checkpoint: Every forward pointer carries the count of level-0 steps it covers. Commit and stop here.
---

A plain skip list can find a key but cannot cheaply answer "how many keys come
before it?" or "what is the 100th key?" - answering those means counting, and
counting on level 0 is linear. The fix is to annotate each forward pointer with its
**span**: the number of level-0 steps that pointer represents. On level 0 every
pointer moves to the immediate next node, so its span is always 1. On the express
lanes a pointer leaps over several nodes, and its span is how many level-0 positions
it covers - so node 1's level-2 pointer, which jumps past 2 and 3 to reach 4, has
span 3.

Today you just add the `span` slice to the node and fill it by walking: number each
node by its position on level 0 (the head is 0, the first real node is 1, and so on),
then set every pointer's span to the difference between its target's position and its
own. A pointer that runs off the end of a lane covers all the remaining level-0
nodes. Computing spans by a full walk is the honest starting point; the next lesson
maintains them incrementally so no rebuild is ever needed. The invariant to hold onto
is simple: **the spans along any path from the head to a node sum to that node's
position.** That is the fact rank and select will exploit.
