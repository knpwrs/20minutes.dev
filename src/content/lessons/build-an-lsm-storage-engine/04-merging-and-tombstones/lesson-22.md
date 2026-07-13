---
project: build-an-lsm-storage-engine
lesson: 22
title: Newest wins in the merge
overview: When the same key sits in two sources, the merge must emit only the newer one. Today you teach the merge iterator to collapse duplicate keys, keeping the value from the source ranked newest.
goal: Make the merge iterator yield each key once, using the value from the newest source.
spec:
  scenario: Collapsing a duplicate key to its newest value
  status: failing
  lines:
    - kw: Given
      text: 'a newer source with ("apple","green") and an older source with ("apple","red") and ("banana","yellow"), merged with the newer ranked first'
    - kw: When
      text: the merged iterator is walked to the end
    - kw: Then
      text: 'it yields "apple" once with value "green" (the newer), then "banana" with "yellow"'
    - kw: And
      text: 'the older "apple" -> "red" is skipped entirely, never surfacing as a second "apple"'
code:
  lang: go
  source: |
    // when several sources share the smallest key, emit the value
    // from the highest-ranked (newest) one, then advance ALL of them
    // past that key so the duplicates are consumed, not re-emitted.
    // pass sources to Merge already ordered newest-first.
checkpoint: The merge iterator emits each key once, taking the newest source's value. Commit and stop here.
---

The merge is where **newest-wins** becomes a scan-time rule, not just a
lookup-time one. When two or more cursors sit on the same key, they represent the
same key written at different times; the merge must emit it **once**, with the
value from the source ranked newest, and then advance *every* cursor past that key
so the stale copies are consumed rather than re-emitted as phantom duplicates.

This is the range-scan counterpart of lesson 20's first-hit lookup, and it depends
on passing sources to the merge in **newest-first** order (memtable, then SSTables
by age). With this, a full-store scan reads correctly across any number of
overlapping tables. One case still slips through, though: a key that was *deleted*.
There is no value to skip for a deletion - you need a marker that says "this key is
gone", which is the tombstone you reserved a slot for back in lesson 6.
