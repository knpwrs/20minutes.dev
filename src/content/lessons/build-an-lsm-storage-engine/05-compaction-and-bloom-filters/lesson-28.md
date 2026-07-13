---
project: build-an-lsm-storage-engine
lesson: 28
title: Applying a compaction to the store
overview: A compaction that writes a file but leaves the store untouched has done nothing. Today you make the store swap the compacted SSTable in for its inputs, shrinking the stack while reads return exactly the same answers.
goal: Replace the store's SSTables with their compacted result, keeping Get and Scan correct.
spec:
  scenario: Compaction shrinks the stack without changing reads
  status: failing
  lines:
    - kw: Given
      text: 'a store whose live data is "apple"->"green" and "banana"->"yellow" spread across two SSTables (an older "apple"->"red" shadowed by a newer "apple"->"green")'
    - kw: When
      text: the store compacts its two SSTables into one
    - kw: Then
      text: the store's active stack now holds a single SSTable in place of the two originals
    - kw: And
      text: 'Get("apple") still returns "green", Get("banana") still returns "yellow", and Scan(["a","z")) still yields them in order - reads are unchanged'
code:
  lang: go
  source: |
    func (d *DB) compact() error {
      // Compact(d.sstables newest-first, nextPath) -> new file
      // OpenSSTable it; replace d.sstables with just [that one]
      // (optionally delete the old .sst files). Get/Scan must be
      // identical before and after - compaction is invisible to reads.
    }
checkpoint: Compaction replaces the SSTable stack in place, with reads unchanged. Commit and stop here.
---

Compaction only earns its keep when its output takes the inputs' place in the store.
Today you wire that: compact the current SSTables into one new file, open it, and
**swap** it in for the originals - the stack shrinks from many tables to one, and the
old files can be deleted. Because the inputs were passed newest-first, the merged
table already carries each key's current value, so nothing a reader can observe
changes.

That last part is the invariant to hold onto: **compaction is invisible to reads**. A
`Get` or a `Scan` must return exactly the same result the instant before and after a
compaction - it only rearranges *how* data is stored, never *what* the store
answers. This is easy to verify and easy to get subtly wrong (swap the list
non-atomically, or drop a table still holding a live key). Get it right and the store
can shrink its own footprint safely; the remaining lessons decide *when* to do it and
*what* deletes it can finally discard.
