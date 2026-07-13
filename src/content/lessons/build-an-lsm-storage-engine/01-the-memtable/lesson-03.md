---
project: build-an-lsm-storage-engine
lesson: 3
title: An iterator over sorted keys
overview: Reads in an LSM engine are streams, not single lookups - you walk keys in order across memory and many files. Today you introduce the Iterator, one cursor abstraction the memtable and every future SSTable will share.
goal: Expose an iterator that walks the memtable's entries in ascending key order.
spec:
  scenario: Iterating the memtable in key order
  status: failing
  lines:
    - kw: Given
      text: 'a memtable holding Put("cherry",...), Put("apple",...), Put("banana",...)'
    - kw: When
      text: an iterator is created and advanced from the start to the end
    - kw: Then
      text: 'it yields keys "apple", "banana", "cherry" in that order'
    - kw: And
      text: 'once past the last entry the iterator reports it is no longer valid'
code:
  lang: go
  source: |
    // one cursor shape the whole engine reuses
    type Iterator interface {
      Valid() bool      // is the cursor on a live entry?
      Key() string
      Value() []byte
      Next()            // advance one entry
    }
    // the memtable's iterator is just an index into the sorted slice
checkpoint: A shared Iterator walks the memtable in sorted order and knows when it is exhausted. Commit and stop here.
---

Every read path in an LSM engine is a **merge of sorted cursors**: the memtable's
entries, plus one cursor per on-disk file, walked together in key order. So the
cursor itself needs to be an abstraction, not a memtable-specific loop. Today's
**Iterator** - `Valid`, `Key`, `Value`, `Next` - is that shared shape.

Because the memtable already stores entries sorted, its iterator is trivial: a
position that starts at the first entry and advances one at a time, becoming
**invalid** when it runs off the end. Defining the interface now, with the
simplest possible implementor, means the SSTable reader and the merge iterator
you build later all speak the same language and snap together without adapters.
