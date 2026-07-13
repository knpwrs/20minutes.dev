---
project: build-an-lru-cache
lesson: 4
title: Evict the oldest when full
overview: Now the capacity earns its keep. When the cache is full and a new key arrives, something has to go - and in a FIFO cache the victim is the oldest key. Today you make Put evict, and pin the extreme case of a capacity-1 cache.
goal: When at capacity, evict the oldest key before inserting a new one.
spec:
  scenario: A full FIFO cache evicts its oldest key
  status: failing
  lines:
    - kw: Given
      text: 'a cache created with NewLRU(2) holding Put(1, 10) then Put(2, 20)'
    - kw: When
      text: 'Put(3, 30) is called while the cache is full'
    - kw: Then
      text: 'key 1 is evicted: Get(1) returns 0, false; Get(2) returns 20, true; Get(3) returns 30, true; Len() is 2 and Order() is [2, 3]'
    - kw: And
      text: 'with NewLRU(1), after Put(1, 10) then Put(2, 20) only key 2 remains - Get(1) misses and Len() is 1'
code:
  lang: go
  source: |
    // before inserting a brand-new key into a full cache, drop the oldest
    func (c *LRU) Put(key, val int) {
      if _, ok := c.data[key]; ok { c.data[key] = val; return } // update in place
      if len(c.data) >= c.cap {
        victim := c.order[0]        // oldest is first in line
        c.order = c.order[1:]
        delete(c.data, victim)
      }
      c.order = append(c.order, key)
      c.data[key] = val
    }
checkpoint: A full cache evicts its oldest entry to make room, down to capacity 1. Commit and stop here.
---

This is the moment a bounded cache becomes real: at capacity, inserting a new key
means **evicting** an old one. In FIFO order the victim is `order[0]` - the key that
has waited longest - so `Put` drops it from both the order slice and the map before
appending the newcomer. An **update** to an existing key still takes the early
return: it changes a value without inserting, so it never triggers eviction.

Pin the **capacity-1** case too, because it is the boundary where the logic is
tightest: a cache that holds a single entry must evict on every single new key, so
the cache only ever remembers the most recent insert. If your eviction is off by
one - evicting after inserting, or comparing `>` instead of `>=` - capacity 1 is
where it breaks first. Get that edge right and the general case follows.
