---
project: build-a-bloom-filter
lesson: 20
title: Pick a register
overview: A HyperLogLog answers a third question - how many distinct items did the stream hold? It splits the hash into two parts; the first part chooses which register to update. Today you build that register selection.
goal: Use the top p bits of an item's hash to select one of 2 to the p registers.
spec:
  scenario: The high bits of the hash choose a register
  status: failing
  lines:
    - kw: Given
      text: 'p = 4, giving 16 registers, where the register index is the top 4 bits of the 64-bit Hash1'
    - kw: When
      text: 'the register for "cat" is computed (Hash1("cat") is 0xf5e307190ce4a327, whose top 4 bits are 1111)'
    - kw: Then
      text: 'it is 15'
    - kw: And
      text: 'the register for "the" is 5 and the register for "dog" is 12'
code:
  lang: go
  source: |
    type HLL struct {
      registers []uint8
      p         uint // number of index bits
    }
    func NewHLL(p uint) *HLL { return &HLL{registers: make([]uint8, 1<<p), p: p} }
    func (h *HLL) register(x uint64) int { return int(x >> (64 - h.p)) } // top p bits
checkpoint: Your HyperLogLog routes each item to a register by its high bits. Commit and stop here.
---

**HyperLogLog** estimates *cardinality* - the count of distinct items - in a few hundred bytes no matter how many items stream past. The trick starts by hashing each item and slicing the 64-bit hash into two fields. The **top `p` bits** pick one of `2^p` **registers**; the rest of the bits will feed a measurement in the next lesson. With `p = 4` there are `16` registers, and an item's register is simply its hash shifted right by `64 - p`.

Using the hash's high bits to bucket items means the same item always lands in the same register, and distinct items scatter roughly evenly across all of them. Each register will summarize the items that fell into it, and combining the registers at the end yields the estimate. Today is just the routing - which register does an item belong to.
