---
project: build-an-lru-cache
lesson: 22
title: The same workload through the LFU cache
overview: Now run the identical workload through the LFU cache. Same operations, same capacity, but a frequency policy instead of a recency one - and it keeps a different key alive and evicts a different one.
goal: Run the same fixed workload through the LFU cache and assert its evictions, stats, and final contents.
spec:
  scenario: The LFU cache produces a different exact result on the same workload
  status: failing
  lines:
    - kw: Given
      text: 'a cache NewLFU(2) and the same workload Put(1,10), Put(2,20), Get(1), Get(1), Get(2), Put(3,30), Get(1), Get(2), Put(4,40)'
    - kw: When
      text: 'the workload runs in order and the stats are read'
    - kw: Then
      text: 'Evictions() is [2, 3], Hits() is 4, and Misses() is 1'
    - kw: And
      text: 'the cache then holds exactly keys 1 and 4 - a later Get(1) returns 10, true and Get(4) returns 40, true, while Get(2) and Get(3) miss'
code:
  lang: go
  source: |
    // reuse the same runner and the same op list, just a NewLFU(2).
    // trace the frequencies before Put(3,30):
    //   key 1 was used 3x (put + 2 gets), key 2 was used 2x (put + 1 get)
    //   so key 2 is the lowest frequency -> evicted, not key 1.
checkpoint: The LFU cache runs the same workload to its own exact result. Commit and stop here.
---

Feed the **same** nine operations to the LFU cache and it diverges the moment it has
to evict. Before `Put(3, 30)`, key 1 has been used three times (its insert plus two
`Get`s) and key 2 twice, so the least-frequently-used key is **2** - and the LFU
evicts key 2, exactly the key the LRU chose to keep. That one different decision
ripples out: `Get(1)` now **hits** where it missed under LRU, `Get(2)` now misses,
and `Put(4, 40)` evicts key 3. The LFU ends holding keys 1 and 4, having evicted
`[2, 3]`.

Notice the totals match the LRU - four hits, one miss - yet the *which* is different:
the two policies hit on different `Get`s and keep different keys. That is the subtle,
important truth about caches: two policies can post the same hit rate on one workload
and still behave completely differently, favouring recency versus frequency. The
runner and the op list are identical to the last lesson; only the constructor
changed, which is the whole argument for a shared interface. Next you put the two
side by side and assert the divergence directly.
