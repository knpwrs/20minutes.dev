---
project: build-an-lru-cache
lesson: 14
title: The frequency buckets
overview: Scanning every entry to find the minimum frequency is O(n) - too slow. The fix is to group keys by frequency into buckets, so a use just moves a key from one bucket to the next. Today you build those buckets and track which frequency is currently the smallest.
goal: Group keys into per-frequency lists and move a key up one bucket on each use.
spec:
  scenario: A use moves a key to the next frequency bucket
  status: failing
  lines:
    - kw: Given
      text: 'a cache NewLFU(3) with Put(1, 10) and Put(2, 20), both at frequency 1'
    - kw: When
      text: 'Get(1) is called'
    - kw: Then
      text: 'Freq(1) = 2 and Freq(2) = 1, and MinFreq() = 1 because key 2 still sits in the frequency-1 bucket'
    - kw: And
      text: 'Put(3, 30) adds another frequency-1 key: Freq(3) = 1 and MinFreq() stays 1'
code:
  lang: go
  source: |
    import "container/list"
    type entry struct { key, val, freq int; el *list.Element }
    type LFU struct {
      cap, minFreq int
      data    map[int]*entry
      buckets map[int]*list.List // freq -> keys, oldest use at the Front
    }
    // touch: move a key up a bucket on every use (Get hit, Put update, insert at 1)
    func (c *LFU) touch(e *entry) {
      c.buckets[e.freq].Remove(e.el)
      e.freq++
      if c.buckets[e.freq] == nil { c.buckets[e.freq] = list.New() }
      e.el = c.buckets[e.freq].PushBack(e.key)
      // recompute minFreq as the smallest non-empty bucket for now
    }
    // keep the scan-based evict from lesson 12, but also unlink the victim's
    // element from its bucket so the buckets stay consistent (lesson 16 makes
    // eviction read the buckets directly).
checkpoint: Keys live in per-frequency buckets, and a use moves a key up one bucket. Commit and stop here.
---

The O(n) scan for the minimum frequency is the thing to kill. The classic O(1) LFU
design does it with **frequency buckets**: a map from a frequency to an ordered list
of the keys that currently have that frequency. A key at frequency 2 lives in
bucket 2; use it and it moves to bucket 3. Because each bucket keeps its keys in
**use order** - oldest use at the front - the front of a bucket is the
least-recently-used key at that frequency, which is exactly the tie-breaker from the
last lesson, now encoded in the structure instead of a scan.

Each entry remembers its list element (`el`) so it can be removed from its bucket in
O(1), and `touch` unlinks a key from its current bucket and pushes it onto the back
of the next one. The cache also tracks `minFreq`, the smallest frequency any key
currently has - today just recomputed as the smallest non-empty bucket, which the
next lesson makes O(1). New keys go into bucket 1 at the back, and inserting sets
`minFreq` to 1. Confirm a use bumps a key's bucket while `minFreq` holds at 1
because another key is still down there.
