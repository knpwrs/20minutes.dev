---
project: build-an-lsm-storage-engine
lesson: 40
title: 'Capstone: proving crash-safety'
overview: The final lesson puts the whole engine on trial. You write a batch, simulate a crash with no clean close, leave a torn SSTable behind, then reopen the directory and prove that every committed key survived and the torn file was ignored.
goal: Simulate a crash after committed writes and a torn flush, reopen, and prove no committed data is lost.
spec:
  scenario: Full crash-recovery of a real store
  status: failing
  lines:
    - kw: Given
      text: 'a store exercised across all three durability paths - an earlier Put flushed to a real SSTable, a plain Put that stayed only in the WAL, and a committed batch of Put("apple","red"),Put("banana","yellow"),Put("cherry","dark") - plus a later flush that left a truncated "000009.sst" (footer cut off), all with NO clean Close'
    - kw: When
      text: a new store is opened on the same directory (the crash)
    - kw: Then
      text: 'Get returns the correct value for every committed key across all three paths (the flushed SSTable, the WAL-only Put, and the batch "red"/"yellow"/"dark") - every acknowledged write survived via WAL replay plus SSTable discovery'
    - kw: And
      text: 'the torn "000009.sst" is skipped, Open succeeds, and a Scan over ["a","z") lists exactly the surviving live keys in sorted order'
code:
  lang: go
  source: |
    // 1. Open(dir); WriteBatch(3 keys); (optionally trigger a flush)
    // 2. corrupt: truncate the newest .sst mid-file to fake a torn flush
    // 3. DROP the handle - no Close, no cleanup (this is the crash)
    // 4. Open(dir) again -> replay recovers the batch, torn .sst skipped
    // 5. assert all committed keys present, torn table gone, Scan sorted
checkpoint: Your engine loses nothing committed across a crash and ignores a torn SSTable. The project is complete - commit and stop here.
---

This is the promise the whole project was built to keep. The test does what a real
crash does: commits writes through the durable path, leaves a **torn SSTable**
behind from an interrupted flush, and then walks away from the store with **no
clean close** - no flush, no cleanup, nothing. Reopening the directory is the
moment of truth, and it leans on everything you built: WAL append-and-fsync makes
the batch durable, atomic rename plus footer validation makes the torn table
skippable, and replay rebuilds the memtable from the log.

The result is a store where **every acknowledged write survives** and a
half-finished flush costs nothing committed - the defining property of a crash-safe
storage engine. From a sorted in-memory map you have built a real LSM engine: a
fsynced write-ahead log, immutable indexed SSTables, merge-iterator reads with
newest-wins and tombstones, leveled compaction, and bloom filters, all behind a
small durable API. That is the honest core every production key-value store - from
LevelDB to RocksDB - is built around.
