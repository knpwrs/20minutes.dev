---
project: build-an-lru-cache
lesson: 8
title: A hit promotes its node
overview: This is the lesson the whole chapter was built for - the one change that turns FIFO into LRU. A successful Get moves its node to the front, marking it most-recently-used, while a miss touches nothing.
goal: On a cache hit, move the node to the front; on a miss, leave the list unchanged.
spec:
  scenario: Reading a key promotes it; a miss disturbs nothing
  status: failing
  lines:
    - kw: Given
      text: 'a cache NewLRU(3) holding Put(1, 10), Put(2, 20), Put(3, 30) so Order is [1, 2, 3]'
    - kw: When
      text: 'Get(1) is called'
    - kw: Then
      text: 'Get(1) returns 10, true and Order becomes [2, 3, 1] - key 1 is now most-recently-used, furthest from eviction'
    - kw: And
      text: 'a following Get(9) misses (0, false) and leaves Order as [2, 3, 1] - a miss never reorders'
code:
  lang: go
  source: |
    // moveToFront = unlink, then re-add at the head (both O(1))
    func (c *LRU) moveToFront(n *node) { c.remove(n); c.addFront(n) }
    func (c *LRU) Get(key int) (int, bool) {
      n, ok := c.data[key]
      if !ok { return 0, false } // a miss changes nothing
      c.moveToFront(n)           // a hit is a use: promote it
      return n.val, true
    }
checkpoint: A cache hit promotes its entry to most-recently-used; a miss leaves the order alone. Commit and stop here.
---

Least-recently-used means the cache keeps what you have **touched** most recently
and throws away what you have ignored longest. So a `Get` is not a passive read - it
is a **use**, and it must reorder. `moveToFront` is just the two moves you already
have, back to back: `remove` the node from wherever it sits, then `addFront` it, so
it becomes the most-recently-used entry and the furthest from the tail-end eviction.

The mirror-image rule matters just as much: a **miss changes nothing**. If the key
is not present there is no node to promote, and the recency order of the keys that
*are* present must be left exactly as it was. This is where the cache stops being
FIFO: with promotion in place, the eviction victim is no longer the oldest insert
but the **least-recently-used** key - and the earlier lesson's assumption that a
read leaves order untouched no longer holds, which is the point.
