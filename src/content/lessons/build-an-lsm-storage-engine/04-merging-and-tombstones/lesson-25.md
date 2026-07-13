---
project: build-an-lsm-storage-engine
lesson: 25
title: Scanning across every source
overview: Point lookups already span the whole store; now range scans must too. Today you build DB.Scan by merging the memtable and every SSTable into one bounded, newest-wins stream.
goal: Return a bounded range scan over the memtable and all SSTables as one ordered, newest-wins stream.
spec:
  scenario: A range scan across memory and disk
  status: failing
  lines:
    - kw: Given
      text: 'a store where Put("apple","red"),Put("cherry","dark") were flushed to an SSTable, then Put("apple","green"),Put("banana","yellow") are in the memtable'
    - kw: When
      text: 'Scan over ["apple","zzz") is walked to the end'
    - kw: Then
      text: 'it yields ("apple","green"), ("banana","yellow"), ("cherry","dark") in key order'
    - kw: And
      text: '"apple" appears once with the newer "green" (not the flushed "red"), and the scan stays within the [start, end) bounds'
code:
  lang: go
  source: |
    func (d *DB) Scan(start, end string) Iterator {
      // sources newest-first: memtable.Scan(start,end), then each
      //   SSTable.ScanFrom(start)
      // Merge(...) with newest-wins (lesson 22), then bound the merged
      //   stream to end (exclusive)
    }
checkpoint: One Scan reads the memtable and every SSTable as a single ordered, newest-wins stream. Commit and stop here.
---

Point lookups already walk the whole store; a range scan has to do the same, but as
a single ordered *stream*. `Scan` assembles it from the pieces you have built:
a bounded memtable cursor (lesson 4), a seekable cursor per SSTable (lesson 17),
combined by the newest-wins **merge iterator** (lesson 22) with the sources passed
newest-first (memtable, then SSTables by age). A final bound stops the stream at
`end` (exclusive).

The result is the illusion an LSM engine sells: the caller sees one simple sorted
map, while underneath the data is scattered across memory and many immutable files
with old versions threaded through it. Because the merge is newest-wins, a key
updated after a flush shows its current value exactly once. One kind of entry still
leaks through, though - a **tombstone** for a deleted key surfaces in the stream as
if it were live data. Making the scan honor deletes is the very next step.
