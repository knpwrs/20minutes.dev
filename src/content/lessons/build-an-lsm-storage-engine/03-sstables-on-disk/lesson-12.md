---
project: build-an-lsm-storage-engine
lesson: 12
title: Writing an SSTable
overview: The memtable's data has to become a permanent file. Today you write an SSTable - a Sorted String Table - by serializing sorted records to disk as one immutable, append-only file.
goal: Write a sequence of sorted records to an SSTable file on disk.
spec:
  scenario: Writing sorted entries to an SSTable file
  status: failing
  lines:
    - kw: Given
      text: 'sorted entries ("apple","red"), ("banana","yellow"), ("cherry","dark")'
    - kw: When
      text: 'they are written to an SSTable file "000001.sst"'
    - kw: Then
      text: the file exists and contains the three records encoded in key order
    - kw: And
      text: reading the raw file back and decoding it yields the three records in that same order
code:
  lang: go
  source: |
    // reuse encodeRecord from the WAL - same record format on disk.
    // take the sorted data as an Iterator (from lesson 3), so a flush
    // can pass a memtable iterator and a compaction a merge iterator:
    func WriteSSTable(path string, it Iterator) error {
      // walk it in order, write each record, fsync, close
    }
    // the file is IMMUTABLE once written: never appended to or edited
checkpoint: Sorted entries are persisted to an immutable SSTable file. Commit and stop here.
---

An **SSTable** is the on-disk half of an LSM engine: a file of records **sorted by
key** and never modified after it is written. Its immutability is the source of the
whole design's simplicity - readers never need locks, files can be merged in the
background, and a half-written file (from a crash) is simply discarded rather than
repaired.

Today you write one. The records use the **same encoding as the WAL**, because a
record is a record wherever it lives - reusing the format means the SSTable reader
you write next is nearly free. The entries arrive already sorted (they will come
from the sorted memtable), so writing is just a sequential dump followed by an
fsync. From here the file is frozen; everything else you do to it is read-only.
