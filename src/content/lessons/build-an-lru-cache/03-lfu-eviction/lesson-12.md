---
project: build-an-lru-cache
lesson: 12
title: Evict the least-frequently-used
overview: With use counts in hand, eviction becomes clear, and when the cache is full it throws away the key with the smallest count. Today you make the LFU cache enforce its capacity by dropping the least-used entry.
goal: When at capacity, evict the entry with the lowest frequency before inserting a new key.
spec:
  scenario: A full LFU cache drops its least-used key
  status: failing
  lines:
    - kw: Given
      text: 'a cache NewLFU(2) with Put(1, 10) then Put(2, 20), followed by Get(1) so Freq(1) = 2 and Freq(2) = 1'
    - kw: When
      text: 'Put(3, 30) is called while the cache is full'
    - kw: Then
      text: 'key 2 (the lowest frequency) is evicted, so Get(2) is 0, false while Get(1) is 10, true, and Len() is 2'
    - kw: And
      text: 'the new key 3 is present at Freq(3) = 1 - a freshly inserted key starts at frequency 1'
code:
  lang: go
  source: |
    // scan for the lowest-frequency key and drop it
    func (c *LFU) evict() {
      victim, min := 0, int(^uint(0)>>1) // max int
      for k, e := range c.data {
        if e.freq < min { min, victim = e.freq, k }
      }
      delete(c.data, victim)
    }
    // in Put, before inserting a brand-new key:
    //   if len(c.data) >= c.cap { c.evict() }
checkpoint: A full LFU cache evicts its least-frequently-used entry. Commit and stop here.
---

Frequency counts exist to answer one question: when the cache is full and a new key
arrives, **who has earned the least right to stay?** In an LFU cache that is the key
with the smallest use count. So `Put`, before inserting a brand-new key into a full
cache, scans for the minimum frequency and deletes that entry - the naive O(n) way
for now, made O(1) later in the chapter.

Keep the update path honest: a `Put` onto an *existing* key still just overwrites and
counts a use, never evicting, because it does not grow the cache. And a freshly
inserted key starts at frequency 1, which means it is immediately the most
vulnerable entry - a brand-new key can be evicted on the very next insert if
everything else has been used more. That "cold start" is a real weakness of pure
LFU, and it is why the tie-breaking rule in the next lesson matters: when several
keys share the lowest count, you need a principled way to choose between them.
