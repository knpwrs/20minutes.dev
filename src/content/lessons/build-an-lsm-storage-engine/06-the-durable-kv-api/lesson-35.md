---
project: build-an-lsm-storage-engine
lesson: 35
title: Reopening a populated store
overview: Recovery so far only replays the WAL, but real data lives in SSTables too. Today you make Open rediscover the SSTable files already in the directory, so a store reopens with all its flushed data, not just its log.
goal: Make Open load existing SSTable files from the directory and replay the WAL on top.
spec:
  scenario: Reopening a store that has flushed SSTables
  status: failing
  lines:
    - kw: Given
      text: 'a directory where earlier a store flushed Put("apple","red") into an SSTable and then Put("banana","yellow") is still only in the WAL'
    - kw: When
      text: a fresh store is opened on that directory
    - kw: Then
      text: 'Get("apple") returns "red" (from the discovered SSTable) and Get("banana") returns "yellow" (from replaying the WAL)'
    - kw: And
      text: the SSTables are loaded in the correct age order by file number (newest-first), so newer flushes shadow older ones
code:
  lang: go
  source: |
    func Open(dir string) (*DB, error) {
      // 1. list *.sst files, sort by their numeric name (age order)
      // 2. open each (load index + bloom); hold them newest-first (highest file
      //    number first) so precedence matches the in-memory invariant
      // 3. replay wal.log into a fresh memtable ON TOP (newest)
    }
checkpoint: Open reconstructs the full store - SSTables plus WAL - from a directory. Commit and stop here.
---

Durable recovery means rebuilding the store's *entire* state from what's on disk,
and that state is split in two: the **SSTables** (flushed, older data) and the
**WAL** (writes since the last flush, newest data). So `Open` does both - discover
and load every `.sst` file, then replay the log on top of them, exactly matching
the newest-first ordering reads depend on.

The file numbers you assigned at flush time (`000001.sst`, `000002.sst`) are what
make this work without a separate catalog: sorting filenames numerically
reconstructs the age order. (A production engine records the file set and their
levels in a **manifest** for atomicity across compactions - and to know which files
a compaction made obsolete so they can be deleted; filename ordering is the honest
simpler version, so after a compaction the merged-away inputs linger as harmless
orphan files until you add that bookkeeping.) A store can now
be closed and reopened with nothing lost - the durability guarantee now spans both
memory and disk.
