---
project: build-an-lru-cache
lesson: 3
title: Insertion order
overview: Eviction needs an order - some rule for which key is "first in line" to go. Today you record the order keys were first inserted, and confirm that neither a read nor an update changes it. That plain FIFO order is the baseline the LRU chapter will overturn.
goal: Track keys in the order they were first inserted, unaffected by reads or updates.
spec:
  scenario: Insertion order is fixed by first Put and nothing else
  status: failing
  lines:
    - kw: Given
      text: 'a fresh cache and Put(1, 10), Put(2, 20), Put(3, 30) in that order'
    - kw: When
      text: 'Order() is queried'
    - kw: Then
      text: 'it returns [1, 2, 3] - oldest first'
    - kw: And
      text: 'after Get(1) and after Put(2, 99), Order() is still [1, 2, 3] - neither a read nor an update reorders it'
code:
  lang: go
  source: |
    // append a key only the first time it is inserted
    type LRU struct {
      cap   int
      data  map[int]int
      order []int // keys, oldest first
    }
    func (c *LRU) Put(key, val int) {
      if _, ok := c.data[key]; !ok { c.order = append(c.order, key) }
      c.data[key] = val
    }
    func (c *LRU) Order() []int { return c.order }
checkpoint: The cache records insertion order, and reads and updates leave it untouched. Commit and stop here.
---

To evict, the cache needs a rule for **which key goes first**. The simplest honest
rule is insertion order: the key that has been in the cache longest is first in
line. So we keep a slice of keys, appending a key the first time it is inserted and
leaving it exactly where it is forever after. This is a **FIFO** (first-in,
first-out) cache, and it is deliberately dumb.

The point of today is the two things that do **not** move the order: a `Get` reads
a value without touching position, and a `Put` on an existing key updates the value
but does not re-append the key. In a FIFO cache, using a key buys it nothing - its
place in line is set the moment it arrives. Hold onto that, because the entire LRU
chapter is one idea: make a `Get` promote its key instead of leaving it alone. Once
you have felt how a fixed order behaves, the recency version will feel like an
obvious upgrade.
