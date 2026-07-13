---
project: build-an-lru-cache
lesson: 16
title: Eviction in O(1)
overview: With buckets and minFreq in place, eviction is a single lookup, since the victim is at the front of the minimum-frequency bucket. Today you replace the O(n) scan with that O(1) move and watch a well-used key survive while a cold one is dropped.
goal: Evict the front of the minFreq bucket in O(1), replacing the linear scan.
spec:
  scenario: The least-used key is evicted while frequent keys survive
  status: failing
  lines:
    - kw: Given
      text: 'a cache NewLFU(3) with Put(1, 10), Put(2, 20), Put(3, 30), then Get(1), Get(2), Get(1) - so Freq(1) = 3, Freq(2) = 2, Freq(3) = 1 and MinFreq() = 1'
    - kw: When
      text: 'Put(4, 40) is called while the cache is full'
    - kw: Then
      text: 'key 3 - alone at the minimum frequency - is evicted, so Get(3) returns 0, false and Freq(3) is 0, while keys 1, 2, and 4 remain (Freq(1), Freq(2), Freq(4) are all non-zero) and Len() is 3'
    - kw: And
      text: 'the new key 4 enters at Freq(4) = 1 and MinFreq() = 1 (check these before any further Get, which would count as a use)'
code:
  lang: go
  source: |
    // the victim is the least-recently-used key at the lowest frequency:
    // the Front of the minFreq bucket. O(1), no scan.
    func (c *LFU) evict() {
      l := c.buckets[c.minFreq]
      front := l.Front()
      victim := front.Value.(int)
      l.Remove(front)
      delete(c.data, victim)
    }
    // Put still calls evict() before inserting a new key into a full cache.
checkpoint: The LFU cache evicts in O(1) from the front of the minimum-frequency bucket. Your LFU cache is complete. Commit and stop here.
---

Everything the last three lessons built was to make this one line cheap. The
eviction victim is the least-frequently-used key, and on a tie the least-recently-used
among them - which is precisely the **front of the `minFreq` bucket**, because that
bucket holds exactly the lowest-frequency keys in use order. So `evict` grabs that
front element, unlinks it, and deletes it from the map: one lookup, no scan, O(1).

The scenario shows LFU's whole personality. Keys 1 and 2 were used repeatedly, key 3
only on insert, so when the fourth key needs room it is key 3 - the cold one - that
goes, even though key 1 was inserted first. An LRU cache would have made a different
call, and that difference is the story of the capstone. With insert, use, and
eviction all constant time, you now have two complete caches: an LRU driven by
recency and an LFU driven by frequency. Next you give them shared conveniences - TTL,
resize, and stats - then run them head to head.
