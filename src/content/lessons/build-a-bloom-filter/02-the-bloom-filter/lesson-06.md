---
project: build-a-bloom-filter
lesson: 6
title: Add sets k bits
overview: Now the Bloom filter itself. Adding an item sets the k bits at its double-hash indices - that single move is the entire write path, and everything else reads from it.
goal: Build a Bloom filter of m bits and k hashes whose Add sets the k bits for an item.
spec:
  scenario: Adding an item sets exactly its k bits
  status: failing
  lines:
    - kw: Given
      text: 'a Bloom filter created with NewBloom(32, 3), with all bits clear'
    - kw: When
      text: '"cat" is added'
    - kw: Then
      text: 'exactly bits 7, 21, and 30 are set, so the set-bit count is 3'
    - kw: And
      text: 'adding "cat" a second time sets no new bits - the count stays 3'
code:
  lang: go
  source: |
    type Bloom struct {
      bits *Bits
      m, k int
    }
    func NewBloom(m, k int) *Bloom { return &Bloom{bits: NewBits(m), m: m, k: k} }
    func (f *Bloom) Add(data []byte) {
      // set each of the k double-hash indices
    }
checkpoint: Your Bloom filter records an item by setting its k bits. Commit and stop here.
---

A **Bloom filter** is just the bit array from the last chapter plus the double-hash rule, wrapped together with its two parameters: `m`, the number of bits, and `k`, the number of hash positions per item. `Add` is the whole write side - compute the `k` indices for the item and set each of those bits. Nothing records *which* item was added, only that *some* item lit those bits, and that is exactly why the filter is so small.

Adding the same item twice is a no-op on the second try: the bits are already set, so setting them again changes nothing. That idempotence is worth pinning now because it is what lets many items share the array - each just contributes its handful of set bits, and collisions between items are expected rather than exceptional. The indices `7, 21, 30` are `"cat"`'s three positions from the previous lesson, now written into the filter.
