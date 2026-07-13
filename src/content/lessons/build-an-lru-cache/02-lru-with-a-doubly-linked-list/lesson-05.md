---
project: build-an-lru-cache
lesson: 5
title: The node and the sentinels
overview: To make recency O(1) you need a list you can insert into and unlink from in constant time - a doubly-linked list. Today you build it with sentinel head and tail nodes so there are never any nil edge cases, and you write the one move that puts a node at the front.
goal: Build a doubly-linked list with sentinel ends and add a node right after the head.
spec:
  scenario: Adding nodes to the front stacks them nearest the head
  status: failing
  lines:
    - kw: Given
      text: 'a fresh cache whose list holds only its two sentinels'
    - kw: When
      text: 'a node for key 1 is added to the front, then a node for key 2'
    - kw: Then
      text: 'walking the list from front to back (Chain) yields [2, 1] - the most recent is nearest the head'
    - kw: And
      text: 'on a brand-new cache, Chain yields [] - the head sentinel links straight to the tail'
code:
  lang: go
  source: |
    type node struct { key, val int; prev, next *node }
    // add head, tail *node to the LRU struct. Leave data/order as they are;
    // the list runs beside them until we wire it in next lessons.
    func NewLRU(cap int) *LRU {
      h, t := &node{}, &node{}
      h.next, t.prev = t, h // sentinels: real nodes always sit between them
      return &LRU{cap: cap, data: map[int]int{}, head: h, tail: t}
    }
    func (c *LRU) addFront(n *node) {
      n.prev, n.next = c.head, c.head.next
      c.head.next.prev, c.head.next = n, n
    }
    // Chain walks head.next .. tail collecting keys, for tests.
checkpoint: You have a sentinel-bounded doubly-linked list and can push a node to the front. Commit and stop here.
---

The FIFO cache used a slice for order, which is fine until you need to move a key
out of the middle in O(1) - a slice can't. A **doubly-linked list** can: every node
knows its `prev` and `next`, so unlinking or inserting is a couple of pointer
assignments regardless of size. That is the structure the whole LRU chapter runs on.

The trick that keeps the code clean is the **sentinels**: two dummy nodes, `head`
and `tail`, that always sit at the ends and hold no real data. Because a real node
always has a node on both sides, `addFront` and the removal to come never special-
case an empty list or a nil neighbour - the classic source of linked-list bugs. We
build the list beside the map today and exercise it directly with `Chain`, a walk
from front to back; the next lessons wire it into `Put` and `Get`. `addFront` links
a node in just after `head`, so the most recently added is always nearest the front.
