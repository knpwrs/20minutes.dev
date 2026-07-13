---
project: build-an-lru-cache
lesson: 13
title: Break ties by recency
overview: Often several keys share the lowest use count, and the scan has to pick one. LFU breaks that tie the LRU way - among the least-frequently-used, evict the one used least recently. Today you add the recency tie-breaker.
goal: When several keys share the minimum frequency, evict the least-recently-used among them.
spec:
  scenario: A frequency tie is broken by least-recently-used
  status: failing
  lines:
    - kw: Given
      text: 'a cache NewLFU(2) with Put(1, 10), Put(2, 20), then Get(1) and Get(2), so both keys reach frequency 2'
    - kw: When
      text: 'Put(3, 30) is called while the cache is full'
    - kw: Then
      text: 'key 1 is evicted, not key 2: among the tied keys, key 1 was used less recently (its Get came before key 2 was) - Get(1) is 0, false while Get(2) is 20, true and Get(3) is 30, true'
    - kw: And
      text: 'if the two Gets are swapped to Get(2) then Get(1), key 2 is evicted instead - recency decides the tie'
code:
  lang: go
  source: |
    // give each entry a "last used" stamp from a rising counter
    type entry struct { key, val, freq, tick int }
    // bump c.clock and store it on every use (insert, Get hit, Put update)
    // evict: pick the lowest freq; among equal freq, the smallest tick
    //   if e.freq < min || (e.freq == min && e.tick < bestTick) { ... }
checkpoint: Frequency ties are broken by least-recently-used. Commit and stop here.
---

A pure frequency count is not a total order - lots of keys sit at frequency 1, or 2,
or 3 - so eviction needs a tie-breaker, and the standard choice folds LRU into LFU:
among the keys with the **lowest frequency**, evict the one used **least recently**.
It is the best of both signals - frequency first, recency as the decider - and it is
exactly what the real O(1) LFU design encodes structurally.

To know "least recently used" you need a recency stamp, so add a rising `clock` to
the cache and a `tick` to each entry, writing the current clock onto an entry on
every use: its insert, a `Get` hit, and a `Put` update. Then the scan takes two
keys into account - smallest frequency wins, and on a tie the smallest `tick` (the
oldest use) wins. Prove it decides the outcome by swapping the two `Get`s: the same
frequencies, a different recency, and the victim flips. This recency-within-frequency
rule is the behaviour the next lessons must preserve while making eviction O(1).
