---
project: build-a-bloom-filter
lesson: 1
title: The bit array
overview: A Bloom filter is, underneath, a big array of single bits with hashing bolted on top. Today you build that array - create it with a fixed number of bits, set an individual bit, and read whether a bit is set.
goal: Create a bit array of a fixed number of bits, set one bit, and read whether a given bit is set.
spec:
  scenario: A fresh bit array sets and reads individual bits
  status: failing
  lines:
    - kw: Given
      text: 'a new bit array created with NewBits(16), where every bit starts clear'
    - kw: When
      text: 'bit 3 is set'
    - kw: Then
      text: 'Get(3) is true and Get(4) is false'
    - kw: And
      text: 'every index from 0 to 15 other than 3 reads false'
code:
  lang: go
  source: |
    // pack the bits into words; bit i lives in word i/64 at position i%64
    type Bits struct{ words []uint64 }
    func NewBits(m int) *Bits { return &Bits{words: make([]uint64, (m+63)/64)} }
    func (b *Bits) Set(i int) { b.words[i/64] |= 1 << (uint(i) % 64) }
    func (b *Bits) Get(i int) bool { return b.words[i/64]>>(uint(i)%64)&1 == 1 }
checkpoint: You have a fixed-size bit array that sets and reads individual bits. Commit and stop here.
---

Every sketch in this project rests on the same humble structure: a fixed array of **bits**, each one either set or clear. A Bloom filter is exactly this array plus a rule for which bits an item touches. Storing one bit per slot instead of a whole key is where all the space savings come from, so getting the array right - create it at a chosen size, flip one bit, read one bit - is the whole foundation.

The only wrinkle is packing: most languages have no single-bit type, so we store the bits inside machine **words** and address bit `i` as position `i % 64` inside word `i / 64`. That detail stays hidden behind `Set` and `Get`; the rest of the project only ever asks "is bit `i` set?" Keep this deliberately small today - the array does nothing clever yet.
