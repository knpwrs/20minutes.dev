---
project: build-an-lsm-storage-engine
lesson: 26
title: Dropping deletes from the scan
overview: The whole-store scan still surfaces deleted keys as if they were live. Today you make it skip tombstones, completing the read side - point lookups and range scans both honor recency and deletion.
goal: Make the whole-store Scan omit any key whose newest entry is a tombstone.
spec:
  scenario: A range scan hides deleted keys
  status: failing
  lines:
    - kw: Given
      text: 'a store where Put("apple","red"),Put("cherry","dark") were flushed, then Put("apple","green"),Put("banana","yellow"),Delete("cherry") are in the memtable'
    - kw: When
      text: 'Scan over ["apple","zzz") is walked to the end'
    - kw: Then
      text: 'it yields ("apple","green") then ("banana","yellow") and nothing else'
    - kw: And
      text: '"cherry" is absent (its newest entry is a tombstone) while "apple" still appears once with the newer "green"'
code:
  lang: go
  source: |
    // wrap the newest-wins merged iterator (lesson 25) in a filter
    // that skips any entry whose kind is Delete - the merge already
    // collapsed each key to its newest entry, so a tombstone at the
    // top means the key is gone.
checkpoint: The whole-store Scan omits deleted keys - the read path is complete. Commit and stop here.
---

The merged scan from last lesson collapses each key to its **newest** entry, but it
still emits that entry even when it is a **tombstone** - so a deleted key shows up in
range results as phantom data. The fix mirrors the point-read rule from lesson 24:
after the merge has picked the newest entry for a key, **skip** it if that entry is a
`Delete`. A thin filter wrapped around the merged iterator does exactly this.

With that, the engine's reads are *complete*. Point lookups and range scans both
honor recency (newest value wins) and deletion (tombstones hide older values),
across the memtable and any number of overlapping SSTables. The reader now presents
a clean, live, sorted key-value view no matter how scattered the storage underneath.
What remains is housekeeping: **compaction** to stop the file count and the shadowed
old versions from growing without bound, and **bloom filters** to let lookups skip
files that cannot hold a key.
