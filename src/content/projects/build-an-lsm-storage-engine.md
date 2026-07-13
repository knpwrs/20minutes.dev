---
title: 'Build an LSM Storage Engine'
order: 10
lessons: 40
size: 'Medium'
tech: ['LSM tree', 'SSTables', 'Write-ahead log']
estMin: 20
desc: 'Build a crash-safe, ordered key-value store on a log-structured merge tree: a fsync''d write-ahead log, immutable SSTables, merged reads, compaction, and recovery that loses nothing committed.'
blurb: 'Start with a sorted in-memory memtable and end with a durable embedded key-value store that survives a crash mid-write. Every lesson gives you a concrete spec to hit, and the engine grows one durable piece at a time - WAL, SSTables, merge iterators, tombstones, compaction, bloom filters.'
overview: |
  Over 40 lessons you build a working LSM storage engine from scratch: the sorted in-memory memtable that absorbs writes, a write-ahead log that fsyncs every write to disk and replays on open so nothing committed is ever lost, immutable on-disk SSTables with a sparse index, a merge iterator that reads across many files returning the newest value per key, tombstone deletes, leveled compaction, and bloom filters.

  By the end you have an embedded, crash-safe key-value store you import as a library - Open, Get, Put, Delete, Scan, Close - that keeps keys in sorted order, survives a process crash mid-write by replaying its log, and ignores a torn half-written SSTable left behind by that crash. The capstone writes a batch, kills the process without a clean close, reopens the directory, and proves every committed key is still there.

  This is a teaching-grade engine built around the real LSM design: it is correct and durable, but it stops short of what a production store like RocksDB adds on top - concurrent writers and MVCC snapshots, transactions, block compression, a proper manifest with multi-level compaction policies, and per-block checksums. What you finish with is the honest core all of those systems are built around.
parts:
  - name: 'The memtable'
    count: 5
  - name: 'The write-ahead log'
    count: 6
  - name: 'SSTables on disk'
    count: 8
  - name: 'Merging & tombstones'
    count: 7
  - name: 'Compaction & bloom filters'
    count: 7
  - name: 'The durable KV API'
    count: 7
caveats:
  note: 'A genuinely crash-safe embedded ordered KV store - proven by tests for WAL replay, atomic SSTable creation, torn-file skip, and atomic batches, with compaction now reclaiming its inputs - but single-threaded and manifest-free, so it is a teaching-grade engine rather than a production database.'
  future:
    - 'Add a manifest / version-set so the live file set and per-level layout are crash-atomic and restored exactly on Open'
    - 'Add a read/write lock and MVCC snapshots for safe concurrency and point-in-time scans'
    - 'Extend to L2+ leveling with a tunable compaction policy to bound read/space amplification'
    - 'Add a block cache and/or mmap-backed reads so large tables are not loaded whole into RAM'
    - 'Support range deletes via range tombstones instead of one tombstone per key'
    - 'Separate large values into a key-value log so compaction rewrites keys, not big payloads'
resources:
  - title: 'Designing Data-Intensive Applications'
    author: 'Martin Kleppmann'
    url: 'https://dataintensive.net/'
    note: 'Chapter 3 walks the exact SSTable + LSM-tree storage engine this project builds, and why a write-ahead log makes it crash-safe.'
  - title: 'Database Internals'
    author: 'Alex Petrov'
    note: 'A deep tour of LSM-tree storage: memtables, SSTables, compaction strategies, and the durability machinery - the reference textbook for everything here.'
  - title: 'The Log-Structured Merge-Tree (LSM-Tree)'
    author: 'Patrick O''Neil, Edward Cheng, Dieter Gawlick, Elizabeth O''Neil'
    url: 'https://www.cs.umb.edu/~poneil/lsmtree.pdf'
    note: 'The original 1996 paper that introduced the LSM-tree - the source of the design you are implementing.'
  - title: 'LevelDB Implementation Notes'
    author: 'Google'
    url: 'https://github.com/google/leveldb/blob/main/doc/impl.md'
    note: 'How a real LSM engine lays out its files, log, and levels - the concrete production counterpart to this project.'
  - title: 'LSM in a Week (mini-lsm)'
    author: 'Alex Chi'
    url: 'https://skyzh.github.io/mini-lsm/'
    note: 'A hands-on build-your-own LSM tutorial that mirrors this project''s arc - useful for a second pass or deeper dives on compaction.'
---
