---
project: build-an-lru-cache
lesson: 11
title: Counting uses
overview: LRU asks "what did you touch last?" LFU asks "what do you touch most?" Today you start a second cache that counts how often each key is used, so a later lesson can evict the least-used one.
goal: Build an LFU cache where every entry tracks a use count that starts at 1 and rises on each use.
spec:
  scenario: Each entry counts its uses
  status: failing
  lines:
    - kw: Given
      text: 'a cache created with NewLFU(3) and Put(1, 10)'
    - kw: When
      text: 'Freq(1) is queried, then Get(1) is called twice'
    - kw: Then
      text: 'a fresh entry starts at Freq(1) = 1; after two Gets, Get(1) returns 10, true and Freq(1) = 3'
    - kw: And
      text: 'Put(2, 20) gives Freq(2) = 1, a Get(9) miss returns 0, false and leaves Freq(9) = 0 (misses do not count)'
code:
  lang: go
  source: |
    type entry struct { key, val, freq int }
    type LFU struct { cap int; data map[int]*entry }
    func NewLFU(cap int) *LFU { return &LFU{cap: cap, data: map[int]*entry{}} }
    func (c *LFU) Put(key, val int) {
      if e, ok := c.data[key]; ok { e.val = val; e.freq++; return } // update is a use
      c.data[key] = &entry{key: key, val: val, freq: 1} // new entries start at 1
    }
    func (c *LFU) Get(key int) (int, bool) {
      e, ok := c.data[key]
      if !ok { return 0, false }
      e.freq++
      return e.val, true
    }
    func (c *LFU) Freq(key int) int { if e, ok := c.data[key]; ok { return e.freq }; return 0 }
    func (c *LFU) Len() int { return len(c.data) } // mirror the LRU's Len/Cap
checkpoint: The LFU cache counts every use of a key, starting fresh entries at 1. Commit and stop here.
---

The LRU cache you just finished evicts by **recency** - what you touched least
recently. An **LFU** cache evicts by **frequency** - what you have used least
*often*. The two answer different questions and, as the capstone will show, disagree
about what to throw away. Everything downstream needs a use count, so that is what
today builds, in a fresh `LFU` type that starts life as a plain map like the LRU did.

The counting rules are small but exact. A brand-new entry starts at frequency **1** -
inserting it is its first use. Every `Get` that hits bumps the count, and a `Put`
onto an existing key is a use too, so it bumps the count as well as overwriting the
value. A **miss** counts for nothing: reading a key that is not present must not
conjure an entry or a frequency. Capacity is not enforced yet - a `Put` beyond the
limit just grows the map for now - because eviction needs the count to be in place
first, which is exactly what you now have.
