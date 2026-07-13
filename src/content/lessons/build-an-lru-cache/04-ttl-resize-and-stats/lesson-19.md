---
project: build-an-lru-cache
lesson: 19
title: Hit and miss stats
overview: You cannot tune a cache you cannot measure. Today you add hit and miss counters to both caches, so every Get is tallied - the raw numbers behind a cache's hit rate.
goal: Count cache hits and misses on both the LRU and the LFU cache.
spec:
  scenario: Every Get is tallied as a hit or a miss
  status: failing
  lines:
    - kw: Given
      text: 'a NewLRU(2) with Put(1, 10) and a NewLFU(2) with Put(1, 10)'
    - kw: When
      text: 'each cache runs Get(1), then Get(9), then Get(1)'
    - kw: Then
      text: 'the LRU reports Hits() = 2 and Misses() = 1'
    - kw: And
      text: 'the LFU reports Hits() = 2 and Misses() = 1'
code:
  lang: go
  source: |
    // add hits, misses int to each cache; return them from Hits()/Misses().
    // in Get, on the miss branch:  c.misses++
    //         on the hit branch:   c.hits++
    // for the LRU, an expired entry counts as a miss too.
checkpoint: Both caches count their hits and misses. Commit and stop here.
---

A cache lives or dies by its **hit rate**, and the hit rate is just two counters:
how many `Get`s found their key and how many did not. So both caches gain a `hits`
and a `misses` tally, incremented on the two branches of `Get` - hit when the key is
present and returned, miss when it is absent. For the LRU cache, an entry that has
**expired** is a miss as well, since from the caller's point of view the key was not
there to return.

These counters are pure observation - they never change what the cache stores or
evicts, only report what happened. That separation matters: measurement should not
perturb the thing measured. The numbers are the same shape for both caches here, but
over a real workload they diverge, because LRU and LFU keep different keys and so
hit on different `Get`s - which is exactly what the capstone measures. Adding the
same two counters to both caches also keeps their public surface parallel, so the
capstone can drive them through one interface.
