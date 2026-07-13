---
project: build-an-lru-cache
lesson: 7
title: Run the cache on the list
overview: Time to wire the list into the cache itself. You swap the value map for a map from key to node, insert new entries at the front, and evict from the tail - so every Get, Put, and eviction is O(1). The map still stores insertion order, so behaviour matches the FIFO cache exactly.
goal: Rebuild Put and Get on the node list, inserting at the front and evicting the tail.
spec:
  scenario: The list-backed cache stores, retrieves, and evicts like before
  status: failing
  lines:
    - kw: Given
      text: 'a cache created with NewLRU(2) holding Put(1, 10) then Put(2, 20)'
    - kw: When
      text: 'Get(1) is called and then Put(3, 30)'
    - kw: Then
      text: 'Get(1) returns 10, true (a read does not yet promote); Put(3, 30) evicts the tail key 1, so Get(1) is 0, false, Get(3) is 30, true, Len() is 2 and Order() is [2, 3]'
    - kw: And
      text: 'with NewLRU(1), Put(1, 10) then Put(2, 20) leaves only key 2 - the tail is evicted on every new key'
code:
  lang: go
  source: |
    // data now maps key -> *node; the order slice is gone.
    func (c *LRU) Put(key, val int) {
      if n, ok := c.data[key]; ok { n.val = val; return } // update in place, no move yet
      if len(c.data) >= c.cap { c.removeTail() }
      n := &node{key: key, val: val}
      c.addFront(n); c.data[key] = n
    }
    func (c *LRU) removeTail() { lru := c.tail.prev; c.remove(lru); delete(c.data, lru.key) }
    func (c *LRU) Get(key int) (int, bool) {
      if n, ok := c.data[key]; ok { return n.val, true }
      return 0, false
    }
    // Order now walks tail -> head so the eviction victim comes first.
checkpoint: The cache stores, retrieves, and evicts entirely on the node list, all O(1). Commit and stop here.
---

Everything so far has been preparation; now the list becomes the cache. The value
map turns into a **map from key to `*node`**, so a `Get` is a map lookup that hands
back the node's value in O(1), and the order slice disappears entirely because the
list *is* the order. `Put` builds a node, links it at the front with `addFront`, and
records it in the map. When the cache is full, `removeTail` unlinks `tail.prev` - the
node furthest from the front - and deletes it from the map.

Because new nodes go to the front and eviction takes the back, the front-to-back
order is newest-to-oldest, so `Order` now walks **tail to head** to report the
eviction victim first - and that keeps its results identical to the FIFO cache:
oldest first, evict the oldest. A `Get` still does not move anything and an update
still stays in place; the behaviour is unchanged, but every operation is now
constant time. That reordering - making a `Get` promote its node - is the single
change that turns this FIFO cache into an LRU cache, and it is the very next lesson.
