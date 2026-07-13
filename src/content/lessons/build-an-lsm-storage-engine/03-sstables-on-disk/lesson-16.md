---
project: build-an-lsm-storage-engine
lesson: 16
title: Lookup through the index
overview: With the index sitting in the file, point lookups can stop scanning from the top. Today you decode the index into memory and binary-search it, so Get jumps straight to a key's record - the same answers as lesson 14, far less reading.
goal: Decode the index and use it to look a key up by binary search, reading only its record.
spec:
  scenario: Finding a key via the decoded index
  status: failing
  lines:
    - kw: Given
      text: 'an SSTable (with the index and footer from lesson 15) holding ("apple","red"), ("banana","yellow"), ("cherry","dark")'
    - kw: When
      text: the index is decoded and Get("cherry") is called
    - kw: Then
      text: 'the decoded index maps "apple" to offset 0 and each later key to its record''s increasing offset, and binary-searching it to "cherry" reads that one record and returns "dark"'
    - kw: And
      text: 'Get("date") finds no index entry and returns not-found without reading any record'
code:
  lang: go
  source: |
    // on open, decode the index section into a sorted []indexEntry
    // {key, offset}. Get: binary-search it (sort.Search) for the key.
    //   hit  -> seek to its offset, decode that one record, return value
    //   miss -> not-found, no record read at all
    func (s *SSTable) Get(key string) ([]byte, bool) { /* index path */ }
checkpoint: SSTable lookups go through the index - one record read on a hit, none on a miss. Commit and stop here.
---

Now the index earns its keep. Decoded into a sorted list of `{key, offset}` pairs,
it turns a lookup into a **binary search**: find any key (or prove its absence) in a
handful of comparisons instead of a linear walk. On a hit you get the exact byte
offset of the record and read just that one; on a miss you never touch the data
section at all.

The behavior is identical to lesson 14's scan - same values, same not-found - which
is the whole point: an index is a **performance** change, not a semantic one. Your
lesson-14 tests should still pass unchanged. This is the read primitive real engines
use, minus one refinement (a *sparse* index that stores every Nth key to save
space); a dense index is simpler and correct, and the trade-off is a natural
extension noted for later.
