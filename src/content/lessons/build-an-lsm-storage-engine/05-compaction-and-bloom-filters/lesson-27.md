---
project: build-an-lsm-storage-engine
lesson: 27
title: Compacting SSTables
overview: 'Flushes pile up SSTables forever unless something merges them back down. Today you write the core of compaction: merge several SSTables into one new file, keeping the newest version of each key.'
goal: Merge SSTables into a single new SSTable, collapsing each key to its newest value.
spec:
  scenario: Merging SSTables and keeping the newest version
  status: failing
  lines:
    - kw: Given
      text: 'a newer SSTable with ("apple","green") and an older SSTable with ("apple","red"),("banana","yellow")'
    - kw: When
      text: they are compacted (newer ranked first) into a new SSTable Z
    - kw: Then
      text: 'Z contains "apple" once with value "green" (the newest) and "banana" with "yellow", in sorted order'
    - kw: And
      text: 'the stale "apple" -> "red" is gone from Z, and Z is a normal SSTable with its own index and footer, readable like any other'
code:
  lang: go
  source: |
    func Compact(inputs []*SSTable, outPath string) error {
      // Merge(iterators of inputs, NEWEST-FIRST), then stream the
      // merged records into WriteSSTable. Merge already collapses a
      // duplicate key to its newest source (lesson 22), so passing
      // inputs newest-first drops the shadowed versions for free.
    }
checkpoint: SSTables merge into one well-formed SSTable, keeping each key's newest value. Commit and stop here.
---

**Compaction** is the "merge" in log-structured *merge*-tree. Left alone, flushes
produce an ever-growing pile of small SSTables, every read has to consult all of
them, and a hot key rewritten many times leaves a stale copy in every table it
touched. Compaction fixes all of that by combining tables into one, periodically,
in the background. The machinery is almost entirely reuse: the **merge iterator**
already reads multiple sorted sources as one ordered stream *and* collapses each key
to its newest source, so passing the inputs **newest-first** makes compaction keep
the current value and drop the shadowed ones for free.

The output is a new, complete SSTable - index, footer, and all - indistinguishable
from a flushed table to every reader. This is where an LSM engine's disk usage stops
tracking the number of *writes* and starts tracking the number of *distinct live
keys*. One thing compaction still can't safely throw away yet is a **tombstone**: a
delete marker has to outlive every value it shadows, so dropping it needs care - that
is the lesson after next.
