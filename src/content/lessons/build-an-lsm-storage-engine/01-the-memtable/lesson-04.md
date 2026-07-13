---
project: build-an-lsm-storage-engine
lesson: 4
title: Bounded range scans
overview: A sorted store's superpower is range queries - "every key from here to there". Today you make the iterator start at a key and stop at a bound, turning the full walk into a windowed scan.
goal: Iterate only the entries whose keys fall in a half-open range [start, end).
spec:
  scenario: Scanning a bounded key range
  status: failing
  lines:
    - kw: Given
      text: 'a memtable with keys "apple", "banana", "cherry", "date", "fig"'
    - kw: When
      text: 'a range scan is created over [start="banana", end="date")'
    - kw: Then
      text: 'it yields "banana" then "cherry" and nothing else'
    - kw: And
      text: 'the end bound "date" is excluded and "apple"/"fig" (outside the range) never appear'
code:
  lang: go
  source: |
    // seek: binary-search to the first key >= start
    // then Valid() is false once the cursor reaches end (exclusive)
    func (m *Memtable) Scan(start, end string) Iterator { /* ... */ }
    // reuse the same Iterator interface; the range just narrows it
checkpoint: The memtable answers half-open range scans in sorted order. Commit and stop here.
---

A **range scan** returns every entry between a start key and an end key, in
order. Because the memtable is sorted, this is just two edges on the full walk:
**seek** to the first key at or after `start`, then stop as soon as the cursor
reaches `end`. Using a **half-open** range `[start, end)` - start included, end
excluded - is the convention every range API here follows, because adjacent
ranges then tile perfectly with no overlap or gap.

Seeking with binary search means a scan touches only the entries it returns, not
the whole table. This same "seek to start, stop at end" shape will reappear on
SSTables, where the seek jumps via an on-disk index instead of a slice offset -
but the behavior the caller sees is identical, which is the point of the shared
iterator.
