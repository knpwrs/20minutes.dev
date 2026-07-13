---
project: build-an-lsm-storage-engine
lesson: 9
title: A store that survives a crash
overview: Now the pieces connect into the engine's central promise. Today you route every Put through the log and replay the log on open - then prove that a store which is never cleanly closed still comes back with all its data.
goal: Make Put durable via the WAL and Open recover the memtable from it, surviving an unclean shutdown.
spec:
  scenario: Recovering committed writes after a crash
  status: failing
  lines:
    - kw: Given
      text: 'a store opened on directory "db" where Put("apple","red") and Put("banana","yellow") were called and each returned'
    - kw: When
      text: the process is abandoned WITHOUT any clean close, and a new store is opened on the same directory
    - kw: Then
      text: 'Get("apple") returns "red" and Get("banana") returns "yellow"'
    - kw: And
      text: 'a key that was never written, Get("cherry"), reports not-found'
code:
  lang: go
  source: |
    func Open(dir string) (*DB, error) {
      // 1. new empty memtable
      // 2. Replay(dir+"/wal.log", memtable)  -- recover prior writes
      // 3. open the WAL for appending new writes
    }
    func (d *DB) Put(key string, value []byte) error {
      // WAL.Append FIRST (durable), THEN memtable.Put
    }
checkpoint: A store recovers every acknowledged write after an unclean shutdown, purely by replaying its log. Commit and stop here.
---

This is the walking skeleton becoming **crash-safe**. `Open` replays the log into
a fresh memtable, so a store always starts as whatever the log says it should be.
`Put` appends to the log *and fsyncs* before updating the memtable - the
**write-ahead** discipline - so the durable record of a write always exists before
the write is considered done.

The test simulates a crash the blunt way: it just walks away from the first store
without closing it - no flush, no cleanup - and opens a second one on the same
directory. Because every acknowledged `Put` is already fsynced into the log, the
second store rebuilds the exact same memtable by replaying it. Nothing committed
is lost. That is the property the rest of the project has to *preserve* as it adds
SSTables, compaction, and everything else on top.
