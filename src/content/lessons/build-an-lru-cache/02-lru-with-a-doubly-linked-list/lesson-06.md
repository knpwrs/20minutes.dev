---
project: build-an-lru-cache
lesson: 6
title: Unlink a node
overview: The other half of an O(1) list is taking a node out from anywhere - the front, the back, or the middle - in constant time. Today you write that unlink, the move that both eviction and promotion will lean on.
goal: Remove a node from the list in O(1) by splicing its neighbours together.
spec:
  scenario: A node unlinks cleanly from any position
  status: failing
  lines:
    - kw: Given
      text: 'a list built by adding nodes for keys 1, 2, 3 to the front, so Chain is [3, 2, 1]'
    - kw: When
      text: 'the middle node (key 2) is removed'
    - kw: Then
      text: 'Chain is [3, 1] and the remaining nodes still link both ways'
    - kw: And
      text: 'removing the front node (key 3) leaves [1], and removing that last node leaves [] with head linked straight to tail'
code:
  lang: go
  source: |
    // splice the node out: its neighbours point past it, both directions
    func (c *LRU) remove(n *node) {
      n.prev.next = n.next
      n.next.prev = n.prev
    }
    // because of the sentinels, n.prev and n.next are never nil,
    // even when n is the only real node in the list.
checkpoint: You can unlink any node from the list in O(1). Commit and stop here.
---

Insertion was half the list; **removal** is the other half. To take a node out you
make its two neighbours point at each other, skipping it: `n.prev.next = n.next`
and `n.next.prev = n.prev`. Two assignments, no scan - that is the whole reason a
doubly-linked list is the right structure for a cache, because you can pluck a key
out of the middle without walking to find it.

This is exactly where the **sentinels** pay off. Because `head` and `tail` always
bracket the real nodes, even the only node in the list has a non-nil `prev` and
`next` (the two sentinels), so `remove` needs no special case for the first, last,
or sole element. Confirm it from all three positions - middle, front, and the final
node - and notice you never wrote an `if`. Eviction (remove the tail's neighbour)
and promotion (remove, then re-add at the front) are both built on this one move.
