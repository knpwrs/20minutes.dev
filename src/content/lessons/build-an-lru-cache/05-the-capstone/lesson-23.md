---
project: build-an-lru-cache
lesson: 23
title: 'Capstone: where LRU and LFU diverge'
overview: The finale puts both caches side by side on one workload and asserts exactly where they part ways - the same insert evicts a different key, and each cache ends holding a key the other threw away. Two policies, one workload, a provable divergence.
goal: Run both caches on the same workload and assert the exact point and result of their divergence.
spec:
  scenario: One workload, two policies, a divergent outcome
  status: failing
  lines:
    - kw: Given
      text: 'a NewLRU(2) and a NewLFU(2) each run the shared workload Put(1,10), Put(2,20), Get(1), Get(1), Get(2), Put(3,30), Get(1), Get(2), Put(4,40)'
    - kw: When
      text: 'their eviction logs and final contents are compared'
    - kw: Then
      text: 'the first eviction differs: the LRU evicts key 1 while the LFU evicts key 2 (Evictions are [1,3] versus [2,3])'
    - kw: And
      text: 'the caches end with different survivors: the LRU holds key 2 but not key 1, while the LFU holds key 1 but not key 2 - each keeps exactly what the other discarded'
code:
  lang: go
  source: |
    lru, lfu := NewLRU(2), NewLFU(2)
    for _, o := range workload { run one op on each }
    // lru.Evictions()[0] == 1 ; lfu.Evictions()[0] == 2
    // lru: Get(2) hits, Get(1) misses
    // lfu: Get(1) hits, Get(2) misses
checkpoint: You have proven, on one workload, exactly where least-recently-used and least-frequently-used diverge. The project is complete; commit and stop here.
---

This is the sentence the whole project was written to earn: on one identical
workload, **recency and frequency disagree about what to throw away**. At the first
eviction, the LRU drops key 1 - untouched longest - while the LFU drops key 2 - used
least often - and from there the caches keep mirror-image contents: the LRU ends with
key 2, the LFU with key 1, each holding precisely the key the other discarded. Same
capacity, same operations, opposite survivors.

That divergence is not a bug in either policy; it is the reason both exist. Recency
bets that what you touched last you will touch again soon; frequency bets that what
you used most you will use most. Real systems like Redis and Caffeine let you choose,
or blend the two, precisely because neither is universally right. You have built both
from first principles - a hashmap and a doubly-linked list for O(1) recency, a
frequency-bucket list and a `minFreq` pointer for O(1) frequency - with TTL, resize,
and stats on top. Two real caches, and a clear-eyed view of exactly how they differ.
That is a genuinely useful thing to have built, and it is yours.
