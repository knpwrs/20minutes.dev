---
project: build-an-lru-cache
lesson: 17
title: Per-entry expiry
overview: Real caches let an entry go stale after a while. Today you add a per-entry time-to-live to the LRU cache, driven by a logical clock you control, so a Get past an entry's expiry both misses and removes it.
goal: Give an entry a TTL so that a Get at or after its expiry time misses and evicts it.
spec:
  scenario: An expired entry misses and is removed on read
  status: failing
  lines:
    - kw: Given
      text: 'a cache NewLRU(2); SetNow(0); PutWithTTL(1, 10, 5) and Put(2, 20)'
    - kw: When
      text: 'the clock is moved with SetNow and key 1 is read at different times'
    - kw: Then
      text: 'at SetNow(4), Get(1) returns 10, true (not yet expired); at SetNow(5), Get(1) returns 0, false and the entry is removed, so Len() drops to 1'
    - kw: And
      text: 'a plain Put(2, 20) never expires - at SetNow(100), Get(2) still returns 20, true'
code:
  lang: go
  source: |
    // add expireAt int to node (0 means never); add clock int to LRU
    func (c *LRU) SetNow(t int) { c.clock = t }
    func (c *LRU) PutWithTTL(key, val, ttl int) {
      c.Put(key, val)
      c.data[key].expireAt = c.clock + ttl // expires once clock reaches this
    }
    func (c *LRU) Get(key int) (int, bool) {
      n, ok := c.data[key]
      if !ok { return 0, false }
      if n.expireAt != 0 && c.clock >= n.expireAt {
        c.remove(n); delete(c.data, n.key); return 0, false // stale: drop it
      }
      c.moveToFront(n); return n.val, true
    }
checkpoint: An entry with a TTL expires on read once the clock reaches its deadline. Commit and stop here.
---

An entry is not always worth keeping just because it fits - sometimes it is simply
too old. A **time-to-live** attaches a deadline to an entry: read it before the
deadline and it hits, read it at or after and it is stale. To keep this exactly
testable and fully offline, the cache carries a **logical clock** you set by hand
with `SetNow` rather than reading wall-clock time - so "five ticks later" is a call,
not a sleep, and every expiry lands on an exact value.

The expiry check lives in `Get`: an entry with a non-zero `expireAt` whose deadline
the clock has reached is treated as a **miss and removed on the spot** - lazy
expiry, the same approach Redis uses, where stale entries are reclaimed when touched
rather than swept eagerly. A plain `Put` sets no deadline, so those entries live
until evicted by capacity. Note that a TTL is a property of an entry, not of the
whole cache, so different keys can expire at different times, and the boundary is
`>=`: an entry with `expireAt` 5 is already gone at clock 5, not merely at 6.
