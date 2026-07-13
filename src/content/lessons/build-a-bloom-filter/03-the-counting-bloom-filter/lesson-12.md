---
project: build-a-bloom-filter
lesson: 12
title: Counters instead of bits
overview: A plain Bloom filter can never remove an item, because clearing a bit might erase some other item sharing it. The counting Bloom filter fixes this by replacing each bit with a small counter. Today you build that array and its Add.
goal: Build a counting filter whose Add increments the k counters, and whose Contains checks all k are above zero.
spec:
  scenario: Adding raises counters; membership checks they are nonzero
  status: failing
  lines:
    - kw: Given
      text: 'a counting filter NewCounting(16, 3) with all counters at zero'
    - kw: When
      text: '"cat" is added, whose indices are 7, 14, and 5'
    - kw: Then
      text: 'counters 5, 7, and 14 each read 1 and all others read 0'
    - kw: And
      text: 'Contains("cat") is true (all three counters exceed zero) while Contains("dog") is false'
code:
  lang: go
  source: |
    type Counting struct {
      counts []uint8
      m, k   int
    }
    func NewCounting(m, k int) *Counting { return &Counting{counts: make([]uint8, m), m: m, k: k} }
    func (f *Counting) Add(data []byte) { /* increment each of the k indices */ }
    func (f *Counting) Contains(data []byte) bool { /* true if all k counts > 0 */ }
checkpoint: Your counting filter records items in per-slot counters. Commit and stop here.
---

The plain Bloom filter has no `Delete`, and for a good reason: a bit might be set by several items at once, so clearing it to remove one item would silently remove the others too. The **counting Bloom filter** trades a little more space for the ability to delete. Instead of one bit per slot it keeps a small **counter**, and `Add` increments the `k` counters rather than just setting bits.

`Contains` follows the same "all `k` must agree" rule as before, now phrased over counters: an item is possibly present only if every one of its `k` counters is above zero. With a single `"cat"` added, its three counters sit at `1` and membership works exactly like the bit version. The payoff arrives next lesson, when a nonzero counter lets us subtract an item back out without disturbing its neighbours.
