---
project: build-an-lsm-storage-engine
lesson: 32
title: A bloom filter per SSTable
overview: Point lookups still probe tables that don't hold the key. A bloom filter is a tiny bitset that can say "definitely not here" fast. Today you build one over an SSTable's keys, with the guarantee that it never misses a key that is present.
goal: Build a bloom filter over an SSTable's keys that reports no false negatives.
spec:
  scenario: A bloom filter never denies a present key
  status: failing
  lines:
    - kw: Given
      text: 'a bloom filter built from the keys "apple","banana","cherry"'
    - kw: When
      text: MayContain is asked about each of those keys and about "date"
    - kw: Then
      text: 'it returns true for "apple","banana","cherry" (every present key - no false negatives)'
    - kw: And
      text: 'it returns false for "date" (a true negative; an occasional false positive is allowed, a false negative never is)'
code:
  lang: go
  source: |
    // a bitset + k hash functions. Add(key): set k bits.
    // MayContain(key): true only if ALL k bits are set.
    // derive k hashes cheaply from two base hashes: h1 + i*h2.
    // present keys set their bits, so they can never report false.
    func (b *Bloom) Add(key string); func (b *Bloom) MayContain(key string) bool
checkpoint: A bloom filter answers membership with no false negatives. Commit and stop here.
---

A **bloom filter** is a compact probabilistic set: a bitset plus a few hash
functions. Adding a key sets the bits its hashes point to; testing a key checks
whether **all** those bits are set. The magic is the one-sided guarantee - if a key
was added, its bits are set, so `MayContain` can **never** wrongly say no. A "false
positive" (bits set by other keys) is possible and harmless; a **false negative**
is impossible, which is exactly the property a lookup shortcut needs.

That guarantee is what makes it safe to *skip* a table on a definite-no. Building
one filter per SSTable over its keys - a handful of bits per key - lets a point
lookup ask each table "could you possibly have this?" and skip the ones that say
no, without ever risking a wrong miss. Today builds and tests the filter in
isolation; next lesson wires it into the read path.
