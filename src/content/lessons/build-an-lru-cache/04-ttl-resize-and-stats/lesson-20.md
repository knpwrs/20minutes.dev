---
project: build-an-lru-cache
lesson: 20
title: Recording evictions
overview: To compare two eviction policies you need to see what each one threw away, in order. Today you make both caches record the key of every entry they evict, so the capstone can assert the exact eviction sequence.
goal: Record the key of each evicted entry, in eviction order, on both caches.
spec:
  scenario: Each cache logs the keys it evicts, in order
  status: failing
  lines:
    - kw: Given
      text: 'a NewLRU(2) running Put(1, 10), Put(2, 20), Put(3, 30), Put(4, 40)'
    - kw: When
      text: 'Evictions() is queried'
    - kw: Then
      text: 'it returns [1, 2] - key 1 evicted first, then key 2, in the order they left'
    - kw: And
      text: 'a NewLFU(2) running Put(1, 10), Put(2, 20), Get(1), Put(3, 30) has Evictions() = [2] - the lowest-frequency key'
code:
  lang: go
  source: |
    // add evicted []int to each cache.
    // LRU removeTail: c.evicted = append(c.evicted, lru.key) before deleting
    // LFU evict:      c.evicted = append(c.evicted, victim)  before deleting
    func (c *LRU) Evictions() []int { return c.evicted }
checkpoint: Both caches record the exact sequence of keys they evict. Commit and stop here.
---

Two caches with the same capacity, fed the same operations, will throw away
different keys - and the clearest way to see that is a **log of evictions in order**.
So each cache appends a key to an `evicted` slice at the moment it drops it: the LRU
in `removeTail`, the LFU in `evict`. The slice grows only on a genuine
capacity eviction, not on an ordinary overwrite or a resize-free `Put`, so it reads
as the honest history of what the policy sacrificed.

Order matters here, which is why it is a slice and not a set: the capstone will
assert not just *which* keys were evicted but the *sequence*, because the sequence is
where recency and frequency visibly part ways. Keep the append on the eviction path
only - a `Get` miss or a TTL expiry is a different kind of removal - so that
`Evictions()` means exactly "keys sacrificed to make room." With both caches now
recording hits, misses, and evictions, everything the capstone needs to run them
head to head is in place.
