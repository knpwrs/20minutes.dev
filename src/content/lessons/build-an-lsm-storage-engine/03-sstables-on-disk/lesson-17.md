---
project: build-an-lsm-storage-engine
lesson: 17
title: Ranged SSTable scans
overview: The memtable can scan a key range; an SSTable must too, so range queries work over on-disk data. Today you use the index to seek an SSTable iterator to a start key, giving the same bounded scan across files.
goal: Start an SSTable iterator at the first key >= a given start key.
spec:
  scenario: Seeking an SSTable iterator to a range start
  status: failing
  lines:
    - kw: Given
      text: 'an SSTable with keys "apple", "banana", "cherry", "date", "fig"'
    - kw: When
      text: 'an iterator is opened seeking to start = "cherry"'
    - kw: Then
      text: 'the first key it yields is "cherry", then "date", then "fig"'
    - kw: And
      text: 'seeking to start = "coconut" (absent) yields the first key greater than it: "date"'
code:
  lang: go
  source: |
    // binary-search the index for the first key >= start, then set
    // the iterator's cursor to that record's offset. From there Next()
    // walks forward exactly like the full-file iterator.
    func (s *SSTable) ScanFrom(start string) Iterator { /* ... */ }
checkpoint: An SSTable iterator can seek to any start key, matching the memtable's scan. Commit and stop here.
---

Range scans across the store will merge the memtable's cursor with one cursor per
SSTable, all positioned at the same start key. So an SSTable iterator needs the
same **seek** the memtable got in lesson 4: jump to the first key at or after
`start` and walk forward from there.

The index makes the seek cheap - binary-search it for the first key `>= start` and
set the cursor to that record's offset. Note the "absent start" case: seeking to a
key that isn't present lands on the next key *after* it, never skipping data. Now
both kinds of source - in-memory and on-disk - present an identical seekable,
sorted cursor, which is the last thing the merge iterator needs before it can read
across all of them at once.
