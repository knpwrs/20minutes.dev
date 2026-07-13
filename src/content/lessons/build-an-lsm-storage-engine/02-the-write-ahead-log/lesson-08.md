---
project: build-an-lsm-storage-engine
lesson: 8
title: Replaying the log
overview: A log on disk is only useful if you can read it back. Today you replay a WAL file - decode its records in order and apply them to a fresh memtable - which is exactly how the engine will recover after a crash.
goal: Rebuild a memtable by reading every record from a log file in order.
spec:
  scenario: Reconstructing a memtable from the log
  status: failing
  lines:
    - kw: Given
      text: 'a log file holding records (Put,"apple","red"), (Put,"banana","yellow"), (Put,"apple","green") in that order'
    - kw: When
      text: the log is replayed into a new empty memtable
    - kw: Then
      text: 'Get("apple") returns "green" (the later write wins) and Get("banana") returns "yellow"'
    - kw: And
      text: 'the memtable ends with exactly 2 keys'
code:
  lang: go
  source: |
    // read the whole file, then walk it record by record using the
    // "n = bytes consumed" from decodeRecord to find each boundary
    func Replay(path string, m *Memtable) error {
      // a missing log file is an empty log - return nil, not an error
      // (a fresh store opens on a directory with no wal.log yet)
      // for each record: m.Put(key, value)  (Delete handled later)
      // applying in file order means the last write to a key wins,
      // just like it did live
    }
checkpoint: A memtable can be fully reconstructed from the log, with later writes correctly overriding earlier ones. Commit and stop here.
---

**Replay** is recovery in miniature: read the log from the beginning and re-apply
each record to a fresh memtable. Because the log records writes in the exact order
they happened, replaying them in order reproduces the memtable's final state -
including **overwrites**, since a later `Put` to a key lands after the earlier one
and wins, just as it did the first time around.

This is why append-order matters so much in the previous lesson. The log is not a
set of facts, it is a *timeline* of writes; faithfully re-walking that timeline is
what lets the engine come back exactly as it was. Today you replay a hand-made log
file directly; next you will wire replay into the store's startup so it happens
automatically on open.
