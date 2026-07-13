---
project: build-an-lru-cache
lesson: 21
title: A workload through the LRU cache
overview: Now the payoff begins. You define one scripted workload and run it through the LRU cache, asserting the exact eviction sequence, the hit and miss counts, and the exact final contents - the whole cache proven end to end on a real sequence of operations.
goal: Run a fixed workload through the LRU cache and assert its evictions, stats, and final contents.
spec:
  scenario: The LRU cache produces an exact result on the shared workload
  status: failing
  lines:
    - kw: Given
      text: 'a cache NewLRU(2) and the workload Put(1,10), Put(2,20), Get(1), Get(1), Get(2), Put(3,30), Get(1), Get(2), Put(4,40)'
    - kw: When
      text: 'the workload runs in order and the stats are read'
    - kw: Then
      text: 'Evictions() is [1, 3], Hits() is 4, and Misses() is 1'
    - kw: And
      text: 'the cache then holds exactly keys 2 and 4 - a later Get(2) returns 20, true and Get(4) returns 40, true, while Get(1) and Get(3) miss'
code:
  lang: go
  source: |
    // a shared interface both caches satisfy, so one runner drives either
    type Cache interface {
      Get(key int) (int, bool)
      Put(key, val int)
      Hits() int
      Misses() int
      Evictions() []int
    }
    // run applies the ops; capture Hits/Misses/Evictions BEFORE probing
    // contents, because a probing Get is itself a hit or a miss.
checkpoint: The LRU cache runs the full workload to an exact, asserted result. Commit and stop here.
---

The whole project has been building toward a cache you can trust on a real sequence,
so the capstone runs one. Trace it by hand once: with capacity 2, the early `Get`s
keep keys 1 and 2 warm, then `Put(3, 30)` evicts key **1** because it went longest
without a use after key 2 was touched. Later `Get(1)` misses (it is gone), `Get(2)`
hits, and `Put(4, 40)` evicts key **3**. The cache ends holding keys 2 and 4, having
evicted `[1, 3]` with four hits and one miss.

Two craft points make the assertions clean. First, a shared `Cache` **interface** -
`Get`, `Put`, `Hits`, `Misses`, `Evictions` - lets a single runner drive the LRU
today and the LFU next lesson, which is the point of keeping their surfaces parallel.
Second, read the counters **before** you probe the contents: a `Get` used to check
what survived is itself a hit or a miss and would inflate the tallies you just
asserted. Capture the numbers, then inspect the keys. This is the LRU cache, whole
and correct, on a workload you can reproduce.
